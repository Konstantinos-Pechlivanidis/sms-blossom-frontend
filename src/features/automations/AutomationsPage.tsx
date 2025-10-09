import React, { useState } from 'react';
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  InlineStack,
  Button,
  Banner,
  Spinner,
  EmptyState,
  Tabs,
  Box,
  Divider,
  Modal,
  TextField,
} from '@shopify/polaris';
import {
  AutomationCard,
} from './components/AutomationCard';
import {
  AutomationRulesModal,
} from './components/AutomationRulesModal';
import {
  useAutomations,
  useUpdateAutomations,
  useToggleAutomation,
  usePreviewTemplate,
  useTestSend,
  useAutomationMetrics,
} from './hooks';

// Template Drawer Component
function TemplateDrawer({
  isOpen,
  onClose,
  triggerKey,
  template,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  triggerKey: string;
  template: string;
  onSave: (template: string) => void;
}) {
  const [currentTemplate, setCurrentTemplate] = useState(template);
  const [variables, setVariables] = useState<Record<string, string>>({});

  const triggerVariables = {
    abandoned: {
      customer_name: 'John Doe',
      checkout_url: 'https://shop.myshopify.com/checkout/123',
      cart_total: '$99.99',
      discount_code: 'SAVE10',
    },
    orderPaid: {
      customer_name: 'John Doe',
      order_number: '#1001',
      order_total: '$99.99',
      tracking_url: 'https://tracking.com/123',
    },
    fulfillmentUpdate: {
      customer_name: 'John Doe',
      order_number: '#1001',
      tracking_number: '1Z999AA1234567890',
      tracking_url: 'https://tracking.com/123',
    },
    welcome: {
      customer_name: 'John Doe',
      discount_code: 'WELCOME10',
      discount_value: '10%',
    },
    backInStock: {
      customer_name: 'John Doe',
      product_name: 'Amazing Product',
      product_url: 'https://shop.myshopify.com/products/amazing',
    },
  };

  const availableVariables = triggerVariables[triggerKey as keyof typeof triggerVariables] || {};

  const handleSave = () => {
    onSave(currentTemplate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingMd" as="h3">
            Edit Template - {triggerKey}
          </Text>
          <Button onClick={onClose}>Close</Button>
        </InlineStack>

        <Divider />

        <BlockStack gap="300">
          <Text variant="bodyMd" as="p">
            Use Liquid syntax with available variables:
          </Text>
          
          <Box>
            <Text variant="bodyMd" fontWeight="semibold" as="h4">
              Available Variables:
            </Text>
            <InlineStack gap="200" wrap>
              {Object.entries(availableVariables).map(([key, value]) => (
                <Button
                  key={key}
                  variant="tertiary"
                  size="slim"
                  onClick={() => {
                    const newTemplate = currentTemplate + `{{${key}}}`;
                    setCurrentTemplate(newTemplate);
                  }}
                >
                  {key}
                </Button>
              ))}
            </InlineStack>
          </Box>

          <Box>
            <Text variant="bodyMd" as="p">
              Template (GSM: {currentTemplate.length}/160):
            </Text>
            <textarea
              value={currentTemplate}
              onChange={(e) => setCurrentTemplate(e.target.value)}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontFamily: 'monospace',
              }}
              placeholder="Enter your template here..."
            />
          </Box>

          <InlineStack gap="200">
            <Button variant="primary" onClick={handleSave}>
              Save Template
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </InlineStack>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

export function AutomationsPage() {
  const { data: automations, isLoading, error } = useAutomations();
  const updateAutomations = useUpdateAutomations();
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [rulesModal, setRulesModal] = useState<{
    isOpen: boolean;
    triggerKey: string;
  }>({ isOpen: false, triggerKey: '' });
  const [templateDrawer, setTemplateDrawer] = useState<{
    isOpen: boolean;
    triggerKey: string;
    template: string;
  }>({ isOpen: false, triggerKey: '', template: '' });
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    triggerKey: string;
    template: string;
  }>({ isOpen: false, triggerKey: '', template: '' });
  const [testModal, setTestModal] = useState<{
    isOpen: boolean;
    triggerKey: string;
    template: string;
  }>({ isOpen: false, triggerKey: '', template: '' });

  const automationConfigs = [
    {
      key: 'abandoned' as const,
      title: 'Abandoned Checkout',
      description: 'Send SMS when customers abandon their checkout',
      icon: '🛒',
    },
    {
      key: 'orderPaid' as const,
      title: 'Order Paid',
      description: 'Send SMS when orders are paid',
      icon: '💳',
    },
    {
      key: 'fulfillmentUpdate' as const,
      title: 'Fulfillment Update',
      description: 'Send SMS when orders are fulfilled',
      icon: '📦',
    },
    {
      key: 'welcome' as const,
      title: 'Welcome',
      description: 'Send welcome SMS to new customers',
      icon: '👋',
    },
    {
      key: 'backInStock' as const,
      title: 'Back in Stock',
      description: 'Send SMS when products are back in stock',
      icon: '📱',
    },
  ];

  const handleToggle = async (triggerKey: string, enabled: boolean) => {
    try {
      const currentConfig = automations?.automations[triggerKey as keyof typeof automations.automations];
      if (!currentConfig) return;

      const updatedConfig = {
        ...currentConfig,
        enabled,
      };

      await updateAutomations.mutateAsync({
        [triggerKey]: updatedConfig,
      });
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  };

  const handleEditTemplate = (triggerKey: string) => {
    const config = automations?.automations[triggerKey as keyof typeof automations.automations];
    setTemplateDrawer({
      isOpen: true,
      triggerKey,
      template: config?.template || '',
    });
  };

  const handleEditRules = (triggerKey: string) => {
    setRulesModal({
      isOpen: true,
      triggerKey,
    });
  };

  const handleSaveTemplate = (triggerKey: string, template: string) => {
    const currentConfig = automations?.automations[triggerKey as keyof typeof automations.automations];
    if (!currentConfig) return;

    const updatedConfig = {
      ...currentConfig,
      template,
    };

    updateAutomations.mutateAsync({
      [triggerKey]: updatedConfig,
    });
  };

  const handleSaveRules = (triggerKey: string, rules: any) => {
    const currentConfig = automations?.automations[triggerKey as keyof typeof automations.automations];
    if (!currentConfig) return;

    const updatedConfig = {
      ...currentConfig,
      rules,
    };

    updateAutomations.mutateAsync({
      [triggerKey]: updatedConfig,
    });
  };

  const handlePreview = (triggerKey: string) => {
    const config = automations?.automations[triggerKey as keyof typeof automations.automations];
    setPreviewModal({
      isOpen: true,
      triggerKey,
      template: config?.template || '',
    });
  };

  const handleTest = (triggerKey: string) => {
    const config = automations?.automations[triggerKey as keyof typeof automations.automations];
    setTestModal({
      isOpen: true,
      triggerKey,
      template: config?.template || '',
    });
  };

  if (isLoading) {
    return (
      <Page title="Automations">
        <Layout>
          <Layout.Section>
            <Card>
              <Box padding="400">
                <InlineStack align="center" gap="300">
                  <Spinner size="small" />
                  <Text as="p">Loading automations...</Text>
                </InlineStack>
              </Box>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Automations">
        <Layout>
          <Layout.Section>
            <Banner tone="critical">
              <Text as="p">
                Failed to load automations: {error.message}
              </Text>
            </Banner>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (!automations) {
    return (
      <Page title="Automations">
        <Layout>
          <Layout.Section>
            <EmptyState
              heading="No automations found"
              image="https://cdn.shopify.com/shopifycloud/web/assets/v1/empty-state-illustration.svg"
            >
              <Text as="p">
                Automations will appear here once they are configured.
              </Text>
            </EmptyState>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Automations">
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {/* Header */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingLg" as="h2">
                  SMS Automations
                </Text>
                <Text variant="bodyMd" as="p" tone="subdued">
                  Configure automated SMS messages for different customer events.
                </Text>
              </BlockStack>
            </Card>

            {/* Automation Cards */}
            <BlockStack gap="400">
              {automationConfigs.map((config) => {
                const automationData = automations.automations[config.key];
                const { toggle, isUpdating } = useToggleAutomation(config.key);
                const { data: metrics } = useAutomationMetrics(config.key, '7d');

                return (
                  <AutomationCard
                    key={config.key}
                    triggerKey={config.key}
                    title={config.title}
                    description={config.description}
                    config={automationData}
                    onToggle={(enabled) => toggle(enabled)}
                    onEditTemplate={() => handleEditTemplate(config.key)}
                    onEditRules={() => handleEditRules(config.key)}
                    onPreview={() => handlePreview(config.key)}
                    onTest={() => handleTest(config.key)}
                    isLoading={isUpdating}
                    metrics={{
                      sent: metrics?.automations?.[config.key]?.sent || 0,
                      delivered: metrics?.automations?.[config.key]?.delivered || 0,
                      ctr: metrics?.automations?.[config.key]?.ctr || 0,
                      period: '7 days',
                    }}
                  />
                );
              })}
            </BlockStack>
          </BlockStack>
        </Layout.Section>

        {/* Template Drawer */}
        {templateDrawer.isOpen && (
          <Layout.Section>
            <TemplateDrawer
              isOpen={templateDrawer.isOpen}
              onClose={() => setTemplateDrawer({ isOpen: false, triggerKey: '', template: '' })}
              triggerKey={templateDrawer.triggerKey}
              template={templateDrawer.template}
              onSave={(template) => {
                handleSaveTemplate(templateDrawer.triggerKey, template);
                setTemplateDrawer({ isOpen: false, triggerKey: '', template: '' });
              }}
            />
          </Layout.Section>
        )}

        {/* Rules Modal */}
        <AutomationRulesModal
          isOpen={rulesModal.isOpen}
          onClose={() => setRulesModal({ isOpen: false, triggerKey: '' })}
          onSave={(rules) => {
            handleSaveRules(rulesModal.triggerKey, rules);
            setRulesModal({ isOpen: false, triggerKey: '' });
          }}
          initialRules={automations?.automations[rulesModal.triggerKey as keyof typeof automations.automations]?.rules}
          isLoading={updateAutomations.isPending}
        />

        {/* Preview Modal */}
        <PreviewModal
          isOpen={previewModal.isOpen}
          onClose={() => setPreviewModal({ isOpen: false, triggerKey: '', template: '' })}
          triggerKey={previewModal.triggerKey}
          template={previewModal.template}
        />

        {/* Test Modal */}
        <TestModal
          isOpen={testModal.isOpen}
          onClose={() => setTestModal({ isOpen: false, triggerKey: '', template: '' })}
          triggerKey={testModal.triggerKey}
          template={testModal.template}
        />
      </Layout>
    </Page>
  );
}

// Preview Modal Component
function PreviewModal({
  isOpen,
  onClose,
  triggerKey,
  template,
}: {
  isOpen: boolean;
  onClose: () => void;
  triggerKey: string;
  template: string;
}) {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const { data: preview, isLoading, error } = usePreviewTemplate(triggerKey, template, variables);

  const triggerVariables = {
    abandoned: {
      customer_name: 'John Doe',
      checkout_url: 'https://shop.myshopify.com/checkout/123',
      cart_total: '$99.99',
      discount_code: 'SAVE10',
    },
    orderPaid: {
      customer_name: 'John Doe',
      order_number: '#1001',
      order_total: '$99.99',
      tracking_url: 'https://tracking.com/123',
    },
    fulfillmentUpdate: {
      customer_name: 'John Doe',
      order_number: '#1001',
      tracking_number: '1Z999AA1234567890',
      tracking_url: 'https://tracking.com/123',
    },
    welcome: {
      customer_name: 'John Doe',
      discount_code: 'WELCOME10',
      discount_value: '10%',
    },
    backInStock: {
      customer_name: 'John Doe',
      product_name: 'Amazing Product',
      product_url: 'https://shop.myshopify.com/products/amazing',
    },
  };

  const availableVariables = triggerVariables[triggerKey as keyof typeof triggerVariables] || {};

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Preview Template - ${triggerKey}`}
      primaryAction={{
        content: 'Close',
        onAction: onClose,
      }}
      size="large"
    >
      <Modal.Section>
        <BlockStack gap="400">
          <Text variant="bodyMd" as="p">
            Preview how your template will look with sample data:
          </Text>
          
          <Box>
            <Text variant="bodyMd" fontWeight="semibold" as="h4">
              Template Variables:
            </Text>
            <InlineStack gap="200" wrap>
              {Object.entries(availableVariables).map(([key, value]) => (
                <Button
                  key={key}
                  variant="tertiary"
                  size="slim"
                  onClick={() => {
                    setVariables(prev => ({ ...prev, [key]: value }));
                  }}
                >
                  {key}: {value}
                </Button>
              ))}
            </InlineStack>
          </Box>

          {isLoading && (
            <InlineStack align="center" gap="200">
              <Spinner size="small" />
              <Text as="p">Generating preview...</Text>
            </InlineStack>
          )}

          {error && (
            <Banner tone="critical">
              <Text as="p">Failed to generate preview: {error.message}</Text>
            </Banner>
          )}

          {preview && (
            <Box>
              <Text variant="bodyMd" fontWeight="semibold" as="h4">
                Preview Result:
              </Text>
              <Box padding="300" background="bg-surface-secondary">
                <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {preview.rendered || preview.template || 'No preview available'}
                </div>
              </Box>
            </Box>
          )}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}

// Test Modal Component
function TestModal({
  isOpen,
  onClose,
  triggerKey,
  template,
}: {
  isOpen: boolean;
  onClose: () => void;
  triggerKey: string;
  template: string;
}) {
  const [phone, setPhone] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const testSend = useTestSend(triggerKey, phone, variables);

  const triggerVariables = {
    abandoned: {
      customer_name: 'John Doe',
      checkout_url: 'https://shop.myshopify.com/checkout/123',
      cart_total: '$99.99',
      discount_code: 'SAVE10',
    },
    orderPaid: {
      customer_name: 'John Doe',
      order_number: '#1001',
      order_total: '$99.99',
      tracking_url: 'https://tracking.com/123',
    },
    fulfillmentUpdate: {
      customer_name: 'John Doe',
      order_number: '#1001',
      tracking_number: '1Z999AA1234567890',
      tracking_url: 'https://tracking.com/123',
    },
    welcome: {
      customer_name: 'John Doe',
      discount_code: 'WELCOME10',
      discount_value: '10%',
    },
    backInStock: {
      customer_name: 'John Doe',
      product_name: 'Amazing Product',
      product_url: 'https://shop.myshopify.com/products/amazing',
    },
  };

  const availableVariables = triggerVariables[triggerKey as keyof typeof triggerVariables] || {};

  const handleTestSend = async () => {
    if (!phone.trim()) return;
    
    try {
      await testSend.mutateAsync();
      // Show success message
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Test Send - ${triggerKey}`}
      primaryAction={{
        content: 'Send Test',
        onAction: handleTestSend,
        loading: testSend.isPending,
        disabled: !phone.trim(),
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose,
        },
      ]}
      size="large"
    >
      <Modal.Section>
        <BlockStack gap="400">
          <Text variant="bodyMd" as="p">
            Send a test message to verify your template:
          </Text>
          
          <TextField
            label="Phone Number"
            value={phone}
            onChange={setPhone}
            placeholder="+1234567890"
            autoComplete="off"
            helpText="Enter a phone number to receive the test message"
          />

          <Box>
            <Text variant="bodyMd" fontWeight="semibold" as="h4">
              Template Variables:
            </Text>
            <InlineStack gap="200" wrap>
              {Object.entries(availableVariables).map(([key, value]) => (
                <Button
                  key={key}
                  variant="tertiary"
                  size="slim"
                  onClick={() => {
                    setVariables(prev => ({ ...prev, [key]: value }));
                  }}
                >
                  {key}: {value}
                </Button>
              ))}
            </InlineStack>
          </Box>

          {testSend.error && (
            <Banner tone="critical">
              <Text as="p">Failed to send test: {testSend.error.message}</Text>
            </Banner>
          )}

          {testSend.isSuccess && (
            <Banner tone="success">
              <Text as="p">Test message sent successfully!</Text>
            </Banner>
          )}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
