export type Track = {
  readonly title: string
  readonly artist: string
  /** Path served from /public, e.g. '/music/eres-tu.mp3'. */
  readonly src: string
}

/**
 * Drop the audio files in `public/music/` and list them here.
 * An empty list renders no player at all — a floating control with nothing
 * behind it is worse than no control.
 */
export const tracks: readonly Track[] = [
  { title: 'Eres Tú', artist: 'Carla Morrison', src: '/music/eres-tu.mp3' },
]
