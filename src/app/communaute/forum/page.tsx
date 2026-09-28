import type { Metadata } from 'next'
import Link from 'next/link'
import { CommunityNav } from '@/components/community/CommunityNav'
import { ForumUnavailable } from '@/components/community/ForumUnavailable'
import { MemberBar } from '@/components/community/MemberBar'
import { TopicList } from '@/components/community/TopicList'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { FORUM_PATH, forumCategories } from '@/data/forum'
import { forumOverview } from '@/lib/community/forum'
import { currentMember } from '@/lib/community/members'
import { dbConfigured } from '@/lib/db'
import { graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { fr } from '@/lib/typography'

/** Accueil du forum : lu dans la base à chaque visite (sujets récents, nombre de sujets par catégorie). */
export const dynamic = 'force-dynamic'

const title = "Forum d'entraide : digital et IA entre entrepreneurs"
const description =
  "Pose tes questions sur ton site, ta visibilité sur Google, l'IA ou l'automatisation, et partage ce qui marche avec des entrepreneurs de l'Hérault et du Gard."

export const metadata: Metadata = pageMetadata({ title, description, path: FORUM_PATH, og: 'forum' })

type Search = { bienvenue?: string; compte?: string; sujet?: string }

const NOTICES: [keyof Search, string, string][] = [
  ['bienvenue', '1', 'Bienvenue ! Ton adresse est confirmée et ton compte est actif : tu peux ouvrir un sujet ou répondre aux autres membres.'],
  ['compte', 'supprime', "Ton compte est supprimé. Merci d'avoir participé."],
  ['sujet', 'supprime', 'Ton sujet est supprimé.'],
]

export default async function ForumPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams
  const member = await currentMember()
  let overview: Awaited<ReturnType<typeof forumOverview>> | undefined
  if (dbConfigured()) {
    try {
      overview = await forumOverview()
    } catch (error) {
      console.error('forum : lecture impossible', error)
    }
  }
  const notice = NOTICES.find(([key, value]) => params[key] === value)?.[2]

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path: FORUM_PATH,
            name: title,
            description,
            type: 'CollectionPage',
            og: 'forum',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: forumCategories.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: c.name,
                url: absoluteUrl(`${FORUM_PATH}/${c.slug}`),
              })),
            },
          }),
        )}
      />

      <PageHero
        eyebrow="Communauté · Forum"
        title="Le forum des entrepreneurs de l'Hérault et du Gard"
        lead="Une question sur ton site, ta fiche Google, l'IA ou un outil ? Pose-la ici, et partage ce qui marche pour toi. Tout le monde peut lire ; il suffit d'un compte gratuit pour écrire."
        tone="bronze"
        crumbs={[
          { name: 'Communauté', path: '/communaute' },
          { name: 'Forum', path: FORUM_PATH },
        ]}
      >
        {member ? (
          <Link href="/communaute/forum/nouveau/" className="btn-bronze">
            Ouvrir un sujet
            <Icon name="arrow-right" className="h-[18px] w-[18px]" />
          </Link>
        ) : (
          <Link href="/communaute/inscription/" className="btn-bronze">
            Créer mon compte gratuit
            <Icon name="arrow-right" className="h-[18px] w-[18px]" />
          </Link>
        )}
        <Link href="/communaute/charte/" className="btn-secondary">
          La charte du forum
        </Link>
      </PageHero>

      <MemberBar member={member} next={`${FORUM_PATH}/`} />

      <section className="py-14 md:py-16" aria-labelledby="categories">
        <div className="container-b">
          <CommunityNav current="forum" />
          {notice && (
            <p role="status" className="mb-8 rounded-xl border border-emerald-b/30 bg-emerald-b/[0.08] px-4 py-3 text-sm text-emerald-200">
              {fr(notice)}
            </p>
          )}
          {overview ? (
            <>
              <h2 id="categories" className="section-title mb-8">
                Les thèmes
              </h2>
              <ul className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {forumCategories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`${FORUM_PATH}/${c.slug}/`} className="card card-hover flex h-full flex-col p-6">
                      <span className="mb-4 flex items-center justify-between">
                        <Icon name={c.icon} className="h-6 w-6 text-bronze" />
                        <span className="text-[13px] text-txt-muted">
                          {overview.counts[c.slug]} sujet{overview.counts[c.slug] > 1 ? 's' : ''}
                        </span>
                      </span>
                      <span className="mb-2 font-outfit text-lg font-semibold text-white">{c.name}</span>
                      <span className="text-[14px] leading-relaxed text-txt-secondary">{fr(c.description)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="section-title mb-6">Derniers échanges</h2>
              {overview.latest.length ? (
                <TopicList topics={overview.latest} />
              ) : (
                <p className="card p-6 text-txt-secondary">
                  Aucun sujet pour l&apos;instant.{' '}
                  {member ? 'Lance le premier : une vraie question de ton quotidien.' : 'Crée ton compte et lance le premier !'}
                </p>
              )}
            </>
          ) : (
            <>
              <h2 id="categories" className="sr-only">
                Les thèmes
              </h2>
              <ForumUnavailable />
            </>
          )}
        </div>
      </section>
    </>
  )
}
