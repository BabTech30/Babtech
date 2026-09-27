import type { ReactNode } from 'react'
import { Breadcrumbs } from './Breadcrumbs'

export function LegalPage({ title, path, updatedAt, children }: { title: string; path: string; updatedAt: string; children: ReactNode }) {
  return (
    <article className="pb-24 pt-8 md:pt-12">
      <div className="mx-auto max-w-[800px] px-5 sm:px-7">
        <Breadcrumbs items={[{ name: title, path }]} />
        <p className="section-tag text-bronze">Informations légales</p>
        <h1 className="mb-3 font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
        <p className="mb-12 text-sm text-txt-muted">Dernière mise à jour&nbsp;: {updatedAt}</p>
        <div className="prose prose-babtech max-w-none prose-h2:mb-4 prose-h2:border-b prose-h2:border-bord prose-h2:pb-2.5 prose-h2:text-xl">
          {children}
        </div>
      </div>
    </article>
  )
}
