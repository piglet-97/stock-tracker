'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { EnhancedStockTable } from '@/components/EnhancedStockTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Filter,
  ArrowUpNarrowWide as SortAsc,
  ArrowDownWideNarrow as SortDesc
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StockData, StockRecord } from '@/types/stock';
import OpenCodeACPClient from '@/lib/acp-client';

// Mock data with additional fields for enhanced functionality
const mockTopGainers: StockRecord[] = [
  { id: 1, symbol: '000858', name: '五粮液', openPrice: 165.20, closePrice: 181.50, changePercent: 9.87, volatility: 12.34, volume: 12345678, turnover: 2145678901, peRatio: 25.4, pbRatio: 4.2, marketCap: 750000000000, highPrice: 185.30, lowPrice: 163.20, prevClose: 165.10 },
  { id: 2, symbol: '600519', name: '贵州茅台', openPrice: 1430.00, closePrice: 1573.20, changePercent: 10.02, volatility: 8.76, volume: 2345678, turnover: 3690123456, peRatio: 28.7, pbRatio: 8.1, marketCap: 2200000000000, highPrice: 1600.00, lowPrice: 1420.50, prevClose: 1430.00 },
  { id: 3, symbol: '002594', name: '比亚迪', openPrice: 245.60, closePrice: 269.80, changePercent: 9.85, volatility: 11.20, volume: 3456789, turnover: 932109876, peRatio: 26.3, pbRatio: 3.8, marketCap: 800000000000, highPrice: 275.20, lowPrice: 243.10, prevClose: 245.30 },
  { id: 4, symbol: '300750', name: '宁德时代', openPrice: 380.50, closePrice: 415.20, changePercent: 9.38, volatility: 10.85, volume: 4567890, turnover: 1890123456, peRatio: 23.5, pbRatio: 5.1, marketCap: 950000000000, highPrice: 420.80, lowPrice: 378.20, prevClose: 379.50 },
  { id: 5, symbol: '000596', name: '古井贡酒', openPrice: 270.30, closePrice: 295.60, changePercent: 9.36, volatility: 13.45, volume: 1234567, turnover: 365432109, peRatio: 32.1, pbRatio: 6.4, marketCap: 120000000000, highPrice: 300.50, lowPrice: 268.80, prevClose: 270.20 },
  { id: 6, symbol: '002304', name: '洋河股份', openPrice: 110.50, closePrice: 119.80, changePercent: 8.42, volatility: 9.76, volume: 2345678, turnover: 280123456, peRatio: 21.3, pbRatio: 3.9, marketCap: 180000000000, highPrice: 122.50, lowPrice: 109.20, prevClose: 110.50 },
  { id: 7, symbol: '000860', name: '顺鑫农业', openPrice: 28.30, closePrice: 30.50, changePercent: 7.77, volatility: 11.45, volume: 3456789, turnover: 105432109, peRatio: 45.2, pbRatio: 2.1, marketCap: 90000000000, highPrice: 31.20, lowPrice: 27.80, prevClose: 28.30 },
  { id: 8, symbol: '600887', name: '伊利股份', openPrice: 29.80, closePrice: 32.10, changePercent: 7.72, volatility: 8.90, volume: 4567890, turnover: 293123456, peRatio: 22.8, pbRatio: 3.7, marketCap: 200000000000, highPrice: 32.80, lowPrice: 29.50, prevClose: 29.80 },
  { id: 9, symbol: '000568', name: '泸州老窖', openPrice: 170.20, closePrice: 182.80, changePercent: 7.40, volatility: 10.23, volume: 1234567, turnover: 225123456, peRatio: 24.6, pbRatio: 5.3, marketCap: 270000000000, highPrice: 185.50, lowPrice: 169.00, prevClose: 170.20 },
  { id: 10, symbol: '600196', name: '复星医药', openPrice: 22.50, closePrice: 24.10, changePercent: 7.11, volatility: 12.56, volume: 5678901, turnover: 136876543, peRatio: 18.9, pbRatio: 1.9, marketCap: 320000000000, highPrice: 24.80, lowPrice: 22.00, prevClose: 22.50 },
];

const mockTopLosers: StockRecord[] = [
  { id: 1, symbol: '600036', name: '招商银行', openPrice: 38.50, closePrice: 35.20, changePercent: -8.57, volatility: 7.23, volume: 9876543, turnover: 345678901, peRatio: 5.2, pbRatio: 0.8, marketCap: 900000000000, highPrice: 39.20, lowPrice: 34.80, prevClose: 38.50 },
  { id: 2, symbol: '601318', name: '中国平安', openPrice: 45.80, closePrice: 42.10, changePercent: -8.08, volatility: 6.89, volume: 8765432, turnover: 369876543, peRatio: 7.8, pbRatio: 0.9, marketCap: 1800000000000, highPrice: 46.50, lowPrice: 41.50, prevClose: 45.80 },
  { id: 3, symbol: '000001', name: '平安银行', openPrice: 12.30, closePrice: 11.30, changePercent: -8.13, volatility: 5.45, volume: 7654321, turnover: 865432109, peRatio: 4.9, pbRatio: 0.7, marketCap: 230000000000, highPrice: 12.50, lowPrice: 11.00, prevClose: 12.30 },
  { id: 4, symbol: '002415', name: '海康威视', openPrice: 32.50, closePrice: 29.90, changePercent: -8.00, volatility: 6.78, volume: 6543210, turnover: 195432109, peRatio: 18.3, pbRatio: 2.4, marketCap: 270000000000, highPrice: 33.20, lowPrice: 29.50, prevClose: 32.50 },
  { id: 5, symbol: '000858', name: '五粮液', openPrice: 180.20, closePrice: 165.80, changePercent: -7.99, volatility: 9.12, volume: 5432109, turnover: 901234567, peRatio: 25.4, pbRatio: 4.2, marketCap: 750000000000, highPrice: 182.50, lowPrice: 164.20, prevClose: 180.20 },
  { id: 6, symbol: '601888', name: '中国国旅', openPrice: 185.20, closePrice: 171.50, changePercent: -7.40, volatility: 8.45, volume: 2345678, turnover: 400123456, peRatio: 35.6, pbRatio: 6.1, marketCap: 330000000000, highPrice: 188.00, lowPrice: 170.00, prevClose: 185.20 },
  { id: 7, symbol: '601601', name: '中国太保', openPrice: 26.80, closePrice: 24.80, changePercent: -7.46, volatility: 6.23, volume: 3456789, turnover: 858123456, peRatio: 6.1, pbRatio: 0.8, marketCap: 900000000000, highPrice: 27.50, lowPrice: 24.50, prevClose: 26.80 },
  { id: 8, symbol: '601211', name: '国泰君安', openPrice: 16.20, closePrice: 15.00, changePercent: -7.41, volatility: 5.89, volume: 4567890, turnover: 685123456, peRatio: 8.2, pbRatio: 0.9, marketCap: 140000000000, highPrice: 16.80, lowPrice: 14.80, prevClose: 16.20 },
  { id: 9, symbol: '601398', name: '工商银行', openPrice: 5.20, closePrice: 4.83, changePercent: -7.12, volatility: 3.45, volume: 56789012, turnover: 275123456, peRatio: 4.8, pbRatio: 0.6, marketCap: 1700000000000, highPrice: 5.30, lowPrice: 4.80, prevClose: 5.20 },
  { id: 10, symbol: '601818', name: '光大银行', openPrice: 3.60, closePrice: 3.35, changePercent: -6.94, volatility: 4.23, volume: 67890123, turnover: 227123456, peRatio: 4.5, pbRatio: 0.5, marketCap: 180000000000, highPrice: 3.70, lowPrice: 3.30, prevClose: 3.60 },
];

export default function HomePage() {
  const [topGainers, setTopGainers] = useState<StockRecord[]>(mockTopGainers);
  const [topLosers, setTopLosers] = useState<StockRecord[]>(mockTopLosers);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleString('zh-CN'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof StockRecord; direction: 'asc' | 'desc' } | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<{ sector?: string; minChange?: number; maxChange?: number }>({});
  const [acpStatus, setAcpStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter and sort stocks based on search term and filters
  const filteredGainers = useMemo(() => {
    let result = [...topGainers];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(stock => 
        stock.name.toLowerCase().includes(term) || 
        stock.symbol.toLowerCase().includes(term)
      );
    }
    
    // Apply additional filters
    if (selectedFilters.minChange !== undefined) {
      result = result.filter(stock => stock.changePercent >= selectedFilters.minChange!);
    }
    if (selectedFilters.maxChange !== undefined) {
      result = result.filter(stock => stock.changePercent <= selectedFilters.maxChange!);
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key]! < b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key]! > b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [topGainers, searchTerm, selectedFilters, sortConfig]);

  const filteredLosers = useMemo(() => {
    let result = [...topLosers];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(stock => 
        stock.name.toLowerCase().includes(term) || 
        stock.symbol.toLowerCase().includes(term)
      );
    }
    
    // Apply additional filters
    if (selectedFilters.minChange !== undefined) {
      result = result.filter(stock => stock.changePercent >= selectedFilters.minChange!);
    }
    if (selectedFilters.maxChange !== undefined) {
      result = result.filter(stock => stock.changePercent <= selectedFilters.maxChange!);
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key]! < b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key]! > b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [topLosers, searchTerm, selectedFilters, sortConfig]);

  const requestSort = (key: keyof StockRecord) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call to refresh data
    try {
      // In a real implementation, this would fetch from an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date().toLocaleString('zh-CN'));
      
      // Update mock data to simulate new data
      setTopGainers(prev => [...prev]);
      setTopLosers(prev => [...prev]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectViaACP = async () => {
    setAcpStatus('connecting');
    try {
      const acpClient = new OpenCodeACPClient();
      await acpClient.connect('./code/stock-tracker');
      
      console.log('ACP connection established');
      
      setAcpStatus('connected');
      await acpClient.disconnect();
    } catch (error) {
      console.error('ACP connection failed:', error);
      setAcpStatus('disconnected');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortConfig(null);
    setSelectedFilters({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                A股涨跌幅榜追踪系统
              </h1>
              <p className="text-base text-gray-600 mt-2 max-w-2xl">
                实时追踪A股市场每日涨跌幅榜前20名，提供开盘价、收盘价、涨跌幅、振幅等关键指标
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  最后更新: {lastUpdated}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={refreshData} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? '更新中...' : '刷新数据'}
                </Button>
                
                <Button 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {showAdvancedFilters ? '隐藏筛选' : '高级筛选'}
                </Button>
                
                <Button 
                  onClick={connectViaACP}
                  variant={acpStatus === 'connected' ? 'default' : 'outline'}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className={`h-4 w-4 ${acpStatus === 'connecting' ? 'animate-pulse' : ''}`} />
                  {acpStatus === 'connected' ? 'ACP已连接' : 
                   acpStatus === 'connecting' ? '连接中...' : 'ACP分析'}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索股票代码或名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-5 text-base h-14 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {showAdvancedFilters && (
              <>
                <div className="md:col-span-3">
                  <Input
                    type="number"
                    placeholder="最小涨幅%"
                    value={selectedFilters.minChange ?? ''}
                    onChange={(e) => setSelectedFilters(prev => ({
                      ...prev,
                      minChange: e.target.value ? parseFloat(e.target.value) : undefined
                    }))}
                    className="h-14 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-3">
                  <Input
                    type="number"
                    placeholder="最大涨幅%"
                    value={selectedFilters.maxChange ?? ''}
                    onChange={(e) => setSelectedFilters(prev => ({
                      ...prev,
                      maxChange: e.target.value ? parseFloat(e.target.value) : undefined
                    }))}
                    className="h-14 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-1">
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full h-14"
                  >
                    清除
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
            <CardContent className="p-5 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-green-700">2,456</div>
              <div className="text-sm text-green-600">上涨家数</div>
              <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-red-100">
            <CardContent className="p-5 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-red-700">632</div>
              <div className="text-sm text-red-600">下跌家数</div>
              <TrendingDown className="h-5 w-5 text-red-600 mt-1" />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-50 to-sky-50 border-blue-100">
            <CardContent className="p-5 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-blue-700">8,456.2亿</div>
              <div className="text-sm text-blue-600">成交额</div>
              <DollarSign className="h-5 w-5 text-blue-600 mt-1" />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100">
            <CardContent className="p-5 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-purple-700">42.3%</div>
              <div className="text-sm text-purple-600">涨跌幅中位数</div>
              <BarChart3 className="h-5 w-5 text-purple-600 mt-1" />
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-14">
            <TabsTrigger value="gainers" className="text-lg py-0">
              <TrendingUp className="h-4 w-4 mr-2" />
              涨幅榜 ({filteredGainers.length})
            </TabsTrigger>
            <TabsTrigger value="losers" className="text-lg py-0">
              <TrendingDown className="h-4 w-4 mr-2" />
              跌幅榜 ({filteredLosers.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gainers">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      A股涨幅榜 TOP 20
                    </CardTitle>
                    <CardDescription className="mt-1">
                      按当日涨幅排序，展示股票代码、名称、价格变动等信息
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant={sortConfig?.key === 'changePercent' && sortConfig.direction === 'desc' ? 'default' : 'outline'}
                      onClick={() => requestSort('changePercent')}
                      className="flex items-center gap-1"
                    >
                      {sortConfig?.key === 'changePercent' && sortConfig.direction === 'desc' ? (
                        <SortDesc className="h-4 w-4" />
                      ) : sortConfig?.key === 'changePercent' && sortConfig.direction === 'asc' ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4 opacity-50" />
                      )}
                      涨幅
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant={sortConfig?.key === 'volume' && sortConfig.direction === 'desc' ? 'default' : 'outline'}
                      onClick={() => requestSort('volume')}
                      className="flex items-center gap-1"
                    >
                      {sortConfig?.key === 'volume' && sortConfig.direction === 'desc' ? (
                        <SortDesc className="h-4 w-4" />
                      ) : sortConfig?.key === 'volume' && sortConfig.direction === 'asc' ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4 opacity-50" />
                      )}
                      成交量
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <EnhancedStockTable 
                  stocks={filteredGainers} 
                  type="gainer" 
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="losers">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <TrendingDown className="h-6 w-6 text-red-600" />
                      A股跌幅榜 TOP 20
                    </CardTitle>
                    <CardDescription className="mt-1">
                      按当日跌幅排序，展示股票代码、名称、价格变动等信息
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant={sortConfig?.key === 'changePercent' && sortConfig.direction === 'asc' ? 'default' : 'outline'}
                      onClick={() => requestSort('changePercent')}
                      className="flex items-center gap-1"
                    >
                      {sortConfig?.key === 'changePercent' && sortConfig.direction === 'asc' ? (
                        <SortAsc className="h-4 w-4" />
                      ) : sortConfig?.key === 'changePercent' && sortConfig.direction === 'desc' ? (
                        <SortDesc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4 opacity-50" />
                      )}
                      跌幅
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant={sortConfig?.key === 'volume' && sortConfig.direction === 'desc' ? 'default' : 'outline'}
                      onClick={() => requestSort('volume')}
                      className="flex items-center gap-1"
                    >
                      {sortConfig?.key === 'volume' && sortConfig.direction === 'desc' ? (
                        <SortDesc className="h-4 w-4" />
                      ) : sortConfig?.key === 'volume' && sortConfig.direction === 'asc' ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4 opacity-50" />
                      )}
                      成交量
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <EnhancedStockTable 
                  stocks={filteredLosers} 
                  type="loser" 
                  sortConfig={sortConfig}
                  requestSort={requestSort}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Additional Information Section */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                今日热点板块
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between items-center pb-2 border-b border-blue-100">
                  <span className="font-medium">白酒</span>
                  <span className="font-bold text-green-600">+3.42%</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-blue-100">
                  <span className="font-medium">新能源车</span>
                  <span className="font-bold text-green-600">+2.87%</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b border-blue-100">
                  <span className="font-medium">光伏</span>
                  <span className="font-bold text-green-600">+2.15%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-medium">医药</span>
                  <span className="font-bold text-red-600">-0.78%</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                市场分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>主力资金流向</span> 
                  <span className="font-medium text-green-600">净流入 245亿</span>
                </li>
                <li className="flex justify-between">
                  <span>北向资金</span> 
                  <span className="font-medium text-green-600">净流入 68亿</span>
                </li>
                <li className="flex justify-between">
                  <span>融资融券余额</span> 
                  <span className="font-medium">1.65万亿</span>
                </li>
                <li className="flex justify-between">
                  <span>换手率</span> 
                  <span className="font-medium">2.45%</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                风险提示
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                数据仅供参考，不构成投资建议。股市有风险，投资需谨慎。
                请关注个股基本面及市场整体趋势变化。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}