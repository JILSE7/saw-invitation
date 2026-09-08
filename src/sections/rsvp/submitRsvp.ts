import { RSVP_ENDPOINT } from '../../shared/api/invitation'

export const MESSAGE_MAX_LENGTH = 500

export type RsvpRequest = {
  familyId: string
  familyName: string
  confirmed: boolean
  guests: number
  message?: string
}

/**
 * Posts one confirmation to the Google Apps Script web app.
 *
 * The `text/plain` content type is deliberate. It keeps this a CORS "simple
 * request", which skips the OPTIONS preflight — and Apps Script never answers
 * a preflight, so `application/json` fails before the request leaves the
 * browser. The body is still JSON; `doPost` parses `e.postData.contents`.
 *
 * `no-cors` is not an option here: it yields an opaque response, so a
 * successful write would be indistinguishable from a failed one.
 */
export async function submitRsvp(data: RsvpRequest): Promise<void> {
  const response = await fetch(RSVP_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data),
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`RSVP endpoint responded ${response.status}`)
  }

  const result: unknown = await response.json()
  if (typeof result !== 'object' || result === null || !('success' in result) || result.success !== true) {
    throw new Error('RSVP endpoint rejected the submission')
  }
}
