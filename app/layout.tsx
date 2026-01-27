import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "A股涨跌幅榜追踪",
  description: "实时追踪A股市场每日涨跌幅榜前20名",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={cn(inter.className, 'min-h-screen bg-background font-sans antialiased')}>
        {children}
      </body>
    </html>
  );
}
