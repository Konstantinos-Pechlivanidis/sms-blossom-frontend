import { Page, Card, Text, BlockStack, Button, InlineStack, Checkbox } from '@shopify/polaris';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../lib/api';
import { useEffect, useMemo, useState } from 'react';
import { inferShopDomainFromHostParam } from '../../lib/shop';

type Health = { status: 'ok' | 'error'; db?: boolean; redis?: boolean; version?: string };

export default function Settings() {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiFetch<Health>('/health'),
  });
  const shop = useMemo(() => inferShopDomainFromHostParam(), []);
  const [bannerEnabled, setBannerEnabled] = useState<boolean>(false);
  const [unsubscribeExample, setUnsubExample] = useState<string>('');

  useEffect(() => {
    // Try backend settings; fallback to localStorage
    (async () => {
      try {
        const s = await apiFetch<{ ui?: { bannerEnabled?: boolean } }>(
          `/settings?shop=${encodeURIComponent(shop)}`
        );
        setBannerEnabled(!!s?.ui?.bannerEnabled);
      } catch {
        const ls = localStorage.getItem('ui.bannerEnabled');
        if (ls != null) setBannerEnabled(ls === 'true');
      }
      // Unsubscribe example link (App Proxy)
      setUnsubExample(
        `/apps/sms-blossom/public/unsubscribe?shop=${encodeURIComponent(shop)}&phone=%2B3069XXXXXXX`
      );
    })();
  }, [shop]);

  async function saveBanner() {
    try {
      await apiFetch(`/settings?shop=${encodeURIComponent(shop)}`, {
        method: 'PUT',
        body: JSON.stringify({ ui: { bannerEnabled } }),
      });
      alert('Saved settings');
    } catch {
      // fallback persist locally so UI remains usable
      localStorage.setItem('ui.bannerEnabled', String(bannerEnabled));
      alert('Backend settings endpoint not available. Saved locally for now.');
    }
  }

  return (
    <Page title="Settings">
      <BlockStack gap="400">
        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Backend health
              </Text>
              <Text as="p">
                Status: <b>{data?.status ?? '—'}</b>
              </Text>
              <Text as="p">
                DB: <b>{String(data?.db ?? '—')}</b>, Queue: <b>{String(data?.redis ?? '—')}</b>
              </Text>
              <Button onClick={() => refetch()} loading={isFetching}>
                Refresh
              </Button>
            </BlockStack>
          </div>
        </Card>

        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Theme banner (App Embed)
              </Text>
              <Text as="p" tone="subdued">
                Toggle the storefront consent banner. The embed itself is enabled/disabled in the
                Theme Editor; this flag lets your backend respect a merchant preference if you wire
                it server-side.
              </Text>
              <Checkbox
                label="Enable banner"
                checked={bannerEnabled}
                onChange={(v) => setBannerEnabled(!!v)}
              />
              <InlineStack gap="400">
                <Button onClick={saveBanner} variant="primary">
                  Save
                </Button>
                <Button url="/admin/themes/current/editor?template=theme" target="_blank">
                  Open Theme Editor
                </Button>
              </InlineStack>
            </BlockStack>
          </div>
        </Card>

        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Unsubscribe link (example)
              </Text>
              <Text as="p">{unsubscribeExample}</Text>
              <Button url={unsubscribeExample} target="_blank">
                Open example
              </Button>
            </BlockStack>
          </div>
        </Card>

        <Card>
          <div style={{ padding: '16px' }}>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Environment
              </Text>
              <Text as="p">VITE_BACKEND_URL = {__BACKEND_URL__}</Text>
              <Text as="p">VITE_SHOPIFY_API_KEY = {__SHOPIFY_API_KEY__}</Text>
            </BlockStack>
          </div>
        </Card>
      </BlockStack>
    </Page>
  );
}
