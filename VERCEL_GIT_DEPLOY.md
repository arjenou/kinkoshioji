# 通过 Git Push 部署到 Vercel

## 当前状态

✅ 环境变量已在 Vercel Dashboard 中配置：
- `GMAIL_USER`: nbs0320@gmail.com
- `GMAIL_APP_PASSWORD`: laexwfcolhbefydo
- `CONTACT_EMAIL`: nbs0320@gmail.com

## 部署方式

### 方式 1: 将 mail-service 作为独立 Vercel 项目部署（推荐）

#### 步骤 1: 在 Vercel 中创建新项目

1. 访问 Vercel Dashboard：https://vercel.com/dashboard
2. 点击 "Add New Project"
3. 选择您的 Git 仓库（GitHub/GitLab/Bitbucket）
4. **重要**：在 "Root Directory" 中设置为 `mail-service`
   - 点击 "Edit" 按钮
   - 输入：`mail-service`
5. Framework Preset：选择 "Other"
6. Build Command：留空（Vercel 会自动检测）
7. Output Directory：留空
8. Install Command：`npm install`
9. 点击 "Deploy"

#### 步骤 2: 配置环境变量

在项目设置中（Settings → Environment Variables）添加：
- `GMAIL_USER`: `nbs0320@gmail.com`
- `GMAIL_APP_PASSWORD`: `laexwfcolhbefydo`
- `CONTACT_EMAIL`: `nbs0320@gmail.com`

#### 步骤 3: 获取部署 URL

部署完成后，Vercel 会提供项目 URL，例如：
```
https://gmail-mail-service-xxxxx.vercel.app
```

#### 步骤 4: 更新 Cloudflare Workers 配置

```bash
cd api
wrangler secret put MAIL_SERVICE_URL
# 输入: https://your-mail-service-url.vercel.app
wrangler deploy
```

### 方式 2: 在主项目中部署（如果 mail-service 在根目录）

如果您的 Vercel 项目根目录就是整个仓库：

1. Vercel 会自动检测 `mail-service/api/` 目录中的 Serverless Functions
2. 确保 `vercel.json` 配置正确
3. 环境变量已在 Dashboard 中配置
4. 直接 `git push` 即可自动部署

## Git Push 部署流程

### 1. 提交代码到 Git

```bash
# 确保所有文件已添加
git add mail-service/
git add api/src/index.ts
git commit -m "Add Gmail SMTP mail service"
git push
```

### 2. Vercel 自动部署

- Vercel 会自动检测到 Git push
- 触发新的部署
- 使用已配置的环境变量
- 部署完成后会显示部署 URL

### 3. 验证部署

```bash
# 测试健康检查端点
curl https://your-mail-service-url.vercel.app/api/health

# 应该返回：
# {"status":"ok","service":"gmail-mail-service"}
```

## 项目结构

```
kinkoshioji/
├── mail-service/          # Gmail SMTP 邮件服务
│   ├── api/
│   │   ├── send.js        # 发送邮件端点
│   │   └── health.js     # 健康检查端点
│   ├── package.json
│   ├── vercel.json       # Vercel 配置
│   └── README.md
├── api/                   # Cloudflare Workers API
│   └── src/
│       └── index.ts       # 调用邮件服务
└── www.kinkosyouji.co.jp/ # 静态网站
```

## 环境变量配置

### Vercel 项目（mail-service）

在 Vercel Dashboard → Settings → Environment Variables 中设置：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `GMAIL_USER` | `nbs0320@gmail.com` | All Environments |
| `GMAIL_APP_PASSWORD` | `laexwfcolhbefydo` | All Environments |
| `CONTACT_EMAIL` | `nbs0320@gmail.com` | All Environments |

### Cloudflare Workers

```bash
cd api
wrangler secret put MAIL_SERVICE_URL
# 输入您的 Vercel 邮件服务 URL
```

## 测试部署

### 1. 测试邮件服务

```bash
curl https://your-mail-service-url.vercel.app/api/health
```

### 2. 测试发送邮件（通过 Cloudflare Workers）

访问联系表单页面，填写并提交表单。

### 3. 查看日志

- **Vercel**: Dashboard → Deployments → 选择部署 → Functions → Logs
- **Cloudflare**: Dashboard → Workers → 选择 Worker → Logs

## 常见问题

### Q: 如何知道部署是否成功？

A: 
1. 检查 Vercel Dashboard 中的部署状态
2. 测试健康检查端点：`curl https://your-url.vercel.app/api/health`
3. 查看部署日志

### Q: 环境变量在哪里设置？

A: Vercel Dashboard → 项目 → Settings → Environment Variables

### Q: 如何更新代码？

A: 直接 `git push`，Vercel 会自动重新部署

### Q: 邮件服务 URL 是什么？

A: 在 Vercel Dashboard → 项目 → Domains 中查看，通常是：
```
https://your-project-name.vercel.app
```

## 完成！

现在您的邮件服务已经配置完成：

1. ✅ 代码已准备好
2. ✅ 环境变量已配置
3. ✅ 通过 `git push` 自动部署
4. ✅ Cloudflare Workers 调用邮件服务
5. ✅ 使用 Gmail 应用密钥直接发送邮件

每次 `git push` 后，Vercel 会自动部署最新代码！
