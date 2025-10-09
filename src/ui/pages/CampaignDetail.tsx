import {
  Page,
  Card,
  BlockStack,
  Text,
  TextField,
  InlineStack,
  Button,
  Divider,
  CalloutCard,
  Badge,
} from '@shopify/polaris';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { inferShopDomainFromHostParam } from '../../lib/shop';
import CopyButton from '../components/CopyButton';
import UtmBuilder, { UtmState } from '../components/UtmBuilder';

export default function CampaignDetail() {
  const { id = '' } = useParams();
  const shop = useMemo(() => inferShopDomainFromHostParam(), []);
  const qc = useQueryClient();
  const nav = useNavigate();

  const campaign = useQuery({
    queryKey: ['campaign', id, shop],
    queryFn: () => apiFetch<any>(`/campaigns/${id}?shop=${encodeURIComponent(shop)}`),
  });

  const segments = useQuery({
    queryKey: ['segments', shop],
    queryFn: () => apiFetch<any[]>(`/segments?shop=${encodeURIComponent(shop)}`),
  });

  const [name, setName] = useState('');
  const [segmentId, setSegmentId] = useState('');
  const [templateKey, setTemplateKey] = useState('campaign');
  const [discountCode, setDiscountCode] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [utm, setUtm] = useState<UtmState>({ utm_source: 'sms', utm_medium: 'sms' });
  const [testTo, setTestTo] = useState('');
  const [estimate, setEstimate] = useState<any>(null);
  const [snapshot, setSnapshot] = useState<any>(null);

  // keep local fields synced
  useEffect(() => {
    if (campaign.data && !name) {
      setName(campaign.data.name || '');
      setSegmentId(campaign.data.segmentId || '');
      setTemplateKey(campaign.data.templateKey || 'campaign');
      setUtm(campaign.data.utmJson || { utm_source: 'sms', utm_medium: 'sms' });
    }
  }, [campaign.data, name]);

  const saveMut = useMutation({
    mutationFn: () =>
      apiFetch(`/campaigns/${id}?shop=${encodeURIComponent(shop)}`, {
        method: 'PUT',
        body: JSON.stringify({ name, segmentId: segmentId || null, templateKey }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaign', id, shop] }),
  });

  const attachMut = useMutation({
    mutationFn: () =>
      apiFetch(`/campaigns/${id}/attach-discount?shop=${encodeURIComponent(shop)}`, {
        method: 'POST',
        body: JSON.stringify({ code: discountCode }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaign', id, shop] });
    },
  });

  const utmMut = useMutation({
    mutationFn: () =>
      apiFetch(`/campaigns/${id}/utm?shop=${encodeURIComponent(shop)}`, {
        method: 'PUT',
        body: JSON.stringify(utm),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaign', id, shop] }),
  });

  async function previewApplyUrl() {
    const res = await apiFetch<{ url: string }>(
      `/campaigns/${id}/apply-url?shop=${encodeURIComponent(shop)}&redirect=/checkout&short=true`
    );
    setApplyUrl(res.url);
  }

  async function doSnapshot() {
    try {
      const res = await apiFetch(`/campaigns/${id}/snapshot?shop=${encodeURIComponent(shop)}`, {
        method: 'POST',
      });
      setSnapshot(res);
    } catch {
      // Fallback: if snapshot not implemented, try segments preview
      if (campaign.data?.segmentId) {
        const prev = await apiFetch(
          `/segments/${campaign.data.segmentId}/preview?shop=${encodeURIComponent(shop)}`,
          { method: 'POST', body: JSON.stringify({ limit: 1 }) }
        );
        setSnapshot({
          count: (prev as any)?.total ?? 0,
          note: 'Segment preview used (snapshot endpoint unavailable)',
        });
      }
    }
  }

  async function doEstimate() {
    try {
      const res = await apiFetch(`/campaigns/${id}/estimate?shop=${encodeURIComponent(shop)}`, {
        method: 'POST',
      });
      setEstimate(res);
    } catch {
      setEstimate({ error: 'Estimate endpoint not available' });
    }
  }

  async function doTestSend() {
    if (!testTo) {
      alert('Enter test phone (E.164)');
      return;
    }
    const res = await apiFetch(`/campaigns/${id}/test-send?shop=${encodeURIComponent(shop)}`, {
      method: 'POST',
      body: JSON.stringify({ to: testTo }),
    });
    alert('Test sent: ' + JSON.stringify(res));
  }

  async function doSendNow() {
    const res = await apiFetch(`/campaigns/${id}/send-now?shop=${encodeURIComponent(shop)}`, {
      method: 'POST',
    });
    alert('Send queued: ' + JSON.stringify(res));
    qc.invalidateQueries({ queryKey: ['campaigns', shop] });
  }

  return (
    <Page
      title={`Campaign: ${campaign.data?.name || ''}`}
      backAction={{ content: 'Back', onAction: () => nav('/campaigns') }}
    >
      <BlockStack gap="400">
        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Details
              </Text>
              <InlineStack gap="400">
                <TextField label="Name" value={name} onChange={setName} autoComplete="off" />
                <TextField
                  label="Segment ID"
                  value={segmentId}
                  onChange={setSegmentId}
                  autoComplete="off"
                  helpText="Use Segments page to get an ID"
                />
                <TextField
                  label="Template key"
                  value={templateKey}
                  onChange={setTemplateKey}
                  autoComplete="off"
                />
              </InlineStack>
              <InlineStack gap="400">
                <Button
                  variant="primary"
                  onClick={() => saveMut.mutate()}
                  loading={saveMut.isPending}
                >
                  Save
                </Button>
                <Badge tone="success">{campaign.data?.status || 'draft'}</Badge>
              </InlineStack>
            </BlockStack>
          </div>
        </Card>

        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Discount
              </Text>
              <InlineStack gap="400">
                <TextField
                  label="Code"
                  value={discountCode}
                  onChange={setDiscountCode}
                  autoComplete="off"
                />
                <Button onClick={() => attachMut.mutate()} loading={attachMut.isPending}>
                  Attach to campaign
                </Button>
                <Button
                  tone="critical"
                  onClick={() =>
                    apiFetch(`/campaigns/${id}/detach-discount?shop=${encodeURIComponent(shop)}`, {
                      method: 'POST',
                    }).then(() => qc.invalidateQueries({ queryKey: ['campaign', id, shop] }))
                  }
                >
                  Detach
                </Button>
              </InlineStack>
              <InlineStack gap="400">
                <Button onClick={previewApplyUrl}>Preview apply URL</Button>
                {applyUrl && (
                  <>
                    <CopyButton text={applyUrl}>Copy link</CopyButton>
                    <Button url={applyUrl} target="_blank">
                      Open
                    </Button>
                  </>
                )}
              </InlineStack>
              {applyUrl && (
                <div
                  style={{
                    fontFamily: 'monospace',
                    background: '#f6f6f7',
                    padding: 12,
                    borderRadius: 6,
                    wordBreak: 'break-all',
                  }}
                >
                  {applyUrl}
                </div>
              )}
            </BlockStack>
          </div>
        </Card>

        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                UTM
              </Text>
              <UtmBuilder value={utm} onChange={setUtm} />
              <InlineStack gap="400">
                <Button onClick={() => utmMut.mutate()} loading={utmMut.isPending}>
                  Save UTM
                </Button>
              </InlineStack>
            </BlockStack>
          </div>
        </Card>

        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Audience
              </Text>
              <InlineStack gap="400">
                <Button onClick={doSnapshot}>Snapshot audience</Button>
                <Button onClick={doEstimate} data-testid="estimate-button">Estimate cost</Button>
              </InlineStack>
              {snapshot && (
                <CalloutCard
                  title="Snapshot"
                  illustration="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
                  primaryAction={{ content: 'Refresh', onAction: () => {} }}
                >
                  <Text as="p">
                    Count: <b>{snapshot.count ?? snapshot.total ?? 0}</b>{' '}
                    {snapshot.note ? `(${snapshot.note})` : ''}
                  </Text>
                </CalloutCard>
              )}
              {estimate && (
                <CalloutCard
                  title="Estimate"
                  illustration="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
                  primaryAction={{ content: 'Refresh', onAction: () => {} }}
                >
                  <pre
                    style={{
                      whiteSpace: 'pre-wrap',
                      background: '#f6f6f7',
                      padding: 12,
                      borderRadius: 6,
                    }}
                  >
                    {JSON.stringify(estimate, null, 2)}
                  </pre>
                </CalloutCard>
              )}
            </BlockStack>
          </div>
        </Card>

        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Test & Send
              </Text>
              <InlineStack gap="400">
                <TextField
                  label="Test phone (E.164)"
                  value={testTo}
                  onChange={setTestTo}
                  autoComplete="off"
                />
                <Button onClick={doTestSend} data-testid="test-send-button">Send test</Button>
                <Button variant="primary" tone="success" onClick={doSendNow} data-testid="send-campaign-button">
                  Send now
                </Button>
              </InlineStack>
            </BlockStack>
          </div>
        </Card>
      </BlockStack>
    </Page>
  );
}
