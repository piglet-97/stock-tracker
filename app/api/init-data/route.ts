import { NextRequest } from 'next/server';
import { fetchRecentAStockData, saveStockDataToDatabase } from '@/lib/stock-data-fetcher';

// 明确标记为动态路由，避免静态渲染错误
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数（天数，默认7天）
    // 修复动态服务器使用错误：使用相对路径解析查询参数
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get('days');
    const days = daysParam ? parseInt(daysParam) : 7;
    
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