import {
  Page,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Select,
  Button,
  IndexTable,
  Badge,
} from '@shopify/polaris';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { useShop } from '../../lib/shopContext';
import { fmtMoney, fmtPct } from '../../lib/format';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { KpiSkeletonRow, ChartSkeleton, TableSkeleton } from '../components/Skeletons';

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
type TimeseriesRes = {
  ok: boolean;
  range: any;
  series: Array<{ day: string; sent: number; delivered: number; failed: number; cost: number }>;
};
type CampaignRow = {
  campaignId: string;
  name: string;
  revenue: number;
  orders: number;
  via: { discount: number; utm: number };
  clicks_lifetime: number;
  messaging: { sent: number; delivered: number; failed: number };
};
type CampaignsRes = { ok: boolean; range: any; items: CampaignRow[] };
type AutomationsRes = {
  ok: boolean;
  range: any;
  items: Array<{ automation: string; orders: number; revenue: number }>;
};

export default function Reports() {
  const { shop, isReady } = useShop();
  const [windowSel, setWindowSel] = useState<'7d' | '30d' | '90d'>('30d');

  const { data: overview, isLoading: loadO } = useQuery({
    queryKey: ['r_overview', shop, windowSel],
    queryFn: () =>
      apiFetch<Overview>(`/reports/overview?shop=${encodeURIComponent(shop)}&window=${windowSel}`, { shop }),
    enabled: isReady && !!shop,
  });

  const { data: timeseries, isLoading: loadT } = useQuery({
    queryKey: ['r_ts', shop, windowSel],
    queryFn: () =>
      apiFetch<TimeseriesRes>(
        `/reports/messaging/timeseries?shop=${encodeURIComponent(shop)}&window=${windowSel}`,
        { shop }
      ),
    enabled: isReady && !!shop,
  });

  const { data: campaigns, isLoading: loadC } = useQuery({
    queryKey: ['r_campaigns', shop, windowSel],
    queryFn: () =>
      apiFetch<CampaignsRes>(
        `/reports/campaigns?shop=${encodeURIComponent(shop)}&window=${windowSel}`,
        { shop }
      ),
    enabled: isReady && !!shop,
  });

  const { data: automations, isLoading: loadA } = useQuery({
    queryKey: ['r_autom', shop, windowSel],
    queryFn: () =>
      apiFetch<AutomationsRes>(
        `/reports/automations?shop=${encodeURIComponent(shop)}&window=${windowSel}`,
        { shop }
      ),
    enabled: isReady && !!shop,
  });

  return (
    <Page title="Reports">
      <BlockStack gap="400">
        {loadO ? (
          <KpiSkeletonRow />
        ) : (
          <Card>
            <div style={{ padding: '16px' }}>
              <BlockStack gap="300">
                <InlineStack align="space-between" gap="400">
                  <Text as="h2" variant="headingMd">
                    Overview
                  </Text>
                  <InlineStack gap="200">
                    <Select
                      label="Window"
                      labelHidden
                      options={[
                        { label: '7 days', value: '7d' },
                        { label: '30 days', value: '30d' },
                        { label: '90 days', value: '90d' },
                      ]}
                      value={windowSel}
                      onChange={(v) => setWindowSel(v as any)}
                    />
                    <Button
                      onClick={() => {
                        /* could add from/to pickers in FE-D.1 */
                      }}
                    >
                      Custom… (v2)
                    </Button>
                  </InlineStack>
                </InlineStack>

                <InlineStack gap="600">
                  <Stat label="Sent" value={overview?.sent} />
                  <Stat label="Delivered" value={overview?.delivered} />
                  <Stat label="Failed" value={overview?.failed} />
                  <Stat label="Delivery" value={fmtPct(overview?.deliveryRate)} />
                  <Stat label="Spend" value={fmtMoney(overview?.cost)} />
                  <Stat label="Opt-ins" value={overview?.optIns} />
                  <Stat label="Opt-outs" value={overview?.optOuts} />
                </InlineStack>
                <Text tone="subdued" as="span">
                  Range: {overview?.range?.from?.slice(0, 10)} → {overview?.range?.to?.slice(0, 10)}
                </Text>
              </BlockStack>
            </div>
          </Card>
        )}

        {loadT ? (
          <ChartSkeleton />
        ) : (
          <Card>
            <div style={{ padding: '16px' }}>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Messaging timeseries
                </Text>
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={(timeseries?.series || []).map((p) => ({
                        ...p,
                        day: (p.day || '').slice(0, 10),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sent" stroke="#8884d8" dot={false} />
                      <Line type="monotone" dataKey="delivered" stroke="#82ca9d" dot={false} />
                      <Line type="monotone" dataKey="failed" stroke="#ff6961" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </BlockStack>
            </div>
          </Card>
        )}

        {loadC ? <TableSkeleton /> : <CampaignAttributionTable data={campaigns?.items || []} />}

        {loadA ? <KpiSkeletonRow /> : <AutomationAttributionCard data={automations?.items || []} />}
      </BlockStack>
    </Page>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <BlockStack>
      <Text tone="subdued" as="span">
        {label}
      </Text>
      <Text variant="headingLg" as="p">
        {value ?? '—'}
      </Text>
    </BlockStack>
  );
}

function CampaignAttributionTable({ data }: { data: CampaignRow[] }) {
  const rows = data.map((c, idx) => (
    <IndexTable.Row id={c.campaignId} key={c.campaignId} position={idx} selected={false}>
      <IndexTable.Cell>
        <Text as="span">{c.name || c.campaignId}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span">{fmtMoney(c.revenue)}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span">{c.orders}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span">
          disc:{c.via?.discount || 0} / utm:{c.via?.utm || 0}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="200">
          <Badge tone="success">{`sent ${c.messaging?.sent || 0}`}</Badge>
          <Badge tone="success">{`deliv ${c.messaging?.delivered || 0}`}</Badge>
          <Badge tone="critical">{`fail ${c.messaging?.failed || 0}`}</Badge>
        </InlineStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span">{c.clicks_lifetime || 0}</Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <BlockStack gap="300">
          <Text as="h2" variant="headingMd">
            Campaign attribution
          </Text>
          <IndexTable
            resourceName={{ singular: 'campaign', plural: 'campaigns' }}
            itemCount={data.length}
            headings={[
              { title: 'Campaign' },
              { title: 'Revenue' },
              { title: '# Orders' },
              { title: 'Attribution (disc/utm)' },
              { title: 'Messaging' },
              { title: 'Clicks (lifetime)' },
            ]}
            selectable={false}
          >
            {rows}
          </IndexTable>
        </BlockStack>
      </div>
    </Card>
  );
}

function AutomationAttributionCard({
  data,
}: {
  data: Array<{ automation: string; orders: number; revenue: number }>;
}) {
  const ac = (data || []).find((x) => x.automation === 'abandoned_checkout');
  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <BlockStack gap="200">
          <Text as="h2" variant="headingMd">
            Automation attribution
          </Text>
          <InlineStack gap="600">
            <Stat label="Abandoned Checkout — Orders" value={ac?.orders ?? 0} />
            <Stat label="Abandoned Checkout — Revenue" value={fmtMoney(ac?.revenue || 0)} />
          </InlineStack>
          <Text tone="subdued" as="span">
            Joins message.metadata.checkoutId ↔ order.checkout_id from webhook events.
          </Text>
        </BlockStack>
      </div>
    </Card>
  );
}
