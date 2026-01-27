# Vercel 部署指南

本文档详细介绍了如何将 A股涨跌幅榜追踪系统 部署到 Vercel 平台，并配置 Vercel Postgres 数据库。

## 准备工作

1. 注册 [Vercel 账户](https://vercel.com/signup)
2. 安装 Vercel CLI（可选，用于命令行部署）
   ```bash
   npm install -g vercel
   ```

## 方式一：通过 Vercel 控制台部署

### 1. 导入项目
1. 访问 [Vercel 控制台](https://vercel.com/dashboard)
2. 点击 "Add New..." > "Project"
3. 选择 "Import Git Repository"
4. 搜索并导入 `piglet-97/stock-tracker` 仓库
5. 点击 "Import"

### 2. 配置项目
1. 在项目设置页面，确保以下配置正确：
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: 留空（由 Next.js 自动确定）

### 3. 配置环境变量
在 Environment Variables 部分添加以下变量：

```
POSTGRES_URL=your_postgres_connection_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
```

### 4. 配置 Vercel Postgres 数据库
1. 在 Vercel 仪表板中，导航到 Storage > Postgres
2. 点击 "Add Database"
3. 选择地区并创建数据库
4. 创建完成后，在 "Settings" > "Connection Strings" 中复制连接字符串
5. 将连接字符串分别添加到环境变量中：
   - `POSTGRES_URL` - 用于普通连接
   - `POSTGRES_URL_NON_POOLING` - 用于 Prisma 等需要直连的场景

### 5. 部署
配置完成后，点击 "Deploy" 按钮开始部署。

## 方式二：使用 Vercel CLI 部署

### 1. 登录 Vercel
```bash
vercel login
```

### 2. 链接到项目
```bash
cd ~/code/stock-tracker
vercel
```

### 3. 设置环境变量
```bash
vercel env add POSTGRES_URL
vercel env add POSTGRES_URL_NON_POOLING
```

### 4. 部署到生产环境
```bash
vercel --prod
```

## 数据库迁移

首次部署后，需要手动创建数据库表结构。可以通过以下方式之一完成：

### 方法一：使用 Vercel Postgres CLI
1. 在 Vercel 项目页面进入 Storage > 选择你的数据库
2. 点击 "Open in Browser" 进入数据库控制台
3. 执行以下 SQL 命令：

```sql
CREATE TABLE IF NOT EXISTS stock_records (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  open_price DECIMAL(10, 2),
  close_price DECIMAL(10, 2),
  change_percent DECIMAL(5, 2),
  volatility DECIMAL(5, 2),
  volume BIGINT,
  turnover BIGINT,
  high_price DECIMAL(10, 2),
  low_price DECIMAL(10, 2),
  prev_close DECIMAL(10, 2),
  pe_ratio DECIMAL(8, 2),
  pb_ratio DECIMAL(8, 2),
  market_cap BIGINT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_symbol ON stock_records(symbol);
CREATE INDEX idx_updated_at ON stock_records(updated_at);
```

### 方法二：使用 Prisma 迁移
如果你在本地设置了 Prisma，可以运行：
```bash
npx prisma migrate dev --name init-stock-table
```

## 数据获取和更新

### 数据源配置
本项目设计为可以从多个数据源获取A股数据：

1. **公开API**：使用如 Tongyi Financial、iFinD 等提供的金融数据API
2. **实时数据**：通过 WebSocket 连接实时数据源
3. **定时任务**：在每个交易日收盘后批量更新数据

### 数据更新策略
在 `lib/stock-service.ts` 中实现了数据获取逻辑，可以扩展以下功能：

1. 实现定时任务在收盘后更新数据
2. 添加数据验证和去重逻辑
3. 实现数据缓存机制

## 环境变量说明

| 变量名 | 说明 | 是否必需 |
|--------|------|----------|
| POSTGRES_URL | Vercel Postgres 数据库连接字符串 | 是 |
| POSTGRES_URL_NON_POOLING | 非连接池数据库连接字符串 | 是 |
| STOCK_API_KEY | 股票数据API密钥 | 否 |

## 故障排除

### 部署错误
- 如果出现构建错误，请检查 `package.json` 中的依赖是否正确
- 确保环境变量已正确设置

### 数据库连接错误
- 验证 `POSTGRES_URL` 是否正确
- 检查数据库是否已正确创建
- 确认防火墙规则允许连接

### API 错误
- 检查 `/api/stocks` 路由是否正确实现
- 验证数据库表结构是否与代码匹配

## 性能优化

1. **数据库查询优化**：在常用查询字段上创建索引
2. **缓存策略**：使用 Next.js 的 revalidation 功能缓存数据
3. **CDN 配置**：Vercel 自动提供 CDN 加速

## 扩展功能

部署完成后，可以考虑添加以下功能：

1. 用户认证系统
2. 个性化股票列表
3. 数据可视化图表
4. 报告生成
5. 邮件通知服务