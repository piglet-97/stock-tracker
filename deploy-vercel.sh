#!/bin/bash

echo "开始部署到Vercel..."

# 首先检查是否已安装Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "正在安装Vercel CLI..."
    npm install -g vercel
fi

# 初始化Vercel项目
echo "初始化Vercel项目..."
cd ~/code/stock-tracker

# 检查是否已经链接到Vercel项目
if [ ! -f .vercel/project.json ]; then
    echo "链接到Vercel项目..."
    vercel
else
    echo "项目已链接到Vercel"
fi

echo "部署到Vercel..."
vercel --prod

echo "部署完成！"