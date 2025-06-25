import { test, expect } from '@playwright/test';

test.describe('卵巢反应预测完整流程', () => {
  test.beforeEach(async ({ page }) => {
    // 启动前端应用
    await page.goto('http://localhost:3000');
  });

  test('完整的预测流程 - 成功路径', async ({ page }) => {
    // 1. 验证页面加载
    await expect(page).toHaveTitle(/卵巢反应预测工具/);
    await expect(page.getByText('卵巢反应预测工具')).toBeVisible();

    // 2. 导航到预测页面
    await page.getByRole('button', { name: '开始预测' }).click();
    await expect(page).toHaveURL(/.*prediction/);

    // 3. 填写表单
    // 基础信息
    await page.getByLabel('年龄').fill('30');
    await page.getByLabel('治疗时长').fill('12');
    await page.getByLabel('体重').fill('60');

    // 激素水平
    await page.getByLabel('FSH').fill('8.5');
    await page.getByLabel('LH').fill('4.2');
    await page.getByLabel('AMH').fill('2.1');
    await page.getByLabel('AFC').fill('12');

    // 血液检查
    await page.getByLabel('舒张压').fill('80');
    await page.getByLabel('白细胞计数').fill('6.5');
    await page.getByLabel('红细胞计数').fill('4.2');
    await page.getByLabel('丙氨酸转氨酶').fill('25');
    await page.getByLabel('血磷').fill('1.2');
    await page.getByLabel('血小板计数').fill('250');

    // 4. 提交表单
    await page.getByRole('button', { name: '开始预测' }).click();

    // 5. 验证加载状态
    await expect(page.getByText('预测中...')).toBeVisible();

    // 6. 等待预测结果
    await expect(page.getByText('预测结果')).toBeVisible({ timeout: 10000 });

    // 7. 验证结果显示
    await expect(page.getByText('低反应风险')).toBeVisible();
    await expect(page.getByText('高反应风险')).toBeVisible();
    
    // 验证图表显示
    await expect(page.locator('[data-testid="prediction-chart"]')).toBeVisible();
    
    // 验证风险评估卡片
    await expect(page.locator('[data-testid="risk-assessment"]')).toBeVisible();

    // 8. 测试导出功能
    await page.getByRole('button', { name: '导出结果' }).click();
    
    // 验证下载开始（文件会自动下载）
    const downloadPromise = page.waitForEvent('download');
    await downloadPromise;

    // 9. 测试打印功能
    // 模拟打印功能（实际不会打印）
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: '打印报告' }).click();

    // 10. 查看历史记录
    await page.getByRole('tab', { name: '历史记录' }).click();
    await expect(page.getByText('预测历史')).toBeVisible();
    
    // 验证历史记录中有新的预测
    await expect(page.locator('[data-testid="history-item"]')).toHaveCount(1);
  });

  test('表单验证错误处理', async ({ page }) => {
    // 导航到预测页面
    await page.getByRole('button', { name: '开始预测' }).click();

    // 尝试提交空表单
    await page.getByRole('button', { name: '开始预测' }).click();

    // 验证错误信息显示
    await expect(page.getByText('请输入年龄')).toBeVisible();
    await expect(page.getByText('请输入FSH值')).toBeVisible();

    // 输入无效年龄
    await page.getByLabel('年龄').fill('10');
    await page.getByRole('button', { name: '开始预测' }).click();
    await expect(page.getByText('年龄必须在18-45岁之间')).toBeVisible();

    // 输入负数
    await page.getByLabel('FSH').fill('-5');
    await page.getByRole('button', { name: '开始预测' }).click();
    await expect(page.getByText('FSH值必须大于0')).toBeVisible();
  });

  test('API错误处理', async ({ page, context }) => {
    // 拦截API请求并返回错误
    await page.route('**/predict', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    // 导航到预测页面
    await page.getByRole('button', { name: '开始预测' }).click();

    // 填写有效表单数据
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

    // 提交表单
    await page.getByRole('button', { name: '开始预测' }).click();

    // 验证错误信息显示
    await expect(page.getByText('预测请求失败')).toBeVisible({ timeout: 10000 });
  });

  test('历史记录管理', async ({ page }) => {
    // 先完成一次预测以创建历史记录
    await page.getByRole('button', { name: '开始预测' }).click();
    
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
    await expect(page.getByText('预测结果')).toBeVisible();

    // 切换到历史记录标签
    await page.getByRole('tab', { name: '历史记录' }).click();

    // 验证历史记录显示
    await expect(page.locator('[data-testid="history-item"]')).toHaveCount(1);

    // 测试查看历史记录详情
    await page.getByRole('button', { name: '查看详情' }).first().click();
    await expect(page.getByText('预测详情')).toBeVisible();

    // 测试删除历史记录
    await page.getByRole('button', { name: '删除' }).first().click();
    await page.getByRole('button', { name: '确认删除' }).click();
    await expect(page.locator('[data-testid="history-item"]')).toHaveCount(0);

    // 验证空状态显示
    await expect(page.getByText('暂无预测记录')).toBeVisible();
  });

  test('响应式设计验证', async ({ page }) => {
    // 测试移动设备视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.getByRole('button', { name: '开始预测' }).click();

    // 验证移动端布局
    await expect(page.locator('[data-testid="mobile-form-layout"]')).toBeVisible();

    // 验证移动端表单字段可见
    await expect(page.getByLabel('年龄')).toBeVisible();
    
    // 测试平板视口
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // 验证平板端布局
    await expect(page.locator('[data-testid="tablet-form-layout"]')).toBeVisible();

    // 测试桌面视口
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // 验证桌面端布局
    await expect(page.locator('[data-testid="desktop-form-layout"]')).toBeVisible();
  });

  test('数据导入导出功能', async ({ page }) => {
    await page.getByRole('button', { name: '开始预测' }).click();

    // 测试数据导出
    // 先填写一些数据
    await page.getByLabel('年龄').fill('30');
    await page.getByLabel('治疗时长').fill('12');
    await page.getByLabel('体重').fill('60');

    // 点击导出按钮
    await page.getByRole('button', { name: '导出数据' }).click();
    
    // 验证下载开始
    const downloadPromise = page.waitForEvent('download');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.json');

    // 测试数据导入
    // 创建测试文件
    const testData = {
      formData: {
        Age: 25,
        Duration: 6,
        Weight: 55,
        FSH: 7.5,
        LH: 3.8,
        AMH: 1.8,
        AFC: 10,
        DBP: 75,
        WBC: 6.0,
        RBC: 4.0,
        ALT: 20,
        P: 1.1,
        PLT: 240,
        POIorDOR: 0,
        PCOS: 0
      }
    };

    // 模拟文件上传
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-data.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(testData))
    });

    // 验证数据被导入
    await expect(page.getByLabel('年龄')).toHaveValue('25');
    await expect(page.getByLabel('治疗时长')).toHaveValue('6');
    await expect(page.getByLabel('体重')).toHaveValue('55');
  });

  test('键盘导航可访问性', async ({ page }) => {
    await page.getByRole('button', { name: '开始预测' }).click();

    // 测试Tab键导航
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('年龄')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel('治疗时长')).toBeFocused();

    // 测试Enter键提交
    await page.getByLabel('年龄').fill('30');
    await page.keyboard.press('Enter');
    
    // 验证表单验证触发
    await expect(page.getByText('请输入治疗时长')).toBeVisible();

    // 测试Escape键取消
    await page.keyboard.press('Escape');
  });

  test('API健康检查', async ({ page }) => {
    // 模拟健康检查API
    await page.route('**/health', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString()
        })
      });
    });

    await page.goto('http://localhost:3000');

    // 验证健康状态指示器
    await expect(page.locator('[data-testid="api-health-indicator"]')).toHaveClass(/healthy/);

    // 模拟API不健康状态
    await page.route('**/health', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service unavailable' })
      });
    });

    // 刷新页面触发健康检查
    await page.reload();

    // 验证不健康状态指示器
    await expect(page.locator('[data-testid="api-health-indicator"]')).toHaveClass(/unhealthy/);
    await expect(page.getByText('API服务暂时不可用')).toBeVisible();
  });
}); 