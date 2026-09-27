import type { Appointment } from '@/data/booking'

/** Rendez-vous à venir (celui en cours compris), du plus proche au plus lointain, et historique (passés ou annulés). */
export function splitAppointments(appointments: Appointment[], now = Date.now()) {
  const end = (a: Appointment) => Date.parse(a.start) + a.minutes * 60_000
  const upcoming = appointments.filter((a) => a.status === 'confirmed' && end(a) > now).sort((a, b) => a.start.localeCompare(b.start))
  const history = appointments.filter((a) => !upcoming.includes(a)).sort((a, b) => b.start.localeCompare(a.start))
  return { upcoming, history }
}
