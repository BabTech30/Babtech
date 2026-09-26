import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { PostCard } from '@/components/PostCard'
import { categories } from '@/data/blog'
import { formatDate, getAllPosts } from '@/lib/blog'
import { blogNode, graph, ids, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { fr } from '@/lib/typography'

const title = 'Blog : digital, IA et référencement pour les TPE'
const description =
  "Guides concrets pour les TPE, artisans et commerçants de Montpellier et de l'Hérault : site internet, SEO local, GEO, applications métier, automatisation et IA."

export const metadata: Metadata = pageMetadata({ title, description, path: '/blog', og: 'blog' })

export default function BlogPage() {
  const posts = getAllPosts()
  const [featured, ...others] = posts
  const usedCategories = categories.filter((c) => posts.some((p) => p.category === c.slug))

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({ path: '/blog', name: title, description, type: 'CollectionPage', og: 'blog', mainEntity: { '@id': ids.blog } }),
          blogNode(posts),
        )}
      />

      <PageHero
        eyebrow="Le blog BabTech"
        title="Digital, IA et référencement : des guides concrets pour les TPE"
        lead="Des articles écrits pour les dirigeants de TPE, artisans et commerçants de Montpellier et de l'Hérault. Pas de jargon : des méthodes, des exemples et des réponses claires."
        crumbs={[{ name: 'Blog', path: '/blog' }]}
      />

      <section className="border-t border-bord py-14 md:py-16" aria-label="Articles">
        <div className="container-b">
          <nav aria-label="Thématiques du blog" className="mb-10 flex flex-wrap gap-2.5">
            <span className="rounded-full border border-emerald-b/40 bg-emerald-b/[0.1] px-4 py-2 text-sm font-medium text-emerald-b">
              Tous les articles
            </span>
            {usedCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/blog/categorie/${c.slug}`}
                className="rounded-full border border-bord bg-white/[0.03] px-4 py-2 text-sm text-txt-secondary transition-colors hover:border-white/20 hover:text-white"
              >
                {c.name}
              </Link>
            ))}
          </nav>

          {featured && (
            <article className="card card-hover relative mb-8 grid gap-6 overflow-hidden p-8 md:grid-cols-[1.4fr_1fr] md:p-10">
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-b to-bronze" />
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-emerald-b">
                  À la une · {featured.categoryName}
                </p>
                <h2 className="mb-4 font-outfit text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
                  <Link href={`/blog/${featured.slug}`} className="after:absolute after:inset-0">
                    {fr(featured.title)}
                  </Link>
                </h2>
                <p className="mb-5 leading-relaxed text-txt-secondary">{fr(featured.description)}</p>
                <p className="text-[13px] text-txt-muted">
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time> · {featured.readingMinutes} min de lecture
                </p>
              </div>
              {featured.tldr.length > 0 && (
                <ul className="space-y-3 self-center rounded-xl border border-bord bg-white/[0.02] p-5 text-[14px] leading-relaxed text-txt-secondary">
                  {featured.tldr.slice(0, 3).map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-b" />
                      {fr(t)}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          )}

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <PostCard key={p.slug} post={p} headingLevel="h2" />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-bord bg-nuit-deep py-16" aria-labelledby="blog-communaute">
        <div className="container-b flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-[640px]">
            <h2 id="blog-communaute" className="mb-2 font-outfit text-2xl font-bold text-white">
              Ces sujets, on les travaille aussi ensemble
            </h2>
            <p className="leading-relaxed text-txt-secondary">
              Les thèmes du blog sont au cœur des groupes de travail et d&apos;apprentissage de la communauté BabTech, à Montpellier et en visio.
            </p>
          </div>
          <Link href="/communaute" className="btn-bronze shrink-0">
            Découvrir la communauté
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
