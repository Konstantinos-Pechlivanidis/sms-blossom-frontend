import React from 'react';
import { Badge, SkeletonBodyText, Banner } from '@shopify/polaris';
import { useQuery } from '@tanstack/react-query';
import { authorizedFetch } from '../../app/providers/AppProviders';

// @cursor:start(credits-badge)
interface CreditsData {
  balance: number;
  currency: string;
}

export function CreditsBadge() {
  const { data: credits, isLoading, error } = useQuery<CreditsData>({
    queryKey: ['credits'],
    queryFn: async () => {
      // Mock data for now - replace with actual API call
      return {
        balance: 1250.75,
        currency: 'USD',
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  if (error) {
    return (
      <Banner tone="critical" title="Failed to load credits">
        <p>Unable to load credit balance</p>
      </Banner>
    );
  }

  if (isLoading) {
    return <SkeletonBodyText lines={1} />;
  }

  const formatBalance = (balance: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(balance);
  };

  return (
    <Badge tone={credits && credits.balance < 100 ? 'critical' : 'success'}>
      {credits ? formatBalance(credits.balance, credits.currency) : 'Loading...'}
    </Badge>
  );
}
// @cursor:end(credits-badge)
