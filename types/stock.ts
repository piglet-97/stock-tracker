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
}

export interface StockData {
  topGainers: StockRecord[];
  topLosers: StockRecord[];
  marketOverview: {
    risingCount: number;
    fallingCount: number;
    flatCount: number;
    totalTurnover: string;
  };
  lastUpdated: string;
}

export interface MarketStats {
  date: string;
  shanghaiIndex: number;
  shenzhenIndex: number;
  chinextIndex: number;
  totalMarketCap: string;
  averagePE: number;
}