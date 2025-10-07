import React, { useState } from 'react';
import {
  Page,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Select,
  Grid,
  Banner,
  SkeletonBodyText,
  SkeletonDisplayText,
} from '@shopify/polaris';
import { useDashboardKPIs, useDashboardAnalytics, useSystemHealth } from './hooks';
import HealthStatusBadge from './components/HealthStatusBadge';
import MetricsCard from './components/MetricsCard';
import ConnectivityCheck from './components/ConnectivityCheck';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
  const [window, setWindow] = useState('30d');
  const [showConnectivity, setShowConnectivity] = useState(false);
  
  const { data: kpis, isLoading, error, refetch } = useDashboardKPIs(window);
  const { metrics, trends, health } = useDashboardAnalytics(window);
  const { status: healthStatus, message: healthMessage } = useSystemHealth();

  const windowOptions = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
  ];

  if (isLoading) {
    return (
      <Page title="Dashboard">
        <BlockStack gap="400">
          <Card>
            <BlockStack gap="300">
              <SkeletonDisplayText size="medium" />
              <SkeletonBodyText lines={3} />
            </BlockStack>
          </Card>
          <Grid>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid.Cell key={i} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                <Card>
                  <BlockStack gap="200">
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText lines={2} />
                  </BlockStack>
                </Card>
              </Grid.Cell>
            ))}
          </Grid>
        </BlockStack>
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Dashboard">
        <Banner tone="critical">
          <BlockStack gap="200">
            <Text variant="bodyMd" fontWeight="semibold" as="p">
              Failed to load dashboard data
            </Text>
            <Text variant="bodyMd" as="p">
              There was an error loading your dashboard. Please try again.
            </Text>
            <Button onClick={() => refetch()}>
              Try Again
            </Button>
          </BlockStack>
        </Banner>
      </Page>
    );
  }

  return (
    <Page title="Dashboard">
      <BlockStack gap="400">
        {/* Header with Health Status */}
        <Card>
          <InlineStack gap="400" align="space-between">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h1">SMS Blossom Dashboard</Text>
              <Text variant="bodyMd" as="p">
                Monitor your SMS marketing performance
              </Text>
            </BlockStack>
            <InlineStack gap="300" align="end">
              <HealthStatusBadge showDetails />
              <Button onClick={() => setShowConnectivity(!showConnectivity)}>
                {showConnectivity ? 'Hide' : 'Show'} Connectivity
              </Button>
            </InlineStack>
          </InlineStack>
        </Card>

        {/* Connectivity Check */}
        {showConnectivity && (
          <Card>
            <ConnectivityCheck />
          </Card>
        )}

        {/* System Health Banner */}
        {healthStatus === 'unhealthy' && (
          <Banner tone="critical">
            <Text variant="bodyMd" as="p">
              {healthMessage}
            </Text>
          </Banner>
        )}

        {/* Time Range Selector */}
        <Card>
          <InlineStack gap="400" align="space-between">
            <Text variant="bodyMd" fontWeight="semibold" as="p">
              Time Range
            </Text>
            <Select
              label="Time Period"
              options={windowOptions}
              value={window}
              onChange={setWindow}
            />
          </InlineStack>
        </Card>

        {/* Key Metrics */}
        {metrics && (
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <MetricsCard
                title="Messages Sent"
                value={metrics.totalSent.toLocaleString()}
                subtitle="Total SMS messages sent"
                status={metrics.totalSent > 0 ? 'positive' : 'neutral'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <MetricsCard
                title="Delivery Rate"
                value={`${metrics.deliveryRate.toFixed(1)}%`}
                subtitle="Successfully delivered messages"
                status={metrics.deliveryRate > 95 ? 'positive' : metrics.deliveryRate > 90 ? 'neutral' : 'negative'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <MetricsCard
                title="Open Rate"
                value={`${metrics.openRate.toFixed(1)}%`}
                subtitle="Messages opened by recipients"
                status={metrics.openRate > 20 ? 'positive' : metrics.openRate > 10 ? 'neutral' : 'negative'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <MetricsCard
                title="Revenue Generated"
                value={`$${metrics.totalRevenue?.total?.toFixed(2) || '0.00'}`}
                subtitle="Total revenue from SMS campaigns"
                status={metrics.totalRevenue?.total && metrics.totalRevenue.total > 0 ? 'positive' : 'neutral'}
              />
            </Grid.Cell>
          </Grid>
        )}

        {/* Performance Chart */}
        {trends && (
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">Performance Trends</Text>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends.sent}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Messages Sent"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </BlockStack>
          </Card>
        )}

        {/* Additional Metrics */}
        {metrics && (
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <MetricsCard
                title="Click Rate"
                value={`${metrics.clickRate.toFixed(1)}%`}
                subtitle="Messages with clicks"
                status={metrics.clickRate > 5 ? 'positive' : metrics.clickRate > 2 ? 'neutral' : 'negative'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <MetricsCard
                title="Total Cost"
                value={`$${metrics.totalCost.toFixed(2)}`}
                subtitle="SMS delivery costs"
                status="neutral"
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <MetricsCard
                title="ROI"
                value={`${metrics.roi.toFixed(1)}%`}
                subtitle="Return on investment"
                status={metrics.roi > 100 ? 'positive' : metrics.roi > 0 ? 'neutral' : 'negative'}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <MetricsCard
                title="Failed Messages"
                value={metrics.totalFailed.toLocaleString()}
                subtitle="Messages that failed to deliver"
                status={metrics.totalFailed > 0 ? 'negative' : 'positive'}
              />
            </Grid.Cell>
          </Grid>
        )}

        {/* Empty State */}
        {!metrics && (
          <Card>
            <BlockStack gap="300" align="center">
              <Text variant="headingMd" as="h2">No Data Available</Text>
              <Text variant="bodyMd" as="p">
                Start by creating your first campaign to see metrics here.
              </Text>
              <Button variant="primary">
                Create Campaign
              </Button>
            </BlockStack>
          </Card>
        )}
      </BlockStack>
    </Page>
  );
}
