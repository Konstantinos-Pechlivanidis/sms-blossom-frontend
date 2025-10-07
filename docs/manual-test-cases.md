# Manual Test Cases

## Overview

This document provides manual test cases for validating the SMS Blossom frontend integration with the backend API. Use the Postman collection in `backend_docs/postman/SMS_Blossom.postman_collection.json` to test all endpoints.

## Test Environment Setup

### Prerequisites
- Shopify embedded app running in development mode
- Backend API accessible at configured `VITE_BACKEND_URL`
- Valid shop domain and session token
- Postman collection loaded with test variables

### Test Variables
```json
{
  "shop": "test-shop.myshopify.com",
  "api_base": "https://api.sms-blossom.com",
  "auth_token": "Bearer <session_token>",
  "request_id": "test-request-123"
}
```

## Test Cases

### 1. Authentication & Headers

#### Test Case 1.1: Session Token Authentication
**Objective**: Verify proper session token authentication
**Steps**:
1. Open the app in Shopify Admin
2. Check browser network tab for API requests
3. Verify `Authorization: Bearer <token>` header is present
4. Verify token is valid and not expired

**Expected Result**: All API requests include valid session token

#### Test Case 1.2: Shop Domain Header
**Objective**: Verify shop domain header is included
**Steps**:
1. Open the app in Shopify Admin
2. Check browser network tab for API requests
3. Verify `X-Shop-Domain: <shop>.myshopify.com` header is present
4. Verify shop domain matches current shop

**Expected Result**: All API requests include correct shop domain header

#### Test Case 1.3: Request ID Generation
**Objective**: Verify request ID is generated for each request
**Steps**:
1. Open the app in Shopify Admin
2. Check browser network tab for API requests
3. Verify `X-Request-ID` header is present
4. Verify request ID is unique UUID format

**Expected Result**: All API requests include unique request ID

### 2. Dashboard Functionality

#### Test Case 2.1: Health Check
**Objective**: Verify system health monitoring
**Steps**:
1. Navigate to Dashboard
2. Check health status badge
3. Click "Show Connectivity" button
4. Click "Check Now" button
5. Verify health status updates

**Expected Result**: Health status shows system status, connectivity check works

#### Test Case 2.2: Overview Metrics
**Objective**: Verify dashboard metrics display
**Steps**:
1. Navigate to Dashboard
2. Verify KPIs are displayed (Messages Sent, Delivery Rate, Open Rate, Revenue)
3. Check time range selector (7d, 30d, 90d)
4. Verify metrics update when time range changes

**Expected Result**: All KPIs display correctly, time range changes update data

#### Test Case 2.3: Performance Charts
**Objective**: Verify performance charts render
**Steps**:
1. Navigate to Dashboard
2. Verify performance trends chart is displayed
3. Check chart shows messaging data over time
4. Verify chart is interactive (hover, zoom)

**Expected Result**: Performance chart displays correctly with interactive features

### 3. Campaigns Management

#### Test Case 3.1: Campaign List
**Objective**: Verify campaign list functionality
**Steps**:
1. Navigate to Campaigns page
2. Verify campaign list loads
3. Check campaign status badges (Draft, Estimated, Scheduled, Sent)
4. Test campaign actions (View, Edit, Send, Delete)

**Expected Result**: Campaign list displays correctly with proper status indicators

#### Test Case 3.2: Campaign Creation
**Objective**: Verify campaign creation workflow
**Steps**:
1. Click "Create Campaign" button
2. Fill in campaign details (name, template, segment)
3. Click "Save" button
4. Verify campaign is created and appears in list

**Expected Result**: Campaign is created successfully and appears in list

#### Test Case 3.3: Campaign Estimation
**Objective**: Verify campaign estimation functionality
**Steps**:
1. Open a campaign in draft status
2. Click "Estimate" button
3. Verify estimate modal opens
4. Check audience size and cost estimation
5. Verify estimate details are accurate

**Expected Result**: Campaign estimation works correctly with accurate data

#### Test Case 3.4: Campaign Test Send
**Objective**: Verify test send functionality
**Steps**:
1. Open a campaign in draft status
2. Click "Test Send" button
3. Enter test phone number
4. Click "Send Test" button
5. Verify test message is sent

**Expected Result**: Test message is sent successfully

#### Test Case 3.5: Campaign Send
**Objective**: Verify campaign sending functionality
**Steps**:
1. Open a campaign in estimated status
2. Click "Send Campaign" button
3. Confirm send action
4. Verify campaign status changes to "Sent"
5. Check send progress tracking

**Expected Result**: Campaign is sent successfully with progress tracking

### 4. Discounts Management

#### Test Case 4.1: Discount List
**Objective**: Verify discount list functionality
**Steps**:
1. Navigate to Discounts page
2. Verify discount list loads
3. Check discount status badges (Active, Inactive, Expired, Scheduled)
4. Test discount actions (View, Edit, Delete)

**Expected Result**: Discount list displays correctly with proper status indicators

#### Test Case 4.2: Discount Creation
**Objective**: Verify discount creation workflow
**Steps**:
1. Click "Create Discount" button
2. Fill in discount details (code, value, type, minimum amount)
3. Click "Save" button
4. Verify discount is created and appears in list

**Expected Result**: Discount is created successfully and appears in list

#### Test Case 4.3: Conflict Detection
**Objective**: Verify discount conflict detection
**Steps**:
1. Create a discount with code "TEST10"
2. Try to create another discount with same code
3. Verify conflict detection works
4. Check conflict resolution options

**Expected Result**: Conflict detection works correctly with resolution options

#### Test Case 4.4: Apply URL Generation
**Objective**: Verify apply URL generation
**Steps**:
1. Open a discount
2. Click "Generate Apply URL" button
3. Verify URL is generated
4. Test URL in new tab
5. Verify URL works correctly

**Expected Result**: Apply URL is generated and works correctly

### 5. Templates System

#### Test Case 5.1: Template Editor
**Objective**: Verify template editor functionality
**Steps**:
1. Navigate to Templates page
2. Open template editor
3. Enter template text with Liquid syntax
4. Verify syntax highlighting works
5. Check character count and SMS segments

**Expected Result**: Template editor works correctly with syntax highlighting

#### Test Case 5.2: Variable Picker
**Objective**: Verify variable picker functionality
**Steps**:
1. Open template editor
2. Select a trigger type
3. Verify available variables are displayed
4. Click on variables to insert them
5. Check variables are inserted correctly

**Expected Result**: Variable picker works correctly with proper insertion

#### Test Case 5.3: Template Preview
**Objective**: Verify template preview functionality
**Steps**:
1. Enter template text with variables
2. Fill in test variable values
3. Click "Preview" button
4. Verify rendered template is displayed
5. Check variable substitution works

**Expected Result**: Template preview works correctly with variable substitution

#### Test Case 5.4: Template Validation
**Objective**: Verify template validation functionality
**Steps**:
1. Enter template text with syntax errors
2. Click "Validate" button
3. Verify validation errors are displayed
4. Fix syntax errors
5. Verify validation passes

**Expected Result**: Template validation works correctly with error reporting

### 6. Settings Management

#### Test Case 6.1: Settings Display
**Objective**: Verify settings page loads
**Steps**:
1. Navigate to Settings page
2. Verify settings form loads
3. Check all setting categories are displayed
4. Verify current values are loaded

**Expected Result**: Settings page loads correctly with current values

#### Test Case 6.2: Quiet Hours Configuration
**Objective**: Verify quiet hours configuration
**Steps**:
1. Open Settings page
2. Navigate to Quiet Hours section
3. Enable quiet hours
4. Set start and end times
5. Save settings
6. Verify quiet hours are applied

**Expected Result**: Quiet hours are configured and applied correctly

#### Test Case 6.3: Timezone Settings
**Objective**: Verify timezone configuration
**Steps**:
1. Open Settings page
2. Navigate to Timezone section
3. Select a different timezone
4. Save settings
5. Verify timezone is applied

**Expected Result**: Timezone is configured and applied correctly

#### Test Case 6.4: Feature Flags
**Objective**: Verify feature flag configuration
**Steps**:
1. Open Settings page
2. Navigate to Feature Flags section
3. Toggle various feature flags
4. Save settings
5. Verify feature flags are applied

**Expected Result**: Feature flags are configured and applied correctly

### 7. Reports & Analytics

#### Test Case 7.1: Reports Display
**Objective**: Verify reports page loads
**Steps**:
1. Navigate to Reports page
2. Verify reports load
3. Check time range selector
4. Verify different report types are available

**Expected Result**: Reports page loads correctly with all report types

#### Test Case 7.2: Time Range Filtering
**Objective**: Verify time range filtering
**Steps**:
1. Open Reports page
2. Select different time ranges (7d, 30d, 90d)
3. Verify data updates for each range
4. Check data accuracy for each range

**Expected Result**: Time range filtering works correctly with accurate data

#### Test Case 7.3: Report Export
**Objective**: Verify report export functionality
**Steps**:
1. Open Reports page
2. Click "Export" button
3. Select export format (CSV, JSON, PDF)
4. Download report
5. Verify report is downloaded correctly

**Expected Result**: Report export works correctly with proper format

### 8. Error Handling

#### Test Case 8.1: Network Errors
**Objective**: Verify network error handling
**Steps**:
1. Disconnect internet connection
2. Try to perform API operations
3. Verify error messages are displayed
4. Reconnect internet
5. Verify retry functionality works

**Expected Result**: Network errors are handled gracefully with retry options

#### Test Case 8.2: Rate Limiting
**Objective**: Verify rate limiting handling
**Steps**:
1. Perform multiple rapid API requests
2. Verify rate limiting is triggered
3. Check retry-after header is respected
4. Verify exponential backoff works

**Expected Result**: Rate limiting is handled correctly with proper retry logic

#### Test Case 8.3: Validation Errors
**Objective**: Verify validation error handling
**Steps**:
1. Submit forms with invalid data
2. Verify validation errors are displayed
3. Check error messages are user-friendly
4. Fix validation errors
5. Verify form submission works

**Expected Result**: Validation errors are handled correctly with clear messages

### 9. Performance Testing

#### Test Case 9.1: Page Load Times
**Objective**: Verify page load performance
**Steps**:
1. Navigate to each page
2. Measure page load times
3. Verify pages load within 2 seconds
4. Check for performance bottlenecks

**Expected Result**: All pages load within acceptable time limits

#### Test Case 9.2: API Response Times
**Objective**: Verify API response performance
**Steps**:
1. Monitor API response times
2. Verify responses are under 1 second
3. Check for slow endpoints
4. Verify caching is working

**Expected Result**: API responses are fast with proper caching

#### Test Case 9.3: Memory Usage
**Objective**: Verify memory usage is reasonable
**Steps**:
1. Use browser dev tools to monitor memory
2. Navigate between pages
3. Check for memory leaks
4. Verify memory usage is stable

**Expected Result**: Memory usage is reasonable with no leaks

### 10. Integration Testing

#### Test Case 10.1: End-to-End Workflow
**Objective**: Verify complete user workflow
**Steps**:
1. Create a campaign
2. Estimate the campaign
3. Send test message
4. Send the campaign
5. Check campaign reports
6. Verify complete workflow works

**Expected Result**: Complete user workflow functions correctly

#### Test Case 10.2: Data Consistency
**Objective**: Verify data consistency across features
**Steps**:
1. Create data in one feature
2. Verify data appears in related features
3. Check data updates are reflected everywhere
4. Verify data consistency is maintained

**Expected Result**: Data consistency is maintained across all features

## Test Results

### Pass Criteria
- All test cases must pass
- No critical errors or crashes
- Performance meets requirements
- User experience is smooth
- Error handling is comprehensive

### Failure Criteria
- Any test case fails
- Critical errors or crashes occur
- Performance is unacceptable
- User experience is poor
- Error handling is inadequate

## Test Environment

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Device Testing
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

### Network Conditions
- Fast 3G
- Slow 3G
- Offline
- High latency

## Conclusion

This manual testing approach ensures comprehensive validation of the SMS Blossom frontend integration. All test cases should be executed to verify the application meets quality standards and user expectations.
