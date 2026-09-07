import { Reveal } from '../../shared/ui/Reveal'
import { SectionTitle } from '../../shared/ui/SectionTitle'
import styles from './Statement.module.css'

type StatementProps = {
  readonly title?: string
  readonly body: string
  readonly closing?: string
  /**
   * `framed` draws the ornamental rule used by the Regalos card.
   * `tinted` paints the lavender ground used by the closing block.
   */
  readonly variant?: 'plain' | 'framed' | 'tinted'
}

/**
 * Gifts, adults-only, limited passes and the closing note are the same block
 * in the source design: a centred paragraph with optional heading and
 * sign-off. One component, four pieces of content.
 */
export function Statement({ title, body, closing, variant = 'plain' }: StatementProps) {
  const className = [styles.section, variant !== 'plain' && styles[variant]]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={className}>
      <Reveal className={styles.inner} stagger>
        {title && <SectionTitle variant="engraved">{title}</SectionTitle>}
        <p className={styles.body}>{body}</p>
        {closing && <p className={styles.closing}>{closing}</p>}
      </Reveal>
    </section>
  )
}
