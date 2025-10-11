# Questions for Developer

## Deployment Configuration Questions

### 1. Sub-path Deployment
**Question**: Are you serving the app under a sub-path (e.g., `/apps/sms-blossom`)?
- **Yes**: What is the exact sub-path? (e.g., `/apps/sms-blossom`)
- **No**: The app is served from the root path (`/`)

### 2. Base Path Environment Variable
**Question**: What is the intended value for `VITE_BASE_PATH`?
- **Root deployment**: Set to `/` (default)
- **Sub-path deployment**: Set to the sub-path (e.g., `/apps/sms-blossom`)
- **Current status**: Not set in environment

### 3. Hosting Infrastructure
**Question**: What hosting infrastructure are you using?
- **Node.js/Express**: Need to implement connect-history-api-fallback
- **Vercel**: Need vercel.json with rewrites
- **Netlify**: Need _redirects file or netlify.toml
- **Nginx**: Need nginx.conf with try_files
- **Apache**: Need .htaccess with RewriteRule
- **GitHub Pages**: Need GitHub Actions workflow
- **Other**: Please specify

### 4. Current Deployment Status
**Question**: Is the app currently deployed and experiencing issues?
- **Yes**: What specific issues are you seeing?
- **No**: Are you planning to deploy soon?

### 5. Development vs Production
**Question**: Are the issues occurring in development or production?
- **Development**: Vite dev server should handle SPA routing automatically
- **Production**: Need proper history fallback configuration

## Technical Questions

### 6. App Bridge Host Parameter
**Question**: Are you seeing "APP::ERROR::INVALID_CONFIG: host must be provided" errors?
- **Yes**: The host parameter management is implemented but may need verification
- **No**: The current implementation should be working

### 7. Direct URL Access
**Question**: Are you experiencing "Not Found" errors when accessing URLs directly?
- **Yes**: Need to implement SPA history fallback
- **No**: Current configuration may be working

### 8. Environment Variables
**Question**: Do you have a `.env` file with `VITE_BASE_PATH` set?
- **Yes**: What is the current value?
- **No**: Need to create one with appropriate value

## Priority Questions

### 9. Immediate Issues
**Question**: What is the most critical issue you're experiencing right now?
- **Host parameter errors**: Need to verify App Bridge initialization
- **404 errors on direct access**: Need SPA history fallback
- **Asset loading issues**: Need Vite base configuration
- **Other**: Please describe

### 10. Deployment Timeline
**Question**: When do you need this fixed?
- **Immediately**: Will prioritize critical fixes
- **This week**: Can implement comprehensive solution
- **Flexible**: Can implement best practices

## Next Steps

Based on your answers, I will:
1. **Implement missing configurations** (Vite base, router basename, history fallback)
2. **Create deployment files** (server.js, vercel.json, nginx.conf, etc.)
3. **Update environment configuration** (env.example, documentation)
4. **Test and verify** all configurations work correctly

Please answer these questions so I can provide the most appropriate fixes for your specific deployment scenario.
