import React from 'react';
import { Card, Text, BlockStack, InlineStack, Badge } from '@shopify/polaris';

// @cursor:start(iphone-sms-preview)
interface IPhoneSmsPreviewProps {
  message: string;
  senderLabel?: string;
  dark?: boolean;
  segments?: number;
  chars?: number;
  showDetails?: boolean;
}

export function IPhoneSmsPreview({
  message,
  senderLabel = 'SMS Blossom',
  dark = false,
  segments,
  chars,
  showDetails = true
}: IPhoneSmsPreviewProps) {
  // Auto-detect GSM vs Unicode and calculate segments
  const detectEncoding = (text: string) => {
    // Simple GSM detection - in real implementation, use a proper GSM character set
    const gsmChars = /^[A-Za-z0-9\s@£$¥èéùìòÇ\nØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&'()*+,\-.\/:;<=>?¡ÄÖÑÜ§¿äöñüà]*$/;
    return gsmChars.test(text);
  };

  const calculateSegments = (text: string) => {
    const isGSM = detectEncoding(text);
    const maxCharsPerSegment = isGSM ? 160 : 70;
    const maxCharsPerConcatSegment = isGSM ? 153 : 67;
    
    if (text.length <= maxCharsPerSegment) {
      return 1;
    }
    
    const remainingChars = text.length - maxCharsPerSegment;
    const additionalSegments = Math.ceil(remainingChars / maxCharsPerConcatSegment);
    return 1 + additionalSegments;
  };

  const calculateChars = (text: string) => {
    return text.length;
  };

  const actualSegments = segments ?? calculateSegments(message);
  const actualChars = chars ?? calculateChars(message);
  const isGSM = detectEncoding(message);

  // Highlight template variables
  const highlightVariables = (text: string) => {
    return text.replace(/\{\{([^}]+)\}\}/g, '<span style="background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; font-weight: 500;">{{$1}}</span>');
  };

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h3">
          SMS Preview
        </Text>
        
        {/* iPhone-style frame */}
        <div
          style={{
            width: '280px',
            height: '500px',
            backgroundColor: dark ? '#1a1a1a' : '#f8f9fa',
            borderRadius: '25px',
            padding: '20px',
            margin: '0 auto',
            border: '2px solid #e5e7eb',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}
        >
          {/* Status bar */}
          <div
            style={{
              height: '20px',
              backgroundColor: dark ? '#000' : '#fff',
              borderRadius: '20px 20px 0 0',
              margin: '-20px -20px 10px -20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 15px',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            <span>9:41</span>
            <span>●●●●●</span>
          </div>

          {/* SMS bubble */}
          <div
            style={{
              backgroundColor: dark ? '#007AFF' : '#007AFF',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '18px 18px 4px 18px',
              marginTop: '20px',
              maxWidth: '85%',
              wordWrap: 'break-word',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: highlightVariables(message)
              }}
            />
          </div>

          {/* Sender label */}
          <div
            style={{
              fontSize: '12px',
              color: dark ? '#8e8e93' : '#8e8e93',
              marginTop: '8px',
              marginLeft: '8px'
            }}
          >
            {senderLabel}
          </div>
        </div>

        {/* Details */}
        {showDetails && (
          <BlockStack gap="200">
            <InlineStack gap="300" align="center">
              <Badge>
                {`${actualChars} characters`}
              </Badge>
              <Badge>
                {`${actualSegments} segment${actualSegments > 1 ? 's' : ''}`}
              </Badge>
              <Badge>
                {isGSM ? 'GSM' : 'Unicode'}
              </Badge>
            </InlineStack>
            
            <Text variant="bodySm" as="p" tone="subdued">
              ~{actualSegments} segment{actualSegments > 1 ? 's' : ''}, billed accordingly
            </Text>
          </BlockStack>
        )}
      </BlockStack>
    </Card>
  );
}
// @cursor:end(iphone-sms-preview)
