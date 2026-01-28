# 部署指南

## 快速开始

### 步骤 1: Cloudflare Workers 设置

1. **创建 Cloudflare 账户**（如果还没有）
   - 访问 https://dash.cloudflare.com/

2. **安装 Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

3. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

4. **创建 R2 Buckets**
   - 在 Cloudflare Dashboard 中：
     - 进入 R2 → Create bucket
     - 创建 `kinkoshioji-products`
     - 创建 `kinkoshioji-images`
   - 或者使用命令行：
     ```bash
     wrangler r2 bucket create kinkoshioji-products
     wrangler r2 bucket create kinkoshioji-images
     ```

5. **设置 R2 公共访问（用于图片）**
   - 进入 `kinkoshioji-images` bucket
   - Settings → Public Access
   - 启用公共访问或配置自定义域名

6. **部署 Workers**
   ```bash
   cd api
   npm install
   wrangler secret put ADMIN_TOKEN
   # 输入一个强密码作为管理员令牌
   npm run deploy
   ```

7. **记录 Workers URL**
   - 部署完成后会显示 URL，例如：`https://kinkoshioji-api.your-subdomain.workers.dev`
   - 保存这个 URL，后续会用到

### 步骤 2: Vercel 部署管理前端

1. **创建 Vercel 账户**（如果还没有）
   - 访问 https://vercel.com/

2. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **部署项目**
   ```bash
   cd admin
   npm install
   vercel
   ```

4. **设置环境变量**
   - 在 Vercel Dashboard 中：
     - 进入项目 → Settings → Environment Variables
     - 添加：
       - `NEXT_PUBLIC_API_URL`: 你的 Workers URL
       - `NEXT_PUBLIC_ADMIN_TOKEN`: 你设置的 Admin Token

5. **重新部署**
   ```bash
   vercel --prod
   ```

### 步骤 3: 更新首页配置

1. **编辑 `www.kinkosyouji.co.jp/js/products.js`**
   ```javascript
   const API_URL = 'https://your-worker.your-subdomain.workers.dev';
   ```
   替换为你的实际 Workers URL

2. **部署静态网站**
   - 将 `www.kinkosyouji.co.jp` 目录部署到 Vercel Pages 或其他静态托管服务
   - 或者使用 Cloudflare Pages

### 步骤 4: 初始化数据（可选）

如果需要初始化一些示例商品数据，可以使用管理界面添加，或者直接创建 `products.json` 文件上传到 R2。

## 配置检查清单

- [ ] Cloudflare Workers 已部署
- [ ] R2 Buckets 已创建（products 和 images）
- [ ] Admin Token 已设置
- [ ] R2 图片 bucket 已配置公共访问
- [ ] Vercel 管理前端已部署
- [ ] 环境变量已配置
- [ ] 首页 API URL 已更新
- [ ] 静态网站已部署

## 测试

1. **测试 API**
   ```bash
   curl https://your-worker.your-subdomain.workers.dev/api/products
   ```

2. **测试管理界面**
   - 访问 Vercel 部署的 URL
   - 尝试添加、编辑、删除商品

3. **测试首页**
   - 访问静态网站
   - 检查商品是否正确显示

## 常见问题

### Workers 部署失败

- 检查 `wrangler.toml` 配置
- 确保已登录：`wrangler login`
- 检查账户是否有 Workers 权限

### 图片无法上传

- 检查 R2 bucket 权限
- 检查 Admin Token 是否正确
- 查看 Workers 日志：`wrangler tail`

### 管理界面无法连接 API

- 检查环境变量 `NEXT_PUBLIC_API_URL` 是否正确
- 检查 CORS 设置
- 查看浏览器控制台错误

### 首页商品不显示

- 检查 `products.js` 中的 API_URL
- 检查浏览器控制台是否有错误
- 确认 API 返回了正确的数据格式
