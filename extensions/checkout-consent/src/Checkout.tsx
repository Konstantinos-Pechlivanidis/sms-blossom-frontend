import * as React from 'react';
import {
  BlockStack,
  Checkbox,
  Text,
  TextField,
  useExtensionApi,
  useBuyerJourneyIntercept,
} from '@shopify/checkout-ui-extensions-react';

interface ConsentState {
  phone: string;
  agreed: boolean;
  submitting: boolean;
  error?: string;
  ok?: boolean;
}

const APP_PROXY_BASE = '/apps/sms-blossom'; // TODO: change if your App Proxy subpath differs

export default function CheckoutConsent() {
  const { localization, shop, i18n } = useExtensionApi<any>();
  const [state, setState] = React.useState<ConsentState>({
    phone: '',
    agreed: false,
    submitting: false,
  });

  // Intercept "Continue" – ensure consent POST completes if checked
  useBuyerJourneyIntercept(async () => {
    if (!state.agreed) return { behavior: 'allow' };
    if (!state.phone) {
      setState((s) => ({ ...s, error: 'Please enter your mobile number' }));
      return { behavior: 'block', reason: 'missing_phone' };
    }
    try {
      setState((s) => ({ ...s, submitting: true, error: undefined }));
      const res = await fetch(
        `${APP_PROXY_BASE}/public/storefront/consent?shop=${encodeURIComponent(shop?.myshopifyDomain || '')}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: state.phone,
            optInLevel: 'SINGLE_OPT_IN',
          }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.error) throw new Error(json?.error || 'Failed');
      setState((s) => ({ ...s, submitting: false, ok: true }));
      return { behavior: 'allow' };
    } catch (e: any) {
      setState((s) => ({ ...s, submitting: false, error: e?.message || 'Failed to save consent' }));
      return { behavior: 'block', reason: 'consent_error' };
    }
  });

  return (
    <BlockStack spacing="tight">
      <Text size="small" emphasis="bold">
        SMS updates
      </Text>
      <TextField
        label="Mobile phone (E.164)"
        value={state.phone}
        onChange={(v) => setState((s) => ({ ...s, phone: v }))}
        placeholder="+3069XXXXXXXX"
        type="tel"
      />
      <Checkbox checked={state.agreed} onChange={(v) => setState((s) => ({ ...s, agreed: v }))}>
        I agree to receive SMS marketing. Reply STOP to opt-out.
      </Checkbox>
      {state.error && (
        <Text tone="critical" size="small">
          {state.error}
        </Text>
      )}
      {state.ok && (
        <Text tone="success" size="small">
          Thanks! Consent saved.
        </Text>
      )}
      {/* No submit button: buyer clicks Shopify's native Continue. Intercept handles POST. */}
    </BlockStack>
  );
}
// Note: We deliberately do NOT read protected fields. Shopper types phone manually.
// Backend updates Shopify via customerSmsMarketingConsentUpdate when allowed.
