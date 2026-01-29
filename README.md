# A股涨跌幅榜追踪系统 - 界面优化版

此项目是A股涨跌幅榜追踪系统的界面优化版本，实现了现代化UI设计和ACP（自动化控制协议）连接功能。

## 新增功能

### 1. 界面优化
- 现代化渐变背景设计
- 增强的股票表格组件，显示更多财务指标（市盈率、市净率、市值等）
- 响应式设计改进
- 行展开功能，显示更多详细信息
- 改进的颜色主题（绿色表示涨幅，红色表示跌幅）

### 2. ACP连接功能
- 集成了OpenCode ACP客户端
- 实现了自动化控制协议连接
- 支持远程控制和数据获取

## 使用方法

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 文件结构

- `app/optimized-page.tsx` - 优化后的主页组件
- `components/OptimizedStockTable.tsx` - 增强的股票表格组件
- `lib/acp-client.ts` - ACP客户端库
- `interface_optimization_spec.md` - 优化需求规范

## 主要改进

1. **增强的数据展示**：新增市盈率(PE)、市净率(PB)、市值等财务指标
2. **现代化UI**：使用渐变背景、阴影效果和现代化设计语言
3. **交互性增强**：添加搜索功能、ACP连接状态指示器
4. **响应式设计**：在各种屏幕尺寸上都有良好的显示效果
5. **可访问性**：遵循无障碍设计原则

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React (图标库)
- Playwright (用于ACP连接)

## ACP连接说明

ACP (Automated Control Protocol) 客户端允许外部工具与应用程序进行交互。使用ACP，您可以：

- 自动刷新股票数据
- 获取表格中的数据
- 执行搜索操作
- 监控连接状态

要使用ACP功能，请确保Playwright已正确安装并配置。