# SMS Blossom Frontend Documentation

## Overview

This is the Shopify Admin app frontend for SMS Blossom, built with React, TypeScript, Vite, and Shopify Polaris. The app provides a comprehensive interface for managing SMS marketing campaigns, templates, discounts, and customer segments.

## Architecture

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Shopify Polaris v13
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Authentication**: Shopify App Bridge
- **API Client**: Generated from OpenAPI spec

### Project Structure
```
src/
├── app/                    # App-level providers and components
│   ├── providers/         # App Bridge, Polaris, React Query providers
│   └── components/        # Shared components (ErrorBoundary, etc.)
├── lib/                   # Core utilities and API client
│   ├── api/              # Generated API client and hooks
│   ├── shopContext.tsx   # Shop context provider
│   └── ...              # Other utilities
├── ui/                   # UI components and pages
│   ├── components/      # Reusable UI components
│   └── pages/           # Page components
└── features/            # Feature-specific components
```

## Getting Started

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Required
VITE_SHOPIFY_API_KEY=your_shopify_api_key
VITE_BACKEND_URL=https://api.sms-blossom.com

# Optional
VITE_PORT=5173
VITE_HOST=0.0.0.0
VITE_ENABLE_PERFORMANCE=false
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG=false
```

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start with Shopify CLI
npm run dev:shopify
```

### Building

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build

# Verify build
npm run build:verify
```

## API Integration

### Generated Client

The API client is automatically generated from the OpenAPI specification:

```bash
# Generate API client
npm run api:generate
```

This creates typed services and React Query hooks in `src/lib/api/`.

### Usage Example

```typescript
import { useCampaigns, useCreateCampaign } from '../lib/api/hooks';

function CampaignsPage() {
  const { data: campaigns, isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();

  const handleCreate = async (data) => {
    await createCampaign.mutateAsync(data);
  };

  // ... render logic
}
```

## Pages & Features

### 1. Dashboard
- **Purpose**: Overview of SMS marketing performance
- **Backend Endpoints**: `/reports/overview`, `/health`
- **Components**: KPI cards, health indicators, top campaigns

### 2. Templates
- **Purpose**: Manage SMS templates for different triggers
- **Backend Endpoints**: `/templates` (CRUD), `/templates/preview`, `/templates/validate`
- **Components**: Template list, create/edit forms, preview modal

### 3. Campaigns
- **Purpose**: Create and manage SMS campaigns
- **Backend Endpoints**: `/campaigns` (CRUD), `/campaigns/{id}/estimate`, `/campaigns/{id}/send`
- **Components**: Campaign list, creation wizard, campaign details

### 4. Discounts
- **Purpose**: Manage discount codes and pools
- **Backend Endpoints**: `/discounts` (CRUD), `/discounts/sync-from-shopify`, `/discounts/{id}/pool/*`
- **Components**: Discount list, pool management, CSV import

### 5. Automations
- **Purpose**: Configure automated SMS triggers
- **Backend Endpoints**: `/settings` (automation config)
- **Components**: Automation toggles, delay settings, template selection

### 6. Contacts
- **Purpose**: Manage customer contacts and segments
- **Backend Endpoints**: Via Shopify Admin API
- **Components**: Contact list, segment management, CSV import/export

### 7. Segments
- **Purpose**: Create customer segments for targeting
- **Backend Endpoints**: `/segments` (CRUD), `/segments/preview`
- **Components**: Segment builder, filter configuration, preview

### 8. Reports
- **Purpose**: Analytics and performance reporting
- **Backend Endpoints**: `/reports/overview`, `/reports/messaging`
- **Components**: Charts, data tables, date range selectors

### 9. Settings
- **Purpose**: App configuration and preferences
- **Backend Endpoints**: `/settings` (GET/PUT)
- **Components**: Form layouts, toggles, validation

## Error Handling

The app includes comprehensive error handling:

- **Error Boundary**: Catches React errors and displays user-friendly messages
- **API Errors**: Standardized error responses with retry mechanisms
- **Loading States**: Skeleton components and spinners
- **Empty States**: Helpful empty state components with actions

## Performance

### Optimizations
- **Lazy Loading**: Heavy routes are lazy-loaded
- **Query Caching**: React Query provides intelligent caching
- **Bundle Splitting**: Vite automatically splits vendor chunks
- **Tree Shaking**: Unused code is eliminated

### Monitoring
- **Performance Dashboard**: Press Ctrl+Shift+P to open
- **Bundle Analysis**: `npm run bundle:analyze`
- **Telemetry**: Optional analytics integration

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## Deployment

The app is configured for deployment on various platforms:

- **Shopify App Store**: Use Shopify CLI
- **Static Hosting**: Build artifacts in `dist/`
- **Docker**: Use the provided Dockerfile

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Add tests for new features
4. Update documentation as needed
5. Run `npm run check` before committing

## Support

For issues and questions:
- Check the [troubleshooting guide](./troubleshooting.md)
- Review the [API documentation](../docs_backend/README.md)
- Contact the development team
