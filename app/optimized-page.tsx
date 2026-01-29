'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { OptimizedStockTable } from '@/components/OptimizedStockTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, BarChart3, Star, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StockData, StockRecord } from '@/types/stock';

const mockTopGainers: StockRecord[] = [
  { id: 1, symbol: '000858', name: '五粮液', openPrice: 165.20, closePrice: 181.50, changePercent: 9.87, volatility: 12.34, volume: 12345678, turnover: 2145678901 },
  { id: 2, symbol: '600519', name: '贵州茅台', openPrice: 1430.00, closePrice: 1573.20, changePercent: 10.02, volatility: 8.76, volume: 2345678, turnover: 3690123456 },
  { id: 3, symbol: '002594', name: '比亚迪', openPrice: 245.60, closePrice: 269.80, changePercent: 9.85, volatility: 11.20, volume: 3456789, turnover: 932109876 },
  { id: 4, symbol: '300750', name: '宁德时代', openPrice: 380.50, closePrice: 415.20, changePercent: 9.38, volatility: 10.85, volume: 4567890, turnover: 1890123456 },
  { id: 5, symbol: '000596', name: '古井贡酒', openPrice: 270.30, closePrice: 295.60, changePercent: 9.36, volatility: 13.45, volume: 1234567, turnover: 365432109 },
  { id: 6, symbol: '600887', name: '伊利股份', openPrice: 28.50, closePrice: 31.20, changePercent: 9.47, volatility: 9.82, volume: 5432109, turnover: 169582103 },
  { id: 7, symbol: '000568', name: '泸州老窖', openPrice: 180.20, closePrice: 196.80, changePercent: 9.21, volatility: 10.56, volume: 2345678, turnover: 460987654 },
  { id: 8, symbol: '601888', name: '中国中免', openPrice: 172.30, closePrice: 187.90, changePercent: 9.05, volatility: 11.34, volume: 3456789, turnover: 648912345 },
  { id: 9, symbol: '600196', name: '复星医药', openPrice: 22.10, closePrice: 24.05, changePercent: 8.82, volatility: 12.15, volume: 4567890, turnover: 109543210 },
  { id: 10, symbol: '600031', name: '三一重工', openPrice: 16.80, closePrice: 18.25, changePercent: 8.63, volatility: 8.97, volume: 6789012, turnover: 123456789 },
];

const mockTopLosers: StockRecord[] = [
  { id: 1, symbol: '600036', name: '招商银行', openPrice: 38.50, closePrice: 35.20, changePercent: -8.57, volatility: 7.23, volume: 9876543, turnover: 345678901 },
  { id: 2, symbol: '601318', name: '中国平安', openPrice: 45.80, closePrice: 42.10, changePercent: -8.08, volatility: 6.89, volume: 8765432, turnover: 369876543 },
  { id: 3, symbol: '000001', name: '平安银行', openPrice: 12.30, closePrice: 11.30, changePercent: -8.13, volatility: 5.45, volume: 7654321, turnover: 865432109 },
  { id: 4, symbol: '002415', name: '海康威视', openPrice: 32.50, closePrice: 29.90, changePercent: -8.00, volatility: 6.78, volume: 6543210, turnover: 195432109 },
  { id: 5, symbol: '000858', name: '五粮液', openPrice: 180.20, closePrice: 165.80, changePercent: -7.99, volatility: 9.12, volume: 5432109, turnover: 901234567 },
  { id: 6, symbol: '601398', name: '工商银行', openPrice: 4.85, closePrice: 4.50, changePercent: -7.22, volatility: 4.32, volume: 12345678, turnover: 556789012 },
  { id: 7, symbol: '601939', name: '建设银行', openPrice: 6.20, closePrice: 5.78, changePercent: -6.77, volatility: 3.89, volume: 9876543, turnover: 572109876 },
  { id: 8, symbol: '000002', name: '万科A', openPrice: 18.50, closePrice: 17.35, changePercent: -6.22, volatility: 5.67, volume: 8765432, turnover: 152345678 },
  { id: 9, symbol: '000651', name: '格力电器', openPrice: 35.20, closePrice: 33.10, changePercent: -5.97, volatility: 6.23, volume: 7654321, turnover: 253456789 },
  { id: 10, symbol: '002230', name: '科大讯飞', openPrice: 42.80, closePrice: 40.50, changePercent: -5.37, volatility: 7.89, volume: 6543210, turnover: 264567890 },
];

export default function OptimizedHomePage() {
  const [topGainers, setTopGainers] = useState<StockRecord[]>(mockTopGainers);
  const [topLosers, setTopLosers] = useState<StockRecord[]>(mockTopLosers);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString('zh-CN'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');

  const refreshData = async () => {
    setIsLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleString('zh-CN'));
      setIsLoading(false);
    }, 1000);
  };

  // 添加搜索过滤功能
  const filteredGainers = topGainers.filter(stock => 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLosers = topLosers.filter(stock => 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                A股涨跌幅榜追踪
              </h1>
              <p className="text-lg text-gray-600 mt-2 max-w-2xl">
                实时追踪A股市场每日涨跌幅榜前20名，提供开盘价、收盘价、涨跌幅、振幅等关键指标
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索股票..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-5 text-base min-w-[240px]"
                />
              </div>
              <Button onClick={refreshData} disabled={isLoading} className="py-5 px-4 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? '更新中...' : '刷新数据'}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="secondary" className="py-2 px-4 text-base">
                最后更新: {lastUpdated}
              </Badge>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="py-2 px-3 bg-green-50 border-green-200 text-green-700">
                  上涨: 2,456
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-red-50 border-red-200 text-red-700">
                  下跌: 632
                </Badge>
                <Badge variant="outline" className="py-2 px-3 bg-blue-50 border-blue-200 text-blue-700">
                  成交额: 8,456.2亿
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                自选
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                图表
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs 
          defaultValue="gainers" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value as 'gainers' | 'losers')}
        >
          <TabsList className="grid w-full grid-cols-2 mb-8 h-14">
            <TabsTrigger value="gainers" className="text-lg py-4 rounded-lg data-[state=active]:bg-white data-[state=inactive]:bg-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                涨幅榜 ({filteredGainers.length})
              </div>
            </TabsTrigger>
            <TabsTrigger value="losers" className="text-lg py-4 rounded-lg data-[state=active]:bg-white data-[state=inactive]:bg-gray-100">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                跌幅榜 ({filteredLosers.length})
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gainers">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <CardHeader className="p-0 text-white">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8" />
                    <div>
                      <CardTitle className="text-2xl">A股涨幅榜 TOP 20</CardTitle>
                      <CardDescription className="text-green-100 mt-1">
                        按当日涨幅排序，展示股票代码、名称、价格变动等信息
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="pt-6">
                <OptimizedStockTable stocks={filteredGainers} type="gainer" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="losers">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white">
                <CardHeader className="p-0 text-white">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-8 w-8" />
                    <div>
                      <CardTitle className="text-2xl">A股跌幅榜 TOP 20</CardTitle>
                      <CardDescription className="text-red-100 mt-1">
                        按当日跌幅排序，展示股票代码、名称、价格变动等信息
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="pt-6">
                <OptimizedStockTable stocks={filteredLosers} type="loser" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Market Overview Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                <BarChart3 className="h-5 w-5" />
                市场概况
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between items-center pb-2 border-b border-blue-100">
                  <span className="text-gray-600">上涨家数</span>
                  <span className="font-bold text-lg text-green-600">2,456</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-blue-100">
                  <span className="text-gray-600">下跌家数</span>
                  <span className="font-bold text-lg text-red-600">632</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-blue-100">
                  <span className="text-gray-600">平盘家数</span>
                  <span className="font-bold text-lg text-gray-600">124</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-600">成交额</span>
                  <span className="font-bold text-lg text-blue-600">8,456.2亿</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                <TrendingUp className="h-5 w-5" />
                今日热点
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between items-center pb-2 border-b border-purple-100">
                  <span className="text-gray-600">最强板块</span>
                  <span className="font-bold text-lg text-purple-600">白酒</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-purple-100">
                  <span className="text-gray-600">最弱板块</span>
                  <span className="font-bold text-lg text-purple-600">银行</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-600">主力资金</span>
                  <span className="font-bold text-lg text-green-600">净流入 245亿</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                <Star className="h-5 w-5" />
                风险提示
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-700">
                数据仅供参考，不构成投资建议。股市有风险，投资需谨慎。
              </p>
              <div className="mt-4 pt-3 border-t border-amber-200">
                <h4 className="font-medium text-amber-800 mb-2">特别提醒</h4>
                <ul className="text-xs space-y-1 text-amber-700">
                  <li>• 关注市场波动风险</li>
                  <li>• 合理配置资产比例</li>
                  <li>• 设置止损止盈点</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}