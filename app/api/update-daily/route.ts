import { NextRequest } from 'next/server';
import { runDailyUpdate, shouldUpdateToday } from '@/lib/daily-update-job';

export async function GET(request: NextRequest) {
  try {
    // 检查是否应该更新
    const shouldUpdate = await shouldUpdateToday();
    
    if (!shouldUpdate) {
      return Response.json({
        success: true,
        message: 'No update needed for today (not a trading day or already updated)',
        updated: false,
      });
    }
    
    // 执行更新
    await runDailyUpdate();
    
    return Response.json({
      success: true,
      message: 'Successfully updated daily stock data',
      updated: true,
    });
  } catch (error) {
    console.error('Error updating daily stock data:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}