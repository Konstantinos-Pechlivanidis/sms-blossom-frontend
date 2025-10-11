# Router Base Path Audit

## Current Router Configuration

### ✅ React Router Basename
- **Location**: `src/main.tsx` line 103
- **Current Value**: `import.meta.env.VITE_BASE_PATH || undefined`
- **Status**: ✅ IMPLEMENTED
- **Behavior**: Uses VITE_BASE_PATH if set, otherwise undefined (root path)

### ❌ Vite Base Configuration
- **Location**: `vite.config.ts`
- **Current Value**: **MISSING** - No `base` option configured
- **Status**: ❌ NOT IMPLEMENTED
- **Impact**: Asset URLs may be incorrect for sub-path deployments

### ✅ HTML Base Tag
- **Location**: `index.html`
- **Current Value**: **NONE** - No `<base>` tag present
- **Status**: ✅ CORRECT
- **Behavior**: Vite handles asset paths, no conflicting base tag

### ❌ Environment Variables
- **VITE_BASE_PATH**: Not set in env.example
- **Current Value**: Undefined
- **Status**: ❌ NOT DOCUMENTED
- **Impact**: No guidance for sub-path deployments

## Compatibility Matrix

| Component | Current Value | Expected | Status |
|-----------|---------------|----------|---------|
| Router `basename` | `VITE_BASE_PATH \|\| undefined` | `VITE_BASE_PATH \|\| '/'` | ⚠️ PARTIAL |
| Vite `base` | **MISSING** | `VITE_BASE_PATH \|\| '/'` | ❌ MISSING |
| HTML `<base>` | None | None | ✅ CORRECT |
| Environment | Not documented | Should be documented | ❌ MISSING |

## Issues Found

### 1. Vite Base Configuration Missing
- **Problem**: No `base` option in vite.config.ts
- **Impact**: Asset URLs may be incorrect for sub-path deployments
- **Fix**: Add `base: process.env.VITE_BASE_PATH || '/'`

### 2. Environment Variable Not Documented
- **Problem**: VITE_BASE_PATH not in env.example
- **Impact**: No guidance for sub-path deployments
- **Fix**: Add VITE_BASE_PATH to env.example

### 3. Router Basename Logic
- **Current**: `VITE_BASE_PATH || undefined`
- **Expected**: `VITE_BASE_PATH || '/'`
- **Impact**: May cause issues with root path deployments
- **Fix**: Change to `VITE_BASE_PATH || '/'`

## Required Fixes

### 1. Add Vite Base Configuration
```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: env.VITE_BASE_PATH || '/',
    // ... rest of config
  };
});
```

### 2. Update Environment Example
```bash
# env.example
VITE_BASE_PATH=/  # Set to / for root, /apps/sms-blossom for sub-path
```

### 3. Update Router Basename
```typescript
// src/main.tsx
const router = createBrowserRouter([...], {
  basename: import.meta.env.VITE_BASE_PATH || '/',
});
```

## Sources

- **React Router basename**: Makes all routes/links relative to a base path
- **Vite base**: Rewrites built asset URLs for nested deployments
- **Compatibility**: Both must match for proper sub-path deployment

## Summary

The router basename is partially implemented but needs fixes for proper sub-path deployment support. Vite base configuration is missing entirely.
