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
- **类型检查**: TypeScript
- **数据库**: Prisma + SQLite/PostgreSQL (待实现)

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
│   └── stock-service.ts  # 股票数据服务
├── types/                # TypeScript 类型定义
│   └── stock.ts          # 股票数据类型
├── styles/               # 样式文件 (预留)
└── README.md
```

## 安装和运行

1. 克隆项目：
```bash
git clone <repository-url>
cd stock-tracker
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 访问 http://localhost:3000 查看应用

## 环境配置

创建 `.env.local` 文件并配置以下变量：

```env
DATABASE_URL="your_database_url"
STOCK_API_KEY="your_stock_api_key"
```

## API 接口

- `GET /api/stocks` - 获取最新股票数据

## 待办事项

- [ ] 集成真实 A 股数据 API
- [ ] 添加数据库存储功能
- [ ] 实现定时任务获取收盘数据
- [ ] 添加图表可视化功能
- [ ] 实现用户自选股功能
- [ ] 添加技术指标分析

## 部署

该项目可部署到 Vercel、Netlify 或其他支持 Next.js 的平台。

## 许可证

MIT