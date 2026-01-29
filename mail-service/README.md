# Gmail SMTP 邮件服务

直接使用 Gmail 应用密钥发送邮件的独立服务。

## 功能

- 使用 Gmail SMTP 和应用密钥发送邮件
- 支持 HTML 和纯文本邮件
- RESTful API 接口
- CORS 支持

## 快速开始

### 本地开发

1. **安装依赖**
   ```bash
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

4. **测试**
   ```bash
   curl http://localhost:3001/health
   ```

### 部署到 Vercel

1. **安装 Vercel CLI**（如果还没有）
   ```bash
   npm i -g vercel
   ```

2. **部署**
   ```bash
   vercel
   ```

3. **设置环境变量**
   在 Vercel Dashboard 中设置：
   - `GMAIL_USER`: nbs0320@gmail.com
   - `GMAIL_APP_PASSWORD`: laexwfcolhbefydo
   - `CONTACT_EMAIL`: nbs0320@gmail.com

## API 端点

### POST /send

发送邮件

**请求体：**
```json
{
  "to": "recipient@example.com",
  "replyTo": "sender@example.com",
  "subject": "邮件主题",
  "text": "纯文本内容",
  "html": "<h1>HTML 内容</h1>",
  "formData": {
    "name": "姓名",
    "email": "email@example.com",
    "tel": "电话",
    "company": "公司",
    "address": "地址",
    "message": "消息内容"
  }
}
```

**响应：**
```json
{
  "success": true,
  "messageId": "...",
  "message": "メールが正常に送信されました"
}
```

### GET /health

健康检查

**响应：**
```json
{
  "status": "ok",
  "service": "gmail-mail-service"
}
```

## 环境变量

- `GMAIL_USER`: Gmail 邮箱地址
- `GMAIL_APP_PASSWORD`: Gmail 应用密钥（16位，无空格）
- `CONTACT_EMAIL`: 接收联系表单的邮箱地址
- `PORT`: 服务端口（默认 3001）

## 安全注意事项

1. **不要将应用密钥提交到 Git**
   - 使用环境变量存储敏感信息
   - 确保 `.gitignore` 包含 `.env`

2. **生产环境**
   - 在 Vercel Dashboard 中设置环境变量
   - 不要将密钥硬编码在代码中

## 故障排除

### 邮件发送失败

1. **检查应用密钥**
   - 确保应用密钥格式正确（16位，无空格）
   - 确保已启用两步验证

2. **检查网络**
   - 确保可以访问 smtp.gmail.com:465

3. **查看日志**
   - 检查服务日志输出
   - 检查 Vercel 函数日志

## 更新 Cloudflare Workers 配置

在 Cloudflare Workers 中设置 `MAIL_SERVICE_URL` 环境变量：

```bash
cd api
wrangler secret put MAIL_SERVICE_URL
# 输入: https://your-mail-service.vercel.app
```
