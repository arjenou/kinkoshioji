# 快速启动指南

## 5分钟快速部署

### 前置要求

- Node.js 18+ 已安装
- Cloudflare 账户
- Vercel 账户（或 GitHub 账户用于 Vercel 登录）

### 步骤 1: 设置 Cloudflare Workers（3分钟）

```bash
# 1. 安装 Wrangler
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login

# 3. 进入 API 目录
cd api

# 4. 安装依赖
npm install

# 5. 创建 R2 Buckets（在 Cloudflare Dashboard 中）
# 或者使用命令行：
wrangler r2 bucket create kinkoshioji-products
wrangler r2 bucket create kinkoshioji-images

# 6. 设置管理员令牌
wrangler secret put ADMIN_TOKEN
# 输入一个强密码，例如：my-secure-token-12345

# 7. 部署 Workers
npm run deploy
```

**记录下显示的 URL**，例如：`https://kinkoshioji-api.your-subdomain.workers.dev`

### 步骤 2: 配置 R2 图片访问（1分钟）

1. 访问 Cloudflare Dashboard → R2
2. 点击 `kinkoshioji-images` bucket
3. 进入 Settings → Public Access
4. 启用公共访问（或配置自定义域名）

### 步骤 3: 部署管理前端（1分钟）

```bash
# 1. 进入管理前端目录
cd ../admin

# 2. 安装依赖
npm install

# 3. 创建环境变量文件
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://your-worker.your-subdomain.workers.dev
NEXT_PUBLIC_ADMIN_TOKEN=my-secure-token-12345
EOF
# 替换上面的 URL 和 TOKEN 为实际值

# 4. 部署到 Vercel
npm install -g vercel
vercel

# 按照提示操作：
# - 登录 Vercel
# - 选择项目设置
# - 确认部署
```

**记录下 Vercel 部署的 URL**，例如：`https://admin-kinkoshioji.vercel.app`

### 步骤 4: 更新首页配置（30秒）

编辑 `www.kinkosyouji.co.jp/js/products.js`：

```javascript
const API_URL = 'https://your-worker.your-subdomain.workers.dev';
```

替换为你的实际 Workers URL。

### 步骤 5: 部署静态网站

将 `www.kinkosyouji.co.jp` 目录部署到：
- Vercel Pages
- Cloudflare Pages
- 或其他静态托管服务

## 测试系统

1. **访问管理界面**
   - 打开 Vercel 部署的 URL
   - 应该看到空白的商品列表

2. **添加测试商品**
   - 点击 "新しい商品を追加"
   - 填写商品信息
   - 上传图片
   - 保存

3. **检查首页**
   - 访问静态网站
   - 商品应该显示在首页

## 初始化示例数据（可选）

如果你想快速添加一些示例商品：

```bash
cd api
export API_URL=https://your-worker.your-subdomain.workers.dev
export ADMIN_TOKEN=my-secure-token-12345
npx tsx scripts/init-data.ts
```

## 故障排除

### Workers 部署失败

```bash
# 检查配置
cd api
wrangler whoami
wrangler config list
```

### 图片无法上传

- 检查 R2 bucket 权限
- 检查 Admin Token 是否正确
- 查看日志：`wrangler tail`

### 管理界面空白

- 检查浏览器控制台错误
- 确认环境变量已设置
- 检查 API URL 是否正确

### 首页商品不显示

- 检查 `products.js` 中的 API_URL
- 打开浏览器开发者工具查看网络请求
- 确认 API 返回了数据

## 下一步

- 阅读 [README.md](./README.md) 了解详细功能
- 阅读 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解详细部署步骤
- 自定义样式和功能

## 需要帮助？

- 查看 Cloudflare Workers 文档：https://developers.cloudflare.com/workers/
- 查看 Vercel 文档：https://vercel.com/docs
- 查看 Next.js 文档：https://nextjs.org/docs
