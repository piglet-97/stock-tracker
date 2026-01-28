import { StockRecord } from '@/types/stock';
import { sql } from '@vercel/postgres';
import { fetchRealAStockData } from './real-stock-data-fetcher';

// 获取A股数据 - 优先使用真实数据，失败时回退到模拟数据
export async function fetchAStockData(date: string): Promise<StockRecord[]> {
  console.log(`Fetching A-share data for date: ${date}`);
  
  try {
    // 尝试获取真实数据
    const realData = await fetchRealAStockData(date);
    if (realData && realData.length > 0) {
      console.log(`Successfully fetched ${realData.length} real stock records for ${date}`);
      return realData;
    }
  } catch (error) {
    console.error(`Failed to fetch real stock data for ${date}:`, error);
    console.log('Falling back to mock data');
  }
  
  // 如果真实数据获取失败，返回模拟数据
  return generateMockAStockData(date);
}

// 生成模拟A股数据的函数
function generateMockAStockData(date: string): StockRecord[] {
  const stockCodes = [
    { symbol: '000001', name: '平安银行' },
    { symbol: '000002', name: '万科A' },
    { symbol: '000858', name: '五粮液' },
    { symbol: '002594', name: '比亚迪' },
    { symbol: '600036', name: '招商银行' },
    { symbol: '600519', name: '贵州茅台' },
    { symbol: '601318', name: '中国平安' },
    { symbol: '601857', name: '中国石油' },
    { symbol: '000596', name: '古井贡酒' },
    { symbol: '300750', name: '宁德时代' },
    { symbol: '002415', name: '海康威视' },
    { symbol: '601166', name: '兴业银行' },
    { symbol: '000063', name: '中兴通讯' },
    { symbol: '000651', name: '格力电器' },
    { symbol: '002304', name: '洋河股份' },
  ];

  return stockCodes.map((stock, index) => {
    const basePrice = 100 + Math.random() * 200;
    const changePercent = (Math.random() - 0.4) * 20; // -10% to +10%
    const openPrice = basePrice * (1 + (Math.random() - 0.5) * 0.05); // ±2.5% variation
    const closePrice = openPrice * (1 + changePercent / 100);
    const highPrice = Math.max(openPrice, closePrice) * (1 + Math.random() * 0.03);
    const lowPrice = Math.min(openPrice, closePrice) * (1 - Math.random() * 0.03);
    const volatility = ((highPrice - lowPrice) / openPrice) * 100;

    return {
      id: index + 1,
      symbol: stock.symbol,
      name: stock.name,
      openPrice: parseFloat(openPrice.toFixed(2)),
      closePrice: parseFloat(closePrice.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volatility: parseFloat(volatility.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000, // 1M-11M shares
      turnover: Math.floor(Math.random() * 10000000000) + 1000000000, // 1B-11B RMB
      highPrice: parseFloat(highPrice.toFixed(2)),
      lowPrice: parseFloat(lowPrice.toFixed(2)),
      prevClose: parseFloat((closePrice / (1 + changePercent / 100)).toFixed(2)),
      peRatio: parseFloat((15 + Math.random() * 25).toFixed(2)), // PE ratio 15-40
      pbRatio: parseFloat((0.5 + Math.random() * 3.5).toFixed(2)), // PB ratio 0.5-4.0
      marketCap: Math.floor(Math.random() * 500000000000) + 50000000000, // 50B-550B RMB
      updated: new Date().toISOString(),
    };
  });
}

import { fetchRecentRealAStockData } from './real-stock-data-fetcher';

// 获取最近N天的数据
export async function fetchRecentAStockData(days: number = 7): Promise<Record<string, StockRecord[]>> {
  try {
    // 优先使用真实数据
    const realData = await fetchRecentRealAStockData(days);
    return realData;
  } catch (error) {
    console.error('Failed to fetch recent real stock data:', error);
    console.log('Falling back to generating mock data for recent days');
    
    const results: Record<string, StockRecord[]> = {};
    
    for (let i = 0; i < days; i++) {
      // 计算日期 (跳过周末，简单模拟)
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // 简单跳过周末（实际应检查节假日）
      if (date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }
      
      const dateString = date.toISOString().split('T')[0];
      results[dateString] = await fetchAStockData(dateString);
    }
    
    return results;
  }
}

// 将数据保存到数据库
export async function saveStockDataToDatabase(data: StockRecord[], date: string) {
  try {
    for (const record of data) {
      // 检查是否已存在该股票当天的数据
      const existingRecord = await sql`
        SELECT id FROM stock_records 
        WHERE symbol = ${record.symbol} AND DATE(updated_at) = ${date}
      `;
      
      if (existingRecord.rowCount === 0) {
        // 插入新记录
        await sql`
          INSERT INTO stock_records (
            symbol, name, open_price, close_price, change_percent, 
            volatility, volume, turnover, high_price, low_price, 
            prev_close, pe_ratio, pb_ratio, market_cap, updated_at
          ) VALUES (
            ${record.symbol}, ${record.name}, ${record.openPrice}, 
            ${record.closePrice}, ${record.changePercent}, ${record.volatility}, 
            ${record.volume}, ${record.turnover}, ${record.highPrice || null}, 
            ${record.lowPrice || null}, ${record.prevClose || null}, 
            ${record.peRatio || null}, ${record.pbRatio || null}, 
            ${record.marketCap || null}, NOW()
          )
        `;
      } else {
        // 更新现有记录
        await sql`
          UPDATE stock_records 
          SET 
            name = ${record.name},
            open_price = ${record.openPrice},
            close_price = ${record.closePrice},
            change_percent = ${record.changePercent},
            volatility = ${record.volatility},
            volume = ${record.volume},
            turnover = ${record.turnover},
            high_price = ${record.highPrice || null},
            low_price = ${record.lowPrice || null},
            prev_close = ${record.prevClose || null},
            pe_ratio = ${record.peRatio || null},
            pb_ratio = ${record.pbRatio || null},
            market_cap = ${record.marketCap || null},
            updated_at = NOW()
          WHERE symbol = ${record.symbol} AND DATE(updated_at) = ${date}
        `;
      }
    }
    console.log(`Saved ${data.length} records for date ${date}`);
  } catch (error) {
    console.error('Error saving stock data to database:', error);
    throw error;
  }
}

// 获取数据库中最新的数据
export async function getLatestStockData(limit: number = 20) {
  try {
    // 获取最新的涨幅榜
    const gainersResult = await sql`
      SELECT * FROM stock_records 
      WHERE change_percent > 0 
      ORDER BY change_percent DESC, updated_at DESC
      LIMIT ${limit}
    `;

    // 获取最新的跌幅榜
    const losersResult = await sql`
      SELECT * FROM stock_records 
      WHERE change_percent < 0 
      ORDER BY change_percent ASC, updated_at DESC
      LIMIT ${limit}
    `;

    return {
      topGainers: gainersResult.rows,
      topLosers: losersResult.rows,
    };
  } catch (error) {
    console.error('Error fetching latest stock data:', error);
    throw error;
  }
}