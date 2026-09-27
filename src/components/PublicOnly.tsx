'use client'

import { usePathname } from 'next/navigation'

/** Éléments du site public (menu, pied de page, mesure d'audience) masqués dans l'espace /admin. */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return children
}
