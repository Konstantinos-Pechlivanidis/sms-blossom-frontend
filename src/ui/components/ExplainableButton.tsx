import React, { useState } from 'react';
import { Button, Popover, Text, BlockStack, InlineStack } from '@shopify/polaris';

// @cursor:start(explainable-button)
interface ExplainableButtonProps {
  onAction: () => void;
  label: string;
  explainTitle: string;
  explainMarkdown: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'slim' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
}

export function ExplainableButton({
  onAction,
  label,
  explainTitle,
  explainMarkdown,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false
}: ExplainableButtonProps) {
  const [explainOpen, setExplainOpen] = useState(false);

  const handleExplainToggle = () => {
    setExplainOpen(!explainOpen);
  };

  return (
    <InlineStack gap="200" align="center">
      <Button
        variant={variant}
        size={size}
        onClick={onAction}
        loading={loading}
        disabled={disabled}
      >
        {label}
      </Button>
      <Popover
        active={explainOpen}
        activator={
          <Button
            variant="tertiary"
            size="slim"
            onClick={handleExplainToggle}
            accessibilityLabel={`Explain what ${label} does`}
          >
            ?
          </Button>
        }
        onClose={() => setExplainOpen(false)}
        // @cursor:start(explain-content)
        // @cursor:end(explain-content)
      >
        <BlockStack gap="200">
          <Text variant="headingSm" as="h3">
            {explainTitle}
          </Text>
          <Text variant="bodyMd" as="p">
            {explainMarkdown}
          </Text>
        </BlockStack>
      </Popover>
    </InlineStack>
  );
}
// @cursor:end(explainable-button)
