import { type Appointment, topicLabel } from '@/data/booking'
import { frDay, frTime, utcToParis } from '@/lib/booking/time'
import type { CalendarEvent } from '@/lib/ics'
import { absoluteUrl, formatPhone, site } from '@/lib/site'

/** « mardi 29 septembre à 9 h 30 » (heure de Paris). */
export function whenText(a: Appointment) {
  const { date, time } = utcToParis(Date.parse(a.start))
  return `${frDay(date)} à ${frTime(time)}`
}

/** Évènement pour l'agenda de la personne qui a réservé (joint à l'e-mail de confirmation). */
export function clientEvent(a: Appointment): CalendarEvent {
  const start = Date.parse(a.start)
  const how = a.mode === 'telephone' ? `${site.founder.name} t'appelle au ${a.phone ?? 'numéro indiqué'}.` : "Le lien de la visio t'est envoyé par e-mail avant le rendez-vous."
  return {
    uid: `${a.id}@${new URL(site.url).host}`,
    start,
    end: start + a.minutes * 60_000,
    summary: `Appel découverte avec ${site.founder.name} (${site.name})`,
    description: `${how}\nUn empêchement ? ${formatPhone()} · ${site.email}`,
    location: a.mode === 'telephone' ? 'Téléphone' : 'Visio',
  }
}

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
