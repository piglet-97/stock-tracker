import { fetchAStockData, saveStockDataToDatabase } from './stock-data-fetcher';
import { StockRecord } from '@/types/stock';

// 检查是否为交易日
function isTradingDay(date: Date): boolean {
  // 简单检查：非周末即为交易日
  // 实际应用中需要考虑节假日
  const dayOfWeek = date.getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6; // 不是周日或周六
}

// 获取昨天的日期（交易日）
function getPreviousTradingDay(): Date {
  const date = new Date();
  // 设置为前一天
  date.setDate(date.getDate() - 1);
  
  // 如果前一天不是交易日，继续往前找
  while (!isTradingDay(date)) {
    date.setDate(date.getDate() - 1);
  }
  
  return date;
}

// 每日收盘后更新数据
export async function runDailyUpdate(): Promise<void> {
  try {
    const yesterday = getPreviousTradingDay();
    const dateStr = yesterday.toISOString().split('T')[0];
    
    console.log(`Starting daily update for date: ${dateStr}`);
    
    // 检查数据库中是否已存在当天数据
    // 如果存在则跳过，避免重复更新
    // 注意：这里需要根据实际情况调整检查逻辑
    
    // 获取A股数据
    const stockData = await fetchAStockData(dateStr);
    
    if (stockData.length > 0) {
      // 保存到数据库
      await saveStockDataToDatabase(stockData, dateStr);
      
      console.log(`Successfully updated stock data for ${dateStr}. ${stockData.length} records saved.`);
    } else {
      console.log(`No stock data retrieved for ${dateStr}.`);
    }
  } catch (error) {
    console.error('Error in daily update job:', error);
    throw error;
  }
}

// 手动运行更新（用于测试）
export async function runManualUpdate(dateStr?: string): Promise<void> {
  try {
    const targetDate = dateStr ? new Date(dateStr) : getPreviousTradingDay();
    const dateToUse = targetDate.toISOString().split('T')[0];
    
    console.log(`Running manual update for date: ${dateToUse}`);
    
    // 获取A股数据
    const stockData = await fetchAStockData(dateToUse);
    
    if (stockData.length > 0) {
      // 保存到数据库
      await saveStockDataToDatabase(stockData, dateToUse);
      
      console.log(`Successfully updated stock data for ${dateToUse}. ${stockData.length} records saved.`);
    } else {
      console.log(`No stock data retrieved for ${dateToUse}.`);
    }
  } catch (error) {
    console.error('Error in manual update job:', error);
    throw error;
  }
}

// 检查是否需要更新
export async function shouldUpdateToday(): Promise<boolean> {
  try {
    // 检查今天是否是交易日
    const today = new Date();
    if (!isTradingDay(today)) {
      console.log('Today is not a trading day.');
      return false;
    }
    
    // 检查数据库中是否已存在今天的收盘数据
    // 这里可以查询数据库看是否有今天的数据
    // 为简化，这里假设每天收盘后需要更新
    return true;
  } catch (error) {
    console.error('Error checking if update is needed:', error);
    return false;
  }
}