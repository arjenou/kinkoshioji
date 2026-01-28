# 配置自定义域名 api.kinkoshioji.com

## 方法 1: 通过 Cloudflare Dashboard（推荐）

1. 登录 Cloudflare Dashboard
2. 选择你的域名 `kinkoshioji.com`
3. 进入 **Workers & Pages** → **Routes**
4. 点击 **Add route**
5. 配置：
   - **Route**: `api.kinkoshioji.com/*`
   - **Worker**: `kinkoshioji-api-production`
   - 点击 **Save**

## 方法 2: 通过 Wrangler CLI

```bash
cd api
wrangler routes add api.kinkoshioji.com/* kinkoshioji-api-production --env production
```

## 方法 3: 在 wrangler.toml 中配置

```toml
[env.production]
routes = [
  { pattern = "api.kinkoshioji.com/*", zone_name = "kinkoshioji.com" }
]
```

## DNS 配置

确保在 Cloudflare DNS 中添加了 CNAME 记录：
- **Type**: CNAME
- **Name**: api
- **Target**: `kinkoshioji-api-production.wangyunjie1101.workers.dev`
- **Proxy**: 开启（橙色云朵）

## 更新配置

配置完成后，需要更新：
1. `admin/.env.local` 中的 `NEXT_PUBLIC_API_URL`
2. `www.kinkosyouji.co.jp/js/products.js` 中的 `API_URL`
