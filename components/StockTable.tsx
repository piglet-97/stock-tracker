'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StockRecord } from '@/types/stock';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockTableProps {
  stocks: StockRecord[];
  type: 'gainer' | 'loser';
}

export function StockTable({ stocks, type }: StockTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">排名</TableHead>
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
            <TableRow key={stock.id}>
              <TableCell className="font-medium">
                <Badge 
                  variant={index < 3 ? "default" : "secondary"}
                  className={index < 3 ? (type === 'gainer' ? "bg-green-500" : "bg-red-500") : ""}
                >
                  {index + 1}
                </Badge>
              </TableCell>
              <TableCell className="font-mono">{stock.symbol}</TableCell>
              <TableCell className="font-medium">{stock.name}</TableCell>
              <TableCell className="text-right">{stock.openPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">{stock.closePrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {type === 'gainer' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={type === 'gainer' ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                    {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">{stock.volatility.toFixed(2)}%</TableCell>
              <TableCell className="text-right">{(stock.volume / 10000).toFixed(2)}万</TableCell>
              <TableCell className="text-right">{(stock.turnover / 100000000).toFixed(2)}亿</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}