'use client';

import { StockRecord } from '@/types/stock';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator, 
  Scale as Scale3D,
  Building,
  ChevronUp,
  ChevronDown,
  Eye,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface EnhancedStockTableProps {
  stocks: StockRecord[];
  type: 'gainer' | 'loser';
  sortConfig?: { key: keyof StockRecord; direction: 'asc' | 'desc' } | null;
  requestSort: (key: keyof StockRecord) => void;
}

export function EnhancedStockTable({ stocks = [], type, sortConfig, requestSort }: EnhancedStockTableProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatCurrency = (num: number) => {
    if (num >= 100000000) {
      return `¥${(num / 100000000).toFixed(2)}亿`;
    } else if (num >= 10000) {
      return `¥${(num / 10000).toFixed(2)}万`;
    }
    return `¥${formatNumber(num)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 100000000) {
      return `${(volume / 100000000).toFixed(2)}亿`;
    } else if (volume >= 10000) {
      return `${(volume / 10000).toFixed(2)}万`;
    }
    return volume.toString();
  };

  const formatMarketCap = (marketCap?: number | null) => {
    if (!marketCap || marketCap === null) return 'N/A';
    if (marketCap >= 1000000000000) {
      return `${(marketCap / 1000000000000).toFixed(2)}万亿`;
    } else if (marketCap >= 1000000000) {
      return `${(marketCap / 1000000000).toFixed(2)}千亿`;
    } else if (marketCap >= 100000000) {
      return `${(marketCap / 100000000).toFixed(2)}亿`;
    }
    return `${(marketCap / 10000).toFixed(2)}万`;
  };

  const formatPE = (pe?: number | null) => {
    if (!pe || pe <= 0 || pe === null) return 'N/A';
    return pe.toFixed(2);
  };

  const formatPB = (pb?: number | null) => {
    if (!pb || pb <= 0 || pb === null) return 'N/A';
    return pb.toFixed(2);
  };

  const formatHighLow = (high?: number | null, low?: number | null) => {
    if (!high || !low || high === null || low === null) return 'N/A';
    return `${formatNumber(low!)} - ${formatNumber(high!)}`;
  };

  const getSortIndicator = (columnName: keyof StockRecord) => {
    if (!sortConfig || sortConfig.key !== columnName) {
      return <ChevronUp className="h-3 w-3 opacity-50" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-3 w-3 text-blue-600" /> 
      : <ChevronDown className="h-3 w-3 text-blue-600" />;
  };

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50 sticky top-0 z-10">
            <TableRow>
              <TableHead 
                className="w-[60px] text-center cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('id')}
              >
                <div className="flex items-center justify-center gap-1">
                  排名
                  {getSortIndicator('id')}
                </div>
              </TableHead>
              <TableHead 
                className="w-[100px] cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('symbol')}
              >
                <div className="flex items-center gap-1">
                  股票代码
                  {getSortIndicator('symbol')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center gap-1">
                  股票名称
                  {getSortIndicator('name')}
                </div>
              </TableHead>
              <TableHead 
                className="text-right w-[100px] cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('openPrice')}
              >
                <div className="flex items-center justify-end gap-1">
                  开盘价
                  {getSortIndicator('openPrice')}
                </div>
              </TableHead>
              <TableHead 
                className="text-right w-[100px] cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('closePrice')}
              >
                <div className="flex items-center justify-end gap-1">
                  收盘价
                  {getSortIndicator('closePrice')}
                </div>
              </TableHead>
              <TableHead 
                className="text-right w-[100px] cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('changePercent')}
              >
                <div className="flex items-center justify-end gap-1">
                  涨跌幅
                  {getSortIndicator('changePercent')}
                </div>
              </TableHead>
              <TableHead 
                className="text-right w-[100px] cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('volatility')}
              >
                <div className="flex items-center justify-end gap-1">
                  振幅
                  {getSortIndicator('volatility')}
                </div>
              </TableHead>
              <TableHead 
                className="text-right w-[120px] cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('volume')}
              >
                <div className="flex items-center justify-end gap-1">
                  成交量
                  {getSortIndicator('volume')}
                </div>
              </TableHead>
              <TableHead 
                className="text-right w-[120px] cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('turnover')}
              >
                <div className="flex items-center justify-end gap-1">
                  成交额
                  {getSortIndicator('turnover')}
                </div>
              </TableHead>
              <TableHead 
                className="text-right w-[100px] cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('peRatio')}
              >
                <div className="flex items-center justify-end gap-1">
                  市盈率
                  {getSortIndicator('peRatio')}
                </div>
              </TableHead>
              <TableHead 
                className="text-right w-[100px] cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('pbRatio')}
              >
                <div className="flex items-center justify-end gap-1">
                  市净率
                  {getSortIndicator('pbRatio')}
                </div>
              </TableHead>
              <TableHead 
                className="text-right w-[120px] cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('marketCap')}
              >
                <div className="flex items-center justify-end gap-1">
                  市值
                  {getSortIndicator('marketCap')}
                </div>
              </TableHead>
              <TableHead className="text-right w-[100px]">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.length > 0 ? (
              stocks.map((stock, index) => (
                <TableRow 
                  key={stock.id} 
                  className={`
                    hover:bg-gray-50 transition-colors duration-100
                    ${index < 3 ? 'bg-blue-50/30' : ''}
                    ${stock.changePercent > 5 ? 'bg-green-50/20' : stock.changePercent < -5 ? 'bg-red-50/20' : ''}
                  `}
                >
                  <TableCell className="text-center font-medium">
                    <Badge 
                      variant={index < 3 ? "default" : "secondary"} 
                      className={`
                        w-8 h-8 flex items-center justify-center rounded-full p-0 text-sm
                        ${index < 3 ? (type === 'gainer' ? 'bg-green-500' : 'bg-red-500') : ''}
                      `}
                    >
                      {index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-bold text-blue-600">
                    {stock.symbol}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      {stock.name}
                      {stock.symbol.startsWith('688') && (
                        <Badge variant="outline" className="text-xs">科创</Badge>
                      )}
                      {stock.symbol.startsWith('300') && (
                        <Badge variant="outline" className="text-xs">创业</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                      <span>{formatNumber(stock.openPrice)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-bold">{formatNumber(stock.closePrice)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {type === 'gainer' ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`
                        font-bold 
                        ${stock.changePercent > 0 
                          ? 'text-green-600' 
                          : stock.changePercent < 0 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                        }
                      `}>
                        {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                      <span className="text-amber-700 font-medium">{stock.volatility.toFixed(2)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    <div className="flex items-center justify-end gap-1">
                      <Calculator className="h-3.5 w-3.5 text-gray-400" />
                      <span>{formatVolume(stock.volume)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                      <span>{formatVolume(stock.turnover)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Scale3D className="h-3.5 w-3.5 text-gray-400" />
                      <span className={`${
                        stock.peRatio && stock.peRatio !== null && stock.peRatio > 0 && stock.peRatio < 5 ? 'text-orange-600' :
                        stock.peRatio && stock.peRatio !== null && stock.peRatio > 50 ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {formatPE(stock.peRatio)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingDown className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-purple-600">{formatPB(stock.pbRatio)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Building className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-green-600">{formatMarketCap(stock.marketCap)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                        <Star className="h-4 w-4 text-yellow-500" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <TrendingDown className="h-10 w-10 text-gray-300" />
                    <span>暂无符合条件的股票数据</span>
                    <p className="text-sm text-gray-400">尝试调整筛选条件或刷新数据</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}