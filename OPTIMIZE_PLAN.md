# SMS Blossom Frontend Optimization Plan

## Executive Summary

This document outlines a comprehensive page-by-page optimization of the SMS Blossom Shopify admin app, focusing on professional UX, Polaris alignment, and code quality improvements.

## 1) Route Inventory & Current State

### Current Routes (9 pages)
| Route | Component | Status | Priority |
|-------|-----------|--------|----------|
| `/` | Dashboard | ✅ Working | HIGH |
| `/contacts` | Contacts | ✅ Working | HIGH |
| `/discounts` | Discounts | ✅ Working | HIGH |
| `/segments` | Segments | ✅ Working | HIGH |
| `/templates` | Templates | ✅ Working | MEDIUM |
| `/campaigns` | Campaigns | ✅ Working | HIGH |
| `/campaigns/:id` | CampaignDetail | ✅ Working | HIGH |
| `/automations` | AutomationsPage | ✅ Working | MEDIUM |
| `/reports` | Reports | ✅ Working | MEDIUM |
| `/settings` | Settings | ✅ Working | MEDIUM |

### Current Tech Stack
- **Framework**: React 18.3.1 + TypeScript
- **UI Library**: Shopify Polaris 13.0.0
- **State Management**: TanStack Query 5.59.16
- **Routing**: React Router DOM 6.27.0
- **Forms**: React Hook Form 7.53.0 + Zod validation
- **Charts**: Recharts 2.12.7
- **Build**: Vite 5.4.1
- **Auth**: Shopify App Bridge 3.7.10

## 2) Global Foundations (Apply Once)

### 2.1 App Bridge + Polaris Providers ✅
- **Status**: Already implemented in `src/app/providers/AppProviders.tsx`
- **Action**: Keep existing implementation

### 2.2 Typed API Client ✅
- **Status**: Already generated from OpenAPI spec
- **Location**: `src/lib/api/` (93 files)
- **Action**: Keep existing implementation

### 2.3 Error Handling Standardization
- **Current**: Mixed error handling patterns
- **Action**: Standardize to `APIError { code, message, details? }` format
- **Implementation**: Create `useToast()` wrapper and `LoadingState` components

### 2.4 UX Utilities (Missing)
- **Action**: Add missing utilities:
  - `useToast()` wrapper
  - `LoadingState` (Polaris Skeletons)
  - `EmptyState` component using Polaris `EmptyState`

## 3) Page-by-Page Optimization Tasks

### 3.1 Dashboard (`/`) - HIGH PRIORITY
**Current State**: Basic KPI display
**Optimization Tasks**:
- [ ] Wrap in proper `Page` → `Layout` → `Card` structure
- [ ] Add greeting banner with teal gradient wrapper
- [ ] Implement responsive KPI cards in `InlineStack`
- [ ] Add recent activity list
- [ ] Add skeletons for all loading states
- [ ] Replace custom charts with Polaris-compatible components
- [ ] Add error states with actionable next steps

**API Endpoints**:
- `GET /reports/overview` - Overview metrics
- `GET /reports/messaging/timeseries` - Messaging data

### 3.2 Contacts (`/contacts`) - HIGH PRIORITY
**Current State**: Enhanced with new fields (recently updated)
**Optimization Tasks**:
- [ ] Verify Polaris alignment for new filters
- [ ] Optimize table performance for large datasets
- [ ] Add proper loading states for filters
- [ ] Ensure accessibility for new columns
- [ ] Add bulk action confirmations

**API Endpoints**:
- `GET /contacts` - List contacts with filters
- `POST /contacts` - Create contact
- `PUT /contacts/{id}` - Update contact
- `DELETE /contacts/{id}` - Delete contact
- `POST /contacts/bulk` - Bulk operations

### 3.3 Discounts (`/discounts`) - HIGH PRIORITY
**Current State**: Basic discount management
**Optimization Tasks**:
- [ ] Implement DataTable with pool stats
- [ ] Add CSV import via `DropZone`
- [ ] Add Generate dialog (quantity, prefix)
- [ ] Add Sync button with spinner
- [ ] Add conflict detection UI
- [ ] Add proper error handling for Shopify API calls

**API Endpoints**:
- `POST /discounts` - Create discount
- `GET /discounts/conflicts` - Check conflicts
- `GET /discounts/apply-url` - Build apply URL

### 3.4 Segments (`/segments`) - HIGH PRIORITY
**Current State**: Enhanced with system segments (recently updated)
**Optimization Tasks**:
- [ ] Verify system segment UI alignment
- [ ] Optimize preview functionality
- [ ] Add proper loading states
- [ ] Ensure read-only controls work correctly
- [ ] Add segment description tooltips

**API Endpoints**:
- `POST /segments` - Create segment
- `POST /segments/preview` - Preview segment

### 3.5 Campaigns (`/campaigns`) - HIGH PRIORITY
**Current State**: Basic campaign management
**Optimization Tasks**:
- [ ] Implement creation wizard with steps
- [ ] Add segment selector integration
- [ ] Add template picker
- [ ] Add estimate panel
- [ ] Add "Prepare" → review flow
- [ ] Guard send when estimate=0
- [ ] Add comprehensive toast feedback
- [ ] Add test send functionality

**API Endpoints**:
- `POST /campaigns/{id}/snapshot` - Snapshot audience
- `GET /campaigns/{id}/estimate` - Estimate cost
- `POST /campaigns/{id}/test-send` - Test send
- `POST /campaigns/{id}/send-now` - Send campaign
- `POST /campaigns/{id}/attach-discount` - Attach discount
- `POST /campaigns/{id}/detach-discount` - Detach discount
- `PUT /campaigns/{id}/utm` - Set UTM params
- `GET /campaigns/{id}/apply-url` - Get apply URL

### 3.6 CampaignDetail (`/campaigns/:id`) - HIGH PRIORITY
**Current State**: Campaign detail view
**Optimization Tasks**:
- [ ] Implement comprehensive campaign editing
- [ ] Add audience preview
- [ ] Add send controls with confirmations
- [ ] Add discount attachment UI
- [ ] Add UTM parameter management
- [ ] Add apply URL preview

### 3.7 Templates (`/templates`) - MEDIUM PRIORITY
**Current State**: Basic template management
**Optimization Tasks**:
- [ ] Implement grid of Cards with actions
- [ ] Add Edit, Preview, Duplicate, Delete actions
- [ ] Add preview modal with rendered example
- [ ] Add validation with InlineError
- [ ] Add template variables display

**API Endpoints**:
- `GET /templates` - List templates
- `POST /templates` - Create template
- `POST /templates/preview` - Preview template
- `POST /templates/validate` - Validate template
- `GET /templates/variables/{trigger}` - Get variables

### 3.8 Automations (`/automations`) - MEDIUM PRIORITY
**Current State**: Basic automation management
**Optimization Tasks**:
- [ ] Implement toggle cards for each automation type
- [ ] Add delay selectors
- [ ] Add webhook health badges
- [ ] Add automation configuration forms
- [ ] Add validation and error handling

**API Endpoints**:
- `GET /automations` - Get automations config
- `PUT /automations` - Update automations config

### 3.9 Reports (`/reports`) - MEDIUM PRIORITY
**Current State**: Basic reporting
**Optimization Tasks**:
- [ ] Implement attribution tables
- [ ] Add discount utilization tables
- [ ] Add CSV export functionality
- [ ] Add date range controls
- [ ] Add chart visualizations
- [ ] Add data filtering

**API Endpoints**:
- `GET /reports/overview` - Overview report
- `GET /reports/attribution` - Attribution report
- `GET /reports/campaigns` - Campaign attribution
- `GET /reports/automations` - Automation attribution
- `GET /reports/messaging/timeseries` - Messaging timeseries

### 3.10 Settings (`/settings`) - MEDIUM PRIORITY
**Current State**: Basic settings management
**Optimization Tasks**:
- [ ] Add default redirect path setting
- [ ] Add default UTM settings
- [ ] Add automation delay settings
- [ ] Add Save bar with success Banner
- [ ] Add validation on blur
- [ ] Add settings categories

**API Endpoints**:
- `GET /settings` - Get shop settings
- `PUT /settings` - Update shop settings

## 4) Implementation Order

1. **Global Foundations** (1-2 hours)
   - Add missing UX utilities
   - Standardize error handling
   - Verify App Bridge integration

2. **High Priority Pages** (6-8 hours)
   - Dashboard
   - Contacts (verify recent updates)
   - Discounts
   - Segments (verify recent updates)
   - Campaigns
   - CampaignDetail

3. **Medium Priority Pages** (4-6 hours)
   - Templates
   - Automations
   - Reports
   - Settings

4. **Repository Hygiene** (1-2 hours)
   - Run lint + format
   - Remove unused components
   - Consolidate duplicate UI primitives
   - Ensure English-only text

## 5) Success Criteria

- [ ] Each page follows Polaris design system
- [ ] All pages have proper loading/empty/error states
- [ ] All forms use Polaris components with validation
- [ ] All tables use IndexTable/DataTable with proper pagination
- [ ] All actions have proper feedback (Toast/Banner)
- [ ] App builds cleanly with no TypeScript errors
- [ ] All pages are accessible (keyboard navigation, screen readers)
- [ ] No duplicate components created
- [ ] All changes use region markers for idempotent updates

## 6) Expected Outcomes

- **Professional UX**: Polaris-aligned, accessible, responsive
- **Code Quality**: Clean, maintainable, well-typed
- **Performance**: Optimized loading states, efficient data fetching
- **Documentation**: Updated page contracts for each optimized page
- **Maintainability**: Clear structure, no duplicates, English-only

## 7) Files to Create/Update

### New Files
- `OPTIMIZE_SUMMARY.md` - Final optimization summary
- `NEXT_STEPS.md` - Any remaining TODOs
- `docs/shopify-frontend/pages/*.mdx` - Updated page contracts

### Files to Patch (In-Place)
- All page components in `src/ui/pages/`
- All feature components in `src/features/`
- API hooks in `src/lib/api/hooks/`
- Global utilities in `src/lib/`

## 8) Timeline Estimate

- **Total Time**: 12-18 hours
- **Global Foundations**: 1-2 hours
- **High Priority Pages**: 6-8 hours
- **Medium Priority Pages**: 4-6 hours
- **Repository Hygiene**: 1-2 hours

This plan ensures a systematic, professional optimization of the SMS Blossom admin app while maintaining all existing functionality and improving the overall user experience.
