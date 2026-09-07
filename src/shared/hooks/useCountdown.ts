import { useEffect, useState } from 'react'

export type Countdown = {
  readonly days: number
  readonly hours: number
  readonly minutes: number
  readonly seconds: number
  readonly isPast: boolean
}

const SECOND = 1_000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function remainingFrom(target: number, now: number): Countdown {
  const remaining = Math.max(0, target - now)
  return {
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
    isPast: remaining === 0,
  }
}

/**
 * Counts down to an ISO timestamp in days, hours, minutes and seconds.
 *
 * The source design shows only days/hours/seconds, which drops minutes and
 * lets seconds read past 59. This returns all four units instead.
 */
export function useCountdown(targetIso: string): Countdown {
  const target = new Date(targetIso).getTime()
  const [value, setValue] = useState(() => remainingFrom(target, Date.now()))

  useEffect(() => {
    if (value.isPast) return
    const id = window.setInterval(() => {
      setValue(remainingFrom(target, Date.now()))
    }, SECOND)
    return () => window.clearInterval(id)
  }, [target, value.isPast])

  return value
}
