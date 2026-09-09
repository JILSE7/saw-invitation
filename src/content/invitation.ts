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

/**
 * Copy that changes with how many people the invitation is for, keyed by the
 * Voice the guest's pass count resolves to.
 */
export type Voiced = { readonly one: string; readonly many: string }

export const intro = {
  eyebrow: '¡Nos casamos!',
  // TODO(transcribe): full paragraph from the hero card.
  body: {
    one: 'Con mucha alegría y amor en el corazón, queremos compartir contigo uno de los días más importantes de nuestra vida.',
    many: 'Con mucha alegría y amor en el corazón, queremos compartir con ustedes uno de los días más importantes de nuestra vida.',
  } satisfies Voiced,
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
  intro: {
    one: 'Nos encantaría compartir este momento contigo.',
    many: 'Nos encantaría compartir este momento con ustedes.',
  } satisfies Voiced,
  passes: (guests: number) =>
    guests === 1
      ? 'Tenemos reservado 1 lugar para ti.'
      : `Tenemos reservados ${guests} lugares para ustedes.`,
  fields: {
    attending: {
      one: '¿Confirmas tu asistencia a nuestra boda?',
      many: '¿Confirman su asistencia a nuestra boda?',
    } satisfies Voiced,
    guestCount: '¿Cuántas personas asistirán?',
    message: '¿Quieres dejarnos un mensaje?',
  },
  options: {
    yes: { one: 'Sí, asistiré', many: 'Sí, asistiremos' } satisfies Voiced,
    no: { one: 'No podré asistir', many: 'No podremos asistir' } satisfies Voiced,
  },
  answered: {
    body: {
      one: 'Ya recibimos tu respuesta.',
      many: 'Ya recibimos su respuesta.',
    } satisfies Voiced,
    attending: (guests: number) =>
      guests === 1 ? 'Confirmaste 1 lugar.' : `Confirmaron ${guests} lugares.`,
    declined: {
      one: 'Nos avisaste que no podrás acompañarnos.',
      many: 'Nos avisaron que no podrán acompañarnos.',
    } satisfies Voiced,
    change: 'Modificar mi respuesta',
  },
  submitLabel: 'Confirmar asistencia',
  submittingLabel: 'Enviando…',
  success: {
    title: (familyName: string) => `¡Gracias, ${familyName}! ❤️`,
    body: {
      one: 'Hemos recibido tu confirmación.',
      many: 'Hemos recibido su confirmación.',
    } satisfies Voiced,
    attending: {
      one: 'Te esperamos con mucho cariño.',
      many: 'Los esperamos con mucho cariño.',
    } satisfies Voiced,
    declined: {
      one: 'Lamentamos no poder contar contigo, pero gracias por avisarnos.',
      many: 'Lamentamos no poder contar con ustedes, pero gracias por avisarnos.',
    } satisfies Voiced,
  },
  errors: {
    submit: {
      one: 'No pudimos registrar tu confirmación. Por favor, inténtalo nuevamente.',
      many: 'No pudimos registrar su confirmación. Por favor, inténtenlo nuevamente.',
    } satisfies Voiced,
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
  eyebrow: { one: 'Te esperamos', many: 'Los esperamos' } satisfies Voiced,
  /** Falls back to the plural when the link carried no family. */
  greeting: (name: string | undefined) => (name ? `${name},` : 'A ustedes,'),
  body: {
    one: 'Estamos listos para celebrar el amor, y queremos que estés ahí. Tu compañía es el regalo que más ilusión nos hace.',
    many: 'Estamos listos para celebrar el amor, y queremos que estén ahí. Su compañía es el regalo que más ilusión nos hace.',
  } satisfies Voiced,
  confirm: {
    one: (deadline: string) => `No olvides confirmar tu asistencia antes del ${deadline}.`,
    many: (deadline: string) => `No olviden confirmar su asistencia antes del ${deadline}.`,
  },
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
