import React, { useState } from 'react';
import {
  Modal,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Card,
  Badge,
  ProgressBar,
  SkeletonBodyText,
  SkeletonDisplayText,
} from '@shopify/polaris';
import { useEstimateCampaign } from '../hooks';

interface EstimateModalProps {
  campaignId: string;
  open: boolean;
  onClose: () => void;
  onSend?: () => void;
}

export default function EstimateModal({ campaignId, open, onClose, onSend }: EstimateModalProps) {
  const [showDetails, setShowDetails] = useState(false);
  const estimateMutation = useEstimateCampaign();

  const handleEstimate = () => {
    estimateMutation.mutate(campaignId);
  };

  const handleSend = () => {
    if (onSend) {
      onSend();
    }
    onClose();
  };

  const estimate = estimateMutation.data;
  const isLoading = estimateMutation.isPending;
  const error = estimateMutation.error;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Campaign Estimate"
      primaryAction={{
        content: 'Send Campaign',
        onAction: handleSend,
        disabled: !estimate || isLoading,
        loading: estimateMutation.isPending,
      }}
      secondaryActions={[
        {
          content: 'Close',
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="400">
          {!estimate && !isLoading && (
            <Card>
              <BlockStack gap="300">
                <Text variant="bodyMd" as="p">
                  Get an estimate of your campaign's reach and cost before sending.
                </Text>
                <Button onClick={handleEstimate} loading={isLoading}>
                  Get Estimate
                </Button>
              </BlockStack>
            </Card>
          )}

          {isLoading && (
            <Card>
              <BlockStack gap="300">
                <SkeletonDisplayText size="medium" />
                <SkeletonBodyText lines={3} />
                <ProgressBar progress={75} />
              </BlockStack>
            </Card>
          )}

          {error && (
            <Card>
              <BlockStack gap="300">
                <Text variant="bodyMd" tone="critical" as="p">
                  Failed to get estimate. Please try again.
                </Text>
                <Button onClick={handleEstimate}>
                  Try Again
                </Button>
              </BlockStack>
            </Card>
          )}

          {estimate && (
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h2">Campaign Estimate</Text>
                  
                  <InlineStack gap="400" align="space-between">
                    <Text variant="bodyMd" as="span">Target Audience</Text>
                    <Badge>
                      {`${estimate.audienceSize?.toLocaleString() || '0'} contacts`}
                    </Badge>
                  </InlineStack>
                  
                  <InlineStack gap="400" align="space-between">
                    <Text variant="bodyMd" as="span">Estimated Cost</Text>
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                      ${estimate.estimatedCost?.toFixed(2)}
                    </Text>
                  </InlineStack>
                  
                  <InlineStack gap="400" align="space-between">
                    <Text variant="bodyMd" as="span">Delivery Time</Text>
                    <Text variant="bodyMd" as="span">
                      {estimate.estimatedDeliveryTime || 'Within 1 hour'}
                    </Text>
                  </InlineStack>
                </BlockStack>
              </Card>

              {estimate.segments && (
                <Card>
                  <BlockStack gap="300">
                    <Text variant="headingMd" as="h2">Target Segments</Text>
                    {estimate.segments.map((segment: any) => (
                      <InlineStack key={segment.id} gap="200" align="space-between">
                        <Text variant="bodyMd" as="span">{segment.name}</Text>
                        <Badge>
                          {`${segment.contactCount?.toLocaleString() || '0'} contacts`}
                        </Badge>
                      </InlineStack>
                    ))}
                  </BlockStack>
                </Card>
              )}

              {showDetails && estimate.details && (
                <Card>
                  <BlockStack gap="300">
                    <Text variant="headingMd" as="h2">Estimate Details</Text>
                    <Text variant="bodyMd" as="p">{JSON.stringify(estimate.details, null, 2)}</Text>
                  </BlockStack>
                </Card>
              )}

              <Button
                variant="plain"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
            </BlockStack>
          )}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
