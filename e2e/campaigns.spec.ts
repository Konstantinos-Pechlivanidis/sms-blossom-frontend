import { test, expect } from '@playwright/test';

test.describe('Campaigns E2E', () => {
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

    // Navigate to campaigns page
    await page.goto('/campaigns?shop=test-shop.myshopify.com&host=test-host');
  });

  test('should display campaigns list', async ({ page }) => {
    // Wait for campaigns to load
    await expect(page.locator('[data-testid="campaigns-list"]')).toBeVisible();
    
    // Check for campaign items
    await expect(page.locator('[data-testid="campaign-item"]')).toHaveCount(2);
    
    // Verify campaign data
    await expect(page.locator('text=Welcome Series')).toBeVisible();
    await expect(page.locator('text=Abandoned Cart')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'artifacts/e2e/campaigns-list.png' });
  });

  test('should create new campaign', async ({ page }) => {
    // Click create campaign button
    await page.click('[data-testid="create-campaign-button"]');
    
    // Fill campaign form
    await page.fill('[data-testid="campaign-name"]', 'Test Campaign');
    await page.fill('[data-testid="campaign-description"]', 'Test Description');
    
    // Select template
    await page.selectOption('[data-testid="template-select"]', 'tpl_1');
    
    // Submit form
    await page.click('[data-testid="submit-campaign"]');
    
    // Wait for success message
    await expect(page.locator('text=Campaign created successfully')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'artifacts/e2e/campaign-created.png' });
  });

  test('should estimate campaign cost', async ({ page }) => {
    // Click estimate button on first campaign
    await page.click('[data-testid="estimate-campaign-0"]');
    
    // Wait for estimate modal
    await expect(page.locator('[data-testid="estimate-modal"]')).toBeVisible();
    
    // Verify estimate data
    await expect(page.locator('text=Estimated Recipients: 1,250')).toBeVisible();
    await expect(page.locator('text=Estimated Cost: $12.50')).toBeVisible();
    
    // Close modal
    await page.click('[data-testid="close-estimate-modal"]');
    
    // Take screenshot
    await page.screenshot({ path: 'artifacts/e2e/campaign-estimate.png' });
  });

  test('should handle campaign errors gracefully', async ({ page }) => {
    // Mock error response
    await page.route('**/api/campaigns', route => {
      route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'validation_error',
          details: 'Name is required'
        })
      });
    });

    // Try to create campaign with empty name
    await page.click('[data-testid="create-campaign-button"]');
    await page.click('[data-testid="submit-campaign"]');
    
    // Check for error message
    await expect(page.locator('text=Please check your input and try again.')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'artifacts/e2e/campaign-error.png' });
  });
});
