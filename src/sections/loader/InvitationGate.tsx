import { intro } from '../../content/invitation'
import styles from './InvitationGate.module.css'

type InvitationGateProps = {
  onOpen: () => void
}

export function InvitationGate({ onOpen }: InvitationGateProps) {
  return (
    <main className={styles.screen}>
      <section className={styles.card} aria-labelledby="invitation-gate-title">
        <img className={styles.mark} src="/photos/logo-640.webp" alt="" width={462} height={640} />
        <p className={styles.eyebrow}>{intro.eyebrow}</p>
        <button className={styles.action} type="button" onClick={onOpen}>
          Abrir invitación
        </button>
      </section>
    </main>
  )
}
