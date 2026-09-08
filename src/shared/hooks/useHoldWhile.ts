import { useEffect, useState } from 'react'

/**
 * Keeps a flag true for at least `ms` after it first turned true.
 *
 * A warm Apps Script can answer in under 200ms, and a loading screen that
 * appears and vanishes inside that window reads as a glitch rather than as a
 * pause. Holding it costs the fast path a moment and buys every path a
 * deliberate one.
 */
export function useHoldWhile(active: boolean, ms: number): boolean {
  // Two counters rather than a timestamp: `spell` is the hold we are in and
  // `completed` is the last one whose minimum elapsed, so whether we are still
  // holding is derivable during render instead of read off the clock.
  const [spell, setSpell] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [wasActive, setWasActive] = useState(active)

  // Adjusting state during render on a changed input — React's own pattern for
  // this, and the reason no effect has to fire a synchronous setState.
  if (active !== wasActive) {
    setWasActive(active)
    if (active) setSpell(spell + 1)
  }

  useEffect(() => {
    if (spell === completed) return

    const timer = setTimeout(() => setCompleted(spell), ms)
    return () => clearTimeout(timer)
    // `active` is deliberately not a dependency. The hold has to outlive the
    // condition that started it, and listing it here would let the cleanup
    // cancel the timer the moment the answer arrived — leaving the loader up
    // for good.
  }, [spell, completed, ms])

  return active || spell > completed
}
