import type { Appointment, BookingSettings } from '@/data/booking'
import { addDays, fromMinutes, isoWeekday, parisToUtc, toMinutes, utcToParis } from './time'

export type SlotDay = { date: string; slots: string[] }

/**
 * Créneaux libres : plages de la semaine, moins les jours fermés, le délai minimum et les
 * rendez-vous déjà pris.
 */
export function freeSlots(settings: BookingSettings, appointments: Appointment[], now = Date.now()): SlotDay[] {
  if (settings.paused) return []
  const earliest = now + settings.noticeHours * 3_600_000
  const today = utcToParis(now).date
  const busy = appointments
    .filter((a) => a.status === 'confirmed')
    .map((a) => {
      const start = Date.parse(a.start)
      return [start, start + a.minutes * 60_000] as const
    })
  const days: SlotDay[] = []
  for (let i = 0; i <= settings.horizonDays; i++) {
    const date = addDays(today, i)
    if (settings.closedDays.includes(date)) continue
    const slots: string[] = []
    for (const range of settings.week[String(isoWeekday(date))] ?? []) {
      for (let t = toMinutes(range.start); t + settings.slotMinutes <= toMinutes(range.end); t += settings.slotMinutes) {
        const time = fromMinutes(t)
        const start = parisToUtc(date, time)
        const end = start + settings.slotMinutes * 60_000
        if (start < earliest || busy.some(([s, e]) => start < e && end > s)) continue
        slots.push(time)
      }
    }
    if (slots.length) days.push({ date, slots })
  }
  return days
}

export function isFree(settings: BookingSettings, appointments: Appointment[], date: string, time: string, now = Date.now()) {
  return freeSlots(settings, appointments, now).some((day) => day.date === date && day.slots.includes(time))
}
