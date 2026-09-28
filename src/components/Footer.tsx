import Link from 'next/link'
import { services } from '@/data/services'
import { getZone, mainZones, type Zone } from '@/data/zones'
import { formatPhone, site, telLink } from '@/lib/site'
import { Icon } from './Icon'
import { Logo } from './Logo'

const resources = [
  { href: '/blog', label: 'Blog' },
  { href: '/communaute', label: 'Communauté' },
  { href: '/portfolio', label: 'Réalisations' },
  { href: '/faq', label: 'FAQ' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

function Column({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-3 font-outfit text-[13px] font-semibold uppercase tracking-[1.5px] text-txt-primary sm:mb-4">{title}</p>
      <ul className="space-y-2 text-sm sm:space-y-2.5">{children}</ul>
    </div>
  )
}

const linkClass = 'text-txt-muted transition-colors hover:text-white'

const footerZones = mainZones.map((slug) => getZone(slug)).filter((z): z is Zone => Boolean(z))

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-bord bg-nuit-light">
      <div className="container-b pb-7 pt-10 sm:py-14">
        {/* Sur téléphone : villes et liens utiles côte à côte, pour un bas de page moins long. */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-10 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr]">
          <div className="col-span-2 sm:col-span-1">
            <Logo className="mb-4" />
            <p className="mb-4 max-w-[300px] text-sm leading-relaxed text-txt-muted sm:mb-5">{site.shortDescription}</p>
            <address className="space-y-2 text-sm not-italic text-txt-secondary">
              <p className="flex items-center gap-2">
                <Icon name="map-pin" className="h-4 w-4 shrink-0 text-emerald-b" />
                Basé près de Montpellier ({site.address.department})
              </p>
              <p className="flex items-center gap-2">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-emerald-b" />
                <a href={`mailto:${site.email}`} className="hover:text-white" data-track="email">
                  {site.email}
                </a>
              </p>
              {site.phone && (
                <p className="flex items-center gap-2">
                  <Icon name="phone" className="h-4 w-4 shrink-0 text-emerald-b" />
                  <a href={telLink()} className="hover:text-white" data-track="phone">
                    {formatPhone()}
                  </a>
                </p>
              )}
            </address>
          </div>

          <Column title="Services" className="col-span-2 sm:col-span-1">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={linkClass}>
                  {s.name}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Hérault et Gard">
            {footerZones.map((z) => (
              <li key={z.slug}>
                <Link href={`/zones-intervention/${z.slug}`} className={linkClass}>
                  {z.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/zones-intervention" className="inline-flex items-center gap-1 text-emerald-b transition-colors hover:text-white">
                Toutes les villes <Icon name="arrow-right" className="h-3.5 w-3.5" />
              </Link>
            </li>
          </Column>

          <Column title="Ressources">
            {resources.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className={linkClass}>
                  {r.label}
                </Link>
              </li>
            ))}
          </Column>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-bord pt-5 text-[13px] text-txt-muted sm:mt-12 sm:pt-6 md:flex-row">
          <p>
            © {year} {site.name} — {site.founder.name}, entrepreneur individuel (EI).
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <li>
              <Link href="/mentions-legales" className={linkClass}>
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className={linkClass}>
                Confidentialité
              </Link>
            </li>
            <li>
              <a href="/blog/rss.xml" className={`${linkClass} inline-flex items-center gap-1`}>
                <Icon name="rss" className="h-3.5 w-3.5" /> RSS
              </a>
            </li>
            <li>
              Créé avec <span className="text-bronze">♥</span> IAmour
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
