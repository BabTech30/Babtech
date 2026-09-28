import { forumCategories, GROUP_LEVELS, GROUP_LIMITS } from '@/data/forum'
import type { Group } from '@/lib/community/groups'

/** Champs d'un groupe (proposition ou modification) : nom, thème, description, ville, niveau, places. */
export function GroupFields({ group }: { group?: Pick<Group, 'name' | 'description' | 'category' | 'city' | 'level' | 'capacity'> }) {
  const { name, description, city, capacity } = GROUP_LIMITS
  return (
    <>
      <div>
        <label htmlFor="nom" className="label">
          Nom du groupe <span className="text-bronze">*</span>
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          minLength={name.min}
          maxLength={name.max}
          defaultValue={group?.name}
          className="input"
          placeholder="Ex. L'IA pour les artisans du bâtiment"
        />
      </div>
      <div>
        <label htmlFor="categorie" className="label">
          Thème <span className="text-bronze">*</span>
        </label>
        <select id="categorie" name="categorie" required defaultValue={group?.category ?? ''} className="input">
          <option value="" disabled>
            Choisis un thème
          </option>
          {forumCategories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="description" className="label">
          À qui s&apos;adresse le groupe, et pour faire quoi&nbsp;? <span className="text-bronze">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          required
          minLength={description.min}
          maxLength={description.max}
          defaultValue={group?.description}
          className="input resize-y"
          placeholder="Ex. Des artisans qui veulent gagner du temps sur les devis et les relances grâce à l'IA : on partage nos essais, nos outils et nos résultats."
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="ville" className="label">
            Ville (ou «&nbsp;en ligne&nbsp;»)
          </label>
          <input id="ville" name="ville" type="text" maxLength={city.max} defaultValue={group?.city} className="input" placeholder="Ex. Nîmes" />
        </div>
        <div>
          <label htmlFor="niveau" className="label">
            Niveau
          </label>
          <select id="niveau" name="niveau" defaultValue={group?.level ?? 'tous'} className="input">
            {GROUP_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="places" className="label">
            Nombre de places
          </label>
          <input
            id="places"
            name="places"
            type="number"
            inputMode="numeric"
            min={capacity.min}
            max={capacity.max}
            defaultValue={group?.capacity || ''}
            className="input"
            placeholder="Sans limite"
          />
        </div>
      </div>
    </>
  )
}
