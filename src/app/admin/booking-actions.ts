'use server'

import { randomBytes } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { after } from 'next/server'
import { type Appointment, type BookingSettings, type TimeRange, WEEKDAYS } from '@/data/booking'
import { requireAdmin } from '@/lib/admin/auth'
import { notifyDevices, vapidKeys } from '@/lib/admin/push'
import { updateStore } from '@/lib/admin/store'
import { purgeOld, settingsOf } from '@/lib/booking/settings'
import { addDays, isDate, isTime, toMinutes, utcToParis } from '@/lib/booking/time'
import { bookingCancelled } from '@/lib/emails'
import { sendMails } from '@/lib/mail'
import type { FormState } from './actions'

/** Actions du tableau de bord pour les rendez-vous (toutes réservées à la personne connectée). */
const PAGE = '/admin/rendez-vous/'
const WRITE_ERROR = "Enregistrement impossible : le serveur refuse l'écriture des données (voir Réglages)."

/** Annule un rendez-vous ; la personne est prévenue par e-mail (si l'envoi est configuré), après la réponse. */
export async function cancelAppointment(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  let cancelled: Appointment | undefined
  try {
    await updateStore((store) => {
      purgeOld(store)
      const appointment = store.appointments.find((a) => a.id === id)
      if (appointment && appointment.status === 'confirmed') {
        appointment.status = 'cancelled'
        appointment.cancelledAt = new Date().toISOString()
        cancelled = { ...appointment }
      }
    })
  } catch (error) {
    console.error('rendez-vous : annulation non enregistrée', error)
  }
  const notice = cancelled
  if (notice && Date.parse(notice.start) > Date.now()) after(() => sendMails([bookingCancelled(notice)]))
  revalidatePath(PAGE)
  revalidatePath('/admin/')
}

const SLOT_CHOICES = [15, 20, 30, 45, 60]
const NOTICE_CHOICES = [1, 2, 4, 12, 24, 48]
const HORIZON_CHOICES = [7, 14, 30, 60, 90]

export async function saveAvailability(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const week: Record<string, TimeRange[]> = {}
  for (const day of WEEKDAYS) {
    const ranges: TimeRange[] = []
    if (formData.get(`open-${day.key}`) === 'on') {
      for (const part of ['am', 'pm']) {
        const start = String(formData.get(`${part}-start-${day.key}`) ?? '')
        const end = String(formData.get(`${part}-end-${day.key}`) ?? '')
        if (!start && !end) continue
        if (!isTime(start) || !isTime(end) || toMinutes(start) >= toMinutes(end)) {
          return { error: `${day.label} : chaque plage doit avoir une heure de début avant l'heure de fin.` }
        }
        ranges.push({ start, end })
      }
      if (ranges.length === 2 && toMinutes(ranges[0].end) > toMinutes(ranges[1].start)) {
        return { error: `${day.label} : la plage de l'après-midi doit commencer après celle du matin.` }
      }
      if (!ranges.length) return { error: `${day.label} est ouvert : indique au moins une plage horaire.` }
    }
    week[day.key] = ranges
  }
  const slotMinutes = Number(formData.get('slotMinutes'))
  const noticeHours = Number(formData.get('noticeHours'))
  const horizonDays = Number(formData.get('horizonDays'))
  if (!SLOT_CHOICES.includes(slotMinutes) || !NOTICE_CHOICES.includes(noticeHours) || !HORIZON_CHOICES.includes(horizonDays)) {
    return { error: 'Choisis une durée, un délai et une période parmi les valeurs proposées.' }
  }
  const paused = formData.get('paused') === 'on'
  try {
    await updateStore((store) => {
      const current = settingsOf(store)
      const next: BookingSettings = { ...current, week, slotMinutes, noticeHours, horizonDays, paused }
      store.booking = next
    })
  } catch {
    return { error: WRITE_ERROR }
  }
  revalidatePath(PAGE)
  return { ok: paused ? 'Enregistré. Les réservations sont en pause.' : 'Disponibilités enregistrées.' }
}

export async function addClosedDays(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const from = String(formData.get('from') ?? '')
  const to = String(formData.get('to') ?? '') || from
  if (!isDate(from) || !isDate(to) || to < from) return { error: 'Choisis une date de début, et une date de fin après celle-ci.' }
  const today = utcToParis(Date.now()).date
  const dates: string[] = []
  for (let d = from < today ? today : from; d <= to && dates.length <= 120; d = addDays(d, 1)) dates.push(d)
  if (!dates.length) return { error: 'Ces dates sont déjà passées.' }
  if (dates.length > 120) return { error: 'Période trop longue : 120 jours au plus à la fois.' }
  try {
    await updateStore((store) => {
      const current = settingsOf(store)
      const closedDays = Array.from(new Set([...current.closedDays.filter((d) => d >= today), ...dates])).sort()
      store.booking = { ...current, closedDays }
    })
  } catch {
    return { error: WRITE_ERROR }
  }
  revalidatePath(PAGE)
  return { ok: dates.length > 1 ? `${dates.length} jours fermés ajoutés.` : 'Jour fermé ajouté.' }
}

/** Rouvre un jour fermé, ou toute une période (du … au …). */
export async function reopenDays(formData: FormData) {
  await requireAdmin()
  const from = String(formData.get('from') ?? '')
  const to = String(formData.get('to') ?? '') || from
  if (!isDate(from) || !isDate(to)) return
  try {
    await updateStore((store) => {
      const current = settingsOf(store)
      store.booking = { ...current, closedDays: current.closedDays.filter((d) => d < from || d > to) }
    })
  } catch (error) {
    console.error('rendez-vous : jours fermés non rouverts', error)
  }
  revalidatePath(PAGE)
}

/** Clé publique du serveur, demandée par le navigateur pour s'abonner (créée au premier besoin). */
export async function pushPublicKey(): Promise<string | null> {
  await requireAdmin()
  try {
    return (await vapidKeys()).publicKey
  } catch (error) {
    console.error('notifications : clés du serveur non enregistrées', error)
    return null
  }
}

type DeviceInput = { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } }

/** Abonne l'appareil utilisé aux notifications (appelé par le bouton « Activer les notifications »). */
export async function savePushDevice(subscription: DeviceInput): Promise<FormState> {
  await requireAdmin()
  const endpoint = typeof subscription?.endpoint === 'string' ? subscription.endpoint : ''
  const p256dh = typeof subscription?.keys?.p256dh === 'string' ? subscription.keys.p256dh : ''
  const auth = typeof subscription?.keys?.auth === 'string' ? subscription.keys.auth : ''
  if (!/^https:\/\/\S{10,2000}$/.test(endpoint) || !/^[\w-]{20,200}$/.test(p256dh) || !/^[\w-]{8,100}$/.test(auth)) {
    return { error: "Abonnement refusé : le navigateur n'a pas fourni de clés valides." }
  }
  const agent = (await headers()).get('user-agent') ?? ''
  const label = /iPhone|iPad/.test(agent)
    ? 'iPhone ou iPad'
    : /Android/.test(agent)
      ? 'Android'
      : /Macintosh/.test(agent)
        ? 'Mac'
        : /Windows/.test(agent)
          ? 'Windows'
          : 'Appareil'
  try {
    await updateStore((store) => {
      store.push.devices = [
        ...store.push.devices.filter((d) => d.endpoint !== endpoint),
        { endpoint, keys: { p256dh, auth }, createdAt: new Date().toISOString(), label },
      ].slice(-10)
    })
  } catch {
    return { error: WRITE_ERROR }
  }
  revalidatePath(PAGE)
  return { ok: 'Notifications activées sur cet appareil.' }
}

export async function removePushDevice(endpoint: string): Promise<FormState> {
  await requireAdmin()
  try {
    await updateStore((store) => {
      store.push.devices = store.push.devices.filter((d) => d.endpoint !== endpoint)
    })
  } catch {
    return { error: WRITE_ERROR }
  }
  revalidatePath(PAGE)
  return { ok: 'Appareil retiré : il ne reçoit plus les notifications.' }
}

export async function sendTestNotification(): Promise<FormState> {
  await requireAdmin()
  const { sent, total } = await notifyDevices({
    title: 'Test BabTech',
    body: 'Les notifications de nouveaux rendez-vous arrivent bien sur cet appareil.',
    url: PAGE,
    tag: 'test',
  })
  if (!total) return { error: "Aucun appareil abonné : active d'abord les notifications." }
  return sent === total ? { ok: `Notification envoyée (${sent} appareil${sent > 1 ? 's' : ''}).` } : { error: `Envoyée à ${sent} appareil(s) sur ${total}.` }
}

/** Nouveau lien d'agenda privé : l'ancien cesse de fonctionner (à faire si le lien a été partagé par erreur). */
export async function resetCalendarToken() {
  await requireAdmin()
  try {
    await updateStore((store) => {
      store.calendarToken = randomBytes(24).toString('base64url')
    })
  } catch (error) {
    console.error('agenda : nouveau lien non enregistré', error)
  }
  revalidatePath(PAGE)
}
