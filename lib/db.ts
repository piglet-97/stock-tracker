// Vercel Postgres 数据库配置
// 注意：在实际部署时，这些环境变量需要在 Vercel 项目设置中配置

import { Pool } from 'pg';

// 仅在服务器端使用
let client: Pool | undefined;

declare global {
  var pg: Pool | undefined;
}

if (process.env.NODE_ENV === 'production') {
  // 生产环境：使用 Vercel Postgres
  client = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
} else {
  // 开发环境：使用全局变量避免热重载时重复创建连接池
  if (!global.pg) {
    global.pg = new Pool({
      connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL,
    });
  }
  client = global.pg;
}

export { client };