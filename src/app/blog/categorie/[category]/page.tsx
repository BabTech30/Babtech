import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaSection } from '@/components/CtaSection'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { PostCard } from '@/components/PostCard'
import { categories, getCategory } from '@/data/blog'
import { getAllPosts, getPostsByCategory } from '@/lib/blog'
import { graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

type Props = { params: Promise<{ category: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  const posts = getAllPosts()
  return categories.filter((c) => posts.some((p) => p.category === c.slug)).map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).category)
  if (!category) return {}
  return pageMetadata({
    title: `${category.name} : articles et guides pour TPE`,
    description: category.description,
    path: `/blog/categorie/${category.slug}`,
    og: `blog/categorie/${category.slug}`,
  })
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).category)
  if (!category) notFound()

  const path = `/blog/categorie/${category.slug}`
  const posts = getPostsByCategory(category.slug)
  const allPosts = getAllPosts()
  const otherCategories = categories.filter((c) => c.slug !== category.slug && allPosts.some((p) => p.category === c.slug))

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path,
            name: `${category.name} — Blog BabTech`,
            description: category.description,
            type: 'CollectionPage',
            og: `blog/categorie/${category.slug}`,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: posts.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: p.title,
                url: absoluteUrl(`/blog/${p.slug}`),
              })),
            },
          }),
        )}
      />

      <PageHero
        eyebrow="Le blog BabTech"
        title={category.name}
        lead={category.description}
        crumbs={[
          { name: 'Blog', path: '/blog' },
          { name: category.name, path },
        ]}
      />

      <section className="border-t border-bord py-14 md:py-16" aria-label={`Articles : ${category.name}`}>
        <div className="container-b">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} headingLevel="h2" />
            ))}
          </div>

          {otherCategories.length > 0 && (
            <nav aria-label="Autres thématiques" className="mt-12 flex flex-wrap items-center gap-2.5">
              <span className="mr-1 text-sm text-txt-muted">Autres thématiques&nbsp;:</span>
              {otherCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/blog/categorie/${c.slug}`}
                  className="rounded-full border border-bord bg-white/[0.03] px-4 py-2 text-sm text-txt-secondary transition-colors hover:border-white/20 hover:text-white"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>

      <CtaSection />
    </>
  )
}
