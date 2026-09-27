'use client'

import { startTransition, useActionState, useState } from 'react'
import type { FormState } from '@/app/admin/actions'
import { addClosedDays, saveAvailability } from '@/app/admin/booking-actions'
import { type BookingSettings, defaultBookingSettings, type TimeRange, WEEKDAYS } from '@/data/booking'
import { fromMinutes, frTime, toMinutes } from '@/lib/booking/time'
import { FormMessage } from './FormMessage'

const SLOTS = [15, 20, 30, 45, 60]
const NOTICES = [1, 2, 4, 12, 24, 48]
const HORIZONS = [7, 14, 30, 60, 90]
const time = 'input w-[6.5rem] px-2.5 py-2'
/** Heures proposées : toutes les demi-heures de 6 h à 22 h. */
const HOURS = Array.from({ length: 33 }, (_, i) => fromMinutes(6 * 60 + i * 30))
/** Plages proposées quand tu ouvres un jour jusque-là fermé (celles d'un lundi par défaut). */
const USUAL = defaultBookingSettings.week['1']

type Day = (typeof WEEKDAYS)[number]

/** Matin et après-midi d'un jour : deux plages au plus, rangées par heure de début. */
function split(ranges: TimeRange[]) {
  if (ranges.length === 2) return ranges
  const [only] = ranges
  if (!only) return []
  return toMinutes(only.start) < 13 * 60 ? [only] : [undefined, only]
}

/** Plages horaires ouvertes à la réservation, jour par jour, et règles de réservation. */
export function AvailabilityForm({ settings }: { settings: BookingSettings }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveAvailability, {})
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(WEEKDAYS.map((d) => [d.key, Boolean(settings.week[d.key]?.length)])),
  )
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => action(data))
      }}
      className="grid gap-6"
    >
      <div>
        {WEEKDAYS.map((d) => {
          const saved = settings.week[d.key] ?? []
          const [am, pm] = saved.length ? split(saved) : USUAL
          return (
            <div
              key={d.key}
              role="group"
              aria-label={d.label}
              className="grid gap-x-4 gap-y-2 border-t border-bord py-3 first:border-0 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-center"
            >
              <label className="flex items-center gap-3 font-medium text-txt-primary">
                <input
                  type="checkbox"
                  name={`open-${d.key}`}
                  checked={open[d.key]}
                  onChange={(e) => setOpen((current) => ({ ...current, [d.key]: e.target.checked }))}
                  className="h-5 w-5 accent-emerald-500"
                />
                {d.label}
              </label>
              {open[d.key] ? (
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <Range day={d} part="am" label="Matin" range={am} />
                  <Range day={d} part="pm" label="Après-midi" range={pm} />
                </div>
              ) : (
                <p className="text-sm text-txt-muted">Fermé</p>
              )}
            </div>
          )
        })}
      </div>

      <div className="grid items-end gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="slotMinutes" className="label">
            Durée d&apos;un rendez-vous
          </label>
          <select id="slotMinutes" name="slotMinutes" defaultValue={settings.slotMinutes} className="input">
            {SLOTS.map((v) => (
              <option key={v} value={v}>
                {v} minutes
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="noticeHours" className="label">
            Délai minimum
          </label>
          <select id="noticeHours" name="noticeHours" defaultValue={settings.noticeHours} className="input">
            {NOTICES.map((v) => (
              <option key={v} value={v}>
                {v} heure{v > 1 ? 's' : ''} avant
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="horizonDays" className="label">
            Réservable jusqu&apos;à
          </label>
          <select id="horizonDays" name="horizonDays" defaultValue={settings.horizonDays} className="input">
            {HORIZONS.map((v) => (
              <option key={v} value={v}>
                {v} jours à l&apos;avance
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm text-txt-primary">
        <input type="checkbox" name="paused" defaultChecked={settings.paused} className="mt-0.5 h-5 w-5 accent-emerald-500" />
        <span>
          Mettre les réservations en pause
          <span className="block text-txt-muted">Vacances, surcharge&nbsp;: la page propose alors de t&apos;appeler ou de t&apos;écrire.</span>
        </span>
      </label>

      <FormMessage state={state} />
      <button type="submit" className="btn-primary btn-sm justify-self-start" disabled={pending}>
        {pending ? 'Enregistrement…' : 'Enregistrer mes disponibilités'}
      </button>
    </form>
  )
}

function Range({ day, part, label, range }: { day: Day; part: 'am' | 'pm'; label: string; range?: TimeRange }) {
  const name = label.toLowerCase()
  return (
    <span className="flex items-center gap-2">
      <span className="w-[4.75rem] text-sm text-txt-muted">{label}</span>
      <TimeSelect name={`${part}-start-${day.key}`} label={`${day.label}, ${name} : début`} value={range?.start} />
      <span aria-hidden="true" className="text-txt-muted">
        –
      </span>
      <TimeSelect name={`${part}-end-${day.key}`} label={`${day.label}, ${name} : fin`} value={range?.end} />
    </span>
  )
}

/** Liste d'heures au format français (« 9 h 30 »), quelle que soit la langue du navigateur. « — » : pas de plage. */
function TimeSelect({ name, label, value }: { name: string; label: string; value?: string }) {
  const options = value && !HOURS.includes(value) ? [...HOURS, value].sort() : HOURS
  return (
    <select name={name} defaultValue={value ?? ''} aria-label={label} className={time}>
      <option value="">—</option>
      {options.map((h) => (
        <option key={h} value={h}>
          {frTime(h)}
        </option>
      ))}
    </select>
  )
}

/** Ajout d'un jour ou d'une période fermés (congés, salon, chantier…). */
export function ClosedDaysForm({ today }: { today: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(addClosedDays, {})
  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="closed-from" className="label">
            Fermé du
          </label>
          <input id="closed-from" name="from" type="date" min={today} required className="input" />
        </div>
        <div>
          <label htmlFor="closed-to" className="label">
            Au (facultatif)
          </label>
          <input id="closed-to" name="to" type="date" min={today} className="input" />
        </div>
      </div>
      <FormMessage state={state} />
      <button type="submit" className="btn-secondary btn-sm justify-self-start" disabled={pending}>
        {pending ? 'Ajout…' : 'Ajouter'}
      </button>
    </form>
  )
}
