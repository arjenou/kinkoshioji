# 部署状态

## ✅ 已完成

1. **Cloudflare Workers API** - 已部署
   - URL: `https://kinkoshioji-api-production.wangyunjie1101.workers.dev`
   - 自定义域名: `https://api.kinkoshioji.com` (需要配置 DNS)
   - Admin Token: `kinkoshioji-admin-bc3488451141916f`

2. **R2 Buckets** - 已创建
   - `kinkoshioji-products` - 存储商品数据
   - `kinkoshioji-images` - 存储商品图片

3. **代码已推送到 GitHub**
   - 仓库: `arjenou/kinkoshioji`
   - 分支: `main`

## 🔄 进行中

### 配置自定义域名 (api.kinkoshioji.com)

**步骤 1: 在 Cloudflare Dashboard 配置路由**
1. 访问 https://dash.cloudflare.com/
2. 选择域名 `kinkoshioji.com`
3. 进入 **Workers & Pages** → **Routes**
4. 点击 **Add route**
5. 配置：
   - Route: `api.kinkoshioji.com/*`
   - Worker: `kinkoshioji-api-production`
   - Environment: `production`
6. 点击 **Save**

**步骤 2: 配置 DNS 记录（如果还没有）**
1. 在 Cloudflare Dashboard → DNS
2. 添加 CNAME 记录：
   - Type: CNAME
   - Name: `api`
   - Target: `kinkoshioji-api-production.wangyunjie1101.workers.dev`
   - Proxy: ✅ 开启（橙色云朵）

**步骤 3: 等待 DNS 传播（通常几分钟）**

## 📋 待完成

### 部署 Vercel 项目

由于 Vercel CLI 需要浏览器登录，建议通过 Vercel Dashboard 部署：

**方法 1: 通过 Vercel Dashboard（推荐）**

1. 访问 https://vercel.com/
2. 点击 **Add New Project**
3. 导入 GitHub 仓库 `arjenou/kinkoshioji`
4. **部署管理前端**：
   - Root Directory: `admin`
   - Framework Preset: Next.js
   - Environment Variables:
     - `NEXT_PUBLIC_API_URL`: `https://api.kinkoshioji.com` (或使用 workers.dev URL)
     - `NEXT_PUBLIC_ADMIN_TOKEN`: `kinkoshioji-admin-bc3488451141916f`
5. 点击 **Deploy**

5. **部署静态网站**：
   - 再次点击 **Add New Project**
   - Root Directory: `www.kinkosyouji.co.jp`
   - Framework Preset: Other
   - Build Command: (留空)
   - Output Directory: `.`
   - 点击 **Deploy**

**方法 2: 使用 Vercel CLI**

```bash
# 登录 Vercel（会打开浏览器）
cd admin
vercel

# 设置环境变量
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_ADMIN_TOKEN

# 部署
vercel --prod
```

## 🔑 重要信息

- **API URL**: 
  - Workers URL: `https://kinkoshioji-api-production.wangyunjie1101.workers.dev`
  - 自定义域名: `https://api.kinkoshioji.com` (配置后使用)

- **Admin Token**: `kinkoshioji-admin-bc3488451141916f`
  - 请妥善保管，不要提交到代码仓库

## 📝 下一步

1. 配置 `api.kinkoshioji.com` 自定义域名
2. 在 Vercel Dashboard 部署管理前端
3. 在 Vercel Dashboard 部署静态网站
4. 测试系统功能
