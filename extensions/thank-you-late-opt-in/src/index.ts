import {extend, BlockStack, Heading, TextField, Button} from '@shopify/checkout-ui-extensions';

const BACKEND = 'https://sms-blossom-api.onrender.com';
const ENABLE_NETWORK = typeof process !== 'undefined' && process.env && process.env.NETWORK_CALLS === '1';

export default extend('purchase.thank-you.block.render' as any, (root: any) => {
  const wrap = root.createComponent(BlockStack, {spacing: 'tight'});
  wrap.append(root.createComponent(Heading, {level: 2}, 'Get order updates by SMS'));

  let phone = '';
  const field = root.createComponent(TextField, {
    label: 'Phone (E.164)',
    value: '',
    onChange: (v: string) => { phone = v; }
  });

  const btn = root.createComponent(Button, {
    kind: 'secondary',
    onPress: async () => {
      if (!phone) return;
      if (!ENABLE_NETWORK) return;
      try {
        const res = await fetch(`${BACKEND}/apps/sms-blossom/public/storefront/consent`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ phone, optInLevel: 'CONFIRMED_OPT_IN' })
        });
        await res.json().catch(() => ({}));
      } catch {}
    }
  }, 'Subscribe');

  wrap.append(field);
  wrap.append(btn);
  root.append(wrap);
});
