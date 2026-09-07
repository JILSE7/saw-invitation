import { venues } from '../../content/invitation'
import { MapButton } from '../../shared/ui/MapButton'
import { Reveal } from '../../shared/ui/Reveal'
import { SectionTitle } from '../../shared/ui/SectionTitle'
import styles from './Venues.module.css'

export function Venues() {
  return (
    <section className={styles.section}>
      {venues.map((venue) => (
        <Reveal key={venue.kind} className={styles.venue}>
          <SectionTitle>{venue.title}</SectionTitle>
          <p className={styles.time}>Hora {venue.time}</p>
          {venue.place && <p className={styles.place}>{venue.place}</p>}
          {venue.address && <address className={styles.address}>{venue.address}</address>}
          <MapButton href={venue.mapUrl} />
        </Reveal>
      ))}
    </section>
  )
}
