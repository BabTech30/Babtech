'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: '/services', label: 'Services' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-nuit/85 backdrop-blur-xl border-b border-bord">
      <div className="container-b">
        <div className="flex justify-between items-center py-[18px]">
          <Link href="/" className="font-outfit font-bold text-[22px] text-white tracking-tight">
            Bab<span className="text-emerald-b">Tech</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link key={link.href} href={link.href}
                className={`text-sm transition-colors duration-200 hover:text-white ${pathname === link.href ? 'text-white font-medium' : 'text-txt-secondary'}`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link href="https://app.babtech.fr"
              className="text-[13px] font-medium px-5 py-[9px] rounded-lg bg-bronze-glow text-bronze border border-bronze/20 transition-all duration-200 hover:bg-bronze/[0.18] hover:border-bronze/35">
              Espace client
            </Link>
            <button className="md:hidden flex flex-col gap-[5px] p-1" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              <span className={`w-5 h-[2px] bg-white transition-all ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`w-5 h-[2px] bg-white transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-[2px] bg-white transition-all ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="md:hidden pb-6 pt-2 border-t border-bord flex flex-col gap-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className={`text-sm transition-colors ${pathname === link.href ? 'text-white font-medium' : 'text-txt-secondary'}`}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
