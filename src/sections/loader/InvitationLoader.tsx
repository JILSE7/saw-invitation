import { loader } from '../../content/invitation'
import { useGsapContext } from '../../shared/hooks/useGsapContext'
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion'
import { gsap } from '../../shared/lib/gsap'
import styles from './InvitationLoader.module.css'

/**
 * Covers the wait while the sheet is asked who this family is.
 *
 * The monogram is the whole screen on purpose: the guest is opening an
 * invitation, and a spinner would say "an app is working" where this says
 * "something is about to be given to you".
 *
 * Every animated property has a resting value in CSS, so a guest on reduced
 * motion — or one whose timeline never runs — still sees a composed screen
 * rather than an invisible one.
 */
export function InvitationLoader() {
  const reduced = usePrefersReducedMotion()

  const scope = useGsapContext<HTMLDivElement>(
    (self) => {
      if (reduced) return

      const q = self.selector as (s: string) => HTMLElement[]

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(q('.' + styles.mark), { opacity: 0, scale: 0.94, duration: 1 })
        .from(q('.' + styles.label), { opacity: 0, y: 10, duration: 0.7 }, '-=0.5')
        // The rule sweeps rather than fills: a determinate bar would be a lie,
        // since Apps Script never says how far along it is.
        .fromTo(
          q('.' + styles.sweep),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: 'power2.inOut', repeat: -1, repeatDelay: 0.15, yoyo: true },
          '-=0.35',
        )

      // A slow breath under the whole mark, independent of the sweep so the
      // two never land on the same beat.
      gsap.to(q('.' + styles.mark), {
        scale: 1.025,
        duration: 2.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    },
    [reduced],
  )

  return (
    <div ref={scope} className={styles.screen} role="status" aria-live="polite">
      <img
        className={styles.mark}
        src="/photos/logo-640.webp"
        alt=""
        width={462}
        height={640}
        // The loader is the first paint: nothing else is competing for the
        // connection, and a lazy mark would arrive after the wait it covers.
        fetchPriority="high"
      />
      <p className={styles.label}>{loader.label}</p>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.sweep} />
      </span>
    </div>
  )
}
