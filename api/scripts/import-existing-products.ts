/**
 * Script to import existing products from ka251117.html to R2
 * Run with: npx tsx scripts/import-existing-products.ts
 */

const API_URL = process.env.API_URL || 'https://kinkoshioji-api-production.wangyunjie1101.workers.dev';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'kinkoshioji-admin-bc3488451141916f';

// 从 ka251117.html 提取的商品数据
const existingProducts = [
  {
    name: 'Iron A',
    nameJa: '鉄Ａ',
    imageUrl: '/img/goods/iron14.jpg',
    price: 43,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Iron B',
    nameJa: '鉄Ｂ',
    imageUrl: '/img/goods/iron15.jpg',
    price: 40,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Shiny Copper',
    nameJa: 'ピカ銅',
    imageUrl: '/img/goods/copper11.jpg',
    price: 1720,
    unit: 'kg',
    isNewPrice: true,
  },
  {
    name: 'Standard Copper',
    nameJa: '並銅',
    imageUrl: '/img/goods/copper12.jpg',
    price: 1640,
    unit: 'kg',
    isNewPrice: true,
  },
  {
    name: 'Single Wire (80% Copper)',
    nameJa: '一本線（銅率80%）',
    imageUrl: '/img/goods/wire11.jpg',
    price: 1290,
    unit: 'kg',
    isNewPrice: true,
  },
  {
    name: 'Triple Wire (65% Copper)',
    nameJa: '三本線（銅率65%）',
    imageUrl: '/img/goods/wire12.jpg',
    price: 1040,
    unit: 'kg',
    isNewPrice: true,
  },
  {
    name: 'Brass',
    nameJa: '真鍮',
    imageUrl: '/img/goods/brass12.jpg',
    price: 1080,
    unit: 'kg',
    isNewPrice: true,
  },
  {
    name: 'Battery',
    nameJa: 'バッテリー',
    imageUrl: '/img/goods/btr12.jpg',
    price: 108,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'VA Wire',
    nameJa: 'ＶＡ線',
    imageUrl: '/img/goods/wire15.jpg',
    price: 720,
    unit: 'kg',
    isNewPrice: true,
  },
  {
    name: 'Mixed Wire A',
    nameJa: '雑線Ａ',
    imageUrl: '/img/goods/wire21.jpg',
    price: 600,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Mixed Wire',
    nameJa: '雑線',
    imageUrl: '/img/goods/wire14.jpg',
    price: 520,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Stainless Steel',
    nameJa: 'ステンレス',
    imageUrl: '/img/goods/stain11.jpg',
    price: 175,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Aluminum Sash',
    nameJa: 'アルミサッシ',
    imageUrl: '/img/goods/alumi11.jpg',
    price: 340,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Aluminum Wheel',
    nameJa: 'アルミホイール',
    imageUrl: '/img/goods/alumi12.jpg',
    price: 400,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Aluminum Can',
    nameJa: 'アルミ缶',
    imageUrl: '/img/goods/alumi14.jpg',
    price: 285,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Motor',
    nameJa: 'モーター',
    imageUrl: '/img/goods/motor11.jpg',
    price: 130,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Water Heater',
    nameJa: '給湯器',
    imageUrl: '/img/goods/hot11.jpg',
    price: 330,
    unit: 'kg',
    isNewPrice: true,
  },
  {
    name: 'Car Engine',
    nameJa: '自動車エンジン',
    imageUrl: '/img/goods/engine11.jpg',
    price: 90,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'PVC Pipe',
    nameJa: '塩ビ管',
    imageUrl: '/img/goods/plastic11.jpg',
    price: 10,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Gas Meter',
    nameJa: 'ガスメーター',
    imageUrl: '/img/goods/meter11.jpg',
    price: 140,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Bicycle',
    nameJa: '自転車',
    imageUrl: '/img/goods/bicycle11.jpg',
    price: 1000,
    unit: '台',
    isNewPrice: false,
  },
  {
    name: 'Ceramics (Unbroken)',
    nameJa: '陶磁器（割れてないもの）',
    imageUrl: '/img/goods/tojiki11.jpg',
    price: 20,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Flexible Container Bag',
    nameJa: 'フレコンバック（使用可能なもの）',
    imageUrl: '/img/goods/fbag11.jpg',
    price: 10,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Car Catalyst (Honeycomb Large)',
    nameJa: '自動車触媒（ハニカム 大）',
    imageUrl: '/img/goods/automotive11.jpg',
    price: 8000,
    unit: '個',
    isNewPrice: false,
  },
  {
    name: 'Car Catalyst (Honeycomb Medium)',
    nameJa: '自動車触媒（ハニカム 中）',
    imageUrl: '/img/goods/automotive12.jpg',
    price: 5000,
    unit: '個',
    isNewPrice: false,
  },
  {
    name: 'Car Catalyst (Honeycomb Small)',
    nameJa: '自動車触媒（ハニカム 小）',
    imageUrl: '/img/goods/automotive13.jpg',
    price: 2000,
    unit: '個',
    isNewPrice: false,
  },
  {
    name: 'Substrate A',
    nameJa: '基板Ａ',
    imageUrl: '/img/goods/substrate12.jpg',
    price: 2000,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Substrate B',
    nameJa: '基板Ｂ',
    imageUrl: '/img/goods/substrate13.jpg',
    price: 1200,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Substrate C',
    nameJa: '基板Ｃ',
    imageUrl: '/img/goods/substrate14.jpg',
    price: 300,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'PC Motherboard',
    nameJa: 'パソコン用マザーボード',
    imageUrl: '/img/goods/motherboard11.jpg',
    price: 900,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Memory A',
    nameJa: 'メモリーＡ',
    imageUrl: '/img/goods/ram11.jpg',
    price: 6000,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Hard Disk (HDD)',
    nameJa: 'ハードディスク（ＨＤＤ）',
    imageUrl: '/img/goods/hdd11.jpg',
    price: 250,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'PC Body',
    nameJa: 'パソコン本体',
    imageUrl: '/img/goods/pc11.jpg',
    price: 1000,
    unit: '台',
    isNewPrice: false,
  },
  {
    name: 'Notebook PC',
    nameJa: 'ノートパソコン',
    imageUrl: '/img/goods/pc12.jpg',
    price: 300,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Monitor',
    nameJa: 'モニター',
    imageUrl: '/img/goods/monitor11.jpg',
    price: 100,
    unit: '台',
    isNewPrice: false,
  },
  {
    name: 'CPU',
    nameJa: 'ＣＰＵ',
    imageUrl: '/img/goods/cpu11.jpg',
    price: 0,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Mobile Phone',
    nameJa: '携帯電話本体',
    imageUrl: '/img/goods/mobile11.jpg',
    price: 2000,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Smartphone',
    nameJa: 'スマートフォン本体',
    imageUrl: '/img/goods/mobile12.jpg',
    price: 1000,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Breaker',
    nameJa: 'ブレーカー',
    imageUrl: '/img/goods/breaker11.jpg',
    price: 300,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Relay Mixed',
    nameJa: 'リレー混合',
    imageUrl: '/img/goods/relay11.jpg',
    price: 200,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Electronic Miscellaneous',
    nameJa: '電子雑品',
    imageUrl: '/img/goods/elec11.jpg',
    price: 50,
    unit: 'kg',
    isNewPrice: false,
  },
  {
    name: 'Nickel',
    nameJa: 'ニッケル',
    imageUrl: '',
    price: 1700,
    unit: 'kg',
    isNewPrice: true,
  },
  {
    name: 'Hard Alloy',
    nameJa: '超硬',
    imageUrl: '',
    price: 4000,
    unit: 'kg',
    isNewPrice: true,
  },
  {
    name: 'Tungsten',
    nameJa: 'タングステン',
    imageUrl: '',
    price: 3500,
    unit: 'kg',
    isNewPrice: true,
  },
  {
    name: 'Tin',
    nameJa: '錫',
    imageUrl: '',
    price: 3000,
    unit: 'kg',
    isNewPrice: true,
  },
];

async function importProducts() {
  console.log(`开始导入商品到 ${API_URL}...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const product of existingProducts) {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✓ 成功: ${product.nameJa} (${product.price}円/${product.unit})`);
        successCount++;
      } else {
        const error = await response.text();
        console.error(`✗ 失败: ${product.nameJa} - ${error}`);
        failCount++;
      }
    } catch (error) {
      console.error(`✗ 错误: ${product.nameJa} -`, error);
      failCount++;
    }
    
    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n导入完成！`);
  console.log(`成功: ${successCount} 个`);
  console.log(`失败: ${failCount} 个`);
}

importProducts();
