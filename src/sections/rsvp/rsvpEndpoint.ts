/** Shared by the submit and the lookup, so the env var is read in one place. */
export const RSVP_ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT ?? ''

/** False until VITE_RSVP_ENDPOINT is set, so the form can refuse to lie. */
export function isRsvpConfigured(): boolean {
  return RSVP_ENDPOINT.length > 0
}
