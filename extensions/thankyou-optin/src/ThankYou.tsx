import * as React from 'react';
import { BlockStack, Text, TextField, Button } from '@shopify/checkout-ui-extensions-react';

const APP_PROXY_BASE = '/apps/sms-blossom'; // TODO: change if your App Proxy subpath differs

export default function LateOptIn() {
  const [phone, setPhone] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [msg, setMsg] = React.useState<{
    tone: 'success' | 'critical' | 'info';
    text: string;
  } | null>(null);

  async function submit() {
    if (!phone) {
      setMsg({ tone: 'critical', text: 'Enter your mobile number' });
      return;
    }
    try {
      setSending(true);
      setMsg(null);
      const search = new URLSearchParams(location.search);
      const shop = search.get('shop') || '';
      const res = await fetch(
        `${APP_PROXY_BASE}/public/storefront/consent?shop=${encodeURIComponent(shop)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, optInLevel: 'CONFIRMED_OPT_IN' }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.error) throw new Error(json?.error || 'Failed');
      setMsg({ tone: 'success', text: 'Thanks! You are subscribed to SMS updates.' });
    } catch (e: any) {
      setMsg({ tone: 'critical', text: e?.message || 'Failed to save consent' });
    } finally {
      setSending(false);
    }
  }

  return (
    <BlockStack spacing="tight">
      <Text size="small" emphasis="bold">
        Get order updates by SMS
      </Text>
      <Text size="small">Never miss shipping updates or special offers. Opt-in below.</Text>
      <TextField
        type="tel"
        value={phone}
        onChange={setPhone}
        label="Mobile (E.164)"
        placeholder="+3069XXXXXXXX"
      />
      <Button kind="primary" loading={sending} onPress={submit}>
        Subscribe by SMS
      </Button>
      {msg && (
        <Text tone={msg.tone} size="small">
          {msg.text}
        </Text>
      )}
    </BlockStack>
  );
}
