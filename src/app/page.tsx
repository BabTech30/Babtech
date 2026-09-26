import type { Metadata } from 'next'
import Link from 'next/link'
import { CtaSection } from '@/components/CtaSection'
import { FaqList } from '@/components/FaqList'
import { Icon, type IconName } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PostCard } from '@/components/PostCard'
import { ProcessSteps } from '@/components/ProcessSteps'
import { ServiceCard } from '@/components/ServiceCard'
import { community } from '@/data/community'
import { faqGroups } from '@/data/faq'
import { caseStudies } from '@/data/portfolio'
import { levels, transversal } from '@/data/services'
import { zones } from '@/data/zones'
import { getAllPosts } from '@/lib/blog'
import { graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'
import { fr } from '@/lib/typography'

const title = 'BabTech — Sites web, applications métier et IA à Montpellier'
const description =
  "Studio digital près de Montpellier : sites internet dès 800 €, applications métier, automatisations IA, SEO local et GEO pour les TPE et artisans de l'Hérault."

export const metadata: Metadata = pageMetadata({ title, description, path: '/', absoluteTitle: true })

const stats = [
  { value: '14 ans', label: "d'entrepreneuriat avant le digital", color: 'text-bronze' },
  { value: '8', label: 'projets digitaux livrés', color: 'text-emerald-b' },
  { value: '2 à 4 sem.', label: 'pour un site vitrine', color: 'text-white' },
  { value: '< 24 h', label: 'pour une réponse', color: 'text-emerald-b' },
]

const reasons: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'building',
    title: "Un chef d'entreprise, pas seulement un développeur",
    desc: "14 ans à la tête d'une entreprise du BTP : les devis, la trésorerie, les équipes, les journées à rallonge. Je parle business avant de parler technique.",
  },
  {
    icon: 'layers',
    title: "Un seul interlocuteur, du site à l'IA",
    desc: "Site, application métier, automatisations, référencement : tout est pensé ensemble, et tout se parle. Pas de prestataires qui se renvoient la balle.",
  },
  {
    icon: 'sparkles',
    title: 'Pensé pour Google… et pour les IA',
    desc: "Chaque projet intègre le SEO local et le GEO : ton entreprise est structurée pour être trouvée sur Google et citée par ChatGPT, Perplexity ou Gemini.",
  },
  {
    icon: 'map-pin',
    title: 'Local et joignable',
    desc: "Basé près de Montpellier, je connais le tissu économique de l'Hérault. On se parle en visio ou autour d'un café, et tu as une réponse sous 24 h.",
  },
  {
    icon: 'lock',
    title: 'Pas de jargon, pas de piège',
    desc: "Des prix clairs, un devis gratuit et détaillé, pas de mauvaise surprise. Tu comprends ce que tu achètes et tu gardes la main.",
  },
  {
    icon: 'handshake',
    title: 'Un accompagnement qui dure',
    desc: "Ton projet ne s'arrête pas à la livraison : suivi, évolutions, formation, et bientôt une communauté pour progresser entre entrepreneurs.",
  },
]

const homeFaq = faqGroups.flatMap((g) => g.items).filter((item) =>
  [
    'Combien coûte un site vitrine professionnel ?',
    'Où est basé BabTech et quelle zone couvre-t-il ?',
    'Comment être recommandé par ChatGPT, Perplexity ou Gemini quand on est une TPE ?',
    'Quelle est la différence entre les 3 niveaux de services ?',
    'Comment digitaliser mon commerce sans compétences techniques ?',
  ].includes(item.q),
)

export default function Home() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <>
      <JsonLd data={graph(webPageNode({ path: '/', name: title, description, breadcrumb: false }))} />

      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-20">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-32 h-[680px] w-[680px]"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.11) 0%, transparent 65%)' }}
        />
        <div className="container-b relative grid items-center gap-14 lg:grid-cols-[1.45fr_1fr]">
          <div>
            <p className="section-tag rounded-full border border-emerald-b/25 bg-emerald-b/[0.08] px-3.5 py-1.5 text-emerald-b">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-b" />
              Studio digital & IA · Montpellier<span className="hidden sm:inline"> · Hérault</span>
            </p>
            <h1 className="h1 mb-6">
              Sites internet, applications métier et <span className="text-gradient">IA</span> pour les TPE de Montpellier et de l&apos;Hérault
            </h1>
            <p className="lead mb-9 max-w-[620px]">
              Ancien chef d&apos;entreprise, je construis le digital que j&apos;aurais voulu avoir&nbsp;: un site qui t&apos;amène des clients, des
              outils qui te font gagner des heures, et de l&apos;IA qui travaille pour toi.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <a href={site.calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" data-track="calendly">
                <Icon name="calendar" className="h-[18px] w-[18px]" />
                Réserver un appel gratuit
              </a>
              <Link href="/services" className="btn-secondary">
                Découvrir les services
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-[13.5px] text-txt-secondary">
              {['Devis gratuit, réponse sous 24 h', 'Sans jargon, sans engagement', 'Visible sur Google et dans les IA'].map((item) => (
                <li key={item} className="inline-flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-emerald-b" />
                  {fr(item)}
                </li>
              ))}
            </ul>
          </div>

          <aside aria-label="Bastien, fondateur de BabTech" className="card relative overflow-hidden p-7 md:p-8">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-b to-bronze" />
            <div className="mb-6 flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-b/30 to-bronze/30 font-outfit text-2xl font-bold text-white">
                B
              </span>
              <div>
                <p className="font-outfit text-lg font-semibold text-white">Bastien Ferrer</p>
                <p className="text-sm text-txt-secondary">Fondateur de BabTech</p>
              </div>
            </div>
            <blockquote className="mb-7 border-l-2 border-bronze pl-4 text-[15px] italic leading-relaxed text-txt-primary">
              «&nbsp;Patron à 22 ans, j&apos;ai vécu les devis qui traînent et la gestion sur Excel. Aujourd&apos;hui, je crée les outils qui
              règlent ces problèmes.&nbsp;»
            </blockquote>
            <ul className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <li key={s.label} className="rounded-xl border border-bord bg-white/[0.02] p-4">
                  <span className={`block font-outfit text-2xl font-bold leading-none ${s.color}`}>{s.value}</span>
                  <span className="mt-1.5 block text-[12.5px] leading-snug text-txt-muted">{s.label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-bord bg-nuit-light py-20 md:py-24" aria-labelledby="services-titre">
        <div className="container-b">
          <div className="mb-12 max-w-[720px]">
            <p className="section-tag text-emerald-b">Ce que je fais</p>
            <h2 id="services-titre" className="section-title mb-4">
              3 niveaux pour avancer à ton rythme
            </h2>
            <p className="text-[17px] leading-relaxed text-txt-secondary">
              Être trouvé, travailler plus vite, puis faire travailler la tech à ta place. On commence là où tu en es, sans forfait surdimensionné.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {levels.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {transversal.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi BabTech */}
      <section className="py-20 md:py-24" aria-labelledby="pourquoi-titre">
        <div className="container-b">
          <div className="mb-12 max-w-[720px]">
            <p className="section-tag text-bronze">Pourquoi BabTech</p>
            <h2 id="pourquoi-titre" className="section-title">
              Le digital pensé par quelqu&apos;un qui connaît ta réalité
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r) => (
              <div key={r.title} className="card p-7">
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-emerald-b">
                  <Icon name={r.icon} className="h-[22px] w-[22px]" />
                </span>
                <h3 className="mb-2.5 font-outfit text-lg font-semibold tracking-tight text-white">{r.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-txt-secondary">{fr(r.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GEO */}
      <section className="relative overflow-hidden border-y border-bord bg-nuit-deep py-20 md:py-24" aria-labelledby="geo-titre">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px]"
          style={{ background: 'radial-gradient(circle, rgba(196,168,125,0.08) 0%, transparent 70%)' }}
        />
        <div className="container-b relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="section-tag text-emerald-b">SEO local + GEO</p>
            <h2 id="geo-titre" className="section-title mb-5">
              Tes clients cherchent sur Google… et demandent maintenant à l&apos;IA
            </h2>
            <p className="mb-5 text-[17px] leading-relaxed text-txt-secondary">
              ChatGPT, Perplexity, Gemini ou Copilot répondent directement aux questions de tes futurs clients, en citant quelques entreprises.
              Le <strong className="font-medium text-txt-primary">GEO (Generative Engine Optimization)</strong> consiste à faire partie de ces
              réponses.
            </p>
            <ul className="mb-8 space-y-3 text-[15px] text-txt-secondary">
              {[
                'Contenus factuels et structurés : services, prix indicatifs, zone, FAQ',
                'Données Schema.org, fichier llms.txt et robots IA autorisés',
                'Identité cohérente partout : site, Google Business Profile, annuaires, avis',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-b" />
                  {fr(item)}
                </li>
              ))}
            </ul>
            <Link href="/services/referencement-local-geo" className="btn-secondary">
              Le référencement local & GEO
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>

          <figure className="card p-6 md:p-7">
            <div className="mb-4 flex items-center gap-2 text-xs text-txt-muted">
              <Icon name="sparkles" className="h-4 w-4 text-bronze" />
              Assistant IA
            </div>
            <p className="mb-4 ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-white/[0.07] px-4 py-3 text-[14.5px] text-txt-primary">
              Je cherche quelqu&apos;un pour créer le site de mon restaurant à Montpellier, avec un menu en QR code.
            </p>
            <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-emerald-b/20 bg-emerald-b/[0.06] px-4 py-3 text-[14.5px] leading-relaxed text-txt-secondary">
              Plusieurs prestataires locaux peuvent t&apos;aider. Par exemple,{' '}
              <strong className="font-semibold text-white">BabTech</strong>, basé près de Montpellier, crée des sites vitrines à partir de 800&nbsp;€,
              des QR menus modifiables en temps réel et s&apos;occupe du référencement local…
            </div>
            <figcaption className="mt-4 text-xs italic text-txt-muted">
              Illustration&nbsp;: c&apos;est le type de réponse que vise le GEO. Aucun classement ne peut être garanti.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Méthode */}
      <section className="py-20 md:py-24" aria-labelledby="methode-titre">
        <div className="container-b">
          <div className="mb-12 max-w-[720px]">
            <p className="section-tag text-emerald-b">Ma méthode</p>
            <h2 id="methode-titre" className="section-title">
              Simple. Efficace. Sans jargon.
            </h2>
          </div>
          <ProcessSteps />
        </div>
      </section>

      {/* Réalisations */}
      <section className="border-y border-bord bg-nuit-light py-20 md:py-24" aria-labelledby="realisations-titre">
        <div className="container-b">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[640px]">
              <p className="section-tag text-bronze">Réalisations</p>
              <h2 id="realisations-titre" className="section-title">
                Des projets concrets, pas des maquettes
              </h2>
            </div>
            <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-b hover:underline">
              Tous les projets <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {caseStudies.map((c) => (
              <article key={c.slug} className="card flex flex-col p-7">
                <p className="mb-2 text-[12px] uppercase tracking-[1.5px] text-txt-muted">{c.sector}</p>
                <h3 className="mb-3 font-outfit text-xl font-semibold text-white">{c.title}</h3>
                <p className="mb-5 flex-1 text-[14.5px] leading-relaxed text-txt-secondary">{c.result}</p>
                <Link href={`/portfolio#${c.slug}`} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-emerald-b hover:underline">
                  Voir le projet <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Zones */}
      <section className="py-20 md:py-24" aria-labelledby="zones-titre">
        <div className="container-b grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="section-tag text-emerald-b">Local</p>
            <h2 id="zones-titre" className="section-title mb-5">
              Ton partenaire digital à Montpellier et dans tout l&apos;Hérault
            </h2>
            <p className="mb-7 text-[17px] leading-relaxed text-txt-secondary">
              Basé près de Montpellier, j&apos;accompagne les entreprises de la métropole, du littoral et de l&apos;arrière-pays. Et à distance,
              partout en France.
            </p>
            <Link href="/zones-intervention" className="btn-secondary">
              Voir les zones d&apos;intervention
            </Link>
          </div>
          <ul className="flex flex-wrap gap-2.5">
            <li>
              <Link
                href="/zones-intervention"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-b/30 bg-emerald-b/[0.08] px-4 py-2.5 text-sm font-medium text-emerald-b"
              >
                <Icon name="map-pin" className="h-4 w-4" /> Montpellier
              </Link>
            </li>
            {zones.map((z) => (
              <li key={z.slug}>
                <Link
                  href={`/zones-intervention/${z.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-bord bg-white/[0.03] px-4 py-2.5 text-sm text-txt-secondary transition-colors hover:border-white/20 hover:text-white"
                >
                  <Icon name="map-pin" className="h-4 w-4 text-txt-muted" /> {z.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Communauté */}
      <section className="border-y border-bord bg-nuit-deep py-20 md:py-24" aria-labelledby="communaute-titre">
        <div className="container-b">
          <div className="card relative overflow-hidden p-8 md:p-12">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-bronze via-emerald-b to-bronze" />
            <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div>
                <p className="section-tag text-bronze">Bientôt · Inscriptions ouvertes</p>
                <h2 id="communaute-titre" className="section-title mb-4">
                  La communauté BabTech&nbsp;: apprendre le digital et l&apos;IA entre entrepreneurs
                </h2>
                <p className="mb-7 text-[17px] leading-relaxed text-txt-secondary">{community.intro}</p>
                <Link href="/communaute" className="btn-bronze">
                  Rejoindre les membres fondateurs
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              </div>
              <ul className="grid gap-3">
                {community.formats.map((f) => (
                  <li key={f.title} className="flex items-center gap-3.5 rounded-xl border border-bord bg-white/[0.02] p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bronze/[0.12] text-bronze">
                      <Icon name={f.icon} className="h-5 w-5" />
                    </span>
                    <span className="font-medium text-txt-primary">{f.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="py-20 md:py-24" aria-labelledby="blog-titre">
          <div className="container-b">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[640px]">
                <p className="section-tag text-emerald-b">Le blog</p>
                <h2 id="blog-titre" className="section-title">
                  Guides pratiques pour les TPE
                </h2>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-b hover:underline">
                Tous les articles <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-bord bg-nuit-light py-20 md:py-24" aria-labelledby="faq-titre">
        <div className="container-b grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="section-tag text-emerald-b">Questions fréquentes</p>
            <h2 id="faq-titre" className="section-title mb-5">
              Tu te poses sûrement ces questions
            </h2>
            <Link href="/faq" className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-b hover:underline">
              Toute la FAQ <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
          <FaqList items={homeFaq} openFirst />
        </div>
      </section>

      <CtaSection />
    </>
  )
}
