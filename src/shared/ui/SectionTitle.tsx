import type { ReactNode } from 'react'
import { Divider } from './Botanical'
import styles from './SectionTitle.module.css'

type SectionTitleProps = {
  readonly children: ReactNode
  /**
   * `script` is the flowing calligraphic face used for Ceremonia Religiosa.
   * `engraved` is the letter-spaced serif used for Itinerario and Regalos.
   */
  readonly variant?: 'script' | 'engraved'
  readonly as?: 'h1' | 'h2' | 'h3'
  /** Draws the botanical rule beneath the heading. */
  readonly rule?: boolean
}

export function SectionTitle({
  children,
  variant = 'script',
  as: Tag = 'h2',
  rule = false,
}: SectionTitleProps) {
  return (
    <>
      <Tag className={styles[variant]}>{children}</Tag>
      {rule && <Divider />}
    </>
  )
}
