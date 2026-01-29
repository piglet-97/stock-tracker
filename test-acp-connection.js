// test-acp-connection.js
// 测试ACP连接功能

import ACPClient from './lib/acp-client';

async function testACPConnection() {
  console.log('开始测试ACP连接功能...');

  const client = new ACPClient();

  try {
    // 测试连接状态
    console.log('初始状态:', client.getStatus());
    
    // 测试连接
    console.log('正在连接...');
    await client.connect('http://localhost:3000');
    console.log('连接状态:', client.getStatus());
    
    // 测试刷新数据
    await client.refreshStockData();
    
    // 测试获取数据
    const data = await client.getStockTableData();
    console.log('获取到的股票数据:', data);
    
    // 测试搜索功能
    await client.searchStock('000858');
    
    // 断开连接
    await client.disconnect();
    console.log('断开连接后状态:', client.getStatus());
    
    console.log('ACP连接测试完成！');
  } catch (error) {
    console.error('ACP测试失败:', error);
  }
}

// 运行测试
testACPConnection();