import {extend, InlineStack, Checkbox, TextField, Button, Heading, BlockStack} from '@shopify/checkout-ui-extensions';

// Keep bundle tiny: no helpers, no regex libs, no external deps.
// Optional network toggle via ENV (set NETWORK_CALLS=1 to exercise fetch)
const BACKEND = 'https://sms-blossom-api.onrender.com';
const ENABLE_NETWORK = typeof process !== 'undefined' && process.env && process.env.NETWORK_CALLS === '1';

export default extend('purchase.checkout.contact.render-after' as any, (root: any) => {
  const title = 'SMS updates';

  const stack = root.createComponent(BlockStack, {spacing: 'tight'});
  stack.append(root.createComponent(Heading, {level: 2}, title));

  let phone = '';
  let consent = false;
  const row = root.createComponent(InlineStack, {spacing: 'tight', wrap: false});
  const phoneField = root.createComponent(TextField, {
    label: 'Phone (E.164)',
    value: '',
    onChange: (val: string) => { phone = val; }
  });
  const consentBox = root.createComponent(Checkbox, {
    checked: false,
    onChange: (val: boolean) => { consent = val; }
  }, 'I agree to receive SMS');

  const submit = root.createComponent(Button, {
    kind: 'secondary',
    onPress: async () => {
      if (!consent || !phone) return;
      // Keep under 64 KB: one simple fetch with minimal payload.
      if (!ENABLE_NETWORK) return; // preview without CORS first
      try {
        const res = await fetch(`${BACKEND}/apps/sms-blossom/public/storefront/consent`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ phone })
        });
        await res.json().catch(() => ({}));
      } catch { /* swallow in checkout */ }
    }
  }, 'Subscribe');

  row.append(phoneField);
  row.append(consentBox);
  row.append(submit);
  stack.append(row);
  root.append(stack);
});
