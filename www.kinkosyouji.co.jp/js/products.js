/**
 * Product display script for homepage
 * Fetches products from Cloudflare Workers API and displays them
 */

const API_URL = 'https://api.kinkoshioji.com';

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
  const imageUrl = product.imageUrl.startsWith('http') 
    ? product.imageUrl 
    : `${API_URL}${product.imageUrl}`;
  
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
             onerror="this.src='img/goods/placeholder.jpg'">
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

  container.innerHTML = html;
}

// Load products when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderProducts);
} else {
  renderProducts();
}
