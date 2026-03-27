/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MERCADO_PAGO_PREFERENCE_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
