import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaSection } from '@/components/CtaSection'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { ProcessSteps } from '@/components/ProcessSteps'
import { accentStyles } from '@/components/ServiceCard'
import { levels, services, transversal, turnkey } from '@/data/services'
import { graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { fr } from '@/lib/typography'

const title = 'Services digitaux pour TPE à Montpellier : site, application, IA'
const description =
  "Sites dès 800 €, applications métier dès 1 500 €, automatisation IA dès 3 000 €, sites de réservation dès 250 €, SEO local, GEO et formation IA : Hérault et Gard."

export const metadata: Metadata = pageMetadata({ title, description, path: '/services', og: 'services' })

const comparison = [
  { need: 'Être trouvé en ligne et inspirer confiance', answer: 'Site internet + SEO local', slug: 'creation-site-internet', price: 'Dès 800 €', delay: '2 à 4 semaines' },
  { need: 'Arrêter Excel, le papier et les doubles saisies', answer: 'Application métier / PWA', slug: 'application-metier', price: 'Dès 1 500 €', delay: 'Par étapes' },
  { need: 'Supprimer les tâches répétitives', answer: 'Automatisation & IA (n8n)', slug: 'automatisation-ia', price: 'Dès 3 000 €', delay: 'Selon les processus' },
  { need: 'Louer ton logement en direct, sans commission', answer: 'Site de réservation (locations saisonnières)', slug: 'site-reservation-location-saisonniere', price: 'Dès 250 €', delay: 'Selon les options' },
  { need: 'Apparaître dans Google Maps et les réponses des IA', answer: 'Référencement local & GEO', slug: 'referencement-local-geo', price: 'Inclus dans les sites', delay: 'Effets en quelques semaines' },
  { need: "Savoir par où commencer, former l'équipe à l'IA", answer: 'Accompagnement & formation IA', slug: 'accompagnement-formation-ia', price: 'Sur devis', delay: 'Selon le format' },
]

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path: '/services',
            name: title,
            description,
            type: 'CollectionPage',
            og: 'services',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: services.map((s, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: s.name,
                url: absoluteUrl(`/services/${s.slug}`),
              })),
            },
          }),
        )}
      />

      <PageHero
        eyebrow="Services"
        title="Ce dont tu as besoin. Rien de plus, rien de moins."
        lead="Pas de formule magique. Sites internet, applications métier, automatisations IA ou site de réservation pour ta location : je construis ce dont ton activité a vraiment besoin, au bon moment et au bon niveau."
        crumbs={[{ name: 'Services', path: '/services' }]}
      >
        <a href="#comparatif" className="btn-secondary">
          Quel service pour quel besoin&nbsp;?
        </a>
      </PageHero>

      {[...levels, ...turnkey].map((s, i) => {
        const a = accentStyles[s.accent]
        return (
          <section key={s.slug} className={`border-t border-bord py-16 md:py-20 ${i % 2 === 0 ? 'bg-nuit-light' : ''}`} aria-labelledby={`titre-${s.slug}`}>
            <div className="container-b grid gap-12 lg:grid-cols-2 lg:items-start">
              <div className="max-w-[520px]">
                <span className={`chip mb-5 ${a.chip}`}>{s.badge}</span>
                <h2 id={`titre-${s.slug}`} className="mb-3 font-outfit text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                  {s.promise}
                </h2>
                <p className={`mb-5 font-medium ${a.text}`}>{s.name}</p>
                <p className="mb-7 text-base leading-[1.8] text-txt-secondary">{fr(s.lead)}</p>
                <p className="mb-1 font-outfit text-[28px] font-bold text-white">{fr(s.priceLabel)}</p>
                <p className="mb-7 text-[13px] text-txt-muted">{fr(s.priceNote)}</p>
                <Link href={`/services/${s.slug}`} className="btn-secondary">
                  Tout savoir sur ce service
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              </div>
              <div className="card relative overflow-hidden p-8">
                <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${a.bar}`} />
                <p className="mb-6 font-outfit text-sm font-semibold uppercase tracking-[2px] text-txt-muted">Ce que je fais</p>
                <ul className="space-y-4">
                  {s.deliverables.slice(0, 5).map((d) => (
                    <li key={d.title} className="flex items-start gap-3 border-b border-bord pb-4 text-[15px] leading-relaxed text-txt-secondary last:border-0 last:pb-0">
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${a.iconBg}`}>
                        <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </span>
                      <span>
                        <strong className="font-medium text-txt-primary">{d.title}</strong> — {fr(d.desc)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 rounded-xl border border-dashed border-white/[0.1] bg-white/[0.015] p-5">
                  <p className={`mb-2 text-[11px] font-semibold uppercase tracking-[2px] ${a.text}`}>Résultat</p>
                  <p className="leading-relaxed text-txt-primary">{fr(s.result)}</p>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      <section className="border-t border-bord py-16 md:py-20" aria-labelledby="transversal-titre">
        <div className="container-b">
          <div className="mb-10 max-w-[720px]">
            <p className="section-tag text-emerald-b">Et pour aller plus loin</p>
            <h2 id="transversal-titre" className="section-title">
              Être visible partout, et monter en compétence
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {transversal.map((s) => {
              const a = accentStyles[s.accent]
              return (
                <article key={s.slug} className="card card-hover relative flex flex-col overflow-hidden p-8">
                  <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${a.bar}`} />
                  <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${a.iconBg}`}>
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <p className="mb-2 text-[11px] uppercase tracking-[1.5px] text-txt-muted">{s.badge}</p>
                  <h3 className="mb-3 font-outfit text-2xl font-semibold tracking-tight text-white">
                    <Link href={`/services/${s.slug}`} className="after:absolute after:inset-0">
                      {s.name}
                    </Link>
                  </h3>
                  <p className="mb-6 flex-1 leading-relaxed text-txt-secondary">{fr(s.summary)}</p>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${a.text}`}>
                    {s.priceLabel} · Découvrir <Icon name="arrow-right" className="h-4 w-4" />
                  </span>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="comparatif" className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="comparatif-titre">
        <div className="container-b">
          <div className="mb-10 max-w-[720px]">
            <p className="section-tag text-bronze">Comparatif</p>
            <h2 id="comparatif-titre" className="section-title">
              Quel service pour quel besoin&nbsp;?
            </h2>
          </div>
          <div tabIndex={0} role="region" aria-label="Tableau comparatif des services, tarifs et délais" className="overflow-x-auto rounded-2xl border border-bord">
            <table className="w-full min-w-[720px] text-left text-[15px]">
              <caption className="sr-only">Correspondance entre les besoins, les services BabTech, les tarifs et les délais</caption>
              <thead className="bg-white/[0.04] text-[13px] uppercase tracking-[1px] text-txt-primary">
                <tr>
                  <th scope="col" className="px-5 py-4 font-semibold">Ton besoin</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Le service</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Tarif</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Délai</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.slug} className="border-t border-bord">
                    <td className="px-5 py-4 text-txt-secondary">{row.need}</td>
                    <td className="px-5 py-4">
                      <Link href={`/services/${row.slug}`} className="font-medium text-emerald-b hover:underline">
                        {row.answer}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-txt-primary">{fr(row.price)}</td>
                    <td className="px-5 py-4 text-txt-secondary">{row.delay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-bord py-16 md:py-20" aria-labelledby="methode-titre">
        <div className="container-b">
          <div className="mb-10 max-w-[720px]">
            <p className="section-tag text-emerald-b">Méthode</p>
            <h2 id="methode-titre" className="section-title">
              Comment se déroule un projet
            </h2>
          </div>
          <ProcessSteps />
        </div>
      </section>

      <CtaSection title="Tu ne sais pas quel niveau te correspond ?" text="Pas de problème : on en discute. Trente minutes, zéro engagement, et tu repars avec des idées claires." />
    </>
  )
}
