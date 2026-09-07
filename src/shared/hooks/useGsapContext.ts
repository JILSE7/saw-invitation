import { useLayoutEffect, useRef, type DependencyList, type RefObject } from 'react'
import { gsap } from '../lib/gsap'

/**
 * Scopes a GSAP setup function to a DOM subtree and reverts every animation,
 * ScrollTrigger and inline style it created on unmount.
 *
 * The revert is what makes this safe under StrictMode's double-invoked
 * effects: without it the second run stacks a duplicate timeline on top of
 * the first and the element settles on the wrong resting transform.
 *
 * `setup` receives the scope element directly so callers can animate the
 * wrapper itself, not only its descendants.
 */
export function useGsapContext<T extends HTMLElement>(
  setup: (self: gsap.Context, element: T) => void,
  deps: DependencyList = [],
): RefObject<T | null> {
  const scope = useRef<T>(null)

  useLayoutEffect(() => {
    const element = scope.current
    if (!element) return

    const ctx = gsap.context((self) => setup(self, element), scope)
    return () => {
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return scope
}
