import React, { useState, useEffect } from 'react';
import {
  Modal,
  Text,
  TextField,
  Button,
  BlockStack,
  InlineStack,
  Card,
  Banner,
  Spinner,
  Divider,
  Box,
} from '@shopify/polaris';
import { useApplyUrl } from '../hooks';
import { appendUtm } from '../../../lib/shop';

interface ApplyUrlModalProps {
  discount: any;
  isOpen: boolean;
  onClose: () => void;
  onUrlGenerated: (url: string) => void;
}

export function ApplyUrlModal({ discount, isOpen, onClose, onUrlGenerated }: ApplyUrlModalProps) {
  const [redirect, setRedirect] = useState('/checkout');
  const [utmSource, setUtmSource] = useState('sms_blossom');
  const [utmMedium, setUtmMedium] = useState('sms');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  const applyUrl = useApplyUrl();

  useEffect(() => {
    if (isOpen && discount) {
      // Reset form when modal opens
      setRedirect('/checkout');
      setUtmSource('sms_blossom');
      setUtmMedium('sms');
      setUtmCampaign('');
      setUtmTerm('');
      setUtmContent('');
      setGeneratedUrl('');
      setCopied(false);
    }
  }, [isOpen, discount]);

  const handleGenerateUrl = async () => {
    try {
      const result = await applyUrl.mutateAsync(discount.id);
      let url = result.url; // Use the correct property name
      
      // Add UTM parameters
      const utmParams = {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_term: utmTerm,
        utm_content: utmContent,
      };
      
      // Filter out empty UTM parameters
      const filteredUtm = Object.fromEntries(
        Object.entries(utmParams).filter(([_, value]) => value.trim())
      );
      
      url = appendUtm(url, filteredUtm);
      setGeneratedUrl(url);
    } catch (error) {
      console.error('Failed to generate URL:', error);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleUrlGenerated = () => {
    onUrlGenerated(generatedUrl);
    onClose();
  };

  if (!isOpen || !discount) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Apply URL for ${discount.code}`}
      size="large"
      primaryAction={{
        content: 'Use This URL',
        onAction: handleUrlGenerated,
        disabled: !generatedUrl,
      }}
      secondaryActions={[
        { content: 'Close', onAction: onClose },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="400">
          {/* Discount Info */}
          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd" as="h3">
                Discount Information
              </Text>
              <InlineStack gap="400">
                <BlockStack gap="100">
                  <Text as="span" fontWeight="semibold">Code:</Text>
                  <Text as="span">{discount.code}</Text>
                </BlockStack>
                <BlockStack gap="100">
                  <Text as="span" fontWeight="semibold">Type:</Text>
                  <Text as="span">
                    {discount.type === 'percentage' ? 'Percentage' : 'Amount'} - {discount.value}
                    {discount.type === 'percentage' ? '%' : ` ${discount.currencyCode || 'USD'}`}
                  </Text>
                </BlockStack>
                <BlockStack gap="100">
                  <Text as="span" fontWeight="semibold">Status:</Text>
                  <Text as="span">{discount.status || 'Active'}</Text>
                </BlockStack>
              </InlineStack>
            </BlockStack>
          </Card>

          {/* URL Configuration */}
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h3">
                URL Configuration
              </Text>
              
              <TextField
                label="Redirect Path"
                value={redirect}
                onChange={setRedirect}
                helpText="Where customers will be redirected after applying the discount"
                autoComplete="off"
              />

              <Divider />

              <Text variant="bodyMd" fontWeight="semibold" as="h4">
                UTM Parameters (Optional)
              </Text>
              
              <InlineStack gap="300">
                <TextField
                  label="UTM Source"
                  value={utmSource}
                  onChange={setUtmSource}
                  autoComplete="off"
                />
                <TextField
                  label="UTM Medium"
                  value={utmMedium}
                  onChange={setUtmMedium}
                  autoComplete="off"
                />
              </InlineStack>
              
              <TextField
                label="UTM Campaign"
                value={utmCampaign}
                onChange={setUtmCampaign}
                autoComplete="off"
              />
              
              <InlineStack gap="300">
                <TextField
                  label="UTM Term"
                  value={utmTerm}
                  onChange={setUtmTerm}
                  autoComplete="off"
                />
                <TextField
                  label="UTM Content"
                  value={utmContent}
                  onChange={setUtmContent}
                  autoComplete="off"
                />
              </InlineStack>
            </BlockStack>
          </Card>

          {/* Generate URL */}
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="headingMd" as="h3">
                  Generated URL
                </Text>
                <Button
                  onClick={handleGenerateUrl}
                  loading={applyUrl.isPending}
                  disabled={!discount.id}
                >
                  Generate URL
                </Button>
              </InlineStack>

              {applyUrl.isPending && (
                <InlineStack align="center" gap="200">
                  <Spinner size="small" />
                  <Text as="p">Generating URL...</Text>
                </InlineStack>
              )}

              {applyUrl.error && (
                <Banner tone="critical">
                  <Text as="p">Failed to generate URL: {applyUrl.error.message}</Text>
                </Banner>
              )}

              {generatedUrl && (
                <BlockStack gap="200">
                  <Text as="p" fontWeight="semibold">
                    Apply URL:
                  </Text>
                  <Box
                    padding="300"
                    background="bg-surface-secondary"
                    borderRadius="200"
                  >
                    <div style={{ fontFamily: 'monospace' }}>
                      <Text as="p" tone="subdued">
                        {generatedUrl}
                      </Text>
                    </div>
                  </Box>
                  
                  <InlineStack gap="200">
                    <Button
                      onClick={handleCopyUrl}
                      tone={copied ? 'success' : undefined}
                    >
                      {copied ? 'Copied!' : 'Copy URL'}
                    </Button>
                    <Button
                      url={generatedUrl}
                      target="_blank"
                    >
                      Test URL
                    </Button>
                  </InlineStack>
                </BlockStack>
              )}
            </BlockStack>
          </Card>

          {/* Usage Instructions */}
          <Banner tone="info">
            <Text as="p">
              <strong>Usage:</strong> Share this URL with customers via SMS, email, or other channels. 
              When customers click the link, they'll be redirected to your store with the discount code automatically applied.
            </Text>
          </Banner>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
