/**
 * Product display script for homepage
 * Fetches products from Cloudflare Workers API and displays them
 */

const API_URL = 'https://api.kinkoshioji.co.jp';

async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/api/products`);
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

function formatPrice(price) {
  return price.toLocaleString('ja-JP');
}

function createProductCard(product) {
  // SVG 占位图（base64）
  const placeholderSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ4IiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQ4IiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7lm77niYfliqDovb3lpLHotKU8L3RleHQ+PC9zdmc+';
  
  // 处理图片 URL
  let imageUrl = product.imageUrl || '';
  
  if (imageUrl && imageUrl.trim() !== '') {
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      // 相对路径，转换为完整 URL
      if (imageUrl.startsWith('/')) {
        imageUrl = `https://www.kinkoshioji.co.jp${imageUrl}`;
      } else {
        imageUrl = `https://www.kinkoshioji.co.jp/img/goods/${imageUrl}`;
      }
    }
  } else {
    // 没有图片时使用 SVG 占位图
    imageUrl = placeholderSvg;
  }
  
  const priceBoxClass = product.isNewPrice ? 'price_box_ari' : 'price_box_nashi';
  const priceTextClass = product.isNewPrice ? 'henko_ari' : 'henko_nashi';
  const newPriceBadge = product.isNewPrice 
    ? '<div class="leftbox"><img alt="" src="kaitori/img/nprice.png" width="56" height="15"></div>'
    : '<div class="leftbox"><img alt="" src="kaitori/img/dummy.png" width="56" height="15"></div>';

  return `
    <div class="kaitori_box">
      <div class="kaitori_item">${product.nameJa || product.name}</div>
      <div class="kaitori_img">
        <img alt="${product.nameJa || product.name}" src="${imageUrl}" width="248" height="120" 
             onerror="this.onerror=null; this.src='${placeholderSvg}'"
             style="width: 248px; height: 120px; object-fit: cover; background-color: #f5f5f5; display: block;">
      </div>
      <div class="${priceBoxClass}">
        ${newPriceBadge}
        <div class="rightbox">
          <span class="${priceTextClass}">${formatPrice(product.price)}円</span>／${product.unit}
        </div>
      </div>
    </div>
  `;
}

async function renderProducts() {
  const container = document.getElementById('products-container');
  if (!container) {
    console.error('Products container not found');
    return;
  }

  container.innerHTML = '<div style="text-align: center; padding: 20px;">読み込み中...</div>';

  const products = await loadProducts();
  
  if (products.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 20px;">商品が見つかりませんでした。</div>';
    return;
  }

  let html = '';
  products.forEach((product, index) => {
    html += createProductCard(product);
    // Add dummy-foot after every 4 products
    if ((index + 1) % 4 === 0) {
      html += '<div class="dummy-foot"></div>';
    }
  });
  
  // 确保在所有产品卡片后添加清除浮动的元素
  html += '<div class="dummy-foot"></div>';

  container.innerHTML = html;
}

// Load products when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderProducts);
} else {
  renderProducts();
}
