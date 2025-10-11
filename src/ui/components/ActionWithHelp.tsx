import React, { useState } from 'react';
import { Button, Popover, Text, BlockStack, InlineStack } from '@shopify/polaris';
import type { ButtonProps } from '@shopify/polaris';

// @cursor:start(action-with-help)
interface ActionWithHelpProps {
  action: ButtonProps;
  help: {
    title: string;
    body: string;
  };
}

export function ActionWithHelp({ action, help }: ActionWithHelpProps) {
  const [helpOpen, setHelpOpen] = useState(false);

  const handleHelpToggle = () => {
    setHelpOpen(!helpOpen);
  };

  return (
    <InlineStack gap="200" align="center">
      <Button {...action} />
      <Popover
        active={helpOpen}
        activator={
          <Button
            variant="tertiary"
            size="slim"
            onClick={handleHelpToggle}
            accessibilityLabel={`Get help with ${action.children}`}
          >
            ?
          </Button>
        }
        onClose={() => setHelpOpen(false)}
        // @cursor:start(action-help-content)
        // @cursor:end(action-help-content)
      >
        <BlockStack gap="200">
          <Text variant="headingSm" as="h3">
            {help.title}
          </Text>
          <Text variant="bodyMd" as="p">
            {help.body}
          </Text>
        </BlockStack>
      </Popover>
    </InlineStack>
  );
}
// @cursor:end(action-with-help)
