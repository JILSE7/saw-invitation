import { weddingDate } from '../../content/invitation'
import { useCountdown } from '../../shared/hooks/useCountdown'
import styles from './Countdown.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

export function Countdown() {
  const { days, hours, minutes, seconds, isPast } = useCountdown(weddingDate.iso)

  if (isPast) {
    return (
      <section className={styles.band}>
        <p className={styles.past}>¡Hoy nos casamos!</p>
      </section>
    )
  }

  const units = [
    { label: 'Días', value: String(days) },
    { label: 'Horas', value: pad(hours) },
    { label: 'Minutos', value: pad(minutes) },
    { label: 'Segundos', value: pad(seconds) },
  ]

  return (
    <section className={styles.band} aria-label="Cuenta regresiva">
      {/* Announcing every tick would make a screen reader unusable. */}
      <div className={styles.grid} aria-live="off">
        {units.map(({ label, value }) => (
          <p key={label} className={styles.unit}>
            <span className={styles.value}>{value}</span>
            <span className={styles.label}>{label}</span>
          </p>
        ))}
      </div>
    </section>
  )
}
