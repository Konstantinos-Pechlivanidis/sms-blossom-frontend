# Live Dev-Store Test Checklist

## Preflight Checks ✅

- [ ] **Environment Setup**: Verify `.env` file exists with required variables
- [ ] **Build Status**: Confirm `npm run build` succeeds
- [ ] **Backend Health**: Verify backend API is accessible
- [ ] **Shopify App**: Confirm app is installed in dev store
- [ ] **App Bridge**: Verify session token generation works

## Required Environment Variables

```bash
# Create .env file with these variables:
VITE_BACKEND_URL=https://api.sms-blossom.com
VITE_SHOPIFY_API_KEY=your_shopify_api_key_here
VITE_ENABLE_PERFORMANCE=true
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG=true
```

---

## 🚀 **LIVE DEV-STORE TEST RUNBOOK**

### **Phase 1: App Installation & Authentication**

#### 1.1 OAuth Flow
- [ ] Navigate to Shopify Admin → Apps → SMS Blossom
- [ ] Complete OAuth installation flow
- [ ] Verify app appears in Shopify Admin navigation
- [ ] Check browser console for any OAuth errors

#### 1.2 Session Token Validation
- [ ] Open browser DevTools → Network tab
- [ ] Navigate to SMS Blossom app
- [ ] Verify `Authorization: Bearer <token>` header present
- [ ] Verify `X-Shop-Domain: <shop>.myshopify.com` header present
- [ ] Verify `X-Request-ID: <uuid>` header present

#### 1.3 Health Check
- [ ] Navigate to Dashboard
- [ ] Verify health status shows "Connected"
- [ ] Check browser console for `/health` API call
- [ ] Verify response includes `db`, `redis`, `queue` status

---

### **Phase 2: Consent Capture & Contact Management**

#### 2.1 Checkout UI Extension
- [ ] Create a test product in Shopify Admin
- [ ] Add product to cart
- [ ] Proceed to checkout
- [ ] Verify SMS consent checkbox appears
- [ ] Check "I agree to receive SMS updates" checkbox
- [ ] Complete checkout
- [ ] Verify consent is captured in backend

#### 2.2 Contact Management
- [ ] Navigate to Contacts page
- [ ] Verify test contact appears in list
- [ ] Click "Add Contact" button
- [ ] Fill out contact form (phone, email, name)
- [ ] Submit form
- [ ] Verify contact appears in list
- [ ] Test contact editing
- [ ] Test contact deletion

---

### **Phase 3: Automations Testing**

#### 3.1 Abandoned Checkout Automation
- [ ] Navigate to Automations page
- [ ] Find "Abandoned Checkout" card
- [ ] Toggle automation ON
- [ ] Click "Edit Template" button
- [ ] Modify template: "Hi {{customer_name}}, complete your order: {{checkout_url}}"
- [ ] Click "Save Template"
- [ ] Click "Edit Rules" button
- [ ] Set delay to 30 minutes
- [ ] Set quiet hours (e.g., 10 PM - 8 AM)
- [ ] Set frequency cap (1 per day)
- [ ] Save rules
- [ ] Verify automation is enabled

#### 3.2 Order Paid Automation
- [ ] Find "Order Paid" card
- [ ] Toggle automation ON
- [ ] Edit template: "Thanks {{customer_name}}! Order {{order_number}} confirmed for {{order_total}}"
- [ ] Save template
- [ ] Edit rules (quiet hours, frequency cap)
- [ ] Save rules
- [ ] Verify automation is enabled

#### 3.3 Fulfillment Update Automation
- [ ] Find "Fulfillment Update" card
- [ ] Toggle automation ON
- [ ] Edit template: "{{customer_name}}, your order {{order_number}} is shipped! Track: {{tracking_url}}"
- [ ] Save template
- [ ] Edit rules
- [ ] Save rules
- [ ] Verify automation is enabled

#### 3.4 Welcome Automation
- [ ] Find "Welcome" card
- [ ] Toggle automation ON
- [ ] Edit template: "Welcome {{customer_name}}! Use code {{discount_code}} for {{discount_value}} off"
- [ ] Save template
- [ ] Edit rules
- [ ] Save rules
- [ ] Verify automation is enabled

#### 3.5 Back in Stock Automation
- [ ] Find "Back in Stock" card
- [ ] Toggle automation ON
- [ ] Edit template: "{{customer_name}}, {{product_name}} is back in stock! {{product_url}}"
- [ ] Save template
- [ ] Edit rules
- [ ] Save rules
- [ ] Verify automation is enabled

---

### **Phase 4: End-to-End Automation Testing**

#### 4.1 Abandoned Checkout Flow
- [ ] Create test product
- [ ] Add to cart, proceed to checkout
- [ ] Enter phone number, check SMS consent
- [ ] Abandon checkout (don't complete)
- [ ] Wait 30 minutes (or adjust delay in automation)
- [ ] Verify SMS is sent to test phone
- [ ] Check SMS content matches template
- [ ] Verify variables are populated correctly

#### 4.2 Order Paid Flow
- [ ] Complete a test order
- [ ] Verify SMS is sent immediately
- [ ] Check SMS content matches template
- [ ] Verify order variables are populated

#### 4.3 Fulfillment Update Flow
- [ ] Create test order
- [ ] In Shopify Admin, mark order as fulfilled
- [ ] Add tracking number
- [ ] Verify SMS is sent
- [ ] Check SMS contains tracking information

---

### **Phase 5: Discounts Testing**

#### 5.1 Create Discount
- [ ] Navigate to Discounts page
- [ ] Click "Create Discount"
- [ ] Fill out discount form:
  - Code: "TEST10"
  - Type: Percentage
  - Value: 10
  - Minimum amount: $50
  - Usage limit: 100
- [ ] Save discount
- [ ] Verify discount appears in list

#### 5.2 Shopify Integration
- [ ] In Shopify Admin, go to Discounts
- [ ] Verify discount code appears
- [ ] Test discount code in checkout
- [ ] Verify discount applies correctly

#### 5.3 Apply URL Testing
- [ ] In Discounts page, click on discount
- [ ] Click "Get Apply URL"
- [ ] Copy the URL
- [ ] Test URL in browser
- [ ] Verify discount is applied

---

### **Phase 6: Campaigns Testing**

#### 6.1 Create Campaign
- [ ] Navigate to Campaigns page
- [ ] Click "Create Campaign"
- [ ] Fill out campaign form:
  - Name: "Test Campaign"
  - Template: "Hi {{customer_name}}, check out our new products!"
  - Audience: All contacts
- [ ] Save campaign
- [ ] Verify campaign appears in list

#### 6.2 Campaign Estimation
- [ ] Click on campaign
- [ ] Click "Estimate" button
- [ ] Verify estimation shows:
  - Number of recipients
  - Estimated cost
  - Delivery time
- [ ] Review estimation details

#### 6.3 Test Send
- [ ] Click "Test Send" button
- [ ] Enter test phone number
- [ ] Click "Send Test"
- [ ] Verify test SMS is received
- [ ] Check SMS content matches template

#### 6.4 Send Campaign
- [ ] Click "Send Campaign" button
- [ ] Confirm send
- [ ] Verify campaign status changes to "Sent"
- [ ] Check delivery reports

---

### **Phase 7: Reports & Analytics**

#### 7.1 Overview Report
- [ ] Navigate to Reports page
- [ ] Verify overview shows:
  - Total messages sent
  - Delivery rate
  - Click-through rate
  - Revenue attribution
- [ ] Check date range filters work

#### 7.2 Campaign Reports
- [ ] Click on "Campaigns" tab
- [ ] Verify campaign performance data
- [ ] Check individual campaign metrics
- [ ] Verify cost calculations

#### 7.3 Automation Reports
- [ ] Click on "Automations" tab
- [ ] Verify automation performance
- [ ] Check trigger counts
- [ ] Verify conversion rates

---

### **Phase 8: Error Handling & Edge Cases**

#### 8.1 Network Errors
- [ ] Disconnect internet
- [ ] Try to perform actions
- [ ] Verify error messages appear
- [ ] Reconnect internet
- [ ] Verify retry mechanisms work

#### 8.2 Rate Limiting
- [ ] Perform rapid API calls
- [ ] Verify 429 responses are handled
- [ ] Check retry logic works
- [ ] Verify user-friendly error messages

#### 8.3 Invalid Data
- [ ] Try to create contact with invalid phone
- [ ] Try to create discount with invalid code
- [ ] Try to send campaign with empty template
- [ ] Verify validation errors appear

---

### **Phase 9: Unsubscribe & Compliance**

#### 9.1 Unsubscribe Link
- [ ] Check SMS messages for unsubscribe link
- [ ] Click unsubscribe link
- [ ] Verify unsubscribe page loads
- [ ] Complete unsubscribe process
- [ ] Verify contact is marked as unsubscribed

#### 9.2 STOP Handling
- [ ] Send "STOP" to SMS number
- [ ] Verify contact is marked as unsubscribed
- [ ] Try to send automation to unsubscribed contact
- [ ] Verify contact is skipped

#### 9.3 GDPR Compliance
- [ ] Check for data export functionality
- [ ] Check for data deletion functionality
- [ ] Verify consent tracking
- [ ] Check audit logs

---

### **Phase 10: Performance & Monitoring**

#### 10.1 Performance Dashboard
- [ ] Press Ctrl+Shift+P to open performance dashboard
- [ ] Verify metrics are collected
- [ ] Check page load times
- [ ] Check API call durations
- [ ] Verify memory usage

#### 10.2 Error Monitoring
- [ ] Check browser console for errors
- [ ] Verify error tracking works
- [ ] Check telemetry events
- [ ] Verify performance monitoring

---

## **Test Completion Checklist**

- [ ] All automations tested and working
- [ ] Discounts created and applied successfully
- [ ] Campaigns sent and delivered
- [ ] Reports show accurate data
- [ ] Error handling works correctly
- [ ] Unsubscribe flow works
- [ ] Performance monitoring active
- [ ] No critical errors in console
- [ ] All API calls include required headers
- [ ] Backend integration working correctly

---

## **Issues Found**

### Critical Issues
- [ ] Issue 1: [Description]
- [ ] Issue 2: [Description]

### Minor Issues
- [ ] Issue 1: [Description]
- [ ] Issue 2: [Description]

### Recommendations
- [ ] Recommendation 1: [Description]
- [ ] Recommendation 2: [Description]

---

## **Test Results Summary**

- **Total Tests**: [Number]
- **Passed**: [Number]
- **Failed**: [Number]
- **Skipped**: [Number]
- **Success Rate**: [Percentage]%

**Overall Status**: ✅ PASS / ❌ FAIL / ⚠️ PARTIAL

**Next Steps**: [List any required fixes or follow-up actions]
