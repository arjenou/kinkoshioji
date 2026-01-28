# 将管理界面部署到 /admin 子路径

## 方案说明

将管理前端部署为静态网站的一部分，通过 `https://www.kinkoshioji.co.jp/admin` 访问。

## 部署步骤

### 方法 1: 使用 Vercel（推荐）

#### 1. 构建管理前端为静态文件

```bash
cd admin
npm install
npm run build
```

构建完成后，会生成 `out` 目录，包含所有静态文件。

#### 2. 将构建文件复制到静态网站目录

```bash
# 从 admin 目录
cp -r out/* ../www.kinkosyouji.co.jp/admin/
```

#### 3. 部署静态网站

将整个 `www.kinkosyouji.co.jp` 目录部署到 Vercel，管理界面就会在 `/admin` 路径下可用。

### 方法 2: 使用 Vercel Monorepo 配置

在根目录创建 `vercel.json`：

```json
{
  "builds": [
    {
      "src": "admin/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/admin/(.*)",
      "dest": "/admin/$1"
    }
  ]
}
```

### 方法 3: 使用 Next.js 静态导出 + 手动部署

1. **构建静态文件**
   ```bash
   cd admin
   npm run build
   ```

2. **复制文件到静态网站**
   ```bash
   mkdir -p ../www.kinkosyouji.co.jp/admin
   cp -r out/* ../www.kinkosyouji.co.jp/admin/
   ```

3. **提交并推送**
   ```bash
   git add www.kinkosyouji.co.jp/admin
   git commit -m "添加管理界面到 /admin 路径"
   git push
   ```

4. **部署静态网站**
   - 将 `www.kinkosyouji.co.jp` 部署到 Vercel 或其他静态托管服务

## 配置说明

### Next.js 配置

已更新 `admin/next.config.js`：
- `basePath: '/admin'` - 设置基础路径
- `output: 'export'` - 静态导出模式

### Vercel 配置

已更新 `www.kinkosyouji.co.jp/vercel.json`：
- 添加了 `/admin` 路径的 rewrites
- 配置了静态资源的缓存头

## 访问地址

部署完成后，管理界面可通过以下地址访问：
- `https://www.kinkoshioji.co.jp/admin`
- `https://www.kinkoshioji.co.jp/admin/`（带斜杠）

## 注意事项

1. **环境变量**: 管理前端需要环境变量，但静态导出后无法使用服务端环境变量
   - 解决方案：在构建时注入环境变量，或使用客户端配置

2. **API 调用**: 确保 API URL 配置正确
   - 检查 `admin/app/lib/api.ts` 中的 `API_URL`

3. **路由**: Next.js 静态导出后，所有路由都会生成对应的 HTML 文件

4. **图片路径**: 确保图片路径使用相对路径或完整 URL

## 快速部署脚本

创建 `scripts/deploy-admin.sh`：

```bash
#!/bin/bash
cd admin
npm install
npm run build
cd ..
mkdir -p www.kinkosyouji.co.jp/admin
cp -r admin/out/* www.kinkosyouji.co.jp/admin/
git add www.kinkosyouji.co.jp/admin
git commit -m "更新管理界面"
git push
```
