import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Shopify App Bridge
    await page.addInitScript(() => {
      window.shopify = {
        environment: {
          embedded: true,
        },
        config: {
          apiKey: 'test-api-key',
          shop: 'test-shop.myshopify.com',
          host: 'test-host',
        },
      };
    });

    // Mock session token
    await page.addInitScript(() => {
      window.getSessionToken = () => Promise.resolve('mock-session-token');
    });

    // Navigate to dashboard
    await page.goto('/?shop=test-shop.myshopify.com&host=test-host');
  });

  test('should display dashboard KPIs', async ({ page }) => {
    // Wait for dashboard to load
    await expect(page.locator('[data-testid="dashboard-kpis"]')).toBeVisible();
    
    // Check KPI cards
    await expect(page.locator('text=Total Subscribers')).toBeVisible();
    await expect(page.locator('text=1,250')).toBeVisible();
    
    await expect(page.locator('text=Active Campaigns')).toBeVisible();
    await expect(page.locator('text=3')).toBeVisible();
    
    await expect(page.locator('text=Total Sent')).toBeVisible();
    await expect(page.locator('text=15,420')).toBeVisible();
    
    await expect(page.locator('text=Delivery Rate')).toBeVisible();
    await expect(page.locator('text=98%')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'artifacts/e2e/dashboard-kpis.png' });
  });

  test('should show health status', async ({ page }) => {
    // Wait for health status
    await expect(page.locator('[data-testid="health-status"]')).toBeVisible();
    
    // Check health badge
    await expect(page.locator('[data-testid="health-badge"]')).toHaveText('Healthy');
    
    // Take screenshot
    await page.screenshot({ path: 'artifacts/e2e/dashboard-health.png' });
  });

  test('should perform connectivity check', async ({ page }) => {
    // Click connectivity check button
    await page.click('[data-testid="connectivity-check-button"]');
    
    // Wait for check to complete
    await expect(page.locator('text=Connectivity check completed')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'artifacts/e2e/dashboard-connectivity.png' });
  });

  test('should handle dashboard errors gracefully', async ({ page }) => {
    // Mock error response for KPIs
    await page.route('**/api/dashboard/kpis', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'internal_error'
        })
      });
    });

    // Reload page to trigger error
    await page.reload();
    
    // Check for error message
    await expect(page.locator('text=An internal error occurred. Please try again.')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'artifacts/e2e/dashboard-error.png' });
  });
});
