/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN?: string;
  /** Backend proxy endpoint for the AI chatbot — holds the Claude API key. */
  readonly VITE_CHAT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
