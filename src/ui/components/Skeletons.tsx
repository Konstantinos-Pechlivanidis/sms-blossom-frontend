import { 
  Card, 
  BlockStack, 
  InlineStack, 
  SkeletonDisplayText, 
  SkeletonBodyText,
  SkeletonPage,
  SkeletonThumbnail,
  Text
} from '@shopify/polaris';

// @cursor:start(skeleton-components)
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

export function PageSkeleton() {
  return (
    <SkeletonPage>
      <BlockStack gap="400">
        <SkeletonDisplayText size="large" />
        <SkeletonBodyText lines={3} />
        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <SkeletonDisplayText size="medium" />
              <SkeletonBodyText lines={4} />
            </BlockStack>
          </div>
        </Card>
      </BlockStack>
    </SkeletonPage>
  );
}

export function DataGridSkeleton() {
  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <BlockStack gap="400">
          {/* Search and filter skeleton */}
          <InlineStack gap="200" align="space-between">
            <SkeletonDisplayText size="small" />
            <SkeletonDisplayText size="small" />
          </InlineStack>
          
          {/* Table skeleton */}
          <BlockStack gap="200">
            <SkeletonBodyText lines={1} />
            <SkeletonBodyText lines={1} />
            <SkeletonBodyText lines={1} />
            <SkeletonBodyText lines={1} />
            <SkeletonBodyText lines={1} />
          </BlockStack>
          
          {/* Pagination skeleton */}
          <InlineStack align="center">
            <SkeletonDisplayText size="small" />
          </InlineStack>
        </BlockStack>
      </div>
    </Card>
  );
}

export function CampaignWizardSkeleton() {
  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <BlockStack gap="400">
          <SkeletonDisplayText size="medium" />
          <SkeletonBodyText lines={2} />
          
          {/* Form fields skeleton */}
          <BlockStack gap="300">
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
          </BlockStack>
          
          {/* SMS Preview skeleton */}
          <div style={{ 
            width: '280px', 
            height: '500px', 
            background: '#f6f6f7', 
            borderRadius: '25px',
            margin: '0 auto'
          }} />
        </BlockStack>
      </div>
    </Card>
  );
}

export function ContactCardSkeleton() {
  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <InlineStack gap="300" align="start">
          <SkeletonThumbnail size="small" />
          <BlockStack gap="200">
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
          </BlockStack>
        </InlineStack>
      </div>
    </Card>
  );
}

export function MetricCardSkeleton() {
  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <BlockStack gap="200">
          <SkeletonDisplayText size="small" />
          <SkeletonDisplayText size="large" />
          <SkeletonBodyText lines={1} />
        </BlockStack>
      </div>
    </Card>
  );
}

export function FormSkeleton() {
  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <BlockStack gap="400">
          <SkeletonDisplayText size="medium" />
          
          {/* Form fields */}
          <BlockStack gap="300">
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={1} />
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={3} />
          </BlockStack>
          
          {/* Action buttons */}
          <InlineStack gap="200">
            <SkeletonDisplayText size="small" />
            <SkeletonDisplayText size="small" />
          </InlineStack>
        </BlockStack>
      </div>
    </Card>
  );
}

export function SettingsSkeleton() {
  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <BlockStack gap="400">
          <SkeletonDisplayText size="medium" />
          
          {/* Settings sections */}
          <BlockStack gap="300">
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={2} />
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={2} />
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={2} />
          </BlockStack>
        </BlockStack>
      </div>
    </Card>
  );
}
// @cursor:end(skeleton-components)
