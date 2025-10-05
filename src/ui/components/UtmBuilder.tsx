import { Card, BlockStack, TextField, InlineStack, Text } from '@shopify/polaris';

export type UtmState = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

export default function UtmBuilder({
  value,
  onChange,
}: {
  value: UtmState;
  onChange: (v: UtmState) => void;
}) {
  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <BlockStack gap="300">
          <Text as="h3" variant="headingMd">
            UTM parameters (optional)
          </Text>
          <InlineStack gap="400">
            <TextField
              label="utm_source"
              value={value.utm_source ?? 'sms'}
              onChange={(v) => onChange({ ...value, utm_source: v })}
              autoComplete="off"
            />
            <TextField
              label="utm_medium"
              value={value.utm_medium ?? 'sms'}
              onChange={(v) => onChange({ ...value, utm_medium: v })}
              autoComplete="off"
            />
          </InlineStack>
          <InlineStack gap="400">
            <TextField
              label="utm_campaign"
              value={value.utm_campaign ?? ''}
              onChange={(v) => onChange({ ...value, utm_campaign: v })}
              autoComplete="off"
              helpText="Tip: set to a campaign or discount identifier"
            />
            <TextField
              label="utm_term"
              value={value.utm_term ?? ''}
              onChange={(v) => onChange({ ...value, utm_term: v })}
              autoComplete="off"
            />
          </InlineStack>
          <TextField
            label="utm_content"
            value={value.utm_content ?? ''}
            onChange={(v) => onChange({ ...value, utm_content: v })}
            autoComplete="off"
          />
        </BlockStack>
      </div>
    </Card>
  );
}
