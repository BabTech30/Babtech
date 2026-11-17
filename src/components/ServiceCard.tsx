import Link from 'next/link'
import type { Accent, Service } from '@/data/services'
import { fr } from '@/lib/typography'
import { Icon } from './Icon'

export const accentStyles: Record<Accent, { bar: string; iconBg: string; text: string; chip: string }> = {
  emerald: {
    bar: 'bg-emerald-b',
    iconBg: 'bg-emerald-b/[0.12] text-emerald-b',
    text: 'text-emerald-b',
    chip: 'border-emerald-b/25 bg-emerald-b/[0.1] text-emerald-b',
  },
  bronze: {
    bar: 'bg-bronze',
    iconBg: 'bg-bronze/[0.12] text-bronze',
    text: 'text-bronze',
    chip: 'border-bronze/25 bg-bronze/[0.1] text-bronze',
  },
  gradient: {
    bar: 'bg-gradient-to-r from-emerald-b to-bronze',
    iconBg: 'bg-white/[0.06] text-white',
    text: 'text-emerald-b',
    chip: 'border-white/15 bg-white/[0.05] text-txt-primary',
  },
}

/**
 * `compact` (accueil) : sur téléphone, la carte garde le nom, la promesse et le prix ; le résumé complet
 * est sur la page du service. À partir de la tablette, la carte est identique partout.
 */
export function ServiceCard({ service, headingLevel = 'h3', compact = false }: { service: Service; headingLevel?: 'h2' | 'h3'; compact?: boolean }) {
  const a = accentStyles[service.accent]
  const Heading = headingLevel
  return (
    <article className={`card card-hover relative flex flex-col overflow-hidden ${compact ? 'p-5 sm:p-7 md:p-8' : 'p-7 md:p-8'}`}>
      <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${a.bar}`} />
      <div className={`flex items-center justify-between gap-3 ${compact ? 'mb-3 sm:mb-5' : 'mb-5'}`}>
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${a.iconBg}`}>
          <Icon name={service.icon} className="h-6 w-6" />
        </span>
        <span className="text-right text-[11px] uppercase tracking-[1.5px] text-txt-muted">{service.badge}</span>
      </div>
      <Heading className="mb-1.5 font-outfit text-xl font-semibold tracking-tight text-white">
        <Link href={`/services/${service.slug}`} className="after:absolute after:inset-0">
          {service.name}
        </Link>
      </Heading>
      <p className={`text-sm font-medium ${a.text} ${compact ? 'mb-4 flex-1 sm:mb-3 sm:flex-none' : 'mb-3'}`}>{service.promise}</p>
      <p className={`mb-6 flex-1 text-[14.5px] leading-relaxed text-txt-secondary ${compact ? 'hidden sm:block' : ''}`}>{fr(service.summary)}</p>
      <div className="flex items-center justify-between gap-3 border-t border-bord pt-4">
        <span className="text-sm font-semibold text-txt-primary">{fr(service.priceLabel)}</span>
        <span className={`inline-flex items-center gap-1 text-[13px] font-medium ${a.text}`}>
          Découvrir <Icon name="arrow-right" className="h-4 w-4" />
        </span>
      </div>
    </article>
  )
}
