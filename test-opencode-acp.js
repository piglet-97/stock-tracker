import { chromium } from 'playwright';

async function testOpenCodeACPConnection() {
  console.log('正在测试OpenCode ACP连接...');
  
  try {
    // 启动浏览器
    const browser = await chromium.launch({ headless: true }); // 使用无头模式
    const page = await browser.newPage();
    
    // 访问我们的stock-tracker应用
    console.log('正在访问 http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    
    // 等待页面加载完成
    await page.waitForSelector('h1.text-4xl', { timeout: 10000 });
    
    // 截图以验证界面
    await page.screenshot({ path: 'opencode_acp_test_result.png', fullPage: true });
    console.log('已截图保存为 opencode_acp_test_result.png');
    
    // 检查页面标题
    const title = await page.title();
    console.log('页面标题:', title);
    
    // 检查是否存在预期的元素
    const headerElement = await page.$('h1.text-4xl');
    if (headerElement) {
      const headerText = await headerElement.textContent();
      console.log('主标题文本:', headerText);
    }
    
    // 测试搜索功能
    const searchInput = await page.$('input[placeholder="搜索股票..."]');
    if (searchInput) {
      await searchInput.fill('五粮液');
      console.log('搜索功能测试完成');
    }
    
    // 测试刷新按钮
    const refreshButton = await page.$('button:text("刷新数据")');
    if (refreshButton) {
      await refreshButton.click();
      console.log('刷新功能测试完成');
      await page.waitForTimeout(2000); // 等待刷新完成
    }
    
    // 测试标签切换
    const loserTab = await page.$('button:text("跌幅榜")');
    if (loserTab) {
      await loserTab.click();
      console.log('标签切换功能测试完成');
      await page.waitForTimeout(1000);
    }
    
    // 再次截图
    await page.screenshot({ path: 'opencode_acp_test_after_interaction.png', fullPage: true });
    console.log('交互后截图保存为 opencode_acp_test_after_interaction.png');
    
    // 关闭浏览器
    await browser.close();
    console.log('浏览器已关闭');
    
    console.log('OpenCode ACP连接测试完成！');
    
  } catch (error) {
    console.error('测试过程中出现错误:', error);
    throw error;
  }
}

// 运行测试
testOpenCodeACPConnection();