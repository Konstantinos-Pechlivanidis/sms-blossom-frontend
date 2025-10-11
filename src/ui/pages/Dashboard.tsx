import { Card, Text, InlineStack, BlockStack, Banner, Button, Select, Spinner, Box, Layout } from '@shopify/polaris';
import { useState } from 'react';
import { useOverviewReport, useHealth } from '../../lib/api/hooks';
import { useShop } from '../../lib/shopContext';
import { KpiSkeletonRow, ChartSkeleton } from '../components/Skeletons';
import { logPageView, logFeatureUsage } from '../../lib/telemetry';
import { SectionHeader } from '../components/SectionHeader';
import { GlassCard } from '../components/GlassCard';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { useToast } from '../../lib/useToast';
// @cursor:start(dashboard-imports)
import { PageHeader } from '../components/PageHeader';
import { ExplainableButton } from '../components/ExplainableButton';
import { MetricCard } from '../components/MetricCard';
import { SectionCard } from '../components/SectionCard';
// @cursor:end(dashboard-imports)

const DATE_RANGE_OPTIONS = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
];

export default function Dashboard() {
  const { shop, isReady } = useShop();
  const [dateRange, setDateRange] = useState('30d');
  const { showSuccess, showError, ToastComponent } = useToast();
  
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
    showSuccess('Dashboard data refreshed');
  };

  // @cursor:start(dashboard-help-content)
  // Help content is now handled by PageHeader with helpSlug
  // @cursor:end(dashboard-help-content)

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Monitor your SMS marketing performance and system health"
        primaryAction={
          <ExplainableButton
            onAction={() => window.location.href = '/campaigns'}
            label="Create Campaign"
            explainTitle="Create Campaign"
            explainMarkdown="Start a new SMS campaign to reach your customers. You can target specific segments, schedule delivery, and track performance."
          />
        }
        helpSlug="dashboard"
      />
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {/* @cursor:start(dashboard-hero) */}
            {/* Hero Section - Brand gradient wrapper */}
            <div className="gradientHero">
              <Text as="h2" variant="headingLg">Welcome to SMS Blossom</Text>
              <Text as="p" variant="bodyMd">Manage your SMS marketing campaigns with powerful automation tools</Text>
            </div>
            {/* @cursor:end(dashboard-hero) */}

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
        <GlassCard>
          <div className="p-4">
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
        </GlassCard>

        {/* @cursor:start(dashboard-kpis) */}
        {/* KPIs Section */}
        {overviewLoading ? (
          <KpiSkeletonRow />
        ) : overviewData ? (
          <SectionCard title="Key Performance Indicators">
            <div className="brand-grid brand-grid-3">
              <MetricCard 
                label="Messages Sent" 
                value={overviewData.totalMessages}
                description="Total SMS messages sent"
              />
              <MetricCard 
                label="Messages Delivered" 
                value={overviewData.deliveredMessages}
                description="Successfully delivered messages"
              />
              <MetricCard 
                label="Messages Failed" 
                value={overviewData.failedMessages}
                description="Failed delivery attempts"
              />
              <MetricCard 
                label="Opt Outs" 
                value={overviewData.optOuts}
                description="Customer opt-outs"
              />
              <MetricCard 
                label="Total Revenue" 
                value={`$${overviewData.revenue.toFixed(2)}`}
                description="Revenue generated from campaigns"
              />
              <MetricCard 
                label="Avg Delivery Time" 
                value={`${overviewData.averageDeliveryTime}s`}
                description="Average time to deliver messages"
              />
            </div>
          </SectionCard>
        ) : (
          <SectionCard>
            <Text as="p" tone="subdued">
              No data available for the selected period.
            </Text>
          </SectionCard>
        )}
        {/* @cursor:end(dashboard-kpis) */}

        {/* Top Campaigns Section */}
        {overviewData?.topCampaigns && overviewData.topCampaigns.length > 0 && (
          <GlassCard>
            <div className="p-4">
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Top Campaigns
                </Text>
                <div className="font-mono whitespace-pre-wrap text-sm">
                  {overviewData.topCampaigns
                    .map((campaign: any) =>
                      `${campaign.name}  messages:${campaign.messages}  revenue:$${campaign.revenue.toFixed(2)}`
                    )
                    .join('\n')}
                </div>
              </BlockStack>
            </div>
          </GlassCard>
        )}

        {/* System Health Section */}
        {healthLoading ? (
          <GlassCard>
            <div className="p-4">
              <InlineStack gap="200" align="center">
                <Spinner size="small" />
                <Text as="p">Loading system health...</Text>
              </InlineStack>
            </div>
          </GlassCard>
        ) : healthData ? (
          <GlassCard>
            <div className="p-4">
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  System Health
                </Text>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                </div>
              </BlockStack>
            </div>
          </GlassCard>
        ) : null}
          </BlockStack>
        </Layout.Section>
      </Layout>
      {ToastComponent}
      
      {/* Help Dialog is now handled by PageHeader */}
    </>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="ios-glass rounded-2xl p-4 hover:shadow-card transition-shadow duration-300">
      <Text as="span" tone="subdued" variant="bodySm">
        {label}
      </Text>
      <Text as="p" variant="headingLg">
        {value ?? '—'}
      </Text>
    </div>
  );
}

function HealthIndicator({ label, status }: { label: string; status: 'healthy' | 'unhealthy' }) {
  return (
    <div className="ios-glass rounded-2xl p-4 hover:shadow-card transition-shadow duration-300">
      <Text as="span" tone="subdued" variant="bodySm">
        {label}
      </Text>
      <Text as="p" variant="headingMd" tone={status === 'healthy' ? 'success' : 'critical'}>
        {status === 'healthy' ? '✓' : '✗'}
      </Text>
    </div>
  );
}
