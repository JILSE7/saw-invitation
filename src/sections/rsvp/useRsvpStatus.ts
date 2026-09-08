import { useEffect, useState } from 'react'
import { fetchRsvpAnswer, type RsvpAnswer } from './fetchRsvpAnswer'
import { isRsvpConfigured } from './rsvpEndpoint'

export type RsvpLookup =
  | { readonly state: 'checking'; readonly answer: null }
  | { readonly state: 'ready'; readonly answer: RsvpAnswer | null }

/**
 * Asks the sheet whether this family has already replied.
 *
 * The lookup is deliberately server-side. localStorage would answer instantly
 * and for free, but only for the device that confirmed: a guest who replied on
 * their phone and later opened the link on a laptop would be told they had not
 * confirmed. A wrong "no" is worse than no check at all.
 *
 * Every failure resolves to `answer: null`, which shows the form. If the sheet
 * is slow, unreachable or not configured yet, a guest must still be able to
 * confirm — and because Responses is append-only, a duplicate row is
 * recoverable in a way a missed confirmation is not.
 *
 * Nothing here resets the state when `familyId` changes; the caller remounts
 * on key instead, which is the one way to be sure a stale answer cannot
 * outlive the family it belonged to.
 */
export function useRsvpStatus(familyId: string): RsvpLookup {
  const [lookup, setLookup] = useState<RsvpLookup>(() =>
    isRsvpConfigured() ? { state: 'checking', answer: null } : { state: 'ready', answer: null },
  )

  useEffect(() => {
    if (!isRsvpConfigured()) return

    let current = true

    fetchRsvpAnswer(familyId)
      .then((answer) => {
        if (current) setLookup({ state: 'ready', answer })
      })
      .catch(() => {
        if (current) setLookup({ state: 'ready', answer: null })
      })

    // StrictMode runs this twice; the flag stops the first, discarded request
    // from landing after the second and overwriting it.
    return () => {
      current = false
    }
  }, [familyId])

  return lookup
}
