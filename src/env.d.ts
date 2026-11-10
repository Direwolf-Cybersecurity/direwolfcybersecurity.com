/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Platform origin for Log in / Sign up (PLATFORM_LIVE) and the header Log in (PLATFORM_LOGIN). */
  readonly PUBLIC_APP_URL?: string;
  /** Optional JSON endpoint for the contact form. */
  readonly PUBLIC_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
