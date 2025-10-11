# Deployment Guide

## SPA History Fallback Configuration

This is a Single Page Application (SPA) that uses client-side routing. To prevent "Not Found" errors on direct URL access or hard refresh, you need to configure your server to serve `index.html` for all routes.

### Express/Node.js Server

```javascript
// @cursor:start(history-fallback-express)
const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');

const app = express();

// Enable history API fallback
app.use(history());

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
// @cursor:end(history-fallback-express)
```

### Nginx Configuration

```nginx
# @cursor:start(history-fallback-docs)
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/sms-blossom-frontend/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
# @cursor:end(history-fallback-docs)
```

### Apache Configuration

```apache
# @cursor:start(history-fallback-apache)
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/sms-blossom-frontend/dist

    <Directory /var/www/sms-blossom-frontend/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Handle client-side routing
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</VirtualHost>
# @cursor:end(history-fallback-apache)
```

### Vercel Configuration

Create `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify Configuration

Create `_redirects` file in the `dist` directory:

```
/*    /index.html   200
```

### GitHub Pages

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Shopify App Deployment

For Shopify embedded apps, ensure your app URL is configured correctly in your Shopify Partner Dashboard:

1. **App URL**: `https://your-domain.com`
2. **Allowed redirection URLs**: `https://your-domain.com/auth/callback`
3. **Webhook endpoints**: Configure as needed

## Environment Variables

Set the following environment variables in your hosting platform:

```bash
VITE_API_BASE_URL=https://your-api-domain.com
VITE_SHOPIFY_API_KEY=your-shopify-api-key
VITE_BASE_PATH=/  # Optional: if app is not served from root
```

## Build Commands

```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Preview build locally
npm run preview
```

## Troubleshooting

### "Not Found" on Direct URL Access
- Ensure your server is configured with history API fallback
- Check that all routes serve `index.html`
- Verify your hosting platform supports SPA routing

### App Bridge Host Parameter Issues
- Ensure the app is opened from Shopify Admin
- Check that the `host` parameter is preserved in URLs
- Verify session token authentication is working

### Build Issues
- Run `npm run typecheck` to check for TypeScript errors
- Run `npm run lint` to check for linting issues
- Ensure all environment variables are set correctly
