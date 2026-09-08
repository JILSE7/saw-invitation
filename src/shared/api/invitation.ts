/**
 * The invitation's one contact point with the Google Sheet.
 *
 * The guest list used to ship inside the JS bundle, which meant every name and
 * pass count was readable in DevTools by anyone with a link. The sheet is now
 * the only copy, and the same `doGet` that already validated a submission
 * answers who the family is — so the roster is private and there is exactly
 * one place it can be wrong.
 */

export type Family = {
  /** Unique. Travels in the invitation URL as `?familia=<id>`. */
  readonly id: string
  /** Shown on the envelope and recorded with the RSVP. */
  readonly name: string
  /** Maximum number of people this family may confirm. */
  readonly guests: number
}

export type RsvpAnswer = {
  readonly confirmed: boolean
  readonly guests: number
  readonly message: string
  /** ISO timestamp of the row this answer came from. */
  readonly at: string
}

/**
 * Deliberately three outcomes, not two.
 *
 * `unknown` means the sheet answered and holds no such family. Anything that
 * stopped us from asking throws instead, because telling an invited guest
 * "we could not find your invitation" when Apps Script is merely slow is the
 * one failure this whole screen exists to avoid.
 */
export type InvitationLookup =
  | { readonly kind: 'found'; readonly family: Family; readonly answer: RsvpAnswer | null }
  | { readonly kind: 'unknown' }

export const RSVP_ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT ?? ''

/** False until VITE_RSVP_ENDPOINT is set, so nothing pretends to have asked. */
export function isRsvpConfigured(): boolean {
  return RSVP_ENDPOINT.length > 0
}

function isFamily(value: unknown): value is Family {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Partial<Family>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.guests === 'number' &&
    candidate.guests > 0
  )
}

function isAnswer(value: unknown): value is RsvpAnswer {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Partial<RsvpAnswer>
  return typeof candidate.confirmed === 'boolean' && typeof candidate.guests === 'number'
}

/**
 * Asks the sheet who this family is and what they last answered.
 *
 * One round trip carries both. Apps Script is slow enough cold that a second
 * call to fetch the answer separately would double the wait the loader covers.
 *
 * A GET with no custom headers stays a CORS "simple request", so it skips the
 * preflight Apps Script never answers — the same constraint that forces the
 * POST to send text/plain.
 *
 * Throws whenever the sheet could not be reached or did not answer in a shape
 * we recognise. Only an explicit `unknown_family` resolves.
 */
export async function fetchInvitation(familyId: string): Promise<InvitationLookup> {
  if (!isRsvpConfigured()) {
    throw new Error('VITE_RSVP_ENDPOINT is not set')
  }

  const url = `${RSVP_ENDPOINT}?familyId=${encodeURIComponent(familyId)}`
  const response = await fetch(url, { redirect: 'follow' })

  if (!response.ok) {
    throw new Error(`Invitation lookup responded ${response.status}`)
  }

  const body: unknown = await response.json()
  if (typeof body !== 'object' || body === null || !('success' in body)) {
    throw new Error('Invitation lookup returned an unrecognised body')
  }

  if (body.success !== true) {
    const error = (body as { error?: unknown }).error
    if (error === 'unknown_family') return { kind: 'unknown' }
    throw new Error(`Invitation lookup failed: ${String(error)}`)
  }

  const family = (body as { family?: unknown }).family
  if (!isFamily(family)) {
    throw new Error('Invitation lookup omitted the family')
  }

  const answer = (body as { response?: unknown }).response
  return { kind: 'found', family, answer: isAnswer(answer) ? answer : null }
}
