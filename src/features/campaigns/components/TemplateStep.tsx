import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  TextField,
  BlockStack,
  InlineStack,
  Button,
  Badge,
  Box,
  Divider,
} from '@shopify/polaris';

interface TemplateStepProps {
  data?: any;
  onChange: (data: any) => void;
  errors?: string;
}

const TEMPLATE_VARIABLES = [
  { key: 'customer_name', label: 'Customer Name', example: 'John Doe' },
  { key: 'order_number', label: 'Order Number', example: '#1001' },
  { key: 'order_total', label: 'Order Total', example: '$99.99' },
  { key: 'discount_code', label: 'Discount Code', example: 'SAVE10' },
  { key: 'discount_value', label: 'Discount Value', example: '10%' },
  { key: 'checkout_url', label: 'Checkout URL', example: 'https://shop.com/checkout' },
  { key: 'product_name', label: 'Product Name', example: 'Amazing Product' },
  { key: 'product_url', label: 'Product URL', example: 'https://shop.com/products/amazing' },
];

export function TemplateStep({ data, onChange, errors }: TemplateStepProps) {
  const [template, setTemplate] = useState(data?.template || '');
  const [campaignName, setCampaignName] = useState(data?.name || '');

  useEffect(() => {
    onChange({
      template,
      name: campaignName,
    });
  }, [template, campaignName, onChange]);

  const handleVariableClick = (variable: string) => {
    const newTemplate = template + `{{${variable}}}`;
    setTemplate(newTemplate);
  };

  const getCharacterCount = () => {
    return template.length;
  };

  const getCharacterCountColor = () => {
    const count = getCharacterCount();
    if (count > 160) return 'critical';
    if (count > 140) return 'warning';
    return 'success';
  };

  return (
    <Card>
      <BlockStack gap="400">
        <BlockStack gap="200">
          <Text variant="headingMd" as="h3">
            Message Template
          </Text>
          <Text variant="bodyMd" as="p" tone="subdued">
            Create your SMS message template using Liquid syntax.
          </Text>
        </BlockStack>

        <TextField
          label="Campaign Name"
          value={campaignName}
          onChange={setCampaignName}
          placeholder="e.g., Welcome Campaign"
          autoComplete="off"
          helpText="Give your campaign a descriptive name"
        />

        <BlockStack gap="300">
          <Text variant="bodyMd" fontWeight="semibold" as="h4">
            Available Variables
          </Text>
          <InlineStack gap="200" wrap>
            {TEMPLATE_VARIABLES.map(variable => (
              <Button
                key={variable.key}
                variant="tertiary"
                size="slim"
                onClick={() => handleVariableClick(variable.key)}
              >
                {variable.key}
              </Button>
            ))}
          </InlineStack>
        </BlockStack>

        <BlockStack gap="200">
          <InlineStack align="space-between" blockAlign="center">
            <Text variant="bodyMd" as="p">
              Message Template
            </Text>
            <InlineStack gap="200" align="center">
              <Badge tone={getCharacterCountColor()}>
                {`${getCharacterCount()}/160 characters`}
              </Badge>
            </InlineStack>
          </InlineStack>
          
          <TextField
            label="Message Template"
            value={template}
            onChange={setTemplate}
            placeholder="Enter your message template here..."
            multiline={4}
            autoComplete="off"
            error={errors}
            helpText="Use {{variable_name}} to insert dynamic content"
          />
        </BlockStack>

        {template && (
          <Box>
            <Divider />
            <BlockStack gap="200">
              <Text variant="bodyMd" fontWeight="semibold" as="h4">
                Preview
              </Text>
              <Box padding="300" background="bg-surface-secondary">
                <div style={{ fontFamily: 'monospace' }}>
                  <Text as="p">
                    {template || 'Enter a template to see preview...'}
                  </Text>
                </div>
              </Box>
            </BlockStack>
          </Box>
        )}
      </BlockStack>
    </Card>
  );
}
