'use server'

import { randomBytes } from 'node:crypto'
import { after } from 'next/server'
import { type Appointment, type AppointmentMode, TOPICS } from '@/data/booking'
import { notifyDevices } from '@/lib/admin/push'
import { readStore, updateStore } from '@/lib/admin/store'
import { purgeOld, settingsOf } from '@/lib/booking/settings'
import { whenText } from '@/lib/booking/calendar'
import { freeSlots, isFree, type SlotDay } from '@/lib/booking/slots'
import { isDate, isTime, parisToUtc } from '@/lib/booking/time'
import { bookingAlert, bookingConfirmation } from '@/lib/emails'
import { mailConfigured, sendMails } from '@/lib/mail'
import { formatPhone, site } from '@/lib/site'
import { visitorAddress } from '@/lib/visitor'

/**
 * Prise de rendez-vous publique (page /rendez-vous/) : lecture des créneaux libres et réservation.
 * Seule partie « à la demande » des pages publiques : la page elle-même reste prérendue.
 */
export type Availability = { days: SlotDay[]; minutes: number }

export async function getAvailability(): Promise<Availability> {
  const store = await readStore()
  const settings = settingsOf(store)
  return { days: freeSlots(settings, store.appointments), minutes: settings.slotMinutes }
}

/** `emailed` : un e-mail de confirmation part à la personne (envoi des e-mails configuré). */
export type Booked = { id: string; start: string; minutes: number; mode: AppointmentMode; date: string; time: string; emailed: boolean }
export type BookingState = { error?: string; conflict?: boolean; booked?: Booked }

const HOUR = 3_600_000
/** Au plus 3 réservations par heure depuis une même connexion, 30 par jour au total. */
const perVisitor = new Map<string, number[]>()
const allRecent: number[] = []

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function bookAppointment(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const field = (name: string, max: number) => String(formData.get(name) ?? '').trim().slice(0, max)
  // Champ invisible rempli : c'est un robot. On ne lui dit rien de plus.
  if (field('site_web', 200)) return { error: "La réservation n'a pas pu aboutir." }

  const date = field('date', 10)
  const time = field('time', 5)
  const mode = field('mode', 20)
  const name = field('name', 80)
  const email = field('email', 160).toLowerCase()
  const phone = field('phone', 30)
  const company = field('company', 120)
  const topic = field('topic', 60)
  const message = field('message', 1000)

  if (!isDate(date) || !isTime(time)) return { error: 'Choisis un jour et une heure.' }
  if (mode !== 'telephone' && mode !== 'visio') return { error: 'Choisis un rendez-vous par téléphone ou en visio.' }
  if (name.length < 2) return { error: 'Indique ton nom.' }
  if (!EMAIL.test(email)) return { error: 'Ton adresse e-mail semble incomplète.' }
  if (mode === 'telephone' && phone.replace(/\D/g, '').length < 9) {
    return { error: "Indique ton numéro de téléphone pour que je puisse t'appeler." }
  }
  if (!TOPICS.some((t) => t.value === topic)) return { error: "Choisis le sujet de l'échange." }

  const now = Date.now()
  const visitor = await visitorAddress()
  const mine = (perVisitor.get(visitor) ?? []).filter((t) => now - t < HOUR)
  while (allRecent.length && now - allRecent[0] > 24 * HOUR) allRecent.shift()
  if (mine.length >= 3 || allRecent.length >= 30) {
    return { error: `Trop de réservations d'un coup. Appelle-moi au ${formatPhone()} ou écris à ${site.email}.` }
  }

  const outcome: { booked?: Appointment; conflict?: boolean; tooMany?: boolean } = {}
  try {
    await updateStore((store) => {
      purgeOld(store, now)
      if (!isFree(settingsOf(store), store.appointments, date, time, now)) {
        outcome.conflict = true
        return
      }
      const upcoming = store.appointments.filter((a) => a.status === 'confirmed' && a.email === email && Date.parse(a.start) > now)
      if (upcoming.length >= 2) {
        outcome.tooMany = true
        return
      }
      const appointment: Appointment = {
        id: randomBytes(9).toString('base64url'),
        start: new Date(parisToUtc(date, time)).toISOString(),
        minutes: settingsOf(store).slotMinutes,
        mode,
        name,
        email,
        ...(phone ? { phone } : {}),
        ...(company ? { company } : {}),
        topic,
        ...(message ? { message } : {}),
        status: 'confirmed',
        createdAt: new Date(now).toISOString(),
      }
      store.appointments.push(appointment)
      outcome.booked = appointment
    })
  } catch (error) {
    console.error('rendez-vous : enregistrement impossible', error)
    return { error: `La réservation n'a pas pu être enregistrée. Appelle-moi au ${formatPhone()} ou écris à ${site.email}.` }
  }

  if (outcome.conflict) return { conflict: true, error: "Ce créneau vient d'être pris. Choisis-en un autre." }
  if (outcome.tooMany) return { error: `Tu as déjà deux rendez-vous à venir. Écris-moi à ${site.email} pour les déplacer.` }
  const booked = outcome.booked
  if (!booked) return { error: "La réservation n'a pas pu aboutir." }

  perVisitor.set(visitor, [...mine, now])
  if (perVisitor.size > 5000) perVisitor.clear()
  allRecent.push(now)
  // Notifications envoyées après la réponse : le visiteur n'attend pas.
  after(() => announce(booked))
  return { booked: { id: booked.id, start: booked.start, minutes: booked.minutes, mode, date, time, emailed: mailConfigured() } }
}

/** Te prévient d'un nouveau rendez-vous (notification et e-mail) et envoie sa confirmation à la personne. */
async function announce(a: Appointment) {
  const how = a.mode === 'telephone' ? `téléphone${a.phone ? ` (${a.phone})` : ''}` : 'visio'
  const results = await Promise.allSettled([
    notifyDevices({ title: 'Nouveau rendez-vous', body: `${a.name} · ${whenText(a)} · ${how}`, url: '/admin/rendez-vous/', tag: `rdv-${a.id}` }),
    sendMails([bookingAlert(a), bookingConfirmation(a)]),
  ])
  for (const r of results) if (r.status === 'rejected') console.error('rendez-vous : alerte non envoyée', r.reason)
}
