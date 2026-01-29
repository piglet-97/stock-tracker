import { StockData } from '@/types/stock';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.example.com' // 替换为实际的生产API
  : 'http://localhost:3000';

/**
 * 获取股票数据
 * @returns Promise<StockData>
 */
export async function getStockData(): Promise<StockData> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stocks`, {
      method: 'GET',
      cache: 'no-store', // 禁用缓存以获取最新数据
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: StockData = await response.json();
    return data;
  } catch (error) {
    console.error('获取股票数据失败:', error);
    // 返回模拟数据作为后备方案
    return {
      topGainers: [],
      topLosers: [],
      updateTime: new Date().toISOString(),
    };
  }
}

/**
 * 格式化股票数据显示
 * @param value 数值
 * @param decimals 小数位数，默认2位
 * @returns 格式化后的字符串
 */
export function formatStockValue(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * 格式化百分比
 * @param value 百分比数值
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

/**
 * 根据涨跌幅获取颜色类
 * @param changePercent 涨跌幅
 * @returns 颜色类名
 */
export function getChangeColor(changePercent: number): string {
  if (changePercent > 0) {
    return 'text-green-500';
  } else if (changePercent < 0) {
    return 'text-red-500';
  }
  return 'text-gray-500';
}

/**
 * 格式化大额数字
 * @param num 数字
 * @returns 格式化后的字符串
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1_0000_0000) {
    return `${(num / 1_0000_0000).toFixed(2)}亿`;
  } else if (num >= 1_0000) {
    return `${(num / 1_0000).toFixed(2)}万`;
  }
  return num.toString();
}