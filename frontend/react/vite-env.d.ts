/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_ROUTE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
