import {
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
  Box,
  Layout,
  FormLayout,
} from '@shopify/polaris';
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { authorizedFetch } from '../../lib/auth/authorizedFetch';
import { useNavigate } from 'react-router-dom';
import { inferShopDomainFromHostParam } from '../../lib/shop';
import { CampaignWizard } from '../../features/campaigns/components/CampaignWizard';
import { CostEstimationPanel } from '../../features/campaigns/components/CostEstimationPanel';
import { useToast } from '../../lib/useToast';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
// @cursor:start(campaigns-imports)
import { PageHeader } from '../components/PageHeader';
import { ExplainableButton } from '../components/ExplainableButton';
import { SMSPhonePreview } from '../../features/campaigns/SMSPhonePreview';
import { useSaveBar } from '../../lib/hooks/useSaveBar';
import { SectionCard } from '../components/SectionCard';
import { FormRow } from '../components/FormRow';
import { DataGrid } from '../components/DataGrid';
// @cursor:end(campaigns-imports)

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
  const { showSuccess, showError, ToastComponent } = useToast();
  const [isDirty, setIsDirty] = useState(false);

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
  const [message, setMessage] = useState('Hello {{first_name}}, check out our latest deals! Use code {{discount_code}} for 20% off.');
  const [currentStep, setCurrentStep] = useState(1);

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

  // @cursor:start(campaigns-help-content)
  // Help content is now handled by PageHeader with helpSlug
  // @cursor:end(campaigns-help-content)

  const createMut = useMutation({
    mutationFn: () =>
      authorizedFetch(`/campaigns?shop=${encodeURIComponent(shop)}`, {
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
    <>
      {SaveBarComponent}
      <PageHeader
        title="Campaigns"
        subtitle="Create and manage SMS marketing campaigns with live preview"
        primaryAction={
          <ExplainableButton
            onAction={() => setShowWizard(true)}
            label="Create Campaign"
            explainTitle="Create Campaign"
            explainMarkdown="Start a new SMS campaign with our step-by-step wizard. You can target specific segments, preview your message, and schedule delivery."
          />
        }
        helpSlug="campaigns"
      />
      <BlockStack gap="400">
        {/* @cursor:start(campaigns-hero) */}
        {/* Hero Section - Brand gradient wrapper */}
        <div className="gradientHero">
          <Text as="h2" variant="headingLg">Campaign Management</Text>
          <Text as="p" variant="bodyMd">Create and manage SMS marketing campaigns</Text>
        </div>
        {/* @cursor:end(campaigns-hero) */}

        {/* @cursor:start(campaigns-wizard) */}
        {/* Professional Campaign Creation Wizard */}
        <SectionCard title="Create Campaign">
          <BlockStack gap="400">
            <Text variant="bodyMd" as="p" tone="subdued">
              Use our step-by-step wizard to create professional SMS campaigns with live preview.
            </Text>

            {/* Step 1: Details */}
            <SectionCard title="Step 1: Details">
              <FormLayout>
                <FormRow
                  label="Campaign Name"
                  helpText="Choose a descriptive name for tracking"
                  required
                >
                  <TextField 
                    label=""
                    value={name} 
                    onChange={setName} 
                    autoComplete="off"
                    placeholder="e.g., Black Friday Sale"
                  />
                </FormRow>
              </FormLayout>
            </SectionCard>

            {/* Step 2: Audience */}
            <SectionCard title="Step 2: Audience">
              <FormLayout>
                <FormRow
                  label="Target Segment"
                  helpText="Select which customers to target"
                >
                  <Select
                    label=""
                    options={[
                      { label: 'All customers', value: '' },
                      ...(segments.data || []).map((s: any) => ({ label: `${s.name} (${s.count || 0} customers)`, value: s.id })),
                    ]}
                    value={segmentId}
                    onChange={(value) => {
                      setSegmentId(value);
                      const segment = segments.data?.find((s: any) => s.id === value);
                      setSelectedSegment(segment);
                    }}
                  />
                </FormRow>
                {selectedSegment && (
                  <Text variant="bodySm" as="p" tone="subdued">
                    Targeting {selectedSegment.count || 0} customers in "{selectedSegment.name}"
                  </Text>
                )}
              </FormLayout>
            </SectionCard>

            {/* Step 3: Message with Live Preview */}
            <SectionCard title="Step 3: Message">
              <div className="brand-grid brand-grid-2">
                <BlockStack gap="300">
                  <FormRow
                    label="SMS Message"
                    helpText="Use {{variable_name}} for personalization. Available: {{first_name}}, {{last_name}}, {{discount_code}}, {{shop_name}}"
                  >
                    <TextField
                      label=""
                      value={message}
                      onChange={setMessage}
                      multiline={4}
                      autoComplete="off"
                      placeholder="Enter your message here... Use {{first_name}} for personalization."
                    />
                  </FormRow>
                  <InlineStack gap="200">
                    <Button
                      variant="tertiary"
                      size="slim"
                      onClick={() => setMessage(message + ' {{first_name}}')}
                    >
                      Add first_name
                    </Button>
                    <Button
                      variant="tertiary"
                      size="slim"
                      onClick={() => setMessage(message + ' {{discount_code}}')}
                    >
                      Add discount_code
                    </Button>
                  </InlineStack>
                </BlockStack>

                {/* Live SMS Preview */}
                <SMSPhonePreview
                  messageText={message}
                  vars={{ first_name: 'John', discount_code: 'SAVE20' }}
                  senderName="Your Store"
                />
              </div>
            </SectionCard>

            {/* Step 4: Discount & Send */}
            <SectionCard title="Step 4: Discount & Send">
              <FormLayout>
                <FormRow
                  label="Schedule at (optional)"
                  helpText="Leave empty to send immediately"
                >
                  <TextField
                    label=""
                    type="datetime-local"
                    value={scheduleAt}
                    onChange={setScheduleAt}
                    autoComplete="off"
                  />
                </FormRow>
                <FormRow
                  label="Batch size"
                  helpText="Number of messages to send per batch"
                >
                  <TextField
                    label=""
                    value={batchSize}
                    onChange={setBatchSize}
                    autoComplete="off"
                  />
                </FormRow>
              </FormLayout>
            </SectionCard>

            {/* Actions */}
            <InlineStack gap="400" align="end">
              <Button
                onClick={() => {
                  setName('');
                  setSegmentId('');
                  setScheduleAt('');
                  setMessage('Hello {{first_name}}, check out our latest deals! Use code {{discount_code}} for 20% off.');
                }}
              >
                Reset
              </Button>
              <ExplainableButton
                onAction={() => createMut.mutate()}
                label="Create Campaign"
                explainTitle="How costs are calculated?"
                explainMarkdown="Costs depend on message length and number of recipients. GSM messages (160 chars) are cheaper than Unicode (70 chars). Each segment is billed separately."
                loading={createMut.isPending}
              />
            </InlineStack>
          </BlockStack>
        </SectionCard>
        {/* @cursor:end(campaigns-wizard) */}

        {/* Cost Estimation Panel */}
        {selectedSegment && (
          <CostEstimationPanel
            segmentId={selectedSegment.id}
            segmentCount={selectedSegment.count || 0}
          />
        )}

        {/* Campaigns List */}
        <SectionCard title="Campaigns">
          <DataGrid
            headings={[
              { title: 'Name' },
              { title: 'Status' },
              { title: 'Template' },
              { title: 'Schedule' },
              { title: 'Open' },
            ]}
            rows={rows}
            itemCount={list.data?.length || 0}
            resourceName={{ singular: 'campaign', plural: 'campaigns' }}
            loading={list.isLoading}
            error={list.error?.message}
            emptyState={{
              heading: 'No campaigns yet',
              description: 'Create your first campaign to start sending SMS messages to customers.',
              action: {
                content: 'Create Campaign',
                onAction: () => setShowWizard(true),
              }
            }}
          />
        </SectionCard>

        {/* Campaign Wizard Modal */}
        <CampaignWizard
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
        />
      </BlockStack>
      {ToastComponent}
      
      {/* Help Dialog is now handled by PageHeader */}
    </>
  );
}

function toIso(local: string): string {
  const d = new Date(local);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}
