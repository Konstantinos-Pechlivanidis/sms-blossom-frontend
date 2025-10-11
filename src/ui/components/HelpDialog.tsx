import React, { useState, useEffect } from 'react';
import { Modal, Text, BlockStack, InlineStack, Button, Link, Card, List } from '@shopify/polaris';

// @cursor:start(help-dialog)
interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}

interface HelpContent {
  title: string;
  content: string;
  ctaLinks?: Array<{ label: string; href: string }>;
}

export function HelpDialog({
  isOpen,
  onClose,
  slug
}: HelpDialogProps) {
  const [helpContent, setHelpContent] = useState<HelpContent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && slug) {
      loadHelpContent(slug);
    }
  }, [isOpen, slug]);

  const loadHelpContent = async (helpSlug: string) => {
    setLoading(true);
    try {
      // Try to load from help files
      const response = await fetch(`/src/ui/help/${helpSlug}.md`);
      if (response.ok) {
        const content = await response.text();
        setHelpContent({
          title: getTitleFromSlug(helpSlug),
          content: content,
          ctaLinks: getDefaultLinks(helpSlug)
        });
      } else {
        // Fallback to default content
        setHelpContent(getDefaultHelpContent(helpSlug));
      }
    } catch (error) {
      // Fallback to default content
      setHelpContent(getDefaultHelpContent(helpSlug));
    } finally {
      setLoading(false);
    }
  };

  const getTitleFromSlug = (slug: string): string => {
    return slug.charAt(0).toUpperCase() + slug.slice(1) + ' Help';
  };

  const getDefaultLinks = (slug: string) => {
    const linkMap: Record<string, Array<{ label: string; href: string }>> = {
      dashboard: [
        { label: 'Dashboard Guide', href: '/docs/dashboard' },
        { label: 'KPI Metrics', href: '/docs/metrics' }
      ],
      campaigns: [
        { label: 'Campaign Guide', href: '/docs/campaigns' },
        { label: 'Segmentation', href: '/docs/segments' }
      ],
      contacts: [
        { label: 'Contact Management', href: '/docs/contacts' },
        { label: 'CSV Import', href: '/docs/import' }
      ]
    };
    return linkMap[slug] || [];
  };

  const getDefaultHelpContent = (slug: string): HelpContent => {
    const contentMap: Record<string, HelpContent> = {
      dashboard: {
        title: 'Dashboard Help',
        content: `## What you can do here

Track your SMS marketing performance with key metrics and system health monitoring.

### Key Features
- **KPIs at a glance**: Monitor messages sent, delivered, and revenue
- **System health**: Check database, Redis, and queue status
- **Recent activity**: View latest campaigns and automations

### Backend Endpoints
- \`GET /health\` - System health status
- \`GET /reports/overview\` - KPI metrics
- \`GET /reports/messaging\` - Messaging statistics`
      },
      campaigns: {
        title: 'Campaigns Help',
        content: `## What you can do here

Create and manage SMS marketing campaigns with live preview and audience targeting.

### Key Features
- **Live SMS preview**: See exactly what recipients will read
- **Audience targeting**: Use segments to reach the right customers
- **Cost estimation**: Understand pricing based on message length and recipients
- **Scheduling**: Send immediately or schedule for optimal times

### Backend Endpoints
- \`GET /campaigns\` - List all campaigns
- \`POST /campaigns\` - Create new campaign
- \`GET /segments\` - List available segments
- \`POST /campaigns/estimate\` - Estimate campaign cost`
      }
    };
    return contentMap[slug] || {
      title: 'Help',
      content: 'Help content not available for this page.'
    };
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={helpContent?.title || 'Help'}
      // @cursor:start(help-dialog-content)
      primaryAction={{
        content: 'Got it',
        onAction: onClose,
      }}
      // @cursor:end(help-dialog-content)
    >
      <Modal.Section>
        <BlockStack gap="400">
          {loading ? (
            <Text variant="bodyMd" as="p">Loading help content...</Text>
          ) : helpContent ? (
            <>
              <div dangerouslySetInnerHTML={{ __html: helpContent.content.replace(/\n/g, '<br>') }} />
              
              {helpContent.ctaLinks && helpContent.ctaLinks.length > 0 && (
                <Card>
                  <BlockStack gap="300">
                    <Text variant="headingSm" as="h3">
                      Learn more
                    </Text>
                    <List>
                      {helpContent.ctaLinks.map((link, index) => (
                        <List.Item key={index}>
                          <Link url={link.href} external>
                            <InlineStack gap="200" align="center">
                              <Text variant="bodyMd" as="span">{link.label}</Text>
                              <Text variant="bodyMd" as="span">↗</Text>
                            </InlineStack>
                          </Link>
                        </List.Item>
                      ))}
                    </List>
                  </BlockStack>
                </Card>
              )}
            </>
          ) : (
            <Text variant="bodyMd" as="p">Help content not available.</Text>
          )}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
// @cursor:end(help-dialog)
