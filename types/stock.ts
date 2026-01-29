export interface StockRecord {
  id: number;
  symbol: string;
  name: string;
  openPrice: number;
  closePrice: number;
  changePercent: number;
  volatility: number;
  volume: number;
  turnover: number;
  highPrice?: number | null;
  lowPrice?: number | null;
  prevClose?: number | null;
  peRatio?: number | null;
  pbRatio?: number | null;
  marketCap?: number | null;
  updated?: string;
}

export interface StockData {
  topGainers: StockRecord[];
  topLosers: StockRecord[];
  marketOverview?: {
    totalUp: number;
    totalDown: number;
    totalSame: number;
    totalVolume: number;
    totalTurnover: string;
  };
  updateTime: string;
}

export interface MarketStats {
  date: string;
  shanghaiIndex: number;
  shenzhenIndex: number;
  chinextIndex: number;
  totalMarketCap: string;
  averagePE: number;
}