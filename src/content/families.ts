/**
 * The guest list. One entry per invited family, resolved from the `familia`
 * query param (see `useFamily`).
 *
 * This file ships inside the JS bundle, so treat it as public: anyone who
 * opens DevTools can read every family and its pass count. Keep phone numbers,
 * addresses and anything else private out of here.
 *
 * `id` travels in the invitation URL and is what a guest sees and forwards, so
 * it stays short and readable. `guests` is the pass ceiling, but the copy that
 * decides it lives in the Families sheet the Apps Script reads — this one is
 * editable from the browser.
 */

export type Family = {
  /** Unique. Travels in the invitation URL as `?familia=<id>`. */
  id: string
  /** Shown on the invitation and recorded with the RSVP. */
  name: string
  /** Maximum number of people this family may confirm. */
  guests: number
}

export const families: readonly Family[] = [
  // Familia — 20 pases
  { id: 'tio-aaron', name: 'Tío Aarón', guests: 4 },
  { id: 'tio-oscar', name: 'Tío Óscar', guests: 4 },
  { id: 'tia-elena', name: 'Tía Elena', guests: 4 },
  { id: 'pao', name: 'Pao', guests: 2 },
  { id: 'tia-pera', name: 'Tía Pera', guests: 2 },
  // TODO(provide): both columns of the planning sheet list a MAMA. These two
  // ids must say whose before any link goes out — a collision here sends one
  // mother the other's invitation and the wrong pass count.
  { id: 'mama-1', name: 'Mamá', guests: 4 },

  // Amigos — 21 pases
  { id: 'liss', name: 'Liss', guests: 2 },
  { id: 'gina', name: 'Gina', guests: 1 },
  { id: 'aldrin', name: 'Aldrin', guests: 1 },
  { id: 'robert', name: 'Robert', guests: 2 },
  { id: 'andi', name: 'Andi', guests: 2 },
  { id: 'jazmin', name: 'Jazmín', guests: 2 },
  { id: 'bere', name: 'Bere', guests: 2 },
  { id: 'eva', name: 'Eva', guests: 2 },
  { id: 'guera', name: 'Güera', guests: 2 },
  { id: 'evelyn', name: 'Evelyn', guests: 2 },
  { id: 'santi', name: 'Santi', guests: 1 },
  { id: 'sujey', name: 'Sujey', guests: 2 },

  // Amigos en común — 6 pases
  { id: 'salvador', name: 'Salvador', guests: 2 },
  { id: 'sergio', name: 'Sergio', guests: 2 },
  { id: 'belem', name: 'Belem', guests: 2 },

  // Familia — 35 pases
  { id: 'maria-de-jesus', name: 'María de Jesús', guests: 5 },
  { id: 'tia-flor', name: 'Tía Flor', guests: 4 },
  { id: 'tia-matilde', name: 'Tía Matilde', guests: 4 },
  { id: 'tia-nati', name: 'Tía Nati', guests: 4 },
  { id: 'tio-hector', name: 'Tío Héctor', guests: 8 },
  { id: 'tia-clau', name: 'Tía Clau', guests: 2 },
  { id: 'tio-joselito', name: 'Tío Joselito', guests: 4 },
  // TODO(provide): see the note above.
  { id: 'mama-2', name: 'Mamá', guests: 4 },

  // Amigos — 20 pases
  { id: 'sebas', name: 'Sebas', guests: 2 },
  { id: 'hector', name: 'Héctor', guests: 2 },
  { id: 'dho', name: 'Dho', guests: 2 },
  { id: 'erick', name: 'Erick', guests: 4 },
  { id: 'tavo', name: 'Tavo', guests: 2 },
  { id: 'ramses', name: 'Ramsés', guests: 2 },
  { id: 'sherwin', name: 'Sherwin', guests: 2 },
  { id: 'caro-y-memo', name: 'Caro y Memo', guests: 4 },
]

export function findFamily(id: string): Family | undefined {
  return families.find((family) => family.id === id)
}
