import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactForm } from '@/components/forms/ContactForm'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { graph, ids, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { formatPhone, site, telLink } from '@/lib/site'

const title = 'Contact : parlons de ton projet digital à Montpellier'
const description =
  "Un message ou un appel de 30 minutes offert pour parler de ton site internet, de ton application métier ou de l'IA. Réponse sous 24 h, près de Montpellier."

export const metadata: Metadata = pageMetadata({ title, description, path: '/contact', og: 'contact' })

export default function Contact() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({ path: '/contact', name: title, description, type: 'ContactPage', og: 'contact', mainEntity: { '@id': ids.organization } }),
        )}
      />

      <PageHero
        eyebrow="Contact"
        title="Parlons de ton projet."
        lead="Un message, un appel, un café : choisis ce qui te convient. Je réponds sous 24 heures, et le premier échange est toujours gratuit."
        crumbs={[{ name: 'Contact', path: '/contact' }]}
      />

      <section className="border-t border-bord pb-20 pt-12 md:pt-16">
        <div className="container-b grid items-start gap-10 lg:grid-cols-[1fr_380px]">
          <div className="card relative overflow-hidden p-7 md:p-10">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-b to-bronze" />
            <h2 className="mb-2 font-outfit text-[22px] font-semibold tracking-tight text-white">Envoie-moi un message</h2>
            <p className="mb-8 text-sm text-txt-secondary">Décris ton besoin en quelques mots&nbsp;: je reviens vers toi rapidement.</p>
            <ContactForm />
          </div>

          <div className="flex flex-col gap-5">
            <div id="rdv" className="card relative overflow-hidden p-7">
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-bronze" />
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bronze/[0.12] text-bronze">
                <Icon name="calendar" className="h-6 w-6" />
              </span>
              <h2 className="mb-2 font-outfit text-lg font-semibold text-white">Réserve un créneau</h2>
              <p className="mb-5 text-sm leading-relaxed text-txt-secondary">
                30 minutes pour parler de ton projet, en visio ou par téléphone. Gratuit, sans engagement, sans jargon.
              </p>
              <a href={site.calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn-bronze w-full" data-track="calendly">
                Choisir un créneau
                <Icon name="arrow-up-right" className="h-4 w-4" />
              </a>
            </div>

            <div className="card p-7">
              <h2 className="mb-5 font-outfit text-sm font-semibold uppercase tracking-[2px] text-txt-primary">Coordonnées</h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-emerald-b/[0.12] text-emerald-b">
                    <Icon name="mail" className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="text-xs tracking-wide text-txt-muted">Email</span>
                    <a href={`mailto:${site.email}`} className="block text-[15px] font-medium text-emerald-b hover:underline" data-track="email">
                      {site.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-bronze/[0.12] text-bronze">
                    <Icon name="phone" className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="text-xs tracking-wide text-txt-muted">Téléphone</span>
                    {site.phone ? (
                      <a href={telLink()} className="block text-[15px] font-medium text-txt-primary hover:text-white" data-track="phone">
                        {formatPhone()}
                      </a>
                    ) : (
                      <>
                        <span className="block text-[15px] font-medium text-txt-primary">Sur demande</span>
                        <span className="text-xs italic text-txt-muted">Communiqué après un premier échange</span>
                      </>
                    )}
                  </div>
                </li>
                <li className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-emerald-b/[0.12] text-emerald-b">
                    <Icon name="map-pin" className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="text-xs tracking-wide text-txt-muted">Zone</span>
                    <span className="block text-[15px] font-medium text-txt-primary">Montpellier et Hérault</span>
                    <Link href="/zones-intervention" className="text-xs text-txt-muted underline-offset-2 hover:text-white hover:underline">
                      En rendez-vous ou en visio, partout en France
                    </Link>
                  </div>
                </li>
              </ul>
            </div>

            <div className="card p-5 text-center">
              <p className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-emerald-b/25 bg-emerald-b/[0.1] px-4 py-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-b" />
                <span className="text-[13px] font-medium text-emerald-b">Disponible pour de nouveaux projets</span>
              </p>
              <p className="text-[13px] text-txt-muted">Réponse sous 24 h en moyenne</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
