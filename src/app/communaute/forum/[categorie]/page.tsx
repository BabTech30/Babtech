import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ForumUnavailable } from '@/components/community/ForumUnavailable'
import { MemberBar } from '@/components/community/MemberBar'
import { TopicList } from '@/components/community/TopicList'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { FORUM_PATH, forumCategories, getForumCategory, TOPICS_PER_PAGE, topicPath } from '@/data/forum'
import { topicsInCategory } from '@/lib/community/forum'
import { currentMember } from '@/lib/community/members'
import { dbConfigured } from '@/lib/db'
import { graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { fr } from '@/lib/typography'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ categorie: string }>; searchParams: Promise<{ page?: string }> }

const pageNumber = (value?: string) => {
  const n = Number(value)
  return Number.isInteger(n) && n > 1 ? n : 1
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const category = getForumCategory((await params).categorie)
  if (!category) return {}
  const page = pageNumber((await searchParams).page)
  const path = `${FORUM_PATH}/${category.slug}`
  return pageMetadata({
    title: `${category.name} : le forum${page > 1 ? ` (page ${page})` : ''}`,
    description: `${category.description} Entraide sur le forum BabTech.`,
    path: page > 1 ? `${path}/?page=${page}` : path,
    og: 'forum',
  })
}

export default async function ForumCategoryPage({ params, searchParams }: Props) {
  const category = getForumCategory((await params).categorie)
  if (!category) notFound()
  const page = pageNumber((await searchParams).page)
  const path = `${FORUM_PATH}/${category.slug}`
  const member = await currentMember()

  let list: Awaited<ReturnType<typeof topicsInCategory>> | undefined
  if (dbConfigured()) {
    try {
      list = await topicsInCategory(category.slug, page)
    } catch (error) {
      console.error('forum : lecture impossible', error)
    }
  }
  if (list && page > 1 && !list.topics.length) notFound()
  const pages = list ? Math.max(1, Math.ceil(list.total / TOPICS_PER_PAGE)) : 1

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path: page > 1 ? `${path}/?page=${page}` : path,
            name: category.name,
            description: category.description,
            type: 'CollectionPage',
            og: 'forum',
            breadcrumb: page === 1,
            ...(list?.topics.length
              ? {
                  mainEntity: {
                    '@type': 'ItemList',
                    itemListElement: list.topics.map((t, i) => ({
                      '@type': 'ListItem',
                      position: (page - 1) * TOPICS_PER_PAGE + i + 1,
                      name: t.title,
                      url: absoluteUrl(topicPath(t.id, t.title)),
                    })),
                  },
                }
              : {}),
          }),
        )}
      />

      <PageHero
        eyebrow="Forum · Communauté BabTech"
        title={category.name}
        lead={category.description}
        tone="bronze"
        crumbs={[
          { name: 'Communauté', path: '/communaute' },
          { name: 'Forum', path: FORUM_PATH },
          { name: category.name, path },
        ]}
      >
        {member ? (
          <Link href={`/communaute/forum/nouveau/?categorie=${category.slug}`} className="btn-bronze">
            Ouvrir un sujet dans ce thème
            <Icon name="arrow-right" className="h-[18px] w-[18px]" />
          </Link>
        ) : (
          <Link href="/communaute/inscription/" className="btn-bronze">
            Créer mon compte pour participer
            <Icon name="arrow-right" className="h-[18px] w-[18px]" />
          </Link>
        )}
      </PageHero>

      <MemberBar member={member} next={`${path}/`} />

      <section className="py-14 md:py-16" aria-labelledby="sujets">
        <div className="container-b">
          <h2 id="sujets" className="section-title mb-6">
            Les sujets{page > 1 ? ` (page ${page})` : ''}
          </h2>
          {!list ? (
            <ForumUnavailable />
          ) : list.topics.length ? (
            <TopicList topics={list.topics} showCategory={false} />
          ) : (
            <p className="card p-6 text-txt-secondary">{fr("Aucun sujet dans ce thème pour l'instant : lance le premier !")}</p>
          )}

          {pages > 1 && (
            <nav aria-label="Pages" className="mt-8 flex flex-wrap gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={n === 1 ? `${path}/` : `${path}/?page=${n}`}
                  aria-current={n === page ? 'page' : undefined}
                  className={`rounded-lg border px-3.5 py-2 text-sm ${n === page ? 'border-bronze/60 bg-bronze/15 text-white' : 'border-bord text-txt-secondary hover:text-white'}`}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}

          <p className="mt-12 text-sm text-txt-muted">
            Autres thèmes&nbsp;:{' '}
            {forumCategories
              .filter((c) => c.slug !== category.slug)
              .map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && ' · '}
                  <Link href={`${FORUM_PATH}/${c.slug}/`} className="text-txt-secondary underline-offset-2 hover:text-white hover:underline">
                    {c.name}
                  </Link>
                </span>
              ))}
          </p>
        </div>
      </section>
    </>
  )
}
