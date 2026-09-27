import type { Metadata } from 'next'
import Link from 'next/link'
import { ConfirmForm } from '@/components/admin/ConfirmForm'
import { type InboxRequest, SOURCE_LABELS, STATUSES } from '@/data/requests'
import { requireAdmin } from '@/lib/admin/auth'
import { formatDay } from '@/lib/admin/format'
import { readStore } from '@/lib/admin/store'
import { frTime, utcToParis } from '@/lib/booking/time'
import { MAIL_FROM, mailConfigured } from '@/lib/mail'
import { telLink } from '@/lib/site'
import { deleteRequest, saveRequestNote, setRequestStatus } from '../../request-actions'

export const metadata: Metadata = { title: { absolute: 'Demandes · BabTech' } }

type Search = { statut?: string }

const panel = 'rounded-2xl border border-bord bg-nuit p-5 sm:p-6'
const link = 'text-emerald-300 hover:underline'
const small = 'rounded-lg border border-white/[0.12] px-3 py-1.5 text-sm font-medium text-txt-primary hover:border-white/30 hover:text-white'

const FILTERS = [
  { value: 'a-traiter', label: 'À traiter', match: (r: InboxRequest) => r.status !== 'done' },
  { value: 'traitees', label: 'Traitées', match: (r: InboxRequest) => r.status === 'done' },
  { value: 'toutes', label: 'Toutes', match: () => true },
]

const STATUS_STYLES: Record<InboxRequest['status'], string> = {
  new: 'bg-emerald-b/15 text-emerald-300',
  in_progress: 'bg-bronze/15 text-bronze',
  done: 'bg-white/[0.08] text-txt-secondary',
}

export default async function RequestsPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin()
  const params = await searchParams
  const { requests } = await readStore()
  const filter = FILTERS.find((f) => f.value === params.statut) ?? FILTERS[0]
  const list = requests.filter(filter.match).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const mailOn = mailConfigured()

  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <p className="section-tag text-emerald-b">Administration</p>
        <h1 className="font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">Demandes</h1>
        <p className="mt-3 max-w-2xl text-txt-secondary">
          Les messages envoyés depuis le site&nbsp;: formulaire de contact et inscriptions à la communauté. Chacun arrive aussi sur{' '}
          {MAIL_FROM}, et la personne reçoit un accusé de réception.
        </p>
      </div>

      {!mailOn && (
        <p role="status" className="rounded-xl border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-txt-primary [&_a]:text-bronze [&_a]:underline">
          Les e-mails ne partent pas encore&nbsp;: les demandes arrivent bien ici, mais ni toi ni tes clients ne recevez d&apos;e-mail. Voir{' '}
          <Link href="/admin/reglages/">Réglages → E-mails</Link>.
        </p>
      )}

      <nav aria-label="Afficher les demandes" className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === FILTERS[0].value ? '/admin/demandes/' : `/admin/demandes/?statut=${f.value}`}
            aria-current={f === filter ? 'true' : undefined}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
              f === filter ? 'border-emerald-b/60 bg-emerald-b/15 text-white' : 'border-bord text-txt-secondary hover:text-white'
            }`}
          >
            {f.label} <span className="tabular-nums text-txt-muted">· {requests.filter(f.match).length}</span>
          </Link>
        ))}
      </nav>

      {list.length ? (
        <ul className="grid grid-cols-1 gap-4">
          {list.map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </ul>
      ) : (
        <p className={`${panel} text-sm text-txt-secondary`}>
          {filter.value === 'a-traiter'
            ? 'Aucune demande à traiter. Les nouvelles apparaîtront ici dès leur envoi depuis le site.'
            : 'Aucune demande pour le moment.'}
        </p>
      )}
    </div>
  )
}

function receivedOn(iso: string) {
  const { date, time } = utcToParis(Date.parse(iso))
  return `${formatDay(date)} à ${frTime(time)}`
}

function RequestCard({ request: r }: { request: InboxRequest }) {
  const first = r.name.trim().split(/\s+/)[0]
  const reply = `mailto:${r.email}?subject=${encodeURIComponent('Re : ta demande à BabTech')}&body=${encodeURIComponent(`Bonjour ${first},\n\n`)}`
  const status = STATUSES.find((s) => s.value === r.status)
  return (
    <li className={`${panel} grid gap-4`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-outfit text-lg font-semibold text-white">
            {r.name}
            {r.company && <span className="font-normal text-txt-secondary"> · {r.company}</span>}
          </p>
          <p className="mt-0.5 text-sm text-txt-muted">
            {SOURCE_LABELS[r.source]} · reçue le {receivedOn(r.createdAt)}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[r.status]}`}>{status?.label}</span>
      </div>

      <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
        <Info label="E-mail">
          <a href={`mailto:${r.email}`} className={`${link} break-all`}>
            {r.email}
          </a>
        </Info>
        {r.phone && (
          <Info label="Téléphone">
            <a href={telLink(r.phone)} className={link}>
              {r.phone}
            </a>
          </Info>
        )}
        {r.need && <Info label="Besoin">{r.need}</Info>}
        {r.city && <Info label="Ville">{r.city}</Info>}
        {r.budget && <Info label="Budget">{r.budget}</Info>}
      </dl>

      <p className="whitespace-pre-line break-words rounded-xl bg-white/[0.04] px-4 py-3 text-[15px] leading-relaxed text-txt-primary">{r.message}</p>
      {r.details && (
        <details className="text-sm">
          <summary className="cursor-pointer text-txt-secondary hover:text-white">Compléments</summary>
          <p className="mt-2 whitespace-pre-line break-words text-txt-secondary">{r.details}</p>
        </details>
      )}

      <form action={saveRequestNote} className="grid gap-2">
        <input type="hidden" name="id" value={r.id} />
        <label htmlFor={`note-${r.id}`} className="text-xs font-semibold uppercase tracking-[1.5px] text-txt-muted">
          Ta note (privée)
        </label>
        <textarea id={`note-${r.id}`} name="note" rows={2} maxLength={2000} defaultValue={r.note ?? ''} className="input resize-y text-sm" placeholder="Rappelé le 3/10, devis à envoyer…" />
        <button type="submit" className={`${small} justify-self-start`}>
          Enregistrer la note
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2 border-t border-bord pt-4">
        <a href={reply} className="btn-primary btn-sm">
          Répondre par e-mail
        </a>
        {STATUSES.filter((s) => s.value !== r.status).map((s) => (
          <form key={s.value} action={setRequestStatus}>
            <input type="hidden" name="id" value={r.id} />
            <input type="hidden" name="status" value={s.value} />
            <button type="submit" className={small}>
              {s.value === 'new' ? 'Remettre en nouvelle' : s.value === 'in_progress' ? 'Marquer en cours' : 'Marquer traitée'}
            </button>
          </form>
        ))}
        <ConfirmForm
          action={deleteRequest}
          fields={{ id: r.id }}
          message={`Supprimer définitivement la demande de ${r.name} ?`}
          label="Supprimer"
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-txt-secondary hover:text-red-200"
        />
      </div>
    </li>
  )
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 gap-2">
      <dt className="shrink-0 text-txt-muted">{label}&nbsp;:</dt>
      <dd className="min-w-0 text-txt-primary">{children}</dd>
    </div>
  )
}
