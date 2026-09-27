import type { Metadata } from 'next'
import Image from 'next/image'
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
  "Le Terrier (bar-restaurant créé de A à Z), PWA Budget (application de gestion) et l'Hôtel Le Saint Éloi (réservation en direct et gestion de l'hôtel)."

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
                  ...(c.media ? { image: c.media.images.map((img) => absoluteUrl(img.src)) } : {}),
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
              {c.facts && (
                <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {c.facts.map((f) => (
                    <li key={f.label} className="rounded-xl border border-bord bg-white/[0.02] p-4 text-center">
                      <span className="block font-outfit text-2xl font-bold leading-none text-emerald-b">{fr(f.value)}</span>
                      <span className="mt-2 block text-[12.5px] leading-snug text-txt-muted">{f.label}</span>
                    </li>
                  ))}
                </ul>
              )}
              {c.media && (
                <div className="mt-8 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {c.media.images
                      .filter((img) => img.width > img.height)
                      .map((img) => (
                        <Image key={img.src} src={img.src} alt={img.alt} width={img.width} height={img.height} className="h-auto w-full rounded-xl border border-bord" />
                      ))}
                  </div>
                  <div className="mx-auto grid max-w-[760px] grid-cols-2 gap-4 sm:grid-cols-3">
                    {c.media.images
                      .filter((img) => img.width <= img.height)
                      .map((img) => (
                        <Image key={img.src} src={img.src} alt={img.alt} width={img.width} height={img.height} className="h-auto w-full rounded-xl border border-bord" />
                      ))}
                    {c.media.video && (
                      <figure className="col-span-2 mx-auto w-full max-w-[260px] sm:col-span-1 sm:max-w-none">
                        <video
                          controls
                          preload="none"
                          playsInline
                          poster={c.media.video.poster}
                          width={c.media.video.width}
                          height={c.media.video.height}
                          aria-label={fr(`Vidéo de démonstration : ${c.title}`)}
                          className="h-auto w-full rounded-xl border border-bord bg-black"
                        >
                          <source src={c.media.video.src} type="video/mp4" />
                        </video>
                        <figcaption className="mt-2 text-center text-[12.5px] leading-snug text-txt-muted">{fr(c.media.video.label)}</figcaption>
                      </figure>
                    )}
                  </div>
                  {c.media.note && <p className="text-[13px] text-txt-muted">{c.media.note}</p>}
                </div>
              )}
              {c.stack && (
                <p className="mt-6 flex flex-wrap items-center gap-2.5">
                  <span className="mr-1 text-sm text-txt-muted">Outils&nbsp;:</span>
                  {c.stack.map((t) => (
                    <span key={t} className="rounded-full border border-bord bg-white/[0.03] px-3.5 py-1.5 text-sm text-txt-secondary">
                      {t}
                    </span>
                  ))}
                </p>
              )}
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
