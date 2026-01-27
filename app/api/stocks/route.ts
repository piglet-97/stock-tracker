import { NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';
import { StockData } from '@/types/stock';
import { getLatestStockData } from '@/lib/stock-data-fetcher';

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
        highPrice: row.high_price ? Number(row.high_price) : undefined,
        lowPrice: row.low_price ? Number(row.low_price) : undefined,
        prevClose: row.prev_close ? Number(row.prev_close) : undefined,
        peRatio: row.pe_ratio ? Number(row.pe_ratio) : undefined,
        pbRatio: row.pb_ratio ? Number(row.pb_ratio) : undefined,
        marketCap: row.market_cap ? Number(row.market_cap) : undefined,
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
        highPrice: row.high_price ? Number(row.high_price) : undefined,
        lowPrice: row.low_price ? Number(row.low_price) : undefined,
        prevClose: row.prev_close ? Number(row.prev_close) : undefined,
        peRatio: row.pe_ratio ? Number(row.pe_ratio) : undefined,
        pbRatio: row.pb_ratio ? Number(row.pb_ratio) : undefined,
        marketCap: row.market_cap ? Number(row.market_cap) : undefined,
        updated: row.updated_at
      })),
      marketOverview: {
        totalUp: Number(marketOverview.total_up) || 0,
        totalDown: Number(marketOverview.total_down) || 0,
        totalSame: Number(marketOverview.total_same) || 0,
        totalVolume: Number(marketOverview.total_volume) || 0,
        totalTurnover: Number(marketOverview.total_turnover) || 0,
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