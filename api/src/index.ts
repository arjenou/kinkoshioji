/**
 * Cloudflare Workers API for Product Management
 * Handles CRUD operations for products stored in R2
 */

export interface Env {
  PRODUCTS_BUCKET: R2Bucket;
  IMAGES_BUCKET: R2Bucket;
  ADMIN_TOKEN: string;
  GMAIL_USER: string; // Gmail 邮箱地址（发送者）
  GMAIL_APP_PASSWORD: string; // Gmail 应用密钥（16位）
  CONTACT_EMAIL: string; // 接收联系表单的邮箱地址
  MAIL_SERVICE_URL: string; // 邮件服务 URL（Gmail SMTP 服务）
}

export interface Product {
  id: string;
  name: string;
  nameJa: string;
  imageUrl: string;
  price: number;
  unit: string; // 'kg' or '台' or '個'
  isNewPrice: boolean;
  order: number; // 排序顺序
  createdAt: string;
  updatedAt: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function handleOptions() {
  return new Response(null, {
    headers: CORS_HEADERS,
  });
}

function jsonResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  });
}

function errorResponse(message: string, status: number = 400) {
  return jsonResponse({ error: message }, status);
}

function checkAuth(request: Request, env: Env): boolean {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return false;
  
  const token = authHeader.replace('Bearer ', '');
  return token === env.ADMIN_TOKEN;
}

async function getProducts(env: Env): Promise<Product[]> {
  try {
    const object = await env.PRODUCTS_BUCKET.get('products.json');
    if (!object) {
      return [];
    }
    const text = await object.text();
    const products = JSON.parse(text);
    // 按 order 字段排序，如果没有 order 则按创建时间排序
    return products.sort((a: Product, b: Product) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

async function saveProducts(products: Product[], env: Env): Promise<void> {
  await env.PRODUCTS_BUCKET.put('products.json', JSON.stringify(products, null, 2));
}

/**
 * Send email using Gmail SMTP via our mail service
 * 直接使用 Gmail 应用密钥通过独立的邮件服务发送
 */
async function sendEmailViaGmailSMTP(
  fromEmail: string,
  toEmail: string,
  replyTo: string,
  subject: string,
  formData: {
    name: string;
    email: string;
    tel?: string;
    company?: string;
    address?: string;
    message: string;
  },
  env: Env
): Promise<{ success: boolean; error?: string }> {
  try {
    // 准备邮件内容
    const emailBody = `
お問い合わせ内容：

お名前: ${formData.name}
メールアドレス: ${formData.email}
電話番号: ${formData.tel || '未入力'}
会社名: ${formData.company || '未入力'}
住所: ${formData.address || '未入力'}

お問い合わせ内容:
${formData.message}

---
このメールは ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} に送信されました。
    `.trim();

    const emailHtml = `
<h2>お問い合わせ内容</h2>
<p><strong>お名前:</strong> ${formData.name}</p>
<p><strong>メールアドレス:</strong> ${formData.email}</p>
<p><strong>電話番号:</strong> ${formData.tel || '未入力'}</p>
<p><strong>会社名:</strong> ${formData.company || '未入力'}</p>
<p><strong>住所:</strong> ${formData.address || '未入力'}</p>
<hr>
<h3>お問い合わせ内容:</h3>
<p>${formData.message.replace(/\n/g, '<br>')}</p>
<hr>
<p><small>このメールは ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} に送信されました。</small></p>
    `.trim();

    // 调用邮件服务（部署在 Vercel 上的邮件服务）
    const mailServiceUrl = env.MAIL_SERVICE_URL || 'https://www.kinkoshioji.co.jp';
    const mailResponse = await fetch(`${mailServiceUrl}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: toEmail,
        replyTo: replyTo,
        subject: subject,
        text: emailBody,
        html: emailHtml,
        formData: formData,
      }),
    });

    if (!mailResponse.ok) {
      const errorText = await mailResponse.text();
      let errorMessage = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorText;
      } catch {
        // Keep original error text
      }
      return { success: false, error: errorMessage };
    }

    const result = await mailResponse.json();
    if (!result.success) {
      return { success: false, error: result.error || 'Email sending failed' };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // GET /api/products - Get all products
    if (request.method === 'GET' && path === '/api/products') {
      const products = await getProducts(env);
      return jsonResponse({ products, updatedAt: new Date().toISOString() });
    }

    // POST /api/products - Create new product
    if (request.method === 'POST' && path === '/api/products') {
      if (!checkAuth(request, env)) {
        return errorResponse('Unauthorized', 401);
      }

      try {
        const data = await request.json();
        const existingProducts = await getProducts(env);
        
        const maxOrder = existingProducts.length > 0 
          ? Math.max(...existingProducts.map(p => p.order || 0))
          : -1;
        
        const newProduct: Product = {
          id: crypto.randomUUID(),
          name: data.name || '',
          nameJa: data.nameJa || '',
          imageUrl: data.imageUrl || '',
          price: data.price || 0,
          unit: data.unit || 'kg',
          isNewPrice: data.isNewPrice || false,
          order: data.order !== undefined ? data.order : maxOrder + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        existingProducts.push(newProduct);
        // 重新排序
        existingProducts.sort((a, b) => (a.order || 0) - (b.order || 0));
        await saveProducts(existingProducts, env);
        
        return jsonResponse({ product: newProduct }, 201);
      } catch (error) {
        return errorResponse('Invalid request body', 400);
      }
    }

    // PUT /api/products/reorder - 批量更新排序顺序
    if (request.method === 'PUT' && path === '/api/products/reorder') {
      if (!checkAuth(request, env)) {
        return errorResponse('Unauthorized', 401);
      }

      try {
        const data = await request.json();
        const { productIds } = data; // 按新顺序排列的商品 ID 数组
        
        if (!Array.isArray(productIds)) {
          return errorResponse('productIds must be an array', 400);
        }

        // 直接读取原始数据（不排序）
        let allProducts: Product[];
        try {
          const object = await env.PRODUCTS_BUCKET.get('products.json');
          if (!object) {
            return errorResponse('No products found', 404);
          }
          const text = await object.text();
          allProducts = JSON.parse(text);
        } catch (error) {
          return errorResponse('Failed to read products', 500);
        }
        
        // 更新每个商品的 order
        const foundIds = new Set<string>();
        productIds.forEach((id: string, index: number) => {
          const product = allProducts.find(p => p.id === id);
          if (product) {
            product.order = index;
            product.updatedAt = new Date().toISOString();
            foundIds.add(id);
          }
        });

        // 为没有在 productIds 中的商品设置默认值（放在最后）
        let maxOrder = productIds.length;
        allProducts.forEach((product) => {
          if (!foundIds.has(product.id)) {
            if (product.order === undefined) {
              product.order = maxOrder++;
            }
          }
        });

        // 重新排序并保存
        allProducts.sort((a, b) => (a.order || 0) - (b.order || 0));
        await saveProducts(allProducts, env);
        
        return jsonResponse({ success: true, products: allProducts });
      } catch (error) {
        console.error('Reorder error:', error);
        return errorResponse('Invalid request body', 400);
      }
    }

    // PUT /api/products/:id - Update product
    if (request.method === 'PUT' && path.startsWith('/api/products/') && path !== '/api/products/reorder') {
      if (!checkAuth(request, env)) {
        return errorResponse('Unauthorized', 401);
      }

      try {
        const productId = path.split('/').pop();
        const data = await request.json();
        const existingProducts = await getProducts(env);
        
        const index = existingProducts.findIndex(p => p.id === productId);
        if (index === -1) {
          return errorResponse('Product not found', 404);
        }

        existingProducts[index] = {
          ...existingProducts[index],
          ...data,
          id: existingProducts[index].id, // Preserve ID
          updatedAt: new Date().toISOString(),
        };

        // 如果更新了 order，需要重新排序
        if (data.order !== undefined) {
          existingProducts.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
        await saveProducts(existingProducts, env);
        return jsonResponse({ product: existingProducts[index] });
      } catch (error) {
        return errorResponse('Invalid request body', 400);
      }
    }

    // PUT /api/products/reorder - 批量更新排序顺序
    if (request.method === 'PUT' && path === '/api/products/reorder') {
      if (!checkAuth(request, env)) {
        return errorResponse('Unauthorized', 401);
      }

      try {
        const data = await request.json();
        const { productIds } = data; // 按新顺序排列的商品 ID 数组
        
        if (!Array.isArray(productIds)) {
          return errorResponse('productIds must be an array', 400);
        }

        // 直接读取原始数据（不排序）
        let allProducts: Product[];
        try {
          const object = await env.PRODUCTS_BUCKET.get('products.json');
          if (!object) {
            return errorResponse('No products found', 404);
          }
          const text = await object.text();
          allProducts = JSON.parse(text);
        } catch (error) {
          return errorResponse('Failed to read products', 500);
        }
        
        // 更新每个商品的 order
        const foundIds = new Set<string>();
        productIds.forEach((id: string, index: number) => {
          const product = allProducts.find(p => p.id === id);
          if (product) {
            product.order = index;
            product.updatedAt = new Date().toISOString();
            foundIds.add(id);
          }
        });

        // 为没有在 productIds 中的商品设置默认值（放在最后）
        let maxOrder = productIds.length;
        allProducts.forEach((product) => {
          if (!foundIds.has(product.id)) {
            if (product.order === undefined) {
              product.order = maxOrder++;
            }
          }
        });

        // 重新排序并保存
        allProducts.sort((a, b) => (a.order || 0) - (b.order || 0));
        await saveProducts(allProducts, env);
        
        return jsonResponse({ success: true, products: allProducts });
      } catch (error) {
        console.error('Reorder error:', error);
        return errorResponse('Invalid request body', 400);
      }
    }

    // PUT /api/products/:id - Update product
    if (request.method === 'PUT' && path.startsWith('/api/products/') && path !== '/api/products/reorder') {
      if (!checkAuth(request, env)) {
        return errorResponse('Unauthorized', 401);
      }

      try {
        const productId = path.split('/').pop();
        const data = await request.json();
        const existingProducts = await getProducts(env);
        
        const index = existingProducts.findIndex(p => p.id === productId);
        if (index === -1) {
          return errorResponse('Product not found', 404);
        }

        existingProducts[index] = {
          ...existingProducts[index],
          ...data,
          id: existingProducts[index].id, // Preserve ID
          updatedAt: new Date().toISOString(),
        };

        // 如果更新了 order，需要重新排序
        if (data.order !== undefined) {
          existingProducts.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
        await saveProducts(existingProducts, env);
        return jsonResponse({ product: existingProducts[index] });
      } catch (error) {
        return errorResponse('Invalid request body', 400);
      }
    }

    // PUT /api/products/:id - Update product（必须在 reorder 之后检查）
    if (request.method === 'PUT' && path.startsWith('/api/products/') && path !== '/api/products/reorder') {
      if (!checkAuth(request, env)) {
        return errorResponse('Unauthorized', 401);
      }

      try {
        const productId = path.split('/').pop();
        const data = await request.json();
        const existingProducts = await getProducts(env);
        
        const index = existingProducts.findIndex(p => p.id === productId);
        if (index === -1) {
          return errorResponse('Product not found', 404);
        }

        existingProducts[index] = {
          ...existingProducts[index],
          ...data,
          id: existingProducts[index].id, // Preserve ID
          updatedAt: new Date().toISOString(),
        };

        // 如果更新了 order，需要重新排序
        if (data.order !== undefined) {
          existingProducts.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
        await saveProducts(existingProducts, env);
        return jsonResponse({ product: existingProducts[index] });
      } catch (error) {
        return errorResponse('Invalid request body', 400);
      }
    }

    // DELETE /api/products/:id - Delete product
    if (request.method === 'DELETE' && path.startsWith('/api/products/')) {
      if (!checkAuth(request, env)) {
        return errorResponse('Unauthorized', 401);
      }

      const productId = path.split('/').pop();
      const existingProducts = await getProducts(env);
      
      const filtered = existingProducts.filter(p => p.id !== productId);
      if (filtered.length === existingProducts.length) {
        return errorResponse('Product not found', 404);
      }

      await saveProducts(filtered, env);
      return jsonResponse({ success: true });
    }

    // POST /api/upload - Upload image
    if (request.method === 'POST' && path === '/api/upload') {
      if (!checkAuth(request, env)) {
        return errorResponse('Unauthorized', 401);
      }

      try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
          return errorResponse('No file provided', 400);
        }

        // Generate unique filename
        const ext = file.name.split('.').pop();
        const filename = `${crypto.randomUUID()}.${ext}`;
        
        // Upload to R2
        await env.IMAGES_BUCKET.put(filename, file.stream(), {
          httpMetadata: {
            contentType: file.type,
          },
        });

        // Return public URL
        // Note: Update this if you're using a custom domain for R2
        const imageUrl = `${url.origin}/api/images/${filename}`;
        
        return jsonResponse({ url: imageUrl, filename });
      } catch (error) {
        console.error('Upload error:', error);
        return errorResponse('Upload failed', 500);
      }
    }

    // GET /api/images/:filename - Serve images
    if (request.method === 'GET' && path.startsWith('/api/images/')) {
      const filename = path.split('/').pop();
      if (!filename) {
        return errorResponse('Filename required', 400);
      }

      const object = await env.IMAGES_BUCKET.get(filename);
      if (!object) {
        return errorResponse('Image not found', 404);
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Cache-Control', 'public, max-age=31536000');

      return new Response(object.body, {
        headers,
      });
    }

    // POST /api/contact - Send contact form email
    if (request.method === 'POST' && path === '/api/contact') {
      try {
        const data = await request.json();
        const { name, email, tel, company, address, message } = data;

        // Validate required fields
        if (!name || !email || !message) {
          return errorResponse('名前、メールアドレス、お問い合わせ内容は必須です', 400);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return errorResponse('有効なメールアドレスを入力してください', 400);
        }

        // Prepare email subject
        const emailSubject = `【お問い合わせ】${name}様からのお問い合わせ`;

        // Send email using Gmail SMTP via our mail service
        // Directly uses Gmail app password
        const emailResponse = await sendEmailViaGmailSMTP(
          env.GMAIL_USER,
          env.CONTACT_EMAIL || env.GMAIL_USER,
          email,
          emailSubject,
          { name, email, tel, company, address, message },
          env
        );

        if (!emailResponse.success) {
          console.error('Email send error:', emailResponse.error);
          return errorResponse('メールの送信に失敗しました。しばらくしてから再度お試しください。', 500);
        }

        return jsonResponse({ 
          success: true, 
          message: 'お問い合わせを受け付けました。ありがとうございます。' 
        });
      } catch (error) {
        console.error('Contact form error:', error);
        return errorResponse('リクエストの処理中にエラーが発生しました', 500);
      }
    }

    return errorResponse('Not found', 404);
  },
};
