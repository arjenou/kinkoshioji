# 金興商事株式会社 - 商品管理系统

这是一个完整的商品管理系统，使用 Cloudflare Workers 作为后端 API，Next.js 作为管理前端，Cloudflare R2 作为数据存储。

## 项目结构

```
kinkoshioji/
├── api/                    # Cloudflare Workers 后端
│   ├── src/
│   │   └── index.ts       # API 主文件
│   ├── wrangler.toml      # Cloudflare Workers 配置
│   └── package.json
├── admin/                  # Next.js 管理前端
│   ├── app/
│   │   ├── page.tsx        # 主页面
│   │   ├── components/     # React 组件
│   │   └── lib/            # API 客户端
│   └── package.json
└── www.kinkosyouji.co.jp/  # 静态网站
    ├── index.html          # 首页（已更新为动态加载）
    └── js/
        └── products.js     # 商品显示脚本
```

## 功能特性

- ✅ 商品列表显示
- ✅ 添加新商品
- ✅ 编辑商品信息
- ✅ 删除商品
- ✅ 图片上传和管理
- ✅ 价格管理
- ✅ New Price 标签支持

## 部署步骤

### 1. 部署 Cloudflare Workers API

#### 1.1 安装依赖

```bash
cd api
npm install
```

#### 1.2 创建 R2 Buckets

在 Cloudflare Dashboard 中创建两个 R2 Buckets：
- `kinkoshioji-products` - 存储商品数据 JSON
- `kinkoshioji-images` - 存储商品图片

#### 1.3 配置 wrangler.toml

确保 `wrangler.toml` 中的 bucket 名称正确。

#### 1.4 设置 Admin Token

```bash
cd api
wrangler secret put ADMIN_TOKEN
# 输入你的管理员令牌（用于 API 认证）
```

#### 1.5 部署 Workers

```bash
cd api
npm run deploy
```

部署完成后，记下你的 Workers URL（例如：`https://kinkoshioji-api.your-subdomain.workers.dev`）

### 2. 配置 R2 公共访问（用于图片）

#### 2.1 设置图片 Bucket 的公共访问

在 Cloudflare Dashboard 中：
1. 进入 R2 → `kinkoshioji-images` bucket
2. 设置公共访问或配置自定义域名

#### 2.2 更新 API 代码中的图片 URL

如果需要使用自定义域名，修改 `api/src/index.ts` 中的图片 URL 生成逻辑。

### 3. 部署管理前端到 Vercel

#### 3.1 安装依赖

```bash
cd admin
npm install
```

#### 3.2 配置环境变量

创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_API_URL=https://your-worker.your-subdomain.workers.dev
NEXT_PUBLIC_ADMIN_TOKEN=your-secret-admin-token
```

#### 3.3 部署到 Vercel

```bash
cd admin
vercel
```

或者通过 Vercel Dashboard：
1. 导入项目
2. 设置环境变量：
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_ADMIN_TOKEN`

### 4. 更新首页配置

编辑 `www.kinkosyouji.co.jp/js/products.js`，更新 API_URL：

```javascript
const API_URL = 'https://your-worker.your-subdomain.workers.dev';
```

### 5. 部署静态网站

将 `www.kinkosyouji.co.jp` 目录部署到你的静态网站托管服务（Vercel、Cloudflare Pages 等）。

## API 端点

### GET /api/products
获取所有商品列表

**响应：**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Product Name",
      "nameJa": "商品名",
      "imageUrl": "/api/images/filename.jpg",
      "price": 1000,
      "unit": "kg",
      "isNewPrice": false,
      "createdAt": "2025-01-28T00:00:00.000Z",
      "updatedAt": "2025-01-28T00:00:00.000Z"
    }
  ],
  "updatedAt": "2025-01-28T00:00:00.000Z"
}
```

### POST /api/products
创建新商品

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
```

**Body:**
```json
{
  "name": "Product Name",
  "nameJa": "商品名",
  "imageUrl": "/api/images/filename.jpg",
  "price": 1000,
  "unit": "kg",
  "isNewPrice": false
}
```

### PUT /api/products/:id
更新商品

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
```

**Body:** (部分字段)
```json
{
  "price": 1200,
  "isNewPrice": true
}
```

### DELETE /api/products/:id
删除商品

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
```

### POST /api/upload
上传图片

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: multipart/form-data
```

**Body:**
```
file: <image file>
```

**响应：**
```json
{
  "url": "/api/images/uuid.jpg",
  "filename": "uuid.jpg"
}
```

### GET /api/images/:filename
获取图片

## 使用说明

### 访问管理界面

访问部署后的 Vercel URL（例如：`https://admin.your-domain.com`）

### 添加商品

1. 点击 "新しい商品を追加" 按钮
2. 填写商品信息：
   - 商品名（日本語）*：必填
   - 商品名（英語）：可选
   - 图片：上传商品图片
   - 价格：输入价格（日元）
   - 单位：选择单位（kg/台/個）
   - New Price 标签：勾选以显示新价格标签
3. 点击 "保存"

### 编辑商品

1. 在商品卡片上点击 "編集" 按钮
2. 修改商品信息
3. 点击 "保存"

### 删除商品

1. 在商品卡片上点击 "削除" 按钮
2. 确认删除

## 数据格式

商品数据存储在 R2 的 `products.json` 文件中，格式如下：

```json
[
  {
    "id": "uuid",
    "name": "Iron A",
    "nameJa": "鉄Ａ",
    "imageUrl": "/api/images/iron-a.jpg",
    "price": 43,
    "unit": "kg",
    "isNewPrice": false,
    "createdAt": "2025-01-28T00:00:00.000Z",
    "updatedAt": "2025-01-28T00:00:00.000Z"
  }
]
```

## 安全注意事项

1. **Admin Token**: 确保使用强密码作为 Admin Token，不要提交到代码仓库
2. **CORS**: 生产环境中应该限制 CORS 来源
3. **R2 访问**: 确保 R2 buckets 的访问权限正确配置
4. **HTTPS**: 确保所有通信都使用 HTTPS

## 故障排除

### 图片无法显示

1. 检查 R2 bucket 的公共访问设置
2. 检查图片 URL 是否正确
3. 检查 CORS 设置

### API 请求失败

1. 检查 Workers URL 是否正确
2. 检查 Admin Token 是否正确
3. 查看 Cloudflare Workers 日志

### 商品无法保存

1. 检查 Admin Token 是否正确设置
2. 检查 R2 bucket 权限
3. 查看浏览器控制台错误信息

## 开发

### 本地开发 API

```bash
cd api
npm run dev
```

### 本地开发管理前端

```bash
cd admin
npm run dev
```

访问 http://localhost:3000

## 许可证

Copyright © 2026 KINKOSHIOJI Co.,Ltd.
