import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaSection } from '@/components/CtaSection'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { caseStudies } from '@/data/portfolio'
import { getService } from '@/data/services'
import { graph, ids, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { fr } from '@/lib/typography'

const title = 'Réalisations : sites, applications et outils digitaux pour TPE'
const description =
  'Le Terrier (bar-restaurant créé de A à Z), PWA Budget (application de gestion) et Hôtel Saint Eloi (règlement multilingue par QR code) : des projets concrets.'

export const metadata: Metadata = pageMetadata({ title, description, path: '/portfolio', og: 'portfolio' })

export default function Portfolio() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path: '/portfolio',
            name: title,
            description,
            type: 'CollectionPage',
            og: 'portfolio',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: caseStudies.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                  '@type': 'CreativeWork',
                  '@id': `${absoluteUrl('/portfolio')}#${c.slug}`,
                  name: c.title,
                  description: c.result,
                  genre: c.sector,
                  creator: { '@id': ids.organization },
                },
              })),
            },
          }),
        )}
      />

      <PageHero
        eyebrow="Réalisations"
        title="Des projets concrets. Des résultats qui parlent."
        lead="Chaque mission commence par un vrai problème et se termine par une solution qui tourne. Voici quelques projets menés de bout en bout."
        crumbs={[{ name: 'Réalisations', path: '/portfolio' }]}
      />

      <section className="border-t border-bord py-16 md:py-20" aria-label="Projets">
        <div className="container-b space-y-6">
          {caseStudies.map((c, i) => (
            <article key={c.slug} id={c.slug} className="card relative scroll-mt-28 overflow-hidden p-7 md:p-10">
              <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${i % 2 ? 'bg-bronze' : 'bg-emerald-b'}`} />
              <div className="mb-8 flex flex-wrap items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] font-outfit text-sm font-bold text-white">
                  0{i + 1}
                </span>
                <div>
                  <h2 className="font-outfit text-2xl font-semibold tracking-tight text-white">{c.title}</h2>
                  <p className="text-sm text-txt-secondary">{c.sector}</p>
                </div>
                <ul className="flex flex-wrap gap-2 md:ml-auto">
                  {c.services.map((slug) => {
                    const s = getService(slug)
                    return s ? (
                      <li key={slug}>
                        <Link href={`/services/${slug}`} className="chip border-white/15 bg-white/[0.04] text-txt-primary hover:border-emerald-b/40">
                          {s.name}
                        </Link>
                      </li>
                    ) : null
                  })}
                </ul>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[2px] text-txt-muted">Contexte</h3>
                  <p className="text-[15.5px] leading-relaxed text-txt-secondary">{fr(c.context)}</p>
                </div>
                <div>
                  <h3 className="mb-3 font-outfit text-xs font-semibold uppercase tracking-[2px] text-txt-muted">Ce que j&apos;ai livré</h3>
                  <ul className="space-y-2.5">
                    {c.delivered.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-txt-secondary">
                        <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-emerald-b" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-8 rounded-[14px] border border-dashed border-white/[0.1] bg-white/[0.02] p-6">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[2px] text-emerald-b">Résultat</p>
                <p className="leading-relaxed text-txt-primary">{fr(c.result)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-bord bg-nuit-light py-14" aria-labelledby="temoignages">
        <div className="container-b max-w-[720px] text-center">
          <h2 id="temoignages" className="mb-3 font-outfit text-2xl font-semibold text-white">
            Les témoignages clients arrivent
          </h2>
          <p className="leading-relaxed text-txt-secondary">
            Les projets sont là, les retours écrits suivent. Tu veux en parler directement avec moi&nbsp;? Je te présente volontiers le détail
            d&apos;un projet proche du tien lors d&apos;un premier échange.
          </p>
        </div>
      </section>

      <CtaSection title="Un projet en tête ?" text="Parlons-en. Trente minutes, zéro engagement, juste un premier échange." />
    </>
  )
}
