import type { ReactNode } from 'react'
import styles from './SectionTitle.module.css'

type SectionTitleProps = {
  readonly children: ReactNode
  /**
   * `script` is the flowing calligraphic face used for Ceremonia Religiosa.
   * `engraved` is the letter-spaced serif used for Itinerario and Regalos.
   */
  readonly variant?: 'script' | 'engraved'
  readonly as?: 'h1' | 'h2' | 'h3'
}

export function SectionTitle({ children, variant = 'script', as: Tag = 'h2' }: SectionTitleProps) {
  return <Tag className={styles[variant]}>{children}</Tag>
}
