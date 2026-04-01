import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'À propos — Bastien, entrepreneur devenu freelance digital',
  description: "14 ans d'entrepreneuriat dans le BTP, patron à 22 ans. Aujourd'hui, je crée des outils digitaux pour les artisans et TPE qui veulent avancer.",
}

const steps = [
  { num: '01', title: 'Écoute', desc: 'On parle de ton business, pas de technologie. Je comprends ton quotidien, tes blocages, tes objectifs.', color: 'text-emerald-b' },
  { num: '02', title: 'Proposition', desc: 'Je te présente une solution claire, sans jargon. Tu sais exactement ce que tu vas avoir et pourquoi.', color: 'text-bronze' },
  { num: '03', title: 'Réalisation', desc: "Je construis, tu valides à chaque étape. Pas de mauvaise surprise.", color: 'text-emerald-b' },
  { num: '04', title: 'Suivi', desc: "Je reste dispo. Ton projet ne s'arrête pas à la livraison. Tu as un interlocuteur, pas un ticket SAV.", color: 'text-bronze' },
]

const milestones = [
  { number: '22 ans', label: 'Premier business', color: 'text-emerald-b' },
  { number: '~1M€', label: 'CA atteint', color: 'text-bronze' },
  { number: '14 ans', label: "D'entrepreneuriat", color: 'text-white' },
]

export default function APropos() {
  return (
    <>
      <section className="pt-24 md:pt-28 pb-16 relative">
        <div className="absolute -top-16 -right-48 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(196,168,125,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="container-b">
          <div className="max-w-[680px] relative">
            <span className="section-tag text-bronze">À propos</span>
            <h1 className="font-outfit text-4xl md:text-5xl font-bold text-white leading-[1.12] tracking-tight mb-5">
              Derrière BabTech, il y a un parcours d&apos;entrepreneur.
            </h1>
            <p className="text-lg text-txt-secondary leading-relaxed">
              Pas un CV de développeur. Une vraie expérience de terrain — et l&apos;envie de la mettre au service de ceux qui en ont besoin.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-bord">
        <div className="container-b">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-16 items-start">
            <div className="w-full max-w-[280px] aspect-[3/4] rounded-[20px] bg-white/[0.03] border border-dashed border-white/10 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-bord flex items-center justify-center text-2xl text-txt-muted font-outfit font-bold">B</div>
              <span className="text-[13px] text-txt-muted italic">Photo à venir</span>
            </div>
            <div>
              <h2 className="font-outfit text-sm font-semibold tracking-[2px] uppercase text-bronze mb-5">Mon parcours</h2>
              <p className="text-[17px] text-txt-secondary leading-[1.85] max-w-[600px] mb-9">
                <strong className="text-txt-primary font-medium">Patron à 22 ans.</strong> Deux magasins, 8 salariés, le million avant 31 ans. Pendant 14 ans, j&apos;ai vécu la réalité d&apos;un chef d&apos;entreprise dans le BTP — les chantiers, la gestion, les coups durs, les victoires.
                <br /><br />
                Aujourd&apos;hui, <strong className="text-txt-primary font-medium">j&apos;ai choisi de mettre cette expérience au service des artisans et TPE</strong> qui veulent passer au digital. Pas depuis un bureau parisien. Depuis le terrain.
              </p>
              <div className="flex flex-wrap gap-4">
                {milestones.map((m, i) => (
                  <div key={i} className="bg-white/[0.03] border border-bord rounded-[14px] py-5 px-6 text-center flex-1 min-w-[140px]">
                    <div className={`font-outfit text-[28px] font-bold leading-none mb-1.5 ${m.color}`}>{m.number}</div>
                    <div className="text-[13px] text-txt-muted">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-nuit-light border-t border-b border-bord">
        <div className="container-b">
          <div className="max-w-[720px]">
            <h2 className="font-outfit text-3xl md:text-[34px] font-bold text-white tracking-tight mb-6 leading-tight">Ce qui me différencie</h2>
            <p className="text-lg text-txt-secondary leading-[1.85] pl-6 border-l-[3px] border-bronze mb-7">
              Quand un artisan me parle de ses galères, <strong className="text-txt-primary font-medium">je ne fais pas semblant de comprendre — je les ai vécues.</strong>
            </p>
            <p className="text-base text-txt-secondary leading-[1.8]">
              Les devis qui traînent, le site web qu&apos;on repousse toujours, la compta sur Excel, les journées à 12h. Je construis des outils digitaux pensés pour des gens qui n&apos;ont pas le temps de se former pendant 3 semaines. <strong className="text-txt-primary font-medium">Des solutions qui marchent le jour où on les livre.</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-b">
          <div className="mb-12">
            <span className="section-tag text-emerald-b">Ma méthode</span>
            <h2 className="section-title">Simple. Efficace. Sans jargon.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={i} className="bg-white/[0.03] border border-bord rounded-2xl p-8 transition-all duration-300 hover:border-white/10 hover:-translate-y-0.5">
                <div className="font-outfit text-[40px] font-extrabold leading-none mb-4 opacity-[0.12] text-white">{s.num}</div>
                <div className={`font-outfit text-lg font-semibold mb-2.5 tracking-tight ${s.color}`}>{s.title}</div>
                <p className="text-sm text-txt-secondary leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 text-center border-t border-bord relative">
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(196,168,125,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="container-b relative">
          <h2 className="section-title mb-3">Envie d&apos;en discuter ?</h2>
          <p className="text-[17px] text-txt-secondary mb-9 max-w-[520px] mx-auto">
            Pas besoin de savoir ce que tu veux exactement — c&apos;est mon job de t&apos;aider à y voir clair.
          </p>
          <div className="flex flex-wrap gap-3.5 justify-center">
            <Link href="/contact" className="btn-primary">Prendre rendez-vous →</Link>
            <Link href="/contact" className="btn-secondary">Me contacter</Link>
          </div>
        </div>
      </section>
    </>
  )
}
