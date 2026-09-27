import type { Metadata } from 'next'
import { AvailabilityForm, ClosedDaysForm } from '@/components/admin/AvailabilityForm'
import { CancelAppointmentButton } from '@/components/admin/CancelAppointmentButton'
import { CopyButton } from '@/components/admin/CopyButton'
import { PushSetup } from '@/components/admin/PushSetup'
import { Icon } from '@/components/Icon'
import { type Appointment, type AppointmentMode, topicLabel } from '@/data/booking'
import { requireAdmin } from '@/lib/admin/auth'
import { formatDay, todayInParis } from '@/lib/admin/format'
import { readStore } from '@/lib/admin/store'
import { splitAppointments } from '@/lib/booking/appointments'
import { appointmentEvent } from '@/lib/booking/calendar'
import { settingsOf } from '@/lib/booking/settings'
import { addDays, frDay, frTime, utcToParis } from '@/lib/booking/time'
import { buildCalendar } from '@/lib/ics'
import { absoluteUrl, site, telLink } from '@/lib/site'
import { reopenDays, resetCalendarToken } from '../../booking-actions'

export const metadata: Metadata = { title: { absolute: 'Rendez-vous · BabTech' } }

const panel = 'rounded-2xl border border-bord bg-nuit p-5 sm:p-6'
const h2 = 'font-outfit text-lg font-semibold tracking-tight text-white'
const link = 'text-emerald-300 hover:underline'

export default async function AppointmentsPage() {
  await requireAdmin()
  const store = await readStore()
  const settings = settingsOf(store)
  const today = todayInParis()
  const { upcoming, history } = splitAppointments(store.appointments)
  const days = new Map<string, Appointment[]>()
  for (const a of upcoming) {
    const { date } = utcToParis(Date.parse(a.start))
    days.set(date, [...(days.get(date) ?? []), a])
  }
  const closed = ranges(settings.closedDays.filter((d) => d >= today))
  const devices = store.push.devices.map((d) => ({ endpoint: d.endpoint, label: d.label, since: formatDay(d.createdAt.slice(0, 10)) }))
  const publicUrl = absoluteUrl(site.bookingPath)
  const feedUrl = store.calendarToken ? absoluteUrl(`/admin/agenda/${store.calendarToken}.ics`) : null

  const dayTitle = (date: string) =>
    date === today ? `Aujourd'hui · ${frDay(date)}` : date === addDays(today, 1) ? `Demain · ${frDay(date)}` : frDay(date)

  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <p className="section-tag text-emerald-b">Administration</p>
        <h1 className="font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">Rendez-vous</h1>
        <p className="mt-3 max-w-2xl text-txt-secondary">
          Les appels découverte réservés sur ta page de rendez-vous. Chaque réservation t&apos;envoie une notification et un e-mail&nbsp;;
          le créneau disparaît aussitôt de la page.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a href={site.bookingPath} target="_blank" rel="noopener" className="btn-secondary btn-sm">
            Voir la page publique ↗
          </a>
          <CopyButton text={publicUrl} />
        </div>
      </div>

      {settings.paused && (
        <p role="status" className="rounded-xl border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-txt-primary">
          Les réservations sont en pause&nbsp;: la page publique propose de t&apos;appeler ou de t&apos;écrire. Décoche «&nbsp;Mettre les
          réservations en pause&nbsp;» dans tes disponibilités pour les rouvrir.
        </p>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section className={panel} aria-labelledby="upcoming-title">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="upcoming-title" className={h2}>
              À venir
            </h2>
            <p className="text-sm tabular-nums text-txt-muted">
              {upcoming.length} rendez-vous
            </p>
          </div>
          {days.size ? (
            <div className="mt-4 grid gap-5">
              {Array.from(days).map(([date, list]) => (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-txt-secondary first-letter:uppercase">{dayTitle(date)}</h3>
                  <ul className="mt-2 grid gap-2.5">
                    {list.map((a) => (
                      <AppointmentCard key={a.id} appointment={a} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-txt-secondary">
              Aucun rendez-vous à venir. Partage ta page de rendez-vous dans tes e-mails, ta signature et tes messages&nbsp;: chaque
              réservation apparaîtra ici.
            </p>
          )}
        </section>

        <div className="grid grid-cols-1 gap-6">
          <section className={panel} aria-labelledby="push-title">
            <h2 id="push-title" className={h2}>
              Notifications
            </h2>
            <PushSetup devices={devices} />
          </section>

          <section className={panel} aria-labelledby="calendar-title">
            <h2 id="calendar-title" className={h2}>
              Dans l&apos;agenda de ton téléphone
            </h2>
            {feedUrl ? (
              <>
                <p className="mt-2 text-sm text-txt-secondary">
                  Abonne ton agenda à ce lien privé&nbsp;: les rendez-vous y apparaissent tout seuls. Ne le partage pas, il donne accès aux
                  coordonnées des personnes.
                </p>
                <p className="mt-3 break-all rounded-lg bg-white/[0.04] px-3 py-2 font-mono text-xs text-txt-primary">{feedUrl}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={feedUrl.replace(/^https?:/, 'webcal:')} className="btn-primary btn-sm">
                    S&apos;abonner sur cet appareil
                  </a>
                  <CopyButton text={feedUrl} />
                </div>
                <ul className="mt-4 grid gap-2 text-sm text-txt-secondary">
                  <li>
                    <strong className="text-txt-primary">iPhone, iPad, Mac&nbsp;:</strong> touche «&nbsp;S&apos;abonner sur cet appareil&nbsp;»,
                    puis confirme dans l&apos;agenda.
                  </li>
                  <li>
                    <strong className="text-txt-primary">Google Agenda&nbsp;:</strong> sur ordinateur, «&nbsp;Autres agendas&nbsp;» →
                    «&nbsp;+&nbsp;» → «&nbsp;À partir de l&apos;URL&nbsp;», puis colle le lien. Google peut mettre plusieurs heures à afficher
                    un nouveau rendez-vous&nbsp;: la notification, elle, arrive tout de suite.
                  </li>
                </ul>
                <form action={resetCalendarToken} className="mt-4">
                  <button type="submit" className="text-sm text-txt-secondary underline hover:text-white">
                    Changer de lien (l&apos;ancien cesse de fonctionner)
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-txt-secondary">
                  Un lien privé que l&apos;agenda de ton téléphone (Apple, Google, Outlook) consulte régulièrement&nbsp;: tes rendez-vous y
                  apparaissent tout seuls.
                </p>
                <form action={resetCalendarToken} className="mt-4">
                  <button type="submit" className="btn-primary btn-sm">
                    Créer mon lien d&apos;agenda
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section className={panel} aria-labelledby="availability-title">
          <h2 id="availability-title" className={h2}>
            Disponibilités
          </h2>
          <p className="mt-2 mb-5 text-sm text-txt-secondary">
            Heures de Paris. Les créneaux proposés suivent ces plages, moins les rendez-vous déjà pris et les jours fermés.
          </p>
          <AvailabilityForm settings={settings} />
        </section>

        <section className={panel} aria-labelledby="closed-title">
          <h2 id="closed-title" className={h2}>
            Jours fermés
          </h2>
          <p className="mt-2 mb-5 text-sm text-txt-secondary">
            Congés, salon, chantier&nbsp;: aucun créneau proposé ces jours-là. Les rendez-vous déjà pris restent, annule-les si besoin.
          </p>
          <ClosedDaysForm today={today} />
          {closed.length ? (
            <ul className="mt-5 border-t border-bord">
              {closed.map((r) => {
                const label = r.from === r.to ? frDay(r.from) : `du ${frDay(r.from)} au ${frDay(r.to)}`
                return (
                  <li key={r.from} className="flex items-center justify-between gap-3 border-b border-bord py-2.5 last:border-0">
                    <span className="text-txt-primary first-letter:uppercase">{label}</span>
                    <form action={reopenDays}>
                      <input type="hidden" name="from" value={r.from} />
                      <input type="hidden" name="to" value={r.to} />
                      <button type="submit" aria-label={`Rouvrir : ${label}`} className="text-sm text-txt-secondary underline hover:text-white">
                        Rouvrir
                      </button>
                    </form>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-txt-muted">Aucun jour fermé à venir.</p>
          )}
        </section>
      </div>

      <details className={`${panel} group`}>
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 [&::-webkit-details-marker]:hidden">
          <Icon name="arrow-right" className="h-4 w-4 shrink-0 text-txt-muted transition-transform group-open:rotate-90" />
          <h2 className={h2}>Historique</h2>
          <span className="text-sm text-txt-muted">
            {history.length || 'Aucun'} rendez-vous passé{history.length > 1 ? 's' : ''} ou annulé{history.length > 1 ? 's' : ''} sur les 12
            derniers mois
          </span>
        </summary>
        {history.length ? (
          <div tabIndex={0} role="region" aria-label="Historique des rendez-vous" className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Rendez-vous passés ou annulés, du plus récent au plus ancien</caption>
              <thead className="text-xs uppercase tracking-[1px] text-txt-muted">
                <tr>
                  <th scope="col" className="py-2 pr-3 font-semibold">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Personne
                  </th>
                  <th scope="col" className="px-3 py-2 font-semibold">
                    Sujet
                  </th>
                  <th scope="col" className="py-2 pl-3 font-semibold">
                    État
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((a) => {
                  const { date, time } = utcToParis(Date.parse(a.start))
                  return (
                    <tr key={a.id} className="border-t border-bord align-top">
                      <td className="py-2.5 pr-3 tabular-nums text-txt-primary">
                        {frDay(date, 'short')} {date.slice(0, 4)}, {frTime(time)}
                      </td>
                      <td className="px-3 py-2.5 text-txt-primary">
                        {a.name}
                        <a href={`mailto:${a.email}`} className="block break-all text-xs text-emerald-300 hover:underline">
                          {a.email}
                        </a>
                      </td>
                      <td className="px-3 py-2.5 text-txt-secondary">
                        <ModeChip mode={a.mode} /> {topicLabel(a.topic)}
                      </td>
                      <td className="py-2.5 pl-3 text-txt-secondary">{a.status === 'cancelled' ? 'Annulé' : 'Passé'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-txt-muted">Rien pour l&apos;instant.</p>
        )}
      </details>
    </div>
  )
}

/** Jours fermés consécutifs regroupés en périodes : « du 3 août au 14 août ». */
function ranges(days: string[]) {
  const out: { from: string; to: string }[] = []
  for (const day of [...days].sort()) {
    const last = out[out.length - 1]
    if (last && addDays(last.to, 1) === day) last.to = day
    else out.push({ from: day, to: day })
  }
  return out
}

function ModeChip({ mode }: { mode: AppointmentMode }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${mode === 'telephone' ? 'bg-emerald-b/15 text-emerald-300' : 'bg-sky-400/15 text-sky-300'}`}
    >
      {mode === 'telephone' ? 'Téléphone' : 'Visio'}
    </span>
  )
}

function mailto(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function AppointmentCard({ appointment: a }: { appointment: Appointment }) {
  const start = Date.parse(a.start)
  const { date, time } = utcToParis(start)
  const until = utcToParis(start + a.minutes * 60_000).time
  const when = `${frDay(date)} à ${frTime(time)}`
  const first = a.name.split(/\s+/)[0]
  const email =
    a.mode === 'visio'
      ? mailto(a.email, `Lien de notre visio du ${when}`, `Bonjour ${first},\n\nVoici le lien de notre visio du ${when} :\n\n\nÀ bientôt,\n${site.founder.name}`)
      : mailto(a.email, `Notre rendez-vous du ${when}`, `Bonjour ${first},\n\n`)
  const ics = `data:text/calendar;charset=utf-8,${encodeURIComponent(buildCalendar('Rendez-vous BabTech', [appointmentEvent(a)]))}`

  return (
    <li className="grid grid-cols-1 gap-3 rounded-xl border border-bord bg-nuit-deep p-4 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto]">
      <p className="font-outfit text-lg font-semibold leading-tight tabular-nums text-white">
        {frTime(time)}
        <span className="block text-xs font-normal text-txt-muted">jusqu&apos;à {frTime(until)}</span>
      </p>
      <div className="min-w-0">
        <p className="font-medium text-white">
          {a.name}
          {a.company && <span className="font-normal text-txt-secondary"> · {a.company}</span>}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-txt-secondary">
          <ModeChip mode={a.mode} />
          {topicLabel(a.topic)}
        </p>
        {a.message && <p className="mt-2 whitespace-pre-line break-words rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-txt-primary">{a.message}</p>}
        <ul className="mt-2 grid gap-1 text-sm">
          {a.phone && (
            <li className="flex items-center gap-2">
              <Icon name="phone" className="h-4 w-4 shrink-0 text-txt-muted" />
              <a href={telLink(a.phone)} className={link}>
                <span className="sr-only">Appeler le </span>
                {a.phone}
              </a>
            </li>
          )}
          <li className="flex min-w-0 items-center gap-2">
            <Icon name="mail" className="h-4 w-4 shrink-0 text-txt-muted" />
            <a href={`mailto:${a.email}`} className={`${link} min-w-0 break-all`}>
              <span className="sr-only">Écrire à </span>
              {a.email}
            </a>
          </li>
        </ul>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <a href={email} className={link}>
            {a.mode === 'visio' ? 'Envoyer le lien de visio' : 'Préparer un e-mail'}
            <span className="sr-only"> à {a.name}</span>
          </a>
          <a href={ics} download={`rendez-vous-${date}-${time.replace(':', 'h')}.ics`} className={link}>
            Ajouter à mon agenda
          </a>
        </p>
      </div>
      <div className="sm:justify-self-end">
        <CancelAppointmentButton id={a.id} name={a.name} />
      </div>
    </li>
  )
}
