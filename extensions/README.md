# UI/Theme Extensions

This repo contains three extensions:

- `extensions/checkout-consent` — Checkout UI Extension adding **SMS consent** (phone + checkbox). It posts to your App Proxy → `/public/storefront/consent`.
- `extensions/thankyou-optin` — Thank-you (Order Status) **late opt-in** widget.
- `extensions/theme-embed-banner` — Theme App Extension (App Embed) showing a site-wide **SMS banner**.

## Build & Dev

Use **Shopify CLI** to register and preview:

1. Ensure your **App Proxy** is configured in Partners:
   - Subpath: `sms-blossom` → storefront path: `/apps/sms-blossom`
   - Proxy URL: `<YOUR_BACKEND_APP_URL>` (e.g., the Cloudflare tunnel)
2. From repo root, run:
   ```bash
   shopify app dev
   ```

The CLI will detect the extension directories and guide you to create them in your app, then open a preview.

These extensions do not read protected customer data. The shopper explicitly enters phone + consent, and the backend updates Shopify consent via Admin GraphQL where allowed.

## Change App Proxy subpath

Replace `/apps/sms-blossom` with your actual path in:

- `checkout-consent/src/Checkout.tsx` → `APP_PROXY_BASE`
- `thankyou-optin/src/ThankYou.tsx` → `APP_PROXY_BASE`
- `theme-embed-banner/blocks/sms-consent-banner.liquid` (data-proxy)
- `snippets/sms-unsubscribe-link.liquid`

## What you get now

- **Checkout consent block** (contact step): phone + checkbox; intercepts "Continue" and posts to your backend App Proxy. No PCD reads.
- **Thank-you opt-in** block: phone input + "Subscribe by SMS" button; posts to App Proxy.
- **Theme App Embed banner**: persistent site banner with phone field; POSTs to App Proxy; includes **unsubscribe snippet**.

## How to run

1. In **Shopify Partners**, set **App Proxy**:
   - Subpath: `sms-blossom` (or your choice)
   - Proxy URL: `https://cleanup-charging-therefore-dan.trycloudflare.com` (your current backend tunnel)
2. From the **frontend repo** root:
   ```bash
   npm install
   shopify app dev
   ```
   Choose your app.

When prompted, register each extension and preview in store.

In the storefront or checkout:

Submit a phone like +30698….

Check backend logs; you should see POSTs to `/public/storefront/consent` and successful responses `{ ok: true, … }`.

Test unsubscribe: `/apps/sms-blossom/public/unsubscribe?shop=<domain>&phone=<e164>`
