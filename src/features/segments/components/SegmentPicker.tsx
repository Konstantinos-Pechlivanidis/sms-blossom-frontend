import React, { useState, useMemo } from 'react';
import {
  Select,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Spinner,
  Banner,
  Card,
} from '@shopify/polaris';
import { useSegments } from '../hooks';

interface SegmentPickerProps {
  selectedSegment?: string;
  onSegmentChange: (segmentId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showDetails?: boolean;
}

export function SegmentPicker({ 
  selectedSegment, 
  onSegmentChange, 
  placeholder = "Select a segment...",
  disabled = false,
  showDetails = true
}: SegmentPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: segments, isLoading, error } = useSegments();

  const filteredSegments = useMemo(() => {
    if (!segments?.items) return [];
    
    return segments.items.filter((segment: any) => 
      segment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [segments?.items, searchTerm]);

  const segmentOptions = [
    { label: placeholder, value: '' },
    ...filteredSegments.map((segment: any) => ({
      label: `${segment.name} (${segment.contactCount || 0} contacts)`,
      value: segment.id,
    })),
  ];

  const selectedSegmentData = segments?.items?.find((s: any) => s.id === selectedSegment);

  if (isLoading) {
    return (
      <InlineStack align="center" gap="200">
        <Spinner size="small" />
        <Text as="p">Loading segments...</Text>
      </InlineStack>
    );
  }

  if (error) {
    return (
      <Banner tone="critical">
        <Text as="p">Failed to load segments: {error.message}</Text>
      </Banner>
    );
  }

  return (
    <BlockStack gap="300">
      <Select
        label="Target Segment"
        options={segmentOptions}
        value={selectedSegment || ''}
        onChange={onSegmentChange}
        disabled={disabled}
        helpText="Choose a segment to target with your campaign"
      />

      {selectedSegmentData && showDetails && (
        <Card>
          <BlockStack gap="200">
            <Text variant="bodyMd" fontWeight="semibold" as="h4">
              Selected Segment
            </Text>
            <InlineStack gap="200" align="center">
              <Text as="span">{selectedSegmentData.name}</Text>
              <Badge tone="info">
                {`${(selectedSegmentData as any).contactCount || 0} contacts`}
              </Badge>
            </InlineStack>
            
            {selectedSegmentData.filterJson && (
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" fontWeight="semibold">
                  Filter Criteria:
                </Text>
                <div style={{ fontFamily: 'monospace' }}>
                  <Text as="p" variant="bodySm" tone="subdued">
                    {JSON.stringify(selectedSegmentData.filterJson, null, 2)}
                  </Text>
                </div>
              </BlockStack>
            )}
          </BlockStack>
        </Card>
      )}

      {!segments?.items || segments.items.length === 0 && (
        <Banner tone="warning">
          <Text as="p">
            No segments found. Create a segment first to target your campaign.
          </Text>
        </Banner>
      )}
    </BlockStack>
  );
}
