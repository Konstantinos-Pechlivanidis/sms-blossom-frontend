import React, { useState } from 'react';
import { Page, Button, InlineStack, BlockStack, Text } from '@shopify/polaris';
import { HelpDialog } from './HelpDialog';

// @cursor:start(page-header)
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode[];
  helpSlug?: string;
}

export function PageHeader({
  title,
  subtitle,
  primaryAction,
  secondaryActions = [],
  helpSlug
}: PageHeaderProps) {
  const [helpOpen, setHelpOpen] = useState(false);

  const handleHelp = () => {
    setHelpOpen(true);
  };

  return (
    <>
      <Page
        title={title}
        subtitle={subtitle}
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
        // @cursor:start(page-header-help)
        // Add help button if helpSlug is provided
        {...(helpSlug && {
          additionalMetadata: (
            <InlineStack gap="200" align="center">
              <Button
                variant="tertiary"
                size="slim"
                onClick={handleHelp}
                accessibilityLabel="Get help with this page"
              >
                ?
              </Button>
            </InlineStack>
          )
        })}
        // @cursor:end(page-header-help)
      />
      
      {/* Help Dialog */}
      {helpSlug && (
        <HelpDialog
          isOpen={helpOpen}
          onClose={() => setHelpOpen(false)}
          slug={helpSlug}
        />
      )}
    </>
  );
}
// @cursor:end(page-header)
