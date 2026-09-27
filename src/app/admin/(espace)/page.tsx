import Link from 'next/link'
import { KpiForm } from '@/components/admin/KpiForm'
import { Icon } from '@/components/Icon'
import {
  adminDecisions,
  adminHealth,
  adminLinks,
  adminPhases,
  adminTasks,
  adminUpdatedAt,
  METRICS,
  type AdminTask,
  type Owner,
} from '@/data/admin'
import { qrCodes } from '@/data/qr'
import { zones } from '@/data/zones'
import { requireAdmin } from '@/lib/admin/auth'
import { currentMonth, formatDay, formatMonth, formatNumber } from '@/lib/admin/format'
import { scanStats } from '@/lib/admin/scans'
import { type Kpi, readStore, storageInfo } from '@/lib/admin/store'
import { fr } from '@/lib/typography'
import { toggleTask } from '../actions'

type Search = { taches?: string; courbe?: string }
type Task = AdminTask & { done: boolean }
type PhaseState = 'done' | 'current' | 'todo'
type Metric = (typeof METRICS)[number]

const panel = 'rounded-2xl border border-bord bg-nuit p-5 sm:p-6'
const h2 = 'font-outfit text-lg font-semibold tracking-tight text-white'

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin()
  const params = await searchParams
  const [store, storage] = await Promise.all([readStore(), storageInfo()])

  const tasks: Task[] = adminTasks.map((t) => ({
    ...t,
    done:
      t.auto === 'password-changed'
        ? Boolean(store.passwordHash)
        : t.owner === 'claude'
          ? Boolean(t.done)
          : (store.tasks[t.id]?.done ?? Boolean(t.done)),
  }))

  const phases = buildPhases(tasks)

  const doneCount = tasks.filter((t) => t.done).length
  const pct = Math.round((doneCount / tasks.length) * 100)
  const pending = phases.flatMap((p) => p.tasks.filter((t) => !t.done))
  const next = pending.find((t) => t.owner === 'toi') ?? pending[0]
  const filter = params.taches === 'toi' || params.taches === 'claude' ? params.taches : 'all'
  const metric = METRICS.find((m) => m.key === params.courbe) ?? METRICS[0]
  const kpis = Object.values(store.kpis).sort((a, b) => a.month.localeCompare(b.month))
  const toDo = { toi: pending.filter((t) => t.owner === 'toi').length, claude: pending.filter((t) => t.owner === 'claude').length }

  const query = (change: Search) => {
    const merged = { ...params, ...change }
    const qs = new URLSearchParams()
    if (merged.taches && merged.taches !== 'all') qs.set('taches', merged.taches)
    if (merged.courbe && merged.courbe !== METRICS[0].key) qs.set('courbe', merged.courbe)
    const s = qs.toString()
    return s ? `/admin/?${s}` : '/admin/'
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-tag text-emerald-b">babtech.fr</p>
          <h1 className="font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">Tableau de bord</h1>
        </div>
        <p className="text-sm text-txt-muted">Mis à jour par Claude le {formatDay(adminUpdatedAt)}</p>
      </div>

      {!storage ? (
        <Notice>
          Les données ne peuvent pas être enregistrées sur ce serveur&nbsp;: tes coches et tes chiffres ne seront pas gardés.
          Voir <Link href="/admin/reglages/">Réglages</Link>.
        </Notice>
      ) : (
        !storage.persistent && (
          <Notice>
            Tes données sont rangées dans le dossier du site&nbsp;: un redéploiement peut les effacer. Voir{' '}
            <Link href="/admin/reglages/">Réglages</Link>.
          </Notice>
        )
      )}

      {/* Où on en est + prochaine action */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <section className={panel} aria-labelledby="progress-title">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="progress-title" className={h2}>
              Où on en est
            </h2>
            <p className="text-sm tabular-nums text-txt-muted">
              {doneCount} tâches sur {tasks.length} · {pct}&nbsp;%
            </p>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
            <div className="h-full rounded-full bg-emerald-b" style={{ width: `${pct}%` }} />
          </div>
          <ol className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {phases.map((p) => (
              <li
                key={p.id}
                className={`grid gap-1.5 rounded-xl border p-3 ${
                  p.state === 'current' ? 'border-emerald-b/60 bg-emerald-b/[0.08]' : 'border-bord bg-nuit-deep'
                }`}
              >
                <div className="h-1 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
                  <div className="h-full rounded-full bg-emerald-b" style={{ width: `${p.total ? Math.round((p.done / p.total) * 100) : 0}%` }} />
                </div>
                <p className={`font-outfit text-[15px] font-semibold leading-tight ${p.state === 'todo' ? 'text-txt-secondary' : 'text-white'}`}>
                  {p.title}
                </p>
                <p className={`text-xs tabular-nums ${p.state === 'todo' ? 'text-txt-muted' : 'text-emerald-300'}`}>
                  {p.state === 'done' ? 'Terminé' : p.state === 'current' ? 'En cours' : 'À venir'} · {p.done}/{p.total}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="relative grid content-start gap-3 overflow-hidden rounded-2xl border border-emerald-b/60 bg-nuit p-5 sm:p-6" aria-labelledby="next-title">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-emerald-b" />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[1.5px] text-txt-muted">Prochaine action</p>
            {next && <OwnerChip owner={next.owner} you />}
          </div>
          {next ? (
            <>
              <h2 id="next-title" className="font-outfit text-xl font-semibold leading-snug text-white">
                {fr(next.title)}
              </h2>
              {next.detail && <p className="text-txt-secondary">{fr(next.detail)}</p>}
              {next.link && <TaskLink task={next} className="btn-primary btn-sm mt-1 justify-self-start" />}
            </>
          ) : (
            <h2 id="next-title" className="font-outfit text-xl font-semibold text-white">
              Tout est coché
            </h2>
          )}
        </section>
      </div>

      {/* Checklist + santé du site + liens */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section className={panel} aria-labelledby="tasks-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="tasks-title" className={h2}>
              Checklist
            </h2>
            <nav aria-label="Afficher les tâches" className="flex rounded-xl bg-white/[0.05] p-1 text-sm">
              {[
                { value: 'all', label: 'Toutes' },
                { value: 'toi', label: `À toi · ${toDo.toi}` },
                { value: 'claude', label: `À Claude · ${toDo.claude}` },
              ].map((f) => (
                <Link
                  key={f.value}
                  href={query({ taches: f.value })}
                  scroll={false}
                  aria-current={filter === f.value ? 'true' : undefined}
                  className={`rounded-lg px-3 py-1.5 font-medium ${filter === f.value ? 'bg-white/[0.1] text-white' : 'text-txt-secondary hover:text-white'}`}
                >
                  {f.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-4 grid gap-2.5">
            {phases.map((p) => {
              const shown = filter === 'all' ? p.tasks : p.tasks.filter((t) => t.owner === filter)
              if (!shown.length) return null
              return (
                <details
                  key={p.id}
                  open={p.state === 'current'}
                  className={`group rounded-xl border ${p.state === 'current' ? 'border-emerald-b/50' : 'border-bord'}`}
                >
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                    <Icon name="arrow-right" className="h-4 w-4 shrink-0 text-txt-muted transition-transform group-open:rotate-90" />
                    <span className="flex-1 font-outfit font-semibold text-white">{p.title}</span>
                    <span className={`text-xs tabular-nums ${p.state === 'done' ? 'text-emerald-300' : 'text-txt-muted'}`}>
                      {p.done}/{p.total}
                      {p.state === 'done' ? ' · terminé' : p.state === 'current' ? ' · en cours' : ''}
                    </span>
                  </summary>
                  <ul className="px-4 pb-2">
                    {shown.map((t) => (
                      <TaskRow key={t.id} task={t} />
                    ))}
                  </ul>
                </details>
              )
            })}
          </div>
        </section>

        <div className="grid gap-6">
          <section className={panel} aria-labelledby="health-title">
            <h2 id="health-title" className={h2}>
              Santé du site
            </h2>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {adminHealth.scores.map((s) => (
                <Ring key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
              {adminHealth.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs text-txt-muted">{f.label}</dt>
                  <dd className="font-outfit text-lg font-semibold tabular-nums text-white">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-txt-muted">
              {fr(adminHealth.context)} Mesuré le {formatDay(adminHealth.checkedAt)}.
            </p>
            <div className="mt-5 border-t border-bord pt-4">
              <p className="text-xs font-semibold uppercase tracking-[1.5px] text-txt-muted">Chemin d&apos;une modification</p>
              <ol className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                {['Claude modifie', 'Contrôle qualité', 'Branche main', 'Tu déploies (hPanel)', 'babtech.fr'].map((step, i) => (
                  <li key={step} className="flex items-center gap-1.5">
                    {i > 0 && (
                      <span aria-hidden="true" className="text-txt-muted">
                        →
                      </span>
                    )}
                    <span className={`rounded-md px-2 py-1 ${i === 3 ? 'bg-bronze/15 font-semibold text-bronze' : 'bg-white/[0.06] text-txt-secondary'}`}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className={panel} aria-labelledby="qr-title">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="qr-title" className={h2}>
                QR codes
              </h2>
              <Link href="/admin/partager/" className="text-sm font-medium text-emerald-300 hover:underline">
                Imprimer, partager →
              </Link>
            </div>
            <p className="mt-1 text-xs text-txt-muted">Scans en {formatMonth(currentMonth())}</p>
            <ul className="mt-2">
              {qrCodes.map((q) => (
                <li key={q.code} className="flex items-baseline justify-between gap-3 border-b border-bord py-2 last:border-0">
                  <span className="text-txt-primary">{q.label}</span>
                  <span className="font-outfit text-lg font-semibold tabular-nums text-white">{formatNumber(scanStats(store.scans, q.code).month)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={panel} aria-labelledby="links-title">
            <h2 id="links-title" className={h2}>
              Liens utiles
            </h2>
            <div className="mt-3 grid gap-4">
              {adminLinks.map((g) => (
                <div key={g.group}>
                  <p className="text-xs font-semibold uppercase tracking-[1.5px] text-txt-muted">{g.group}</p>
                  <ul className="mt-1">
                    {g.items.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener"
                          className="flex items-baseline justify-between gap-3 border-b border-bord py-2 text-txt-primary last:border-0 hover:text-emerald-300"
                        >
                          <span className="font-medium">{l.label}</span>
                          <span className="text-right text-xs text-txt-muted">{l.hint} ↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Chiffres du mois */}
      <Kpis kpis={kpis} metric={metric} query={query} />

      {/* Zones et décisions */}
      <div className="grid items-start gap-6 md:grid-cols-2">
        <section className={panel} aria-labelledby="zones-title">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="zones-title" className={h2}>
              Zones visées
            </h2>
            <p className="text-sm text-txt-muted">Montpellier et {zones.length} villes</p>
          </div>
          <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2">
            <li>
              <a href="/zones-intervention/" target="_blank" rel="noopener" className="flex justify-between rounded-lg bg-emerald-b/10 px-3 py-2 font-semibold text-white hover:bg-emerald-b/20">
                Montpellier <span aria-hidden="true">↗</span>
              </a>
            </li>
            {zones.map((z) => (
              <li key={z.slug}>
                <a
                  href={`/zones-intervention/${z.slug}/`}
                  target="_blank"
                  rel="noopener"
                  className="flex justify-between rounded-lg border border-bord px-3 py-2 text-txt-primary hover:border-emerald-b/50"
                >
                  {z.name} <span aria-hidden="true" className="text-txt-muted">↗</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-txt-muted">
            {fr('France entière : plus tard. Après quelques semaines en ligne, la Search Console montrera les villes où tu apparais déjà : on renforcera celles-là.')}
          </p>
        </section>

        <section className={panel} aria-labelledby="decisions-title">
          <h2 id="decisions-title" className={h2}>
            Décisions prises
          </h2>
          <ol className="mt-3">
            {adminDecisions.map((d) => (
              <li key={d.text} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-t border-bord py-3 first:border-0">
                <time dateTime={d.date} className="whitespace-nowrap pt-0.5 text-xs tabular-nums text-txt-muted">
                  {formatDay(d.date)}
                </time>
                <p className="text-txt-primary">{fr(d.text)}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}

/** Avancement de chaque étape ; l'étape en cours est la première qui n'est pas terminée. */
function buildPhases(tasks: Task[]) {
  const stats = adminPhases.map((p) => {
    const list = tasks.filter((t) => t.phase === p.id)
    const done = list.filter((t) => t.done).length
    return { ...p, tasks: list, done, total: list.length, complete: list.length > 0 && done === list.length }
  })
  const current = stats.findIndex((p) => !p.complete)
  return stats.map((p, i) => ({ ...p, state: (p.complete ? 'done' : i === current ? 'current' : 'todo') as PhaseState }))
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="rounded-xl border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-txt-primary [&_a]:text-bronze [&_a]:underline">
      {children}
    </p>
  )
}

function OwnerChip({ owner, you = false }: { owner: Owner; you?: boolean }) {
  return owner === 'toi' ? (
    <span className="rounded-full bg-bronze/15 px-2.5 py-0.5 text-xs font-semibold text-bronze">{you ? 'À toi' : 'Toi'}</span>
  ) : (
    <span className="rounded-full bg-emerald-b/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">Claude</span>
  )
}

function TaskLink({ task, className }: { task: Task; className: string }) {
  if (!task.link) return null
  const label = `${task.linkLabel ?? 'Ouvrir'}`
  return task.link.startsWith('/admin') ? (
    <Link href={task.link} className={className}>
      {label}
    </Link>
  ) : (
    <a href={task.link} target="_blank" rel="noopener" className={className}>
      {label} ↗
    </a>
  )
}

function TaskRow({ task }: { task: Task }) {
  const editable = task.owner === 'toi' && !task.auto
  const box = `mt-0.5 flex h-6 w-6 items-center justify-center rounded-md border ${
    task.done ? 'border-emerald-b bg-emerald-b text-[#0a1a10]' : 'border-white/25'
  }`
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 border-t border-bord py-3 first:border-0 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
      {editable ? (
        <form action={toggleTask}>
          <input type="hidden" name="id" value={task.id} />
          <button
            type="submit"
            aria-pressed={task.done}
            aria-label={`${task.done ? 'Décocher' : 'Cocher'} : ${task.title}`}
            className={`${box} hover:border-emerald-b`}
          >
            {task.done && <Icon name="check" className="h-4 w-4" strokeWidth={3} />}
          </button>
        </form>
      ) : (
        <span className={box} role="img" aria-label={task.done ? 'Fait' : 'À faire'} title={task.auto ? 'Se coche tout seul' : 'Tenu à jour par Claude'}>
          {task.done && <Icon name="check" className="h-4 w-4" strokeWidth={3} />}
        </span>
      )}
      <div className="min-w-0">
        <p className={task.done ? 'text-txt-muted line-through decoration-white/25' : 'font-medium text-txt-primary'}>{fr(task.title)}</p>
        {task.detail && <p className="mt-0.5 text-sm text-txt-muted">{fr(task.detail)}</p>}
      </div>
      <div className="col-start-2 flex flex-wrap items-center gap-3 sm:col-start-auto sm:flex-col sm:items-end sm:gap-1.5">
        <OwnerChip owner={task.owner} />
        <TaskLink task={task} className="text-sm text-emerald-300 underline-offset-2 hover:underline" />
      </div>
    </li>
  )
}

function Ring({ label, value }: { label: string; value: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  const color = value >= 90 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div className="grid justify-items-center gap-1.5 text-center">
      <svg viewBox="0 0 64 64" className="h-14 w-14 sm:h-16 sm:w-16" role="img" aria-label={`${label} : ${value} sur 100`}>
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${((c * value) / 100).toFixed(1)} ${c.toFixed(1)}`}
          transform="rotate(-90 32 32)"
        />
        <text x="32" y="37.5" textAnchor="middle" fontSize="16" fontWeight="600" fill="#ffffff" fontFamily="var(--font-outfit), system-ui, sans-serif">
          {value}
        </text>
      </svg>
      <span className="text-[11px] leading-tight text-txt-secondary">{label}</span>
    </div>
  )
}

function Delta({ current, previous }: { current?: number; previous?: number }) {
  if (typeof current !== 'number' || typeof previous !== 'number') return null
  const d = current - previous
  if (d === 0) return <span className="rounded-full bg-white/[0.08] px-2 py-0.5 font-semibold text-txt-secondary">=</span>
  return (
    <span className={`rounded-full px-2 py-0.5 font-semibold tabular-nums ${d > 0 ? 'bg-emerald-b/15 text-emerald-300' : 'bg-amber-400/15 text-amber-300'}`}>
      {d > 0 ? '+' : '−'}
      {formatNumber(Math.abs(d))}
    </span>
  )
}

function Tile({ label, value, source, delta, big = false }: { label: string; value: string; source: string; delta?: React.ReactNode; big?: boolean }) {
  return (
    <div className="grid content-start gap-1 rounded-xl border border-bord bg-nuit-deep p-4">
      <p className="text-sm font-medium text-txt-secondary">{label}</p>
      <p className={`font-outfit font-semibold tabular-nums text-white ${big ? 'text-4xl' : 'text-2xl'}`}>{value}</p>
      <p className="flex flex-wrap items-center gap-1.5 text-xs text-txt-muted">
        {delta}
        <span>{source}</span>
      </p>
    </div>
  )
}

function Kpis({ kpis, metric, query }: { kpis: Kpi[]; metric: Metric; query: (change: Search) => string }) {
  const cur = kpis[kpis.length - 1]
  const prev = kpis[kpis.length - 2]
  const rate =
    cur && typeof cur.leads === 'number' && cur.leads > 0 && typeof cur.contracts === 'number'
      ? `${Math.round((cur.contracts / cur.leads) * 100)} %`
      : '—'
  const series = kpis.filter((k) => typeof k[metric.key] === 'number').slice(-12)
  const max = Math.max(1, ...series.map((k) => k[metric.key] as number))
  return (
    <section className={panel} aria-labelledby="kpi-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="kpi-title" className={h2}>
          Chiffres du mois
        </h2>
        <p className="text-sm text-txt-muted">
          {cur ? `${formatMonth(cur.month)}${cur.note ? ` · ${cur.note}` : ''}` : 'Premiers chiffres un mois après la mise en ligne'}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {METRICS.filter((m) => m.primary).map((m) => (
          <Tile key={m.key} big label={m.label} value={formatNumber(cur?.[m.key])} source={m.source} delta={<Delta current={cur?.[m.key]} previous={prev?.[m.key]} />} />
        ))}
        <Tile big label="Taux de signature" value={rate} source="Contrats ÷ demandes" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-6">
        {METRICS.filter((m) => !m.primary).map((m) => (
          <Tile key={m.key} label={m.label} value={formatNumber(cur?.[m.key])} source={m.source} delta={<Delta current={cur?.[m.key]} previous={prev?.[m.key]} />} />
        ))}
      </div>

      <div className="mt-6 border-t border-bord pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[1.5px] text-txt-muted">Évolution</p>
          <nav aria-label="Choisir le graphique" className="flex flex-wrap gap-1.5">
            {METRICS.map((m) => (
              <Link
                key={m.key}
                href={query({ courbe: m.key })}
                scroll={false}
                aria-current={m.key === metric.key ? 'true' : undefined}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  m.key === metric.key ? 'border-emerald-b/60 bg-emerald-b/15 text-white' : 'border-bord text-txt-secondary hover:text-white'
                }`}
              >
                {m.label}
              </Link>
            ))}
          </nav>
        </div>
        {series.length < 2 ? (
          <p className="mt-4 text-sm text-txt-muted">Le graphique «&nbsp;{metric.label}&nbsp;» apparaît dès que deux mois sont saisis.</p>
        ) : (
          <figure className="mt-5">
            <div
              className="flex h-48 items-end gap-2 sm:gap-3"
              role="img"
              aria-label={`${metric.label} : ${series.map((k) => `${formatMonth(k.month)} ${formatNumber(k[metric.key])}`).join(', ')}`}
            >
              {series.map((k, i) => {
                const value = k[metric.key] as number
                const last = i === series.length - 1
                return (
                  <div key={k.month} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
                    <span className={`text-xs tabular-nums ${last ? 'font-semibold text-white' : 'text-txt-muted'}`}>{formatNumber(value)}</span>
                    <div
                      className={`w-full max-w-[56px] rounded-t-md ${last ? 'bg-emerald-b' : 'bg-emerald-b/35'}`}
                      style={{ height: `${Math.max(2, Math.round((value / max) * 82))}%` }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="mt-2 flex gap-2 border-t border-bord pt-2 sm:gap-3" aria-hidden="true">
              {series.map((k) => (
                <span key={k.month} className="min-w-0 flex-1 truncate text-center text-xs text-txt-muted">
                  {formatMonth(k.month, 'short')}
                </span>
              ))}
            </div>
          </figure>
        )}
      </div>

      <KpiForm saved={Object.fromEntries(kpis.map((k) => [k.month, k]))} defaultMonth={currentMonth()} initialOpen={kpis.length === 0} />
    </section>
  )
}
