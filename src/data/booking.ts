import { services } from './services'

/**
 * Prise de rendez-vous interne (page /rendez-vous/, gérée dans /admin/rendez-vous/). Les réglages
 * ci-dessous sont ceux de départ : tu les modifies ensuite dans le tableau de bord, qui les enregistre
 * sur le serveur. Toutes les heures sont celles de Paris.
 */
export type TimeRange = { start: string; end: string }

export type BookingSettings = {
  /** Plages ouvertes par jour de la semaine : « 1 » = lundi … « 7 » = dimanche. */
  week: Record<string, TimeRange[]>
  /** Durée d'un rendez-vous, en minutes. */
  slotMinutes: number
  /** Délai minimum avant un rendez-vous, en heures. */
  noticeHours: number
  /** Nombre de jours à l'avance où l'on peut réserver. */
  horizonDays: number
  /** Jours fermés (congés, salons…), au format AAAA-MM-JJ. */
  closedDays: string[]
  /** Réservations suspendues (la page propose alors d'appeler ou d'écrire). */
  paused: boolean
}

export type AppointmentMode = 'telephone' | 'visio'

export type Appointment = {
  id: string
  /** Début, en UTC (ISO). */
  start: string
  minutes: number
  mode: AppointmentMode
  name: string
  email: string
  phone?: string
  company?: string
  topic: string
  message?: string
  status: 'confirmed' | 'cancelled'
  createdAt: string
  cancelledAt?: string
}

const WORKDAY: TimeRange[] = [
  { start: '09:00', end: '12:00' },
  { start: '14:00', end: '18:00' },
]

export const defaultBookingSettings: BookingSettings = {
  week: { '1': WORKDAY, '2': WORKDAY, '3': WORKDAY, '4': WORKDAY, '5': WORKDAY, '6': [], '7': [] },
  slotMinutes: 30,
  noticeHours: 24,
  horizonDays: 30,
  closedDays: [],
  paused: false,
}

export const WEEKDAYS = [
  { key: '1', label: 'Lundi' },
  { key: '2', label: 'Mardi' },
  { key: '3', label: 'Mercredi' },
  { key: '4', label: 'Jeudi' },
  { key: '5', label: 'Vendredi' },
  { key: '6', label: 'Samedi' },
  { key: '7', label: 'Dimanche' },
] as const

export const MODES: { value: AppointmentMode; label: string; hint: string }[] = [
  { value: 'telephone', label: 'Par téléphone', hint: "Je t'appelle au numéro que tu indiques." },
  { value: 'visio', label: 'En visio', hint: "Je t'envoie le lien par e-mail avant le rendez-vous." },
]

/** Sujets proposés : les services du site, plus « je ne sais pas encore ». */
export const TOPICS = [
  ...services.map((s) => ({ value: s.slug as string, label: s.name })),
  { value: 'autre', label: 'Je ne sais pas encore / autre chose' },
]

export const topicLabel = (value: string) => TOPICS.find((t) => t.value === value)?.label ?? 'Autre'

/** Les rendez-vous sont effacés du serveur 12 mois après leur date (voir la page Confidentialité). */
export const APPOINTMENT_RETENTION_DAYS = 365
