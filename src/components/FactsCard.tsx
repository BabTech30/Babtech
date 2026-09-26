import { fr } from '@/lib/typography'

export type Fact = { label: string; value: string }

/** Encadré « En bref » : les faits clés d'une page, lisibles d'un coup d'œil (et par les IA). */
export function FactsCard({ title = 'En bref', facts }: { title?: string; facts: Fact[] }) {
  return (
    <aside aria-label={title} className="card relative overflow-hidden p-7">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-b to-bronze" />
      <p className="mb-5 font-outfit text-[13px] font-semibold uppercase tracking-[1.5px] text-txt-primary">{title}</p>
      <dl className="divide-y divide-white/[0.06]">
        {facts.map((f) => (
          <div key={f.label} className="flex items-baseline justify-between gap-6 py-3 first:pt-0 last:pb-0">
            <dt className="shrink-0 text-sm text-txt-muted">{f.label}</dt>
            <dd className="text-right text-[15px] font-medium text-txt-primary">{fr(f.value)}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
