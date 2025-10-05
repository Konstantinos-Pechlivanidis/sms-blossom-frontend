import { Card, Page, Text, InlineStack, BlockStack } from '@shopify/polaris';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { useMemo } from 'react';
import { KpiSkeletonRow, ChartSkeleton } from '../components/Skeletons';

type Overview = {
  ok: boolean;
  range: { from: string; to: string };
  sent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
  cost: number;
  optIns: number;
  optOuts: number;
};
type Timeseries = {
  ok: boolean;
  range: any;
  series: Array<{ day: string; sent: number; delivered: number; failed: number; cost: number }>;
};

export default function Dashboard() {
  const shop = useMemo(() => {
    const h = new URL(window.location.href).searchParams.get('host') || '';
    try {
      const s = atob(h);
      const u = new URL(`https://${s}`);
      const sub = u.hostname.split('.')[0];
      return `${sub}.myshopify.com`;
    } catch {
      return '';
    }
  }, []);

  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ['overview', shop],
    queryFn: () =>
      apiFetch<Overview>(`/reports/overview?shop=${encodeURIComponent(shop)}&window=30d`),
  });

  const { data: ts, isLoading: loadingTs } = useQuery({
    queryKey: ['timeseries', shop],
    queryFn: () =>
      apiFetch<Timeseries>(
        `/reports/messaging/timeseries?shop=${encodeURIComponent(shop)}&window=30d`
      ),
  });

  return (
    <Page title="Dashboard">
      <BlockStack gap="400">
        {loadingOverview ? (
          <KpiSkeletonRow />
        ) : (
          <Card>
            <div style={{ padding: '16px' }}>
              <BlockStack gap="200">
                <InlineStack gap="400" align="space-between">
                  <Text as="h2" variant="headingMd">
                    Overview (30d)
                  </Text>
                  <Text as="span" tone="subdued">
                    {overview?.range?.from?.slice(0, 10)} → {overview?.range?.to?.slice(0, 10)}
                  </Text>
                </InlineStack>
                <InlineStack gap="600">
                  <Stat label="Sent" value={overview?.sent} />
                  <Stat label="Delivered" value={overview?.delivered} />
                  <Stat label="Failed" value={overview?.failed} />
                  <Stat label="Delivery rate" value={toPct(overview?.deliveryRate)} />
                  <Stat label="Cost (€)" value={fmt(overview?.cost)} />
                  <Stat label="Opt-ins" value={overview?.optIns} />
                  <Stat label="Opt-outs" value={overview?.optOuts} />
                </InlineStack>
              </BlockStack>
            </div>
          </Card>
        )}

        {loadingTs ? (
          <ChartSkeleton />
        ) : (
          <Card>
            <div style={{ padding: '16px' }}>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Messaging (last 30d)
                </Text>
                <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {ts?.series
                    ?.map(
                      (r) =>
                        `${r.day?.slice(0, 10)}  sent:${r.sent}  deliv:${r.delivered}  fail:${r.failed}  €${fmt(r.cost)}`
                    )
                    .join('\n') || '—'}
                </div>
              </BlockStack>
            </div>
          </Card>
        )}
      </BlockStack>
    </Page>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <BlockStack>
      <Text as="span" tone="subdued">
        {label}
      </Text>
      <Text as="p" variant="headingLg">
        {value ?? '—'}
      </Text>
    </BlockStack>
  );
}
function toPct(n?: number) {
  if (typeof n !== 'number') return '—';
  return `${(n * 100).toFixed(1)}%`;
}
function fmt(n?: number) {
  if (typeof n !== 'number') return '0.00';
  return n.toFixed(2);
}
