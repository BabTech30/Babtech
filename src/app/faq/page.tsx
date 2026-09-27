import type { Metadata } from 'next'
import { CtaSection } from '@/components/CtaSection'
import { FaqList } from '@/components/FaqList'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { allFaqItems, faqGroups } from '@/data/faq'
import { faqMainEntity, graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

const title = 'FAQ : prix, délais, SEO, IA — questions fréquentes sur BabTech'
const description =
  "Prix d'un site, délais, méthode, référencement Google et IA, applications métier, automatisation, communauté : les réponses pour les TPE de l'Hérault et du Gard."

export const metadata: Metadata = pageMetadata({ title, description, path: '/faq', og: 'faq' })

export default function FAQ() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({ path: '/faq', name: title, description, type: 'FAQPage', og: 'faq', mainEntity: faqMainEntity(allFaqItems) }),
        )}
      />

      <PageHero
        eyebrow="FAQ"
        title="Toutes les réponses à tes questions."
        lead="Comment ça marche, combien ça coûte, combien de temps ça prend, est-ce que c'est fait pour toi : c'est ici."
        crumbs={[{ name: 'FAQ', path: '/faq' }]}
      />

      <nav aria-label="Rubriques de la FAQ" className="border-t border-bord">
        <ul className="container-b flex flex-wrap gap-2.5 py-8">
          {faqGroups.map((g) => (
            <li key={g.id}>
              <a
                href={`#${g.id}`}
                className="inline-flex rounded-full border border-bord bg-white/[0.03] px-4 py-2 text-sm text-txt-secondary transition-colors hover:border-white/20 hover:text-white"
              >
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {faqGroups.map((group, i) => (
        <section
          key={group.id}
          id={group.id}
          aria-labelledby={`${group.id}-titre`}
          className={`scroll-mt-24 border-t border-bord py-14 md:py-16 ${i % 2 === 0 ? 'bg-nuit-light' : ''}`}
        >
          <div className="container-b grid gap-8 lg:grid-cols-[1fr_2fr]">
            <h2 id={`${group.id}-titre`} className="font-outfit text-2xl font-bold tracking-tight text-white md:text-3xl">
              {group.title}
            </h2>
            <FaqList items={group.items} />
          </div>
        </section>
      ))}

      <CtaSection title="Tu n'as pas trouvé ta réponse ?" text="Écris-moi directement ou réserve un appel : zéro engagement, réponse sous 24 heures." />
    </>
  )
}
