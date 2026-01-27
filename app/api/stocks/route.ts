import { NextRequest } from 'next/server';
import { StockData, StockRecord } from '@/types/stock';
import { sql } from '@vercel/postgres';

// 定义数据库表结构对应的接口
interface DbStockRecord {
  id: number;
  symbol: string;
  name: string;
  open_price: number;
  close_price: number;
  change_percent: number;
  volatility: number;
  volume: number;
  turnover: number;
  high_price?: number;
  low_price?: number;
  prev_close?: number;
  pe_ratio?: number;
  pb_ratio?: number;
  market_cap?: number;
  updated_at: string;
}

export async function GET(request: NextRequest) {
  try {
    // 从 Vercel Postgres 数据库获取最新的涨幅榜和跌幅榜数据
    // 获取涨幅榜前20
    const gainersResult = await sql<DbStockRecord>`
      SELECT * FROM stock_records 
      WHERE change_percent > 0 
      ORDER BY change_percent DESC 
      LIMIT 20
    `;

    // 获取跌幅榜前20
    const losersResult = await sql<DbStockRecord>`
      SELECT * FROM stock_records 
      WHERE change_percent < 0 
      ORDER BY change_percent ASC 
      LIMIT 20
    `;

    // 转换数据库结果为前端需要的格式
    const topGainers: StockRecord[] = gainersResult.rows.map(row => ({
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
    }));

    const topLosers: StockRecord[] = losersResult.rows.map(row => ({
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
    }));

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
      topGainers,
      topLosers,
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
    
    // 如果数据库查询失败，返回模拟数据
    const mockStockData: StockData = {
      topGainers: [
        {
          id: 1,
          symbol: '000858',
          name: '五粮液',
          openPrice: 165.20,
          closePrice: 181.50,
          changePercent: 9.87,
          volatility: 12.34,
          volume: 12345678,
          turnover: 2145678901,
          highPrice: 183.20,
          lowPrice: 164.80,
          prevClose: 165.00,
          peRatio: 28.5,
          pbRatio: 6.2,
          marketCap: 720000000000,
          updated: new Date().toISOString()
        },
        {
          id: 2,
          symbol: '600519',
          name: '贵州茅台',
          openPrice: 1430.00,
          closePrice: 1573.20,
          changePercent: 10.02,
          volatility: 8.76,
          volume: 2345678,
          turnover: 3690123456,
          highPrice: 1580.00,
          lowPrice: 1425.50,
          prevClose: 1430.00,
          peRatio: 26.8,
          pbRatio: 8.9,
          marketCap: 2200000000000,
          updated: new Date().toISOString()
        },
        {
          id: 3,
          symbol: '002594',
          name: '比亚迪',
          openPrice: 245.60,
          closePrice: 269.80,
          changePercent: 9.85,
          volatility: 11.20,
          volume: 3456789,
          turnover: 932109876,
          highPrice: 271.50,
          lowPrice: 244.20,
          prevClose: 245.30,
          peRatio: 35.2,
          pbRatio: 4.8,
          marketCap: 800000000000,
          updated: new Date().toISOString()
        },
        {
          id: 4,
          symbol: '300750',
          name: '宁德时代',
          openPrice: 380.50,
          closePrice: 415.20,
          changePercent: 9.38,
          volatility: 10.85,
          volume: 4567890,
          turnover: 1890123456,
          highPrice: 418.00,
          lowPrice: 379.20,
          prevClose: 379.80,
          peRatio: 42.1,
          pbRatio: 7.3,
          marketCap: 950000000000,
          updated: new Date().toISOString()
        },
        {
          id: 5,
          symbol: '000596',
          name: '古井贡酒',
          openPrice: 270.30,
          closePrice: 295.60,
          changePercent: 9.36,
          volatility: 13.45,
          volume: 1234567,
          turnover: 365432109,
          highPrice: 298.50,
          lowPrice: 269.00,
          prevClose: 270.20,
          peRatio: 32.7,
          pbRatio: 5.9,
          marketCap: 70000000000,
          updated: new Date().toISOString()
        }
      ],
      topLosers: [
        {
          id: 1,
          symbol: '600036',
          name: '招商银行',
          openPrice: 38.50,
          closePrice: 35.20,
          changePercent: -8.57,
          volatility: 7.23,
          volume: 9876543,
          turnover: 345678901,
          highPrice: 38.80,
          lowPrice: 34.90,
          prevClose: 38.50,
          peRatio: 8.2,
          pbRatio: 0.8,
          marketCap: 900000000000,
          updated: new Date().toISOString()
        },
        {
          id: 2,
          symbol: '601318',
          name: '中国平安',
          openPrice: 45.80,
          closePrice: 42.10,
          changePercent: -8.08,
          volatility: 6.89,
          volume: 8765432,
          turnover: 369876543,
          highPrice: 46.20,
          lowPrice: 41.80,
          prevClose: 45.80,
          peRatio: 9.8,
          pbRatio: 1.2,
          marketCap: 800000000000,
          updated: new Date().toISOString()
        },
        {
          id: 3,
          symbol: '000001',
          name: '平安银行',
          openPrice: 12.30,
          closePrice: 11.30,
          changePercent: -8.13,
          volatility: 5.45,
          volume: 7654321,
          turnover: 865432109,
          highPrice: 12.50,
          lowPrice: 11.20,
          prevClose: 12.30,
          peRatio: 7.8,
          pbRatio: 0.7,
          marketCap: 230000000000,
          updated: new Date().toISOString()
        },
        {
          id: 4,
          symbol: '002415',
          name: '海康威视',
          openPrice: 32.50,
          closePrice: 29.90,
          changePercent: -8.00,
          volatility: 6.78,
          volume: 6543210,
          turnover: 195432109,
          highPrice: 32.80,
          lowPrice: 29.70,
          prevClose: 32.50,
          peRatio: 22.1,
          pbRatio: 3.1,
          marketCap: 270000000000,
          updated: new Date().toISOString()
        },
        {
          id: 5,
          symbol: '601166',
          name: '兴业银行',
          openPrice: 18.50,
          closePrice: 17.10,
          changePercent: -7.57,
          volatility: 5.23,
          volume: 5432109,
          turnover: 923456789,
          highPrice: 18.70,
          lowPrice: 17.00,
          prevClose: 18.50,
          peRatio: 6.2,
          pbRatio: 0.6,
          marketCap: 350000000000,
          updated: new Date().toISOString()
        }
      ],
      marketOverview: {
        totalUp: 2456,
        totalDown: 632,
        totalSame: 124,
        totalVolume: 4567890123,
        totalTurnover: 845620000000
      },
      updateTime: new Date().toISOString()
    };

    return Response.json(mockStockData);
  }
}