import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AuthorBox } from '@/components/AuthorBox'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { FaqList } from '@/components/FaqList'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PostCard } from '@/components/PostCard'
import { TableOfContents } from '@/components/TableOfContents'
import { formatDate, getAllPosts, getPost, getRelatedPosts } from '@/lib/blog'
import { blogPostingNode, faqNode, graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'
import { fr } from '@/lib/typography'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return {}
  return pageMetadata({
    title: post.seoTitle,
    description: post.description,
    path: `/blog/${post.slug}`,
    og: `blog/${post.slug}`,
    ogAlt: post.title,
    article: {
      publishedTime: post.date,
      modifiedTime: post.updated,
      section: post.categoryName,
      tags: post.tags,
    },
  })
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug)
  if (!post) notFound()

  const path = `/blog/${post.slug}`
  const related = getRelatedPosts(post)

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path,
            name: post.seoTitle,
            description: post.description,
            og: `blog/${post.slug}`,
            datePublished: post.date,
            dateModified: post.updated,
            about: { '@id': `${site.url}${path}#article` },
          }),
          blogPostingNode(post),
          faqNode(path, post.faq),
        )}
      />

      <article>
        <header className="relative overflow-hidden pb-12 pt-8 md:pb-14 md:pt-12">
          <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
          <div className="container-b relative">
            <Breadcrumbs
              items={[
                { name: 'Blog', path: '/blog' },
                { name: post.categoryName, path: `/blog/categorie/${post.category}` },
                { name: post.title, path },
              ]}
            />
            <div className="max-w-[820px]">
              <Link
                href={`/blog/categorie/${post.category}`}
                className="chip mb-5 border-emerald-b/25 bg-emerald-b/[0.1] text-emerald-b hover:bg-emerald-b/[0.16]"
              >
                {post.categoryName}
              </Link>
              <h1 className="mb-5 font-outfit text-[32px] font-bold leading-[1.12] tracking-tight text-white sm:text-[42px] md:text-5xl">
                {fr(post.title)}
              </h1>
              <p className="lead mb-7">{fr(post.description)}</p>
              <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-txt-muted">
                <span>
                  Par{' '}
                  <Link href="/a-propos" rel="author" className="font-medium text-txt-primary hover:text-emerald-b">
                    {site.founder.name}
                  </Link>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Publié le <time dateTime={post.date}>{formatDate(post.date)}</time>
                </span>
                {post.updated !== post.date && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>
                      Mis à jour le <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                    </span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{post.readingMinutes} min de lecture</span>
              </p>
            </div>
          </div>
        </header>

        <div className="border-t border-bord">
          <div className="container-b grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:py-16">
            <div className="min-w-0">
              {post.tldr.length > 0 && (
                <section aria-labelledby="essentiel" className="mb-10 rounded-2xl border border-emerald-b/25 bg-emerald-b/[0.05] p-6 md:p-7">
                  <h2 id="essentiel" className="mb-4 flex items-center gap-2 font-outfit text-lg font-semibold text-white">
                    <Icon name="zap" className="h-5 w-5 text-emerald-b" />
                    L&apos;essentiel en 30 secondes
                  </h2>
                  <ul className="space-y-2.5">
                    {post.tldr.map((t) => (
                      <li key={t} className="flex gap-3 text-[15.5px] leading-relaxed text-txt-primary">
                        <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-emerald-b" />
                        {fr(t)}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="lg:hidden">
                <TableOfContents headings={post.headings} />
              </div>

              <div
                className="prose prose-lg prose-babtech mt-10 max-w-none prose-headings:scroll-mt-28 prose-h2:text-[28px] prose-h3:text-[21px] lg:mt-0"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />

              {post.faq.length > 0 && (
                <section aria-labelledby="faq-article" className="mt-14">
                  <h2 id="faq-article" className="mb-6 font-outfit text-[28px] font-bold tracking-tight text-white">
                    Questions fréquentes
                  </h2>
                  <FaqList items={post.faq} />
                </section>
              )}

              <div className="mt-14">
                <AuthorBox />
              </div>
            </div>

            <aside className="hidden lg:block" aria-label="Navigation de l'article">
              <div className="sticky top-24 space-y-5">
                <TableOfContents headings={post.headings} />
                <div className="card p-6">
                  <p className="mb-2 font-outfit text-lg font-semibold text-white">Un projet en tête&nbsp;?</p>
                  <p className="mb-5 text-sm leading-relaxed text-txt-secondary">
                    30 minutes gratuites pour en parler, sans engagement. Réponse sous 24 h.
                  </p>
                  <Link href="/contact" className="btn-primary btn-sm w-full" data-track="contact-article">
                    Parlons-en
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <section className="border-t border-bord bg-nuit-deep py-14" aria-labelledby="discussion">
        <div className="container-b grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h2 id="discussion" className="mb-2 font-outfit text-2xl font-bold text-white">
              Envie d&apos;en discuter avec d&apos;autres entrepreneurs&nbsp;?
            </h2>
            <p className="leading-relaxed text-txt-secondary">
              La communauté BabTech réunit des dirigeants de TPE de Montpellier et de l&apos;Hérault pour apprendre le digital et l&apos;IA
              ensemble&nbsp;: ateliers, cercles de travail et rencontres.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/communaute" className="btn-bronze">
              Rejoindre la communauté
            </Link>
            <Link href="/contact" className="btn-secondary">
              Me contacter
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-bord py-16" aria-labelledby="a-lire">
          <div className="container-b">
            <h2 id="a-lire" className="section-title mb-10">
              À lire aussi
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
