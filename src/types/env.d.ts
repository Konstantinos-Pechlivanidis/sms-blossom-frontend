interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_SHOPIFY_API_KEY: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
