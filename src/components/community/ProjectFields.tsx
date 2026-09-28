import { PROJECT_LIMITS, PROJECT_NEEDS, PROJECT_STAGES, type ProjectNeed } from '@/data/forum'

/** Champs propres à un projet : ce que le membre cherche, la compétence précise, l'étape du projet. */
export function ProjectFields({ needs = [], skill = '', stage = '' }: { needs?: ProjectNeed[]; skill?: string; stage?: string }) {
  return (
    <>
      <input type="hidden" name="projet" value="1" />
      <fieldset>
        <legend className="label">
          Ce que tu cherches <span className="text-bronze">*</span>
        </legend>
        <div className="mt-1 grid gap-2 sm:grid-cols-3">
          {PROJECT_NEEDS.map((n) => (
            <label key={n.value} htmlFor={`cherche-${n.value}`} className="flex cursor-pointer items-center gap-3 rounded-xl border border-bord px-3 py-2.5 text-sm text-txt-secondary">
              <input
                id={`cherche-${n.value}`}
                type="checkbox"
                name="cherche"
                value={n.value}
                defaultChecked={needs.includes(n.value)}
                className="h-4 w-4 shrink-0 accent-emerald-500"
              />
              {n.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="competence" className="label">
          Si tu cherches une compétence&nbsp;: laquelle&nbsp;?
        </label>
        <input
          id="competence"
          name="competence"
          type="text"
          maxLength={PROJECT_LIMITS.skill.max}
          defaultValue={skill}
          className="input"
          placeholder="Ex. photographe, comptable, développeur, graphiste…"
        />
      </div>
      <div>
        <label htmlFor="etape" className="label">
          Où en est ton projet&nbsp;? <span className="text-bronze">*</span>
        </label>
        <select id="etape" name="etape" required defaultValue={stage} className="input">
          <option value="" disabled>
            Choisis une étape
          </option>
          {PROJECT_STAGES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
