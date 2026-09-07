import { dressCode } from '../../content/invitation'
import { Reveal } from '../../shared/ui/Reveal'
import { SectionTitle } from '../../shared/ui/SectionTitle'
import styles from './DressCode.module.css'

export function DressCode() {
  return (
    <section className={styles.section}>
      <Reveal stagger>
        <SectionTitle variant="engraved">{dressCode.title}</SectionTitle>
        <p className={styles.value}>{dressCode.value}</p>
        <div className={styles.figures} aria-hidden="true">
          <div className={styles.figure} data-icon="dress" />
          <div className={styles.figure} data-icon="tuxedo" />
        </div>
        <p className={styles.note}>{dressCode.note}</p>
      </Reveal>
    </section>
  )
}
