import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CtaSection } from '@/components/CtaSection'
import { Icon, type IconName } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { YouTubeVideo } from '@/components/YouTubeVideo'
import { getCaseStudy } from '@/data/portfolio'
import { getService, type ServiceSlug } from '@/data/services'
import { graph, ids, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { formatPhone, site, telLink } from '@/lib/site'
import { fr } from '@/lib/typography'

/**
 * Page de présentation ouverte par QR code (salon, rendez-vous, véhicule…) : qui est Bastien, ce qu'il
 * fait, d'où il vient. Hors de Google (noindex) et absente du sitemap, car elle reprend les autres pages.
 */
const title = 'Bastien Ferrer : sites, outils métier et réservation en ligne'
const description =
  "Ancien chef d'entreprise du bâtiment, Bastien Ferrer crée des sites internet, des outils métier et des sites de réservation pour les pros de l'Hérault."

export const metadata: Metadata = pageMetadata({ title, description, path: '/bastien', og: 'bastien', noindex: true })

const offers: { icon: IconName; title: string; text: string; slug: ServiceSlug }[] = [
  {
    icon: 'globe',
    title: 'Sites internet',
    text: "Un site rapide, visible sur Google et dans les assistants IA, qui t'amène des demandes de devis.",
    slug: 'creation-site-internet',
  },
  {
    icon: 'app',
    title: 'Outils métier',
    text: 'Devis, planning, suivi, stocks : une application sur mesure, installable sur téléphone, taillée pour ta façon de travailler.',
    slug: 'application-metier',
  },
  {
    icon: 'bed',
    title: 'Site de réservation pour ta location',
    text: "Location type Airbnb, gîte ou chambres d'hôtes : jusqu'à 4 logements, réservation en direct, e-mail de confirmation, calendriers synchronisés avec Airbnb et Booking.com.",
    slug: 'site-reservation-location-saisonniere',
  },
  {
    icon: 'hammer',
    title: 'Outils pour les artisans et leurs équipes',
    text: "Suivi de chantier, planning partagé, photos et rapports envoyés au bureau : toute l'équipe a la bonne info au bon moment.",
    slug: 'application-metier',
  },
]

const milestones = [
  { value: '22 ans', label: 'Premier business', color: 'text-emerald-b' },
  { value: '14 ans', label: "D'entrepreneuriat", color: 'text-white' },
  { value: '8', label: 'Salariés encadrés', color: 'text-bronze' },
  { value: '~1 M€', label: "De chiffre d'affaires atteint", color: 'text-emerald-b' },
]

export default function Presentation() {
  const hotel = getCaseStudy('hotel-le-saint-eloi')
  if (!hotel?.media?.video) notFound()
  const video = hotel.media.video
  const company = site.founder.formerCompany

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path: '/bastien',
            name: title,
            description,
            og: 'bastien',
            breadcrumb: false,
            about: { '@id': ids.founder },
            mainEntity: { '@id': ids.founder },
          }),
        )}
      />

      {/* Présentation */}
      <section className="relative overflow-hidden pb-14 pt-10 md:pb-20 md:pt-14">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-32 h-[620px] w-[620px]"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 65%)' }}
        />
        <div className="container-b relative grid items-center gap-12 lg:grid-cols-[1.45fr_1fr]">
          <div>
            <div className="mb-7 flex items-center gap-4">
              <Image
                src={site.founder.avatarSmall}
                alt=""
                width={128}
                height={128}
                loading="eager"
                className="h-16 w-16 rounded-full border-2 border-emerald-b/50 object-cover lg:hidden"
              />
              <div>
                <p className="font-outfit text-lg font-semibold text-white">{site.founder.name}</p>
                <p className="text-sm text-txt-secondary">Fondateur de {site.name} · près de Montpellier</p>
              </div>
            </div>
            <h1 className="h1 mb-6">Du digital concret pour les artisans, commerçants et loueurs de l&apos;Hérault</h1>
            <p className="lead mb-9 max-w-[620px]">
              Ancien chef d&apos;entreprise du bâtiment, je crée des sites internet, des outils métier et des sites de réservation. Sans
              jargon, avec des prix clairs, et une réponse sous 24&nbsp;heures.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link href={site.bookingPath} className="btn-primary" data-track="rendez-vous">
                <Icon name="calendar" className="h-[18px] w-[18px]" />
                Réserver un appel gratuit
              </Link>
              {site.phone && (
                <a href={telLink()} className="btn-secondary" data-track="phone">
                  <Icon name="phone" className="h-[18px] w-[18px]" />
                  {formatPhone()}
                </a>
              )}
              <Link href="/carte" className="btn-secondary">
                <Icon name="user-plus" className="h-[18px] w-[18px]" />
                Ma carte de visite
              </Link>
            </div>
          </div>
          <figure className="card relative mx-auto hidden w-full max-w-[380px] overflow-hidden lg:block">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-emerald-b to-bronze" />
            <Image
              src={site.founder.portrait}
              alt={`Portrait de ${site.founder.name}`}
              width={720}
              height={900}
              className="aspect-[4/5] w-full object-cover"
            />
          </figure>
        </div>
      </section>

      {/* Offres */}
      <section className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="offres">
        <div className="container-b">
          <div className="mb-10 max-w-[720px]">
            <p className="section-tag text-emerald-b">Ce que je fais</p>
            <h2 id="offres" className="section-title">
              Ce que je peux faire pour toi
            </h2>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {offers.map((o) => (
              <li key={o.title}>
                <Link href={`/services/${o.slug}`} className="card card-hover flex h-full flex-col p-6 md:p-7">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-b/[0.12] text-emerald-b">
                    <Icon name={o.icon} className="h-[22px] w-[22px]" />
                  </span>
                  <span className="mb-2 font-outfit text-xl font-semibold tracking-tight text-white">{o.title}</span>
                  <span className="mb-5 flex-1 text-[15px] leading-relaxed text-txt-secondary">{fr(o.text)}</span>
                  <span className="flex items-center justify-between gap-3 border-t border-bord pt-4 text-sm">
                    <span className="font-semibold text-txt-primary">{fr(getService(o.slug)?.priceLabel ?? 'Sur devis')}</span>
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-b">
                      En savoir plus <Icon name="arrow-right" className="h-4 w-4" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px] leading-relaxed text-txt-secondary">
            Et aussi&nbsp;: automatisations et IA, référencement local, formation à l&apos;IA.{' '}
            <Link href="/services" className="font-medium text-emerald-b hover:underline">
              Voir tous les services
            </Link>
          </p>
        </div>
      </section>

      {/* Parcours */}
      <section className="border-t border-bord py-16 md:py-20" aria-labelledby="parcours">
        <div className="container-b grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-center">
          <Image
            src="/photos/bastien-ferrer-sommet.webp"
            alt={`${site.founder.name} au sommet d'une montagne, les bras levés`}
            width={640}
            height={800}
            className="mx-auto aspect-[4/5] w-full max-w-[340px] rounded-2xl border border-bord object-cover"
          />
          <div>
            <p className="section-tag text-bronze">Mon parcours</p>
            <h2 id="parcours" className="section-title mb-6">
              Patron à 22 ans, 14 ans dans le bâtiment
            </h2>
            <div className="mb-8 max-w-[640px] space-y-5 text-[17px] leading-[1.8] text-txt-secondary">
              <p>
                Pendant 14 ans, j&apos;ai dirigé une entreprise du bâtiment&nbsp;: deux magasins, huit salariés, près d&apos;un million
                d&apos;euros de chiffre d&apos;affaires. Les chantiers, les devis qui traînent, la gestion sur Excel, les journées de
                12&nbsp;heures&nbsp;: je connais.
              </p>
              <p>
                Aujourd&apos;hui,{' '}
                <strong className="font-medium text-txt-primary">je construis les outils que j&apos;aurais voulu avoir.</strong> Quand tu
                me parles de tes galères, je ne fais pas semblant de comprendre&nbsp;: je les ai vécues.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {milestones.map((m) => (
                <li key={m.label} className="card p-5 text-center">
                  <span className={`block font-outfit text-[26px] font-bold leading-none ${m.color}`}>{fr(m.value)}</span>
                  <span className="mt-2 block text-[13px] leading-snug text-txt-muted">{m.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container-b mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center">
          <div>
            <h3 className="mb-3 font-outfit text-2xl font-semibold tracking-tight text-white">Mon ancienne vie en vidéo</h3>
            <p className="text-[16px] leading-[1.8] text-txt-secondary">
              {company.name}, c&apos;était mon entreprise. Cette vidéo de présentation, tournée à l&apos;époque, montre l&apos;équipe et
              notre métier. C&apos;est ce terrain qui guide aujourd&apos;hui chacun de mes projets.
            </p>
          </div>
          <YouTubeVideo id={company.youtubeId} title={company.videoTitle} thumbnail="/photos/cvc-energies-habitat.webp" />
        </div>
      </section>

      {/* Réalisation */}
      <section className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="projet">
        <div className="container-b grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
          <div>
            <p className="section-tag text-emerald-b">Réalisation</p>
            <h2 id="projet" className="section-title mb-5">
              {hotel.title}&nbsp;: les réservations en direct et tout l&apos;hôtel sur un écran
            </h2>
            <p className="mb-7 max-w-[640px] text-[17px] leading-relaxed text-txt-secondary">
              17 chambres à Montpellier. Un site qui vend les chambres sans commission, et un tableau de bord qui fait tourner l&apos;hôtel au
              quotidien, pour la réception, la nuit, le ménage et le gérant.
            </p>
            {hotel.facts && (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {hotel.facts.map((f) => (
                  <li key={f.label} className="card p-4 text-center">
                    <span className="block font-outfit text-2xl font-bold leading-none text-emerald-b">{fr(f.value)}</span>
                    <span className="mt-2 block text-[12.5px] leading-snug text-txt-muted">{f.label}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8">
              <Link href={`/portfolio#${hotel.slug}`} className="btn-secondary">
                Voir le projet en détail
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-7 max-w-[640px] text-[15px] leading-relaxed text-txt-secondary">
              Tu loues un ou quelques logements&nbsp;? La même approche existe en version simple&nbsp;:{' '}
              <Link href="/services/site-reservation-location-saisonniere" className="font-medium text-emerald-b hover:underline">
                un site de réservation pour 1 à 4 logements, à partir de 250&nbsp;€
              </Link>
              .
            </p>
          </div>
          <figure className="mx-auto w-full max-w-[300px]">
            <video
              controls
              preload="none"
              playsInline
              poster={video.poster}
              width={video.width}
              height={video.height}
              aria-label={fr(`Vidéo de démonstration : ${hotel.title}`)}
              className="h-auto w-full rounded-2xl border border-bord bg-black"
            >
              <source src={video.src} type="video/mp4" />
            </video>
            <figcaption className="mt-3 text-center text-[13px] leading-relaxed text-txt-muted">
              {fr(video.label)}. {hotel.media.note}
            </figcaption>
          </figure>
        </div>
      </section>

      <CtaSection
        title="On en parle ?"
        text="Un premier échange de 30 minutes, gratuit et sans engagement, pour voir ce que le digital peut faire pour ton activité."
      />
    </>
  )
}
