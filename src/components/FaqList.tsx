import Link from 'next/link'
import type { FaqItem } from '@/data/faq'
import { fr } from '@/lib/typography'
import { Icon } from './Icon'

/** Questions/réponses en <details> natif. Le contenu reste dans le HTML (lisible par Google et les IA). */
export function FaqList({ items, openFirst = false }: { items: FaqItem[]; openFirst?: boolean }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details key={item.q} className="faq-item card group" open={openFirst && i === 0}>
          <summary className="flex cursor-pointer items-start justify-between gap-6 rounded-2xl p-6 transition-colors hover:bg-white/[0.02] md:px-7">
            <h3 className="font-outfit text-[17px] font-semibold leading-snug tracking-tight text-white">{fr(item.q)}</h3>
            <span className="faq-chevron mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-bord bg-white/[0.04] text-txt-secondary transition-transform">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </summary>
          <div className="px-6 pb-6 md:px-7">
            <p className="text-[15px] leading-[1.8] text-txt-secondary">{fr(item.a)}</p>
            {item.link && (
              <Link href={item.link.href} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-b hover:underline">
                {item.link.label}
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  )
}
