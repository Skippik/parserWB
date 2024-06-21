interface ImportMetaEnv {
  readonly VITE_APP_API_ROUTE: string;
  readonly VITE_LANGEAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
