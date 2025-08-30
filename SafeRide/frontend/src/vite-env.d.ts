/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MICROSOFT_CLIENT_ID: string
  readonly VITE_MICROSOFT_TENANT_ID: string
  readonly VITE_USE_MOCK_AUTH: string
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
