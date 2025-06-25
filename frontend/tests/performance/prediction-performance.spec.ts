import { test, expect } from '@playwright/test';

test.describe('性能测试', () => {
  test('页面加载性能', async ({ page }) => {
    // 启动性能监控
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // 测量首次内容绘制 (FCP)
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            if (entry.name === 'first-contentful-paint') {
              resolve(entry.startTime);
            }
          }
        }).observe({ entryTypes: ['paint'] });
      });
    });

    // FCP应该小于2秒
    expect(fcp).toBeLessThan(2000);

    // 测量最大内容绘制 (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // 2秒后超时
        setTimeout(() => resolve(0), 2000);
      });
    });

    // LCP应该小于2.5秒
    expect(lcp).toBeLessThan(2500);
  });

  test('预测请求性能', async ({ page }) => {
    await page.goto('http://localhost:3000/prediction');

    // 填写表单
    await page.getByLabel('年龄').fill('30');
    await page.getByLabel('治疗时长').fill('12');
    await page.getByLabel('体重').fill('60');
    await page.getByLabel('FSH').fill('8.5');
    await page.getByLabel('LH').fill('4.2');
    await page.getByLabel('AMH').fill('2.1');
    await page.getByLabel('AFC').fill('12');
    await page.getByLabel('舒张压').fill('80');
    await page.getByLabel('白细胞计数').fill('6.5');
    await page.getByLabel('红细胞计数').fill('4.2');
    await page.getByLabel('丙氨酸转氨酶').fill('25');
    await page.getByLabel('血磷').fill('1.2');
    await page.getByLabel('血小板计数').fill('250');

    // 测量API响应时间
    const startTime = Date.now();
    
    await page.getByRole('button', { name: '开始预测' }).click();
    
    await page.waitForSelector('[data-testid="prediction-result"]', { timeout: 10000 });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // API响应时间应该小于5秒
    expect(responseTime).toBeLessThan(5000);
  });

  test('内存使用情况', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // 获取初始内存使用
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // 执行多次预测操作
    for (let i = 0; i < 5; i++) {
      await page.goto('http://localhost:3000/prediction');
      
      // 填写并提交表单
      await page.getByLabel('年龄').fill('30');
      await page.getByLabel('治疗时长').fill('12');
      await page.getByLabel('体重').fill('60');
      await page.getByLabel('FSH').fill('8.5');
      await page.getByLabel('LH').fill('4.2');
      await page.getByLabel('AMH').fill('2.1');
      await page.getByLabel('AFC').fill('12');
      await page.getByLabel('舒张压').fill('80');
      await page.getByLabel('白细胞计数').fill('6.5');
      await page.getByLabel('红细胞计数').fill('4.2');
      await page.getByLabel('丙氨酸转氨酶').fill('25');
      await page.getByLabel('血磷').fill('1.2');
      await page.getByLabel('血小板计数').fill('250');
      
      await page.getByRole('button', { name: '开始预测' }).click();
      await page.waitForSelector('[data-testid="prediction-result"]');
    }

    // 获取最终内存使用
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // 内存增长不应该超过50MB
    const memoryIncrease = finalMemory - initialMemory;
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });

  test('网络资源优化', async ({ page }) => {
    // 监控网络请求
    const requests: any[] = [];
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });

    await page.goto('http://localhost:3000');

    // 检查关键资源
    const jsRequests = requests.filter(req => req.resourceType === 'script');
    const cssRequests = requests.filter(req => req.resourceType === 'stylesheet');
    const imageRequests = requests.filter(req => req.resourceType === 'image');

    // JavaScript文件数量应该合理
    expect(jsRequests.length).toBeLessThan(10);
    
    // CSS文件数量应该合理
    expect(cssRequests.length).toBeLessThan(5);
    
    // 图片请求应该优化
    expect(imageRequests.length).toBeLessThan(20);
  });

  test('表单输入响应性', async ({ page }) => {
    await page.goto('http://localhost:3000/prediction');

    const ageInput = page.getByLabel('年龄');

    // 测量输入响应时间
    const times: number[] = [];
    
    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();
      
      await ageInput.fill(`${20 + i}`);
      
      const endTime = performance.now();
      times.push(endTime - startTime);
    }

    // 平均输入响应时间应该小于100ms
    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    expect(averageTime).toBeLessThan(100);
  });

  test('图表渲染性能', async ({ page }) => {
    await page.goto('http://localhost:3000/prediction');

    // 模拟API响应
    await page.route('**/predict', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          prediction: {
            POR_probability: 0.15,
            HOR_probability: 0.25
          },
          status: 'success',
          timestamp: new Date().toISOString()
        })
      });
    });

    // 提交表单并测量图表渲染时间
    await page.getByLabel('年龄').fill('30');
    await page.getByLabel('治疗时长').fill('12');
    await page.getByLabel('体重').fill('60');
    await page.getByLabel('FSH').fill('8.5');
    await page.getByLabel('LH').fill('4.2');
    await page.getByLabel('AMH').fill('2.1');
    await page.getByLabel('AFC').fill('12');
    await page.getByLabel('舒张压').fill('80');
    await page.getByLabel('白细胞计数').fill('6.5');
    await page.getByLabel('红细胞计数').fill('4.2');
    await page.getByLabel('丙氨酸转氨酶').fill('25');
    await page.getByLabel('血磷').fill('1.2');
    await page.getByLabel('血小板计数').fill('250');

    const startTime = Date.now();
    await page.getByRole('button', { name: '开始预测' }).click();
    
    // 等待图表渲染完成
    await page.waitForSelector('[data-testid="prediction-chart"]');
    
    const endTime = Date.now();
    const renderTime = endTime - startTime;

    // 图表渲染时间应该小于3秒
    expect(renderTime).toBeLessThan(3000);
  });

  test('移动设备性能', async ({ page }) => {
    // 模拟移动设备
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 模拟3G网络
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100); // 100ms延迟
    });

    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // 移动设备加载时间应该在合理范围内
    expect(loadTime).toBeLessThan(8000);
  });
}); 