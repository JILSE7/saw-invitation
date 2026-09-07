/**
 * The guest list. One entry per invited family, resolved from the `familia`
 * query param (see `useFamily`).
 *
 * This file ships inside the JS bundle, so treat it as public: anyone who
 * opens DevTools can read every family and its pass count. Keep phone numbers,
 * addresses and anything else private out of here.
 */

export type Family = {
  /** Unique. Travels in the invitation URL as `?familia=<id>`. */
  id: string
  /** Shown on the invitation and recorded with the RSVP. */
  name: string
  /** Maximum number of people this family may confirm. */
  guests: number
}

// TODO(provide): replace with the real guest list before sharing any link.
export const families: readonly Family[] = [
  { id: 'garcia', name: 'Familia García', guests: 4 },
  { id: 'lopez', name: 'Familia López', guests: 2 },
]

export function findFamily(id: string): Family | undefined {
  return families.find((family) => family.id === id)
}
