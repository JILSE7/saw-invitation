/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Apps Script web app URL that records RSVPs. */
  readonly VITE_RSVP_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
