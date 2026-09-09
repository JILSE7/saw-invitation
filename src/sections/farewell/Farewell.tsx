import { farewell, rsvp } from '../../content/invitation'
import { voiceFor, type Family } from '../../shared/api/invitation'
import { CornerVine } from '../../shared/ui/Botanical'
import { Reveal } from '../../shared/ui/Reveal'
import styles from './Farewell.module.css'

type FarewellProps = {
  /** Undefined when the invitation was opened without a personal link. */
  readonly family: Family | undefined
}

/**
 * The last block of the invitation.
 *
 * It carries the same paper card and botanical corners as the hero, so the
 * document opens and closes on the same note instead of trailing off after
 * the final photograph.
 *
 * The monogram signs off at the bottom rather than heading the card, which is
 * what a monogram is for. It also spells the couple and the date itself, so
 * setting either in type here would say the same thing twice — once in the
 * mark and once beneath it.
 */
export function Farewell({ family }: FarewellProps) {
  const voice = voiceFor(family)

  return (
    <section className={styles.section}>
      <Reveal className={styles.card}>
        <CornerVine at="bottomStart" />
        <CornerVine at="bottomEnd" />

        <p className={styles.eyebrow}>{farewell.eyebrow[voice]}</p>
        <p className={styles.greeting}>{farewell.greeting(family?.name)}</p>
        <p className={styles.body}>{farewell.body[voice]}</p>

        <p className={styles.confirm}>{farewell.confirm[voice](rsvp.deadlineLabel)}</p>

        <p className={styles.signoff}>{farewell.signoff}</p>
        <img
          className={styles.mark}
          src="/photos/logo-640.webp"
          alt={farewell.markAlt}
          width={462}
          height={640}
          loading="lazy"
        />
      </Reveal>
    </section>
  )
}
