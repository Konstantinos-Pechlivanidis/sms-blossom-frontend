import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

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
    plugins: [react()],
    define: {
      __BACKEND_URL__: JSON.stringify(env.VITE_BACKEND_URL || ''),
      __SHOPIFY_API_KEY__: JSON.stringify(env.VITE_SHOPIFY_API_KEY || ''),
    },
  };
});
