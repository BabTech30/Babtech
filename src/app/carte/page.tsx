import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { ShareButton } from '@/components/ShareButton'
import { qrPath } from '@/data/qr'
import { qrSvg } from '@/lib/qr'
import { graph, ids, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl, formatPhone, site, socialLinks, telLink } from '@/lib/site'
import { fr } from '@/lib/typography'
import { VCARD_PATH } from '@/lib/vcard'

/**
 * Carte de visite numérique, à partager par lien ou par QR code. Hors de Google (noindex) et absente du
 * sitemap : elle ne fait que résumer les autres pages.
 */
const title = 'Carte de visite de Bastien Ferrer'
const description =
  'Bastien Ferrer, fondateur de BabTech près de Montpellier : sites internet, outils métier et IA. Enregistre le contact, écris-moi ou réserve un appel.'

export const metadata: Metadata = pageMetadata({ title, description, path: '/carte', og: 'carte', noindex: true })

const actionClass =
  'flex w-full items-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3.5 text-left text-[15px] text-txt-primary transition-colors hover:border-white/25 hover:bg-white/[0.06]'

export default async function Carte() {
  const url = absoluteUrl('/carte')
  // Le QR code passe par l'adresse courte : les scans de la carte sont comptés dans le tableau de bord.
  const qr = await qrSvg(absoluteUrl(qrPath('carte')))

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path: '/carte',
            name: title,
            description,
            type: 'ProfilePage',
            og: 'carte',
            breadcrumb: false,
            about: { '@id': ids.founder },
            mainEntity: { '@id': ids.founder },
          }),
        )}
      />

      <section className="relative overflow-hidden py-10 md:py-16">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
        <div className="container-b relative grid max-w-[920px] gap-8 md:grid-cols-[minmax(0,1fr)_300px] md:items-start">
          <article className="card relative overflow-hidden p-6 text-center sm:p-8" aria-labelledby="carte-nom">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-b to-bronze" />
            <Image
              src={site.founder.avatar}
              alt={`Portrait de ${site.founder.name}`}
              width={256}
              height={256}
              loading="eager"
              className="mx-auto mb-5 h-28 w-28 rounded-full border-2 border-emerald-b/50 object-cover"
            />
            <h1 id="carte-nom" className="font-outfit text-3xl font-bold tracking-tight text-white">
              {site.founder.name}
            </h1>
            <p className="mt-1 font-medium text-emerald-b">Fondateur de {site.name}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-txt-secondary">
              Sites internet, outils métier, sites de réservation et IA pour les TPE, artisans et loueurs de l&apos;Hérault.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-txt-muted">
              <Icon name="map-pin" className="h-4 w-4 text-emerald-b" /> Près de Montpellier ({site.address.department})
            </p>

            <ul className="mt-7 grid gap-3">
              <li>
                <a href={VCARD_PATH} className="btn-primary w-full" data-track="vcard">
                  <Icon name="user-plus" className="h-[18px] w-[18px]" />
                  Enregistrer le contact
                </a>
              </li>
              {site.phone && (
                <li>
                  <a href={telLink()} className={actionClass} data-track="phone">
                    <Icon name="phone" className="h-5 w-5 shrink-0 text-emerald-b" />
                    <span>
                      Appeler <span className="text-txt-secondary">· {formatPhone()}</span>
                    </span>
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${site.email}`} className={actionClass} data-track="email">
                  <Icon name="mail" className="h-5 w-5 shrink-0 text-emerald-b" />
                  <span className="min-w-0 break-words">
                    Écrire <span className="text-txt-secondary">· {site.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <Link href={site.bookingPath} className={actionClass} data-track="rendez-vous">
                  <Icon name="calendar" className="h-5 w-5 shrink-0 text-emerald-b" />
                  Réserver un appel gratuit de 30 minutes
                </Link>
              </li>
              <li>
                <Link href="/bastien" className={actionClass}>
                  <Icon name="sparkles" className="h-5 w-5 shrink-0 text-emerald-b" />
                  Mon parcours et mes services
                </Link>
              </li>
              <li>
                <Link href="/" className={actionClass}>
                  <Icon name="globe" className="h-5 w-5 shrink-0 text-emerald-b" />
                  Le site {new URL(site.url).host}
                </Link>
              </li>
              {socialLinks.map((href) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer me" className={actionClass}>
                    <Icon name="external" className="h-5 w-5 shrink-0 text-emerald-b" />
                    <span className="min-w-0 break-words">{new URL(href).host.replace(/^www\./, '')}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-2">
              <ShareButton
                url={url}
                title={title}
                text={fr(`${site.founder.name}, fondateur de ${site.name} : sites internet, outils métier et IA près de Montpellier.`)}
                label="Partager ma carte"
              />
            </div>
          </article>

          <aside className="card p-6 text-center" aria-labelledby="carte-qr">
            <h2 id="carte-qr" className="mb-2 flex items-center justify-center gap-2 font-outfit text-lg font-semibold text-white">
              <Icon name="qr" className="h-5 w-5 text-emerald-b" /> Scanner la carte
            </h2>
            <p className="mb-5 text-[14px] leading-relaxed text-txt-secondary">
              Montre ce QR code&nbsp;: ton interlocuteur le scanne avec l&apos;appareil photo de son téléphone et retrouve cette carte.
            </p>
            <div
              role="img"
              aria-label={`QR code menant à ${url}`}
              className="mx-auto w-full max-w-[240px] overflow-hidden rounded-xl bg-white [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <p className="mt-4 break-words text-[13px] text-txt-muted">{url.replace(/^https?:\/\//, '')}</p>
          </aside>
        </div>
      </section>
    </>
  )
}
