import type { Metadata } from 'next'
import Link from 'next/link'
import { moderateMember, moderatePost } from '@/app/admin/community-actions'
import { ConfirmForm } from '@/components/admin/ConfirmForm'
import { topicPath } from '@/data/forum'
import { requireAdmin } from '@/lib/admin/auth'
import {
  communityStats,
  listMembers,
  type MemberAdminRow,
  type OpenReport,
  openReports,
  type RecentPost,
  recentPosts,
} from '@/lib/community/forum'
import { purgeStale } from '@/lib/community/members'
import { excerpt, postDate } from '@/lib/community/text'
import { dbConfigured, dbErrorCode, dbProblem } from '@/lib/db'
import { fr } from '@/lib/typography'

export const metadata: Metadata = { title: { absolute: 'Communauté · BabTech' } }

type Search = { q?: string; statut?: string }

const panel = 'rounded-2xl border border-bord bg-nuit p-5 sm:p-6'
const h2 = 'font-outfit text-lg font-semibold tracking-tight text-white'
const small = 'rounded-lg border border-white/[0.12] px-3 py-1.5 text-sm font-medium text-txt-primary hover:border-white/30 hover:text-white'
const danger = 'rounded-lg border border-red-400/30 px-3 py-1.5 text-sm font-medium text-red-200 hover:border-red-300'
const link = 'text-emerald-300 hover:underline'

const STATUS_FILTERS = [
  { value: '', label: 'Tous' },
  { value: 'active', label: 'Actifs' },
  { value: 'pending', label: 'En attente de confirmation' },
  { value: 'blocked', label: 'Suspendus' },
]
const STATUS_LABELS: Record<MemberAdminRow['status'], [string, string]> = {
  active: ['Actif', 'bg-emerald-b/15 text-emerald-300'],
  pending: ['E-mail non confirmé', 'bg-bronze/15 text-bronze'],
  blocked: ['Suspendu', 'bg-red-400/15 text-red-200'],
}

function Header() {
  return (
    <div>
      <p className="section-tag text-emerald-b">Administration</p>
      <h1 className="font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">Communauté</h1>
      <p className="mt-3 max-w-2xl text-txt-secondary">
        {fr(
          "Le forum publie les messages tout de suite : tu es prévenu de chaque nouveau sujet et de chaque signalement, et tu modères ici. Un message masqué disparaît du site, il reste visible ici.",
        )}
      </p>
    </div>
  )
}

/** Boutons de modération d'un message (sujet ou réponse). */
function PostActions({ target, id, status, reported }: { target: 'topic' | 'reply'; id: number; status: 'visible' | 'hidden'; reported?: boolean }) {
  const fields = { type: target, id: String(id) }
  return (
    <div className="flex flex-wrap gap-2">
      <form action={moderatePost}>
        <input type="hidden" name="type" value={target} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="op" value={status === 'visible' ? 'hide' : 'show'} />
        <button type="submit" className={small}>
          {status === 'visible' ? 'Masquer' : 'Réafficher'}
        </button>
      </form>
      {reported && (
        <form action={moderatePost}>
          <input type="hidden" name="type" value={target} />
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="op" value="dismiss" />
          <button type="submit" className={small}>
            Rien à signaler
          </button>
        </form>
      )}
      <ConfirmForm
        action={moderatePost}
        fields={{ ...fields, op: 'delete' }}
        message={target === 'topic' ? 'Supprimer ce sujet et toutes ses réponses ? C’est définitif.' : 'Supprimer cette réponse ? C’est définitif.'}
        label="Supprimer"
        className={danger}
      />
    </div>
  )
}

function ReportCard({ r }: { r: OpenReport }) {
  const href = `${topicPath(r.topicId, r.topicTitle)}/${r.target === 'reply' ? `#reponse-${r.targetId}` : ''}`
  return (
    <li className="rounded-xl border border-bronze/30 bg-bronze/[0.05] p-4">
      <p className="text-sm text-txt-muted">
        {r.target === 'topic' ? 'Sujet' : 'Réponse'} dans{' '}
        <a href={href} target="_blank" rel="noopener" className={link}>
          {r.topicTitle} ↗
        </a>{' '}
        · par {r.author.name} · {r.count} signalement{r.count > 1 ? 's' : ''}
        {r.status === 'hidden' && ' · déjà masqué'}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm text-txt-primary">{excerpt(r.body, 400)}</p>
      <ul className="mt-2 list-disc pl-5 text-sm text-bronze">
        {r.reasons.map((reason, i) => (
          <li key={i}>{reason}</li>
        ))}
      </ul>
      <div className="mt-3">
        <PostActions target={r.target} id={r.targetId} status={r.status} reported />
      </div>
    </li>
  )
}

function PostCard({ p }: { p: RecentPost }) {
  const href = `${topicPath(p.topicId, p.topicTitle)}/${p.target === 'reply' ? `#reponse-${p.id}` : ''}`
  return (
    <li className={`rounded-xl border p-4 ${p.status === 'hidden' ? 'border-white/[0.06] opacity-70' : 'border-bord'}`}>
      <p className="text-sm text-txt-muted">
        {p.target === 'topic' ? 'Nouveau sujet' : 'Réponse'} ·{' '}
        <a href={href} target="_blank" rel="noopener" className={link}>
          {p.topicTitle} ↗
        </a>{' '}
        · {p.author.name}
        {p.author.detail && ` (${p.author.detail})`} · {postDate(p.createdAt)}
        {p.status === 'hidden' && <span className="ml-2 rounded-full bg-white/[0.08] px-2 py-0.5 text-xs text-txt-secondary">Masqué</span>}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm text-txt-primary">{excerpt(p.body, 300)}</p>
      <div className="mt-3">
        <PostActions target={p.target} id={p.id} status={p.status} />
      </div>
    </li>
  )
}

function MemberCard({ m }: { m: MemberAdminRow }) {
  const [label, style] = STATUS_LABELS[m.status]
  const hidden = (op: string) => (
    <>
      <input type="hidden" name="id" value={m.id} />
      <input type="hidden" name="op" value={op} />
    </>
  )
  return (
    <li className="rounded-xl border border-bord p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium text-white">
          {m.fullName} <span className="text-sm font-normal text-txt-muted">(affiché « {m.name} »)</span>
        </p>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>{label}</span>
      </div>
      <p className="mt-1 text-sm text-txt-secondary">
        <a href={`mailto:${m.email}`} className={link}>
          {m.email}
        </a>
        {m.detail && ` · ${m.detail}`}
      </p>
      <p className="mt-1 text-sm text-txt-muted">
        Inscrit le {postDate(m.createdAt)} · {m.lastLoginAt ? `dernière connexion le ${postDate(m.lastLoginAt)}` : 'jamais connecté'} · {m.topics} sujet
        {m.topics > 1 ? 's' : ''}, {m.replies} réponse{m.replies > 1 ? 's' : ''}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {m.status === 'pending' && (
          <form action={moderateMember}>
            {hidden('resend')}
            <button type="submit" className={small}>
              Renvoyer le lien de confirmation
            </button>
          </form>
        )}
        {m.status === 'active' && (
          <ConfirmForm
            action={moderateMember}
            fields={{ id: String(m.id), op: 'block' }}
            message={`Suspendre ${m.fullName} ? Ce membre ne pourra plus se connecter ni écrire.`}
            label="Suspendre"
            className={small}
          />
        )}
        {m.status === 'blocked' && (
          <form action={moderateMember}>
            {hidden('unblock')}
            <button type="submit" className={small}>
              Rétablir
            </button>
          </form>
        )}
        <ConfirmForm
          action={moderateMember}
          fields={{ id: String(m.id), op: 'delete' }}
          message={`Supprimer le compte de ${m.fullName} ? Ses messages restent, signés « Ancien membre ».`}
          label="Supprimer le compte"
          className={danger}
        />
        {m.topics + m.replies > 0 && (
          <ConfirmForm
            action={moderateMember}
            fields={{ id: String(m.id), op: 'delete-all' }}
            message={`Supprimer le compte de ${m.fullName} ET tous ses messages ? C’est définitif.`}
            label="Supprimer compte et messages"
            className={danger}
          />
        )}
      </div>
    </li>
  )
}

export default async function CommunityAdminPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin()
  const { q = '', statut = '' } = await searchParams

  if (!dbConfigured()) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Header />
        <p role="status" className="rounded-xl border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-txt-primary [&_a]:text-bronze [&_a]:underline">
          La base de données n&apos;est pas encore branchée&nbsp;: le forum affiche «&nbsp;bientôt disponible&nbsp;». Voir{' '}
          <Link href="/admin/reglages/">Réglages → Communauté</Link>.
        </p>
      </div>
    )
  }

  let data: { stats: Awaited<ReturnType<typeof communityStats>>; reports: OpenReport[]; posts: RecentPost[]; members: MemberAdminRow[] } | undefined
  let problem = ''
  try {
    await purgeStale().catch((error) => console.error('communauté : nettoyage impossible', error))
    const [stats, reports, posts, members] = await Promise.all([communityStats(), openReports(), recentPosts(20), listMembers({ q, status: statut })])
    data = { stats, reports, posts, members }
  } catch (error) {
    console.error('communauté : lecture impossible', error)
    problem = dbProblem(dbErrorCode(error))
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Header />
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {fr(`Base de données injoignable : ${problem}`)}
        </p>
      </div>
    )
  }

  const { stats, reports, posts, members } = data
  const figures = [
    { label: 'Membres actifs', value: stats.activeMembers },
    { label: 'En attente de confirmation', value: stats.pendingMembers },
    { label: 'Sujets', value: stats.topics },
    { label: 'Réponses', value: stats.replies },
    { label: 'Signalements à traiter', value: stats.openReports },
  ]

  return (
    <div className="grid grid-cols-1 gap-6">
      <Header />

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {figures.map((f) => (
          <li key={f.label} className="rounded-xl border border-bord bg-nuit p-4">
            <p className="font-outfit text-2xl font-bold tabular-nums text-white">{f.value}</p>
            <p className="text-sm text-txt-muted">{f.label}</p>
          </li>
        ))}
      </ul>

      <section className={panel} aria-labelledby="reports-title">
        <h2 id="reports-title" className={h2}>
          Signalements à traiter
        </h2>
        {reports.length ? (
          <ul className="mt-4 grid gap-3">
            {reports.map((r) => (
              <ReportCard key={`${r.target}-${r.targetId}`} r={r} />
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-txt-secondary">Aucun signalement en attente.</p>
        )}
      </section>

      <section className={panel} aria-labelledby="posts-title">
        <h2 id="posts-title" className={h2}>
          Derniers messages
        </h2>
        {posts.length ? (
          <ul className="mt-4 grid gap-3">
            {posts.map((p) => (
              <PostCard key={`${p.target}-${p.id}`} p={p} />
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-txt-secondary">Aucun message pour l&apos;instant.</p>
        )}
      </section>

      <section className={panel} aria-labelledby="members-title">
        <h2 id="members-title" className={h2}>
          Membres
        </h2>
        <form method="get" className="mt-4 flex flex-wrap items-end gap-2">
          <div className="min-w-[220px] flex-1">
            <label htmlFor="q" className="label">
              Rechercher (nom, e-mail, activité, ville)
            </label>
            <input id="q" name="q" type="search" defaultValue={q} className="input" />
          </div>
          {statut && <input type="hidden" name="statut" value={statut} />}
          <button type="submit" className="btn-secondary btn-sm">
            Rechercher
          </button>
        </form>
        <nav aria-label="Filtrer les membres" className="mt-4 flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <Link
              key={f.value}
              href={`/admin/communaute/${f.value ? `?statut=${f.value}` : ''}`}
              aria-current={f.value === statut ? 'true' : undefined}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                f.value === statut ? 'border-emerald-b/60 bg-emerald-b/15 text-white' : 'border-bord text-txt-secondary hover:text-white'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </nav>
        {members.length ? (
          <ul className="mt-4 grid gap-3">
            {members.map((m) => (
              <MemberCard key={m.id} m={m} />
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-txt-secondary">Aucun membre{q || statut ? ' pour cette recherche' : ' pour l’instant'}.</p>
        )}
      </section>
    </div>
  )
}
