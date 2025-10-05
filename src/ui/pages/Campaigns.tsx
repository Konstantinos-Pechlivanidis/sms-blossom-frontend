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
} from '@shopify/polaris';
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { inferShopDomainFromHostParam } from '../../lib/shop';

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
        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Create campaign
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
                  onChange={setSegmentId}
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

        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Campaigns
              </Text>
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
            </BlockStack>
          </div>
        </Card>
      </BlockStack>
    </Page>
  );
}

function toIso(local: string): string {
  const d = new Date(local);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}
