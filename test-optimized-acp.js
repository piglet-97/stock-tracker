// test-optimized-acp.js
// Script to test ACP protocol with the optimized page

import ACPClient from './lib/acp-client';

async function testOptimizedACP() {
  console.log('🧪 Testing ACP Protocol with Optimized Page');
  
  const client = new ACPClient({
    headless: true,
    viewport: { width: 1280, height: 800 }
  });

  try {
    // Connect to the optimized page
    console.log('\n🔗 Connecting to optimized page...');
    await client.connect('http://localhost:3000');
    
    // Take initial screenshot of optimized page
    console.log('📸 Taking initial screenshot...');
    await client.getScreenshot('optimized-initial.png');
    
    // Test ACP features on optimized page
    console.log('\n✨ Testing optimized page features...');
    
    // Test refresh button
    console.log('🔄 Testing refresh functionality...');
    await client.refreshStockData();
    await client.getScreenshot('optimized-after-refresh.png');
    
    // Test tab switching
    console.log('📋 Testing tab switching...');
    await client.switchToTab('跌幅榜');
    await client.getScreenshot('optimized-loser-tab.png');
    
    await client.switchToTab('涨幅榜');
    await client.getScreenshot('optimized-gainer-tab.png');
    
    // Test search functionality
    console.log('🔍 Testing search functionality...');
    await client.executeCommand('fill', { 
      selector: 'input[placeholder="搜索股票代码或名称..."]', 
      value: '贵州茅台' 
    });
    await client.getScreenshot('optimized-search-result.png');
    
    // Wait a moment for search results to potentially update
    await client.page.waitForTimeout(1000);
    
    // Extract data from optimized table
    console.log('📊 Extracting data from optimized table...');
    const stockData = await client.getStockTableData();
    console.log(`Extracted ${stockData.length} stock records from optimized table`);
    
    if (stockData.length > 0) {
      console.log('\n📈 Sample record from optimized table:');
      console.log('- Rank:', stockData[0].rank);
      console.log('- Symbol:', stockData[0].symbol);
      console.log('- Name:', stockData[0].name);
      console.log('- Change %:', stockData[0].changePercent);
      console.log('- Volume:', stockData[0].volume);
    }
    
    // Test ACP status button
    console.log('\n📡 Testing ACP connection button...');
    const acpButton = await client.page.$('button:has-text("ACP连接"), button:has-text("ACP已连接"), button:has-text("连接中...")');
    if (acpButton) {
      console.log('ACP connection button found on page');
      await client.getScreenshot('optimized-with-acp-button.png');
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during optimized ACP test:', error);
  } finally {
    // Disconnect from the application
    console.log('\n📤 Disconnecting from application...');
    await client.disconnect();
    console.log('👋 Disconnected successfully');
  }
}

// Run the test
if (require.main === module) {
  testOptimizedACP();
}

export default testOptimizedACP;