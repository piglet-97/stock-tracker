import { NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';
import { StockData } from '@/types/stock';
import { getLatestStockData } from '@/lib/stock-data-fetcher';

// 明确标记为动态路由，避免静态渲染错误
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 从数据库获取最新的涨幅榜和跌幅榜数据
    const { topGainers, topLosers } = await getLatestStockData(20);

    // 获取市场概览数据
    const marketOverviewResult = await sql`
      SELECT 
        COUNT(CASE WHEN change_percent > 0 THEN 1 END) as total_up,
        COUNT(CASE WHEN change_percent < 0 THEN 1 END) as total_down,
        COUNT(CASE WHEN change_percent = 0 THEN 1 END) as total_same,
        SUM(volume) as total_volume,
        SUM(turnover) as total_turnover
      FROM stock_records
      WHERE updated_at = (SELECT MAX(updated_at) FROM stock_records)
    `;

    const marketOverview = marketOverviewResult.rows[0];

    const stockData: StockData = {
      topGainers: topGainers.map(row => ({
        id: row.id,
        symbol: row.symbol,
        name: row.name,
        openPrice: Number(row.open_price),
        closePrice: Number(row.close_price),
        changePercent: Number(row.change_percent),
        volatility: Number(row.volatility),
        volume: Number(row.volume),
        turnover: Number(row.turnover),
        highPrice: row.high_price !== null ? Number(row.high_price) : null,
        lowPrice: row.low_price !== null ? Number(row.low_price) : null,
        prevClose: row.prev_close !== null ? Number(row.prev_close) : null,
        peRatio: row.pe_ratio !== null ? Number(row.pe_ratio) : null,
        pbRatio: row.pb_ratio !== null ? Number(row.pb_ratio) : null,
        marketCap: row.market_cap !== null ? Number(row.market_cap) : null,
        updated: row.updated_at
      })),
      topLosers: topLosers.map(row => ({
        id: row.id,
        symbol: row.symbol,
        name: row.name,
        openPrice: Number(row.open_price),
        closePrice: Number(row.close_price),
        changePercent: Number(row.change_percent),
        volatility: Number(row.volatility),
        volume: Number(row.volume),
        turnover: Number(row.turnover),
        highPrice: row.high_price !== null ? Number(row.high_price) : null,
        lowPrice: row.low_price !== null ? Number(row.low_price) : null,
        prevClose: row.prev_close !== null ? Number(row.prev_close) : null,
        peRatio: row.pe_ratio !== null ? Number(row.pe_ratio) : null,
        pbRatio: row.pb_ratio !== null ? Number(row.pb_ratio) : null,
        marketCap: row.market_cap !== null ? Number(row.market_cap) : null,
        updated: row.updated_at
      })),
      marketOverview: {
        totalUp: Number(marketOverview.total_up) || 0,
        totalDown: Number(marketOverview.total_down) || 0,
        totalSame: Number(marketOverview.total_same) || 0,
        totalVolume: Number(marketOverview.total_volume) || 0,
        totalTurnover: String(marketOverview.total_turnover) || '0',
      },
      updateTime: new Date().toISOString()
    };

    return Response.json(stockData);
  } catch (error) {
    console.error('获取股票数据失败:', error);
    
    // 如果数据库查询失败，返回空数据
    return Response.json({
      topGainers: [],
      topLosers: [],
      updateTime: new Date().toISOString()
    });
  }
}