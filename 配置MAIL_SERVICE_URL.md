# 配置 MAIL_SERVICE_URL 步骤

## 前提条件

需要先获取 Vercel 邮件服务的 URL。

## 步骤 1: 获取 Vercel 邮件服务 URL

### 如果邮件服务已经部署：

1. 访问 Vercel Dashboard：https://vercel.com/dashboard
2. 找到您的邮件服务项目（mail-service）
3. 在项目页面查看 **Domains** 或 **Deployments**
4. 复制 URL，例如：`https://your-project-name.vercel.app`

### 如果还没有部署：

#### 选项 A: 通过 Vercel Dashboard（推荐）

1. 访问：https://vercel.com/dashboard
2. 点击 **Add New Project**
3. 选择 GitHub 仓库：`arjenou/kinkoshioji`
4. **重要**：设置 **Root Directory** 为 `mail-service`
   - 点击 "Edit" 按钮
   - 输入：`mail-service`
5. Framework Preset：选择 **Other**
6. 点击 **Deploy**
7. 等待部署完成
8. 复制部署 URL

#### 选项 B: 使用 Vercel CLI

```bash
cd mail-service
npm install
vercel
# 按照提示操作，部署完成后会显示 URL
```

## 步骤 2: 配置 Cloudflare Workers

获取 URL 后，运行：

```bash
cd api
wrangler secret put MAIL_SERVICE_URL
# 输入您的 Vercel 邮件服务 URL
# 例如：https://your-project-name.vercel.app
```

## 步骤 3: 测试

```bash
# 测试邮件服务
curl https://your-mail-service-url.vercel.app/api/health

# 应该返回：{"status":"ok","service":"gmail-mail-service"}
```

## 完成！

配置完成后，联系表单就可以正常发送邮件了。
