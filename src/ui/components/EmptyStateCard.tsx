import React from 'react';
import { Card, Text, BlockStack, Button, EmptyState } from '@shopify/polaris';

// @cursor:start(empty-state-card)
interface EmptyStateCardProps {
  title: string;
  description: string;
  primaryAction?: {
    content: string;
    onAction: () => void;
  };
  secondaryAction?: {
    content: string;
    onAction: () => void;
  };
  image?: string;
}

export function EmptyStateCard({
  title,
  description,
  primaryAction,
  secondaryAction,
  image
}: EmptyStateCardProps) {
  return (
    <Card>
      <EmptyState
        heading={title}
        image={image || ''}
      >
        <Text variant="bodyMd" as="p">
          {description}
        </Text>
        {primaryAction && (
          <Button
            variant="primary"
            onClick={primaryAction.onAction}
          >
            {primaryAction.content}
          </Button>
        )}
        {secondaryAction && (
          <Button
            variant="secondary"
            onClick={secondaryAction.onAction}
          >
            {secondaryAction.content}
          </Button>
        )}
      </EmptyState>
    </Card>
  );
}
// @cursor:end(empty-state-card)
