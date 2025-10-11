import {
  Card,
  BlockStack,
  Text,
  TextField,
  InlineStack,
  Button,
  Divider,
  CalloutCard,
  Badge,
  Layout,
  Grid,
} from '@shopify/polaris';
import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigateWithHost } from '../../lib/navigation/useNavigateWithHost';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inferShopDomainFromHostParam } from '../../lib/shop';
import CopyButton from '../components/CopyButton';
import UtmBuilder, { UtmState } from '../components/UtmBuilder';
import { PageHeader } from '../components/PageHeader';
import { SectionCard } from '../components/SectionCard';
import { ExplainableButton } from '../components/ExplainableButton';
import { SMSPhonePreview } from '../../features/campaigns/SMSPhonePreview';
import { useSaveBar } from '../../lib/hooks/useSaveBar';
import { authorizedFetch } from '../../lib/auth/authorizedFetch';

export default function CampaignDetail() {
  const { id = '' } = useParams();
  const shop = useMemo(() => inferShopDomainFromHostParam(), []);
  const qc = useQueryClient();
  const nav = useNavigateWithHost();

  const campaign = useQuery({
    queryKey: ['campaign', id, shop],
    queryFn: async () => {
      const response = await authorizedFetch(`/campaigns/${id}?shop=${encodeURIComponent(shop)}`);
      return response.json() as Promise<any>;
    },
  });

  const segments = useQuery({
    queryKey: ['segments', shop],
    queryFn: async () => {
      const response = await authorizedFetch(`/segments?shop=${encodeURIComponent(shop)}`);
      return response.json() as Promise<any[]>;
    },
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
  const [isDirty, setIsDirty] = useState(false);

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
      authorizedFetch(`/campaigns/${id}?shop=${encodeURIComponent(shop)}`, {
        method: 'PUT',
        body: JSON.stringify({ name, segmentId: segmentId || null, templateKey }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaign', id, shop] });
      setIsDirty(false);
    },
  });

  const attachMut = useMutation({
    mutationFn: () =>
      authorizedFetch(`/campaigns/${id}/attach-discount?shop=${encodeURIComponent(shop)}`, {
        method: 'POST',
        body: JSON.stringify({ code: discountCode }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaign', id, shop] });
    },
  });

  const utmMut = useMutation({
    mutationFn: () =>
      authorizedFetch(`/campaigns/${id}/utm?shop=${encodeURIComponent(shop)}`, {
        method: 'PUT',
        body: JSON.stringify(utm),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaign', id, shop] });
      setIsDirty(false);
    },
  });

  async function previewApplyUrl() {
    const response = await authorizedFetch(
      `/campaigns/${id}/apply-url?shop=${encodeURIComponent(shop)}&redirect=/checkout&short=true`
    );
    const res = await response.json() as { url: string };
    setApplyUrl(res.url);
  }

  async function doSnapshot() {
    try {
      const response = await authorizedFetch(`/campaigns/${id}/snapshot?shop=${encodeURIComponent(shop)}`, {
        method: 'POST',
      });
      const res = await response.json();
      setSnapshot(res);
    } catch {
      // Fallback: if snapshot not implemented, try segments preview
      if (campaign.data?.segmentId) {
        const response = await authorizedFetch(
          `/segments/${campaign.data.segmentId}/preview?shop=${encodeURIComponent(shop)}`,
          { method: 'POST', body: JSON.stringify({ limit: 1 }) }
        );
        const prev = await response.json();
        setSnapshot({
          count: (prev as any)?.total ?? 0,
          note: 'Segment preview used (snapshot endpoint unavailable)',
        });
      }
    }
  }

  async function doEstimate() {
    try {
      const response = await authorizedFetch(`/campaigns/${id}/estimate?shop=${encodeURIComponent(shop)}`, {
        method: 'POST',
      });
      const res = await response.json();
      setEstimate(res);
    } catch {
      setEstimate({ error: 'Estimate endpoint not available' });
    }
  }

  async function doTestSend() {
    if (!testTo) {
      // Show validation error for missing phone number
      return;
    }
    const response = await authorizedFetch(`/campaigns/${id}/test-send?shop=${encodeURIComponent(shop)}`, {
      method: 'POST',
      body: JSON.stringify({ to: testTo }),
    });
    const res = await response.json();
    // Test SMS sent successfully
  }

  async function doSendNow() {
    const response = await authorizedFetch(`/campaigns/${id}/send-now?shop=${encodeURIComponent(shop)}`, {
      method: 'POST',
    });
    const res = await response.json();
    // Campaign queued for sending
    qc.invalidateQueries({ queryKey: ['campaigns', shop] });
  }

  // Save Bar hook
  const { SaveBarComponent, isVisible } = useSaveBar({
    isDirty,
    onSave: () => saveMut.mutate(),
    onDiscard: () => setIsDirty(false),
    loading: saveMut.isPending,
  });

  return (
    <>
      {SaveBarComponent}
      <PageHeader 
        title={`Campaign: ${campaign.data?.name || ''}`}
        subtitle="Manage campaign details, audience, and messaging"
        helpSlug="campaigns"
        secondaryActions={[
          <Button key="back" onClick={() => nav('/campaigns')}>
            Back
          </Button>
        ]}
      />
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <SectionCard title="Campaign Details">
              <BlockStack gap="300">
                <InlineStack gap="400">
                  <TextField 
                    label="Name" 
                    value={name} 
                    onChange={(value) => {
                      setName(value);
                      setIsDirty(true);
                    }} 
                    autoComplete="off" 
                  />
                  <TextField
                    label="Segment ID"
                    value={segmentId}
                    onChange={(value) => {
                      setSegmentId(value);
                      setIsDirty(true);
                    }}
                    autoComplete="off"
                    helpText="Use Segments page to get an ID"
                  />
                  <TextField
                    label="Template key"
                    value={templateKey}
                    onChange={(value) => {
                      setTemplateKey(value);
                      setIsDirty(true);
                    }}
                    autoComplete="off"
                  />
                </InlineStack>
                <InlineStack gap="400">
                  <ExplainableButton
                    onAction={() => saveMut.mutate()}
                    loading={saveMut.isPending}
                    variant="primary"
                    label="Save"
                    explainTitle="Save Campaign Details"
                    explainMarkdown="This will save the campaign name, segment ID, and template key to the backend."
                  />
                  <Badge tone="success">{campaign.data?.status || 'draft'}</Badge>
                </InlineStack>
              </BlockStack>
            </SectionCard>

            <SectionCard title="Discount Configuration">
              <BlockStack gap="300">
                <InlineStack gap="400">
                  <TextField
                    label="Code"
                    value={discountCode}
                    onChange={setDiscountCode}
                    autoComplete="off"
                  />
                  <ExplainableButton
                    onAction={() => attachMut.mutate()}
                    loading={attachMut.isPending}
                    variant="secondary"
                    label="Attach to campaign"
                    explainTitle="Attach Discount Code"
                    explainMarkdown="This will attach the discount code to the campaign for use in SMS messages."
                  />
                  <ExplainableButton
                    onAction={() =>
                      authorizedFetch(`/campaigns/${id}/detach-discount?shop=${encodeURIComponent(shop)}`, {
                        method: 'POST',
                      }).then(() => qc.invalidateQueries({ queryKey: ['campaign', id, shop] }))
                    }
                    variant="secondary"
                    label="Detach"
                    explainTitle="Detach Discount Code"
                    explainMarkdown="This will remove the discount code from the campaign."
                  />
                </InlineStack>
                <InlineStack gap="400">
                  <ExplainableButton
                    onAction={previewApplyUrl}
                    variant="secondary"
                    label="Preview apply URL"
                    explainTitle="Preview Apply URL"
                    explainMarkdown="This will generate a preview URL for the discount application flow."
                  />
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
            </SectionCard>

            <SectionCard title="UTM Tracking">
              <BlockStack gap="300">
                <UtmBuilder value={utm} onChange={(value) => {
                  setUtm(value);
                  setIsDirty(true);
                }} />
                <InlineStack gap="400">
                  <ExplainableButton
                    onAction={() => utmMut.mutate()}
                    loading={utmMut.isPending}
                    variant="secondary"
                    label="Save UTM"
                    explainTitle="Save UTM Parameters"
                    explainMarkdown="This will save the UTM tracking parameters for the campaign."
                  />
                </InlineStack>
              </BlockStack>
            </SectionCard>

            <SectionCard title="Audience & Cost Analysis">
              <BlockStack gap="300">
                <InlineStack gap="400">
                  <ExplainableButton
                    onAction={doSnapshot}
                    variant="secondary"
                    label="Snapshot audience"
                    explainTitle="Audience Snapshot"
                    explainMarkdown="This will take a snapshot of the current audience size based on the selected segment."
                  />
                  <ExplainableButton
                    onAction={doEstimate}
                    variant="secondary"
                    label="Estimate cost"
                    explainTitle="Cost Estimation"
                    explainMarkdown="This will calculate the estimated cost for sending the campaign to the current audience."
                    data-testid="estimate-button"
                  />
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
                    title="Cost Estimate"
                    illustration="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
                    primaryAction={{ content: 'Refresh', onAction: () => {} }}
                  >
                    <Text as="p">
                      {estimate.error ? (
                        <Text as="span" tone="critical">{estimate.error}</Text>
                      ) : (
                        <>
                          <Text as="p">Estimated cost: <b>${estimate.cost || 'N/A'}</b></Text>
                          <Text as="p">Recipients: <b>{estimate.recipients || 'N/A'}</b></Text>
                          <Text as="p">Cost per message: <b>${estimate.costPerMessage || 'N/A'}</b></Text>
                        </>
                      )}
                    </Text>
                  </CalloutCard>
                )}
              </BlockStack>
            </SectionCard>

            <SectionCard title="Test & Send">
              <BlockStack gap="300">
                <InlineStack gap="400">
                  <TextField
                    label="Test phone (E.164)"
                    value={testTo}
                    onChange={setTestTo}
                    autoComplete="off"
                  />
                  <ExplainableButton
                    onAction={doTestSend}
                    variant="secondary"
                    label="Send test"
                    explainTitle="Send Test SMS"
                    explainMarkdown="This will send a test SMS to the specified phone number to preview the message."
                    data-testid="test-send-button"
                  />
                  <ExplainableButton
                    onAction={doSendNow}
                    variant="primary"
                    label="Send now"
                    explainTitle="Send Campaign Now"
                    explainMarkdown="This will immediately send the campaign to all recipients in the selected segment."
                    data-testid="send-campaign-button"
                  />
                </InlineStack>
              </BlockStack>
            </SectionCard>
          </BlockStack>
        </Layout.Section>
        
        <Layout.Section>
          <SectionCard title="SMS Preview">
            <SMSPhonePreview
              messageText={`Hello! Use code ${discountCode || 'SAVE20'} for 20% off your next purchase. Shop now: ${applyUrl || 'https://example.com'}`}
              isUnicode={false}
              segments={1}
              vars={{ code: discountCode || 'SAVE20', url: applyUrl || 'https://example.com' }}
            />
          </SectionCard>
        </Layout.Section>
      </Layout>
    </>
  );
}
