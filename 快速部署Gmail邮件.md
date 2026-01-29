# 快速部署 Gmail 邮件服务

## ✅ 已配置信息

- **Gmail 邮箱**: `nbs0320@gmail.com`
- **应用密钥**: `laexwfcolhbefydo`

## 步骤 1: 部署邮件服务到 Vercel（5分钟）

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
   
   # 部署（首次部署会要求登录）
   vercel
   ```

4. **设置环境变量**
   
   部署完成后，在 Vercel Dashboard 中设置环境变量：
   - 访问：https://vercel.com/dashboard
   - 选择您的项目
   - Settings → Environment Variables
   - 添加以下变量：
     ```
     GMAIL_USER = nbs0320@gmail.com
     GMAIL_APP_PASSWORD = laexwfcolhbefydo
     CONTACT_EMAIL = nbs0320@gmail.com
     ```

5. **获取服务 URL**
   
   部署完成后，Vercel 会显示部署 URL，例如：
   ```
   https://gmail-mail-service-xxxxx.vercel.app
   ```
   
   或者您可以在 Vercel Dashboard 的 Domains 部分查看。

6. **测试服务**
   ```bash
   curl https://your-service-url.vercel.app/api/health
   ```
   
   应该返回：
   ```json
   {
     "status": "ok",
     "service": "gmail-mail-service"
   }
   ```

## 步骤 2: 配置 Cloudflare Workers（2分钟）

1. **设置邮件服务 URL**
   ```bash
   cd api
   wrangler secret put MAIL_SERVICE_URL
   # 输入: https://your-service-url.vercel.app
   ```

2. **部署 API**
   ```bash
   wrangler deploy
   ```

## 步骤 3: 测试（1分钟）

1. 访问联系表单页面
2. 填写表单并提交
3. 检查邮箱 `nbs0320@gmail.com` 是否收到邮件

## 完成！

现在您的联系表单已经可以使用 Gmail 应用密钥直接发送邮件了！

## 邮件服务端点

- **健康检查**: `GET /api/health` 或 `GET /health`
- **发送邮件**: `POST /api/send` 或 `POST /send`

## 故障排除

### 邮件服务部署失败

1. **检查 Node.js 版本**
   - Vercel 自动使用 Node.js 18+
   - 确保 `package.json` 中指定了正确的引擎版本

2. **检查依赖**
   ```bash
   cd mail-service
   npm install
   ```

### 邮件发送失败

1. **检查环境变量**
   - 确保在 Vercel Dashboard 中正确设置了所有环境变量
   - 特别是 `GMAIL_APP_PASSWORD`（16位，无空格）

2. **检查应用密钥**
   - 确保应用密钥格式正确：`laexwfcolhbefydo`
   - 确保已启用两步验证

3. **查看日志**
   - Vercel Dashboard → Functions → 选择函数 → Logs
   - Cloudflare Dashboard → Workers → Logs

### 连接错误

如果 Cloudflare Workers 无法连接到邮件服务：

1. **检查服务 URL**
   ```bash
   # 测试服务是否可访问
   curl https://your-service-url.vercel.app/api/health
   ```

2. **检查环境变量**
   ```bash
   wrangler secret list
   # 确认 MAIL_SERVICE_URL 已设置
   ```

## 安全提示

1. ✅ 应用密钥已配置在 Vercel 环境变量中（安全）
2. ✅ 不要将应用密钥提交到 Git
3. ✅ 定期检查 Vercel 函数日志

## 下一步

配置完成后，联系表单将自动：
1. 接收用户提交的表单数据
2. 通过 Cloudflare Workers API 处理
3. 调用邮件服务发送邮件
4. 使用 Gmail SMTP 和应用密钥直接发送

无需任何第三方邮件服务！
