# Refactor Plan: Professional Standard (1-2 Weeks)

## Overview

This plan outlines minimal, safe refactors to elevate the SMS Blossom frontend to **professional standard** while maintaining stability and avoiding breaking changes.

## Phase 1: Critical Fixes (Days 1-2)

### 1.1 Fix Test Infrastructure
**Scope**: Test setup and configuration
**Benefit**: Enable reliable testing and CI/CD
**Files**: `tests/setup.ts`, `vitest.config.ts`
**Risk**: Low
**Effort**: S

```typescript
// Fix tests/setup.ts syntax error
IndexTable: ({ children, ...props }: any) => (
  <div data-testid="index-table" {...props}>{children}</div>
),
```

### 1.2 Add Contacts Management
**Scope**: New contacts route and basic CRUD
**Benefit**: Complete core functionality
**Files**: `src/ui/App.tsx`, `src/ui/pages/Contacts.tsx`, `src/features/contacts/`
**Risk**: Low
**Effort**: M

### 1.3 Accessibility Audit & Fixes
**Scope**: Run axe-core and fix critical violations
**Benefit**: Compliance and usability
**Files**: All component files
**Risk**: Low
**Effort**: S

## Phase 2: Quality Improvements (Days 3-5)

### 2.1 Error Taxonomy Completion
**Scope**: Complete error mapping and user-friendly messages
**Benefit**: Better user experience
**Files**: `src/lib/apiClient.ts`, `src/lib/errorTaxonomy.ts`
**Risk**: Low
**Effort**: M

### 2.2 Bundle Analysis & Optimization
**Scope**: Add bundle analysis and optimize chunks
**Benefit**: Performance improvement
**Files**: `vite.config.ts`, `package.json`
**Risk**: Low
**Effort**: S

### 2.3 Loading States Enhancement
**Scope**: Consistent loading states across all features
**Benefit**: Better UX
**Files**: All feature pages
**Risk**: Low
**Effort**: S

## Phase 3: Advanced Features (Days 6-10)

### 3.1 Telemetry Integration
**Scope**: Add comprehensive telemetry
**Benefit**: Analytics and monitoring
**Files**: `src/lib/telemetry.ts`, all feature hooks
**Risk**: Low
**Effort**: M

### 3.2 Performance Monitoring
**Scope**: Add performance metrics collection
**Benefit**: Production monitoring
**Files**: `src/lib/performance.ts`, `src/main.tsx`
**Risk**: Low
**Effort**: M

### 3.3 Environment Validation
**Scope**: Add Zod-based environment validation
**Benefit**: Runtime safety
**Files**: `src/config/schema.ts`, `src/main.tsx`
**Risk**: Low
**Effort**: S

## Detailed Implementation

### 1. Test Infrastructure Fix

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './msw/server';

// Mock Shopify App Bridge
const mockAppBridge = {
  createApp: vi.fn(() => ({
    getSessionToken: vi.fn(() => Promise.resolve('mock-session-token')),
    getState: vi.fn(() => ({ shop: 'test-shop.myshopify.com', host: 'test-host' })),
  })),
};

vi.mock('@shopify/app-bridge', () => mockAppBridge);

// Mock Polaris components
vi.mock('@shopify/polaris', async () => {
  const actual = await vi.importActual('@shopify/polaris');
  return {
    ...actual,
    IndexTable: ({ children, ...props }: any) => (
      <div data-testid="index-table" {...props}>{children}</div>
    ),
    DataTable: ({ children, ...props }: any) => (
      <div data-testid="data-table" {...props}>{children}</div>
    ),
  };
});
```

### 2. Contacts Management

```typescript
// src/ui/pages/Contacts.tsx
import React from 'react';
import { Page, Layout, Card, DataTable, Button, InlineStack, BlockStack } from '@shopify/polaris';
import { useContacts } from '../../features/contacts/hooks';

export default function Contacts() {
  const { data: contacts, isLoading } = useContacts();
  
  return (
    <Page title="Contacts">
      <Layout>
        <Layout.Section>
          <Card>
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'text', 'text']}
              headings={['Name', 'Email', 'Phone', 'Status', 'Actions']}
              rows={contacts?.map(contact => [
                contact.name,
                contact.email,
                contact.phone,
                contact.status,
                <Button size="slim">Edit</Button>
              ]) || []}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
```

### 3. Error Taxonomy Enhancement

```typescript
// src/lib/errorTaxonomy.ts
export const ERROR_TAXONOMY = {
  '401': {
    title: 'Authentication Required',
    message: 'Please log in to continue.',
    action: 'Login',
    tone: 'critical' as const,
  },
  '403': {
    title: 'Access Denied',
    message: 'You do not have permission to perform this action.',
    action: 'Contact Support',
    tone: 'critical' as const,
  },
  '409': {
    title: 'Shop Not Installed',
    message: 'Please install the SMS Blossom app in your Shopify admin.',
    action: 'Install App',
    tone: 'warning' as const,
  },
  '429': {
    title: 'Rate Limited',
    message: 'Too many requests. Please wait a moment and try again.',
    action: 'Retry',
    tone: 'warning' as const,
  },
  '422': {
    title: 'Validation Error',
    message: 'Please check your input and try again.',
    action: 'Fix',
    tone: 'warning' as const,
  },
  '500': {
    title: 'Server Error',
    message: 'Something went wrong. Please try again later.',
    action: 'Retry',
    tone: 'critical' as const,
  },
} as const;
```

### 4. Telemetry Integration

```typescript
// src/lib/telemetry.ts
export class Telemetry {
  private static instance: Telemetry;
  
  static getInstance(): Telemetry {
    if (!Telemetry.instance) {
      Telemetry.instance = new Telemetry();
    }
    return Telemetry.instance;
  }
  
  track(event: string, properties?: Record<string, any>) {
    // Send to analytics service
    console.log('Telemetry:', event, properties);
  }
  
  trackPageView(page: string) {
    this.track('page_viewed', { page });
  }
  
  trackFeatureUsed(feature: string, action: string) {
    this.track('feature_used', { feature, action });
  }
  
  trackError(error: Error, context?: string) {
    this.track('error_occurred', { 
      error: error.message, 
      stack: error.stack,
      context 
    });
  }
}
```

### 5. Performance Monitoring

```typescript
// src/lib/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  measurePageLoad(page: string) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.trackMetric('page_load_time', duration, { page });
    };
  }
  
  measureApiCall(endpoint: string) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.trackMetric('api_call_time', duration, { endpoint });
    };
  }
  
  private trackMetric(name: string, value: number, tags?: Record<string, string>) {
    // Send to monitoring service
    console.log('Performance:', name, value, tags);
  }
}
```

## Risk Assessment

| Refactor | Risk Level | Mitigation |
|----------|------------|------------|
| Test Infrastructure Fix | Low | Syntax fix only, no logic changes |
| Contacts Management | Low | New feature, no existing code impact |
| Accessibility Fixes | Low | UI improvements only |
| Error Taxonomy | Low | Enhancement to existing system |
| Bundle Optimization | Low | Build configuration only |
| Telemetry Integration | Low | Additive only, no breaking changes |
| Performance Monitoring | Low | Additive only, no breaking changes |

## Success Metrics

- ✅ All tests passing
- ✅ 0 TypeScript errors
- ✅ Successful build
- ✅ Accessibility score > 90
- ✅ Bundle size < 1MB
- ✅ All features functional
- ✅ Error handling complete
- ✅ Telemetry working
- ✅ Performance monitoring active

## Timeline

**Week 1:**
- Days 1-2: Critical fixes (tests, contacts, accessibility)
- Days 3-5: Quality improvements (errors, bundle, loading)

**Week 2:**
- Days 6-8: Advanced features (telemetry, performance)
- Days 9-10: Testing and validation

**Total Effort: 2 weeks**
**Risk Level: Low**
**Expected Outcome: Professional-grade frontend**
