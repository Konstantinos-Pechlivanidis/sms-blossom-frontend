import React from 'react';
import { Card, Text, BlockStack } from '@shopify/polaris';

// @cursor:start(section-card)
interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  subdued?: boolean;
}

export function SectionCard({
  title,
  children,
  subdued = false
}: SectionCardProps) {
  return (
    <Card>
      <BlockStack gap="300">
        {title && (
          <Text variant="headingMd" as="h3">
            {title}
          </Text>
        )}
        {children}
      </BlockStack>
    </Card>
  );
}
// @cursor:end(section-card)
