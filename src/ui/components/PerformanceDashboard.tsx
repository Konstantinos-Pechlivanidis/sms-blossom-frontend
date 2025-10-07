// Performance monitoring dashboard component
import React, { useState, useEffect } from 'react';
import { Card, BlockStack, InlineStack, Text, Button, Badge, DataTable, Modal, Page } from '@shopify/polaris';
import { usePerformance } from '../../lib/usePerformance';
import { performanceMonitor } from '../../lib/performance';

interface PerformanceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PerformanceDashboard({ isOpen, onClose }: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getMetrics, getReport, clearMetrics } = usePerformance();

  useEffect(() => {
    if (isOpen) {
      loadPerformanceData();
    }
  }, [isOpen]);

  const loadPerformanceData = async () => {
    setIsLoading(true);
    try {
      const currentMetrics = getMetrics();
      const currentReport = getReport();
      
      setMetrics(currentMetrics);
      setReport(currentReport);
    } catch (error) {
      console.error('Failed to load performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearMetrics = () => {
    clearMetrics();
    setMetrics([]);
    setReport(null);
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getPerformanceScore = (vitals: any) => {
    let score = 100;
    
    if (vitals.fcp > 1800) score -= 20; // First Contentful Paint
    if (vitals.lcp > 2500) score -= 20; // Largest Contentful Paint
    if (vitals.fid > 100) score -= 20; // First Input Delay
    if (vitals.cls > 0.1) score -= 20; // Cumulative Layout Shift
    
    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'critical';
  };

  const recentMetrics = metrics.slice(-20); // Show last 20 metrics
  const slowestOperations = metrics
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const metricsTableRows = recentMetrics.map((metric, index) => [
    index + 1,
    metric.name,
    formatDuration(metric.value),
    new Date(metric.timestamp).toLocaleTimeString(),
    metric.metadata?.shop || 'N/A',
  ]);

  const slowestTableRows = slowestOperations.map((metric, index) => [
    index + 1,
    metric.name,
    formatDuration(metric.value),
    new Date(metric.timestamp).toLocaleTimeString(),
  ]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Performance Dashboard"
    >
      <Modal.Section>
        <BlockStack gap="400">
          {/* Performance Score */}
          {report?.vitals && (
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between">
                  <Text as="h3" variant="headingMd">
                    Performance Score
                  </Text>
                  <Badge tone={getScoreColor(getPerformanceScore(report.vitals))}>
                    {`${getPerformanceScore(report.vitals)}/100`}
                  </Badge>
                </InlineStack>
                
                <InlineStack gap="400">
                  <div>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      First Contentful Paint
                    </Text>
                    <Text as="p" variant="bodyLg">
                      {formatDuration(report.vitals.fcp || 0)}
                    </Text>
                  </div>
                  
                  <div>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Largest Contentful Paint
                    </Text>
                    <Text as="p" variant="bodyLg">
                      {formatDuration(report.vitals.lcp || 0)}
                    </Text>
                  </div>
                  
                  <div>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      First Input Delay
                    </Text>
                    <Text as="p" variant="bodyLg">
                      {formatDuration(report.vitals.fid || 0)}
                    </Text>
                  </div>
                  
                  <div>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Cumulative Layout Shift
                    </Text>
                    <Text as="p" variant="bodyLg">
                      {(report.vitals.cls || 0).toFixed(3)}
                    </Text>
                  </div>
                </InlineStack>
              </BlockStack>
            </Card>
          )}

          {/* Memory Usage */}
          {report?.memory && (
            <Card>
              <BlockStack gap="300">
                <Text as="h3" variant="headingMd">
                  Memory Usage
                </Text>
                <InlineStack gap="400">
                  <div>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Used
                    </Text>
                    <Text as="p" variant="bodyLg">
                      {formatBytes(report.memory.used)}
                    </Text>
                  </div>
                  
                  <div>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Total
                    </Text>
                    <Text as="p" variant="bodyLg">
                      {formatBytes(report.memory.total)}
                    </Text>
                  </div>
                  
                  <div>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Limit
                    </Text>
                    <Text as="p" variant="bodyLg">
                      {formatBytes(report.memory.limit)}
                    </Text>
                  </div>
                </InlineStack>
              </BlockStack>
            </Card>
          )}

          {/* Recent Metrics */}
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between">
                <Text as="h3" variant="headingMd">
                  Recent Metrics
                </Text>
                <Button onClick={loadPerformanceData} loading={isLoading}>
                  Refresh
                </Button>
              </InlineStack>
              
              {metricsTableRows.length > 0 ? (
                <DataTable
                  columnContentTypes={['numeric', 'text', 'text', 'text', 'text']}
                  headings={['#', 'Operation', 'Duration', 'Time', 'Shop']}
                  rows={metricsTableRows}
                />
              ) : (
                <Text as="p" tone="subdued">
                  No metrics recorded yet
                </Text>
              )}
            </BlockStack>
          </Card>

          {/* Slowest Operations */}
          <Card>
            <BlockStack gap="300">
              <Text as="h3" variant="headingMd">
                Slowest Operations
              </Text>
              
              {slowestTableRows.length > 0 ? (
                <DataTable
                  columnContentTypes={['numeric', 'text', 'text', 'text']}
                  headings={['#', 'Operation', 'Duration', 'Time']}
                  rows={slowestTableRows}
                />
              ) : (
                <Text as="p" tone="subdued">
                  No slow operations detected
                </Text>
              )}
            </BlockStack>
          </Card>

          {/* Actions */}
          <InlineStack gap="200">
            <Button onClick={handleClearMetrics} variant="secondary">
              Clear Metrics
            </Button>
            <Button onClick={loadPerformanceData} loading={isLoading}>
              Refresh Data
            </Button>
          </InlineStack>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
