import { APPOINTMENT_RETENTION_DAYS, type BookingSettings, defaultBookingSettings } from '@/data/booking'
import type { AdminStore } from '@/lib/admin/store'

/** Réglages en vigueur : ceux du tableau de bord, complétés par ceux de départ. */
export function settingsOf(store: AdminStore): BookingSettings {
  return { ...defaultBookingSettings, ...store.booking }
}

/** Efface les rendez-vous de plus de 12 mois (à appeler dans chaque écriture qui touche aux rendez-vous). */
export function purgeOld(store: AdminStore, now = Date.now()) {
  const limit = now - APPOINTMENT_RETENTION_DAYS * 86_400_000
  store.appointments = store.appointments.filter((a) => Date.parse(a.start) >= limit)
}
