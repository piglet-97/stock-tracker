'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StockTable } from '@/components/StockTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StockData, StockRecord } from '@/types/stock';

const mockTopGainers: StockRecord[] = [
  { id: 1, symbol: '000858', name: '五粮液', openPrice: 165.20, closePrice: 181.50, changePercent: 9.87, volatility: 12.34, volume: 12345678, turnover: 2145678901 },
  { id: 2, symbol: '600519', name: '贵州茅台', openPrice: 1430.00, closePrice: 1573.20, changePercent: 10.02, volatility: 8.76, volume: 2345678, turnover: 3690123456 },
  { id: 3, symbol: '002594', name: '比亚迪', openPrice: 245.60, closePrice: 269.80, changePercent: 9.85, volatility: 11.20, volume: 3456789, turnover: 932109876 },
  { id: 4, symbol: '300750', name: '宁德时代', openPrice: 380.50, closePrice: 415.20, changePercent: 9.38, volatility: 10.85, volume: 4567890, turnover: 1890123456 },
  { id: 5, symbol: '000596', name: '古井贡酒', openPrice: 270.30, closePrice: 295.60, changePercent: 9.36, volatility: 13.45, volume: 1234567, turnover: 365432109 },
];

const mockTopLosers: StockRecord[] = [
  { id: 1, symbol: '600036', name: '招商银行', openPrice: 38.50, closePrice: 35.20, changePercent: -8.57, volatility: 7.23, volume: 9876543, turnover: 345678901 },
  { id: 2, symbol: '601318', name: '中国平安', openPrice: 45.80, closePrice: 42.10, changePercent: -8.08, volatility: 6.89, volume: 8765432, turnover: 369876543 },
  { id: 3, symbol: '000001', name: '平安银行', openPrice: 12.30, closePrice: 11.30, changePercent: -8.13, volatility: 5.45, volume: 7654321, turnover: 865432109 },
  { id: 4, symbol: '002415', name: '海康威视', openPrice: 32.50, closePrice: 29.90, changePercent: -8.00, volatility: 6.78, volume: 6543210, turnover: 195432109 },
  { id: 5, symbol: '000858', name: '五粮液', openPrice: 180.20, closePrice: 165.80, changePercent: -7.99, volatility: 9.12, volume: 5432109, turnover: 901234567 },
];

export default function HomePage() {
  const [topGainers, setTopGainers] = useState<StockRecord[]>(mockTopGainers);
  const [topLosers, setTopLosers] = useState<StockRecord[]>(mockTopLosers);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString('zh-CN'));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshData = async () => {
    setIsLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleString('zh-CN'));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">A股涨跌幅榜追踪</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            实时追踪A股市场每日涨跌幅榜前20名，提供开盘价、收盘价、涨跌幅、振幅等关键指标
          </p>
          <div className="mt-4 flex justify-center items-center gap-4">
            <Badge variant="secondary">最后更新: {lastUpdated}</Badge>
            <Button onClick={refreshData} disabled={isLoading} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? '更新中...' : '刷新数据'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="gainers" className="text-lg py-6">涨幅榜</TabsTrigger>
            <TabsTrigger value="losers" className="text-lg py-6">跌幅榜</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gainers">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">A股涨幅榜 TOP 20</CardTitle>
                <CardDescription>按当日涨幅排序，展示股票代码、名称、价格变动等信息</CardDescription>
              </CardHeader>
              <CardContent>
                <StockTable stocks={topGainers} type="gainer" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="losers">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">A股跌幅榜 TOP 20</CardTitle>
                <CardDescription>按当日跌幅排序，展示股票代码、名称、价格变动等信息</CardDescription>
              </CardHeader>
              <CardContent>
                <StockTable stocks={topLosers} type="loser" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg">市场概况</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>上涨家数:</span> <span className="font-medium text-green-600">2,456</span></li>
                <li className="flex justify-between"><span>下跌家数:</span> <span className="font-medium text-red-600">632</span></li>
                <li className="flex justify-between"><span>平盘家数:</span> <span>124</span></li>
                <li className="flex justify-between"><span>成交额:</span> <span>8,456.2亿</span></li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-100">
            <CardHeader>
              <CardTitle className="text-lg">今日热点</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>最强板块:</span> <span className="font-medium">白酒</span></li>
                <li className="flex justify-between"><span>最弱板块:</span> <span className="font-medium">银行</span></li>
                <li className="flex justify-between"><span>主力资金:</span> <span className="font-medium text-green-600">净流入 245亿</span></li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50 border-amber-100">
            <CardHeader>
              <CardTitle className="text-lg">风险提示</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                数据仅供参考，不构成投资建议。股市有风险，投资需谨慎。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}