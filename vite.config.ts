import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      https: true,
      port: 5173,
      host: true,
    },
    plugins: [react(), mkcert()],
    define: {
      __BACKEND_URL__: JSON.stringify(env.VITE_BACKEND_URL || ''),
      __SHOPIFY_API_KEY__: JSON.stringify(env.VITE_SHOPIFY_API_KEY || ''),
    },
  };
});
