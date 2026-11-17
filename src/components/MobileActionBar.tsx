'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { site, telLink } from '@/lib/site'
import { Icon } from './Icon'

/**
 * Pages où la barre n'apporte rien : elles ont déjà leur propre action (contact, rendez-vous, carte de visite),
 * ou le visiteur est en train d'écrire (comptes et formulaires de la communauté).
 */
const HIDDEN = ['/admin', '/contact', '/rendez-vous', '/carte', '/bastien', '/communaute/inscription', '/communaute/connexion', '/communaute/compte']
const HIDDEN_PARTS = ['/nouveau', '/modifier', '/proposer', '/confirmer', '/mot-de-passe']

/**
 * Téléphone uniquement : « Appeler » et « Réserver un appel gratuit » restent à portée de pouce
 * une fois le haut de page passé (les pages sont longues), et s'effacent devant le pied de page.
 */
export function MobileActionBar() {
  const pathname = usePathname() ?? '/'
  const [visible, setVisible] = useState(false)
  const hidden = HIDDEN.some((p) => pathname.startsWith(p)) || HIDDEN_PARTS.some((p) => pathname.includes(p))

  useEffect(() => {
    if (hidden) return
    const update = () => {
      const footer = document.querySelector('footer')
      const footerVisible = footer ? footer.getBoundingClientRect().top < window.innerHeight - 40 : false
      setVisible(window.scrollY > 520 && !footerVisible)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [hidden, pathname])

  if (hidden) return null
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-bord bg-nuit/95 px-4 pt-3 backdrop-blur-xl transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      // Hors écran : ni lu par les lecteurs d'écran, ni atteint au clavier.
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="flex items-stretch gap-2.5">
        <a href={telLink()} className="btn-secondary btn-sm shrink-0 px-4" data-track="phone" aria-label={`Appeler ${site.name}`}>
          <Icon name="phone" className="h-4 w-4" />
          Appeler
        </a>
        <Link href={site.bookingPath} className="btn-primary btn-sm min-w-0 flex-1" data-track="rendez-vous">
          <Icon name="calendar" className="h-4 w-4 shrink-0" />
          <span className="truncate">Réserver un appel gratuit</span>
        </Link>
      </div>
    </div>
  )
}
