'use client';

import { StockRecord } from '@/types/stock';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface StockTableProps {
  stocks: StockRecord[];
  type: 'gainer' | 'loser';
}

export function OptimizedStockTable({ stocks, type }: StockTableProps) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 100000000) {
      return `${(volume / 100000000).toFixed(2)}亿`;
    } else if (volume >= 10000) {
      return `${(volume / 10000).toFixed(2)}万`;
    }
    return volume.toLocaleString('zh-CN');
  };

  const formatTurnover = (turnover: number) => {
    if (turnover >= 100000000) {
      return `${(turnover / 100000000).toFixed(2)}亿`;
    }
    return `${(turnover / 10000).toFixed(2)}万`;
  };

  const toggleRowExpansion = (id: number) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter(rowId => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[80px]">排名</TableHead>
            <TableHead>股票代码</TableHead>
            <TableHead>股票名称</TableHead>
            <TableHead className="text-right">开盘价</TableHead>
            <TableHead className="text-right">收盘价</TableHead>
            <TableHead className="text-right">涨跌幅</TableHead>
            <TableHead className="text-right">振幅</TableHead>
            <TableHead className="text-right hidden md:table-cell">成交量</TableHead>
            <TableHead className="text-right hidden md:table-cell">成交额</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock, index) => {
            const isExpanded = expandedRows.includes(stock.id);
            return (
              <>
                <TableRow 
                  key={stock.id} 
                  className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-blue-50' : ''}`}
                >
                  <TableCell className="font-medium">
                    <Badge 
                      variant={index < 3 ? "default" : "secondary"} 
                      className={`w-8 h-8 flex items-center justify-center rounded-full p-0 ${
                        index < 3 
                          ? type === 'gainer' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                            : 'bg-gradient-to-r from-red-500 to-rose-600'
                          : ''
                      }`}
                    >
                      {index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-bold text-gray-900">{stock.symbol}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{stock.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-gray-600">¥{formatNumber(stock.openPrice)}</TableCell>
                  <TableCell className="text-right font-bold">{formatNumber(stock.closePrice)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {type === 'gainer' ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`font-bold ${type === 'gainer' ? 'text-green-600' : 'text-red-600'}`}>
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
                  <TableCell className="text-right text-muted-foreground hidden md:table-cell">
                    {formatVolume(stock.volume)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground hidden md:table-cell">
                    {formatTurnover(stock.turnover)}
                  </TableCell>
                  <TableCell className="text-right">
                    <button 
                      onClick={() => toggleRowExpansion(stock.id)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <ChevronRight 
                        className={`h-4 w-4 text-gray-500 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>
                  </TableCell>
                </TableRow>
                
                {isExpanded && (
                  <TableRow className="bg-blue-50/50">
                    <TableCell colSpan={9} className="py-4 px-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">开盘价</h4>
                          <p className="font-medium">¥{formatNumber(stock.openPrice)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">收盘价</h4>
                          <p className="font-medium">¥{formatNumber(stock.closePrice)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">涨跌幅</h4>
                          <p className={`font-medium ${type === 'gainer' ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">振幅</h4>
                          <p className="font-medium text-amber-700">{stock.volatility.toFixed(2)}%</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">成交量</h4>
                          <p className="font-medium">{formatVolume(stock.volume)}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">成交额</h4>
                          <p className="font-medium">{formatTurnover(stock.turnover)}</p>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="text-sm font-medium text-gray-500">操作</h4>
                          <div className="flex gap-2 mt-1">
                            <button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded">
                              加自选
                            </button>
                            <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              查看图表
                            </button>
                            <button className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded">
                              买入
                            </button>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}