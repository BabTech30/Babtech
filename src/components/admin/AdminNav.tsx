'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/admin/', label: 'Tableau de bord' },
  { href: '/admin/partager/', label: 'Partager' },
  { href: '/admin/reglages/', label: 'Réglages' },
]

const clean = (path: string) => path.replace(/\/+$/, '')

export function AdminNav() {
  const pathname = clean(usePathname() ?? '')
  return (
    <nav aria-label="Administration" className="flex flex-wrap items-center gap-1">
      {items.map((item) => {
        const active = pathname === clean(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? 'bg-white/[0.08] text-white' : 'text-txt-secondary hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
