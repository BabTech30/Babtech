import { type Appointment, topicLabel } from '@/data/booking'
import type { CalendarEvent } from '@/lib/ics'
import { absoluteUrl, site } from '@/lib/site'

/** Rendez-vous → évènement de ton agenda, avec les coordonnées de la personne et le sujet. */
export function appointmentEvent(a: Appointment): CalendarEvent {
  const start = Date.parse(a.start)
  return {
    uid: `${a.id}@${new URL(site.url).host}`,
    start,
    end: start + a.minutes * 60_000,
    summary: `${a.mode === 'telephone' ? 'Appel' : 'Visio'} découverte · ${a.name}${a.company ? ` (${a.company})` : ''}`,
    description: [
      a.mode === 'telephone' ? `À appeler au ${a.phone ?? '(numéro non indiqué)'}` : 'Visio : envoyer le lien par e-mail avant le rendez-vous',
      `E-mail : ${a.email}`,
      `Sujet : ${topicLabel(a.topic)}`,
      ...(a.message ? [`Message : ${a.message}`] : []),
      `Tableau de bord : ${absoluteUrl('/admin/rendez-vous')}`,
    ].join('\n'),
    location: a.mode === 'telephone' ? (a.phone ?? 'Téléphone') : 'Visio',
    status: a.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED',
  }
}
