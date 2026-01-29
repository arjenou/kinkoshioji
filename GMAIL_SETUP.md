# Gmail 应用密钥配置指南

本指南将帮助您配置 Gmail 应用密钥来发送联系表单邮件。

## 前提条件

1. Gmail 账户：`nbs0320@gmail.com`
2. 已启用两步验证（2-Step Verification）
3. Gmail 应用密钥（App Password）

## 步骤 1: 获取 Gmail 应用密钥

如果您还没有应用密钥，请按以下步骤获取：

1. 访问 Google 账户安全设置：https://myaccount.google.com/security
2. 确保已启用"两步验证"（2-Step Verification）
3. 在"两步验证"部分，点击"应用密码"（App passwords）
4. 选择应用类型为"邮件"（Mail）
5. 选择设备类型（如"其他"）
6. 输入应用名称（如"联系表单"）
7. 点击"生成"
8. 复制生成的 16 位应用密钥（格式：xxxx xxxx xxxx xxxx）

## 步骤 2: 选择邮件服务方案

由于 Cloudflare Workers 不支持直接 SMTP 连接，您需要选择一个邮件服务来发送邮件。以下是推荐方案：

### 方案 A: 使用 Resend API（推荐）

Resend 支持自定义 SMTP 服务器，包括 Gmail。

1. **注册 Resend 账户**
   - 访问 https://resend.com
   - 注册免费账户（每月 3,000 封邮件免费）

2. **获取 API Key**
   - 登录 Resend Dashboard
   - 进入 API Keys 页面
   - 创建新的 API Key
   - 复制 API Key

3. **配置 Gmail SMTP（可选）**
   - Resend 默认使用自己的发送服务器
   - 如果需要使用 Gmail SMTP，可以在 Resend 中配置自定义 SMTP
   - 或者直接使用 Resend 的默认发送服务器（推荐）

### 方案 B: 使用 EmailJS（免费方案）

EmailJS 是一个免费的邮件服务，支持 Gmail SMTP。

1. **注册 EmailJS 账户**
   - 访问 https://www.emailjs.com
   - 注册免费账户（每月 200 封邮件免费）

2. **添加 Gmail SMTP 服务**
   - 登录 EmailJS Dashboard
   - 进入 Email Services
   - 点击 "Add New Service"
   - 选择 "Gmail"
   - 输入 Gmail 地址和应用密钥
   - 保存服务 ID

3. **创建邮件模板**
   - 进入 Email Templates
   - 创建新模板
   - 配置模板内容
   - 保存模板 ID

4. **获取 Public Key**
   - 进入 Account → General
   - 复制 Public Key

### 方案 C: 创建独立的 Node.js 邮件服务（高级）

如果您需要完全控制，可以创建一个独立的 Node.js 服务来处理 SMTP。

## 步骤 3: 配置 Cloudflare Workers 环境变量

根据您选择的方案，设置相应的环境变量：

### 如果使用 Resend（推荐）

```bash
cd api
wrangler secret put GMAIL_USER
# 输入: nbs0320@gmail.com

wrangler secret put CONTACT_EMAIL
# 输入: nbs0320@gmail.com（接收联系表单的邮箱）

wrangler secret put RESEND_API_KEY
# 输入: 您的 Resend API Key
```

### 如果使用 EmailJS

需要修改 `api/src/index.ts` 中的 EmailJS 配置：
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_PUBLIC_KEY`

然后设置：

```bash
cd api
wrangler secret put GMAIL_USER
# 输入: nbs0320@gmail.com

wrangler secret put CONTACT_EMAIL
# 输入: nbs0320@gmail.com
```

## 步骤 4: 部署 API

```bash
cd api
npm install
wrangler deploy
```

## 步骤 5: 测试联系表单

1. 访问联系表单页面
2. 填写表单并提交
3. 检查邮箱是否收到邮件

## 故障排除

### 邮件发送失败

1. **检查环境变量**
   ```bash
   wrangler secret list
   ```

2. **查看 Workers 日志**
   - 在 Cloudflare Dashboard → Workers & Pages
   - 选择您的 Worker
   - 查看 Logs

3. **检查 API 端点**
   - 确保 API URL 正确：`https://api.kinkoshioji.co.jp`
   - 测试端点：`curl https://api.kinkoshioji.co.jp/api/products`

### Gmail 应用密钥问题

- 确保已启用两步验证
- 确保应用密钥格式正确（16 位，无空格）
- 如果应用密钥无效，重新生成一个新的

## 安全注意事项

1. **不要将应用密钥提交到 Git**
   - 使用 `wrangler secret put` 命令设置密钥
   - 确保 `.gitignore` 包含敏感文件

2. **定期轮换应用密钥**
   - 建议每 6 个月更换一次应用密钥

3. **限制 API 访问**
   - 联系表单 API 端点不需要认证（公开访问）
   - 考虑添加速率限制以防止滥用

## 联系表单字段

联系表单包含以下字段：
- お名前（姓名）- 必填
- メールアドレス（邮箱）- 必填
- 電話番号（电话）- 可选
- 会社名（公司名）- 可选
- 住所（地址）- 可选
- お問い合わせ内容（询问内容）- 必填

## 下一步

配置完成后，联系表单将自动发送邮件到您配置的邮箱地址。
