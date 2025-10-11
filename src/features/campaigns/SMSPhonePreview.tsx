import React from 'react';
import { Card, Text, BlockStack, InlineStack, Badge } from '@shopify/polaris';

// @cursor:start(sms-phone-preview)
interface SMSPhonePreviewProps {
  messageText: string;
  vars?: Record<string, string>;
  carrier?: string;
  segments?: number;
  isUnicode?: boolean;
  senderName?: string;
}

export function SMSPhonePreview({
  messageText,
  vars = {},
  carrier = 'SMS Blossom',
  segments = 1,
  isUnicode = false,
  senderName = 'Your Store'
}: SMSPhonePreviewProps) {
  // Replace variables in message
  const processedMessage = messageText.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    return vars[varName] || match;
  });

  // Calculate character count and segments
  const charCount = processedMessage.length;
  const maxCharsPerSegment = isUnicode ? 70 : 160;
  const maxCharsPerConcatSegment = isUnicode ? 67 : 153;
  
  const calculatedSegments = charCount <= maxCharsPerSegment 
    ? 1 
    : Math.ceil((charCount - maxCharsPerSegment) / maxCharsPerConcatSegment) + 1;

  // Highlight variables in the message
  const highlightVariables = (text: string) => {
    return text.replace(/\{\{(\w+)\}\}/g, '<span style="background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; font-weight: 500;">{{$1}}</span>');
  };

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h3">
          SMS Preview
        </Text>
        
        {/* iPhone-like frame */}
        <div
          style={{
            width: '280px',
            height: '500px',
            backgroundColor: '#f8f9fa',
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
              backgroundColor: '#fff',
              borderRadius: '20px 20px 0 0',
              margin: '-20px -20px 10px -20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 15px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#000'
            }}
          >
            <span>9:41</span>
            <span>●●●●●</span>
          </div>

          {/* SMS bubble */}
          <div
            style={{
              backgroundColor: '#06b6d4',
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
                __html: highlightVariables(processedMessage)
              }}
            />
          </div>

          {/* Sender label */}
          <div
            style={{
              fontSize: '12px',
              color: '#8e8e93',
              marginTop: '8px',
              marginLeft: '8px'
            }}
          >
            {senderName}
          </div>
        </div>

        {/* Message details */}
        <BlockStack gap="200">
          <InlineStack gap="300" align="center">
            <Badge>
              {`${charCount} characters`}
            </Badge>
            <Badge>
              {`${calculatedSegments} segment${calculatedSegments > 1 ? 's' : ''}`}
            </Badge>
            <Badge>
              {isUnicode ? 'Unicode' : 'GSM'}
            </Badge>
          </InlineStack>
          
          <Text variant="bodySm" as="p" tone="subdued">
            ~{calculatedSegments} segment{calculatedSegments > 1 ? 's' : ''}, billed accordingly
          </Text>
          
          {Object.keys(vars).length > 0 && (
            <Text variant="bodySm" as="p" tone="subdued">
              Variables: {Object.keys(vars).join(', ')}
            </Text>
          )}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
// @cursor:end(sms-phone-preview)
