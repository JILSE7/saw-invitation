import type { Photo as PhotoContent } from '../../content/photos'
import { Sprig } from '../../shared/ui/Botanical'
import { useGsapContext } from '../../shared/hooks/useGsapContext'
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion'
import { gsap } from '../../shared/lib/gsap'
import styles from './Photo.module.css'

/**
 * One photograph in its clipped frame, with the scroll-scrubbed parallax.
 *
 * Shared by the single photograph and the diptych so the motion is defined in
 * one place: two frames drifting to different rules would read as a fault.
 */
function Frame({
  photo,
  priority = false,
}: {
  readonly photo: PhotoContent
  readonly priority?: boolean
}) {
  const reduced = usePrefersReducedMotion()

  const scope = useGsapContext<HTMLDivElement>(
    (_self, el) => {
      if (reduced) return
      const image = el.querySelector('img')
      if (!image) return

      // Scrubbed against scroll position rather than played on entry: the
      // photograph tracks the reader's thumb instead of running its own
      // animation past them.
      gsap.fromTo(
        image,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    },
    [reduced],
  )

  const { id, alt, width, height } = photo
  const url = (ext: string, w: number) => `/photos/${id}-${w}.${ext}`
  const set = (ext: string) => `${url(ext, 500)} 1x, ${url(ext, 1000)} 2x`

  return (
    <div ref={scope} className={styles.frame} style={{ aspectRatio: `${width} / ${height}` }}>
      <picture>
        <source type="image/avif" srcSet={set('avif')} />
        <source type="image/webp" srcSet={set('webp')} />
        <img
          className={styles.image}
          src={url('jpg', 500)}
          srcSet={set('jpg')}
          width={width}
          height={height}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
        />
      </picture>
    </div>
  )
}

type PhotoProps = {
  readonly photo: PhotoContent
  /** Set on the photograph nearest the fold so it is not lazy-loaded. */
  readonly priority?: boolean
  /** Lays a branch on the mat. Reserved for the first and last frames. */
  readonly ornament?: boolean
}

export function Photo({ photo, priority = false, ornament = false }: PhotoProps) {
  return (
    <figure className={styles.figure}>
      <div className={`${styles.mat} ${ornament ? styles.ornamented : ''}`}>
        <Frame photo={photo} priority={priority} />
        {ornament && <Sprig />}
      </div>
    </figure>
  )
}

type PhotoPairProps = {
  readonly left: PhotoContent
  readonly right: PhotoContent
  readonly ornament?: boolean
}

/**
 * Two photographs on one mat, hinged by a single gutter.
 *
 * This is for a pair shot from either side of the same moment. Side by side
 * their gazes cross the gutter and meet; stacked, the two frames only sit near
 * each other and the reader has to be told they are related. Order matters for
 * the same reason — whoever faces right belongs on the left.
 */
export function PhotoPair({ left, right, ornament = false }: PhotoPairProps) {
  return (
    <figure className={styles.figure}>
      <div className={`${styles.mat} ${styles.pairMat} ${ornament ? styles.ornamented : ''}`}>
        <div className={styles.pair}>
          <Frame photo={left} />
          <Frame photo={right} />
        </div>
        {ornament && <Sprig />}
      </div>
    </figure>
  )
}
