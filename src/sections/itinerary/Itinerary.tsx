import { itinerary } from '../../content/invitation'
import { Icon } from '../../shared/ui/Icon'
import { Reveal } from '../../shared/ui/Reveal'
import { SectionTitle } from '../../shared/ui/SectionTitle'
import styles from './Itinerary.module.css'

export function Itinerary() {
  return (
    <section className={styles.section}>
      <SectionTitle variant="engraved" rule>
        Itinerario
      </SectionTitle>

      <Reveal stagger>
        <ol className={styles.list}>
          {itinerary.map((item) => (
            <li key={item.label} className={styles.item}>
              <div className={styles.icon}>
                <Icon name={item.icon} />
              </div>
              <div className={styles.copy}>
                <p className={styles.label}>{item.label}</p>
                {item.time && <p className={styles.time}>{item.time}</p>}
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}
