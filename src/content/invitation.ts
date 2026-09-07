import type { IconName } from '../shared/ui/Icon'

/**
 * Single source of truth for every piece of invitation copy and data.
 * Sections read from here — never hardcode text inside JSX.
 *
 * Fields marked TODO(transcribe) could not be read reliably from the
 * low-resolution preview. Verify each one against the full-size source PNG
 * before shipping.
 */

export const couple = {
  first: 'Said',
  second: 'Alina',
  monogram: 'S&A',
} as const

export const weddingDate = {
  /** Authoritative timestamp. Drives the countdown. */
  iso: '2026-11-06T13:00:00-06:00',
  weekday: 'Viernes',
  month: 'Noviembre',
  day: '06',
  year: '2026',
  time: '1:00 P.M.',
} as const

export const intro = {
  eyebrow: '¡Nos casamos!',
  // TODO(transcribe): full paragraph from the hero card.
  body: 'Con mucha alegría y amor en el corazón, queremos compartir con ustedes uno de los días más importantes de nuestra vida.',
} as const

export type Venue = {
  readonly kind: 'ceremony' | 'reception'
  readonly title: string
  readonly time: string
  readonly place: string
  readonly address: string
  /** Google Maps share link. Empty string renders the button disabled. */
  readonly mapUrl: string
}

export const venues: readonly Venue[] = [
  {
    kind: 'ceremony',
    title: 'Ceremonia Religiosa',
    time: '1:30 pm',
    place: 'Parroquia de La Sagrada Familia',
    address: 'Nápoles S/N, Hab Izcalli Piramide, 54140 Tlalnepantla, Méx.',
    mapUrl: 'https://maps.app.goo.gl/XEbfZ3okbG1QkUC97',
  },
  {
    kind: 'reception',
    title: 'Recepción',
    time: '3:30 pm',
    place: '', // TODO(transcribe)
    address: '', // TODO(transcribe)
    mapUrl: '', // TODO(provide)
  },
]

export type ItineraryItem = {
  readonly label: string
  readonly time: string
  /** Glyph drawn by the shared Icon component. */
  readonly icon: IconName
}

// TODO(transcribe): confirm every label and time against the source PNG.
export const itinerary: readonly ItineraryItem[] = [
  { label: 'Ceremonia', time: '1:00 PM', icon: 'rings' },
  { label: 'Recepción', time: '3:30 PM', icon: 'arch' },
  { label: 'Brindis', time: '', icon: 'toast' },
  { label: 'Vals', time: '', icon: 'waltz' },
  { label: 'Cena', time: '5:00 PM', icon: 'dinner' },
  { label: 'Baile', time: '9:00 PM', icon: 'dance' },
]

export const gifts = {
  title: 'Regalos',
  // TODO(transcribe)
  body: 'Afortunadamente ya tenemos todo para nuestro hogar, si desean hacernos un obsequio, puede ser en efectivo.',
  closing: 'Muchas gracias',
} as const

export const dressCode = {
  title: 'Código de vestimenta',
  value: 'Formal',
  note: 'Dejemos los colores claros para la novia.',
} as const

export const adultsOnly = {
  // TODO(transcribe)
  body: 'Para que todos nuestros invitados puedan relajarse y disfrutar plenamente de la celebración, nuestra boda será exclusivamente para adultos.',
} as const

export const passes = {
  // TODO(transcribe)
  body: 'Nos encantaría poder celebrar con todos, sin embargo, debido a la capacidad del lugar, contamos con una cantidad limitada de personas incluidas en la invitación.',
} as const

export const rsvp = {
  title: '¡Confirmación de asistencia!',
  deadlineLabel: '06 de octubre de 2026',
  deadlineIso: '2026-10-06',
  intro: 'Nos encantaría compartir este momento con ustedes.',
  passes: (guests: number) =>
    guests === 1
      ? 'Tenemos reservado 1 lugar para ustedes.'
      : `Tenemos reservados ${guests} lugares para ustedes.`,
  fields: {
    attending: '¿Confirmas tu asistencia a nuestra boda?',
    guestCount: '¿Cuántas personas asistirán?',
    message: '¿Quieres dejarnos un mensaje?',
  },
  options: {
    yes: 'Sí, asistiremos',
    no: 'No podremos asistir',
  },
  submitLabel: 'Confirmar asistencia',
  submittingLabel: 'Enviando…',
  success: {
    title: (familyName: string) => `¡Gracias, ${familyName}! ❤️`,
    body: 'Hemos recibido su confirmación.',
    attending: 'Los esperamos con mucho cariño.',
    declined: 'Lamentamos no poder contar con ustedes, pero gracias por avisarnos.',
  },
  errors: {
    submit: 'No pudimos registrar tu confirmación. Por favor, inténtalo nuevamente.',
    unconfigured: 'El formulario todavía no está conectado a un destino.',
    missingChoice: 'Elige una opción para continuar.',
  },
  /** Shown when the invitation is opened without a personal link. */
  noFamily:
    'Esta confirmación es personal. Abre el enlace que te enviamos para confirmar tu asistencia.',
} as const

export const closing = {
  // TODO(transcribe)
  body: 'Estamos listos para celebrar el amor, y queremos que estés ahí. Favor de confirmar tu asistencia antes del 06 de octubre de 2026.',
} as const

export const envelope = {
  /** Precedes the family name written on the front of the envelope. */
  addresseeLabel: 'Para',
} as const

export const notFound = {
  title: 'No encontramos esta invitación.',
  body: 'Verifica que el enlace sea correcto.',
} as const
