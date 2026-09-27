import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaSection } from '@/components/CtaSection'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { otherCommunes } from '@/data/area'
import { services } from '@/data/services'
import { departments, inCity, zonesIn } from '@/data/zones'
import { areaServed, graph, ids, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { fr } from '@/lib/typography'

const title = "Agence web et IA dans l'Hérault et le Gard"
const description =
  "Sites internet, applications et automatisations IA pour les TPE de l'Hérault et du Gard : Montpellier, Nîmes, Béziers, Sète, Alès, Uzès, Agde, Lunel…"

export const metadata: Metadata = pageMetadata({ title, description, path: '/zones-intervention', og: 'zones-intervention' })

export default function ZonesPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path: '/zones-intervention',
            name: title,
            description,
            type: 'CollectionPage',
            og: 'zones-intervention',
            about: { '@id': ids.organization },
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: departments.flatMap((d) => zonesIn(d.name)).map((z, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: `BabTech ${inCity(z.name)}`,
                url: absoluteUrl(`/zones-intervention/${z.slug}`),
              })),
            },
          }),
          {
            '@type': 'Service',
            '@id': `${absoluteUrl('/zones-intervention')}#service`,
            name: "Création de sites internet, applications métier et automatisation IA dans l'Hérault et le Gard",
            provider: { '@id': ids.organization },
            areaServed: areaServed(),
          },
        )}
      />

      <PageHero
        eyebrow="Zones d'intervention"
        title="Ton partenaire digital dans l'Hérault et le Gard, de Montpellier à Nîmes"
        lead="Basé près de Montpellier, j'accompagne les TPE, artisans, commerçants et loueurs saisonniers de l'Hérault et du Gard : sites internet, applications métier, automatisations IA et référencement local. On échange en visio ou en rendez-vous, selon ce qui t'arrange."
        crumbs={[{ name: "Zones d'intervention", path: '/zones-intervention' }]}
      >
        <Link href="/contact" className="btn-primary">
          Parler de mon projet
          <Icon name="arrow-right" className="h-[18px] w-[18px]" />
        </Link>
      </PageHero>

      <section className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="villes">
        <div className="container-b">
          <div className="mb-10 max-w-[720px]">
            <p className="section-tag text-emerald-b">Par ville</p>
            <h2 id="villes" className="section-title mb-4">
              Les villes que j&apos;accompagne
            </h2>
            <p className="text-[17px] leading-relaxed text-txt-secondary">
              Chaque territoire a son tissu économique et ses clients. Voici comment je travaille avec les entreprises de chaque ville.
            </p>
          </div>
          <div className="space-y-12">
            {departments.map((d) => (
              <div key={d.name} id={d.name === 'Gard' ? 'gard' : 'herault'} className="scroll-mt-24">
                <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-outfit text-2xl font-semibold text-white">{d.label}</h3>
                  <p className="text-[15px] text-txt-secondary">{fr(d.intro)}</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {zonesIn(d.name).map((z) => (
                    <article key={z.slug} className="card card-hover relative flex flex-col p-6">
                      <p className="mb-2 flex items-center gap-1.5 text-[12px] uppercase tracking-[1.5px] text-txt-muted">
                        <Icon name="map-pin" className="h-3.5 w-3.5 text-emerald-b" /> {z.postalCode}
                      </p>
                      <h4 className="mb-2 font-outfit text-xl font-semibold text-white">
                        <Link href={`/zones-intervention/${z.slug}`} className="after:absolute after:inset-0">
                          {z.name}
                        </Link>
                      </h4>
                      <p className="flex-1 text-[14px] leading-relaxed text-txt-secondary">{fr(z.situation)}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-emerald-b">
                        Voir la page <Icon name="arrow-right" className="h-4 w-4" />
                      </span>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-bord py-16 md:py-20" aria-labelledby="communes">
        <div className="container-b grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="section-tag text-bronze">Et aussi</p>
            <h2 id="communes" className="section-title mb-4">
              Les autres communes desservies
            </h2>
            <p className="text-[17px] leading-relaxed text-txt-secondary">
              Ta commune n&apos;apparaît pas ? Pas d&apos;inquiétude&nbsp;: j&apos;interviens partout dans l&apos;Hérault et le Gard, et à distance partout en
              France.
            </p>
          </div>
          <div className="space-y-7">
            {Object.entries(otherCommunes).map(([group, towns]) => (
              <div key={group}>
                <h3 className="mb-3 font-outfit text-sm font-semibold uppercase tracking-[1.5px] text-txt-primary">{group}</h3>
                <ul className="flex flex-wrap gap-2">
                  {towns.map((t) => (
                    <li key={t} className="rounded-full border border-bord bg-white/[0.02] px-3.5 py-1.5 text-sm text-txt-secondary">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="services-locaux">
        <div className="container-b">
          <h2 id="services-locaux" className="section-title mb-10">
            Ce que je propose aux entreprises de l&apos;Hérault et du Gard
          </h2>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="card card-hover flex h-full items-start gap-4 p-6">
                  <Icon name={s.icon} className="mt-0.5 h-6 w-6 shrink-0 text-emerald-b" />
                  <span>
                    <span className="mb-1 block font-outfit text-lg font-semibold text-white">{s.name}</span>
                    <span className="block text-[14px] leading-relaxed text-txt-secondary">{fr(s.priceLabel)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaSection title="Une entreprise dans l'Hérault ou le Gard ? Parlons-en." />
    </>
  )
}
