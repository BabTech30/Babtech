import type { ReactNode } from 'react'
import type { Crumb } from '@/lib/schema'
import { fr } from '@/lib/typography'
import { Breadcrumbs } from './Breadcrumbs'

type Props = {
  eyebrow: string
  title: string
  lead?: string
  crumbs?: Crumb[]
  tone?: 'emerald' | 'bronze'
  /** Colonne de droite sur grand écran (ex. encadré « En bref »). */
  aside?: ReactNode
  children?: ReactNode
}

export function PageHero({ eyebrow, title, lead, crumbs, tone = 'emerald', aside, children }: Props) {
  const glow = tone === 'emerald' ? 'rgba(16,185,129,0.09)' : 'rgba(196,168,125,0.08)'
  return (
    <section className="relative overflow-hidden pb-14 pt-8 md:pb-20 md:pt-12">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-24 h-[620px] w-[620px]"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 68%)` }}
      />
      <div className="container-b relative">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={aside ? 'grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-center' : ''}>
          <div className="max-w-[780px]">
            <p className={`section-tag ${tone === 'emerald' ? 'text-emerald-b' : 'text-bronze'}`}>{eyebrow}</p>
            <h1 className="h1 mb-6">{fr(title)}</h1>
            {lead && <p className="lead max-w-[680px]">{fr(lead)}</p>}
            {children && <div className="mt-9 flex flex-wrap gap-3.5">{children}</div>}
          </div>
          {aside}
        </div>
      </div>
    </section>
  )
}
