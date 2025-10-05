# SMS Blossom — Embedded Admin (Frontend)

This is the standalone Embedded Admin frontend for SMS Blossom.

## Dev (local)

```bash
npm install
cp .env.example .env   # set VITE_BACKEND_URL and VITE_SHOPIFY_API_KEY
npm run api:generate
npm run dev
```
Open the app from Shopify Admin so App Bridge can embed it.

## Production (Render.com)

Deploy the Vite app as a static site on Render:
- Build command: `npm ci && npm run api:generate && npm run build && node scripts/check-build.js`
- Publish directory: `dist`
- Set env vars in Render dashboard:
  - `VITE_BACKEND_URL` → your backend (e.g., Cloudflare tunnel / prod API)
  - `VITE_SHOPIFY_API_KEY` → your public key (optional if used)

**Order of operations (important):**
1) Push the repo and create a **Static Site** on Render using this repo or `render.yaml`.
2) Wait for the first deploy to complete; copy the final domain, e.g. `https://sms-blossom-frontend.onrender.com`.
3) Update **Shopify Partners → App setup → App URL** to that domain.
4) Update `shopify.app.toml` → `application_url` to the same domain and commit.
5) Keep **Allowed redirection URL(s)** pointing to your backend OAuth callback (unchanged):
   - e.g. `https://request-bar-sheep-estimated.trycloudflare.com/auth/callback`

App Proxy remains unchanged:
- prefix = "apps"
- subpath = "sms-blossom" 
- url = "https://request-bar-sheep-estimated.trycloudflare.com/public"

## Features

- **Dashboard**: Overview metrics and messaging timeseries
- **Discounts**: Create discount codes with UTM tracking and conflict scanning
- **Segments**: Customer segmentation with CRUD operations and preview
- **Campaigns**: Campaign management with discount attachment and UTM configuration
- **Reports**: Analytics dashboard with charts and attribution tables
- **Settings**: Backend health check and theme banner configuration

## Extensions

- **Checkout UI Extension**: SMS consent collection during checkout
- **Thank-you UI Extension**: Post-purchase SMS subscription
- **Theme App Extension**: Site-wide consent banner with unsubscribe links

## Polish Features (FE-F)

- **Global Error Boundary**: Catches and displays unexpected errors
- **Skeleton Loaders**: Loading states for Dashboard and Reports
- **App-wide Toasts**: API error notifications via event system
- **Settings Panel**: Theme banner toggle with backend fallback
- **GitHub Actions CI**: Automated testing and building
- **Bundle Analysis**: `npm run analyze` for bundle size insights

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
- `npm run api:generate` - Generate OpenAPI SDK
- `npm run analyze` - Build and analyze bundle size

## Tech Stack

- **Vite** + **React** + **TypeScript**
- **Shopify Polaris** UI components
- **React Query** for data fetching
- **React Router** for navigation
- **React Hook Form** + **Zod** for forms
- **Recharts** for data visualization
- **Shopify App Bridge** for embedded app integration
