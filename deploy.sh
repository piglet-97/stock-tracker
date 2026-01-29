#!/bin/bash

# 部署脚本 - 解决部署中可能出现的问题

echo "开始部署 stock-tracker 应用..."

# 确保使用正确的 Node 版本
echo "Node 版本: $(node --version)"
echo "npm 版本: $(npm --version)"

# 清除缓存
echo "清除 npm 缓存..."
npm cache clean --force

# 删除 node_modules 和重新安装
echo "重新安装依赖..."
rm -rf node_modules package-lock.json
npm install

# 构建项目
echo "构建项目..."
npm run build

# 如果构建成功，则启动应用
if [ $? -eq 0 ]; then
    echo "构建成功，启动应用..."
    npm start
else
    echo "构建失败，请检查错误信息"
    exit 1
fi