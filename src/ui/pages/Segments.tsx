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
} from '@shopify/polaris';
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { inferShopDomainFromHostParam } from '../../lib/shop';

type Segment = { id: string; name: string; filterJson: any; createdAt?: string };

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

  const list = useQuery({
    queryKey: ['segments', shop],
    queryFn: () => apiFetch<Segment[]>(`/segments?shop=${encodeURIComponent(shop)}`),
  });

  const createMut = useMutation({
    mutationFn: (payload: any) =>
      apiFetch(`/segments?shop=${encodeURIComponent(shop)}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['segments', shop] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      apiFetch(`/segments/${id}?shop=${encodeURIComponent(shop)}`, {
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
      apiFetch(`/segments/${id}?shop=${encodeURIComponent(shop)}`, { method: 'DELETE' }),
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
    const res = await apiFetch<{ total: number; sample: any[] }>(
      `/segments/${id}/preview?shop=${encodeURIComponent(shop)}`,
      { method: 'POST', body: JSON.stringify({ limit: 20 }) }
    );
    setPreview(res);
  }

  const rows = (list.data || []).map((s, idx) => (
    <IndexTable.Row id={s.id} key={s.id} position={idx} selected={false}>
      <IndexTable.Cell>{s.name}</IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone="success">Active</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="200">
          <Button
            onClick={() => {
              setSelected(s);
              setEditorOpen(true);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => onPreview(s.id)}>Preview</Button>
          <Button tone="critical" onClick={() => deleteMut.mutate(s.id)}>
            Delete
          </Button>
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page title="Segments">
      <BlockStack gap="400">
        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Create segment
              </Text>
              <form onSubmit={handleSubmit(onCreate)}>
                <InlineStack gap="400">
                  <TextField
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
            </BlockStack>
          </div>
        </Card>

        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Segments
              </Text>
              <IndexTable
                resourceName={{ singular: 'segment', plural: 'segments' }}
                itemCount={list.data?.length || 0}
                headings={[{ title: 'Name' }, { title: 'Status' }, { title: 'Actions' }]}
                selectable={false}
              >
                {rows}
              </IndexTable>
            </BlockStack>
          </div>
        </Card>

        {preview && (
          <Card>
            <div style={{ padding: '16px' }}>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Preview
                </Text>
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
              </BlockStack>
            </div>
          </Card>
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
              alert('Invalid JSON');
            }
          },
        }}
        secondaryActions={[{ content: 'Cancel', onAction: () => setEditorOpen(false) }]}
      >
        <Modal.Section>
          <BlockStack gap="300">
            <TextField
              id="seg_edit_name"
              label="Name"
              autoComplete="off"
              value={selected?.name || ''}
            />
            <TextField
              id="seg_edit_json"
              label="Filter JSON"
              multiline={10}
              autoComplete="off"
              value={JSON.stringify(selected?.filterJson || {}, null, 2)}
            />
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
