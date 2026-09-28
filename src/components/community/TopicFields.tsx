import { forumCategories, LIMITS } from '@/data/forum'
import { fr } from '@/lib/typography'

/** Champs d'un sujet (nouveau ou modifié) : thème, titre, message. Les libellés s'adaptent pour un projet. */
export function TopicFields({
  category = '',
  title = '',
  body = '',
  titleLabel = 'Titre',
  titlePlaceholder = 'Ex. Quel outil pour relancer automatiquement mes devis ?',
  titleHint = "Une vraie question, précise : c'est ce qui apporte les meilleures réponses.",
  bodyLabel = 'Ton message',
  bodyPlaceholder = 'Ton métier, ce que tu as déjà essayé, ce qui bloque… Pas de données personnelles de clients.',
}: {
  category?: string
  title?: string
  body?: string
  titleLabel?: string
  titlePlaceholder?: string
  titleHint?: string
  bodyLabel?: string
  bodyPlaceholder?: string
}) {
  return (
    <>
      <div>
        <label htmlFor="categorie" className="label">
          Thème <span className="text-bronze">*</span>
        </label>
        <select id="categorie" name="categorie" required defaultValue={category} className="input">
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
        <label htmlFor="titre" className="label">
          {titleLabel} <span className="text-bronze">*</span>
        </label>
        <input
          id="titre"
          name="titre"
          type="text"
          required
          minLength={LIMITS.title.min}
          maxLength={LIMITS.title.max}
          defaultValue={title}
          className="input"
          placeholder={titlePlaceholder}
        />
        <p className="mt-1.5 text-[13px] text-txt-muted">{fr(titleHint)}</p>
      </div>
      <div>
        <label htmlFor="message" className="label">
          {bodyLabel} <span className="text-bronze">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={10}
          required
          minLength={LIMITS.topic.min}
          maxLength={LIMITS.topic.max}
          defaultValue={body}
          className="input resize-y"
          placeholder={bodyPlaceholder}
        />
      </div>
    </>
  )
}
