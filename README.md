# A股涨跌幅榜追踪系统

一个使用 Next.js、Tailwind CSS 和 shadcn/ui 构建的 A 股市场数据追踪应用，每日收盘后记录和展示涨幅榜和跌幅榜前 20 名股票信息。

## 功能特性

- 📈 实时展示 A 股涨幅榜 TOP 20
- 📉 实时展示 A 股跌幅榜 TOP 20
- 💰 包含股票代码、名称、开盘价、收盘价、涨跌幅、振幅等关键指标
- 📊 额外提供成交量、成交额、市盈率、市净率等分析指标
- 🔄 数据刷新功能
- 📱 响应式设计，适配移动设备

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **数据获取**: Next.js API Routes
- **数据库**: Vercel Postgres
- **类型检查**: TypeScript

## 数据指标说明

### 主要指标
- **股票代码**: A股六位数字代码
- **股票名称**: 中文股票名称
- **开盘价**: 当日开盘价格
- **收盘价**: 当日收盘价格
- **涨跌幅**: (收盘价-开盘价)/开盘价 * 100%
- **振幅**: (最高价-最低价)/昨收价 * 100%

### 分析指标
- **成交量**: 当日总成交量（手）
- **成交额**: 当日总成交金额（元）
- **市盈率**: 股价/每股收益
- **市净率**: 股价/每股净资产
- **市值**: 总股本*股价

## 项目结构

```
stock-tracker/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API 路由
│   │   └── stocks/        # 股票数据 API
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 基础组件
│   └── StockTable.tsx    # 股票表格组件
├── lib/                  # 工具函数
│   ├── utils.ts          # 通用工具函数
│   ├── db.ts             # Vercel Postgres 数据库配置
│   └── stock-service.ts  # 股票数据服务
├── types/                # TypeScript 类型定义
│   └── stock.ts          # 股票数据类型
├── styles/               # 样式文件 (预留)
└── README.md
```

## 本地开发

1. 克隆项目：
```bash
git clone <repository-url>
cd stock-tracker
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
```bash
cp .env.example .env.local
# 编辑 .env.local 并填入 Vercel Postgres 连接信息
```

4. 启动开发服务器：
```bash
npm run dev
```

5. 访问 http://localhost:3000 查看应用

## Vercel 部署

### 1. 部署到 Vercel

点击下方按钮一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/piglet-97/stock-tracker)

### 2. 配置 Vercel Postgres 数据库

1. 在 Vercel 仪表板中，导航到您的项目
2. 进入 Settings > Storage > Connect to Postgres
3. 创建一个新的 Postgres 数据库或连接现有数据库
4. 在 Environment Variables 中添加数据库连接信息：
   - `POSTGRES_URL`: 主连接字符串
   - `POSTGRES_URL_NON_POOLING`: 非连接池连接字符串

### 3. 数据库 Schema

部署后，需要运行以下命令初始化数据库表：

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

## API 接口

- `GET /api/stocks` - 获取最新股票数据

## 环境配置

创建 `.env.local` 文件并配置以下变量：

```env
POSTGRES_URL="your_vercel_postgres_url"
POSTGRES_URL_NON_POOLING="your_vercel_postgres_non_pooling_url"
STOCK_API_KEY="your_stock_api_key"
```

## 数据更新机制

系统计划通过以下方式定期更新数据：

1. 使用 Next.js 的 revalidation 功能每小时更新一次
2. 通过定时任务在每个交易日收盘后批量更新数据
3. 可选：使用 WebSocket 连接实时数据源

## 待办事项

- [x] 创建基础 UI 界面
- [x] 集成 Vercel Postgres 数据库
- [x] 配置 Vercel 部署
- [ ] 实现真实 A 股数据获取
- [ ] 添加图表可视化功能
- [ ] 实现用户自选股功能
- [ ] 添加技术指标分析
- [ ] 添加数据导出功能

## 许可证

MIT