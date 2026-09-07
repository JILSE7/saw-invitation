export type Photo = {
  /** Basename of the derivatives in /public/photos, built by scripts/photos.sh. */
  readonly id: string
  readonly alt: string
  /** Intrinsic size of the 1x file. Drives the frame's aspect ratio. */
  readonly width: number
  readonly height: number
}

/**
 * Five photographs for the five breaks the source design puts between
 * sections. Each one is cropped to a different ratio: five 2:3 portraits down
 * one page reads as a contact sheet, not as a design.
 */
export const photos = {
  ring: {
    id: 'ring',
    alt: 'Said abraza a Alina mientras ella muestra su anillo de compromiso a la cámara.',
    width: 500,
    height: 625,
  },
  water: {
    id: 'water',
    alt: 'Said y Alina sentados junto al agua, frente a una escalinata de piedra.',
    width: 500,
    height: 333,
  },
  bench: {
    id: 'bench',
    alt: 'Said y Alina tomados de las manos, sentados frente a frente en una banca del parque.',
    width: 500,
    height: 281,
  },
  walking: {
    id: 'walking',
    alt: 'Alina sonríe mientras Said la lleva de la mano entre los árboles.',
    width: 500,
    height: 625,
  },
  dock: {
    id: 'dock',
    alt: 'Said y Alina de espaldas, sentados en un muelle de madera mirando el agua.',
    width: 500,
    height: 625,
  },
} as const satisfies Record<string, Photo>
