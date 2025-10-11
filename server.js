// @cursor:start(history-fallback-express)
const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable history API fallback for SPA routing
app.use(history({
  // Serve index.html for all routes that don't match static files
  index: '/index.html',
  // Disable dot rule to allow serving files that start with dots
  disableDotRule: true,
  // Custom rewrites for API routes (if any)
  rewrites: [
    // Add any API routes that should not be rewritten to index.html
    // { from: /^\/api\/.*$/, to: function(context) { return context.parsedUrl.pathname; } }
  ]
}));

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist'), {
  // Set cache headers for static assets
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// Fallback for all routes - serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SMS Blossom server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist')}`);
  console.log(`🔄 SPA history fallback enabled`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});
// @cursor:end(history-fallback-express)
