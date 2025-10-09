import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Spinner,
  Banner,
  Divider,
  Box,
} from '@shopify/polaris';
import { useEstimateCampaign } from '../hooks';

interface CostEstimationPanelProps {
  campaignId?: string;
  segmentId?: string;
  segmentCount?: number;
  onCostChange?: (cost: CostEstimation) => void;
}

interface CostEstimation {
  audienceCount: number;
  costPerMessage: number;
  totalCost: number;
  currency: string;
  segments: Array<{
    name: string;
    count: number;
    cost: number;
  }>;
  warnings: string[];
}

const DEFAULT_TARIFF = 0.05; // $0.05 per SMS

export function CostEstimationPanel({ 
  campaignId, 
  segmentId, 
  segmentCount = 0,
  onCostChange 
}: CostEstimationPanelProps) {
  const [estimation, setEstimation] = useState<CostEstimation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const estimateCampaign = useEstimateCampaign();

  // Calculate basic estimation if no campaign ID
  const calculateBasicEstimation = (): CostEstimation => {
    const totalCost = segmentCount * DEFAULT_TARIFF;
    return {
      audienceCount: segmentCount,
      costPerMessage: DEFAULT_TARIFF,
      totalCost,
      currency: 'USD',
      segments: [{
        name: 'Selected Segment',
        count: segmentCount,
        cost: totalCost,
      }],
      warnings: segmentCount > 10000 ? ['Large audience - consider batch sending'] : [],
    };
  };

  const handleEstimate = async () => {
    if (!campaignId) {
      const basicEstimation = calculateBasicEstimation();
      setEstimation(basicEstimation);
      onCostChange?.(basicEstimation);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await estimateCampaign.mutateAsync(campaignId);
      const costEstimation: CostEstimation = {
        audienceCount: result.audienceSize || segmentCount,
        costPerMessage: DEFAULT_TARIFF, // Use default tariff
        totalCost: result.estimatedCost || (segmentCount * DEFAULT_TARIFF),
        currency: 'USD', // Default currency
        segments: result.segments?.map((seg: any) => ({
          name: seg.name || 'Segment',
          count: seg.count || 0,
          cost: (seg as any).cost || 0,
        })) || [{
          name: 'Selected Segment',
          count: result.audienceSize || segmentCount,
          cost: result.estimatedCost || (segmentCount * DEFAULT_TARIFF),
        }],
        warnings: [], // No warnings property in response
      };
      
      setEstimation(costEstimation);
      onCostChange?.(costEstimation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to estimate cost');
      // Fallback to basic estimation
      const basicEstimation = calculateBasicEstimation();
      setEstimation(basicEstimation);
      onCostChange?.(basicEstimation);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (segmentCount > 0) {
      handleEstimate();
    }
  }, [segmentCount, campaignId]);

  if (isLoading) {
    return (
      <Card>
        <BlockStack gap="300">
          <Text variant="headingMd" as="h3">
            Cost Estimation
          </Text>
          <InlineStack align="center" gap="200">
            <Spinner size="small" />
            <Text as="p">Calculating cost...</Text>
          </InlineStack>
        </BlockStack>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <BlockStack gap="300">
          <Text variant="headingMd" as="h3">
            Cost Estimation
          </Text>
          <Banner tone="critical">
            <Text as="p">Failed to estimate cost: {error}</Text>
          </Banner>
          <Button onClick={handleEstimate}>Retry</Button>
        </BlockStack>
      </Card>
    );
  }

  if (!estimation) {
    return (
      <Card>
        <BlockStack gap="300">
          <Text variant="headingMd" as="h3">
            Cost Estimation
          </Text>
          <Text as="p" tone="subdued">
            Select a segment to see cost estimation
          </Text>
        </BlockStack>
      </Card>
    );
  }

  return (
    <Card>
      <BlockStack gap="400">
        <BlockStack gap="200">
          <Text variant="headingMd" as="h3">
            Cost Estimation
          </Text>
          <Text variant="bodyMd" as="p" tone="subdued">
            Estimated cost for this campaign
          </Text>
        </BlockStack>

        {/* Total Cost */}
        <Card>
          <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodyMd" fontWeight="semibold" as="h4">
                Total Cost
              </Text>
              <Text variant="headingLg" as="h2" fontWeight="bold">
                ${estimation.totalCost.toFixed(2)} {estimation.currency}
              </Text>
            </InlineStack>
            <InlineStack align="space-between">
              <Text as="span" tone="subdued">Per message:</Text>
              <Text as="span" tone="subdued">
                ${estimation.costPerMessage.toFixed(3)} {estimation.currency}
              </Text>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* Audience Breakdown */}
        <BlockStack gap="300">
          <Text variant="bodyMd" fontWeight="semibold" as="h4">
            Audience Breakdown
          </Text>
          <BlockStack gap="200">
            {estimation.segments.map((segment, index) => (
              <InlineStack key={index} align="space-between">
                <Text as="span">{segment.name}</Text>
                <InlineStack gap="200" align="center">
                  <Badge tone="info">{`${segment.count} contacts`}</Badge>
                  <Text as="span" fontWeight="semibold">
                    ${segment.cost.toFixed(2)}
                  </Text>
                </InlineStack>
              </InlineStack>
            ))}
          </BlockStack>
        </BlockStack>

        {/* Warnings */}
        {estimation.warnings.length > 0 && (
          <Banner tone="warning">
            <Text as="p">
              <strong>Warnings:</strong> {estimation.warnings.join(', ')}
            </Text>
          </Banner>
        )}

        <Divider />

        {/* Cost Breakdown */}
        <BlockStack gap="200">
          <Text variant="bodyMd" fontWeight="semibold" as="h4">
            Cost Breakdown
          </Text>
          <Box padding="300" background="bg-surface-secondary">
            <BlockStack gap="100">
              <InlineStack align="space-between">
                <Text as="span" tone="subdued">Audience Size:</Text>
                <Text as="span">{estimation.audienceCount.toLocaleString()} contacts</Text>
              </InlineStack>
              <InlineStack align="space-between">
                <Text as="span" tone="subdued">Cost per SMS:</Text>
                <Text as="span">${estimation.costPerMessage.toFixed(3)}</Text>
              </InlineStack>
              <InlineStack align="space-between">
                <Text as="span" tone="subdued">Total Messages:</Text>
                <Text as="span">{estimation.audienceCount.toLocaleString()}</Text>
              </InlineStack>
              <Divider />
              <InlineStack align="space-between">
                <Text as="span" fontWeight="semibold">Total Cost:</Text>
                <Text as="span" fontWeight="semibold">
                  ${estimation.totalCost.toFixed(2)} {estimation.currency}
                </Text>
              </InlineStack>
            </BlockStack>
          </Box>
        </BlockStack>

        {/* Refresh Button */}
        <Button onClick={handleEstimate} loading={isLoading}>
          Refresh Estimate
        </Button>
      </BlockStack>
    </Card>
  );
}
