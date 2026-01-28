import { runDailyUpdate } from './daily-update-job';

// 检查是否在服务器环境中运行
if (typeof window === 'undefined') {
  // 在服务器端运行定时任务
  console.log('Setting up cron job for daily stock update...');
  
  // 设置每日下午3点（A股收盘后）执行更新
  setInterval(async () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const dayOfWeek = now.getDay();
    
    // 检查是否为交易日（周一至周五）且时间为下午3点
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour === 15 && minute === 0) {
      console.log('Starting scheduled daily update...');
      try {
        await runDailyUpdate();
        console.log('Scheduled daily update completed successfully');
      } catch (error) {
        console.error('Error in scheduled daily update:', error);
      }
    }
  }, 60000); // 每分钟检查一次时间
}

// 导出函数以供其他模块使用
export async function setupCronJob() {
  console.log('Cron job setup initiated');
  
  // 在Next.js应用启动时设置定时任务
  setInterval(async () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const dayOfWeek = now.getDay();
    
    // 检查是否为交易日（周一至周五）且时间为下午3点
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour === 15 && minute === 0) {
      console.log('Starting scheduled daily update...');
      try {
        await runDailyUpdate();
        console.log('Scheduled daily update completed successfully');
      } catch (error) {
        console.error('Error in scheduled daily update:', error);
      }
    }
  }, 60000); // 每分钟检查一次时间
}

// 立即执行一次更新（用于测试）
export async function runOnce() {
  console.log('Running one-time update...');
  try {
    await runDailyUpdate();
    console.log('One-time update completed successfully');
  } catch (error) {
    console.error('Error in one-time update:', error);
  }
}