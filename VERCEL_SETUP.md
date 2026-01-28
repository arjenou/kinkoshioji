# Vercel 部署配置说明

## 项目结构

本项目包含两个需要部署的应用：

1. **管理前端** (`admin/`) - Next.js 应用
2. **静态网站** (`www.kinkosyouji.co.jp/`) - 静态 HTML 网站

## 部署方式

### 方式 1: 分别部署两个项目（推荐）

#### 1. 部署管理前端

1. 在 Vercel Dashboard 中：
   - 点击 "Add New Project"
   - 导入 Git 仓库
   - **Root Directory**: 选择 `admin`
   - Framework Preset: Next.js
   - Build Command: `npm run build` (自动检测)
   - Output Directory: `.next` (自动检测)

2. 设置环境变量：
   - `NEXT_PUBLIC_API_URL`: 你的 Cloudflare Workers URL
   - `NEXT_PUBLIC_ADMIN_TOKEN`: 你的管理员令牌

3. 点击 Deploy

#### 2. 部署静态网站

1. 在 Vercel Dashboard 中：
   - 点击 "Add New Project"
   - 导入同一个 Git 仓库
   - **Root Directory**: 选择 `www.kinkosyouji.co.jp`
   - Framework Preset: Other
   - Build Command: (留空)
   - Output Directory: `.` (当前目录)

2. 可选：配置 Rewrites（如果需要代理 API）
   - 在 `vercel.json` 中已配置

3. 点击 Deploy

### 方式 2: 使用 Monorepo（高级）

如果使用 Monorepo 方式，需要配置 `vercel.json` 在根目录，但这需要更复杂的配置。

## 环境变量设置

### 管理前端需要的环境变量

在 Vercel Dashboard → Project Settings → Environment Variables 中添加：

```
NEXT_PUBLIC_API_URL=https://your-worker.your-subdomain.workers.dev
NEXT_PUBLIC_ADMIN_TOKEN=your-secret-admin-token
```

### 静态网站配置

编辑 `www.kinkosyouji.co.jp/js/products.js`，更新 `API_URL`：

```javascript
const API_URL = 'https://your-worker.your-subdomain.workers.dev';
```

## 自动部署

一旦配置完成，每次 push 代码到 Git 仓库，Vercel 会自动：
1. 检测到代码变更
2. 运行构建命令
3. 部署新版本

## 自定义域名

1. 在 Vercel Dashboard → Project Settings → Domains
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

## 注意事项

1. **环境变量**: 确保在 Vercel Dashboard 中设置了所有必需的环境变量
2. **API URL**: 静态网站的 `products.js` 需要手动更新 API URL
3. **CORS**: 确保 Cloudflare Workers 允许来自 Vercel 域名的请求
