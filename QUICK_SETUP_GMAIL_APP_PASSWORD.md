# 快速设置 Gmail 应用密钥邮件发送

## 概述

本指南将帮助您使用 Gmail 应用密钥（App Password）通过 EmailJS 发送联系表单邮件。EmailJS 是一个免费的邮件服务，支持 Gmail SMTP 和应用密钥。

## 步骤 1: 获取 Gmail 应用密钥（5分钟）

1. 访问：https://myaccount.google.com/security
2. 确保已启用"两步验证"
3. 点击"应用密码" → 选择"邮件" → 生成密钥
4. **复制 16 位应用密钥**（格式：`xxxx xxxx xxxx xxxx`，使用时去掉空格）

## 步骤 2: 注册 EmailJS（3分钟）

1. 访问：https://www.emailjs.com
2. 注册免费账户（每月 200 封邮件）
3. 验证邮箱

## 步骤 3: 配置 Gmail SMTP 服务（5分钟）

1. 登录 EmailJS Dashboard：https://dashboard.emailjs.com
2. **添加 Gmail 服务**：
   - Email Services → Add New Service → 选择 "Gmail"
   - Gmail Address: `nbs0320@gmail.com`
   - Gmail Password: **粘贴您的应用密钥**（16位，无空格）
   - 保存并**复制 Service ID**（`service_xxxxx`）

## 步骤 4: 创建邮件模板（5分钟）

1. Email Templates → Create New Template
2. **配置模板**：
   - To Email: `{{to_email}}`
   - From Email: `{{from_email}}`
   - Reply To: `{{reply_to}}`
   - Subject: `{{subject}}`
   - Content:
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
3. 保存并**复制 Template ID**（`template_xxxxx`）

## 步骤 5: 获取 Public Key（1分钟）

1. Account → General
2. **复制 Public Key**（`xxxxxxxxxxxxx`）

## 步骤 6: 配置环境变量（5分钟）

```bash
cd api

wrangler secret put GMAIL_USER
# 输入: nbs0320@gmail.com

wrangler secret put CONTACT_EMAIL
# 输入: nbs0320@gmail.com

wrangler secret put GMAIL_APP_PASSWORD
# 输入: 您的16位应用密钥（无空格）

wrangler secret put EMAILJS_SERVICE_ID
# 输入: service_xxxxx

wrangler secret put EMAILJS_TEMPLATE_ID
# 输入: template_xxxxx

wrangler secret put EMAILJS_PUBLIC_KEY
# 输入: xxxxxxxxxxxxx
```

## 步骤 7: 部署并测试（2分钟）

```bash
cd api
wrangler deploy
```

然后访问联系表单页面测试！

## 完成！

现在您的联系表单已经可以使用 Gmail 应用密钥发送邮件了！

## 需要帮助？

详细配置说明请查看：`GMAIL_APP_PASSWORD_SETUP.md`
