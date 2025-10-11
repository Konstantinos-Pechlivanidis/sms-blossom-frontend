import {
  Page,
  Card,
  BlockStack,
  Text,
  TextField,
  Button,
  InlineStack,
  Select,
  Checkbox,
  Divider,
  Banner,
  CalloutCard,
  Tabs,
  Spinner,
  Box,
  Layout,
} from '@shopify/polaris';
import { useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { authorizedFetch } from '../../lib/auth/authorizedFetch';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CopyButton from '../components/CopyButton';
import UtmBuilder, { UtmState } from '../components/UtmBuilder';
import { appendUtm, inferShopDomainFromHostParam } from '../../lib/shop';
import { DiscountTable } from '../../features/discounts/components/DiscountTable';
import { ConflictBanner } from '../../features/discounts/components/ConflictBanner';
import { useDiscountConflicts } from '../../features/discounts/hooks';
import { useToast } from '../../lib/useToast';
import { useSaveBar } from '../../lib/hooks/useSaveBar';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
// @cursor:start(discounts-imports)
import { PageHeader } from '../components/PageHeader';
import { ExplainableButton } from '../components/ExplainableButton';
import { SectionCard } from '../components/SectionCard';
// @cursor:end(discounts-imports)

const schema = z
  .object({
    code: z
      .string()
      .min(3)
      .max(64)
      .regex(/^[A-Z0-9\-_]+$/, 'Use A–Z, 0–9, dashes or underscores')
      .transform((s) => s.toUpperCase()),
    title: z.string().max(200).optional(),
    kind: z.enum(['percentage', 'amount']),
    value: z.coerce.number().positive('Must be > 0'),
    currencyCode: z.string().optional(),
    startsAt: z.string().optional(),
    endsAt: z.string().optional(),
    appliesOncePerCustomer: z.boolean().default(true),
    usageLimit: z.coerce.number().int().positive().optional(),
    redirect: z.string().default('/checkout'),
  })
  .refine((v) => (v.kind === 'amount' ? !!v.currencyCode : true), {
    path: ['currencyCode'],
    message: 'Currency required for amount discounts',
  })
  .refine(
    (v) => {
      if (!v.startsAt || !v.endsAt) return true;
      return new Date(v.endsAt).getTime() > new Date(v.startsAt).getTime();
    },
    { path: ['endsAt'], message: 'End must be after start' }
  );

type FormValues = z.infer<typeof schema>;

export default function Discounts() {
  const shop = useMemo(() => inferShopDomainFromHostParam(), []);
  const [utm, setUtm] = useState<UtmState>({ utm_source: 'sms', utm_medium: 'sms' });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [response, setResponse] = useState<any>(null);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [editingDiscount, setEditingDiscount] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const { showSuccess, showError, ToastComponent } = useToast();

  // Save Bar integration
  const { SaveBarComponent } = useSaveBar({
    isDirty,
    onSave: () => {
      // Handle save logic
      setIsDirty(false);
    },
    onDiscard: () => {
      setIsDirty(false);
    },
    loading: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: 'WELCOME10',
      title: 'Welcome 10%',
      kind: 'percentage',
      value: 10,
      redirect: '/checkout',
      appliesOncePerCustomer: true,
    },
  });

  const kind = watch('kind');

  async function onSubmit(values: FormValues) {
    try {
      setResponse(null);
      setPreviewUrl('');
      const payload: any = {
        code: values.code,
        title: values.title || values.code,
        kind: values.kind,
        value: values.value,
        appliesOncePerCustomer: values.appliesOncePerCustomer,
        usageLimit: values.usageLimit ?? undefined,
      };
      if (values.kind === 'amount') payload.currencyCode = values.currencyCode || 'EUR';
      if (values.startsAt) payload.startsAt = toIso(values.startsAt);
      if (values.endsAt) payload.endsAt = toIso(values.endsAt);

      const created = await authorizedFetch(`/discounts?shop=${encodeURIComponent(shop)}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setResponse(created);
      showSuccess('Discount created successfully');

      // Build apply URL using backend helper, then add UTM client-side
      const urlRes = await apiFetch<{ url: string }>(
        `/discounts/apply-url?shop=${encodeURIComponent(shop)}&code=${encodeURIComponent(values.code)}&redirect=${encodeURIComponent(values.redirect || '/checkout')}`
      ).catch(() => ({ url: '' }) as any);
      const withUtm = appendUtm(urlRes.url, utm);
      setPreviewUrl(withUtm);
    } catch (error) {
      showError('Failed to create discount');
    }
  }

  async function runConflictScan() {
    try {
      const res = await apiFetch<{ automaticDiscounts: any[] }>(
        `/discounts/conflicts?shop=${encodeURIComponent(shop)}`
      );
      setConflicts(res.automaticDiscounts || []);
      showSuccess('Conflict scan completed');
    } catch (error) {
      showError('Failed to scan for conflicts');
    }
  }

  // Get conflicts for current form data
  const formData = watch();
  const { conflicts: realTimeConflicts, checkForConflicts } = useDiscountConflicts(formData);

  const tabs = [
    {
      id: 'create',
      content: 'Create Discount',
      panel: (
        <BlockStack gap="400">
          <Banner tone="info">
            Create code discounts, preview apply URLs, add UTM parameters, and scan for conflicts with
            active automatic discounts.
          </Banner>

          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ padding: '16px' }}>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Discount details
                  </Text>
                <InlineStack gap="400">
                  <TextField
                    label="Code"
                    autoComplete="off"
                    value={watch('code')}
                    onChange={(value) => setValue('code', value)}
                    error={errors.code?.message}
                  />
                  <TextField
                    label="Title"
                    autoComplete="off"
                    value={watch('title')}
                    onChange={(value) => setValue('title', value)}
                    error={errors.title?.message}
                  />
                </InlineStack>
                <InlineStack gap="400">
                  <Select
                    label="Type"
                    options={[
                      { label: 'Percentage', value: 'percentage' },
                      { label: 'Amount', value: 'amount' },
                    ]}
                    value={kind}
                    onChange={(value) => setValue('kind', value as 'percentage' | 'amount')}
                  />
                  <TextField
                    label={kind === 'percentage' ? 'Value (%)' : 'Amount'}
                    autoComplete="off"
                    value={String(watch('value'))}
                    onChange={(value) => setValue('value', Number(value))}
                    error={errors.value?.message}
                  />
                  {kind === 'amount' && (
                    <Select
                      label="Currency"
                      options={[
                        { label: 'EUR', value: 'EUR' },
                        { label: 'USD', value: 'USD' },
                        { label: 'GBP', value: 'GBP' },
                      ]}
                      value={watch('currencyCode')}
                      onChange={(value) => setValue('currencyCode', value)}
                    />
                  )}
                </InlineStack>

                <InlineStack gap="400">
                  <TextField
                    type="datetime-local"
                    label="Starts at"
                    autoComplete="off"
                    value={watch('startsAt')}
                    onChange={(value) => setValue('startsAt', value)}
                    error={errors.startsAt?.message}
                  />
                  <TextField
                    type="datetime-local"
                    label="Ends at"
                    autoComplete="off"
                    value={watch('endsAt')}
                    onChange={(value) => setValue('endsAt', value)}
                    error={errors.endsAt?.message}
                  />
                </InlineStack>

                <InlineStack gap="400" align="space-between">
                  <Checkbox
                    label="Once per customer"
                    checked={watch('appliesOncePerCustomer')}
                    onChange={(checked) => setValue('appliesOncePerCustomer', checked)}
                  />
                  <TextField
                    label="Usage limit (optional)"
                    autoComplete="off"
                    value={watch('usageLimit') ? String(watch('usageLimit')) : ''}
                    onChange={(value) => setValue('usageLimit', value ? Number(value) : undefined)}
                    error={errors.usageLimit?.message}
                  />
                </InlineStack>

                <Divider />

                <Text as="h2" variant="headingMd">
                  Link & tracking
                </Text>
                <InlineStack gap="400">
                  <TextField
                    label="Redirect path"
                    helpText="Where Shopify should send customers after applying the code"
                    autoComplete="off"
                    value={watch('redirect')}
                    onChange={(value) => setValue('redirect', value)}
                  />
                </InlineStack>

                <UtmBuilder value={utm} onChange={setUtm} />

                  <InlineStack gap="400">
                    <Button submit variant="primary" loading={isSubmitting} data-testid="create-discount-button">
                      Create discount
                    </Button>
                    <Button onClick={runConflictScan}>Scan automatic conflicts</Button>
                    <Button
                      onClick={() => {
                        reset();
                        setPreviewUrl('');
                        setResponse(null);
                      }}
                      tone="critical"
                    >
                      Reset form
                    </Button>
                  </InlineStack>
                </BlockStack>
              </div>
            </form>
          </Card>

        {response && (
          <Card>
            <div style={{ padding: '16px' }}>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Created
                </Text>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    background: '#f6f6f7',
                    padding: 12,
                    borderRadius: 6,
                  }}
                >
                  {JSON.stringify(response, null, 2)}
                </pre>
              </BlockStack>
            </div>
          </Card>
        )}

        {previewUrl && (
          <Card>
            <div style={{ padding: '16px' }}>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Apply URL (with UTM)
                </Text>
                <div
                  style={{
                    fontFamily: 'monospace',
                    background: '#f6f6f7',
                    padding: 12,
                    borderRadius: 6,
                    wordBreak: 'break-all',
                  }}
                >
                  {previewUrl}
                </div>
                <InlineStack gap="400">
                  <CopyButton text={previewUrl}>Copy link</CopyButton>
                  <Button url={previewUrl} target="_blank">
                    Open
                  </Button>
                </InlineStack>
              </BlockStack>
            </div>
          </Card>
        )}

          {/* Real-time Conflict Detection */}
          {realTimeConflicts && realTimeConflicts.automaticDiscounts && realTimeConflicts.automaticDiscounts.length > 0 && (
            <ConflictBanner
              conflicts={realTimeConflicts as any}
              onResolve={(conflict) => {
                // Resolving discount conflict
              }}
              onDismiss={() => {
                // Dismiss conflicts
              }}
              onRefresh={checkForConflicts}
            />
          )}

          {conflicts.length > 0 && (
            <CalloutCard
              title="Active automatic discounts (advisory)"
              illustration="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
              primaryAction={{ content: 'Refresh', onAction: runConflictScan }}
            >
              <BlockStack gap="200">
                {conflicts.map((c, i) => (
                  <div key={i} style={{ padding: '4px 0' }}>
                    <Text as="p">
                      <b>{c.title}</b> — {c.type} — combinesWith:{' '}
                      {c.combinesWith
                        ? Object.entries(c.combinesWith)
                            .map(([k, v]) => `${k}:${v ? '✓' : '✕'}`)
                            .join(', ')
                        : 'n/a'}
                    </Text>
                  </div>
                ))}
              </BlockStack>
            </CalloutCard>
          )}
        </BlockStack>
      ),
    },
    {
      id: 'manage',
      content: 'Manage Discounts',
      panel: (
        <BlockStack gap="400">
          <DiscountTable
            onEdit={setEditingDiscount}
            onDelete={(id) => {
              // Delete discount
            }}
            onCopyUrl={(id) => {
              // Copy discount URL
            }}
          />
        </BlockStack>
      ),
    },
  ];

  return (
    <>
      {SaveBarComponent}
      <PageHeader
        title="Discounts"
        subtitle="Create and manage discount codes for your SMS marketing campaigns"
        primaryAction={
          <ExplainableButton
            onAction={() => setActiveTab(0)}
            label="Create Discount"
            explainTitle="Create Discount"
            explainMarkdown="Create a new discount code for your SMS campaigns. You can generate unique codes for each recipient or use shared codes."
          />
        }
        helpSlug="discounts"
      />
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {/* @cursor:start(discounts-hero) */}
            {/* Hero Section - Brand gradient wrapper */}
            <div className="gradientHero">
              <Text as="h2" variant="headingLg">Discount Management</Text>
              <Text as="p" variant="bodyMd">Create and manage discount codes for your campaigns</Text>
            </div>
            {/* @cursor:end(discounts-hero) */}
            <SectionCard>
              <Tabs
                tabs={tabs}
                selected={activeTab}
                onSelect={setActiveTab}
              >
                {tabs[activeTab].panel}
              </Tabs>
            </SectionCard>
          </BlockStack>
        </Layout.Section>
      </Layout>
      {ToastComponent}
    </>
  );
}

function toIso(local: string): string {
  // datetime-local returns local time; convert to ISO UTC
  const d = new Date(local);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}
