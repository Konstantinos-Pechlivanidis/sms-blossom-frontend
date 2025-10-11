# App Bridge Navigation Audit

## Current App Bridge Setup

### Host Parameter Handling
- **Location**: `src/lib/shopify/host.ts`
- **Functions**: `getHostFromLocation()`, `persistHost()`, `loadPersistedHost()`, `ensureHostParam()`
- **Status**: ✅ IMPLEMENTED

### Session Token Authentication
- **Location**: `src/lib/auth/authorizedFetch.ts`
- **Implementation**: Fresh session token per request via `getBearerToken()`
- **Status**: ✅ IMPLEMENTED

### Host Link Preservation
- **Location**: `src/ui/routing/WithHostLink.tsx`
- **Functions**: `WithHostLink` component, `useHostLink` hook
- **Status**: ✅ IMPLEMENTED

### App Bridge Provider
- **Location**: `src/app/providers/AppProviders.tsx`
- **Host Guard**: ✅ IMPLEMENTED - Shows recovery UI if no host
- **Status**: ✅ IMPLEMENTED

## Navigation Analysis

### Internal Links
- **WithHostLink**: ✅ Available for preserving host parameter
- **Usage**: Not yet applied to all internal links
- **Status**: ⚠️ PARTIAL - Need to replace standard Link components

### Programmatic Navigation
- **useNavigate**: Used in NotFoundPage
- **Host Preservation**: ❌ NOT IMPLEMENTED - Need useNavigateWithHost
- **Status**: ⚠️ NEEDS FIX

### External Redirects
- **App Bridge Redirect**: ❌ NOT IMPLEMENTED
- **Status**: ⚠️ NEEDS FIX

## Current Issues

### 1. Host Parameter Loss
- **Problem**: Internal navigation may lose host parameter
- **Impact**: Causes "APP::ERROR::INVALID_CONFIG: host must be provided"
- **Solution**: Replace all Link with WithHostLink, useNavigate with useNavigateWithHost

### 2. Missing Error Boundaries
- **Problem**: Route-level errors not handled
- **Impact**: Poor user experience on errors
- **Solution**: Add errorElement to all routes

### 3. Deep Link Issues
- **Problem**: Hard refresh may cause 404s
- **Impact**: "Not Found" errors on direct URL access
- **Solution**: Ensure proper basename and server rewrites

## Required Fixes

### 1. Navigation Safety
- Replace all `<Link>` with `<LinkWithHost>`
- Replace all `useNavigate()` with `useNavigateWithHost()`
- Add App Bridge Redirect for external navigation

### 2. Error Handling
- Add errorElement to root route
- Add errorElement to all lazy routes
- Create RouteError component

### 3. Host Preservation
- Ensure all internal navigation preserves host
- Add host validation to App Bridge initialization
- Implement host recovery mechanism

## Summary
The App Bridge integration is well-implemented but navigation safety needs improvement. Host parameter preservation and error handling are the main areas requiring attention.
