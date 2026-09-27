import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: true },
}

const shortcuts = [
  { href: '/services', label: 'Les services' },
  { href: '/blog', label: 'Le blog' },
  { href: '/zones-intervention', label: "Zones d'intervention" },
  { href: '/contact', label: 'Contact' },
]

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div className="container-b relative max-w-[680px] text-center">
        <p className="mb-4 font-outfit text-7xl font-extrabold text-white/[0.12]">404</p>
        <h1 className="mb-4 font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">Cette page n&apos;existe pas (ou plus).</h1>
        <p className="mb-9 text-[17px] leading-relaxed text-txt-secondary">
          Le lien est peut-être ancien, ou la page a déménagé. Voici quelques points de départ&nbsp;:
        </p>
        <ul className="mb-10 flex flex-wrap justify-center gap-2.5">
          {shortcuts.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="inline-flex rounded-full border border-bord bg-white/[0.03] px-4 py-2 text-sm text-txt-secondary hover:border-white/20 hover:text-white">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
          <Icon name="arrow-right" className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </section>
  )
}
