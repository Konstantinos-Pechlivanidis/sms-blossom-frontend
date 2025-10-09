import React from 'react';
import {
  Card,
  BlockStack,
  InlineStack,
  Text,
  Checkbox,
  Banner,
  Badge,
  Divider,
} from '@shopify/polaris';

interface FeatureFlagsSectionProps {
  value: Record<string, boolean>;
  onChange: (value: Record<string, boolean>) => void;
  errors?: Record<string, string>;
}

export function FeatureFlagsSection({ value, onChange, errors }: FeatureFlagsSectionProps) {
  const handleFlagChange = (flag: string, checked: boolean) => {
    onChange({ ...value, [flag]: checked });
  };

  const featureFlags = [
    {
      key: 'dashboardCharts',
      label: 'Dashboard Charts',
      description: 'Enable interactive charts and graphs on the dashboard',
      category: 'Dashboard',
    },
    {
      key: 'realTimeMetrics',
      label: 'Real-time Metrics',
      description: 'Show real-time metrics and live updates',
      category: 'Dashboard',
    },
    {
      key: 'campaignTemplates',
      label: 'Campaign Templates',
      description: 'Enable pre-built campaign templates',
      category: 'Campaigns',
    },
    {
      key: 'campaignScheduling',
      label: 'Campaign Scheduling',
      description: 'Allow scheduling campaigns for future delivery',
      category: 'Campaigns',
    },
    {
      key: 'campaignAutomation',
      label: 'Campaign Automation',
      description: 'Enable automated campaign triggers',
      category: 'Campaigns',
    },
    {
      key: 'discountAutomation',
      label: 'Discount Automation',
      description: 'Automatically create discounts for campaigns',
      category: 'Discounts',
    },
    {
      key: 'discountConflicts',
      label: 'Discount Conflicts',
      description: 'Check for discount conflicts before creation',
      category: 'Discounts',
    },
    {
      key: 'templateLiquid',
      label: 'Liquid Templates',
      description: 'Enable Liquid template syntax in messages',
      category: 'Templates',
    },
    {
      key: 'templateVariables',
      label: 'Template Variables',
      description: 'Show available variables in template editor',
      category: 'Templates',
    },
    {
      key: 'templateValidation',
      label: 'Template Validation',
      description: 'Validate templates before sending',
      category: 'Templates',
    },
  ];

  const getCategoryFlags = (category: string) => {
    return featureFlags.filter(flag => flag.category === category);
  };

  const getEnabledCount = () => {
    return Object.values(value).filter(Boolean).length;
  };

  const getTotalCount = () => {
    return Object.keys(value).length;
  };

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingMd" as="h3">
            Feature Flags
          </Text>
          <Badge tone="info">
            {`${getEnabledCount()}/${getTotalCount()} enabled`}
          </Badge>
        </InlineStack>
        
        <Text as="p" tone="subdued">
          Enable or disable specific features to customize your SMS Blossom experience.
        </Text>

        {errors?.featureFlags && (
          <Banner tone="critical">
            <Text as="p">{errors.featureFlags}</Text>
          </Banner>
        )}

        {['Dashboard', 'Campaigns', 'Discounts', 'Templates'].map((category, categoryIndex) => (
          <React.Fragment key={category}>
            {categoryIndex > 0 && <Divider />}
            
            <BlockStack gap="300">
              <Text variant="headingSm" as="h4">
                {category}
              </Text>
              
              <BlockStack gap="200">
                {getCategoryFlags(category).map((flag) => (
                  <div key={flag.key} style={{ padding: '8px 0' }}>
                    <Checkbox
                      label={flag.label}
                      checked={value[flag.key] || false}
                      onChange={(checked) => handleFlagChange(flag.key, checked)}
                    />
                    <div style={{ marginLeft: '24px' }}>
                      <Text as="p" variant="bodySm" tone="subdued">
                        {flag.description}
                      </Text>
                    </div>
                  </div>
                ))}
              </BlockStack>
            </BlockStack>
          </React.Fragment>
        ))}

        <Text as="p" variant="bodySm" tone="subdued">
          Feature flags allow you to customize which features are available in your SMS Blossom instance. 
          Disabled features will be hidden from the interface and API.
        </Text>
      </BlockStack>
    </Card>
  );
}
