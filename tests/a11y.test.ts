import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Page, Card, Text, BlockStack } from '@shopify/polaris';
import { ShopProvider } from '../src/lib/shopContext';

// Extend expect with axe matchers
expect.extend(toHaveNoViolations);

// Mock shop context
const mockShopContext = {
  shop: 'test-shop.myshopify.com',
  host: 'test-host',
  isReady: true,
};

describe('Accessibility Tests', () => {
  it('should have no accessibility violations on Dashboard page', async () => {
    const Dashboard = () => (
      <ShopProvider>
        <Page title="Dashboard">
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Key Metrics
              </Text>
              <Text variant="bodyMd" as="p">
                Total Subscribers: 1,250
              </Text>
              <Text variant="bodyMd" as="p">
                Active Campaigns: 3
              </Text>
            </BlockStack>
          </Card>
        </Page>
      </ShopProvider>
    );

    const { container } = render(<Dashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations on Campaigns list', async () => {
    const CampaignsList = () => (
      <ShopProvider>
        <Page title="Campaigns">
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Campaigns
              </Text>
              <div role="list">
                <div role="listitem">
                  <Text variant="bodyMd" as="p">
                    Welcome Series
                  </Text>
                </div>
                <div role="listitem">
                  <Text variant="bodyMd" as="p">
                    Abandoned Cart
                  </Text>
                </div>
              </div>
            </BlockStack>
          </Card>
        </Page>
      </ShopProvider>
    );

    const { container } = render(<CampaignsList />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations on Templates editor', async () => {
    const TemplateEditor = () => (
      <ShopProvider>
        <Page title="Template Editor">
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Template Editor
              </Text>
              <div>
                <label htmlFor="template-content">Template Content:</label>
                <textarea
                  id="template-content"
                  aria-label="Template content"
                  placeholder="Enter your template content here..."
                />
              </div>
              <div>
                <label htmlFor="template-variables">Available Variables:</label>
                <select id="template-variables" aria-label="Template variables">
                  <option value="shop_name">Shop Name</option>
                  <option value="customer_name">Customer Name</option>
                </select>
              </div>
            </BlockStack>
          </Card>
        </Page>
      </ShopProvider>
    );

    const { container } = render(<TemplateEditor />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
