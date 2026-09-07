import styles from './Botanical.module.css'

/**
 * One leaf, drawn once and reused everywhere.
 *
 * It sits with its base on the origin and its tip nine units straight up, so
 * a caller places it with `translate(x y) rotate(deg)` and never has to
 * rewrite the curve. Every ornament below is this shape repeated.
 */
const LEAF = 'M0 0 C-2.4 -2.8 -2.4 -6.4 0 -9 C2.4 -6.4 2.4 -2.8 0 0 Z'

type Placed = { readonly x: number; readonly y: number; readonly angle: number; readonly scale?: number }

function Leaves({ items }: { readonly items: readonly Placed[] }) {
  return (
    <>
      {items.map(({ x, y, angle, scale = 1 }) => (
        <g key={`${x}-${y}-${angle}`} transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
          <path d={LEAF} />
        </g>
      ))}
    </>
  )
}

/**
 * A rule broken by a sprig on each side of a small lozenge.
 *
 * Each sprig is a short stem carrying leaves that alternate above and below
 * it. Hanging both leaves off a single base point instead makes a symmetric
 * V, and the pair reads as a butterfly rather than foliage.
 */
export function Divider() {
  return (
    <svg
      className={`${styles.divider} ${styles.stroke}`}
      viewBox="0 0 200 40"
      role="presentation"
      aria-hidden="true"
    >
      <path d="M6 20 H68" />
      <path d="M132 20 H194" />
      <path d="M94 20 H79" />
      <path d="M106 20 H121" />
      <path d="M100 13 L105 20 L100 27 L95 20 Z" />
      <Leaves
        items={[
          { x: 91, y: 20, angle: -55, scale: 1.5 },
          { x: 86, y: 20, angle: -125, scale: 1.4 },
          { x: 81, y: 20, angle: -55, scale: 1.2 },
          { x: 109, y: 20, angle: 55, scale: 1.5 },
          { x: 114, y: 20, angle: 125, scale: 1.4 },
          { x: 119, y: 20, angle: 55, scale: 1.2 },
        ]}
      />
    </svg>
  )
}

/**
 * A single horizontal branch, for laying on the paper beside a photograph.
 *
 * Corner vines were tried here first and do not work: the mat is only as deep
 * as its padding, so any vine large enough to read spills onto the image and
 * dissolves into whatever the photograph is doing at that corner. A branch
 * lying along the mat always has the same ground under it.
 *
 * Leaf bases are sampled off the stem curve at t = 0.2, 0.4, 0.6 and 0.8, and
 * alternate above and below it.
 */
export function Sprig() {
  return (
    <svg
      className={`${styles.sprig} ${styles.stroke}`}
      viewBox="0 0 128 40"
      role="presentation"
      aria-hidden="true"
    >
      <path d="M8 24 C34 16 76 16 112 22" />
      <Leaves
        items={[
          { x: 25, y: 20, angle: -30, scale: 1.7 },
          { x: 45, y: 18, angle: 210, scale: 1.6 },
          { x: 67, y: 18, angle: -30, scale: 1.7 },
          { x: 90, y: 19, angle: 210, scale: 1.6 },
          { x: 112, y: 22, angle: -62, scale: 1.4 },
        ]}
      />
    </svg>
  )
}

/**
 * A quarter-circle vine for a card corner.
 *
 * The stem is a Bézier quarter-arc of radius 76 centred on (100, 100), and
 * every leaf sits at a known angle on it: outer leaves point away from the
 * centre and fill the corner, inner ones point back toward the content.
 * Deriving the positions from the arc instead of eyeballing them is what
 * keeps the leaves attached to the stem.
 *
 * Leaf scale matters as much as position. The canonical leaf is nine units
 * long, which is a fifth of the 48-unit icon grid but only a fourteenth of
 * this one — at 1x the leaves shrink into tick marks and the whole ornament
 * reads as a centipede.
 */
export function CornerVine({ at }: { readonly at: 'topStart' | 'topEnd' | 'bottomStart' | 'bottomEnd' }) {
  return (
    <svg
      className={`${styles.corner} ${styles[at]} ${styles.stroke}`}
      viewBox="0 0 120 120"
      role="presentation"
      aria-hidden="true"
    >
      <path d="M24 100 C24 58 58 24 100 24" />
      <Leaves
        items={[
          { x: 25.2, y: 86.8, angle: 280, scale: 2.4 },
          { x: 35.6, y: 59.7, angle: 302, scale: 2.4 },
          { x: 55.3, y: 38.5, angle: 324, scale: 2.4 },
          { x: 81.6, y: 26.3, angle: 346, scale: 2.4 },
          { x: 29.0, y: 72.8, angle: 111, scale: 1.7 },
          { x: 44.4, y: 48.2, angle: 133, scale: 1.7 },
          { x: 67.9, y: 31.1, angle: 155, scale: 1.7 },
        ]}
      />
    </svg>
  )
}
