import { useState } from 'react'
import { voiceFor, type Family, type RsvpAnswer } from '../../shared/api/invitation'
import { rsvp } from '../../content/invitation'
import { Reveal } from '../../shared/ui/Reveal'
import { SectionTitle } from '../../shared/ui/SectionTitle'
import styles from './Rsvp.module.css'
import { MESSAGE_MAX_LENGTH } from './submitRsvp'
import { useRsvpForm } from './useRsvpForm'

type RsvpProps = {
  /** Undefined when the invitation was opened without a personal link. */
  readonly family: Family | undefined
  /** This family's current answer, resolved with the family itself. */
  readonly answer: RsvpAnswer | null
}

export function Rsvp({ family, answer }: RsvpProps) {
  if (!family) {
    return (
      <section className={styles.section}>
        <Reveal className={styles.card}>
          <SectionTitle>{rsvp.title}</SectionTitle>
          <p className={styles.feedback}>{rsvp.noFamily}</p>
        </Reveal>
      </section>
    )
  }

  // Keyed so a different family never inherits the previous editing state.
  return <RsvpGate key={family.id} family={family} answer={answer} />
}

/**
 * Decides whether this family is replying or revisiting.
 *
 * There is no waiting state left here: the family and its answer arrive from
 * the same lookup, so by the time this renders both are known. A lookup that
 * failed never reaches this component at all — the guest sees the retry
 * screen instead of a form that could not be submitted anyway.
 */
function RsvpGate({ family, answer }: { family: Family; answer: RsvpAnswer | null }) {
  const [editing, setEditing] = useState(false)
  const voice = voiceFor(family)

  if (answer && !editing) {
    return (
      <section className={styles.section}>
        <Reveal className={styles.card}>
          <SectionTitle>{family.name}</SectionTitle>
          <p className={styles.feedback}>{rsvp.answered.body[voice]}</p>
          <p className={styles.answer}>
            {answer.confirmed
              ? rsvp.answered.attending(answer.guests)
              : rsvp.answered.declined[voice]}
          </p>
          {/* Plans change, and Responses is append-only precisely so they
              can: an edit adds a row rather than erasing the first answer. */}
          <button type="button" className={styles.change} onClick={() => setEditing(true)}>
            {rsvp.answered.change}
          </button>
        </Reveal>
      </section>
    )
  }

  return <RsvpForm family={family} previous={answer} />
}

function RsvpForm({ family, previous }: { family: Family; previous: RsvpAnswer | null }) {
  const { values, status, isSubmitting, setAttending, setGuests, setMessage, handleSubmit } =
    useRsvpForm(family, previous)
  const voice = voiceFor(family)

  if (status === 'success') {
    return (
      <section className={styles.section}>
        <div className={styles.card}>
          <SectionTitle>{rsvp.success.title(family.name)}</SectionTitle>
          <p className={styles.feedback}>{rsvp.success.body[voice]}</p>
          <p className={styles.feedback}>
            {values.attending === 'yes' ? rsvp.success.attending[voice] : rsvp.success.declined[voice]}
          </p>
        </div>
      </section>
    )
  }

  const error =
    status === 'error' ? rsvp.errors.submit[voice] : status === 'unconfigured' ? rsvp.errors.unconfigured : ''

  return (
    <section className={styles.section}>
      <Reveal className={styles.card}>
        <SectionTitle>{family.name}</SectionTitle>
        <p className={styles.intro}>{rsvp.intro[voice]}</p>
        <p className={styles.passes}>{rsvp.passes(family.guests)}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Disabling the whole set, not just the button, keeps the values
              frozen while a submission is in flight. */}
          <fieldset className={styles.fields} disabled={isSubmitting}>
            <fieldset className={styles.field}>
              <legend className={styles.label}>{rsvp.fields.attending[voice]}</legend>
              <span className={styles.choices}>
                {(['yes', 'no'] as const).map((option) => (
                  <label key={option} className={styles.choice}>
                    <input
                      type="radio"
                      name="attending"
                      value={option}
                      required
                      checked={values.attending === option}
                      onChange={() => setAttending(option)}
                    />
                    {rsvp.options[option][voice]}
                  </label>
                ))}
              </span>
            </fieldset>

            {values.attending === 'yes' && family.guests > 1 && (
              <p className={styles.field}>
                <span className={styles.label} id="rsvp-guests-label">
                  {rsvp.fields.guestCount}
                </span>
                <span className={styles.stepper} role="group" aria-labelledby="rsvp-guests-label">
                  <button
                    type="button"
                    className={styles.stepperButton}
                    onClick={() => setGuests(values.guests - 1)}
                    disabled={values.guests <= 1}
                    aria-label="Quitar un asistente"
                  >
                    −
                  </button>
                  <output className={styles.stepperValue} aria-live="polite">
                    {values.guests}
                  </output>
                  <button
                    type="button"
                    className={styles.stepperButton}
                    onClick={() => setGuests(values.guests + 1)}
                    disabled={values.guests >= family.guests}
                    aria-label="Agregar un asistente"
                  >
                    +
                  </button>
                </span>
              </p>
            )}

            <p className={styles.field}>
              <label className={styles.label} htmlFor="rsvp-message">
                {rsvp.fields.message}
              </label>
              <textarea
                id="rsvp-message"
                className={styles.textarea}
                maxLength={MESSAGE_MAX_LENGTH}
                value={values.message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </p>
          </fieldset>

          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? rsvp.submittingLabel : rsvp.submitLabel}
          </button>
        </form>

        {error && (
          <p className={`${styles.feedback} ${styles.error}`} role="status">
            {error}
          </p>
        )}
      </Reveal>
    </section>
  )
}
