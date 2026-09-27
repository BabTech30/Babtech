import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqList } from '@/components/FaqList'
import { CommunityForm } from '@/components/forms/CommunityForm'
import { Icon, type IconName } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { categories } from '@/data/blog'
import { community } from '@/data/community'
import { faqNode, graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { fr } from '@/lib/typography'

const title = 'Communauté IA et digital pour entrepreneurs à Montpellier'
const description =
  "Groupes de travail, ateliers pratiques et rencontres pour apprendre le digital et l'IA entre dirigeants de TPE, artisans et commerçants de Montpellier et de l'Hérault."

export const metadata: Metadata = pageMetadata({ title, description, path: '/communaute', og: 'communaute' })

const why: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'zap',
    title: "L'IA va trop vite pour apprendre seul",
    desc: 'Nouveaux outils, nouvelles fonctions chaque mois : à plusieurs, on trie ce qui compte vraiment et on gagne un temps fou.',
  },
  {
    icon: 'users',
    title: 'Les meilleures idées viennent des pairs',
    desc: "Un artisan qui a automatisé ses devis, une commerçante qui a boosté sa fiche Google : rien ne vaut le retour d'expérience d'un autre dirigeant.",
  },
  {
    icon: 'handshake',
    title: 'Se rencontrer crée des opportunités',
    desc: "Partenariats, recommandations, entraide : un réseau local d'entrepreneurs qui avancent, c'est un vrai levier de développement.",
  },
]

export default function CommunautePage() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({ path: '/communaute', name: title, description, og: 'communaute' }),
          faqNode('/communaute', community.faq),
        )}
      />

      <PageHero
        eyebrow="Communauté · Montpellier & Hérault"
        title="La communauté BabTech : apprendre le digital et l'IA entre entrepreneurs"
        lead={community.intro}
        tone="bronze"
        crumbs={[{ name: 'Communauté', path: '/communaute' }]}
      >
        <a href="#inscription" className="btn-bronze">
          Rejoindre les membres fondateurs
          <Icon name="arrow-right" className="h-[18px] w-[18px]" />
        </a>
        <span className="inline-flex items-center gap-2 rounded-xl border border-bord px-4 py-3 text-sm text-txt-secondary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-bronze" />
          {community.status}
        </span>
      </PageHero>

      <section className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="pourquoi">
        <div className="container-b">
          <h2 id="pourquoi" className="section-title mb-10">
            Pourquoi une communauté&nbsp;?
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {why.map((w) => (
              <div key={w.title} className="card p-7">
                <Icon name={w.icon} className="mb-4 h-6 w-6 text-bronze" />
                <h3 className="mb-2.5 font-outfit text-lg font-semibold text-white">{w.title}</h3>
                <p className="text-[15px] leading-relaxed text-txt-secondary">{fr(w.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-bord py-16 md:py-20" aria-labelledby="formats">
        <div className="container-b">
          <div className="mb-10 max-w-[720px]">
            <p className="section-tag text-bronze">Les formats</p>
            <h2 id="formats" className="section-title">
              Apprendre, pratiquer, se rencontrer
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {community.formats.map((f) => (
              <div key={f.title} className="card flex gap-5 p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bronze/[0.12] text-bronze">
                  <Icon name={f.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="mb-2 font-outfit text-lg font-semibold text-white">{f.title}</h3>
                  <p className="text-[15px] leading-relaxed text-txt-secondary">{fr(f.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-bord bg-nuit-light py-16 md:py-20" aria-labelledby="themes">
        <div className="container-b grid gap-12 lg:grid-cols-2">
          <div>
            <p className="section-tag text-emerald-b">Les thèmes</p>
            <h2 id="themes" className="section-title mb-7">
              De quoi on parle
            </h2>
            <ul className="space-y-3">
              {community.themes.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[16px] text-txt-secondary">
                  <Icon name="sparkles" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-b" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[15px] leading-relaxed text-txt-muted">
              En attendant le lancement, ces sujets sont déjà traités sur{' '}
              <Link href="/blog" className="text-emerald-b underline decoration-emerald-b/50 underline-offset-2 hover:decoration-emerald-b">
                le blog
              </Link>{' '}
              : {categories.map((c) => c.name).join(', ')}.
            </p>
          </div>
          <div>
            <p className="section-tag text-emerald-b">Pour qui</p>
            <h2 className="section-title mb-7">Entre entrepreneurs du coin</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {community.audience.map((a) => (
                <li key={a} className="card flex items-center gap-3 p-4 text-[15px] text-txt-primary">
                  <Icon name="check" className="h-5 w-5 shrink-0 text-emerald-b" />
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15px] leading-relaxed text-txt-secondary">
              Débutant ou déjà équipé, peu importe&nbsp;: les groupes sont organisés par thème et par niveau.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-bord py-16 md:py-20" aria-labelledby="feuille-de-route">
        <div className="container-b">
          <div className="mb-10 max-w-[720px]">
            <p className="section-tag text-bronze">Feuille de route</p>
            <h2 id="feuille-de-route" className="section-title">
              Une communauté construite avec ses membres
            </h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-4">
            {community.roadmap.map((step, i) => (
              <li
                key={step.title}
                className={`card relative p-6 ${step.current ? 'border-bronze/40 bg-bronze/[0.06]' : ''}`}
                aria-current={step.current ? 'step' : undefined}
              >
                <p className={`mb-3 text-[12px] font-semibold uppercase tracking-[1.5px] ${step.current ? 'text-bronze' : 'text-txt-muted'}`}>
                  Étape {i + 1}
                  {step.current ? ' · en cours' : ''}
                </p>
                <h3 className="mb-2 font-outfit text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-txt-secondary">{fr(step.desc)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="inscription" className="border-t border-bord bg-nuit-deep py-16 md:py-20" aria-labelledby="inscription-titre">
        <div className="container-b grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="section-tag text-bronze">Membres fondateurs</p>
            <h2 id="inscription-titre" className="section-title mb-5">
              Rejoins la liste et construis le programme avec nous
            </h2>
            <p className="mb-6 text-[17px] leading-relaxed text-txt-secondary">
              Tes réponses décident des premiers ateliers&nbsp;: thèmes, formats, horaires. Les membres fondateurs sont informés en priorité des dates
              et des lieux.
            </p>
            <ul className="space-y-3 text-[15px] text-txt-secondary">
              {['Gratuit et sans engagement', 'Aucune revente de tes données', 'Désinscription en un email'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Icon name="shield" className="h-5 w-5 text-bronze" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card relative overflow-hidden p-7 md:p-9">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-bronze to-emerald-b" />
            <CommunityForm />
          </div>
        </div>
      </section>

      <section className="border-t border-bord py-16 md:py-20" aria-labelledby="faq-communaute">
        <div className="container-b grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="section-tag text-bronze">Questions fréquentes</p>
            <h2 id="faq-communaute" className="section-title">
              Tout savoir sur la communauté
            </h2>
          </div>
          <FaqList items={community.faq} openFirst />
        </div>
      </section>
    </>
  )
}
