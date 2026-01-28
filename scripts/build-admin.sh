#!/bin/bash

# 构建管理界面并复制到静态网站目录的脚本

echo "开始构建管理前端（使用生产环境 API URL）..."

cd admin

# 设置环境变量并构建
NEXT_PUBLIC_API_URL=https://api.kinkoshioji.co.jp \
NEXT_PUBLIC_ADMIN_TOKEN=kinkoshioji-admin-bc3488451141916f \
npm run build

echo "构建完成，复制文件到静态网站目录..."

cd ..
rm -rf www.kinkosyouji.co.jp/admin/*
cp -r admin/out/* www.kinkosyouji.co.jp/admin/

echo "✅ 构建和复制完成！"
echo ""
echo "现在可以提交并推送代码："
echo "  git add www.kinkosyouji.co.jp/admin/"
echo "  git commit -m '更新管理界面'"
echo "  git push"
