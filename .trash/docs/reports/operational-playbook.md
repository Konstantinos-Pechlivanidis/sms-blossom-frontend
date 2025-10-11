# SMS Blossom Frontend - Operational Playbook

## Environment Setup

### 1. Environment Variables
Copy the environment template and configure:

```bash
# Copy the template
cp reports/.env.example .env

# Edit with your values
nano .env
```

**Required Variables:**
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_SHOPIFY_API_KEY`: Shopify API key
- `VITE_BACKEND_URL`: Backend URL (usually same as API_BASE_URL)

**Feature Flags:**
- `AUTOMATIONS_ENABLED=true`: Enable automations feature
- `REPORTS_ENABLED=true`: Enable reports feature
- `DASHBOARD_CHARTS_ENABLED=true`: Enable dashboard charts
- `REAL_TIME_METRICS_ENABLED=false`: Enable real-time metrics
- `CAMPAIGN_TEMPLATES_ENABLED=true`: Enable campaign templates
- `CAMPAIGN_SCHEDULING_ENABLED=false`: Enable campaign scheduling
- `CAMPAIGN_AUTOMATION_ENABLED=false`: Enable campaign automation
- `DISCOUNT_AUTOMATION_ENABLED=false`: Enable discount automation
- `DISCOUNT_CONFLICTS_ENABLED=true`: Enable discount conflict checking
- `TEMPLATE_LIQUID_ENABLED=true`: Enable Liquid template syntax
- `TEMPLATE_VARIABLES_ENABLED=true`: Enable template variables
- `TEMPLATE_VALIDATION_ENABLED=true`: Enable template validation

### 2. Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run typecheck

# Run tests
npm test

# Build for production
npm run build
```

## Deployment

### 1. Pre-deployment Checks
```bash
# Run all checks
npm run check:all

# Type checking
npm run typecheck

# Linting
npm run lint

# Tests
npm test

# Build verification
npm run build
```

### 2. Production Build
```bash
# Build with production optimizations
npm run build

# Verify build
npm run build:verify

# Analyze bundle size
npm run bundle:analyze
```

### 3. Deployment Steps
1. **Build the application**: `npm run build`
2. **Upload dist/ folder** to your hosting service
3. **Configure environment variables** on your hosting platform
4. **Set up routing** to serve index.html for all routes (SPA)
5. **Configure HTTPS** and security headers
6. **Set up monitoring** and error tracking

## Monitoring & Logging

### 1. Request Logging
All API requests are automatically logged with PII redaction:
- Phone numbers are redacted
- Email addresses are redacted
- API tokens are redacted
- Sensitive headers are redacted

### 2. Error Tracking
- Global error boundary catches React errors
- API errors are logged with request IDs
- User actions are tracked for debugging

### 3. Performance Monitoring
- Page load times are tracked
- API response times are monitored
- Bundle size is analyzed
- Memory usage is tracked

## Feature Flags

### 1. Toggle Features
Update environment variables to enable/disable features:

```bash
# Disable automations
AUTOMATIONS_ENABLED=false

# Disable reports
REPORTS_ENABLED=false

# Enable real-time metrics
REAL_TIME_METRICS_ENABLED=true
```

### 2. Runtime Feature Checks
Features are checked at runtime:
- Routes are conditionally rendered
- Menu items are hidden/shown
- API calls are skipped for disabled features

## Troubleshooting

### 1. Common Issues

**TypeScript Errors:**
```bash
# Check for type errors
npm run typecheck

# Fix common issues:
# - Missing autoComplete props on TextField
# - Badge children must be strings
# - Text as prop must be valid HTML element
```

**Build Failures:**
```bash
# Check build output
npm run build

# Analyze bundle
npm run bundle:analyze

# Check for missing dependencies
npm install
```

**Runtime Errors:**
- Check browser console for errors
- Verify environment variables are set
- Check network requests in DevTools
- Look for CORS issues

### 2. Debug Mode
Enable debug logging:
```bash
VITE_LOG_LEVEL=debug
```

### 3. Performance Issues
- Check bundle size with `npm run bundle:analyze`
- Enable lazy loading for heavy routes
- Monitor API response times
- Check for memory leaks

## Security

### 1. PII Redaction
All logging automatically redacts:
- Phone numbers
- Email addresses
- API tokens
- Sensitive headers

### 2. Headers Verification
All API requests include:
- `Authorization: Bearer <token>`
- `X-Shop-Domain: <shop-domain>`
- `X-Request-ID: <uuid>`

### 3. CSRF Protection
- App Bridge handles CSRF protection
- All requests include proper headers
- Shop context is validated

## Rollback Procedures

### 1. Quick Rollback
1. Revert to previous deployment
2. Update environment variables if needed
3. Clear CDN cache
4. Verify functionality

### 2. Feature Rollback
Disable problematic features via environment variables:
```bash
# Disable specific features
AUTOMATIONS_ENABLED=false
REPORTS_ENABLED=false
```

### 3. Emergency Procedures
1. **Disable all features**: Set all feature flags to `false`
2. **Maintenance mode**: Show maintenance page
3. **API fallback**: Use cached data if available

## Maintenance

### 1. Regular Tasks
- Update dependencies monthly
- Run security audits
- Monitor bundle size
- Check error rates

### 2. Performance Optimization
- Analyze bundle with `npm run bundle:analyze`
- Implement lazy loading for heavy routes
- Optimize images and assets
- Monitor Core Web Vitals

### 3. Security Updates
- Update dependencies regularly
- Run security audits
- Monitor for vulnerabilities
- Update environment variables

## Support

### 1. Logs Location
- Browser console for client-side errors
- Network tab for API request/response logs
- Application logs (if configured)

### 2. Request ID Tracking
All API requests include a `X-Request-ID` header for tracking:
- Use this ID when reporting issues
- Include in support requests
- Track across systems

### 3. Common Support Issues
- **404 errors**: Check routing configuration
- **CORS errors**: Verify API configuration
- **Authentication errors**: Check Shopify integration
- **Performance issues**: Check bundle size and lazy loading
