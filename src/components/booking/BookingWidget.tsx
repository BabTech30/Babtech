'use client'

import Link from 'next/link'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { type Availability, type Booked, type BookingState, bookAppointment, getAvailability } from '@/app/rendez-vous/actions'
import { track } from '@/components/Analytics'
import { Icon } from '@/components/Icon'
import { type AppointmentMode, MODES, TOPICS } from '@/data/booking'
import { frDay, frDayParts, frTime, icsStamp } from '@/lib/booking/time'
import { buildCalendar } from '@/lib/ics'
import { fr } from '@/lib/typography'

type Contact = { name: string; email: string; phone: string; phoneHref: string }

const choice =
  'block cursor-pointer rounded-xl border border-white/[0.1] bg-white/[0.03] transition-colors hover:border-white/25 peer-checked:border-emerald-b peer-checked:bg-emerald-b/[0.1] peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-b'
const legend = 'mb-3 font-outfit text-lg font-semibold text-white'

/**
 * Réservation d'un appel découverte : téléphone ou visio, jour, heure, coordonnées. Les créneaux
 * libres viennent du serveur (réglés dans le tableau de bord) ; la confirmation est immédiate.
 */
export function BookingWidget({ contact }: { contact: Contact }) {
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [failed, setFailed] = useState(false)
  const [reload, setReload] = useState(0)
  const [mode, setMode] = useState<AppointmentMode>('telephone')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  useEffect(() => {
    let alive = true
    getAvailability()
      .then((a) => alive && setAvailability(a))
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [reload])

  const [state, submit, pending] = useActionState(async (prev: BookingState, formData: FormData) => {
    const result = await bookAppointment(prev, formData)
    if (result.booked) track('rendez_vous', { mode: result.booked.mode })
    if (result.conflict) {
      setTime('')
      setReload((n) => n + 1)
    }
    return result
  }, {})

  if (state.booked) return <Confirmation booked={state.booked} contact={contact} />
  if (failed) return <Unavailable contact={contact} reason="Les créneaux ne se chargent pas pour le moment." />
  if (!availability) {
    return (
      <div role="status" className="grid gap-3" aria-label="Chargement des créneaux">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-white/[0.04]" />
        ))}
      </div>
    )
  }
  const { days, minutes } = availability
  if (!days.length) return <Unavailable contact={contact} reason="Aucun créneau n'est ouvert en ce moment." />

  const activeDate = days.some((d) => d.date === date) ? date : days[0].date
  const slots = days.find((d) => d.date === activeDate)?.slots ?? []
  const activeTime = slots.includes(time) ? time : ''

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => submit(data))
      }}
      className="grid gap-9"
    >
      <div aria-hidden="true" className="hidden">
        <label htmlFor="rdv-site">Ne pas remplir</label>
        <input id="rdv-site" type="text" name="site_web" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset>
        <legend className={legend}>1. Comment préfères-tu échanger&nbsp;?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {MODES.map((m) => (
            <label key={m.value}>
              <input type="radio" name="mode" value={m.value} checked={mode === m.value} onChange={() => setMode(m.value)} className="peer sr-only" />
              <span className={`${choice} flex h-full items-start gap-3 p-4`}>
                <Icon name={m.value === 'telephone' ? 'phone' : 'app'} className="mt-0.5 h-5 w-5 shrink-0 text-emerald-b" />
                <span>
                  <span className="block font-semibold text-white">{m.label}</span>
                  <span className="block text-sm text-txt-secondary">{m.hint}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={legend}>2. Choisis un jour</legend>
        <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2">
          {days.map((d) => {
            const p = frDayParts(d.date)
            return (
              <label key={d.date} className="shrink-0 snap-start">
                <input
                  type="radio"
                  name="date"
                  value={d.date}
                  checked={activeDate === d.date}
                  onChange={() => {
                    setDate(d.date)
                    setTime('')
                  }}
                  aria-label={`${frDay(d.date)}, ${d.slots.length} créneau${d.slots.length > 1 ? 'x' : ''}`}
                  className="peer sr-only"
                />
                <span className={`${choice} flex w-[76px] flex-col items-center py-3 text-center`}>
                  <span className="text-xs uppercase tracking-wide text-txt-secondary">{p.weekday}</span>
                  <span className="font-outfit text-2xl font-bold leading-tight text-white">{p.day}</span>
                  <span className="text-xs text-txt-secondary">{p.month}</span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className={legend}>3. Choisis l&apos;heure</legend>
        <p className="-mt-1 mb-3 text-sm text-txt-secondary">
          {fr(`${frDay(activeDate)}, heure de Paris. Durée : ${minutes} minutes.`)}
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {slots.map((t) => (
            <label key={t}>
              <input type="radio" name="time" value={t} checked={activeTime === t} onChange={() => setTime(t)} required className="peer sr-only" />
              <span className={`${choice} py-2.5 text-center font-medium text-white`}>{frTime(t)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className={legend}>4. Tes coordonnées</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="rdv-name" className="label">
              Nom <span className="text-emerald-b">*</span>
            </label>
            <input id="rdv-name" name="name" required minLength={2} maxLength={80} autoComplete="name" className="input" placeholder="Ton nom" />
          </div>
          <div>
            <label htmlFor="rdv-email" className="label">
              E-mail <span className="text-emerald-b">*</span>
            </label>
            <input id="rdv-email" name="email" type="email" required maxLength={160} autoComplete="email" className="input" placeholder="ton@email.fr" />
          </div>
          <div>
            <label htmlFor="rdv-phone" className="label">
              Téléphone {mode === 'telephone' && <span className="text-emerald-b">*</span>}
            </label>
            <input
              id="rdv-phone"
              name="phone"
              type="tel"
              required={mode === 'telephone'}
              maxLength={30}
              autoComplete="tel"
              className="input"
              placeholder={mode === 'telephone' ? "Pour que je t'appelle" : 'Facultatif'}
            />
          </div>
          <div>
            <label htmlFor="rdv-company" className="label">
              Entreprise / activité
            </label>
            <input id="rdv-company" name="company" maxLength={120} autoComplete="organization" className="input" placeholder="Ex. plomberie, gîte…" />
          </div>
        </div>
        <div>
          <label htmlFor="rdv-topic" className="label">
            Sujet <span className="text-emerald-b">*</span>
          </label>
          <select id="rdv-topic" name="topic" required defaultValue="" className="input cursor-pointer appearance-none">
            <option value="" disabled>
              Choisis un sujet
            </option>
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rdv-message" className="label">
            Un mot sur ton projet (facultatif)
          </label>
          <textarea id="rdv-message" name="message" rows={3} maxLength={1000} className="input resize-y" placeholder="Où tu en es, ce que tu aimerais obtenir…" />
        </div>
      </fieldset>

      <div className="grid gap-4">
        <div aria-live="polite">
          {state.error && (
            <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/[0.08] p-4 text-sm text-red-200">
              {fr(state.error)}
            </p>
          )}
        </div>
        <button type="submit" disabled={pending || !activeTime} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
          <Icon name="calendar" className="h-[18px] w-[18px]" />
          {pending
            ? 'Réservation en cours…'
            : activeTime
              ? `Réserver le ${frDay(activeDate, 'short')} à ${frTime(activeTime)}`
              : 'Choisis une heure pour réserver'}
        </button>
        <p className="text-xs leading-relaxed text-txt-muted">
          Tes informations servent uniquement à préparer notre échange. Voir la{' '}
          <Link href="/confidentialite" className="underline hover:text-white">
            politique de confidentialité
          </Link>
          .
        </p>
      </div>
    </form>
  )
}

function Confirmation({ booked, contact }: { booked: Booked; contact: Contact }) {
  const start = Date.parse(booked.start)
  const end = start + booked.minutes * 60_000
  const summary = `Appel découverte avec ${contact.name} (BabTech)`
  const how = booked.mode === 'telephone' ? `${contact.name} t'appelle au numéro que tu as indiqué.` : "Le lien de visio t'est envoyé par e-mail avant le rendez-vous."
  const description = `${how}\nUn empêchement ? ${contact.phone} · ${contact.email}`
  const ics = buildCalendar('BabTech', [
    { uid: `${booked.id}@babtech.fr`, start, end, summary, description, location: booked.mode === 'telephone' ? 'Téléphone' : 'Visio' },
  ])
  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(summary)}&dates=${icsStamp(start)}/${icsStamp(end)}&details=${encodeURIComponent(description)}`

  return (
    <div role="status" className="rounded-2xl border border-emerald-b/30 bg-emerald-b/[0.08] p-7 text-center sm:p-9">
      <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-b/20 text-emerald-b">
        <Icon name="check" className="h-6 w-6" />
      </span>
      <p className="mb-2 font-outfit text-2xl font-semibold text-white">C&apos;est réservé&nbsp;!</p>
      <p className="mb-1 text-lg text-txt-primary">
        {frDay(booked.date)} à {frTime(booked.time)}
      </p>
      <p className="mb-6 text-[15px] text-txt-secondary">
        {fr(`Heure de Paris, ${booked.minutes} minutes, ${booked.mode === 'telephone' ? 'par téléphone' : 'en visio'}. ${how}`)}
        {booked.emailed && <span className="mt-1 block">{fr('Un e-mail de confirmation part à ton adresse, avec le rendez-vous à ajouter à ton agenda.')}</span>}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <a href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`} download="rendez-vous-babtech.ics" className="btn-primary btn-sm">
          <Icon name="calendar" className="h-4 w-4" />
          Ajouter à mon agenda
        </a>
        <a href={google} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm">
          Google Agenda
          <Icon name="external" className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-6 text-sm text-txt-secondary">
        Un empêchement&nbsp;? Appelle le{' '}
        <a href={contact.phoneHref} className="font-medium text-white underline">
          {contact.phone}
        </a>{' '}
        ou écris à{' '}
        <a href={`mailto:${contact.email}`} className="font-medium text-white underline">
          {contact.email}
        </a>
        .
      </p>
    </div>
  )
}

function Unavailable({ contact, reason }: { contact: Contact; reason: string }) {
  return (
    <div className="rounded-2xl border border-bord bg-white/[0.03] p-7 text-center">
      <p className="mb-2 font-outfit text-xl font-semibold text-white">{fr(reason)}</p>
      <p className="mb-6 text-[15px] leading-relaxed text-txt-secondary">
        Pas de souci&nbsp;: appelle-moi directement ou écris-moi, je te réponds sous 24&nbsp;heures.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <a href={contact.phoneHref} className="btn-primary btn-sm">
          <Icon name="phone" className="h-4 w-4" />
          {contact.phone}
        </a>
        <Link href="/contact" className="btn-secondary btn-sm">
          Écrire un message
        </Link>
      </div>
    </div>
  )
}
