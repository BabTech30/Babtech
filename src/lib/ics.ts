/**
 * Mise en forme commune aux fichiers vCard (.vcf) et iCalendar (.ics) : échappement des valeurs
 * texte et lignes coupées à 75 octets (RFC 6350 et RFC 5545). Fonctionne côté serveur et navigateur.
 */
export const escapeText = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([,;])/g, '\\$1')

const encoder = new TextEncoder()

export function foldLine(line: string) {
  const parts: string[] = []
  let current = ''
  let bytes = 0
  for (const char of line) {
    const size = encoder.encode(char).length
    if (bytes + size > (parts.length ? 74 : 75)) {
      parts.push(current)
      current = ''
      bytes = 0
    }
    current += char
    bytes += size
  }
  parts.push(current)
  return parts.join('\r\n ')
}

export const joinLines = (lines: string[]) => `${lines.map(foldLine).join('\r\n')}\r\n`

export type CalendarEvent = {
  uid: string
  start: number
  end: number
  summary: string
  description?: string
  location?: string
  status?: 'CONFIRMED' | 'CANCELLED'
}

const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

/** Agenda au format iCalendar, lisible par Apple Calendrier, Google Agenda et Outlook. */
export function buildCalendar(name: string, events: CalendarEvent[], now = Date.now()) {
  return joinLines([
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BabTech//Rendez-vous//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(name)}`,
    'X-WR-TIMEZONE:Europe/Paris',
    ...events.flatMap((e) => [
      'BEGIN:VEVENT',
      `UID:${e.uid}`,
      `DTSTAMP:${stamp(now)}`,
      `DTSTART:${stamp(e.start)}`,
      `DTEND:${stamp(e.end)}`,
      `SUMMARY:${escapeText(e.summary)}`,
      ...(e.description ? [`DESCRIPTION:${escapeText(e.description)}`] : []),
      ...(e.location ? [`LOCATION:${escapeText(e.location)}`] : []),
      `STATUS:${e.status ?? 'CONFIRMED'}`,
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ])
}
