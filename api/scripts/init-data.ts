/**
 * Script to initialize sample product data
 * Run with: npx tsx scripts/init-data.ts
 */

const API_URL = process.env.API_URL || 'http://localhost:8787';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

const sampleProducts = [
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
];

async function initData() {
  if (!ADMIN_TOKEN) {
    console.error('Error: ADMIN_TOKEN environment variable is required');
    process.exit(1);
  }

  console.log(`Initializing products at ${API_URL}...`);

  for (const product of sampleProducts) {
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
        console.log(`✓ Created: ${product.nameJa}`);
      } else {
        const error = await response.text();
        console.error(`✗ Failed to create ${product.nameJa}:`, error);
      }
    } catch (error) {
      console.error(`✗ Error creating ${product.nameJa}:`, error);
    }
  }

  console.log('\nInitialization complete!');
}

initData();
