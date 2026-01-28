#!/bin/bash

echo "开始设置stock-tracker项目的初始数据..."

# 确保在项目目录中
cd /root/code/stock-tracker

echo "安装项目依赖..."
npm install

echo "启动Next.js开发服务器..."
nohup npm run dev > server.log 2>&1 &

# 等待服务器启动
echo "等待服务器启动..."
sleep 10

# 检查服务器是否已启动
if curl -s http://localhost:3000 > /dev/null; then
    echo "服务器已启动，开始初始化数据..."
    
    # 调用初始化API，获取最近7天的数据
    INIT_RESPONSE=$(curl -s http://localhost:3000/api/init-data)
    echo "初始化响应: $INIT_RESPONSE"
    
    # 调用每日更新API，获取最新数据
    UPDATE_RESPONSE=$(curl -s http://localhost:3000/api/update-daily)
    echo "更新响应: $UPDATE_RESPONSE"
    
    echo "数据初始化完成！"
else
    echo "服务器启动失败，请检查日志。"
fi

# 停止服务器
pkill -f "next dev"
echo "服务器已停止。"