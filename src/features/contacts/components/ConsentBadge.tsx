import React from 'react';
import { Badge, Tooltip, InlineStack, Text } from '@shopify/polaris';

interface ConsentBadgeProps {
  consentState: 'opted_in' | 'opted_out' | 'unknown';
  consentSource?: string;
  consentDate?: string;
  onConsentChange?: (newState: string) => void;
}

export function ConsentBadge({ 
  consentState, 
  consentSource, 
  consentDate,
  onConsentChange 
}: ConsentBadgeProps) {
  const getConsentTone = (state: string): 'critical' | 'success' | 'warning' | undefined => {
    switch (state) {
      case 'opted_in': return 'success';
      case 'opted_out': return 'critical';
      case 'unknown': return undefined; // No tone for unknown
      default: return 'warning';
    }
  };

  const getConsentLabel = (state: string) => {
    switch (state) {
      case 'opted_in': return 'Opted In';
      case 'opted_out': return 'Opted Out';
      case 'unknown': return 'Unknown';
      default: return 'Unknown';
    }
  };

  const getConsentIcon = (state: string) => {
    switch (state) {
      case 'opted_in': return '✓';
      case 'opted_out': return '✗';
      case 'unknown': return '?';
      default: return '?';
    }
  };

  const getConsentTooltip = (state: string, source?: string, date?: string) => {
    const baseText = getConsentLabel(state);
    const sourceText = source ? ` via ${source}` : '';
    const dateText = date ? ` on ${new Date(date).toLocaleDateString()}` : '';
    
    return `${baseText}${sourceText}${dateText}`;
  };

  const badge = (
    <Badge tone={getConsentTone(consentState)}>
      {`${getConsentIcon(consentState)} ${getConsentLabel(consentState)}`}
    </Badge>
  );

  if (consentSource || consentDate) {
    return (
      <Tooltip content={getConsentTooltip(consentState, consentSource, consentDate)}>
        {badge}
      </Tooltip>
    );
  }

  return badge;
}

// Consent status helper functions
export function getConsentStatus(contact: any): 'opted_in' | 'opted_out' | 'unknown' {
  if (contact.smsConsentState) {
    return contact.smsConsentState;
  }
  
  if (contact.subscribed === true) {
    return 'opted_in';
  }
  
  if (contact.subscribed === false) {
    return 'opted_out';
  }
  
  return 'unknown';
}

export function getConsentSource(contact: any): string | undefined {
  return contact.smsConsentSource || contact.consentSource;
}

export function getConsentDate(contact: any): string | undefined {
  return contact.smsConsentAt || contact.consentAt || contact.subscribedAt;
}

// Consent change helper
export function getConsentChangeActions(currentState: string) {
  const actions = [];
  
  if (currentState !== 'opted_in') {
    actions.push({
      label: 'Opt In',
      value: 'opted_in',
      tone: 'success' as const,
    });
  }
  
  if (currentState !== 'opted_out') {
    actions.push({
      label: 'Opt Out',
      value: 'opted_out',
      tone: 'critical' as const,
    });
  }
  
  if (currentState !== 'unknown') {
    actions.push({
      label: 'Mark Unknown',
      value: 'unknown',
      tone: 'warning' as const,
    });
  }
  
  return actions;
}
