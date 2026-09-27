/** Mises en forme de l'espace /admin (dates en heure de Paris). */
const PARIS = 'Europe/Paris'

export function formatDay(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

export function formatMonth(month: string, style: 'long' | 'short' = 'long') {
  const [y, m] = month.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, 15))
  return style === 'short'
    ? date.toLocaleDateString('fr-FR', { month: 'short', timeZone: 'UTC' })
    : date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

export function formatNumber(value: number | undefined) {
  return typeof value === 'number' ? new Intl.NumberFormat('fr-FR').format(value) : '—'
}

/** Aujourd'hui (AAAA-MM-JJ) et le mois en cours (AAAA-MM), heure de Paris. */
export function todayInParis() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: PARIS, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

export const currentMonth = () => todayInParis().slice(0, 7)
