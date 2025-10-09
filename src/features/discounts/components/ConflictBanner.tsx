import React from 'react';
import {
  Banner,
  Text,
  Button,
  InlineStack,
  BlockStack,
  Card,
  Badge,
} from '@shopify/polaris';

interface DiscountConflict {
  id: string;
  title: string;
  type: string;
  value: number;
  currencyCode?: string;
  startsAt?: string;
  endsAt?: string;
  combinesWith?: Record<string, boolean>;
  reason: string;
}

interface ConflictBannerProps {
  conflicts: DiscountConflict[];
  onResolve?: (conflict: DiscountConflict) => void;
  onDismiss?: () => void;
  onRefresh?: () => void;
}

export function ConflictBanner({ 
  conflicts, 
  onResolve, 
  onDismiss, 
  onRefresh 
}: ConflictBannerProps) {
  if (!conflicts || conflicts.length === 0) {
    return null;
  }

  const getConflictSeverity = (conflict: DiscountConflict) => {
    // Determine severity based on conflict type and reason
    if (conflict.reason.includes('exact match')) return 'critical';
    if (conflict.reason.includes('similar')) return 'warning';
    return 'info';
  };

  const getConflictIcon = (conflict: DiscountConflict) => {
    const severity = getConflictSeverity(conflict);
    switch (severity) {
      case 'critical':
        return '⚠️';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const formatConflictDetails = (conflict: DiscountConflict) => {
    const details = [];
    
    if (conflict.type) {
      details.push(`${conflict.type} discount`);
    }
    
    if (conflict.value) {
      const value = conflict.type === 'percentage' 
        ? `${conflict.value}%` 
        : `${conflict.value} ${conflict.currencyCode || 'USD'}`;
      details.push(value);
    }
    
    if (conflict.startsAt || conflict.endsAt) {
      const start = conflict.startsAt ? new Date(conflict.startsAt).toLocaleDateString() : 'No start';
      const end = conflict.endsAt ? new Date(conflict.endsAt).toLocaleDateString() : 'No end';
      details.push(`Active: ${start} - ${end}`);
    }
    
    return details.join(' • ');
  };

  const getResolutionSuggestions = (conflict: DiscountConflict) => {
    const suggestions = [];
    
    if (conflict.reason.includes('exact match')) {
      suggestions.push('Consider changing the discount code to avoid conflicts');
    }
    
    if (conflict.reason.includes('similar')) {
      suggestions.push('Review the discount value to ensure it\'s distinct');
    }
    
    if (conflict.reason.includes('overlap')) {
      suggestions.push('Adjust the date range to avoid overlapping periods');
    }
    
    return suggestions;
  };

  return (
    <Banner
      tone={conflicts.some(c => getConflictSeverity(c) === 'critical') ? 'critical' : 'warning'}
      title={`${conflicts.length} discount conflict${conflicts.length > 1 ? 's' : ''} detected`}
      action={{
        content: 'View Details',
        onAction: () => {}, // This would open a detailed conflict view
      }}
      secondaryAction={{
        content: 'Dismiss',
        onAction: onDismiss,
      }}
      data-testid="conflict-banner"
    >
      <BlockStack gap="300">
        <Text as="p">
          The following discounts may conflict with your new discount:
        </Text>
        
        <BlockStack gap="200">
          {conflicts.map((conflict, index) => (
            <Card key={conflict.id || index}>
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" align="center">
                    <Text as="span">{getConflictIcon(conflict)}</Text>
                    <Text as="span" fontWeight="semibold">
                      {conflict.title}
                    </Text>
                    <Badge tone={getConflictSeverity(conflict)}>
                      {getConflictSeverity(conflict)}
                    </Badge>
                  </InlineStack>
                  
                  {onResolve && (
                    <Button
                      size="slim"
                      onClick={() => onResolve(conflict)}
                    >
                      Resolve
                    </Button>
                  )}
                </InlineStack>
                
                <Text as="p" tone="subdued">
                  {formatConflictDetails(conflict)}
                </Text>
                
                <Text as="p" variant="bodySm" tone="subdued">
                  <strong>Reason:</strong> {conflict.reason}
                </Text>
                
                {getResolutionSuggestions(conflict).length > 0 && (
                  <BlockStack gap="100">
                    <Text as="p" variant="bodySm" fontWeight="semibold">
                      Suggestions:
                    </Text>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {getResolutionSuggestions(conflict).map((suggestion, i) => (
                        <li key={i}>
                          <Text as="span" variant="bodySm" tone="subdued">
                            {suggestion}
                          </Text>
                        </li>
                      ))}
                    </ul>
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          ))}
        </BlockStack>
        
        {onRefresh && (
          <InlineStack gap="200">
            <Button onClick={onRefresh}>
              Refresh Conflicts
            </Button>
            <Text as="p" variant="bodySm" tone="subdued">
              Conflicts are checked automatically, but you can refresh manually if needed.
            </Text>
          </InlineStack>
        )}
      </BlockStack>
    </Banner>
  );
}
