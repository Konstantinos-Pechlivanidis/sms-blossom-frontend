import {
  Page,
  Card,
  BlockStack,
  Text,
  InlineStack,
  Button,
  TextField,
  Divider,
  IndexTable,
  Badge,
  Modal,
  Toast,
  Banner,
  Layout,
} from '@shopify/polaris';
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { authorizedFetch } from '../../lib/auth/authorizedFetch';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { inferShopDomainFromHostParam } from '../../lib/shop';
import { useToast } from '../../lib/useToast';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
// @cursor:start(segments-imports)
import { PageHeader } from '../components/PageHeader';
import { ExplainableButton } from '../components/ExplainableButton';
import { SectionCard } from '../components/SectionCard';
import { useSaveBar } from '../../lib/hooks/useSaveBar';
// @cursor:end(segments-imports)

type Segment = { 
  id: string; 
  name: string; 
  filterJson: any; 
  createdAt?: string;
  // @cursor-doc:start(segment-system-fields)
  isSystem?: boolean;
  slug?: string;
  // @cursor-doc:end(segment-system-fields)
};

const segSchema = z.object({
  name: z.string().min(2),
  filterJson: z.string().transform((s, ctx) => {
    try {
      return s.trim() ? JSON.parse(s) : {};
    } catch (e: any) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid JSON' });
      return z.NEVER;
    }
  }),
});

function useShop() {
  return useMemo(() => inferShopDomainFromHostParam(), []);
}

export default function Segments() {
  const shop = useShop();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Segment | null>(null);
  const [preview, setPreview] = useState<{ total: number; sample: any[] } | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  // @cursor-doc:start(segments-state)
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
  // @cursor-doc:end(segments-state)

  const list = useQuery({
    queryKey: ['segments', shop],
    queryFn: () => apiFetch<Segment[]>(`/segments?shop=${encodeURIComponent(shop)}`),
  });

  const createMut = useMutation({
    mutationFn: (payload: any) =>
      authorizedFetch(`/segments?shop=${encodeURIComponent(shop)}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['segments', shop] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      authorizedFetch(`/segments/${id}?shop=${encodeURIComponent(shop)}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['segments', shop] });
      setEditorOpen(false);
    },
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) =>
      authorizedFetch(`/segments/${id}?shop=${encodeURIComponent(shop)}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['segments', shop] }),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string; filterJson: string }>({
    resolver: zodResolver(segSchema),
    defaultValues: {
      name: 'High value opted-in',
      filterJson: '{"and":[{"consent":"opted_in"},{"total_spent":{"gte":100}}]}',
    },
  });

  async function onCreate(v: { name: string; filterJson: string }) {
    await createMut.mutateAsync({ name: v.name, filterJson: JSON.parse(v.filterJson) });
    reset();
  }

  async function onPreview(id: string) {
    setPreview(null);
    try {
      const res = await apiFetch<{ total: number; sample: any[] }>(
        `/segments/${id}/preview?shop=${encodeURIComponent(shop)}`,
        { method: 'POST', body: JSON.stringify({ limit: 20 }) }
      );
      setPreview(res);
      showSuccess('Segment preview loaded');
    } catch (error) {
      showError('Failed to preview segment');
    }
  }

  // @cursor-doc:start(system-segment-helpers)
  const isSystemSegment = (segment: Segment) => {
    return segment.isSystem === true;
  };

  const getSystemSegmentBadge = (segment: Segment) => {
    if (!isSystemSegment(segment)) return null;
    return <Badge tone="info">System</Badge>;
  };

  const getSystemSegmentSlug = (segment: Segment) => {
    return segment.slug || 'unknown';
  };

  const getSystemSegmentDescription = (segment: Segment) => {
    if (!isSystemSegment(segment)) return null;
    
    const slug = getSystemSegmentSlug(segment);
    const descriptions: Record<string, string> = {
      'male': 'Male customers',
      'female': 'Female customers',
      'age_18_24': 'Customers aged 18-24',
      'age_25_34': 'Customers aged 25-34',
      'age_35_44': 'Customers aged 35-44',
      'age_45_54': 'Customers aged 45-54',
      'age_55_plus': 'Customers aged 55+',
      'converted_last_90d': 'Customers who converted in the last 90 days',
      'converted_lifetime': 'Customers who have converted at least once'
    };
    
    return descriptions[slug] || 'System-managed segment';
  };
  // @cursor-doc:end(system-segment-helpers)

  const rows = (list.data || []).map((s, idx) => (
    <IndexTable.Row id={s.id} key={s.id} position={idx} selected={false}>
      <IndexTable.Cell>
        <BlockStack gap="100">
          <Text as="span" variant="bodyMd" fontWeight="medium">{s.name}</Text>
          {isSystemSegment(s) && (
            <Text as="span" variant="bodySm" tone="subdued">
              {getSystemSegmentDescription(s)}
            </Text>
          )}
        </BlockStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="200">
          <Badge tone="success">Active</Badge>
          {getSystemSegmentBadge(s)}
        </InlineStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="200">
          {!isSystemSegment(s) && (
            <>
              <Button
                onClick={() => {
                  setSelected(s);
                  setEditorOpen(true);
                }}
              >
                Edit
              </Button>
              <Button tone="critical" onClick={() => deleteMut.mutate(s.id)}>
                Delete
              </Button>
            </>
          )}
          <Button onClick={() => onPreview(s.id)}>Preview</Button>
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      {SaveBarComponent}
      <PageHeader
        title="Segments"
        subtitle="Create and manage customer segments for targeted SMS marketing campaigns"
        primaryAction={
          <ExplainableButton
            onAction={() => {
              // Focus on the create form
              document.getElementById('segment-name')?.focus();
            }}
            label="Create Segment"
            explainTitle="Create Segment"
            explainMarkdown="Create a customer segment to target specific groups of customers with your SMS campaigns. Use filters to define who should be included."
          />
        }
        helpSlug="segments"
      />
      <BlockStack gap="400">
        {/* @cursor:start(segments-hero) */}
        {/* Hero Section - Brand gradient wrapper */}
        <div className="gradientHero">
          <Text as="h2" variant="headingLg">Customer Segments</Text>
          <Text as="p" variant="bodyMd">Create and manage customer segments for targeted campaigns</Text>
        </div>
        {/* @cursor:end(segments-hero) */}
        
        <SectionCard title="Create New Segment">
          <form onSubmit={handleSubmit(onCreate)}>
            <InlineStack gap="400">
              <TextField
                id="segment-name"
                label="Name"
                autoComplete="off"
                value={watch('name')}
                onChange={(value) => setValue('name', value)}
                error={errors.name?.message}
              />
              <div style={{ flex: 1 }} />
            </InlineStack>
            <TextField
              label="Filter JSON"
              multiline={8}
              autoComplete="off"
              value={watch('filterJson')}
              onChange={(value) => setValue('filterJson', value)}
              error={errors.filterJson?.message}
            />
            <InlineStack gap="400">
              <Button submit variant="primary" loading={isSubmitting}>
                Create
              </Button>
              <Button onClick={() => reset()}>Reset</Button>
            </InlineStack>
          </form>
        </SectionCard>

        <SectionCard title="Existing Segments">
          <IndexTable
            resourceName={{ singular: 'segment', plural: 'segments' }}
            itemCount={list.data?.length || 0}
            headings={[{ title: 'Name' }, { title: 'Status' }, { title: 'Actions' }]}
            selectable={false}
          >
            {rows}
          </IndexTable>
        </SectionCard>

        {preview && (
          <SectionCard title="Segment Preview">
            <Text as="p">
              Total eligible contacts: <b>{preview.total}</b>
            </Text>
            <Text as="p">Sample (first {preview.sample?.length || 0})</Text>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                background: '#f6f6f7',
                padding: 12,
                borderRadius: 6,
              }}
            >
              {JSON.stringify(preview.sample, null, 2)}
            </pre>
          </SectionCard>
        )}
      </BlockStack>

      <Modal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={`Edit: ${selected?.name || ''}`}
        primaryAction={{
          content: 'Save',
          onAction: async () => {
            if (!selected) return;
            const name =
              (document.getElementById('seg_edit_name') as HTMLInputElement)?.value ||
              selected.name;
            const json =
              (document.getElementById('seg_edit_json') as HTMLTextAreaElement)?.value ||
              JSON.stringify(selected.filterJson);
            try {
              const filter = json.trim() ? JSON.parse(json) : {};
              await updateMut.mutateAsync({
                id: selected.id,
                payload: { name, filterJson: filter },
              });
            } catch (e) {
              // Invalid JSON format
            }
          },
          disabled: selected ? isSystemSegment(selected) : false,
        }}
        secondaryActions={[{ content: 'Cancel', onAction: () => setEditorOpen(false) }]}
      >
        <Modal.Section>
          <BlockStack gap="300">
            {selected && isSystemSegment(selected) && (
              <Banner tone="info">
                <Text as="p">This is a system-managed segment and cannot be edited.</Text>
              </Banner>
            )}
            <TextField
              id="seg_edit_name"
              label="Name"
              autoComplete="off"
              value={selected?.name || ''}
              disabled={selected ? isSystemSegment(selected) : false}
            />
            <TextField
              id="seg_edit_json"
              label="Filter JSON"
              multiline={10}
              autoComplete="off"
              value={JSON.stringify(selected?.filterJson || {}, null, 2)}
              disabled={selected ? isSystemSegment(selected) : false}
            />
            {selected && isSystemSegment(selected) && (
              <Text as="span" variant="bodySm" tone="subdued">
                System segments are automatically managed and updated based on customer data.
              </Text>
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>

      {ToastComponent}
    </>
  );
}
