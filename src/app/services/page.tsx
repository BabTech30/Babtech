import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services — Visibilité, Outils Métier, IA',
  description: "3 niveaux d'accompagnement digital : visibilité en ligne dès 800€, outils métier sur mesure, et automatisations IA pour TPE et artisans.",
}

const levels = [
  {
    badge: 'Niveau 1', badgeClass: 'bg-emerald-b/[0.12] text-emerald-b border-emerald-b/20',
    title: 'Être trouvé. Être crédible.',
    audience: "Tu lances ton activité ou tu n'existes pas encore en ligne.",
    descBefore: "La base de tout. Avant de vendre, il faut qu'on te trouve — et qu'on te prenne au sérieux. ",
    descBold: 'Je pose les fondations de ta présence digitale',
    descAfter: ' pour que tes clients arrivent à toi naturellement.',
    price: '800', topColor: 'bg-emerald-b',
    items: ['Site vitrine professionnel et responsive', 'QR menus pour restaurants et commerces', 'Fiche Google Business optimisée', 'Présence réseaux sociaux', 'SEO local pour être trouvé sur Google'],
    result: 'Tes clients te trouvent sur Google, ton image est pro, tu inspires confiance dès le premier clic.',
    checkBg: 'bg-emerald-b/[0.12]', checkColor: 'text-emerald-b', priceColor: 'text-emerald-b', resultColor: 'text-emerald-b',
  },
  {
    badge: 'Niveau 2', badgeClass: 'bg-bronze/10 text-bronze border-bronze/20',
    title: 'Travailler plus vite. Mieux.',
    audience: 'Tu perds du temps sur des tâches répétitives ou tu gères tout sur papier / Excel.',
    descBefore: 'Tu es visible, mais tu croules sous la gestion. ',
    descBold: 'Je crée des outils sur mesure',
    descAfter: " qui s'adaptent à ta façon de bosser — pas l'inverse.",
    price: '1 500', topColor: 'bg-bronze',
    items: ['Applications web progressives (PWA)', 'Dashboards de suivi et pilotage', 'Apps de gestion interne', 'Outils métier sur mesure'],
    result: 'Tu gagnes des heures chaque semaine et tu pilotes ton activité avec des outils taillés pour toi.',
    checkBg: 'bg-bronze/10', checkColor: 'text-bronze', priceColor: 'text-bronze', resultColor: 'text-bronze',
  },
  {
    badge: 'Niveau 3', badgeClass: 'bg-white/5 text-white border-white/10',
    title: 'Faire bosser la tech à ta place.',
    audience: "Tu veux scaler sans embaucher ou automatiser ce qui te bouffe du temps.",
    descBefore: 'Le niveau au-dessus. ',
    descBold: "Je connecte tes outils entre eux et je mets l'IA au travail",
    descAfter: ' pour que les tâches répétitives tournent toutes seules.',
    price: '3 000', topColor: 'bg-gradient-to-r from-emerald-b to-bronze',
    items: ['Workflows automatisés (n8n)', 'Intégrations IA sur mesure', 'Automatisation de process métier', 'Connexion entre outils existants'],
    result: 'Les tâches répétitives tournent toutes seules. Tu te concentres sur ce qui compte.',
    checkBg: 'bg-white/[0.06]', checkColor: 'text-txt-primary', priceColor: 'text-white', resultColor: 'text-txt-primary',
  },
]

export default function Services() {
  return (
    <>
      <section className="pt-24 md:pt-28 pb-16 relative">
        <div className="absolute -top-16 -right-48 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="container-b">
          <div className="max-w-[680px] relative">
            <span className="section-tag text-emerald-b">Services</span>
            <h1 className="font-outfit text-4xl md:text-5xl font-bold text-white leading-[1.12] tracking-tight mb-5">
              Ce dont tu as besoin. Rien de plus, rien de moins.
            </h1>
            <p className="text-lg text-txt-secondary leading-relaxed">
              Pas de pack tout fait. Pas de formule magique. Je construis ce dont tu as vraiment besoin — au bon moment, au bon niveau.
            </p>
          </div>
        </div>
      </section>

      {levels.map((l, i) => (
        <section key={i} className={`py-20 border-t border-bord ${i % 2 === 1 ? 'bg-nuit-light' : ''}`}>
          <div className="container-b">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="max-w-[500px]">
                <span className={`inline-flex items-center gap-2 text-[11px] tracking-[2px] uppercase font-semibold mb-4 px-3.5 py-1.5 rounded-full border ${l.badgeClass}`}>
                  {l.badge}
                </span>
                <h2 className="font-outfit text-3xl md:text-4xl font-bold text-white tracking-tight mb-3 leading-tight">{l.title}</h2>
                <p className="text-[15px] text-txt-secondary leading-relaxed mb-6 pl-4 border-l-[3px] border-bord italic">{l.audience}</p>
                <p className="text-base text-txt-secondary leading-[1.8] mb-7">
                  {l.descBefore}<strong className="text-txt-primary font-medium">{l.descBold}</strong>{l.descAfter}
                </p>
                <div className="flex items-baseline gap-1.5 mb-1.5">
                  <span className="text-[13px] text-txt-muted">À partir de</span>
                  <span className={`font-outfit text-[28px] font-bold ${l.priceColor}`}>{l.price} €</span>
                </div>
                <p className="text-xs text-txt-muted mb-7">Tarif adapté selon le périmètre du projet</p>
              </div>
              <div className="bg-white/[0.03] border border-bord rounded-[20px] p-9 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${l.topColor}`} />
                <p className="font-outfit text-sm font-semibold tracking-[2px] uppercase text-txt-muted mb-6">Ce que je fais</p>
                <ul className="space-y-4">
                  {l.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-[15px] text-txt-secondary leading-relaxed pb-4 border-b border-bord last:border-0 last:pb-0">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 mt-0.5 ${l.checkBg} ${l.checkColor}`}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 p-5 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.015]">
                  <p className={`text-[11px] tracking-[2px] uppercase font-semibold mb-2 ${l.resultColor}`}>Résultat</p>
                  <p className="text-base text-txt-primary leading-relaxed">{l.result}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="py-24 text-center border-t border-bord relative">
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="container-b relative">
          <h2 className="section-title mb-3">Tu ne sais pas quel niveau te correspond ?</h2>
          <p className="text-[17px] text-txt-secondary mb-9">Pas de problème — on en discute. Zéro engagement, juste un premier échange.</p>
          <div className="flex flex-wrap gap-3.5 justify-center">
            <Link href="/contact" className="btn-primary">Prendre rendez-vous →</Link>
            <Link href="/contact" className="btn-secondary">Me contacter</Link>
          </div>
        </div>
      </section>
    </>
  )
}
