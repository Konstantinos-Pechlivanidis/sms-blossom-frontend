import { Card, Page, Text, InlineStack, BlockStack, Banner, Button, Select, Spinner } from '@shopify/polaris';
import { useState } from 'react';
import { useDashboardAnalytics, useSystemHealth } from '../../features/dashboard/hooks';
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
  
  const { metrics, trends, health: healthData, isLoading, error } = useDashboardAnalytics(dateRange);
  const { status: healthStatus, message: healthMessage, details: healthDetails, isLoading: healthLoading, error: healthError } = useSystemHealth();

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
        {error && (
          <Banner tone="critical" title="Failed to load dashboard data">
            <p>Unable to load dashboard metrics. Please try again.</p>
            <Button onClick={handleRetry}>Retry</Button>
          </Banner>
        )}

        {/* Health Status Banner */}
        {healthStatus && healthStatus !== 'healthy' && (
          <Banner tone="warning" title="System Health Alert">
            <p>{healthMessage}</p>
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
        {isLoading ? (
          <KpiSkeletonRow />
        ) : metrics ? (
          <Card>
            <div style={{ padding: '16px' }}>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Key Performance Indicators
                </Text>
                <InlineStack gap="600" wrap>
                  <Stat label="Messages Sent" value={metrics.totalSent} />
                  <Stat label="Messages Delivered" value={metrics.totalDelivered} />
                  <Stat label="Messages Failed" value={metrics.totalFailed} />
                  <Stat label="Delivery Rate" value={`${metrics.deliveryRate.toFixed(1)}%`} />
                  <Stat label="Open Rate" value={`${metrics.openRate.toFixed(1)}%`} />
                  <Stat label="Click Rate" value={`${metrics.clickRate.toFixed(1)}%`} />
                  <Stat label="Total Revenue" value={`€${(metrics.totalRevenue?.total || 0).toFixed(2)}`} />
                  <Stat label="Total Cost" value={`€${metrics.totalCost.toFixed(2)}`} />
                  <Stat label="ROI" value={`${metrics.roi.toFixed(1)}%`} />
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

        {/* Trends Section */}
        {isLoading ? (
          <ChartSkeleton />
        ) : trends ? (
          <Card>
            <div style={{ padding: '16px' }}>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Messaging Trends
                </Text>
                <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                  {trends.sent
                    ?.map(
                      (point: any, index: number) => {
                        const delivered = trends.delivered[index];
                        const revenue = trends.revenue[index];
                        return `${point.date}  sent:${point.value}  deliv:${delivered?.value || 0}  €${revenue?.value?.toFixed(2) || '0.00'}`;
                      }
                    )
                    .join('\n') || '—'}
                </div>
              </BlockStack>
            </div>
          </Card>
        ) : null}

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
        ) : healthDetails ? (
          <Card>
            <div style={{ padding: '16px' }}>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  System Health
                </Text>
                <InlineStack gap="400">
                  <HealthIndicator 
                    label="Overall" 
                    status={healthDetails.overall ? 'healthy' : 'unhealthy'} 
                  />
                  <HealthIndicator 
                    label="Database" 
                    status={healthDetails.database?.ok ? 'healthy' : 'unhealthy'} 
                  />
                  <HealthIndicator 
                    label="Redis" 
                    status={healthDetails.redis?.ok ? 'healthy' : 'unhealthy'} 
                  />
                  <HealthIndicator 
                    label="Queue" 
                    status={healthDetails.queue?.ok ? 'healthy' : 'unhealthy'} 
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
