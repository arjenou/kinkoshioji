# 系统架构说明

## 整体架构

```
┌─────────────────┐
│   静态网站首页   │  www.kinkosyouji.co.jp/index.html
│  (Vercel/CF)    │  └─ js/products.js (动态加载商品)
└────────┬────────┘
         │ GET /api/products
         ▼
┌─────────────────┐
│ Cloudflare       │  api/src/index.ts
│ Workers API      │  └─ CRUD 操作
└────────┬────────┘
         │
    ┌────┴────┐
    │        │
    ▼        ▼
┌────────┐ ┌────────┐
│ R2:    │ │ R2:    │
│products│ │images  │
│.json   │ │(图片)  │
└────────┘ └────────┘

┌─────────────────┐
│ 管理前端         │  admin/ (Next.js)
│ (Vercel)        │  └─ 商品管理界面
└────────┬────────┘
         │ POST/PUT/DELETE /api/products
         │ Authorization: Bearer <TOKEN>
         ▼
┌─────────────────┐
│ Cloudflare      │
│ Workers API     │
└─────────────────┘
```

## 数据流

### 1. 首页显示商品

```
用户访问首页
  ↓
products.js 执行
  ↓
GET /api/products → Cloudflare Workers
  ↓
从 R2 products.json 读取数据
  ↓
返回 JSON 数据
  ↓
products.js 渲染商品卡片
```

### 2. 管理商品

```
管理员访问管理界面
  ↓
Next.js 前端
  ↓
POST/PUT/DELETE /api/products
  + Authorization Header
  ↓
Cloudflare Workers 验证 Token
  ↓
更新 R2 products.json
  ↓
返回成功响应
```

### 3. 上传图片

```
管理员选择图片
  ↓
POST /api/upload (multipart/form-data)
  + Authorization Header
  ↓
Cloudflare Workers 验证 Token
  ↓
保存到 R2 images bucket
  ↓
返回图片 URL
  ↓
更新商品 imageUrl
```

## 技术栈

### 后端
- **Cloudflare Workers**: 无服务器 API
- **Cloudflare R2**: 对象存储（商品数据和图片）
- **TypeScript**: 类型安全

### 前端
- **Next.js 14**: React 框架（管理界面）
- **React**: UI 库
- **TypeScript**: 类型安全
- **原生 JavaScript**: 首页商品显示

### 部署
- **Vercel**: 管理前端和静态网站
- **Cloudflare**: Workers 和 R2

## 安全机制

1. **认证**: Admin Token 用于保护写操作
2. **CORS**: 允许跨域请求（生产环境应限制）
3. **R2 权限**: 图片 bucket 配置公共访问

## 数据存储

### products.json 结构

存储在 R2 `kinkoshioji-products` bucket 中：

```json
[
  {
    "id": "uuid",
    "name": "Iron A",
    "nameJa": "鉄Ａ",
    "imageUrl": "https://.../api/images/uuid.jpg",
    "price": 43,
    "unit": "kg",
    "isNewPrice": false,
    "createdAt": "2025-01-28T00:00:00.000Z",
    "updatedAt": "2025-01-28T00:00:00.000Z"
  }
]
```

### 图片存储

- 存储在 R2 `kinkoshioji-images` bucket
- 文件名格式: `{uuid}.{ext}`
- 通过 `/api/images/{filename}` 访问

## API 端点

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| GET | `/api/products` | ❌ | 获取所有商品 |
| POST | `/api/products` | ✅ | 创建商品 |
| PUT | `/api/products/:id` | ✅ | 更新商品 |
| DELETE | `/api/products/:id` | ✅ | 删除商品 |
| POST | `/api/upload` | ✅ | 上传图片 |
| GET | `/api/images/:filename` | ❌ | 获取图片 |

## 环境变量

### Cloudflare Workers
- `ADMIN_TOKEN`: 管理员令牌（通过 `wrangler secret` 设置）

### Next.js 管理前端
- `NEXT_PUBLIC_API_URL`: Workers API URL
- `NEXT_PUBLIC_ADMIN_TOKEN`: 管理员令牌

### 首页
- 在 `products.js` 中硬编码 `API_URL`

## 扩展建议

1. **添加用户认证**: 使用 Cloudflare Access 或 Auth0
2. **添加缓存**: 使用 Cloudflare Cache API
3. **添加日志**: 使用 Cloudflare Workers Analytics
4. **添加监控**: 使用 Cloudflare Analytics
5. **添加备份**: 定期备份 R2 数据
6. **添加版本控制**: 为商品数据添加版本历史

## 性能优化

1. **图片优化**: 使用 Cloudflare Images 或 Image Resizing
2. **CDN**: 利用 Cloudflare 的全球 CDN
3. **缓存策略**: 设置适当的 Cache-Control 头
4. **数据分页**: 如果商品数量很大，添加分页

## 成本估算

### Cloudflare
- Workers: 免费套餐包含 100,000 请求/天
- R2: $0.015/GB 存储 + $0.36/百万次读取

### Vercel
- 免费套餐包含 100GB 带宽/月
- 适合中小型项目

## 维护

1. **定期备份**: 导出 products.json
2. **监控错误**: 查看 Workers 日志
3. **更新依赖**: 定期更新 npm 包
4. **安全检查**: 定期轮换 Admin Token
