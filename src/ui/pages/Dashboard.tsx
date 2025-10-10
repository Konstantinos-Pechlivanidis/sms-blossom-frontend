import { Card, Page, Text, InlineStack, BlockStack, Banner, Button, Select, Spinner } from '@shopify/polaris';
import { useState } from 'react';
import { useOverviewReport, useHealth } from '../../lib/api/hooks';
import { useShop } from '../../lib/shopContext';
import { KpiSkeletonRow, ChartSkeleton } from '../components/Skeletons';
import { logPageView, logFeatureUsage } from '../../lib/telemetry';

const DATE_RANGE_OPTIONS = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
];

export default function Dashboard() {
  const { shop, isReady } = useShop();
  const [dateRange, setDateRange] = useState('30d');
  
  // Track page view
  logPageView('dashboard', window.location.href);
  
  const { data: overviewData, isLoading: overviewLoading, error: overviewError } = useOverviewReport({ period: dateRange as any });
  const { data: healthData, isLoading: healthLoading, error: healthError } = useHealth();

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    logFeatureUsage('dashboard', 'date_range_changed', { dateRange: value });
  };

  const handleRetry = () => {
    // Force re-render by changing date range slightly
    setDateRange(dateRange === '7d' ? '30d' : '7d');
    setTimeout(() => setDateRange(dateRange), 100);
    logFeatureUsage('dashboard', 'retry_clicked');
  };

  return (
    <Page title="Dashboard">
      <BlockStack gap="400">
        {/* Error Banner */}
        {overviewError && (
          <Banner tone="critical" title="Failed to load dashboard data">
            <p>Unable to load dashboard metrics. Please try again.</p>
            <Button onClick={handleRetry}>Retry</Button>
          </Banner>
        )}

        {/* Health Status Banner */}
        {healthData && !healthData.ok && (
          <Banner tone="warning" title="System Health Alert">
            <p>System health issues detected. Please check the health section below.</p>
          </Banner>
        )}

        {/* Date Range Selector */}
        <Card>
          <div style={{ padding: '16px' }}>
            <InlineStack gap="400" align="space-between">
              <Text as="h2" variant="headingMd">
                Analytics Overview
              </Text>
              <Select
                label="Date Range"
                labelHidden
                options={DATE_RANGE_OPTIONS}
                value={dateRange}
                onChange={handleDateRangeChange}
              />
            </InlineStack>
          </div>
        </Card>

        {/* KPIs Section */}
        {overviewLoading ? (
          <KpiSkeletonRow />
        ) : overviewData ? (
          <Card>
            <div style={{ padding: '16px' }}>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Key Performance Indicators
                </Text>
                <InlineStack gap="600" wrap>
                  <Stat label="Messages Sent" value={overviewData.totalMessages} />
                  <Stat label="Messages Delivered" value={overviewData.deliveredMessages} />
                  <Stat label="Messages Failed" value={overviewData.failedMessages} />
                  <Stat label="Opt Outs" value={overviewData.optOuts} />
                  <Stat label="Total Revenue" value={`$${overviewData.revenue.toFixed(2)}`} />
                  <Stat label="Avg Delivery Time" value={`${overviewData.averageDeliveryTime}s`} />
                </InlineStack>
              </BlockStack>
            </div>
          </Card>
        ) : (
          <Card>
            <div style={{ padding: '16px' }}>
              <Text as="p" tone="subdued">
                No data available for the selected period.
              </Text>
            </div>
          </Card>
        )}

        {/* Top Campaigns Section */}
        {overviewData?.topCampaigns && overviewData.topCampaigns.length > 0 && (
          <Card>
            <div style={{ padding: '16px' }}>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Top Campaigns
                </Text>
                <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                  {overviewData.topCampaigns
                    .map((campaign: any) => 
                      `${campaign.name}  messages:${campaign.messages}  revenue:$${campaign.revenue.toFixed(2)}`
                    )
                    .join('\n')}
                </div>
              </BlockStack>
            </div>
          </Card>
        )}

        {/* System Health Section */}
        {healthLoading ? (
          <Card>
            <div style={{ padding: '16px' }}>
              <InlineStack gap="200" align="center">
                <Spinner size="small" />
                <Text as="p">Loading system health...</Text>
              </InlineStack>
            </div>
          </Card>
        ) : healthData ? (
          <Card>
            <div style={{ padding: '16px' }}>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  System Health
                </Text>
                <InlineStack gap="400">
                  <HealthIndicator 
                    label="Overall" 
                    status={healthData.ok ? 'healthy' : 'unhealthy'} 
                  />
                  <HealthIndicator 
                    label="Database" 
                    status={healthData.db?.ok ? 'healthy' : 'unhealthy'} 
                  />
                  <HealthIndicator 
                    label="Redis" 
                    status={healthData.redis?.ok ? 'healthy' : 'unhealthy'} 
                  />
                  <HealthIndicator 
                    label="Queues" 
                    status={healthData.queues?.ok ? 'healthy' : 'unhealthy'} 
                  />
                </InlineStack>
              </BlockStack>
            </div>
          </Card>
        ) : null}
      </BlockStack>
    </Page>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <BlockStack>
      <Text as="span" tone="subdued">
        {label}
      </Text>
      <Text as="p" variant="headingLg">
        {value ?? '—'}
      </Text>
    </BlockStack>
  );
}

function HealthIndicator({ label, status }: { label: string; status: 'healthy' | 'unhealthy' }) {
  return (
    <BlockStack>
      <Text as="span" tone="subdued">
        {label}
      </Text>
      <Text as="p" variant="headingMd" tone={status === 'healthy' ? 'success' : 'critical'}>
        {status === 'healthy' ? '✓' : '✗'}
      </Text>
    </BlockStack>
  );
}
