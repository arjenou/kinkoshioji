# 管理界面访问说明

## 访问地址

管理界面已配置为通过以下地址访问：
- **主域名**: `https://www.kinkoshioji.co.jp/admin`
- **备用**: `https://www.kinkoshioji.co.jp/admin/`

## 配置说明

### 1. Next.js 配置
- `basePath: '/admin'` - 设置基础路径为 `/admin`
- `output: 'export'` - 静态导出模式，生成静态 HTML 文件

### 2. 构建和部署流程

1. **构建管理前端**
   ```bash
   cd admin
   npm run build
   ```
   这会生成 `admin/out` 目录，包含所有静态文件。

2. **复制到静态网站目录**
   ```bash
   mkdir -p www.kinkosyouji.co.jp/admin
   cp -r admin/out/* www.kinkosyouji.co.jp/admin/
   ```

3. **提交并推送**
   ```bash
   git add www.kinkosyouji.co.jp/admin
   git commit -m "更新管理界面"
   git push
   ```

4. **部署静态网站**
   - 将 `www.kinkosyouji.co.jp` 目录部署到 Vercel 或其他静态托管服务
   - 管理界面会自动在 `/admin` 路径下可用

### 3. 使用部署脚本

也可以使用提供的脚本：
```bash
./scripts/deploy-admin.sh
```

## 环境变量配置

管理前端需要以下环境变量（在构建时注入）：

### 方法 1: 在构建时设置（推荐）

```bash
cd admin
NEXT_PUBLIC_API_URL=https://api.kinkoshioji.co.jp \
NEXT_PUBLIC_ADMIN_TOKEN=kinkoshioji-admin-bc3488451141916f \
npm run build
```

### 方法 2: 创建 `.env.production` 文件

在 `admin/` 目录创建 `.env.production`：
```
NEXT_PUBLIC_API_URL=https://api.kinkoshioji.co.jp
NEXT_PUBLIC_ADMIN_TOKEN=kinkoshioji-admin-bc3488451141916f
```

然后构建：
```bash
cd admin
npm run build
```

### 方法 3: 使用 Vercel 环境变量

如果使用 Vercel 部署，可以在 Dashboard 中设置环境变量，Vercel 会在构建时自动注入。

## 注意事项

1. **静态导出限制**
   - Next.js 静态导出后，所有路由都会预渲染为 HTML
   - API Routes 不会工作（需要使用外部 API）
   - 动态路由需要预定义

2. **API 调用**
   - 确保 `NEXT_PUBLIC_API_URL` 配置正确
   - API 必须支持 CORS
   - Token 会暴露在客户端代码中（这是预期的，因为需要浏览器调用）

3. **路径问题**
   - 所有资源路径会自动添加 `/admin` 前缀
   - 图片和静态资源路径会自动处理

4. **更新管理界面**
   - 每次更新管理界面代码后，需要重新构建并复制文件
   - 可以使用 `scripts/deploy-admin.sh` 脚本自动化这个过程

## 故障排除

### 404 错误
- 检查文件是否正确复制到 `www.kinkosyouji.co.jp/admin/`
- 检查服务器配置是否正确处理 `/admin` 路径

### API 调用失败
- 检查 `NEXT_PUBLIC_API_URL` 是否正确
- 检查浏览器控制台的网络请求
- 确认 API 支持 CORS

### 样式或资源加载失败
- 检查资源路径是否正确（应该以 `/admin/` 开头）
- 检查 `basePath` 配置是否正确

## 安全建议

1. **保护管理界面**
   - 考虑添加身份验证（登录页面）
   - 使用 HTTPS
   - 限制访问 IP（如果可能）

2. **Token 安全**
   - `NEXT_PUBLIC_ADMIN_TOKEN` 会暴露在客户端
   - 定期更换 Token
   - 不要在前端公开页面使用相同的 Token

3. **API 安全**
   - API 已经有 Token 验证
   - 考虑添加速率限制
   - 记录管理操作日志
