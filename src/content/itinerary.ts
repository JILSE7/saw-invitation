import type { IconName } from '../shared/ui/Icon'

/**
 * The running order of the day. Edit this array to add, remove or reorder a
 * moment — the section renders whatever is here, and nothing else needs to
 * change.
 *
 * Position drives layout: entries alternate sides of the dashed spine by
 * index, so moving an entry also moves which side it sits on.
 */

export type ItineraryItem = {
  /** Name of the moment, rendered in caps. */
  readonly label: string
  /** Leave empty to render the moment without a time. */
  readonly time: string
  /**
   * One of the glyphs registered in src/shared/ui/Icon.tsx:
   * rings · arch · toast · waltz · dinner · dance · bouquet · dress · tuxedo
   * Adding a new one means adding its path there first.
   */
  readonly icon: IconName
}

export const itineraryTitle = 'Itinerario'

// Times confirmed by the couple. The labels are still the ones read off the
// low-resolution preview: check those against the full-size source PNG.
export const itinerary: readonly ItineraryItem[] = [
  { label: 'Ceremonia', time: '5:00 PM', icon: 'rings' },
  { label: 'Recepción', time: '6:30 PM', icon: 'arch' },
  { label: 'Brindis', time: '7:00 PM', icon: 'toast' },
  { label: 'Cena', time: '7:30 PM', icon: 'dinner' },
  { label: 'Vals', time: '9:00 PM', icon: 'waltz' },
  { label: 'Ramo', time: '10:00 PM', icon: 'bouquet' },
]
