import { Text } from '@shopify/polaris';

// @cursor:start(section-header)
export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="ios-hero p-6 mb-6">
      <Text as="h2" variant="headingLg" tone="inherit">{title}</Text>
      {subtitle && <Text as="p" variant="bodyMd" tone="subdued">{subtitle}</Text>}
    </div>
  );
}
// @cursor:end(section-header)
