import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CtaSection } from '@/components/CtaSection'
import { Icon, type IconName } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { ProcessSteps } from '@/components/ProcessSteps'
import { YouTubeVideo } from '@/components/YouTubeVideo'
import { graph, ids, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'
import { fr } from '@/lib/typography'

const title = 'Bastien Ferrer, fondateur de BabTech à Montpellier'
const description =
  "Patron à 22 ans, 14 ans dans le BTP : Bastien Ferrer a fondé BabTech pour aider les TPE, artisans et commerçants de l'Hérault et du Gard à passer au digital."

export const metadata: Metadata = pageMetadata({ title, description, path: '/a-propos', og: 'a-propos' })

const milestones = [
  { value: '22 ans', label: 'Premier business', color: 'text-emerald-b' },
  { value: '~1 M€', label: "De chiffre d'affaires atteint", color: 'text-bronze' },
  { value: '14 ans', label: "D'entrepreneuriat", color: 'text-white' },
  { value: '8', label: 'Salariés encadrés', color: 'text-emerald-b' },
]

const commitments: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'target', title: 'Du concret', desc: "Des outils qui marchent le jour où on les livre, pensés pour des gens qui n'ont pas le temps." },
  { icon: 'shield', title: 'De la transparence', desc: 'Des prix clairs, un devis détaillé et pas de mauvaise surprise : tu sais ce que tu paies et pourquoi.' },
  { icon: 'map-pin', title: 'De la proximité', desc: "Un interlocuteur unique, basé près de Montpellier, qui répond sous 24 heures." },
  { icon: 'compass', title: "Un temps d'avance", desc: 'SEO local, GEO, IA générative : je fais le tri dans les nouveautés pour ne garder que ce qui te sert.' },
]

export default function APropos() {
  const company = site.founder.formerCompany
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path: '/a-propos',
            name: title,
            description,
            type: 'AboutPage',
            og: 'a-propos',
            about: { '@id': ids.founder },
            mainEntity: { '@id': ids.founder },
          }),
        )}
      />

      <PageHero
        eyebrow="À propos"
        title="Derrière BabTech, il y a un parcours d'entrepreneur."
        lead="Pas un CV de développeur : une vraie expérience de chef d'entreprise, et l'envie de la mettre au service de ceux qui en ont besoin."
        tone="bronze"
        crumbs={[{ name: 'À propos', path: '/a-propos' }]}
      />

      <section className="border-t border-bord py-16 md:py-20" aria-labelledby="parcours">
        <div className="container-b grid gap-12 md:grid-cols-[300px_1fr] md:items-start">
          <figure className="card relative mx-auto w-full max-w-[300px] overflow-hidden md:mx-0">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-emerald-b to-bronze" />
            <Image
              src={site.founder.portrait}
              alt={`Portrait de ${site.founder.name}`}
              width={720}
              height={900}
              preload
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover"
            />
            <figcaption className="p-5 text-center">
              <span className="block font-outfit text-xl font-semibold text-white">{site.founder.name}</span>
              <span className="block text-sm text-txt-secondary">Fondateur de BabTech</span>
              <span className="mt-2 flex items-center justify-center gap-1.5 text-[13px] text-txt-muted">
                <Icon name="map-pin" className="h-4 w-4 text-emerald-b" /> Près de Montpellier, Hérault
              </span>
            </figcaption>
          </figure>
          <div>
            <h2 id="parcours" className="mb-5 font-outfit text-sm font-semibold uppercase tracking-[2px] text-bronze">
              Mon parcours
            </h2>
            <div className="mb-9 max-w-[640px] space-y-5 text-[17px] leading-[1.85] text-txt-secondary">
              <p>
                <strong className="font-medium text-txt-primary">Patron à 22 ans.</strong> Deux magasins, huit salariés, près d&apos;un million
                d&apos;euros de chiffre d&apos;affaires avant 31 ans. Pendant 14 ans, j&apos;ai vécu la réalité d&apos;un chef d&apos;entreprise
                dans le BTP&nbsp;: les chantiers, la gestion, les coups durs, les victoires.
              </p>
              <p>
                Aujourd&apos;hui,{' '}
                <strong className="font-medium text-txt-primary">
                  j&apos;ai choisi de mettre cette expérience au service des artisans, commerçants et TPE
                </strong>{' '}
                qui veulent passer au digital. Pas depuis un bureau parisien&nbsp;: depuis le terrain, près de Montpellier.
              </p>
              <p>
                Mon premier gros projet de développement&nbsp;: le{' '}
                <Link
                  href="/portfolio#hotel-le-saint-eloi"
                  className="text-emerald-b underline decoration-emerald-b/50 underline-offset-2 hover:decoration-emerald-b"
                >
                  site de réservation et de gestion de l&apos;Hôtel Le Saint Éloi
                </Link>
                , à Montpellier, conçu sur le terrain avec le gérant.
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
      </section>

      <section className="border-y border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="difference">
        <div className="container-b max-w-[820px]">
          <h2 id="difference" className="mb-6 font-outfit text-3xl font-bold leading-tight tracking-tight text-white md:text-[34px]">
            Ce qui me différencie
          </h2>
          <p className="mb-7 border-l-[3px] border-bronze pl-6 text-lg leading-[1.85] text-txt-secondary">
            Quand un artisan me parle de ses galères,{' '}
            <strong className="font-medium text-txt-primary">je ne fais pas semblant de comprendre&nbsp;: je les ai vécues.</strong>
          </p>
          <p className="text-base leading-[1.8] text-txt-secondary">
            Les devis qui traînent, le site web qu&apos;on repousse toujours, la compta sur Excel, les journées de 12 heures. Je construis des
            outils digitaux pensés pour des gens qui n&apos;ont pas le temps de se former pendant trois semaines.{' '}
            <strong className="font-medium text-txt-primary">Des solutions qui marchent le jour où on les livre.</strong>
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="avant-babtech">
        <div className="container-b grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
          <div>
            <p className="section-tag text-bronze">Avant BabTech</p>
            <h2 id="avant-babtech" className="section-title mb-5">
              {company.name}, mon entreprise du bâtiment
            </h2>
            <div className="space-y-5 text-[16.5px] leading-[1.8] text-txt-secondary">
              <p>
                Avant de créer BabTech, j&apos;ai dirigé {company.name}&nbsp;: des chantiers, des salariés, des clients à satisfaire, et
                une entreprise à faire tourner avec tout ce que ça implique. Les devis, le planning, la trésorerie, les imprévus.
              </p>
              <p>
                Cette vidéo de présentation, tournée à l&apos;époque, montre l&apos;équipe et notre métier.{' '}
                <strong className="font-medium text-txt-primary">C&apos;est de là que vient ma façon de travailler</strong>&nbsp;: des
                outils pensés pour des gens qui ont les mains dans le concret, parce que j&apos;en faisais partie.
              </p>
            </div>
          </div>
          <YouTubeVideo id={company.youtubeId} title={company.videoTitle} thumbnail="/photos/cvc-energies-habitat.webp" />
        </div>
      </section>

      <section className="border-y border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="vision">
        <div className="container-b grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="section-tag text-emerald-b">Ma vision</p>
            <h2 id="vision" className="section-title mb-5">
              Le digital et l&apos;IA ne sont pas réservés aux grandes entreprises
            </h2>
            <div className="space-y-5 text-[16.5px] leading-[1.8] text-txt-secondary">
              <p>
                Les outils qui faisaient la différence pour les grands groupes sont aujourd&apos;hui à la portée d&apos;une TPE&nbsp;: un site qui
                travaille pour toi, des applications sur mesure, des automatisations, des assistants IA. Encore faut-il savoir lesquels choisir,
                et comment s&apos;en servir.
              </p>
              <p>
                C&apos;est pour ça que BabTech ne se limite pas à livrer des projets&nbsp;: je veux créer à Montpellier une{' '}
                <Link href="/communaute" className="text-emerald-b underline decoration-emerald-b/50 underline-offset-2 hover:decoration-emerald-b">
                  communauté d&apos;entrepreneurs
                </Link>{' '}
                qui apprennent ensemble, partagent ce qui marche et se donnent un coup de main.
              </p>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {commitments.map((c) => (
              <li key={c.title} className="card p-6">
                <Icon name={c.icon} className="mb-3 h-6 w-6 text-emerald-b" />
                <h3 className="mb-2 font-outfit text-lg font-semibold text-white">{c.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-txt-secondary">{fr(c.desc)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="methode">
        <div className="container-b">
          <div className="mb-10">
            <p className="section-tag text-emerald-b">Ma méthode</p>
            <h2 id="methode" className="section-title">
              Simple. Efficace. Sans jargon.
            </h2>
          </div>
          <ProcessSteps />
        </div>
      </section>

      <CtaSection title="Envie d'en discuter ?" text="Pas besoin de savoir exactement ce que tu veux : c'est mon job de t'aider à y voir clair." />
    </>
  )
}
