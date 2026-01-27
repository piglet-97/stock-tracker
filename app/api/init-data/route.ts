import { NextRequest } from 'next/server';
import { fetchRecentAStockData, saveStockDataToDatabase } from '@/lib/stock-data-fetcher';

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数（天数，默认7天）
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '7');
    
    console.log(`Initializing stock data for last ${days} days`);
    
    // 获取最近N天的数据
    const recentData = await fetchRecentAStockData(days);
    
    // 保存到数据库
    let totalRecords = 0;
    for (const [date, data] of Object.entries(recentData)) {
      if (data.length > 0) {
        await saveStockDataToDatabase(data, date);
        totalRecords += data.length;
        console.log(`Saved ${data.length} records for ${date}`);
      }
    }
    
    return Response.json({
      success: true,
      message: `Successfully initialized stock data for last ${days} days`,
      totalRecords,
      processedDates: Object.keys(recentData),
    });
  } catch (error) {
    console.error('Error initializing stock data:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}