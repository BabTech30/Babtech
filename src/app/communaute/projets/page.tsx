import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CommunityNav } from '@/components/community/CommunityNav'
import { ForumUnavailable } from '@/components/community/ForumUnavailable'
import { MemberBar } from '@/components/community/MemberBar'
import { ProjectBadges } from '@/components/community/ProjectBadges'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { getForumCategory, PROJECT_NEEDS, type ProjectNeed, PROJECTS_PATH, PROJECTS_PER_PAGE, topicPath } from '@/data/forum'
import { currentMember } from '@/lib/community/members'
import { listProjects } from '@/lib/community/projects'
import { excerpt, postDate } from '@/lib/community/text'
import { dbConfigured } from '@/lib/db'
import { graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { fr } from '@/lib/typography'

/** Projets des membres : lus dans la base à chaque visite. */
export const dynamic = 'force-dynamic'

const title = "Projets d'entrepreneurs : aide, partenaire, compétence"
const description =
  "Des entrepreneurs de l'Hérault et du Gard présentent leur projet et ce qu'ils cherchent : conseils, partenaire ou compétence. Propose ton aide ou présente le tien."

type Search = { cherche?: string; page?: string }

const pageNumber = (value?: string) => {
  const n = Number(value)
  return Number.isInteger(n) && n > 1 ? n : 1
}
const needOf = (value?: string) => PROJECT_NEEDS.find((n) => n.value === value)?.value

/** Liste filtrée ou page 2 et suivantes : adresse propre ; les listes filtrées restent hors de Google. */
function listPath(need: ProjectNeed | undefined, page: number) {
  const query = [need ? `cherche=${need}` : '', page > 1 ? `page=${page}` : ''].filter(Boolean).join('&')
  return query ? `${PROJECTS_PATH}/?${query}` : PROJECTS_PATH
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }): Promise<Metadata> {
  const params = await searchParams
  const need = needOf(params.cherche)
  const page = pageNumber(params.page)
  return pageMetadata({
    title: `${title}${page > 1 ? ` (page ${page})` : ''}`,
    description,
    path: listPath(need, page),
    og: 'forum',
    noindex: Boolean(need),
  })
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams
  const need = needOf(params.cherche)
  const page = pageNumber(params.page)
  const member = await currentMember()

  let list: Awaited<ReturnType<typeof listProjects>> | undefined
  if (dbConfigured()) {
    try {
      list = await listProjects({ need, page })
    } catch (error) {
      console.error('projets : lecture impossible', error)
    }
  }
  if (list && page > 1 && !list.projects.length) notFound()
  const pages = list ? Math.max(1, Math.ceil(list.total / PROJECTS_PER_PAGE)) : 1

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path: listPath(need, page),
            name: title,
            description,
            type: 'CollectionPage',
            og: 'forum',
            breadcrumb: !need && page === 1,
            ...(list?.projects.length
              ? {
                  mainEntity: {
                    '@type': 'ItemList',
                    itemListElement: list.projects.map(({ topic }, i) => ({
                      '@type': 'ListItem',
                      position: (page - 1) * PROJECTS_PER_PAGE + i + 1,
                      name: topic.title,
                      url: absoluteUrl(topicPath(topic.id, topic.title)),
                    })),
                  },
                }
              : {}),
          }),
        )}
      />

      <PageHero
        eyebrow="Communauté · Projets"
        title="Les projets des membres"
        lead="Un lancement, un site, une automatisation, une nouvelle activité : les membres présentent leur projet et ce qu'ils cherchent. Tu as un conseil, une compétence, l'envie de t'associer ? Propose ton aide en un message."
        tone="bronze"
        crumbs={[
          { name: 'Communauté', path: '/communaute' },
          { name: 'Projets', path: PROJECTS_PATH },
        ]}
      >
        {member ? (
          <Link href={`${PROJECTS_PATH}/nouveau/`} className="btn-bronze">
            Présenter mon projet
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

      <MemberBar member={member} next={`${PROJECTS_PATH}/`} />

      <section className="py-14 md:py-16" aria-labelledby="projets">
        <div className="container-b">
          <CommunityNav current="projets" />
          <h2 id="projets" className="section-title mb-6">
            {need ? `Projets qui cherchent : ${PROJECT_NEEDS.find((n) => n.value === need)?.short.toLowerCase()}` : 'Tous les projets'}
            {page > 1 ? ` (page ${page})` : ''}
          </h2>
          <nav aria-label="Filtrer les projets" className="mb-8 flex flex-wrap gap-2">
            {[{ value: undefined, short: 'Tous' }, ...PROJECT_NEEDS].map((n) => (
              <Link
                key={n.value ?? 'tous'}
                href={`${listPath(n.value, 1)}${n.value ? '' : '/'}`}
                aria-current={n.value === need ? 'true' : undefined}
                className={`rounded-full border px-3.5 py-1.5 text-sm ${n.value === need ? 'border-bronze/60 bg-bronze/15 text-white' : 'border-bord text-txt-secondary hover:text-white'}`}
              >
                {n.short}
              </Link>
            ))}
          </nav>

          {!list ? (
            <ForumUnavailable />
          ) : list.projects.length ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {list.projects.map(({ topic, details }) => (
                <li key={topic.id} className="card card-hover relative flex flex-col p-6">
                  <p className="mb-3 text-[13px] text-bronze">{getForumCategory(topic.category)?.name}</p>
                  <h3 className="mb-2 font-outfit text-lg font-semibold leading-snug text-white">
                    <Link href={`${topicPath(topic.id, topic.title)}/`} className="after:absolute after:inset-0">
                      {topic.title}
                    </Link>
                  </h3>
                  <p className="mb-4 flex-1 text-[14px] leading-relaxed text-txt-secondary">{fr(excerpt(topic.body, 170))}</p>
                  <div className="mb-3">
                    <ProjectBadges needs={details.needs} skill={details.skill} stage={details.stage} status={details.status} />
                  </div>
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-txt-muted">
                    <span>
                      {topic.author.name}
                      {topic.author.detail && ` · ${topic.author.detail}`}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="message" className="h-4 w-4" />
                      {topic.replyCount} réponse{topic.replyCount > 1 ? 's' : ''}
                    </span>
                    <time dateTime={topic.createdAt.toISOString()}>{postDate(topic.createdAt).split(' à ')[0]}</time>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="card p-6 text-txt-secondary">
              {need ? 'Aucun projet ne cherche cela pour le moment.' : fr('Aucun projet pour le moment : présente le tien, la communauté est là pour ça !')}
            </p>
          )}

          {pages > 1 && (
            <nav aria-label="Pages" className="mt-8 flex flex-wrap gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={n === 1 && !need ? `${PROJECTS_PATH}/` : listPath(need, n)}
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
