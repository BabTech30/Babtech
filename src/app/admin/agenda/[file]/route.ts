import { timingSafeEqual } from 'node:crypto'
import { readStore } from '@/lib/admin/store'
import { appointmentEvent } from '@/lib/booking/calendar'
import { buildCalendar } from '@/lib/ics'

/**
 * Agenda privé des rendez-vous, auquel ton téléphone ou Google Agenda s'abonne (format iCal).
 * L'adresse contient un jeton secret créé dans le tableau de bord : sans le bon jeton, rien n'existe ici.
 */
export const dynamic = 'force-dynamic'

const RECENT_DAYS = 60

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const token = /^([\w-]{16,128})\.ics$/.exec((await params).file)?.[1]
  const { calendarToken, appointments } = await readStore()
  if (!token || !calendarToken || !same(token, calendarToken)) {
    return new Response('Introuvable.', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  }
  const since = Date.now() - RECENT_DAYS * 86_400_000
  const events = appointments.filter((a) => a.status === 'confirmed' && Date.parse(a.start) >= since).map(appointmentEvent)
  return new Response(buildCalendar('Rendez-vous BabTech', events), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="rendez-vous-babtech.ics"',
      'Cache-Control': 'no-store, private',
    },
  })
}

/** Comparaison en temps constant : la durée de la réponse ne révèle rien du jeton. */
function same(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}
