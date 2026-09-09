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
  iso: '2026-11-06T17:00:00-06:00',
  weekday: 'Viernes',
  month: 'Noviembre',
  day: '06',
  year: '2026',
  time: '5:00 P.M.',
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
    time: '5:00 pm',
    place: 'Parroquia de La Sagrada Familia',
    address: 'Nápoles S/N, Hab Izcalli Piramide, 54140 Tlalnepantla, Méx.',
    mapUrl: 'https://maps.app.goo.gl/XEbfZ3okbG1QkUC97',
  },
  {
    kind: 'reception',
    title: 'Recepción',
    time: '6:30 pm',
    place: 'San José De Gracia',
    address: 'Tepic 51, Hab Valle Ceylan, 54150 Tlalnepantla, Méx.',
    mapUrl: 'https://maps.app.goo.gl/xnNyTfhvzcbpWrLf6'
  },
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
  answered: {
    body: 'Ya recibimos tu respuesta.',
    attending: (guests: number) =>
      guests === 1 ? 'Confirmaste 1 lugar.' : `Confirmaste ${guests} lugares.`,
    declined: 'Nos avisaste que no podrán acompañarnos.',
    change: 'Modificar mi respuesta',
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

/**
 * The last words of the document. It closes the invitation the way the hero
 * opens it — a paper card inside the same botanical corners — so the scroll
 * ends on a goodbye rather than on an errand.
 */
export const farewell = {
  eyebrow: 'Los esperamos',
  /** Falls back to the plural when the link carried no family. */
  greeting: (name: string | undefined) => (name ? `${name},` : 'A ustedes,'),
  body: 'Estamos listos para celebrar el amor, y queremos que estén ahí. Su compañía es el regalo que más ilusión nos hace.',
  confirm: (deadline: string) => `No olviden confirmar su asistencia antes del ${deadline}.`,
  signoff: 'Con todo nuestro cariño,',
  /** The mark carries the couple and the date, so it is content, not decor. */
  markAlt: 'Alina & Said · 06.11.2026',
} as const

export const envelope = {
  /** Precedes the family name written on the front of the envelope. */
  addresseeLabel: 'Para',
} as const

export const loader = {
  label: 'Abriendo tu invitación',
} as const

export const notFound = {
  title: 'No encontramos esta invitación.',
  body: 'Verifica que el enlace sea correcto.',
} as const

/**
 * Shown when the guest list could not be reached at all. Deliberately never
 * says the invitation does not exist: the guest is real, the connection is
 * not.
 */
export const unreachable = {
  title: 'No pudimos abrir tu invitación.',
  body: 'Puede ser tu conexión. Intenta de nuevo en un momento.',
  action: 'Reintentar',
} as const
