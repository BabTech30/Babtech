import Link from 'next/link'
import { breadcrumbNode, graph, type Crumb } from '@/lib/schema'
import { JsonLd } from './JsonLd'

/** Fil d'Ariane visible + BreadcrumbList Schema.org (le dernier élément est la page courante). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const current = items[items.length - 1]
  const all: Crumb[] = [{ name: 'Accueil', path: '/' }, ...items]

  return (
    <>
      <nav aria-label="Fil d'Ariane" className="mb-8">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-txt-muted">
          {all.map((crumb, i) => {
            const isLast = i === all.length - 1
            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page" className="text-txt-secondary">
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.path} className="transition-colors hover:text-white">
                      {crumb.name}
                    </Link>
                    <span aria-hidden="true" className="text-white/20">
                      /
                    </span>
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      <JsonLd data={graph(breadcrumbNode(current.path, items))} />
    </>
  )
}
