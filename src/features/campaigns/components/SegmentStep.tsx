import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Select,
  BlockStack,
  InlineStack,
  Button,
  Badge,
  Banner,
  Spinner,
} from '@shopify/polaris';
import { useSegments } from '../../segments/hooks';
import { SegmentPicker } from '../../segments/components/SegmentPicker';

interface SegmentStepProps {
  data?: any;
  onChange: (data: any) => void;
  errors?: string;
}

export function SegmentStep({ data, onChange, errors }: SegmentStepProps) {
  const [selectedSegment, setSelectedSegment] = useState(data?.segmentId || '');

  const handleSegmentChange = (segmentId: string) => {
    setSelectedSegment(segmentId);
    onChange({
      segmentId,
      segmentName: segmentId ? `Segment ${segmentId}` : '',
    });
  };

  return (
    <Card>
      <BlockStack gap="400">
        <BlockStack gap="200">
          <Text variant="headingMd" as="h3">
            Choose Target Audience
          </Text>
          <Text variant="bodyMd" as="p" tone="subdued">
            Select the segment of customers who will receive this campaign.
          </Text>
        </BlockStack>

        <SegmentPicker
          selectedSegment={selectedSegment}
          onSegmentChange={handleSegmentChange}
          placeholder="Select a segment..."
          showDetails={true}
        />

        {errors && (
          <Banner tone="critical">
            <Text as="p">{errors}</Text>
          </Banner>
        )}
      </BlockStack>
    </Card>
  );
}
