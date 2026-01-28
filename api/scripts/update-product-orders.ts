/**
 * Script to update existing products with order field
 * Run with: npx tsx scripts/update-product-orders.ts
 */

const API_URL = process.env.API_URL || 'https://kinkoshioji-api-production.wangyunjie1101.workers.dev';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'kinkoshioji-admin-bc3488451141916f';

async function updateProductOrders() {
  try {
    // 获取所有商品
    const response = await fetch(`${API_URL}/api/products`);
    const data = await response.json();
    const products = data.products || [];

    console.log(`找到 ${products.length} 个商品，开始更新 order 字段...\n`);

    // 为每个商品设置 order（按当前顺序）
    const productIds = products.map((p: any) => p.id);
    
    const updateResponse = await fetch(`${API_URL}/api/products/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify({ productIds }),
    });

    if (updateResponse.ok) {
      console.log('✅ 所有商品的 order 字段已更新！');
    } else {
      const error = await updateResponse.text();
      console.error('✗ 更新失败:', error);
    }
  } catch (error) {
    console.error('错误:', error);
  }
}

updateProductOrders();
