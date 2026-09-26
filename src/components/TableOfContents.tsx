import type { Heading } from '@/lib/blog'

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const items = headings.filter((h) => h.level === 2)
  if (items.length < 3) return null
  return (
    <nav aria-label="Sommaire de l'article" className="card p-6">
      <p className="mb-4 font-outfit text-[13px] font-semibold uppercase tracking-[1.5px] text-txt-primary">Sommaire</p>
      <ol className="space-y-2.5 text-sm">
        {items.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="leading-snug text-txt-secondary transition-colors hover:text-emerald-b">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
