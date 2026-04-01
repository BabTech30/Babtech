'use client'
import { useState } from 'react'

const cases = [
  {
    num: '01', title: 'Le Terrier', sector: 'Bar / Restaurant',
    tags: [{ label: 'Visibilité', type: 'emerald' }, { label: 'Outils Métier', type: 'bronze' }],
    context: "Un projet parti de zéro. Pas juste la partie digitale — j'ai accompagné la création complète du lieu : concept, réalisation des travaux, et mise en place de tout l'écosystème digital. Un engagement total, du premier coup de crayon à l'ouverture.",
    items: ['Identité visuelle et branding complet', 'Site vitrine professionnel', 'QR menu pour les clients', 'Dashboard de gestion accessible sans compétence technique', 'Accompagnement à la création du business'],
    result: "Un établissement opérationnel de A à Z avec une présence digitale pro dès l'ouverture. Le gérant pilote son menu, son site et son suivi en totale autonomie.",
    dotColor: 'bg-emerald-b', numBg: 'bg-emerald-b/[0.12]', numColor: 'text-emerald-b', resultColor: 'text-emerald-b',
  },
  {
    num: '02', title: 'PWA Budget', sector: 'Application web',
    tags: [{ label: 'Outils Métier', type: 'bronze' }],
    context: "Un outil personnel conçu pour prouver ce que je sais faire — et que j'utilise au quotidien. Une vraie application de gestion de budget, pensée pour être utilisée par plusieurs profils.",
    items: ['PWA complète (installable, responsive)', 'Gestion multi-profils', 'Tableau de bord visuel', 'Système de notifications et alertes'],
    result: "Une application fonctionnelle qui montre concrètement ma capacité à livrer un outil métier complet, de la conception au déploiement.",
    dotColor: 'bg-bronze', numBg: 'bg-bronze/10', numColor: 'text-bronze', resultColor: 'text-bronze',
  },
  {
    num: '03', title: 'Hôtel Saint Eloi', sector: 'Hôtellerie',
    tags: [{ label: 'Visibilité', type: 'emerald' }, { label: 'Outils Métier', type: 'bronze' }],
    context: "Un hôtel qui accueille des résidents de nombreuses nationalités. Le règlement intérieur devait être accessible, compréhensible par tous, et conforme à la réglementation.",
    items: ['Règlement intérieur digitalisé via QR code', 'Traduction en 5+ langues', 'Dashboard de suivi conformité'],
    result: "Fini les documents papier que personne ne lit. Chaque résident accède au règlement dans sa langue en un scan. L'hôtel peut prouver la bonne diffusion de ses obligations réglementaires.",
    dotColor: 'bg-txt-secondary', numBg: 'bg-white/[0.06]', numColor: 'text-txt-primary', resultColor: 'text-txt-primary',
  },
]

export default function PortfolioAccordion() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="space-y-5">
      {cases.map((c, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i} className={`border rounded-[20px] overflow-hidden transition-colors bg-white/[0.03] ${isOpen ? 'border-white/10' : 'border-bord hover:border-white/10'}`}>
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="w-full flex justify-between items-center p-7 cursor-pointer text-left transition-colors hover:bg-white/[0.015]"
            >
              <div className="flex items-center gap-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-outfit text-sm font-bold shrink-0 ${c.numBg} ${c.numColor}`}>
                  {c.num}
                </div>
                <div>
                  <h3 className="font-outfit text-xl font-semibold text-white tracking-tight mb-1">{c.title}</h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[13px] text-txt-secondary">{c.sector}</span>
                    {c.tags.map((t, j) => (
                      <span key={j} className={`text-[11px] tracking-[1px] uppercase px-2.5 py-0.5 rounded-full font-medium border ${
                        t.type === 'emerald' ? 'bg-emerald-b/[0.12] text-emerald-b border-emerald-b/20' : 'bg-bronze/10 text-bronze border-bronze/20'
                      }`}>
                        {t.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`w-9 h-9 rounded-[10px] bg-white/[0.04] border border-bord flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-txt-secondary">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>
            <div className={`transition-all duration-400 overflow-hidden ${isOpen ? 'max-h-[700px]' : 'max-h-0'}`}>
              <div className="px-7 pb-9 border-t border-bord">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <p className="font-outfit text-xs font-semibold tracking-[2px] uppercase text-txt-muted mb-3">Contexte</p>
                    <p className="text-[15px] text-txt-secondary leading-relaxed">{c.context}</p>
                  </div>
                  <div>
                    <p className="font-outfit text-xs font-semibold tracking-[2px] uppercase text-txt-muted mb-3">Ce que j&apos;ai livré</p>
                    <ul className="space-y-2.5">
                      {c.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm text-txt-secondary leading-relaxed">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${c.dotColor}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-6 rounded-[14px] border border-dashed border-white/[0.08] bg-white/[0.02]">
                  <p className={`text-[11px] tracking-[2px] uppercase font-semibold mb-2 ${c.resultColor}`}>Résultat</p>
                  <p className="text-base text-txt-primary leading-relaxed">{c.result}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
