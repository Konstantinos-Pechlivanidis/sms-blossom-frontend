import { Card, BlockStack, SkeletonDisplayText, SkeletonBodyText } from '@shopify/polaris';

export function KpiSkeletonRow() {
  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <BlockStack gap="300">
          <SkeletonDisplayText size="small" />
          <SkeletonBodyText lines={2} />
        </BlockStack>
      </div>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <BlockStack gap="300">
          <SkeletonDisplayText size="medium" />
          <div style={{ height: 320, background: '#f6f6f7', borderRadius: 8 }} />
        </BlockStack>
      </div>
    </Card>
  );
}

export function TableSkeleton() {
  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <BlockStack gap="300">
          <SkeletonDisplayText size="small" />
          <SkeletonBodyText lines={6} />
        </BlockStack>
      </div>
    </Card>
  );
}
