# 快速设置 Gmail 邮件发送

## 最简单的方法：使用 Resend（推荐）

### 1. 注册 Resend（5分钟）

1. 访问 https://resend.com
2. 点击 "Sign Up" 注册账户（免费账户每月 3,000 封邮件）
3. 验证邮箱

### 2. 获取 API Key

1. 登录 Resend Dashboard
2. 点击左侧菜单 "API Keys"
3. 点击 "Create API Key"
4. 输入名称（如 "Contact Form"）
5. 选择权限（选择 "Sending access"）
6. 点击 "Add" 并复制 API Key

### 3. 配置 Cloudflare Workers

```bash
cd api

# 设置 Gmail 邮箱（发送者）
wrangler secret put GMAIL_USER
# 输入: nbs0320@gmail.com

# 设置接收邮箱（接收联系表单的邮箱）
wrangler secret put CONTACT_EMAIL
# 输入: nbs0320@gmail.com

# 设置 Resend API Key
wrangler secret put RESEND_API_KEY
# 粘贴您刚才复制的 Resend API Key
```

### 4. 部署 API

```bash
cd api
wrangler deploy
```

### 5. 测试

1. 访问联系表单页面
2. 填写并提交表单
3. 检查邮箱是否收到邮件

## 完成！

现在联系表单已经可以使用了。当用户提交表单时，邮件会自动发送到您配置的邮箱。

## 注意事项

- Resend 免费账户每月可发送 3,000 封邮件
- 如果超过限制，可以升级到付费计划
- Resend 默认使用自己的发送服务器（不需要 Gmail 应用密钥）
- 如果您想使用 Gmail SMTP，可以在 Resend Dashboard 中配置自定义 SMTP

## 故障排除

如果邮件发送失败：

1. 检查环境变量是否正确设置：
   ```bash
   wrangler secret list
   ```

2. 查看 Cloudflare Workers 日志：
   - 访问 Cloudflare Dashboard
   - Workers & Pages → 选择您的 Worker → Logs

3. 检查 Resend Dashboard 中的发送记录：
   - Resend Dashboard → Emails → 查看发送历史

## 使用 Gmail 应用密钥（可选）

如果您想使用 Gmail SMTP 而不是 Resend 的默认服务器：

1. 在 Resend Dashboard 中配置自定义 SMTP：
   - Settings → SMTP → Add SMTP Server
   - 选择 "Gmail"
   - 输入 Gmail 地址和应用密钥
   - 保存

2. 或者使用其他支持 Gmail SMTP 的邮件服务（如 EmailJS）
