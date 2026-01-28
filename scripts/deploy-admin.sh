#!/bin/bash

# 部署管理界面到 /admin 子路径的脚本

echo "开始构建管理前端..."

cd admin
npm install
npm run build

echo "构建完成，复制文件到静态网站目录..."

cd ..
mkdir -p www.kinkosyouji.co.jp/admin
cp -r admin/out/* www.kinkosyouji.co.jp/admin/

echo "文件复制完成！"
echo "现在可以提交并推送代码："
echo "  git add www.kinkosyouji.co.jp/admin"
echo "  git commit -m '添加管理界面到 /admin 路径'"
echo "  git push"
