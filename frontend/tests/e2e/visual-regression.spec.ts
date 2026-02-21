import { test, expect } from '@playwright/test';

const mockPredictionResult = {
  status: 'success',
  por_prediction: { poor_response_prob: 0.72, normal_response_prob: 0.28 },
  hor_prediction: { high_response_prob: 0.15, normal_response_prob: 0.85 },
};

const mockConflictResult = {
  status: 'success',
  por_prediction: { poor_response_prob: 0.65, normal_response_prob: 0.35 },
  hor_prediction: { high_response_prob: 0.58, normal_response_prob: 0.42 },
};

async function goToPrediction(page: any) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.locator('.ant-tabs-tab').filter({ hasText: 'Prediction' }).click();
  await page.waitForTimeout(400);
}

async function fillFormAndSubmit(page: any) {
  // Toggle example data switch to fill all fields
  const toggle = page.locator('.ant-switch').first();
  if (await toggle.isVisible()) {
    await toggle.click();
    await page.waitForTimeout(300);
  }
  await page.locator('button').filter({ hasText: 'Predict' }).click();
  await page.waitForTimeout(1500);
}

test.describe('Visual Regression Tests', () => {
  test('Home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-page.png', { fullPage: true, maxDiffPixelRatio: 0.05 });
  });

  test('Prediction form (step 1)', async ({ page }) => {
    await goToPrediction(page);
    await expect(page).toHaveScreenshot('prediction-form.png', { fullPage: true, maxDiffPixelRatio: 0.05 });
  });

  test('Prediction results - high POR risk', async ({ page }) => {
    await page.route('**/predict', route => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockPredictionResult) });
    });
    await goToPrediction(page);
    await fillFormAndSubmit(page);
    await expect(page).toHaveScreenshot('prediction-results-high-por.png', { fullPage: true, maxDiffPixelRatio: 0.05 });
  });

  test('Prediction results - conflict alert', async ({ page }) => {
    await page.route('**/predict', route => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockConflictResult) });
    });
    await goToPrediction(page);
    await fillFormAndSubmit(page);
    await expect(page).toHaveScreenshot('prediction-results-conflict.png', { fullPage: true, maxDiffPixelRatio: 0.05 });
  });

  test('Contact page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const contactTab = page.locator('.ant-tabs-tab').filter({ hasText: 'Contact' });
    if (await contactTab.isVisible()) {
      await contactTab.click();
    }
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('contact-page.png', { fullPage: true, maxDiffPixelRatio: 0.05 });
  });

  test('Mobile viewport - home', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('mobile-home.png', { fullPage: true, maxDiffPixelRatio: 0.05 });
  });

  test('Mobile viewport - prediction form', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const predictionTab = page.locator('.ant-tabs-tab').filter({ hasText: 'Prediction' });
    if (await predictionTab.isVisible()) {
      await predictionTab.click();
    }
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('mobile-prediction-form.png', { fullPage: true, maxDiffPixelRatio: 0.05 });
  });
});
