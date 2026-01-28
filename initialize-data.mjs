import { fetchRecentAStockData, saveStockDataToDatabase } from './lib/stock-data-fetcher.js';

async function initializeStockData() {
  console.log('开始初始化股票数据...');
  
  try {
    // 获取最近7天的数据
    const recentData = await fetchRecentAStockData(7);
    
    console.log(`获取到 ${Object.keys(recentData).length} 天的数据`);
    
    // 保存到数据库
    let totalRecords = 0;
    for (const [date, data] of Object.entries(recentData)) {
      if (data.length > 0) {
        await saveStockDataToDatabase(data, date);
        totalRecords += data.length;
        console.log(`已保存 ${data.length} 条记录，日期: ${date}`);
      }
    }
    
    console.log(`初始化完成！总共保存了 ${totalRecords} 条记录`);
  } catch (error) {
    console.error('初始化数据时出错:', error);
  }
}

// 运行初始化
initializeStockData();