import { voiceFor, type Family } from '../../shared/api/invitation'
import { couple, envelope, intro, weddingDate } from '../../content/invitation'
import { CornerVine } from '../../shared/ui/Botanical'
import { useGsapContext } from '../../shared/hooks/useGsapContext'
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion'
import { gsap } from '../../shared/lib/gsap'
import styles from './Hero.module.css'

type HeroProps = {
  /** Undefined when the invitation was opened without a personal link. */
  family: Family | undefined
}

export function Hero({ family }: HeroProps) {
  const reduced = usePrefersReducedMotion()
  const voice = voiceFor(family)

  const scope = useGsapContext<HTMLElement>(
    (self) => {
      if (reduced) return

      const q = self.selector as (s: string) => HTMLElement[]
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Animating *from* the sealed position means the CSS resting state is
      // the opened envelope: if this timeline never runs, the invitation is
      // still readable instead of stuck shut.
      timeline
        .from(q('.' + styles.flap), { rotateX: 180, duration: 1.1, ease: 'power2.inOut' })
        .from(q('.' + styles.card), { y: 46, opacity: 0, duration: 0.9 }, '-=0.5')
        .from(
          q(['.' + styles.eyebrow, '.' + styles.names, '.' + styles.body, '.' + styles.dateBar].join(', ')),
          { y: 18, opacity: 0, duration: 0.7, stagger: 0.12 },
          '-=0.55',
        )

      // Guarded: with no family in the URL the element is absent, and GSAP
      // warns about a tween with no targets.
      const addressee = q('.' + styles.addressee)
      if (addressee.length > 0) {
        timeline.from(addressee, { opacity: 0, duration: 0.8 }, '-=0.4')
      }
    },
    [reduced, family],
  )

  return (
    <header ref={scope} className={styles.hero}>
      <div className={styles.envelope}>
        <div className={styles.flap} aria-hidden="true" />
        <div className={styles.back} aria-hidden="true" />

        <article className={styles.card}>
          <CornerVine at="topStart" />
          <CornerVine at="topEnd" />

          <p className={styles.eyebrow}>{intro.eyebrow}</p>

          <h1 className={styles.names}>
            {couple.first}
            <span className={styles.ampersand}>&amp;</span>
            {couple.second}
          </h1>

          <p className={styles.body}>{intro.body[voice]}</p>

          <p className={styles.dateBar}>
            <span>{weddingDate.weekday}</span>
            <span className={styles.day}>
              <span className={styles.month}>{weddingDate.month}</span>
              {weddingDate.day}
              <span className={styles.month}>{weddingDate.year}</span>
            </span>
            <span>{weddingDate.time}</span>
          </p>
        </article>

        <div className={styles.pocket} aria-hidden="true" />

        {family && (
          <p className={styles.addressee}>
            <span className={styles.addresseeLabel}>{envelope.addresseeLabel}</span>
            <span className={styles.addresseeName}>{family.name}</span>
          </p>
        )}
      </div>
    </header>
  )
}
