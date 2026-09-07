import type { ReactNode } from 'react'
import { gsap } from '../lib/gsap'
import { useGsapContext } from '../hooks/useGsapContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type RevealProps = {
  readonly children: ReactNode
  /** Animate each direct child in sequence instead of the block as a whole. */
  readonly stagger?: boolean
  readonly delay?: number
  readonly className?: string
}

/**
 * Fades and lifts its contents into view once, on scroll.
 *
 * `gsap.from` is deliberate: the resting state is whatever the CSS already
 * says, so if the animation never runs — reduced motion, a JS failure — the
 * content is simply visible rather than stuck at opacity 0.
 */
export function Reveal({ children, stagger = false, delay = 0, className }: RevealProps) {
  const reduced = usePrefersReducedMotion()

  const scope = useGsapContext<HTMLDivElement>(
    (_self, el) => {
      if (reduced) return

      const targets = stagger ? Array.from(el.children) : [el]

      gsap.from(targets, {
        opacity: 0,
        y: 28,
        duration: 0.9,
        delay,
        ease: 'power2.out',
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
    },
    [reduced, stagger, delay],
  )

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  )
}
