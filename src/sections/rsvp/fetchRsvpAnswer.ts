import { RSVP_ENDPOINT } from './rsvpEndpoint'

export type RsvpAnswer = {
  readonly confirmed: boolean
  readonly guests: number
  readonly message: string
  /** ISO timestamp of the row this answer came from. */
  readonly at: string
}

function isAnswer(value: unknown): value is RsvpAnswer {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Partial<RsvpAnswer>
  return typeof candidate.confirmed === 'boolean' && typeof candidate.guests === 'number'
}

/**
 * Reads a family's most recent answer, or null if it has never replied.
 *
 * A GET with no custom headers stays a CORS "simple request", so it skips the
 * preflight Apps Script never answers — the same constraint that forces the
 * POST to send text/plain.
 *
 * Throws on any failure. The caller turns that into "show the form", never
 * into an error the guest has to read.
 */
export async function fetchRsvpAnswer(familyId: string): Promise<RsvpAnswer | null> {
  const url = `${RSVP_ENDPOINT}?familyId=${encodeURIComponent(familyId)}`
  const response = await fetch(url, { redirect: 'follow' })

  if (!response.ok) {
    throw new Error(`RSVP lookup responded ${response.status}`)
  }

  const body: unknown = await response.json()
  if (typeof body !== 'object' || body === null || !('success' in body) || body.success !== true) {
    throw new Error('RSVP lookup rejected the request')
  }

  const answer = (body as { response?: unknown }).response
  return isAnswer(answer) ? answer : null
}
