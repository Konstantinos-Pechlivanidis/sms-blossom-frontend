# SMS Blossom Doctor

This script validates your **frontend** configuration and extensions and compiles the app.

## What it checks

1. `.env` → `VITE_BACKEND_URL` is set (currently required).
2. Backend health: GET `${VITE_BACKEND_URL}/health` returns `{ status: "ok", ... }`.
3. `openapi/openapi.yaml` exists and has basic paths.
4. Extensions exist and use the App Proxy base `"/apps/sms-blossom"`.
5. Type-checks the extensions via `tsc -p extensions/tsconfig.json`.
6. Generates the OpenAPI SDK (if configured).
7. Builds the app with `vite build`.

## Run

```bash
npm install
npm run doctor
```

## What it does

- **Environment**: Validates `.env` has `VITE_BACKEND_URL` set
- **Backend Health**: Makes a GET request to `${VITE_BACKEND_URL}/health` and expects `{ status: "ok" }`
- **OpenAPI**: Checks `openapi/openapi.yaml` exists and contains required paths (`/health`, `/discounts`)
- **Extensions**: Validates all three extensions exist and use the correct App Proxy base path
- **TypeScript**: Runs `tsc -p extensions/tsconfig.json --noEmit` to type-check extensions
- **API Generation**: Attempts to generate OpenAPI SDK (non-blocking if it fails)
- **Build**: Runs `npm run build` to ensure the app compiles successfully

## Exit codes

- `0`: All checks passed, app is ready
- `1`: One or more checks failed

## Troubleshooting

### Backend URL not set
```bash
# Create .env file with backend URL
echo "VITE_BACKEND_URL=https://your-backend.trycloudflare.com" > .env
```

### Backend health check fails
- Ensure your backend is running and accessible
- Check the URL is correct in `.env`
- Verify the backend returns `{ status: "ok" }` at `/health`

### Extensions App Proxy base mismatch
- All extensions must use `/apps/sms-blossom` as the App Proxy base
- Check `extensions/checkout-consent/src/Checkout.tsx`
- Check `extensions/thankyou-optin/src/ThankYou.tsx`
- Check `extensions/theme-embed-banner/blocks/sms-consent-banner.liquid`

### TypeScript errors in extensions
- Run `npm run ext:typecheck` to see specific errors
- Ensure all imports use the correct package names
- Check `extensions/tsconfig.json` configuration

### Build failures
- Run `npm run build` directly to see build errors
- Check for missing dependencies
- Verify all imports are correct
