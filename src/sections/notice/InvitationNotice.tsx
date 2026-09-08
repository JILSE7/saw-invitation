import styles from './InvitationNotice.module.css'

type InvitationNoticeProps = {
  readonly title: string
  readonly body: string
  /** Rendered only when the guest has something useful to do about it. */
  readonly action?: { readonly label: string; readonly onClick: () => void }
}

/**
 * A full-screen dead end.
 *
 * Deliberately plain: a guest whose link is wrong, or whose connection
 * dropped, should meet a warm sentence rather than a stack trace.
 */
export function InvitationNotice({ title, body, action }: InvitationNoticeProps) {
  return (
    <main className={styles.section}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.body}>{body}</p>
        {action && (
          <button type="button" className={styles.action} onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </main>
  )
}
