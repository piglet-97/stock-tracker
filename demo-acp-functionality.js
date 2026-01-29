// demo-acp-functionality.js
// Script to demonstrate OpenCode ACP protocol functionality

import ACPClient from './lib/acp-client';

async function demoACPFunctionality() {
  console.log('🚀 Starting OpenCode ACP Protocol Demo');
  
  const client = new ACPClient({ 
    headless: true,
    viewport: { width: 1280, height: 720 }
  });

  try {
    // Connect to the stock tracker app
    console.log('\n🔌 Connecting to stock tracker application...');
    await client.connect('http://localhost:3000');
    
    // Take initial screenshot
    console.log('\n📸 Taking initial screenshot...');
    await client.getScreenshot('demo-initial.png');
    
    // Test refresh functionality
    console.log('\n🔄 Testing data refresh...');
    await client.refreshStockData();
    
    // Take screenshot after refresh
    console.log('📸 Taking screenshot after refresh...');
    await client.getScreenshot('demo-after-refresh.png');
    
    // Test switching tabs
    console.log('\n📋 Testing tab switching...');
    await client.switchToTab('跌幅榜');
    await client.getScreenshot('demo-loser-tab.png');
    
    await client.switchToTab('涨幅榜');
    await client.getScreenshot('demo-gainer-tab.png');
    
    // Test search functionality
    console.log('\n🔍 Testing search functionality...');
    await client.searchStock('贵州茅台');
    await client.getScreenshot('demo-search-result.png');
    
    // Extract data from the page
    console.log('\n📊 Extracting stock data...');
    const stockData = await client.getStockTableData();
    console.log('Extracted', stockData.length, 'stock records');
    
    // Print sample data
    if (stockData.length > 0) {
      console.log('\n📈 Sample stock data:');
      console.log('Rank:', stockData[0].rank);
      console.log('Symbol:', stockData[0].symbol);
      console.log('Name:', stockData[0].name);
      console.log('Change %:', stockData[0].changePercent);
    }
    
    console.log('\n✅ ACP Protocol Demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during ACP demo:', error);
  } finally {
    // Disconnect from the application
    console.log('\n📤 Disconnecting from application...');
    await client.disconnect();
    console.log('👋 Disconnected successfully');
  }
}

// Run the demo
if (require.main === module) {
  demoACPFunctionality();
}

export default demoACPFunctionality;