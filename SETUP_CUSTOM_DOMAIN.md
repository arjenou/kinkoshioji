# 配置自定义域名 api.kinkoshioji.co.jp

## 当前状态

- ✅ Workers 已部署: `https://kinkoshioji-api-production.wangyunjie1101.workers.dev`
- ⏳ 自定义域名待配置: `api.kinkoshioji.co.jp`

## 配置步骤

### 方法 1: 通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 选择域名 `kinkoshioji.co.jp`

2. **配置 DNS 记录**
   - 进入 **DNS** → **Records**
   - 点击 **Add record**
   - 配置：
     - **Type**: CNAME
     - **Name**: `api`
     - **Target**: `kinkoshioji-api-production.wangyunjie1101.workers.dev`
     - **Proxy status**: ✅ 开启（橙色云朵）
   - 点击 **Save**

3. **配置 Workers 路由**
   - 进入 **Workers & Pages**
   - 找到 Worker `kinkoshioji-api-production`
   - 进入 **设置** → **域和路由**
   - 点击 **+ 添加**
   - 配置：
     - **区域 (Zone)**: 选择 `kinkosyouji.co.jp` ⚠️ **重要：必须选择正确的域名**
     - **路由 (Route)**: `api.kinkoshioji.co.jp/*`
     - **失败模式**: 选择 "失败时自动关闭 (阻止)"
   - 点击 **添加路由**

4. **等待 DNS 传播**
   - 通常需要几分钟到几小时
   - 可以通过 `dig api.kinkosyouji.co.jp` 检查

5. **测试**
   ```bash
   curl https://api.kinkoshioji.co.jp/api/products
   ```

## 重要提示

⚠️ **在添加路由时，必须确保：**
- **区域 (Zone)** 选择的是 `kinkoshioji.co.jp`（不是其他域名）
- **路由 (Route)** 输入的是 `api.kinkoshioji.co.jp/*`

如果 Zone 下拉菜单中没有 `kinkoshioji.co.jp`，说明该域名还没有添加到 Cloudflare，需要先添加域名。

## 配置完成后更新

配置完成后，需要更新以下文件中的 API URL：

1. **管理前端环境变量** (在 Vercel Dashboard 中)
   - `NEXT_PUBLIC_API_URL`: `https://api.kinkoshioji.co.jp`

2. **静态网站** (`www.kinkosyouji.co.jp/js/products.js`)
   ```javascript
   const API_URL = 'https://api.kinkoshioji.co.jp';
   ```
   (已更新)

3. **提交更改**
   ```bash
   git add www.kinkosyouji.co.jp/js/products.js
   git commit -m "更新 API URL 为 api.kinkoshioji.co.jp"
   git push
   ```

## 验证

配置完成后，测试 API：

   ```bash
   # 测试获取商品列表
   curl https://api.kinkoshioji.co.jp/api/products

# 应该返回 JSON 格式的商品数据
```

## 故障排除

### DNS 未生效
- 检查 DNS 记录是否正确
- 等待 DNS 传播（最多 24 小时）
   - 使用 `dig api.kinkoshioji.co.jp` 检查

### 路由未生效
- 确认 Workers 路由配置正确
   - **确认 Zone 选择的是 `kinkoshioji.co.jp`**
- 检查 Worker 名称是否为 `kinkoshioji-api-production`
- 确认 Environment 选择为 `production`

### SSL 证书问题
- Cloudflare 会自动为自定义域名配置 SSL
- 如果遇到 SSL 错误，等待几分钟让证书生效

### 域名不在 Cloudflare 中
如果 `kinkoshioji.co.jp` 不在你的 Cloudflare 账户中：
1. 在 Cloudflare Dashboard 首页点击 "添加站点"
2. 输入 `kinkoshioji.co.jp`
3. 按照提示完成 DNS 配置
4. 更新域名服务器（如果需要）
5. 然后再配置 Workers 路由
