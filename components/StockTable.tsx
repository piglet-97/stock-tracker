'use client';

import { StockRecord } from '@/types/stock';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';

interface StockTableProps {
  stocks: StockRecord[];
  type: 'gainer' | 'loser';
}

export function StockTable({ stocks = [], type }: StockTableProps) {
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
    return volume.toString();
  };

  const formatTurnover = (turnover: number) => {
    if (turnover >= 100000000) {
      return `${(turnover / 100000000).toFixed(2)}亿`;
    }
    return `${(turnover / 10000).toFixed(2)}万`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">排名</TableHead>
            <TableHead>股票代码</TableHead>
            <TableHead>股票名称</TableHead>
            <TableHead className="text-right">开盘价</TableHead>
            <TableHead className="text-right">收盘价</TableHead>
            <TableHead className="text-right">涨跌幅</TableHead>
            <TableHead className="text-right">振幅</TableHead>
            <TableHead className="text-right">成交量</TableHead>
            <TableHead className="text-right">成交额</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock, index) => (
            <TableRow key={stock.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <Badge variant={index < 3 ? "default" : "secondary"} className="px-3 py-1">
                  {index + 1}
                </Badge>
              </TableCell>
              <TableCell className="font-mono font-bold">{stock.symbol}</TableCell>
              <TableCell className="font-medium">{stock.name}</TableCell>
              <TableCell className="text-right">¥{formatNumber(stock.openPrice)}</TableCell>
              <TableCell className="text-right font-bold">¥{formatNumber(stock.closePrice)}</TableCell>
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
              <TableCell className="text-right text-muted-foreground">
                {formatVolume(stock.volume)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatTurnover(stock.turnover)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}