import Link from 'next/link'
import { site } from '@/lib/site'

export function AuthorBox() {
  return (
    <aside aria-label="À propos de l'auteur" className="card flex flex-col gap-5 p-7 sm:flex-row sm:items-start">
      <span
        aria-hidden="true"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-b/30 to-bronze/30 font-outfit text-2xl font-bold text-white"
      >
        B
      </span>
      <div>
        <p className="mb-1 text-[12px] uppercase tracking-[1.5px] text-txt-muted">Écrit par</p>
        <p className="mb-2 font-outfit text-lg font-semibold text-white">
          <Link href="/a-propos" rel="author" className="hover:text-emerald-b">
            {site.founder.name}
          </Link>
        </p>
        <p className="text-[15px] leading-relaxed text-txt-secondary">
          Fondateur de BabTech. Chef d&apos;entreprise à 22 ans, 14 ans dans le BTP, il aide aujourd&apos;hui les TPE, artisans et commerçants de
          Montpellier et de l&apos;Hérault à passer au digital et à l&apos;IA, sans jargon.
        </p>
      </div>
    </aside>
  )
}
