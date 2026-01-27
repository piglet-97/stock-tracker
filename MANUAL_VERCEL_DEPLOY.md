# 手动部署到 Vercel 指南

由于我们无法在服务器环境中进行交互式登录，您需要手动完成 Vercel 部署。以下是详细步骤：

## 步骤 1: 获取 Vercel 访问令牌

1. 在您的本地计算机上打开浏览器，访问 https://vercel.com
2. 使用 GitHub 账户登录 Vercel
3. 登录后，访问 https://vercel.com/account/tokens
4. 点击 "Create a Team Token" 或 "Create a Personal Token"
5. 为令牌命名（例如 "deployment-token"），然后点击 "Create"
6. 复制生成的令牌（请妥善保管，不要泄露）

## 步骤 2: 在本地部署项目

如果您希望在本地部署，可以执行以下操作：

### 选项 A: 使用 Vercel CLI

1. 在本地终端安装 Vercel CLI：
   ```bash
   npm install -g vercel
   ```

2. 登录 Vercel：
   ```bash
   vercel login
   ```
   这会引导您到浏览器完成 GitHub 登录

3. 克隆此项目到本地：
   ```bash
   git clone https://github.com/piglet-97/stock-tracker.git
   cd stock-tracker
   ```

4. 部署到 Vercel：
   ```bash
   vercel --prod
   ```

### 选项 B: 通过 Vercel 网站导入

1. 访问 https://vercel.com/new
2. 点击 "Import Project"
3. 选择 "From Git Repository"
4. 选择 GitHub 并授权访问
5. 选择 piglet-97/stock-tracker 仓库
6. 在项目配置中：
   - Framework: Next.js
   - 添加环境变量：
     - `POSTGRES_URL`: 您的 Vercel Postgres 数据库连接字符串
     - `POSTGRES_URL_NON_POOLING`: 您的 Vercel Postgres 非连接池连接字符串
7. 点击 "Deploy"

## 步骤 3: 配置 Vercel Postgres 数据库

1. 部署完成后，在 Vercel 仪表板中转到您的项目
2. 转到 "Storage" 选项卡
3. 点击 "Add Storage" > "PostgreSQL"
4. 选择您的团队和区域
5. 点击 "Create" 创建数据库
6. 创建完成后，复制连接字符串并在项目设置的环境变量中配置它们

## 步骤 4: 首次部署后配置

1. 数据库表结构创建：
   在 Vercel Postgres 数据库中运行以下 SQL：
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

## 步骤 5: 验证部署

部署完成后，您将获得一个类似 `https://stock-tracker.vercel.app` 的 URL。
访问该 URL 以确认应用已成功部署。

---

注意：此项目已完全配置为可在 Vercel 上运行，包括 Vercel Postgres 数据库集成。只需按照上述步骤完成部署即可。