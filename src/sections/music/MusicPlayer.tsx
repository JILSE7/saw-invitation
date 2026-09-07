import { tracks } from '../../content/music'
import styles from './MusicPlayer.module.css'
import { useAudioPlayer } from './useAudioPlayer'

const NOTICE: Partial<Record<ReturnType<typeof useAudioPlayer>['status'], string>> = {
  blocked: 'Tocá de nuevo para reproducir',
  error: 'No se pudo cargar la canción',
}

export function MusicPlayer() {
  const { audioRef, current, status, isPlaying, toggle, next } = useAudioPlayer()

  // No tracks configured means no control at all.
  if (!current) return null

  const notice = NOTICE[status]

  return (
    <div className={styles.player}>
      <audio ref={audioRef} src={current.src} preload="none" />

      <button
        type="button"
        className={styles.control}
        onClick={toggle}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'Pausar la música' : 'Reproducir la música'}
      >
        <svg className={`${styles.icon} ${isPlaying ? styles.spinning : ''}`} viewBox="0 0 16 16">
          {isPlaying ? (
            <path d="M5 2h2v12H5zM9 2h2v12H9z" />
          ) : (
            <path d="M4 2l10 6-10 6z" />
          )}
        </svg>
      </button>

      <div className={styles.meta}>
        {notice ? (
          <span className={styles.notice}>{notice}</span>
        ) : (
          <>
            <span className={styles.title}>{current.title}</span>
            <span className={styles.artist}>{current.artist}</span>
          </>
        )}
      </div>

      {tracks.length > 1 && (
        <button type="button" className={styles.skip} onClick={next} aria-label="Siguiente canción">
          <svg className={styles.icon} viewBox="0 0 16 16">
            <path d="M3 2l8 6-8 6zM12 2h2v12h-2z" />
          </svg>
        </button>
      )}
    </div>
  )
}
