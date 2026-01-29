# A股涨跌幅榜追踪系统

一个使用 Next.js、Tailwind CSS 和 shadcn/ui 构建的 A 股市场数据追踪应用，每日收盘后记录和展示涨幅榜和跌幅榜前 20 名股票信息。支持通过OpenCode Agent Client Protocol (ACP)进行智能分析和自动化操作。

## 功能特性

- 📈 实时展示 A 股涨幅榜 TOP 20
- 📉 实时展示 A 股跌幅榜 TOP 20
- 💰 包含股票代码、名称、开盘价、收盘价、涨跌幅、振幅等关键指标
- 📊 额外提供成交量、成交额、市盈率、市净率、市值等分析指标
- 🔍 强大的搜索和过滤功能
- 📈 支持数据排序和高级筛选
- 🔗 集成OpenCode ACP协议进行智能分析
- 🔄 数据刷新功能
- 📱 响应式设计，适配移动设备
- 📊 增强的可视化数据展示

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **数据获取**: Next.js API Routes
- **数据库**: Vercel Postgres
- **类型检查**: TypeScript
- **智能代理**: OpenCode ACP (Agent Client Protocol)
- **图标**: Lucide React

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
- **最高价**: 当日最高价格
- **最低价**: 当日最低价格

## OpenCode ACP 协议集成

### ACP 协议功能
- **项目分析**: 通过ACP协议智能分析项目结构和代码
- **代码优化**: 基于AI建议进行代码改进
- **自动化修改**: 智能生成和应用代码变更
- **状态监控**: 实时监控ACP连接状态

### ACP 协议使用方法
```javascript
import OpenCodeACPClient from '@/lib/acp-client';

// 创建ACP客户端实例
const acpClient = new OpenCodeACPClient();

try {
  // 连接到OpenCode ACP
  await acpClient.connect('./code/stock-tracker');
  
  // 分析并修改项目
  const analysis = await acpClient.analyzeAndModifyProject('./code/stock-tracker');
  
  console.log('分析结果:', analysis);
} catch (error) {
  console.error('ACP操作失败:', error);
} finally {
  // 断开连接
  await acpClient.disconnect();
}
```

### ACP 协议工作流程
1. **连接**: 启动OpenCode ACP进程并建立连接
2. **初始化**: 发送初始化请求并验证协议版本
3. **创建会话**: 在指定工作目录创建新会话
4. **发送请求**: 发送分析或修改请求给OpenCode
5. **处理响应**: 接收并处理来自OpenCode的响应
6. **断开连接**: 完成操作后断开连接

## 增强功能

### 1. 搜索功能
- 实时股票代码和名称搜索
- 支持模糊匹配
- 搜索高亮显示

### 2. 数据排序
- 点击表头对数据进行排序
- 支持升序和降序
- 多字段排序支持

### 3. 高级筛选
- 按涨幅范围筛选
- 按板块分类筛选
- 清除所有筛选条件

### 4. 增强的表格组件
- 更多财务指标展示
- 交互式排序功能
- 视觉增强（颜色编码、图标等）
- 响应式设计

## 项目结构

```
stock-tracker/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API 路由
│   │   └── stocks/        # 股票数据 API
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── enhanced-page.tsx  # 增强版首页 (支持ACP)
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 基础组件
│   ├── StockTable.tsx    # 原始股票表格组件
│   ├── OptimizedStockTable.tsx # 优化后的股票表格组件
│   └── EnhancedStockTable.tsx # 增强版股票表格组件
├── lib/                  # 工具函数
│   ├── utils.ts          # 通用工具函数
│   ├── db.ts             # Vercel Postgres 数据库配置
│   ├── stock-service.ts  # 股票数据服务
│   └── acp-client.js     # OpenCode ACP协议客户端实现
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

## ACP 协议集成

确保系统中已安装OpenCode：

```bash
# 安装OpenCode
curl -fsSL https://opencode.dev/install | bash
```

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
3. 支持通过ACP协议进行智能分析和自动化更新
4. 可选：使用 WebSocket 连接实时数据源

## 待办事项

- [x] 创建基础 UI 界面
- [x] 集成 Vercel Postgres 数据库
- [x] 配置 Vercel 部署
- [x] 解决部署依赖问题
- [x] 实现真实 A 股数据获取
- [x] 添加OpenCode ACP协议支持
- [x] 优化界面组件和表格组件
- [x] 添加搜索功能
- [x] 添加更丰富的数据指标
- [x] 实现数据排序和高级筛选
- [ ] 添加图表可视化功能
- [ ] 实现用户自选股功能
- [ ] 添加技术指标分析
- [ ] 添加数据导出功能

## 数据获取与更新

### 初始化数据

项目启动后，需要先初始化最近7天的A股数据：

访问以下API端点：
```
GET /api/init-data
```

您也可以指定获取天数：
```
GET /api/init-data?days=14
```

### 自动更新

系统会自动在每个交易日收盘后更新当日数据。您也可以手动触发更新：

```
GET /api/update-daily
```

### ACP 协议智能分析

通过ACP协议可以实现智能化的项目分析和优化：

```javascript
// 示例：使用ACP协议分析和优化项目
const acpClient = new OpenCodeACPClient();
await acpClient.connect('./code/stock-tracker');

// 分析项目结构并提出改进建议
const analysis = await acpClient.analyzeAndModifyProject('./code/stock-tracker');

// 应用改进建议到项目中
console.log('项目分析完成，建议的改进:', analysis.improvements);

await acpClient.disconnect();
```

### 数据源

目前使用模拟数据，实际部署时需要替换为真实的数据提供商API，例如：

- Tongyi Financial API
- iFinD
- TuShare
- Wind资讯
- 东方财富API
- 同花顺API

## 部署故障排除

### npm install 退出码 1 的解决方案

如果在 Vercel 部署过程中遇到 `command npm install exited with 1` 错误，请检查以下几点：

1. **依赖冲突**：
   - 确保 package.json 中的依赖版本兼容
   - 检查是否有不兼容的包版本

2. **Node 版本**：
   - 项目要求 Node.js >= 18.17.0
   - 在 Vercel 项目设置中选择正确的 Node 版本

3. **内存限制**：
   - 某些函数可能超出默认内存限制
   - 已在 vercel.json 中增加 API 路由内存至 1024MB

4. **构建超时**：
   - 已在 vercel.json 中将最大持续时间设为 30 秒

## ACP 协议最佳实践

### 1. 连接管理
- 始终在使用完毕后断开连接
- 实现重连机制以应对网络波动
- 设置适当的超时时间

### 2. 错误处理
- 实现全面的错误捕获和处理
- 记录详细的错误日志用于调试
- 实现优雅降级机制

### 3. 性能优化
- 合理使用JSON-RPC协议进行通信
- 批量处理多个请求
- 正确处理异步响应

## 许可证

MIT