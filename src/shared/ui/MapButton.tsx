import styles from './MapButton.module.css'

type MapButtonProps = {
  readonly href: string
  readonly label?: string
}

/**
 * Renders a real outbound link, or a visibly inert placeholder when the URL
 * has not been supplied yet. A wedding invitation must never ship a link that
 * looks live and goes nowhere.
 */
export function MapButton({ href, label = 'Ver mapa' }: MapButtonProps) {
  if (!href) {
    return (
      <span className={styles.pending} aria-disabled="true">
        {label}
      </span>
    )
  }

  return (
    <a className={styles.button} href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}
