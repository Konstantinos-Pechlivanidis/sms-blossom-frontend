import React from 'react';
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Divider,
  Box,
  Button,
  Banner,
} from '@shopify/polaris';
import { useEstimateCampaign } from '../hooks';

interface ReviewStepProps {
  data?: any;
  onChange: (data: any) => void;
  errors?: string;
}

export function ReviewStep({ data, onChange, errors }: ReviewStepProps) {
  const [estimate, setEstimate] = React.useState<any>(null);
  const [isEstimating, setIsEstimating] = React.useState(false);
  const estimateCampaign = useEstimateCampaign();

  const handleEstimate = async () => {
    if (!data?.segmentId) return;
    
    setIsEstimating(true);
    try {
      // This would normally call the estimate API
      // For now, we'll simulate the response
      const mockEstimate = {
        audienceCount: data.segmentCount || 0,
        estimatedCost: (data.segmentCount || 0) * 0.05, // $0.05 per SMS
        currency: 'USD',
        segments: 1,
        warnings: [],
      };
      setEstimate(mockEstimate);
    } catch (error) {
      console.error('Failed to estimate campaign:', error);
    } finally {
      setIsEstimating(false);
    }
  };

  React.useEffect(() => {
    if (data?.segmentId && !estimate) {
      handleEstimate();
    }
  }, [data?.segmentId]);

  return (
    <Card>
      <BlockStack gap="400">
        <BlockStack gap="200">
          <Text variant="headingMd" as="h3">
            Review Campaign
          </Text>
          <Text variant="bodyMd" as="p" tone="subdued">
            Review all settings before creating your campaign.
          </Text>
        </BlockStack>

        {/* Campaign Details */}
        <Card>
          <BlockStack gap="300">
            <Text variant="bodyMd" fontWeight="semibold" as="h4">
              Campaign Details
            </Text>
            <BlockStack gap="200">
              <InlineStack align="space-between">
                <Text as="span">Name:</Text>
                <Text as="span" fontWeight="semibold">{data?.name || 'Untitled Campaign'}</Text>
              </InlineStack>
              <InlineStack align="space-between">
                <Text as="span">Template:</Text>
                <div style={{ fontFamily: 'monospace' }}>
                  <Text as="span" tone="subdued">
                    {data?.template || 'No template set'}
                  </Text>
                </div>
              </InlineStack>
            </BlockStack>
          </BlockStack>
        </Card>

        {/* Audience */}
        <Card>
          <BlockStack gap="300">
            <Text variant="bodyMd" fontWeight="semibold" as="h4">
              Target Audience
            </Text>
            <BlockStack gap="200">
              <InlineStack align="space-between">
                <Text as="span">Segment:</Text>
                <Text as="span" fontWeight="semibold">{data?.segmentName || 'No segment selected'}</Text>
              </InlineStack>
              <InlineStack align="space-between">
                <Text as="span">Contacts:</Text>
                <Badge tone="info">{`${data?.segmentCount || 0} contacts`}</Badge>
              </InlineStack>
            </BlockStack>
          </BlockStack>
        </Card>

        {/* Discount */}
        {data?.discountId && (
          <Card>
            <BlockStack gap="300">
              <Text variant="bodyMd" fontWeight="semibold" as="h4">
                Discount Code
              </Text>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="span">Code:</Text>
                  <Text as="span" fontWeight="semibold">{data?.discountName}</Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span">Value:</Text>
                  <Badge tone="success">
                    {`${data?.discountType} ${data?.discountValue}${data?.discountType === 'percentage' ? '%' : ''}`}
                  </Badge>
                </InlineStack>
              </BlockStack>
            </BlockStack>
          </Card>
        )}

        {/* Schedule */}
        <Card>
          <BlockStack gap="300">
            <Text variant="bodyMd" fontWeight="semibold" as="h4">
              Schedule
            </Text>
            <BlockStack gap="200">
              <InlineStack align="space-between">
                <Text as="span">Send Time:</Text>
                <Text as="span" fontWeight="semibold">
                  {data?.scheduleType === 'now' ? 'Send Now' : 'Scheduled'}
                </Text>
              </InlineStack>
              {data?.scheduledAt && (
                <InlineStack align="space-between">
                  <Text as="span">Date:</Text>
                  <Text as="span" tone="subdued">
                    {new Date(data.scheduledAt).toLocaleString()}
                  </Text>
                </InlineStack>
              )}
              <InlineStack align="space-between">
                <Text as="span">Timezone:</Text>
                <Text as="span" tone="subdued">{data?.timezone || 'UTC'}</Text>
              </InlineStack>
            </BlockStack>
          </BlockStack>
        </Card>

        {/* Cost Estimate */}
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodyMd" fontWeight="semibold" as="h4">
                Cost Estimate
              </Text>
              <Button
                size="slim"
                onClick={handleEstimate}
                loading={isEstimating}
                disabled={!data?.segmentId}
              >
                {estimate ? 'Refresh' : 'Estimate'}
              </Button>
            </InlineStack>
            
            {estimate ? (
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="span">Audience Size:</Text>
                  <Badge tone="info">{`${estimate.audienceCount} contacts`}</Badge>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span">Estimated Cost:</Text>
                  <Text as="span" fontWeight="semibold">
                    ${estimate.estimatedCost.toFixed(2)} {estimate.currency}
                  </Text>
                </InlineStack>
                <InlineStack align="space-between">
                  <Text as="span">Cost per Message:</Text>
                  <Text as="span" tone="subdued">$0.05</Text>
                </InlineStack>
              </BlockStack>
            ) : (
              <Text as="p" tone="subdued">
                Click "Estimate" to calculate campaign cost
              </Text>
            )}
          </BlockStack>
        </Card>

        {/* Warnings */}
        {estimate?.warnings && estimate.warnings.length > 0 && (
          <Banner tone="warning">
            <Text as="p">
              <strong>Warnings:</strong> {estimate.warnings.join(', ')}
            </Text>
          </Banner>
        )}

        {/* Validation Errors */}
        {errors && (
          <Banner tone="critical">
            <Text as="p">{errors}</Text>
          </Banner>
        )}

        <Divider />

        <Banner tone="info">
          <Text as="p">
            <strong>Ready to send?</strong> Review all settings above and click "Create Campaign" 
            to proceed. You can always edit the campaign before sending.
          </Text>
        </Banner>
      </BlockStack>
    </Card>
  );
}
