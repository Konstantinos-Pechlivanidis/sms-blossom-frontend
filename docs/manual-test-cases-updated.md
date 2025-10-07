# Manual Test Cases - Updated

This document outlines manual test cases for validating the SMS Blossom frontend against the backend API, including accessibility and performance tests.

## Test Environment Setup

1. **Backend API**: Ensure backend is running at `https://sms-blossom-api.onrender.com`
2. **Frontend**: Run `npm run dev` and navigate to `http://localhost:5173`
3. **Shopify Admin**: Use a development store for testing
4. **Postman Collection**: Use `backend_docs/postman/SMS_Blossom.postman_collection.json` for API validation

## Test Cases

### 1. Dashboard Tests

#### 1.1 Dashboard KPIs Display
- **Action**: Navigate to Dashboard
- **Expected**: Display key metrics (subscribers, campaigns, sent messages, delivery rate)
- **API Call**: `GET /api/dashboard/kpis?shop={shop}`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`

#### 1.2 Health Status Check
- **Action**: Check health status badge
- **Expected**: Show "Healthy" or "Unhealthy" status
- **API Call**: `GET /health`
- **Headers**: None required

#### 1.3 Connectivity Check
- **Action**: Click "Connectivity Check" button
- **Expected**: Show success message and health details
- **API Call**: `GET /health`
- **Headers**: None required

### 2. Campaigns Tests

#### 2.1 Campaign List
- **Action**: Navigate to Campaigns page
- **Expected**: Display list of campaigns with status, dates, metrics
- **API Call**: `GET /api/campaigns?shop={shop}`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`

#### 2.2 Create Campaign
- **Action**: Click "Create Campaign", fill form, submit
- **Expected**: Campaign created successfully, redirect to campaign detail
- **API Call**: `POST /api/campaigns`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`, `Content-Type: application/json`

#### 2.3 Campaign Estimate
- **Action**: Click "Estimate" button on a campaign
- **Expected**: Show estimate modal with cost breakdown
- **API Call**: `POST /api/campaigns/{id}/estimate`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`, `Content-Type: application/json`

### 3. Discounts Tests

#### 3.1 Discount List
- **Action**: Navigate to Discounts page
- **Expected**: Display list of discounts with codes, types, usage
- **API Call**: `GET /api/discounts?shop={shop}`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`

#### 3.2 Create Discount
- **Action**: Click "Create Discount", fill form, submit
- **Expected**: Discount created successfully
- **API Call**: `POST /api/discounts`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`, `Content-Type: application/json`

#### 3.3 Discount Conflict Check
- **Action**: Create discount with existing code
- **Expected**: Show conflict error message
- **API Call**: `POST /api/discounts`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`, `Content-Type: application/json`

### 4. Templates Tests

#### 4.1 Template List
- **Action**: Navigate to Templates page
- **Expected**: Display list of templates with content preview
- **API Call**: `GET /api/templates?shop={shop}`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`

#### 4.2 Template Preview
- **Action**: Click "Preview" on a template
- **Expected**: Show rendered template with sample data
- **API Call**: `POST /api/templates/preview`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`, `Content-Type: application/json`

#### 4.3 Template Validation
- **Action**: Edit template content, click "Validate"
- **Expected**: Show validation results (syntax, variables, triggers)
- **API Call**: `POST /api/templates/validate`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`, `Content-Type: application/json`

### 5. Settings Tests

#### 5.1 Settings Display
- **Action**: Navigate to Settings page
- **Expected**: Display current settings (quiet hours, notifications, automation)
- **API Call**: `GET /api/settings?shop={shop}`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`

#### 5.2 Update Settings
- **Action**: Modify settings, click "Save"
- **Expected**: Settings updated successfully
- **API Call**: `PUT /api/settings`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`, `Content-Type: application/json`

### 6. Reports Tests

#### 6.1 Reports Overview
- **Action**: Navigate to Reports page
- **Expected**: Display overview metrics and charts
- **API Call**: `GET /api/reports/overview?shop={shop}&window=30d`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`

#### 6.2 Reports Time Series
- **Action**: Change time window, view charts
- **Expected**: Update charts with new data
- **API Call**: `GET /api/reports/messaging/timeseries?shop={shop}&window={window}`
- **Headers**: `Authorization: Bearer {token}`, `X-Shop-Domain: {shop}`

## Error Scenarios

### 1. Authentication Errors
- **401 Unauthorized**: Invalid or expired token
- **Expected**: Redirect to login or show auth error
- **API Call**: Any protected endpoint
- **Headers**: `Authorization: Bearer invalid-token`

### 2. Shop Errors
- **404 Unknown Shop**: Shop not recognized by backend
- **Expected**: Show "Please reinstall the app" message
- **API Call**: Any endpoint with invalid shop
- **Headers**: `X-Shop-Domain: invalid-shop.myshopify.com`

### 3. Validation Errors
- **422 Validation Error**: Invalid input data
- **Expected**: Show field-specific error messages
- **API Call**: POST/PUT with invalid data
- **Headers**: `Content-Type: application/json`

### 4. Rate Limiting
- **429 Rate Limited**: Too many requests
- **Expected**: Show rate limit message, retry after delay
- **API Call**: Any endpoint with rate limit
- **Headers**: `Retry-After: 60`

### 5. Server Errors
- **500 Internal Error**: Server error
- **Expected**: Show generic error message
- **API Call**: Any endpoint with server error
- **Headers**: None

## Accessibility Tests

### 1. Keyboard Navigation
- **Action**: Navigate using Tab key
- **Expected**: All interactive elements are reachable
- **Check**: Focus indicators are visible

### 2. Screen Reader Compatibility
- **Action**: Use screen reader (NVDA/JAWS)
- **Expected**: All content is announced correctly
- **Check**: Headings, buttons, form labels are properly announced

### 3. Color Contrast
- **Action**: Check color contrast ratios
- **Expected**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Check**: Use browser dev tools or axe-core

### 4. Form Labels
- **Action**: Check all form inputs
- **Expected**: Every input has associated label
- **Check**: Use browser dev tools accessibility panel

## Performance Tests

### 1. Page Load Times
- **Action**: Navigate to each page
- **Expected**: Pages load within 3 seconds
- **Check**: Use browser dev tools Network tab

### 2. Bundle Size
- **Action**: Check bundle size
- **Expected**: Main bundle < 500KB, vendor bundle < 1MB
- **Check**: Use bundle analyzer or browser dev tools

### 3. Memory Usage
- **Action**: Use app for 10+ minutes
- **Expected**: No memory leaks, stable performance
- **Check**: Use browser dev tools Memory tab

## Postman Collection Usage

1. **Import Collection**: Import `backend_docs/postman/SMS_Blossom.postman_collection.json`
2. **Set Environment Variables**:
   - `shop`: Your development store domain
   - `token`: Session token from Shopify Admin
   - `base_url`: Backend API URL
3. **Run Tests**: Execute collection to validate API endpoints
4. **Compare Results**: Ensure frontend behavior matches API responses

## Test Data Requirements

- **Shop**: Valid Shopify development store
- **Products**: At least 5 products for testing
- **Customers**: At least 10 customers with phone numbers
- **Orders**: At least 3 orders for testing
- **Discounts**: At least 2 active discounts
- **Templates**: At least 3 message templates

## Success Criteria

- All API calls return expected responses
- Error messages are user-friendly and actionable
- Loading states are shown during API calls
- Data is displayed correctly in UI components
- Navigation works between all pages
- Forms validate input and show errors
- Settings are saved and persisted
- Reports show accurate data and charts
- Accessibility standards are met (WCAG 2.1 AA)
- Performance benchmarks are achieved
