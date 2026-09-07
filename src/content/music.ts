export type Track = {
  readonly title: string
  readonly artist: string
  /** Path served from /public, e.g. '/music/nuestra-cancion.mp3'. */
  readonly src: string
}

/**
 * Drop the audio files in `public/music/` and list them here.
 * An empty list renders no player at all — a floating control with nothing
 * behind it is worse than no control.
 */
export const tracks: readonly Track[] = [
  // TODO(provide): { title: 'Nuestra canción', artist: '—', src: '/music/nuestra-cancion.mp3' },
]
