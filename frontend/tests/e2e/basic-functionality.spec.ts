import { test, expect } from '@playwright/test';

test.describe('基础功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 设置较长的超时时间，等待应用加载
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  });

  test('页面基础加载测试', async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle(/卵巢反应预测工具/);
    
    // 等待应用完全加载
    await page.waitForLoadState('networkidle');
    
    // 验证页面核心元素存在
    await expect(page.locator('body')).toBeVisible();
    
    // 打印页面内容用于调试
    const pageContent = await page.content();
    console.log('页面标题:', await page.title());
    console.log('页面是否包含React:', pageContent.includes('react'));
  });

  test('React应用挂载测试', async ({ page }) => {
    // 等待React应用挂载
    await page.waitForSelector('#root', { timeout: 30000 });
    
    // 验证root元素存在且有内容
    const rootContent = await page.locator('#root').innerHTML();
    expect(rootContent.length).toBeGreaterThan(0);
    
    console.log('Root element content length:', rootContent.length);
  });

  test('导航和基础UI测试', async ({ page }) => {
    // 等待应用加载
    await page.waitForLoadState('networkidle');
    
    // 尝试查找可能的按钮或链接
    const buttons = await page.locator('button').all();
    const links = await page.locator('a').all();
    
    console.log(`找到 ${buttons.length} 个按钮`);
    console.log(`找到 ${links.length} 个链接`);
    
    // 如果有按钮，验证至少一个是可见的
    if (buttons.length > 0) {
      const firstButton = buttons[0];
      const buttonText = await firstButton.textContent();
      console.log('第一个按钮文本:', buttonText);
      
      if (buttonText && buttonText.includes('预测')) {
        await expect(firstButton).toBeVisible();
        await firstButton.click();
      }
    }
  });

  test('API连接测试', async ({ page }) => {
    // 监听网络请求
    const requests: string[] = [];
    page.on('request', request => {
      requests.push(request.url());
    });
    
    // 加载页面
    await page.waitForLoadState('networkidle');
    
    // 检查是否有API请求
    const apiRequests = requests.filter(url => 
      url.includes('localhost:8000') || url.includes('127.0.0.1:8000')
    );
    
    console.log('所有请求:', requests);
    console.log('API请求:', apiRequests);
  });

  test('表单元素检测', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // 查找表单相关元素
    const forms = await page.locator('form').all();
    const inputs = await page.locator('input').all();
    const selects = await page.locator('select').all();
    
    console.log(`找到 ${forms.length} 个表单`);
    console.log(`找到 ${inputs.length} 个输入框`);
    console.log(`找到 ${selects.length} 个选择框`);
    
    // 如果有输入框，尝试填写测试数据
    if (inputs.length > 0) {
      for (let i = 0; i < Math.min(3, inputs.length); i++) {
        const input = inputs[i];
        const type = await input.getAttribute('type');
        const placeholder = await input.getAttribute('placeholder');
        console.log(`输入框 ${i + 1}: type=${type}, placeholder=${placeholder}`);
      }
    }
  });
});