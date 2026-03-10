/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_FEEDBACK_URL?: string
  readonly VITE_FEEDBACK_LABEL?: string
  readonly VITE_FEEDBACK_INBOX_OWNER_EMAILS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
