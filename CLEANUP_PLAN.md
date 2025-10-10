# SMS Blossom Frontend - Deep Cleanup Plan

## Executive Summary

This document outlines a comprehensive cleanup of the SMS Blossom frontend codebase while preserving all Shopify/Polaris functionality. The cleanup focuses on removing duplicates, unused files, and standardizing the codebase structure.

## 1) File Classification & Analysis

### A) CORE RUNTIME (Must Keep - High Confidence)

#### App Shell & Providers
- `src/app/providers/AppProviders.tsx` - Main app provider with Polaris + React Query
- `src/app/layout/AppFrame.tsx` - App shell with Frame, Navigation, TopBar
- `src/app/components/ErrorBoundary.tsx` - Error boundary component
- `src/ui/PolarisThemeProvider.tsx` - Brand theme provider

#### Navigation & Routing
- `src/config/navigation.ts` - Navigation configuration
- `src/main.tsx` - App entry point with router
- `src/ui/App.tsx` - Main app component

#### Core Pages (All Required)
- `src/ui/pages/Dashboard.tsx` - Dashboard page
- `src/ui/pages/Templates.tsx` - Templates page
- `src/ui/pages/Campaigns.tsx` - Campaigns page
- `src/ui/pages/CampaignDetail.tsx` - Campaign detail page
- `src/ui/pages/Discounts.tsx` - Discounts page
- `src/ui/pages/Segments.tsx` - Segments page
- `src/ui/pages/Contacts.tsx` - Contacts page
- `src/ui/pages/Reports.tsx` - Reports page
- `src/ui/pages/Settings.tsx` - Settings page

#### API Client & Hooks
- `src/lib/api/client.ts` - API client configuration
- `src/lib/api/hooks/*.ts` - React Query hooks (8 files)
- `src/lib/api/services/*.ts` - API services (10 files)
- `src/lib/api/models/*.ts` - TypeScript models (33 files)
- `src/lib/api/schemas/*.ts` - Zod schemas (33 files)

#### Core Utilities
- `src/lib/shopContext.tsx` - Shop context provider
- `src/lib/nav.ts` - Navigation utilities
- `src/lib/events.ts` - Event bus
- `src/lib/format.ts` - Formatting utilities
- `src/lib/query.ts` - React Query configuration
- `src/lib/performance.ts` - Performance utilities
- `src/lib/telemetry.ts` - Analytics utilities

#### Build & Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `eslint.config.js` - ESLint configuration
- `vitest.config.ts` - Test configuration
- `playwright.config.ts` - E2E test configuration

#### Backend Documentation
- `docs_backend/openapi.yaml` - OpenAPI specification
- `docs_backend/README.md` - Backend documentation
- `docs/shopify-frontend/` - Frontend documentation

### B) USED (Imported at Runtime - Medium Confidence)

#### Feature Components
- `src/features/*/components/*.tsx` - Feature-specific components (25+ files)
- `src/features/*/hooks.ts` - Feature hooks (8 files)
- `src/ui/components/*.tsx` - Shared UI components (7 files)

#### SDK & API
- `src/sdk/*.ts` - SDK utilities (5 files)
- `src/api/sdk/*.ts` - Generated SDK (48 files)

### C) UNUSED (No Imports - High Confidence for Removal)

#### Legacy JavaScript Files
- `src/api/index.js` - Legacy API index
- `src/main.js` - Legacy main entry
- `src/lib/api.js` - Legacy API client
- `src/lib/events.js` - Legacy events
- `src/lib/format.js` - Legacy formatting
- `src/lib/query.js` - Legacy query
- `src/lib/shop.js` - Legacy shop utilities
- `src/lib/shopify.js` - Legacy Shopify integration

#### Duplicate API Files
- `src/api/index.ts` - Duplicate of lib/api
- `src/lib/api.ts` - Duplicate API client
- `src/lib/apiClient.ts` - Duplicate API client

### D) DUPLICATES/LEGACY (Medium Confidence for Removal)

#### Test Files
- `src/ui/pages/TestFrame.tsx` - Temporary test component

#### Documentation Files
- `IMPLEMENTATION_SUMMARY.md` - Implementation documentation
- `reports/*.md` - Various reports (20+ files)
- `diagrams/*.md` - Architecture diagrams (3 files)

### E) I18N (Non-English - Low Confidence)

#### No I18N Files Found
- All UI strings are in English
- No language switchers detected
- No locale files found

### F) TEST/DEV ONLY (Keep if Configured)

#### Test Infrastructure
- `tests/*.ts` - Test files (15+ files)
- `e2e/*.spec.ts` - E2E tests (2 files)
- `src/ui/components/DevBanner.tsx` - Development banner
- `src/ui/components/PerformanceDashboard.tsx` - Performance monitoring

## 2) Dependency Analysis

### Unused Dependencies (Proposed for Removal)
- `@types/lodash` - No lodash usage found
- `jest-axe` - No Jest configuration found
- `jsdom` - Using Vitest instead
- `msw` - Mock Service Worker (keep for testing)

### Dependencies to Keep
- All Shopify packages (App Bridge, Polaris, Icons)
- React ecosystem (React, React DOM, Router)
- Build tools (Vite, TypeScript, ESLint)
- Testing tools (Vitest, Playwright, Testing Library)
- UI libraries (Recharts, React Hook Form)

## 3) Proposed Actions

### High Confidence Removals
1. **Legacy JavaScript Files** (8 files)
   - Move to `.trash/legacy-js/`
   - Reason: Replaced by TypeScript equivalents

2. **Duplicate API Files** (3 files)
   - Move to `.trash/duplicates/`
   - Reason: Functionality consolidated in lib/api/

3. **Test Component** (1 file)
   - Move to `.trash/temp/`
   - Reason: Temporary testing component

### Medium Confidence Removals
1. **Documentation Reports** (20+ files)
   - Move to `.trash/docs/`
   - Reason: Development artifacts, not runtime code

2. **Architecture Diagrams** (3 files)
   - Move to `.trash/docs/`
   - Reason: Development artifacts

### Low Confidence (Keep)
1. **Feature Components** - All kept
2. **Test Files** - All kept (testing configured)
3. **Build Configuration** - All kept

## 4) Code Hygiene Improvements

### ESLint & Prettier
- Run `npm run lint` and `npm run format`
- Fix any auto-fixable issues
- Standardize import order

### TypeScript Improvements
- Enable stricter flags in tsconfig.json
- Add `noImplicitAny: true`
- Add `noUncheckedIndexedAccess: true`
- Mark as TODO for gradual adoption

### Import Normalization
- Use consistent path aliases
- Create index barrels where appropriate
- Remove unused imports

## 5) Safety Measures

### Backup Strategy
- Move files to `.trash/<timestamp>/` instead of permanent deletion
- Preserve git history
- Easy restoration process

### Validation
- Ensure app builds after cleanup
- Verify all routes work
- Check that no core functionality is broken

## 6) Expected Outcomes

### Files to Remove
- **Legacy JS files**: 8 files
- **Duplicate API files**: 3 files
- **Documentation reports**: 20+ files
- **Test components**: 1 file
- **Total**: ~35 files

### Benefits
- Cleaner codebase structure
- Reduced bundle size
- Easier maintenance
- Clear separation of concerns
- Standardized TypeScript usage

### Risks
- Low risk due to high confidence classifications
- Easy rollback via `.trash/` folder
- No core functionality affected

## 7) Implementation Plan

1. **Phase 1**: Create `.trash/` structure
2. **Phase 2**: Move high-confidence unused files
3. **Phase 3**: Run code hygiene improvements
4. **Phase 4**: Validate build and functionality
5. **Phase 5**: Generate final report

## 8) Rollback Plan

If any issues arise:
1. Restore files from `.trash/<timestamp>/`
2. Revert any code changes
3. Rebuild and test
4. Investigate specific issues

This cleanup plan ensures a safe, systematic approach to codebase maintenance while preserving all essential functionality.
