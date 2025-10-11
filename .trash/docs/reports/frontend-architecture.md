# Frontend Architecture Report

## Current Frontend Map

### 📁 Directory Structure
```
src/
├── api/                    # Generated OpenAPI client (existing)
│   ├── sdk/               # Auto-generated SDK
│   │   ├── core/          # Core API utilities
│   │   ├── models/        # TypeScript models
│   │   ├── schemas/       # JSON schemas
│   │   └── services/      # Service classes
│   └── index.ts           # Main API client
├── lib/                    # Core utilities
│   ├── api.ts             # Current API client (basic)
│   ├── shopify.ts          # App Bridge integration
│   ├── shop.ts             # Shop domain detection
│   ├── shopContext.tsx     # Shop context provider
│   ├── events.ts           # Event bus
│   ├── format.ts           # Formatting utilities
│   └── query.ts            # React Query config
├── features/               # Feature-based organization (NEW)
│   ├── dashboard/          # Dashboard feature
│   ├── campaigns/          # Campaign management
│   ├── discounts/          # Discount management
│   ├── templates/          # Template management
│   ├── settings/           # Settings management
│   └── reports/           # Reporting feature
├── sdk/                    # New SDK structure (NEW)
│   ├── types.generated.ts  # Generated types
│   └── index.ts           # Typed client
├── ui/                     # UI components
│   ├── App.tsx             # Main app component
│   ├── components/         # Reusable components
│   │   ├── DevBanner.tsx   # Development diagnostics
│   │   ├── ErrorBoundary.tsx
│   │   ├── Skeletons.tsx   # Loading skeletons
│   │   └── UtmBuilder.tsx   # UTM parameter builder
│   └── pages/              # Page components
│       ├── Dashboard.tsx    # Dashboard page
│       ├── Campaigns.tsx   # Campaigns list
│       ├── CampaignDetail.tsx # Campaign details
│       ├── Discounts.tsx    # Discounts management
│       ├── Segments.tsx     # Customer segments
│       ├── Reports.tsx      # Analytics reports
│       └── Settings.tsx     # App settings
└── types/                  # TypeScript definitions
    ├── env.d.ts            # Environment types
    └── global.d.ts         # Global types
```

### 🛣️ Current Routes
- `/` - Dashboard (overview metrics)
- `/campaigns` - Campaigns list
- `/campaigns/:id` - Campaign details/edit
- `/discounts` - Discount codes management
- `/segments` - Customer segmentation
- `/reports` - Analytics and reporting
- `/settings` - App configuration

### 🔧 Current Tech Stack
- **Framework**: React 18.3.1 with TypeScript
- **UI Library**: Shopify Polaris 13.0.0
- **State Management**: TanStack Query 5.59.16
- **Routing**: React Router DOM 6.27.0
- **Forms**: React Hook Form 7.53.0 + Zod validation
- **Charts**: Recharts 2.12.7
- **Build**: Vite 5.4.1
- **Auth**: Shopify App Bridge 3.7.10

### 📊 Current Data Flow
1. **Shop Detection**: `shopContext.tsx` → `useShop()` hook
2. **API Calls**: `api.ts` → `apiFetch()` with session token
3. **State Management**: TanStack Query for server state
4. **Error Handling**: Event bus → Toast notifications
5. **Loading States**: Skeleton components

### 🎯 Current Features Status
| Feature | Status | Endpoints Used | Notes |
|---------|--------|----------------|-------|
| Dashboard | ✅ Basic | `/reports/overview`, `/reports/messaging/timeseries` | Shows KPIs and charts |
| Campaigns | ✅ Basic | `/campaigns` (list), `/campaigns/{id}` | CRUD operations |
| Discounts | ✅ Basic | `/discounts` (list), `/discounts/{id}` | CRUD operations |
| Segments | ✅ Basic | `/segments` (list), `/segments/{id}` | Customer segmentation |
| Reports | ✅ Basic | `/reports/*` | Analytics and metrics |
| Settings | ✅ Basic | `/settings` | App configuration |

### 🔍 Current API Integration
- **Base URL**: `VITE_BACKEND_URL` environment variable
- **Authentication**: App Bridge session token
- **Headers**: `Authorization: Bearer <token>`, `X-Shop-Domain: <shop>`
- **Error Handling**: Basic error toast notifications
- **Retry Logic**: None (needs implementation)

### 🚨 Identified Issues
1. **Missing Rate Limiting**: No 429 handling with `Retry-After`
2. **No Request IDs**: Missing `X-Request-ID` for debugging
3. **Basic Error Handling**: No error taxonomy mapping
4. **No Caching Strategy**: Missing `X-Cache` header handling
5. **Inconsistent Shop Detection**: Multiple implementations
6. **No Feature Flags**: Missing environment-based toggles
7. **Limited Telemetry**: No analytics tracking

### 📋 Next Steps
1. Generate TypeScript types from OpenAPI spec
2. Create typed SDK client with proper error handling
3. Implement feature-based hooks for each domain
4. Add comprehensive error handling and retry logic
5. Implement feature flags and telemetry
6. Add caching strategy
7. Create comprehensive test cases

### 🎯 Integration Priority
1. **Core SDK** - Typed client with proper auth/retry
2. **Dashboard** - Enhanced metrics and health status
3. **Campaigns** - Full CRUD with estimate/test/send
4. **Discounts** - Full CRUD with conflict detection
5. **Settings** - Complete configuration management
6. **Reports** - Advanced analytics and filtering
7. **Templates** - Message template management
8. **Error Handling** - Comprehensive error taxonomy
