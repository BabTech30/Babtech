import { process } from '@/data/services'
import { fr } from '@/lib/typography'

/** Les 4 étapes de la méthode BabTech (accueil, services, villes, à propos). */
export function ProcessSteps() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {process.map((step, i) => (
        <li key={step.title} className="card p-7">
          <span aria-hidden="true" className="mb-4 block font-outfit text-[40px] font-extrabold leading-none text-white/40">
            0{i + 1}
          </span>
          <h3 className={`mb-2.5 font-outfit text-lg font-semibold ${i % 2 ? 'text-bronze' : 'text-emerald-b'}`}>{step.title}</h3>
          <p className="text-sm leading-relaxed text-txt-secondary">{fr(step.desc)}</p>
        </li>
      ))}
    </ol>
  )
}
