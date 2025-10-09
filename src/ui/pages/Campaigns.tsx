import {
  Page,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
  TextField,
  Select,
  IndexTable,
  Badge,
  Banner,
  Spinner,
  EmptyState,
} from '@shopify/polaris';
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { inferShopDomainFromHostParam } from '../../lib/shop';
import { CampaignWizard } from '../../features/campaigns/components/CampaignWizard';
import { CostEstimationPanel } from '../../features/campaigns/components/CostEstimationPanel';

type Campaign = {
  id: string;
  name: string;
  status: string;
  segmentId?: string | null;
  templateKey?: string | null;
  scheduleAt?: string | null;
  batchSize?: number | null;
};

export default function Campaigns() {
  const shop = useMemo(() => inferShopDomainFromHostParam(), []);
  const qc = useQueryClient();
  const nav = useNavigate();

  const segments = useQuery({
    queryKey: ['segments', shop],
    queryFn: () => apiFetch<any[]>(`/segments?shop=${encodeURIComponent(shop)}`),
  });
  const list = useQuery({
    queryKey: ['campaigns', shop],
    queryFn: () => apiFetch<Campaign[]>(`/campaigns?shop=${encodeURIComponent(shop)}`),
  });

  const [name, setName] = useState('October Blast');
  const [segmentId, setSegmentId] = useState<string>('');
  const [templateKey, setTemplateKey] = useState<string>('campaign');
  const [scheduleAt, setScheduleAt] = useState<string>('');
  const [batchSize, setBatchSize] = useState<string>('500');
  const [showWizard, setShowWizard] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<any>(null);

  const createMut = useMutation({
    mutationFn: () =>
      apiFetch(`/campaigns?shop=${encodeURIComponent(shop)}`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          segmentId: segmentId || null,
          templateKey,
          scheduleAt: scheduleAt ? toIso(scheduleAt) : null,
          batchSize: Number(batchSize) || 500,
        }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaigns', shop] });
    },
  });

  const rows = (list.data || []).map((c, idx) => (
    <IndexTable.Row id={c.id} key={c.id} position={idx} selected={false}>
      <IndexTable.Cell>
        <Text as="span">{c.name}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge>{c.status || 'draft'}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" tone="subdued">
          {c.templateKey || 'campaign'}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" tone="subdued">
          {c.scheduleAt ? new Date(c.scheduleAt).toLocaleString() : '—'}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button onClick={() => nav(`/campaigns/${c.id}`)}>Open</Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page title="Campaigns">
      <BlockStack gap="400">
        {/* Quick Create Form */}
        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingMd">
                  Create Campaign
                </Text>
                <Button
                  variant="primary"
                  onClick={() => setShowWizard(true)}
                  data-testid="create-campaign-wizard"
                >
                  Use Campaign Wizard
                </Button>
              </InlineStack>
              
              <Text variant="bodyMd" as="p" tone="subdued">
                Create a campaign quickly or use the wizard for step-by-step guidance.
              </Text>

              <InlineStack gap="400">
                <TextField label="Name" value={name} onChange={setName} autoComplete="off" />
                <Select
                  label="Segment"
                  options={[
                    { label: '(none)', value: '' },
                    ...(segments.data || []).map((s: any) => ({ label: s.name, value: s.id })),
                  ]}
                  value={segmentId}
                  onChange={(value) => {
                    setSegmentId(value);
                    const segment = segments.data?.find((s: any) => s.id === value);
                    setSelectedSegment(segment);
                  }}
                />
                <TextField
                  label="Template key"
                  value={templateKey}
                  onChange={setTemplateKey}
                  autoComplete="off"
                />
              </InlineStack>
              <InlineStack gap="400">
                <TextField
                  type="datetime-local"
                  label="Schedule at (optional)"
                  value={scheduleAt}
                  onChange={setScheduleAt}
                  autoComplete="off"
                />
                <TextField
                  label="Batch size"
                  value={batchSize}
                  onChange={setBatchSize}
                  autoComplete="off"
                />
                <div style={{ flex: 1 }} />
              </InlineStack>
              <InlineStack gap="400">
                <Button
                  variant="primary"
                  onClick={() => createMut.mutate()}
                  loading={createMut.isPending}
                  data-testid="create-campaign-quick"
                >
                  Create
                </Button>
                <Button
                  onClick={() => {
                    setName('');
                    setSegmentId('');
                    setScheduleAt('');
                  }}
                >
                  Reset
                </Button>
              </InlineStack>
            </BlockStack>
          </div>
        </Card>

        {/* Cost Estimation Panel */}
        {selectedSegment && (
          <CostEstimationPanel
            segmentId={selectedSegment.id}
            segmentCount={selectedSegment.count || 0}
          />
        )}

        {/* Campaigns List */}
        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Campaigns
              </Text>
              
              {list.isLoading ? (
                <InlineStack align="center" gap="200">
                  <Spinner size="small" />
                  <Text as="p">Loading campaigns...</Text>
                </InlineStack>
              ) : list.error ? (
                <Banner tone="critical">
                  <Text as="p">Failed to load campaigns: {list.error.message}</Text>
                </Banner>
              ) : !list.data || list.data.length === 0 ? (
                <EmptyState
                  heading="No campaigns yet"
                  image="https://cdn.shopify.com/shopifycloud/web/assets/v1/empty-state-illustration.svg"
                  action={{
                    content: 'Create Campaign',
                    onAction: () => setShowWizard(true),
                  }}
                >
                  <Text as="p">Create your first campaign to start sending SMS messages to customers.</Text>
                </EmptyState>
              ) : (
                <IndexTable
                  resourceName={{ singular: 'campaign', plural: 'campaigns' }}
                  itemCount={list.data?.length || 0}
                  headings={[
                    { title: 'Name' },
                    { title: 'Status' },
                    { title: 'Template' },
                    { title: 'Schedule' },
                    { title: 'Open' },
                  ]}
                  selectable={false}
                >
                  {rows}
                </IndexTable>
              )}
            </BlockStack>
          </div>
        </Card>

        {/* Campaign Wizard Modal */}
        <CampaignWizard
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
        />
      </BlockStack>
    </Page>
  );
}

function toIso(local: string): string {
  const d = new Date(local);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}
