#!/bin/bash

# A股涨跌幅榜追踪系统 - Vercel 部署脚本

echo "==========================================="
echo "A股涨跌幅榜追踪系统 - Vercel 部署准备"
echo "==========================================="

echo
echo "项目已准备就绪，可以部署到 Vercel："
echo

echo "1. 数据库配置："
echo "   - 已配置 Vercel Postgres 数据库支持"
echo "   - 已创建数据库 schema 文件"
echo "   - 已更新 API 路由以使用数据库"

echo
echo "2. 部署配置："
echo "   - 已创建 vercel.json 配置文件"
echo "   - 已更新 package.json 添加必要依赖"
echo "   - 已创建环境变量示例文件 (.env.example)"

echo
echo "3. 部署步骤："
echo "   a. 访问 https://vercel.com/new/import"
echo "   b. 输入项目仓库地址：https://github.com/piglet-97/stock-tracker"
echo "   c. 在环境变量部分添加："
echo "       POSTGRES_URL=your_vercel_postgres_url"
echo "       POSTGRES_URL_NON_POOLING=your_vercel_postgres_non_pooling_url"
echo "   d. 点击 Deploy 按钮"

echo
echo "4. 首次部署后："
echo "   - 需要手动创建数据库表结构（见 README.md 中的 SQL 语句）"
echo "   - 配置定时任务在交易日收盘后更新数据"

echo
echo "有关详细部署说明，请参阅 VERCEL_DEPLOYMENT.md 文件"
echo

echo "==========================================="
echo "部署前请确保："
echo "- 已在 Vercel 创建 Postgres 数据库实例"
echo "- 已获取数据库连接字符串"
echo "- 已准备好部署所需的环境变量"
echo "==========================================="