/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORE_NAME?: string;
  readonly VITE_STORE_TAGLINE?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_ANNOUNCEMENT_TEXT?: string;
  readonly VITE_STORE_EMAIL?: string;
  readonly VITE_CONTACT_PHONE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
