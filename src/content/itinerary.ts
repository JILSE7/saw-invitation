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
   * rings · arch · toast · waltz · dinner · dance · dress · tuxedo
   * Adding a new one means adding its path there first.
   */
  readonly icon: IconName
}

export const itineraryTitle = 'Itinerario'

// TODO(transcribe): confirm every label and time against the source PNG.
export const itinerary: readonly ItineraryItem[] = [
  { label: 'Ceremonia', time: '5:00 PM', icon: 'rings' },
  { label: 'Recepción', time: '6:30 PM', icon: 'arch' },
  { label: 'Brindis', time: '7:30 PM', icon: 'toast' },
  { label: 'Vals', time: '8:00 PM', icon: 'waltz' },
  { label: 'Cena', time: '9:00 PM', icon: 'dinner' },
  { label: 'Baile', time: '11:00 PM', icon: 'dance' },
]
