import { useCallback, useEffect, useState } from 'react'
import { parseAsString, useQueryState } from 'nuqs'
import { fetchInvitation, type Family, type RsvpAnswer } from '../api/invitation'

/** Query param carrying the family id: `/?familia=tio-hector`. */
export const FAMILY_PARAM = 'familia'

type Resolved =
  | { readonly state: 'found'; readonly family: Family; readonly answer: RsvpAnswer | null }
  /** The sheet answered and holds no such family: the link is wrong. */
  | { readonly state: 'unknown'; readonly family: undefined; readonly answer: null }
  /** We never got to ask. Never say "not found" for this — the guest is real. */
  | { readonly state: 'unreachable'; readonly family: undefined; readonly answer: null }

export type FamilyLookup =
  | Resolved
  /** No `?familia=` in the URL — someone reached the invitation directly. */
  | { readonly state: 'absent'; readonly family: undefined; readonly answer: null }
  /** Asking the sheet. The loader covers this. */
  | { readonly state: 'loading'; readonly family: undefined; readonly answer: null }

const ABSENT = { state: 'absent', family: undefined, answer: null } as const
const LOADING = { state: 'loading', family: undefined, answer: null } as const
const UNKNOWN = { state: 'unknown', family: undefined, answer: null } as const
const UNREACHABLE = { state: 'unreachable', family: undefined, answer: null } as const

/**
 * Resolves the family from the URL against the sheet.
 *
 * The id is a query param — not a path segment — which keeps this a plain
 * static site: no router, and no host rewrite rules to stop deep links from
 * 404ing.
 *
 * `retry` exists because `unreachable` is the one failure a guest can act on:
 * Apps Script cold starts and quota blips clear on a second attempt, and
 * asking them to reload loses the query param on some clients.
 */
export function useFamily(): FamilyLookup & { readonly retry: () => void } {
  const [raw] = useQueryState(FAMILY_PARAM, parseAsString)
  const id = raw?.trim() ?? ''

  const [resolved, setResolved] = useState<Resolved | null>(null)
  const [trackedId, setTrackedId] = useState(id)
  const [attempt, setAttempt] = useState(0)

  // Clearing on a changed id during render, rather than from an effect, means
  // a stale family is never rendered for one frame under the new link.
  if (trackedId !== id) {
    setTrackedId(id)
    setResolved(null)
  }

  const retry = useCallback(() => {
    setResolved(null)
    setAttempt((n) => n + 1)
  }, [])

  useEffect(() => {
    if (!id) return

    let current = true

    fetchInvitation(id)
      .then((result) => {
        if (!current) return
        setResolved(
          result.kind === 'found'
            ? { state: 'found', family: result.family, answer: result.answer }
            : UNKNOWN,
        )
      })
      .catch(() => {
        if (current) setResolved(UNREACHABLE)
      })

    // StrictMode runs this twice; the flag stops the first, discarded request
    // from landing after the second and overwriting it.
    return () => {
      current = false
    }
  }, [id, attempt])

  const lookup: FamilyLookup = !id ? ABSENT : (resolved ?? LOADING)
  return { ...lookup, retry }
}
