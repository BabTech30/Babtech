import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaSection } from '@/components/CtaSection'
import { FactsCard } from '@/components/FactsCard'
import { FaqList } from '@/components/FaqList'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { ProcessSteps } from '@/components/ProcessSteps'
import { services } from '@/data/services'
import { getZone, type Zone, zones } from '@/data/zones'
import { faqNode, graph, ids, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl, site } from '@/lib/site'
import { fr } from '@/lib/typography'

type Props = { params: Promise<{ ville: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return zones.map((z) => ({ ville: z.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const zone = getZone((await params).ville)
  if (!zone) return {}
  return pageMetadata({
    title: zone.metaTitle,
    description: zone.metaDescription,
    path: `/zones-intervention/${zone.slug}`,
    og: `zones/${zone.slug}`,
  })
}

export default async function ZonePage({ params }: Props) {
  const zone = getZone((await params).ville)
  if (!zone) notFound()

  const path = `/zones-intervention/${zone.slug}`
  // Villes voisines qui ont leur page (liens), puis communes voisines sans page (simples étiquettes).
  const nearby = [...zone.nearby, ...zone.nearbyTowns.map((t) => zones.find((z) => z.name === t)?.slug)]
    .map((slug) => (slug ? getZone(slug) : undefined))
    .filter((z, i, list): z is Zone => Boolean(z) && list.indexOf(z) === i)
  const nearbyTowns = zone.nearbyTowns.filter((t) => !nearby.some((z) => z.name === t))
  const city = { '@type': 'City', name: zone.name, sameAs: zone.wikipedia }
  // Le service le plus utile localement passe en premier (ex. site de réservation dans les villes touristiques).
  const localServices = [...services].sort((a, b) => Number(b.slug === zone.featured) - Number(a.slug === zone.featured))
  const featured = localServices.find((s) => s.slug === zone.featured)

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path,
            name: zone.metaTitle,
            description: zone.metaDescription,
            og: `zones/${zone.slug}`,
            about: { '@id': `${absoluteUrl(path)}#service` },
          }),
          {
            '@type': 'Service',
            '@id': `${absoluteUrl(path)}#service`,
            name: zone.h1,
            description: zone.lead,
            url: absoluteUrl(path),
            provider: { '@id': ids.organization },
            areaServed: city,
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: `Services BabTech à ${zone.name}`,
              itemListElement: localServices.map((s) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: `${s.name} à ${zone.name}`, url: absoluteUrl(`/services/${s.slug}`) },
                ...(s.priceFrom
                  ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: s.priceFrom, priceCurrency: 'EUR' } }
                  : {}),
              })),
            },
          },
          faqNode(path, zone.faq),
        )}
      />

      <PageHero
        eyebrow={`${zone.name} · ${zone.postalCode} · ${zone.department}`}
        title={zone.h1}
        lead={zone.lead}
        crumbs={[
          { name: "Zones d'intervention", path: '/zones-intervention' },
          { name: zone.name, path },
        ]}
        aside={
          <FactsCard
            title={`En bref à ${zone.name}`}
            facts={[
              ...(featured?.slug === 'site-reservation-location-saisonniere'
                ? [{ label: 'Site de réservation', value: 'Dès 250 €' }]
                : []),
              { label: 'Site vitrine', value: 'Dès 800 €' },
              { label: 'Application métier', value: 'Dès 1 500 €' },
              { label: 'Automatisation & IA', value: 'Dès 3 000 €' },
              { label: 'Rendez-vous', value: 'Visio ou sur place' },
              { label: 'Réponse', value: 'Sous 24 h' },
            ]}
          />
        }
      >
        <Link href="/contact" className="btn-primary" data-track={`contact-zone-${zone.slug}`}>
          Parler de mon projet
          <Icon name="arrow-right" className="h-[18px] w-[18px]" />
        </Link>
        <Link href={site.bookingPath} className="btn-secondary" data-track="rendez-vous">
          <Icon name="calendar" className="h-[18px] w-[18px]" />
          Réserver un appel
        </Link>
      </PageHero>

      <section className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="contexte">
        <div className="container-b grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 id="contexte" className="section-title mb-7">
              Le digital pour les entreprises de {zone.name}
            </h2>
            <div className="space-y-5 text-[16.5px] leading-[1.85] text-txt-secondary">
              {zone.context.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{fr(paragraph)}</p>
              ))}
            </div>
          </div>
          <aside className="card self-start p-7">
            <p className="mb-4 font-outfit text-[13px] font-semibold uppercase tracking-[1.5px] text-txt-primary">Comment on travaille</p>
            <p className="mb-6 leading-relaxed text-txt-secondary">{fr(zone.meeting)}</p>
            <ul className="space-y-2.5 border-t border-bord pt-5 text-sm text-txt-secondary">
              <li className="flex items-center gap-2.5">
                <Icon name="map-pin" className="h-4 w-4 text-emerald-b" /> {zone.situation}
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="clock" className="h-4 w-4 text-emerald-b" /> Réponse sous 24 h
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="check" className="h-4 w-4 text-emerald-b" /> Premier échange gratuit
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-t border-bord py-16 md:py-20" aria-labelledby="metiers">
        <div className="container-b">
          <div className="mb-10 max-w-[720px]">
            <p className="section-tag text-bronze">Sur le terrain</p>
            <h2 id="metiers" className="section-title">
              Les métiers que j&apos;accompagne à {zone.name}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {zone.sectors.map((s) => (
              <div key={s.name} className="card p-7">
                <h3 className="mb-2 font-outfit text-lg font-semibold text-white">{s.name}</h3>
                <p className="text-[15px] leading-relaxed text-txt-secondary">{fr(s.need)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="offre-locale">
        <div className="container-b">
          <div className="mb-10 max-w-[720px]">
            <p className="section-tag text-emerald-b">Services</p>
            <h2 id="offre-locale" className="section-title">
              Ce que je propose à {zone.name}
            </h2>
          </div>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {localServices.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className={`card card-hover flex h-full flex-col p-6 ${s.slug === zone.featured ? 'border-emerald-b/40' : ''}`}
                >
                  <span className="mb-4 flex items-center justify-between gap-3">
                    <Icon name={s.icon} className="h-6 w-6 text-emerald-b" />
                    {s.slug === zone.featured && (
                      <span className="rounded-full border border-emerald-b/30 bg-emerald-b/[0.08] px-2.5 py-0.5 text-[12px] font-semibold text-emerald-b">
                        À la une à {zone.name}
                      </span>
                    )}
                  </span>
                  <span className="mb-2 font-outfit text-lg font-semibold text-white">
                    {s.name} à {zone.name}
                  </span>
                  <span className="mb-4 flex-1 text-[14px] leading-relaxed text-txt-secondary">{fr(s.summary)}</span>
                  <span className="text-sm font-semibold text-txt-primary">{fr(s.priceLabel)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-bord py-16 md:py-20" aria-labelledby="methode">
        <div className="container-b">
          <h2 id="methode" className="section-title mb-10">
            Un projet en 4 étapes, sans jargon
          </h2>
          <ProcessSteps />
        </div>
      </section>

      <section className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="faq-locale">
        <div className="container-b grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="section-tag text-emerald-b">Questions fréquentes</p>
            <h2 id="faq-locale" className="section-title">
              Le digital à {zone.name}, en questions
            </h2>
          </div>
          <FaqList items={zone.faq} openFirst />
        </div>
      </section>

      <section className="border-t border-bord py-14" aria-labelledby="alentours">
        <div className="container-b">
          <h2 id="alentours" className="mb-6 font-outfit text-xl font-semibold text-white">
            J&apos;interviens aussi aux alentours de {zone.name}
          </h2>
          <ul className="flex flex-wrap gap-2.5">
            {nearby.map((z) => (
              <li key={z.slug}>
                <Link
                  href={`/zones-intervention/${z.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-b/25 bg-emerald-b/[0.06] px-4 py-2 text-sm text-emerald-b hover:bg-emerald-b/[0.12]"
                >
                  <Icon name="map-pin" className="h-4 w-4" /> {z.name}
                </Link>
              </li>
            ))}
            {nearbyTowns.map((t) => (
              <li key={t} className="rounded-full border border-bord bg-white/[0.02] px-4 py-2 text-sm text-txt-secondary">
                {t}
              </li>
            ))}
            <li>
              <Link href="/zones-intervention" className="inline-flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-emerald-b hover:underline">
                Toutes les zones <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <CtaSection title={`Une entreprise à ${zone.name} ? Parlons-en.`} />
    </>
  )
}
