# Gmail 应用密钥直接使用配置指南

本指南将帮助您直接使用 Gmail 应用密钥发送邮件，无需第三方服务。

## 架构说明

由于 Cloudflare Workers 不支持直接 SMTP 连接，我们创建了一个独立的邮件服务来处理 Gmail SMTP。

```
联系表单 → Cloudflare Workers API → Gmail SMTP 邮件服务 → Gmail SMTP
```

## 步骤 1: 部署邮件服务

### 方法 A: 部署到 Vercel（推荐）

1. **进入邮件服务目录**
   ```bash
   cd mail-service
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **部署到 Vercel**
   ```bash
   # 如果还没有安装 Vercel CLI
   npm i -g vercel
   
   # 部署
   vercel
   ```

4. **设置环境变量**
   在 Vercel Dashboard 中设置：
   - `GMAIL_USER`: `nbs0320@gmail.com`
   - `GMAIL_APP_PASSWORD`: `laexwfcolhbefydo`
   - `CONTACT_EMAIL`: `nbs0320@gmail.com`

5. **获取服务 URL**
   部署完成后，Vercel 会提供一个 URL，例如：
   ```
   https://gmail-mail-service.vercel.app
   ```

### 方法 B: 本地运行（开发测试）

1. **安装依赖**
   ```bash
   cd mail-service
   npm install
   ```

2. **设置环境变量**
   创建 `.env` 文件：
   ```
   GMAIL_USER=nbs0320@gmail.com
   GMAIL_APP_PASSWORD=laexwfcolhbefydo
   CONTACT_EMAIL=nbs0320@gmail.com
   PORT=3001
   ```

3. **启动服务**
   ```bash
   npm start
   ```

4. **测试服务**
   ```bash
   curl http://localhost:3001/health
   ```

## 步骤 2: 配置 Cloudflare Workers

1. **设置邮件服务 URL**
   ```bash
   cd api
   wrangler secret put MAIL_SERVICE_URL
   # 输入: https://your-mail-service.vercel.app
   # 或者本地测试: http://localhost:3001
   ```

2. **设置其他环境变量**（如果需要）
   ```bash
   wrangler secret put GMAIL_USER
   # 输入: nbs0320@gmail.com
   
   wrangler secret put CONTACT_EMAIL
   # 输入: nbs0320@gmail.com
   ```

3. **部署 API**
   ```bash
   cd api
   wrangler deploy
   ```

## 步骤 3: 测试联系表单

1. 访问联系表单页面
2. 填写表单并提交
3. 检查邮箱是否收到邮件

## 应用密钥信息

- **Gmail 邮箱**: `nbs0320@gmail.com`
- **应用密钥**: `laexwfcolhbefydo`（已配置在邮件服务中）

## 故障排除

### 邮件服务无法启动

1. **检查 Node.js 版本**
   ```bash
   node --version
   # 需要 >= 18.0.0
   ```

2. **检查依赖安装**
   ```bash
   cd mail-service
   npm install
   ```

### 邮件发送失败

1. **检查应用密钥**
   - 确保应用密钥格式正确（16位，无空格）
   - 确保已启用两步验证

2. **检查服务 URL**
   ```bash
   # 测试邮件服务
   curl https://your-mail-service.vercel.app/health
   ```

3. **查看日志**
   - Vercel Dashboard → Functions → Logs
   - Cloudflare Dashboard → Workers → Logs

### 连接错误

如果遇到连接错误，检查：
- 邮件服务是否正常运行
- `MAIL_SERVICE_URL` 环境变量是否正确
- 网络连接是否正常

## 安全注意事项

1. **应用密钥安全**
   - 不要将应用密钥提交到 Git
   - 使用环境变量存储
   - 定期轮换应用密钥

2. **服务安全**
   - 考虑添加 API 密钥验证
   - 限制访问来源（CORS）
   - 添加速率限制

## 完成！

现在您的联系表单已经配置完成，可以直接使用 Gmail 应用密钥发送邮件了！

当用户提交联系表单时：
1. 表单数据发送到 Cloudflare Workers API
2. Workers API 调用邮件服务
3. 邮件服务使用 Gmail SMTP 和应用密钥发送邮件
4. 邮件发送到配置的邮箱地址
