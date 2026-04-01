import Link from 'next/link'

const services = [
  { icon: '👁', level: 'Niveau 1', title: 'Visibilité', desc: 'Être trouvé, être crédible. Site vitrine, Google Business, SEO local, réseaux.' },
  { icon: '⚙️', level: 'Niveau 2', title: 'Outils Métier', desc: 'Travailler plus vite, mieux. PWA, dashboards, apps de gestion sur mesure.' },
  { icon: '🤖', level: 'Niveau 3', title: 'IA & Automatisation', desc: 'Faire bosser la tech à ta place. Workflows, intégrations IA, automatisations.' },
]

const stats = [
  { number: '8', label: 'Projets livrés', color: 'text-emerald-b' },
  { number: '14 ans', label: "D'entrepreneuriat", color: 'text-bronze' },
  { number: '+40h', label: 'Investies par projet en moy.', color: 'text-white' },
]

export default function Home() {
  return (
    <>
      <section className="pt-24 md:pt-28 pb-20 relative">
        <div className="absolute -top-16 -right-48 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="container-b">
          <div className="max-w-[680px] relative">
            <span className="section-tag text-emerald-b">Freelance digital · Montpellier</span>
            <h1 className="font-outfit text-4xl md:text-[56px] font-bold text-white leading-[1.1] tracking-tight mb-5">
              Ancien entrepreneur, je construis le digital que j&apos;aurais voulu avoir.
            </h1>
            <p className="text-lg text-txt-secondary leading-relaxed mb-10 max-w-[560px]">
              Sites vitrines, outils métier, automatisations — des solutions pensées par quelqu&apos;un qui connaît ta réalité.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link href="/contact" className="btn-primary">Prendre rendez-vous →</Link>
              <Link href="/contact" className="btn-secondary">Me contacter</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-bord">
        <div className="container-b">
          <div className="flex gap-12 items-start">
            <div className="hidden md:block w-1 min-h-[80px] rounded-full bg-gradient-to-b from-emerald-b to-bronze shrink-0" />
            <div>
              <h2 className="font-outfit text-sm font-semibold tracking-[2px] uppercase text-bronze mb-4">Qui je suis</h2>
              <p className="text-[17px] text-txt-secondary leading-[1.85] max-w-[640px]">
                Moi c&apos;est Bastien. <strong className="text-txt-primary font-medium">J&apos;ai créé et géré une entreprise dans le BTP pendant 14 ans</strong> — avec les galères, les urgences et les nuits courtes. Aujourd&apos;hui, j&apos;aide les commerces, artisans et TPE à prendre le virage digital. Pas avec du jargon ou des solutions hors-sol. <strong className="text-txt-primary font-medium">Avec des outils concrets qui règlent de vrais problèmes.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-nuit-light border-t border-b border-bord">
        <div className="container-b">
          <div className="mb-12">
            <span className="section-tag text-emerald-b">Ce que je fais</span>
            <h2 className="section-title">3 niveaux pour avancer à ton rythme</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div key={i} className="bg-white/[0.03] border border-bord rounded-2xl p-9 transition-all duration-300 hover:border-white/10 hover:-translate-y-0.5 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${i === 0 ? 'bg-emerald-b' : i === 1 ? 'bg-bronze' : 'bg-gradient-to-r from-emerald-b to-bronze'}`} />
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[22px] mb-5 ${i === 0 ? 'bg-emerald-b/[0.12]' : i === 1 ? 'bg-bronze/10' : 'bg-emerald-b/[0.08]'}`}>
                  {s.icon}
                </div>
                <p className="text-[11px] tracking-[1.5px] uppercase text-txt-muted mb-2">{s.level}</p>
                <h3 className="font-outfit text-xl font-semibold text-white mb-2 tracking-tight">{s.title}</h3>
                <p className="text-[14.5px] text-txt-secondary leading-relaxed mb-5">{s.desc}</p>
                <Link href="/services" className={`text-[13px] font-medium hover:underline ${i === 1 ? 'text-bronze' : 'text-emerald-b'}`}>
                  En savoir plus →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[72px] border-b border-bord">
        <div className="container-b">
          <div className="text-center mb-10">
            <span className="section-tag text-emerald-b">En chiffres</span>
            <h2 className="section-title">Du concret, pas du blabla</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {stats.map((s, i) => (
              <div key={i} className="text-center py-8 px-4 rounded-2xl bg-white/[0.03] border border-bord">
                <div className={`font-outfit text-4xl md:text-5xl font-bold leading-none mb-2 ${s.color}`}>{s.number}</div>
                <div className="text-sm text-txt-secondary">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-nuit-light border-b border-bord">
        <div className="container-b">
          <div className="text-center mb-10">
            <span className="section-tag text-emerald-b">Retours clients</span>
            <h2 className="section-title">Ils parlent de leur expérience</h2>
          </div>
          <div className="max-w-[640px] mx-auto">
            <div className="bg-white/[0.03] border border-dashed border-white/10 rounded-[20px] p-12 text-center">
              <div className="text-5xl text-bronze/15 mb-4">&ldquo;</div>
              <h3 className="font-outfit text-xl font-semibold text-white mb-3">Premiers témoignages à venir</h3>
              <p className="text-[15px] text-txt-secondary leading-relaxed mb-6">
                Les résultats sont déjà là — les retours clients arrivent bientôt. En attendant, découvre les projets concrets dans le portfolio.
              </p>
              <Link href="/portfolio" className="text-sm font-medium text-emerald-b hover:underline">Voir le portfolio →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 text-center relative">
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="container-b relative">
          <h2 className="section-title mb-3">Un projet ? Une idée ? Parlons-en.</h2>
          <p className="text-[17px] text-txt-secondary mb-9">Pas de jargon, pas d&apos;engagement. Juste un premier échange pour voir ce qu&apos;on peut faire ensemble.</p>
          <div className="flex flex-wrap gap-3.5 justify-center">
            <Link href="/contact" className="btn-primary">Prendre rendez-vous →</Link>
            <Link href="/contact" className="btn-secondary">Me contacter</Link>
          </div>
        </div>
      </section>
    </>
  )
}
