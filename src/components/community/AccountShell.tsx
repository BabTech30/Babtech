import type { ReactNode } from 'react'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { fr } from '@/lib/typography'

/** Mise en page des pages du compte membre : fil d'Ariane, titre, introduction, contenu dans une carte. */
export function AccountShell({
  title,
  path,
  intro,
  children,
  wide = false,
}: {
  title: string
  path: string
  intro?: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <div className={`container-b pb-20 pt-8 md:pt-12 ${wide ? 'max-w-[860px]' : 'max-w-[620px]'}`}>
      <Breadcrumbs
        items={[
          { name: 'Communauté', path: '/communaute' },
          { name: title, path },
        ]}
      />
      <p className="section-tag text-bronze">Espace membres</p>
      <h1 className="mb-4 font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">{fr(title)}</h1>
      {intro && <p className="mb-8 leading-relaxed text-txt-secondary">{fr(intro)}</p>}
      {children}
    </div>
  )
}

/** Carte blanche d'un formulaire du compte. */
export function AccountCard({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <section className="card relative overflow-hidden p-6 md:p-8" aria-label={title}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-bronze to-emerald-b" />
      {title && <h2 className="mb-5 font-outfit text-xl font-semibold text-white">{title}</h2>}
      {children}
    </section>
  )
}
