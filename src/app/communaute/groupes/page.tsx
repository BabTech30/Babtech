import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CommunityNav } from '@/components/community/CommunityNav'
import { ForumUnavailable } from '@/components/community/ForumUnavailable'
import { GroupList } from '@/components/community/GroupList'
import { MemberBar } from '@/components/community/MemberBar'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { groupPath, GROUPS_PATH, GROUPS_PER_PAGE } from '@/data/forum'
import { listGroups, memberGroups } from '@/lib/community/groups'
import { currentMember } from '@/lib/community/members'
import { dbConfigured } from '@/lib/db'
import { graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { fr } from '@/lib/typography'

/** Groupes publiés : lus dans la base à chaque visite. */
export const dynamic = 'force-dynamic'

const title = "Groupes d'entraide : digital et IA entre entrepreneurs"
const description =
  "Rejoins un groupe d'entrepreneurs de l'Hérault et du Gard autour d'un thème (IA, visibilité, site, outils) ou propose le tien. Échanges lisibles par tous."

type Search = { page?: string; proposition?: string }

const pageNumber = (value?: string) => {
  const n = Number(value)
  return Number.isInteger(n) && n > 1 ? n : 1
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }): Promise<Metadata> {
  const page = pageNumber((await searchParams).page)
  return pageMetadata({
    title: `${title}${page > 1 ? ` (page ${page})` : ''}`,
    description,
    path: page > 1 ? `${GROUPS_PATH}/?page=${page}` : GROUPS_PATH,
    og: 'forum',
  })
}

export default async function GroupsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams
  const page = pageNumber(params.page)
  const member = await currentMember()

  let list: Awaited<ReturnType<typeof listGroups>> | undefined
  let mine: Awaited<ReturnType<typeof memberGroups>> | undefined
  if (dbConfigured()) {
    try {
      ;[list, mine] = await Promise.all([listGroups(page), member ? memberGroups(member.id) : Promise.resolve(undefined)])
    } catch (error) {
      console.error('groupes : lecture impossible', error)
    }
  }
  if (list && page > 1 && !list.groups.length) notFound()
  const pages = list ? Math.max(1, Math.ceil(list.total / GROUPS_PER_PAGE)) : 1
  const path = page > 1 ? `${GROUPS_PATH}/?page=${page}` : GROUPS_PATH

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path,
            name: title,
            description,
            type: 'CollectionPage',
            og: 'forum',
            breadcrumb: page === 1,
            ...(list?.groups.length
              ? {
                  mainEntity: {
                    '@type': 'ItemList',
                    itemListElement: list.groups.map((g, i) => ({
                      '@type': 'ListItem',
                      position: (page - 1) * GROUPS_PER_PAGE + i + 1,
                      name: g.name,
                      url: absoluteUrl(groupPath(g.id, g.name)),
                    })),
                  },
                }
              : {}),
          }),
        )}
      />

      <PageHero
        eyebrow="Communauté · Groupes"
        title="Les groupes de la communauté"
        lead="Des entrepreneurs réunis autour d'un thème, d'une ville ou d'un niveau, pour partager leurs essais, leurs outils et leurs résultats. Tout le monde peut lire les échanges ; il suffit de rejoindre un groupe pour y écrire."
        tone="bronze"
        crumbs={[
          { name: 'Communauté', path: '/communaute' },
          { name: 'Groupes', path: GROUPS_PATH },
        ]}
      >
        {member ? (
          <Link href={`${GROUPS_PATH}/proposer/`} className="btn-bronze">
            Proposer un groupe
            <Icon name="arrow-right" className="h-[18px] w-[18px]" />
          </Link>
        ) : (
          <Link href="/communaute/inscription/" className="btn-bronze">
            Créer mon compte pour participer
            <Icon name="arrow-right" className="h-[18px] w-[18px]" />
          </Link>
        )}
        <Link href="/communaute/charte/" className="btn-secondary">
          La charte
        </Link>
      </PageHero>

      <MemberBar member={member} next={`${GROUPS_PATH}/`} />

      <section className="py-14 md:py-16" aria-labelledby="groupes">
        <div className="container-b">
          <CommunityNav current="groupes" />
          {params.proposition === 'envoyee' && (
            <p role="status" className="mb-8 rounded-xl border border-emerald-b/30 bg-emerald-b/[0.08] px-4 py-3 text-sm text-emerald-200">
              {fr("Merci ! Ta proposition de groupe est envoyée. Elle apparaîtra ici dès qu'elle sera validée, et un e-mail te préviendra.")}
            </p>
          )}

          {mine && (mine.joined.length > 0 || mine.pending.length > 0) && (
            <div className="card mb-10 p-6">
              <h2 className="mb-3 font-outfit text-lg font-semibold text-white">Tes groupes</h2>
              {mine.joined.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {mine.joined.map((g) => (
                    <li key={g.id}>
                      <Link href={`${groupPath(g.id, g.name)}/`} className="inline-flex items-center gap-2 rounded-full border border-bord px-3.5 py-1.5 text-sm text-txt-primary hover:border-white/30 hover:text-white">
                        <Icon name="users" className="h-4 w-4 text-bronze" />
                        {g.name}
                        {g.role === 'organizer' && <span className="text-xs text-txt-muted">(animation)</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {mine.pending.length > 0 && (
                <p className="mt-3 text-sm text-txt-muted">
                  {fr(`En attente de validation : ${mine.pending.map((g) => `« ${g.name} »`).join(', ')}.`)}
                </p>
              )}
            </div>
          )}

          <h2 id="groupes" className="section-title mb-6">
            Les groupes{page > 1 ? ` (page ${page})` : ''}
          </h2>
          {!list ? (
            <ForumUnavailable />
          ) : list.groups.length ? (
            <GroupList groups={list.groups} />
          ) : (
            <p className="card p-6 text-txt-secondary">
              {fr(
                member
                  ? "Aucun groupe pour l'instant. Tu as une idée (un thème, une ville, un métier) ? Propose le premier groupe !"
                  : "Aucun groupe pour l'instant. Crée ton compte pour proposer le premier !",
              )}
            </p>
          )}

          {pages > 1 && (
            <nav aria-label="Pages" className="mt-8 flex flex-wrap gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={n === 1 ? `${GROUPS_PATH}/` : `${GROUPS_PATH}/?page=${n}`}
                  aria-current={n === page ? 'page' : undefined}
                  className={`rounded-lg border px-3.5 py-2 text-sm ${n === page ? 'border-bronze/60 bg-bronze/15 text-white' : 'border-bord text-txt-secondary hover:text-white'}`}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </>
  )
}
