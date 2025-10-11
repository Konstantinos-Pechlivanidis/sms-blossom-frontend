# Session Token Audit

## Current Token Implementation

### ✅ authorizedFetch Implementation
- **Location**: `src/app/providers/AppProviders.tsx` lines 56-76
- **Status**: ✅ IMPLEMENTED
- **Behavior**: 
  - Gets fresh session token via App Bridge getSessionToken
  - Validates host parameter before making requests
  - Sets Authorization: Bearer <token> header
  - No token caching (fresh token per request)

### ✅ API Call Usage
- **Campaigns**: ✅ Uses authorizedFetch for all API calls
- **CampaignDetail**: ✅ Uses authorizedFetch for all API calls
- **Other Pages**: ✅ All backend calls use authorizedFetch
- **Status**: ✅ IMPLEMENTED

### ✅ Direct Fetch Calls
- **Found**: 1 direct fetch call in AppProviders.tsx (authorizedFetch implementation)
- **Status**: ✅ CORRECT - This is the authorizedFetch implementation itself
- **Impact**: None - This is the intended behavior

## Token Flow Analysis

### ✅ Per-Request Token Fetching
- **Implementation**: Fresh session token for each request
- **No Caching**: Tokens are not stored or reused
- **Host Validation**: Host parameter validated before token fetch
- **Status**: ✅ IMPLEMENTED

### ✅ Authorization Headers
- **Header**: Authorization: Bearer <token>
- **Token Source**: App Bridge getSessionToken()
- **Fresh Tokens**: Each request gets a new token
- **Status**: ✅ IMPLEMENTED

## Call Sites Analysis

### ✅ All API Calls Use authorizedFetch
- **Campaigns**: ✅ authorizedFetch used
- **CampaignDetail**: ✅ authorizedFetch used
- **Segments**: ✅ authorizedFetch used
- **Discounts**: ✅ authorizedFetch used
- **Settings**: ✅ authorizedFetch used
- **Templates**: ✅ authorizedFetch used
- **Automations**: ✅ authorizedFetch used
- **Reports**: ✅ authorizedFetch used

### ✅ No Direct Fetch Calls Found
- **Raw fetch**: Only in authorizedFetch implementation
- **Axios**: None found
- **apiFetch**: All use authorizedFetch wrapper
- **Status**: ✅ IMPLEMENTED

## Security Analysis

### ✅ Token Security
- **No Storage**: Tokens are not stored in localStorage or sessionStorage
- **Fresh Tokens**: Each request gets a new token
- **Short Lived**: Tokens expire after ~1 minute
- **Host Validation**: Host parameter validated before token fetch
- **Status**: ✅ SECURE

### ✅ Error Handling
- **Host Missing**: Throws error if host parameter is missing
- **Token Fetch Failure**: Proper error handling in authorizedFetch
- **Network Errors**: Handled by React Query
- **Status**: ✅ IMPLEMENTED

## Summary

### ✅ Session Token Implementation Complete
- **Per-Request Tokens**: ✅ Fresh token for each request
- **No Caching**: ✅ Tokens are not stored or reused
- **Host Validation**: ✅ Host parameter validated before requests
- **Authorization Headers**: ✅ Proper Bearer token headers
- **All API Calls**: ✅ Use authorizedFetch wrapper

### ✅ No Issues Found
- **Direct Fetch Calls**: None found (except in authorizedFetch implementation)
- **Token Caching**: Not implemented (correct behavior)
- **Security**: Proper token handling and validation

## Conclusion

The session token implementation is **FULLY IMPLEMENTED** and secure. All backend requests go through authorizedFetch with fresh session tokens. No patches are needed for token handling.

**Source**: Embedded apps must fetch a fresh token per request; do not cache. This implementation correctly fetches fresh tokens for each request without caching.
