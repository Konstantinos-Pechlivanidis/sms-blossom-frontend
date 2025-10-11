import { Text, BlockStack, Button, InlineStack, Checkbox, Banner, Spinner, Box } from '@shopify/polaris';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { inferShopDomainFromHostParam } from '../../lib/shop';
import { SettingsForm } from '../../features/settings/components/SettingsForm';
import { useSettings, useUpdateSettings } from '../../features/settings/hooks';
import { defaultSettings, SettingsFormData } from '../../features/settings/schemas/settingsSchema';
import { PageHeader } from '../components/PageHeader';
import { SectionCard } from '../components/SectionCard';
import { ExplainableButton } from '../components/ExplainableButton';
import { useSaveBar } from '../../lib/hooks/useSaveBar';
import { authorizedFetch } from '../../lib/auth/authorizedFetch';

type Health = { status: 'ok' | 'error'; db?: boolean; redis?: boolean; version?: string };

export default function Settings() {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await authorizedFetch('/health');
      return response.json() as Promise<Health>;
    },
  });
  const shop = useMemo(() => inferShopDomainFromHostParam(), []);
  const [bannerEnabled, setBannerEnabled] = useState<boolean>(false);
  const [unsubscribeExample, setUnsubExample] = useState<string>('');
  
  // Settings hooks
  const { data: settings, isLoading: settingsLoading, error: settingsError } = useSettings();
  const updateSettings = useUpdateSettings();
  const [saveError, setSaveError] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<string>('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Try backend settings; fallback to localStorage
    (async () => {
      try {
        const response = await authorizedFetch(`/settings?shop=${encodeURIComponent(shop)}`);
        const s = await response.json() as { ui?: { bannerEnabled?: boolean } };
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
      await authorizedFetch(`/settings?shop=${encodeURIComponent(shop)}`, {
        method: 'PUT',
        body: JSON.stringify({ ui: { bannerEnabled } }),
      });
      // Settings saved successfully
    } catch {
      // fallback persist locally so UI remains usable
      localStorage.setItem('ui.bannerEnabled', String(bannerEnabled));
      // Backend unavailable, saved locally
    }
  }

  const handleSaveSettings = async (data: SettingsFormData) => {
    setSaveError('');
    setSaveSuccess('');
    
    try {
      await updateSettings.mutateAsync(data);
      setSaveSuccess('Settings saved successfully!');
      setIsDirty(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save settings');
    }
  };

  const handleDiscard = () => {
    setIsDirty(false);
    setSaveError('');
    setSaveSuccess('');
  };

  // Save Bar hook
  const { SaveBarComponent, isVisible } = useSaveBar({
    isDirty,
    onSave: () => handleSaveSettings(getInitialSettings()),
    onDiscard: handleDiscard,
    loading: updateSettings.isPending,
  });

  const getInitialSettings = (): SettingsFormData => {
    if (settings?.settings) {
      return {
        timezone: settings.settings.timezone || defaultSettings.timezone,
        quietHours: settings.settings.quietHours || defaultSettings.quietHours,
        cap: settings.settings.cap || defaultSettings.cap,
        abandoned: {
          delayMinutes: settings.settings.abandoned?.delayMinutes || defaultSettings.abandoned.delayMinutes
        },
        senderId: (settings.settings as any).senderId || defaultSettings.senderId,
        locale: (settings.settings as any).locale || defaultSettings.locale,
        unsubscribeText: (settings.settings as any).unsubscribeText || defaultSettings.unsubscribeText,
        featureFlags: (settings.settings as any).featureFlags || defaultSettings.featureFlags,
      };
    }
    return defaultSettings;
  };

  return (
    <>
      {SaveBarComponent}
      <PageHeader 
        title="Settings"
        subtitle="Configure your SMS marketing preferences and integrations"
        helpSlug="settings"
      />
      <BlockStack gap="400">
        {/* App & Branding Settings */}
        <SectionCard title="App & Branding">
          <BlockStack gap="400">
            {settingsLoading ? (
              <InlineStack align="center" gap="200">
                <Spinner size="small" />
                <Text as="p">Loading settings...</Text>
              </InlineStack>
            ) : settingsError ? (
              <Banner tone="critical">
                <Text as="p">Failed to load settings: {settingsError.message}</Text>
              </Banner>
            ) : (
              <SettingsForm
                initialData={getInitialSettings()}
                onSave={handleSaveSettings}
                isLoading={updateSettings.isPending}
                error={saveError}
                success={saveSuccess}
                data-testid="settings-form"
              />
            )}
          </BlockStack>
        </SectionCard>

        {/* System Health */}
        <SectionCard title="System Health">
          <BlockStack gap="200">
            <Text as="p">
              Status: <b>{data?.status ?? '—'}</b>
            </Text>
            <Text as="p">
              DB: <b>{String(data?.db ?? '—')}</b>, Queue: <b>{String(data?.redis ?? '—')}</b>
            </Text>
            <ExplainableButton
              onAction={() => refetch()}
              loading={isFetching}
              variant="secondary"
              label="Refresh"
              explainTitle="System Health Refresh"
              explainMarkdown="This will check the current status of the backend services including database connectivity and Redis queue health."
            />
          </BlockStack>
        </SectionCard>

        {/* Theme Integration */}
        <SectionCard title="Theme Integration">
          <BlockStack gap="300">
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
              <ExplainableButton
                onAction={saveBanner}
                variant="primary"
                label="Save"
                explainTitle="Save Banner Settings"
                explainMarkdown="This will save your banner preference to the backend settings. The banner will be shown/hidden based on this setting."
              />
              <Button url="/admin/themes/current/editor?template=theme" target="_blank">
                Open Theme Editor
              </Button>
            </InlineStack>
          </BlockStack>
        </SectionCard>

        {/* Unsubscribe Configuration */}
        <SectionCard title="Unsubscribe Configuration">
          <BlockStack gap="300">
            <Text as="p" tone="subdued">
              Example unsubscribe link for testing and customer communication
            </Text>
            <Text as="p">{unsubscribeExample}</Text>
            <Button url={unsubscribeExample} target="_blank">
              Open example
            </Button>
          </BlockStack>
        </SectionCard>

        {/* Developer Settings - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <SectionCard title="Developer Settings">
            <BlockStack gap="200">
              <Text as="p" tone="subdued">
                Environment configuration (development only)
              </Text>
              <Text as="p">Backend URL: {__BACKEND_URL__}</Text>
              <Text as="p">API Key: {__SHOPIFY_API_KEY__?.substring(0, 8)}...</Text>
            </BlockStack>
          </SectionCard>
        )}
      </BlockStack>
    </>
  );
}
