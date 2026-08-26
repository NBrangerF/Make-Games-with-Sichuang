/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_TRIAL_MODE?: string
  readonly VITE_PUBLIC_HOST_LABEL?: string
  readonly VITE_PRIVACY_CONTACT?: string
  readonly VITE_BUILD_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
