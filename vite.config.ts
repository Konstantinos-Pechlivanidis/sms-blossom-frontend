import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
// Tailwind removed - using Polaris-only styling

// https://vitejs.dev/config/
const PORT = Number(process.env.VITE_PORT || 5173);
const HOST = process.env.VITE_HOST || '0.0.0.0';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      host: HOST,
      port: PORT,
      strictPort: true,
      hmr: {
        host: 'localhost',
        protocol: 'ws',
        port: PORT
      }
    },
    preview: { host: HOST, port: PORT },
    plugins: [
      react(),
      // Tailwind plugin removed - using Polaris-only styling
      visualizer({
        filename: 'artifacts/bundle/report.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap', // Use treemap for better visualization
        sourcemap: true,
      }),
    ],
    define: {
      __BACKEND_URL__: JSON.stringify(env.VITE_BACKEND_URL || ''),
      __SHOPIFY_API_KEY__: JSON.stringify(env.VITE_SHOPIFY_API_KEY || ''),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            polaris: ['@shopify/polaris', '@shopify/polaris-icons'],
            query: ['@tanstack/react-query'],
            router: ['react-router-dom'],
            charts: ['recharts'],
            forms: ['react-hook-form', '@hookform/resolvers'],
            shopify: ['@shopify/app-bridge', '@shopify/app-bridge-utils'],
          },
        },
      },
      // Bundle size limits
      chunkSizeWarningLimit: 1000, // 1MB warning
      target: 'es2022',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  };
});
