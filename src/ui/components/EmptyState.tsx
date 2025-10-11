import React from 'react';
import { EmptyState as PolarisEmptyState } from '@shopify/polaris';

// @cursor-opt:start(empty-state)
interface EmptyStateProps {
  heading: string;
  description?: string;
  action?: {
    content: string;
    onAction: () => void;
  };
  image?: string;
  children?: React.ReactNode;
}

export function EmptyState({ 
  heading, 
  description, 
  action, 
  image = "https://cdn.shopify.com/shopifycloud/web/assets/v1/empty-state-illustration.svg",
  children 
}: EmptyStateProps) {
  return (
    <PolarisEmptyState
      heading={heading}
      image={image}
      action={action}
    >
      {description && <p>{description}</p>}
      {children}
    </PolarisEmptyState>
  );
}
// @cursor-opt:end(empty-state)
