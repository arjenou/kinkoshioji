/**
 * Cloudflare Workers API for Product Management
 * Handles CRUD operations for products stored in R2
 */

export interface Env {
  PRODUCTS_BUCKET: R2Bucket;
  IMAGES_BUCKET: R2Bucket;
  ADMIN_TOKEN: string;
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
        const products = await getProducts(env);
        
        const products = await getProducts(env);
        const maxOrder = products.length > 0 
          ? Math.max(...products.map(p => p.order || 0))
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

        products.push(newProduct);
        // 重新排序
        products.sort((a, b) => (a.order || 0) - (b.order || 0));
        await saveProducts(products, env);
        
        return jsonResponse({ product: newProduct }, 201);
      } catch (error) {
        return errorResponse('Invalid request body', 400);
      }
    }

    // PUT /api/products/:id - Update product
    if (request.method === 'PUT' && path.startsWith('/api/products/')) {
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
        productIds.forEach((id: string, index: number) => {
          const product = allProducts.find(p => p.id === id);
          if (product) {
            product.order = index;
            product.updatedAt = new Date().toISOString();
          }
        });

        // 为没有 order 的商品设置默认值
        allProducts.forEach((product, index) => {
          if (product.order === undefined) {
            product.order = productIds.length + index;
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

    return errorResponse('Not found', 404);
  },
};
