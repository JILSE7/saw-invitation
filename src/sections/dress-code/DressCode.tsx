import { dressCode } from '../../content/invitation'
import { Icon } from '../../shared/ui/Icon'
import { Reveal } from '../../shared/ui/Reveal'
import { SectionTitle } from '../../shared/ui/SectionTitle'
import styles from './DressCode.module.css'

export function DressCode() {
  return (
    <section className={styles.section}>
      <Reveal stagger>
        <SectionTitle variant="engraved">{dressCode.title}</SectionTitle>
        <p className={styles.value}>{dressCode.value}</p>
        <div className={styles.figures}>
          <div className={styles.figure}>
            <Icon name="dress" />
          </div>
          <div className={styles.figure}>
            <Icon name="tuxedo" />
          </div>
        </div>
        <p className={styles.note}>{dressCode.note}</p>
      </Reveal>
    </section>
  )
}
