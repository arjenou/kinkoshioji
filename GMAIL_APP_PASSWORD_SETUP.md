# Gmail 应用密钥配置指南

本指南将帮助您使用 Gmail 应用密钥（App Password）通过 EmailJS 发送联系表单邮件。

## 为什么使用 EmailJS？

Cloudflare Workers 不支持直接的 SMTP 连接，而 Gmail API 需要使用 OAuth 或 Service Account（不使用应用密钥）。EmailJS 是一个免费的邮件服务，支持 Gmail SMTP 和应用密钥，完美适合我们的需求。

## 步骤 1: 获取 Gmail 应用密钥

### 方法 A: 通过安全设置页面（推荐）

1. **访问 Google 账户安全设置**
   - 访问：https://myaccount.google.com/security
   - 确保已启用"两步验证"（2-Step Verification）

2. **进入两步验证详细设置**
   - 在安全设置页面，找到"两步验证"选项
   - **重要**：点击"两步验证"文字（不是复选框），进入详细设置页面
   - 或者直接访问：https://myaccount.google.com/signinoptions/two-step-verification

3. **找到应用密码选项**
   - 在两步验证详细页面中，向下滚动
   - 找到"应用密码"（App passwords）部分
   - 点击"应用密码"或"管理应用密码"

### 方法 B: 直接访问应用密码页面（最快）

**直接访问以下链接**（需要登录 Google 账户）：
```
https://myaccount.google.com/apppasswords
```

### 生成应用密钥

1. **选择应用和设备**
   - 应用：选择"邮件"（Mail）
   - 设备：选择"其他"或输入自定义名称（如"联系表单"）

2. **生成并复制密钥**
   - 点击"生成"按钮
   - **立即复制**生成的 16 位应用密钥
   - 格式：`xxxx xxxx xxxx xxxx`（4组4位数字）
   - **使用时要去掉空格**，变成：`xxxxxxxxxxxxxxxx`
   - ⚠️ **重要**：应用密码只显示一次，请立即保存！

### 如果找不到应用密码

- **确保两步验证已启用**：应用密码只在启用两步验证后才会显示
- **刷新页面**：按 F5 刷新浏览器页面
- **检查账户类型**：企业账户可能不显示应用密码选项
- **使用直接链接**：https://myaccount.google.com/apppasswords

## 步骤 2: 注册 EmailJS 账户

1. **访问 EmailJS**
   - 访问：https://www.emailjs.com
   - 点击 "Sign Up" 注册免费账户
   - 免费账户每月可发送 200 封邮件

2. **验证邮箱**
   - 检查邮箱并点击验证链接

## 步骤 3: 配置 Gmail SMTP 服务

1. **登录 EmailJS Dashboard**
   - 访问：https://dashboard.emailjs.com

2. **添加 Gmail SMTP 服务**
   - 点击左侧菜单 "Email Services"
   - 点击 "Add New Service"
   - 选择 "Gmail"
   - 填写以下信息：
     - **Service Name**: `gmail_contact`（任意名称）
     - **Gmail Address**: `nbs0320@gmail.com`
     - **Gmail Password**: 粘贴您的 Gmail 应用密钥（16位，无空格）
   - 点击 "Create Service"
   - **保存 Service ID**（格式：`service_xxxxx`）

## 步骤 4: 创建邮件模板

1. **创建新模板**
   - 点击左侧菜单 "Email Templates"
   - 点击 "Create New Template"
   - 输入模板名称：`contact_form`

2. **配置模板内容**
   - **To Email**: `{{to_email}}`
   - **From Name**: `{{from_name}}`
   - **From Email**: `{{from_email}}`
   - **Reply To**: `{{reply_to}}`
   - **Subject**: `{{subject}}`
   - **Content** (HTML):
     ```html
     <h2>お問い合わせ内容</h2>
     <p><strong>お名前:</strong> {{name}}</p>
     <p><strong>メールアドレス:</strong> {{to_email}}</p>
     <p><strong>電話番号:</strong> {{tel}}</p>
     <p><strong>会社名:</strong> {{company}}</p>
     <p><strong>住所:</strong> {{address}}</p>
     <hr>
     <h3>お問い合わせ内容:</h3>
     <p>{{message}}</p>
     <hr>
     <p><small>このメールは {{date}} に送信されました。</small></p>
     ```
   - 点击 "Save"
   - **保存 Template ID**（格式：`template_xxxxx`）

## 步骤 5: 获取 Public Key

1. **进入账户设置**
   - 点击左侧菜单 "Account" → "General"

2. **复制 Public Key**
   - 找到 "Public Key" 部分
   - 复制 Public Key（格式：`xxxxxxxxxxxxx`）

## 步骤 6: 配置 Cloudflare Workers 环境变量

在项目根目录的 `api` 文件夹中运行以下命令：

```bash
cd api

# 设置 Gmail 邮箱（发送者）
wrangler secret put GMAIL_USER
# 输入: nbs0320@gmail.com

# 设置接收邮箱（接收联系表单的邮箱）
wrangler secret put CONTACT_EMAIL
# 输入: nbs0320@gmail.com

# 设置 Gmail 应用密钥（虽然 EmailJS 会使用，但保留以备后用）
wrangler secret put GMAIL_APP_PASSWORD
# 输入: 您的16位应用密钥（无空格）

# 设置 EmailJS Service ID
wrangler secret put EMAILJS_SERVICE_ID
# 输入: service_xxxxx（从步骤3获取）

# 设置 EmailJS Template ID
wrangler secret put EMAILJS_TEMPLATE_ID
# 输入: template_xxxxx（从步骤4获取）

# 设置 EmailJS Public Key
wrangler secret put EMAILJS_PUBLIC_KEY
# 输入: xxxxxxxxxxxxx（从步骤5获取）
```

## 步骤 7: 更新 API 代码（如果需要）

检查 `api/src/index.ts` 中的模板参数是否匹配。当前代码发送的参数：
- `to_email`: 接收邮箱
- `from_email`: 发送者邮箱
- `reply_to`: 回复邮箱（用户邮箱）
- `subject`: 邮件主题
- `message`: 邮件内容
- `to_name`: 接收者名称
- `from_name`: 发送者名称

如果您的 EmailJS 模板使用了不同的参数名，需要更新代码中的 `template_params`。

## 步骤 8: 部署 API

```bash
cd api
npm install
wrangler deploy
```

## 步骤 9: 测试联系表单

1. 访问联系表单页面
2. 填写表单并提交
3. 检查邮箱是否收到邮件
4. 检查 EmailJS Dashboard → Emails 查看发送记录

## 故障排除

### 邮件发送失败

1. **检查环境变量**
   ```bash
   wrangler secret list
   ```

2. **查看 Cloudflare Workers 日志**
   - Cloudflare Dashboard → Workers & Pages
   - 选择您的 Worker → Logs

3. **检查 EmailJS Dashboard**
   - EmailJS Dashboard → Emails
   - 查看发送历史和错误信息

4. **验证 Gmail 应用密钥**
   - 确保应用密钥格式正确（16位，无空格）
   - 确保已启用两步验证
   - 如果无效，重新生成应用密钥

### 常见错误

- **"Invalid credentials"**: 检查 Gmail 应用密钥是否正确
- **"Service not found"**: 检查 EMAILJS_SERVICE_ID 是否正确
- **"Template not found"**: 检查 EMAILJS_TEMPLATE_ID 是否正确
- **"Unauthorized"**: 检查 EMAILJS_PUBLIC_KEY 是否正确

## 安全注意事项

1. **不要将应用密钥提交到 Git**
   - 使用 `wrangler secret put` 设置密钥
   - 确保 `.gitignore` 包含敏感文件

2. **定期轮换应用密钥**
   - 建议每 6 个月更换一次应用密钥

3. **限制 EmailJS 使用**
   - 免费账户每月 200 封邮件
   - 如需更多，可以升级到付费计划

## 完成！

现在您的联系表单已经配置完成，可以使用 Gmail 应用密钥发送邮件了！

当用户提交联系表单时，邮件会通过 EmailJS 使用您配置的 Gmail SMTP 服务发送到指定邮箱。
