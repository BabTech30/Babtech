'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { site } from '@/lib/site'
import { Icon } from './Icon'
import { Logo } from './Logo'

const links = [
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Réalisations' },
  { href: '/blog', label: 'Blog' },
  { href: '/communaute', label: 'Communauté' },
  { href: '/a-propos', label: 'À propos' },
]

const mobileLinks = [...links, { href: '/zones-intervention', label: "Zones d'intervention" }, { href: '/faq', label: 'FAQ' }, { href: '/contact', label: 'Contact' }]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 border-b border-bord bg-nuit/85 backdrop-blur-xl">
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <div className="container-b flex h-[68px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`text-sm transition-colors duration-200 hover:text-white ${isActive(link.href) ? 'font-medium text-white' : 'text-txt-secondary'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {site.clientSpaceUrl && (
            <a
              href={site.clientSpaceUrl}
              className="hidden rounded-lg border border-bronze/25 bg-bronze-glow px-4 py-2.5 text-[13px] font-medium text-bronze transition-all hover:border-bronze/40 hover:bg-bronze/[0.18] md:inline-flex"
            >
              Espace client
            </a>
          )}
          <Link href="/contact" className="btn-primary btn-sm hidden sm:inline-flex" data-track="header-contact">
            Parlons de ton projet
          </Link>
          <button
            type="button"
            className="-mr-1 flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
              <span className={`h-[2px] w-5 bg-current transition-all ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`h-[2px] w-5 bg-current transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`h-[2px] w-5 bg-current transition-all ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="menu-mobile"
        aria-label="Navigation mobile"
        hidden={!open}
        className="border-t border-bord bg-nuit/95 lg:hidden"
      >
        <ul className="container-b flex flex-col py-4">
          {mobileLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`flex items-center justify-between border-b border-white/[0.04] py-3.5 text-[15px] ${isActive(link.href) ? 'font-medium text-white' : 'text-txt-secondary'}`}
              >
                {link.label}
                <Icon name="arrow-right" className="h-4 w-4 text-txt-muted" />
              </Link>
            </li>
          ))}
          <li className="pt-5">
            <Link href={site.bookingPath} onClick={() => setOpen(false)} className="btn-primary w-full" data-track="rendez-vous">
              <Icon name="calendar" className="h-[18px] w-[18px]" />
              Réserver un appel gratuit
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
