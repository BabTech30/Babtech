import type { Metadata } from 'next'
import Link from 'next/link'
import PortfolioAccordion from '@/components/PortfolioAccordion'

export const metadata: Metadata = {
  title: 'Portfolio — Projets digitaux concrets',
  description: 'Découvre mes réalisations : Le Terrier (bar/restaurant), PWA Budget (app de gestion), Hôtel Saint Eloi (conformité multilingue).',
}

export default function Portfolio() {
  return (
    <>
      <section className="pt-24 md:pt-28 pb-16 relative">
        <div className="absolute -top-16 -right-48 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="container-b">
          <div className="max-w-[680px] relative">
            <span className="section-tag text-emerald-b">Portfolio</span>
            <h1 className="font-outfit text-4xl md:text-5xl font-bold text-white leading-[1.12] tracking-tight mb-5">
              Des projets concrets. Des résultats qui parlent.
            </h1>
            <p className="text-lg text-txt-secondary leading-relaxed">
              Chaque mission commence par un vrai problème — et finit par une solution qui tourne. Clique pour découvrir les détails.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-b">
          <PortfolioAccordion />
        </div>
      </section>

      <section className="py-24 text-center border-t border-bord relative">
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="container-b relative">
          <h2 className="section-title mb-3">Un projet en tête ?</h2>
          <p className="text-[17px] text-txt-secondary mb-9">Parlons-en. Zéro engagement, juste un premier échange.</p>
          <div className="flex flex-wrap gap-3.5 justify-center">
            <Link href="/contact" className="btn-primary">Prendre rendez-vous →</Link>
            <Link href="/contact" className="btn-secondary">Me contacter</Link>
          </div>
        </div>
      </section>
    </>
  )
}
