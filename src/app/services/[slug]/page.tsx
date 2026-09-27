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
import { PostCard } from '@/components/PostCard'
import { accentStyles, ServiceCard } from '@/components/ServiceCard'
import { getCaseStudy } from '@/data/portfolio'
import { getService, services, type ServiceSlug } from '@/data/services'
import { departments, zonesIn } from '@/data/zones'
import { getAllPosts } from '@/lib/blog'
import { faqNode, graph, serviceNode, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl, site } from '@/lib/site'
import { fr } from '@/lib/typography'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug)
  if (!service) return {}
  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    og: `services/${service.slug}`,
  })
}

/** Libellé court utilisé dans les liens locaux (« Création de site internet à Sète »). */
const localLabel: Record<ServiceSlug, string> = {
  'creation-site-internet': 'Création de site internet',
  'application-metier': 'Application métier',
  'automatisation-ia': 'Automatisation et IA',
  'site-reservation-location-saisonniere': 'Site de réservation',
  'referencement-local-geo': 'Référencement local',
  'accompagnement-formation-ia': 'Formation IA',
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug)
  if (!service) notFound()

  const path = `/services/${service.slug}`
  const a = accentStyles[service.accent]
  const caseStudy = service.caseStudy ? getCaseStudy(service.caseStudy) : undefined
  const posts = getAllPosts().filter((p) => service.relatedPosts.includes(p.slug))
  const related = services.filter((s) => service.related.includes(s.slug))

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path,
            name: service.metaTitle,
            description: service.metaDescription,
            og: `services/${service.slug}`,
            about: { '@id': `${absoluteUrl(path)}#service` },
          }),
          serviceNode({ service, path }),
          faqNode(path, service.faq),
        )}
      />

      <PageHero
        eyebrow={service.badge}
        title={service.h1}
        lead={service.lead}
        crumbs={[
          { name: 'Services', path: '/services' },
          { name: service.name, path },
        ]}
        aside={
          <FactsCard
            facts={[
              { label: 'Tarif', value: service.priceLabel },
              ...(service.duration ? [{ label: 'Délai', value: service.duration }] : []),
              { label: 'Zone', value: 'Hérault, Gard et à distance' },
              { label: 'Premier échange', value: 'Gratuit, 30 minutes' },
              { label: 'Réponse', value: 'Sous 24 h' },
            ]}
          />
        }
      >
        <Link href={`/contact?besoin=${service.slug}`} className="btn-primary" data-track={`devis-${service.slug}`}>
          Demander un devis gratuit
          <Icon name="arrow-right" className="h-[18px] w-[18px]" />
        </Link>
        <Link href={site.bookingPath} className="btn-secondary" data-track="rendez-vous">
          <Icon name="calendar" className="h-[18px] w-[18px]" />
          Réserver un appel
        </Link>
      </PageHero>

      {/* Pour qui + résultat */}
      <section className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="pour-qui">
        <div className="container-b grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 id="pour-qui" className="section-title mb-7">
              Pour qui&nbsp;?
            </h2>
            <ul className="space-y-3.5">
              {service.audience.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[16px] leading-relaxed text-txt-secondary">
                  <Icon name="check" className={`mt-1 h-5 w-5 shrink-0 ${a.text}`} />
                  {fr(item)}
                </li>
              ))}
            </ul>
          </div>
          <div className="card relative self-start overflow-hidden p-7">
            <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${a.bar}`} />
            <p className={`mb-2 text-[11px] font-semibold uppercase tracking-[2px] ${a.text}`}>Résultat</p>
            <p className="mb-6 text-lg leading-relaxed text-txt-primary">{fr(service.result)}</p>
            <dl className="grid gap-4 border-t border-bord pt-5 text-sm">
              <div>
                <dt className="text-txt-muted">Tarif</dt>
                <dd className="font-outfit text-2xl font-bold text-white">{fr(service.priceLabel)}</dd>
                <dd className="mt-1 text-[13px] text-txt-muted">{fr(service.priceNote)}</dd>
              </div>
              {service.duration && (
                <div>
                  <dt className="text-txt-muted">Délai</dt>
                  <dd className="font-medium text-txt-primary">{fr(service.duration)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>

      {/* Livrables */}
      <section className="border-t border-bord py-16 md:py-20" aria-labelledby="contenu-offre">
        <div className="container-b">
          <div className="mb-10 max-w-[720px]">
            <p className={`section-tag ${a.text}`}>Concrètement</p>
            <h2 id="contenu-offre" className="section-title">
              Ce que je fais pour toi
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.deliverables.map((d) => (
              <div key={d.title} className="card p-7">
                <span className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${a.iconBg}`}>
                  <Icon name="check" className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </span>
                <h3 className="mb-2 font-outfit text-lg font-semibold tracking-tight text-white">{d.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-txt-secondary">{fr(d.desc)}</p>
              </div>
            ))}
          </div>

          {service.extras && (
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <span className="mr-1 text-sm text-txt-muted">En option&nbsp;:</span>
              {service.extras.map((e) => (
                <span key={e} className="rounded-full border border-bord bg-white/[0.03] px-3.5 py-1.5 text-sm text-txt-secondary">
                  {e}
                </span>
              ))}
            </div>
          )}

          {service.stack && (
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="mr-1 text-sm text-txt-muted">Outils&nbsp;:</span>
              {service.stack.map((t) => (
                <span key={t} className="rounded-full border border-bord bg-white/[0.03] px-3.5 py-1.5 text-sm text-txt-secondary">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Méthode */}
      <section className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="deroulement">
        <div className="container-b">
          <h2 id="deroulement" className="section-title mb-10">
            Comment ça se passe&nbsp;?
          </h2>
          <ProcessSteps />
        </div>
      </section>

      {/* Réalisation liée */}
      {caseStudy && (
        <section className="border-t border-bord py-16 md:py-20" aria-labelledby="exemple">
          <div className="container-b">
            <div className="card grid gap-8 p-8 md:grid-cols-[1fr_1.4fr] md:p-10">
              <div>
                <p className="section-tag text-bronze">Exemple concret</p>
                <h2 id="exemple" className="mb-2 font-outfit text-3xl font-bold tracking-tight text-white">
                  {caseStudy.title}
                </h2>
                <p className="mb-6 text-txt-muted">{caseStudy.sector}</p>
                <Link href={`/portfolio#${caseStudy.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-b hover:underline">
                  Voir la réalisation <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              </div>
              <div>
                <p className="mb-5 leading-relaxed text-txt-secondary">{fr(caseStudy.context)}</p>
                <p className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.015] p-5 leading-relaxed text-txt-primary">
                  {fr(caseStudy.result)}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="faq-service">
        <div className="container-b grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="section-tag text-emerald-b">Questions fréquentes</p>
            <h2 id="faq-service" className="section-title">
              {service.name}&nbsp;: tes questions
            </h2>
          </div>
          <FaqList items={service.faq} openFirst />
        </div>
      </section>

      {/* Local */}
      <section className="border-t border-bord py-16 md:py-20" aria-labelledby="local">
        <div className="container-b">
          <h2 id="local" className="section-title mb-4">
            Près de chez toi, dans l&apos;Hérault et le Gard
          </h2>
          <p className="mb-8 max-w-[680px] text-[17px] leading-relaxed text-txt-secondary">
            Basé près de Montpellier, j&apos;accompagne les entreprises des deux départements — en visio ou en rendez-vous quand le projet
            s&apos;y prête.
          </p>
          <div className="space-y-6">
            {departments.map((d) => (
              <div key={d.name}>
                <p className="mb-3 font-outfit text-[13px] font-semibold uppercase tracking-[1.5px] text-txt-primary">{d.label}</p>
                <ul className="flex flex-wrap gap-2.5">
                  {zonesIn(d.name).map((z) => (
                    <li key={z.slug}>
                      <Link
                        href={`/zones-intervention/${z.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-bord bg-white/[0.03] px-4 py-2.5 text-sm text-txt-secondary transition-colors hover:border-white/20 hover:text-white"
                      >
                        <Icon name="map-pin" className="h-4 w-4 text-txt-muted" />
                        {localLabel[service.slug]} à {z.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      {posts.length > 0 && (
        <section className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="articles">
          <div className="container-b">
            <h2 id="articles" className="section-title mb-10">
              Pour aller plus loin
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services liés */}
      <section className="border-t border-bord py-16 md:py-20" aria-labelledby="autres-services">
        <div className="container-b">
          <h2 id="autres-services" className="section-title mb-10">
            Souvent associé à
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {related.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title="Un projet en tête ? Parlons-en."
        text={`Un premier échange gratuit de 30 minutes pour cadrer ton besoin (${service.name}) et recevoir un devis clair, sans engagement.`}
      />
    </>
  )
}
