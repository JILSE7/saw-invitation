import { useState, type FormEvent } from 'react'
import { isRsvpConfigured, type Family, type RsvpAnswer } from '../../shared/api/invitation'
import { MESSAGE_MAX_LENGTH, submitRsvp } from './submitRsvp'

export type RsvpStatus = 'idle' | 'submitting' | 'success' | 'error' | 'unconfigured'

export type RsvpValues = {
  attending: 'yes' | 'no' | ''
  guests: number
  message: string
}

/**
 * @param previous The family's last answer, when it is editing rather than
 * replying for the first time. Seeding from it means a household correcting
 * one number does not retype the rest.
 */
export function useRsvpForm(family: Family, previous?: RsvpAnswer | null) {
  const [values, setValues] = useState<RsvpValues>({
    attending: previous ? (previous.confirmed ? 'yes' : 'no') : '',
    // Most families confirm every pass they were given, so start there.
    guests: previous?.confirmed ? Math.min(previous.guests, family.guests) : family.guests,
    message: previous?.message ?? '',
  })
  const [status, setStatus] = useState<RsvpStatus>('idle')

  const isSubmitting = status === 'submitting'

  function setAttending(attending: 'yes' | 'no') {
    setValues((current) => ({ ...current, attending }))
  }

  /** Clamped here rather than in the view so the stepper cannot escape range. */
  function setGuests(next: number) {
    const clamped = Math.min(Math.max(next, 1), family.guests)
    setValues((current) => ({ ...current, guests: clamped }))
  }

  function setMessage(message: string) {
    setValues((current) => ({ ...current, message: message.slice(0, MESSAGE_MAX_LENGTH) }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Guards against the double-click storm: a second submit while one is in
    // flight is dropped even if the disabled button is bypassed.
    if (isSubmitting) return
    if (values.attending === '') return

    // Failing loudly beats a fake success screen: a guest who believes they
    // confirmed and did not is worse than a guest who sees an error.
    if (!isRsvpConfigured()) {
      setStatus('unconfigured')
      return
    }

    const confirmed = values.attending === 'yes'
    const message = values.message.trim()

    setStatus('submitting')
    try {
      await submitRsvp({
        // Name and pass count come from the guest list, never from the form,
        // so the guest cannot claim a family or a headcount that is not theirs.
        familyId: family.id,
        familyName: family.name,
        confirmed,
        guests: confirmed ? values.guests : 0,
        ...(message ? { message } : {}),
      })
      setStatus('success')
    } catch {
      // Values are kept so the guest does not retype the message on retry.
      setStatus('error')
    }
  }

  return { values, status, isSubmitting, setAttending, setGuests, setMessage, handleSubmit }
}
