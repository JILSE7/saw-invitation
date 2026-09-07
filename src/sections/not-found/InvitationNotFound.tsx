import { notFound } from '../../content/invitation'
import styles from './InvitationNotFound.module.css'

/**
 * Shown when `?familia=` names nobody in the guest list. Deliberately plain:
 * a guest with a mistyped link should see a warm dead end, not a stack trace.
 */
export function InvitationNotFound() {
  return (
    <main className={styles.section}>
      <div className={styles.card}>
        <h1 className={styles.title}>{notFound.title}</h1>
        <p className={styles.body}>{notFound.body}</p>
      </div>
    </main>
  )
}
