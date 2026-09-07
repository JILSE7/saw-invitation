import { parseAsString, useQueryState } from 'nuqs'
import { findFamily, type Family } from '../../content/families'

/** Query param carrying the family id: `/?familia=garcia`. */
export const FAMILY_PARAM = 'familia'

export type FamilyLookup =
  /** No `?familia=` in the URL — someone reached the invitation directly. */
  | { state: 'absent'; family: undefined }
  /** A `?familia=` that matches no entry in the guest list. */
  | { state: 'unknown'; family: undefined }
  | { state: 'found'; family: Family }

/**
 * Reads the family from the URL. A query param — not a path segment — keeps
 * this a plain static site: no router, and no host rewrite rules to stop deep
 * links from 404ing.
 */
export function useFamily(): FamilyLookup {
  const [raw] = useQueryState(FAMILY_PARAM, parseAsString)
  const id = raw?.trim() ?? ''

  if (!id) return { state: 'absent', family: undefined }

  const family = findFamily(id)
  return family ? { state: 'found', family } : { state: 'unknown', family: undefined }
}
