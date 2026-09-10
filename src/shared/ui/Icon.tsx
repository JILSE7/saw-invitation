import type { ReactNode } from 'react'
import styles from './Icon.module.css'

/**
 * Hand-drawn line art, redrawn as SVG because the original Canva artwork is
 * unavailable.
 *
 * Every glyph lives on a 48x48 grid, is stroke-only, and inherits its colour
 * from `currentColor`, so a section restyles its icons by changing text
 * colour alone. `vector-effect: non-scaling-stroke` keeps the line weight
 * identical whether a glyph renders at 48px or 96px — scaling the SVG would
 * otherwise thicken the stroke and break the family's consistency.
 */
const GLYPHS = {
  /** Ceremonia — two bands and a solitaire. */
  rings: (
    <>
      <circle cx="19" cy="30" r="10" />
      <circle cx="31" cy="30" r="10" />
      <path d="M19 20 L15.4 16 L19 12 L22.6 16 Z" />
    </>
  ),
  /**
   * Recepción — a bare arch on the ground line.
   *
   * Everything added to the crown failed at 66px: a draped curve closed the
   * silhouette into an envelope, and shoulder leaves read as ears. At this
   * size the plain structure is the only version that stays an arch.
   */
  arch: (
    <>
      <path d="M13 40 V25 A11 11 0 0 1 35 25 V40" />
      <path d="M9 40 H39" />
    </>
  ),
  /**
   * Brindis — two flutes meeting at the rim.
   *
   * The bowls are narrow on purpose: widen them and the pair reads as two
   * fans rather than glassware.
   */
  toast: (
    <g>
      <g transform="translate(20.5 10) rotate(-16)">
        <path d="M-2.6 0 H2.6 L1.3 12 Q0 14.4 -1.3 12 Z" />
        <path d="M0 14.4 V25" />
        <path d="M-3.2 25 H3.2" />
      </g>
      <g transform="translate(27.5 10) rotate(16)">
        <path d="M-2.6 0 H2.6 L1.3 12 Q0 14.4 -1.3 12 Z" />
        <path d="M0 14.4 V25" />
        <path d="M-3.2 25 H3.2" />
      </g>
    </g>
  ),
  /** Vals — a single quaver. */
  waltz: (
    <>
      <ellipse cx="19" cy="33" rx="4.4" ry="3.3" transform="rotate(-20 19 33)" />
      <path d="M23 31.6 V13" />
      <path d="M23 13 C29.5 15 31 20.5 27.5 24" />
    </>
  ),
  /** Cena — a plate between the cutlery. */
  dinner: (
    <>
      <circle cx="24" cy="25" r="10" />
      <circle cx="24" cy="25" r="6.2" />
      <path d="M7.4 10 V16 M10 10 V16 M12.6 10 V16" />
      <path d="M7.4 16 Q10 19.8 12.6 16" />
      <path d="M10 19.8 V39" />
      <path d="M37 10 C39.8 13.4 39.8 18.6 37 22 Z" />
      <path d="M37 22 V39" />
    </>
  ),
  /** Baile — a beamed pair of quavers. */
  dance: (
    <>
      <ellipse cx="16" cy="34" rx="4.2" ry="3.2" transform="rotate(-20 16 34)" />
      <ellipse cx="29" cy="31" rx="4.2" ry="3.2" transform="rotate(-20 29 31)" />
      <path d="M20 32.7 V15" />
      <path d="M33 29.7 V12" />
      <path d="M20 15 C24.5 12.6 28.8 11.8 33 12" />
    </>
  ),
  /**
   * Ramo — three blossoms over a bound stem.
   *
   * The flower centres and the wrap carry the whole read. Three plain circles
   * on converging lines are balloons on strings, and a bunch of balloons is
   * the one thing that never has a band tied around its handle.
   *
   * Leaves were drawn at the stems first and had to go: at 66px they thinned
   * into two dashes that read as wings, and they pushed the glyph darker than
   * anything else in the family. The blossoms carry the foliage instead by
   * being wide enough to fill the frame the way its neighbours do.
   */
  bouquet: (
    <>
      <circle cx="24" cy="12.6" r="6.2" />
      <circle cx="24" cy="12.6" r="1.9" />
      <circle cx="13" cy="20.6" r="5.6" />
      <circle cx="13" cy="20.6" r="1.7" />
      <circle cx="35" cy="20.6" r="5.6" />
      <circle cx="35" cy="20.6" r="1.7" />
      <path d="M24 18.8 V29.6" />
      <path d="M16.2 25.2 Q19.8 27.6 21.6 29.6" />
      <path d="M31.8 25.2 Q28.2 27.6 26.4 29.6" />
      <path d="M19 29.6 H29 V34.2 H19 Z" />
      <path d="M20.8 34.2 L18.6 41.4" />
      <path d="M24 34.2 V42" />
      <path d="M27.2 34.2 L29.4 41.4" />
    </>
  ),
  /** Código de vestimenta — an A-line gown. */
  dress: (
    <>
      <path d="M19 9 L24 13.5 L29 9" />
      <path d="M19 9 L16 17 L18.6 19.4 L13 39 H35 L29.4 19.4 L32 17 L29 9" />
      <path d="M18.6 19.4 C22 21 26 21 29.4 19.4" />
    </>
  ),
  /**
   * Código de vestimenta — a dinner jacket.
   *
   * The lapels stay as two near-vertical lines with the shirt opening drawn
   * separately. Converging them on a single point turns the chest into a
   * spearhead.
   */
  tuxedo: (
    <>
      <path d="M19 10 L12.5 13.5 L11.5 39 H36.5 L35.5 13.5 L29 10" />
      <path d="M19 10 L24 20 L29 10" />
      <path d="M20.6 10.6 L21 23.5" />
      <path d="M27.4 10.6 L27 23.5" />
      <path d="M21.6 11 L24 13 L26.4 11 L26.4 15 L24 13 L21.6 15 Z" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof GLYPHS

export function Icon({ name }: { readonly name: IconName }) {
  return (
    <svg className={styles.icon} viewBox="0 0 48 48" role="presentation" aria-hidden="true">
      {GLYPHS[name]}
    </svg>
  )
}
