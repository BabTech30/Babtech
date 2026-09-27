/**
 * Dates et heures de Paris pour la prise de rendez-vous, changements d'heure compris.
 * Les dates sont des textes « AAAA-MM-JJ », les heures « HH:MM » ; les instants sont en millisecondes UTC.
 */
const TZ = 'Europe/Paris'

const partsFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

function parisParts(ms: number) {
  const parts = Object.fromEntries(partsFormat.formatToParts(new Date(ms)).map((p) => [p.type, p.value]))
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  }
}

/** Écart entre l'heure de Paris et UTC à cet instant, en millisecondes (1 h en hiver, 2 h en été). */
function parisOffset(ms: number) {
  const p = parisParts(ms)
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(ms / 1000) * 1000
}

/** « 2026-09-29 » et « 10:30 » à Paris → instant UTC. */
export function parisToUtc(date: string, time: string) {
  const [y, m, d] = date.split('-').map(Number)
  const [h, min] = time.split(':').map(Number)
  const naive = Date.UTC(y, m - 1, d, h, min)
  const first = naive - parisOffset(naive)
  return naive - parisOffset(first)
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Instant → date et heure de Paris. */
export function utcToParis(ms: number) {
  const p = parisParts(ms)
  return { date: `${p.year}-${pad(p.month)}-${pad(p.day)}`, time: `${pad(p.hour)}:${pad(p.minute)}` }
}

export function addDays(date: string, days: number) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10)
}

/** Jour de la semaine d'une date : 1 = lundi … 7 = dimanche. */
export function isoWeekday(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return ((new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7) + 1
}

export const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export const fromMinutes = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`

export const isDate = (value: string) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)
export const isTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value)

const noonUtc = (date: string) => {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, 12))
}

/** Premier jour du mois écrit « 1er », comme en français soigné. */
export const firstOfMonth = (text: string) => text.replace(/(^|\s)1(?=\s)/, '$11er')

/** « lundi 29 septembre », « jeudi 1er octobre » (ou « lun. 29 sept. » en version courte). */
export function frDay(date: string, style: 'long' | 'short' = 'long') {
  return firstOfMonth(
    noonUtc(date).toLocaleDateString('fr-FR', {
      weekday: style,
      day: 'numeric',
      month: style,
      timeZone: 'UTC',
    }),
  )
}

/** « 10:30 » → « 10 h 30 », « 09:00 » → « 9 h ». */
export function frTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  return m ? `${h}\u00a0h\u00a0${pad(m)}` : `${h}\u00a0h`
}

/** Date et heure au format des agendas (iCalendar, Google Agenda) : 20260929T083000Z. */
export function icsStamp(ms: number) {
  return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** Morceaux d'une date pour une pastille de calendrier : « lun. », « 29 », « sept. ». */
export function frDayParts(date: string) {
  const d = noonUtc(date)
  const part = (options: Intl.DateTimeFormatOptions) => d.toLocaleDateString('fr-FR', { ...options, timeZone: 'UTC' })
  return { weekday: part({ weekday: 'short' }), day: part({ day: 'numeric' }), month: part({ month: 'short' }) }
}
