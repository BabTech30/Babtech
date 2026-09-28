import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { getForumCategory, topicPath } from '@/data/forum'
import type { Topic } from '@/lib/community/forum'
import { postDate } from '@/lib/community/text'

/** Liste de sujets : titre, catégorie, auteur, dernière activité, nombre de réponses ; « Projet » et groupe éventuel. */
export function TopicList({ topics, showCategory = true, showGroup = true }: { topics: Topic[]; showCategory?: boolean; showGroup?: boolean }) {
  return (
    <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-bord bg-white/[0.02]">
      {topics.map((t) => {
        const category = getForumCategory(t.category)
        return (
          <li key={t.id} className="relative flex flex-col gap-2 p-5 transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <h3 className="mb-1.5 font-outfit text-[17px] font-semibold leading-snug text-white">
                <Link href={`${topicPath(t.id, t.title)}/`} className="after:absolute after:inset-0">
                  {t.title}
                </Link>
              </h3>
              <p className="text-[13px] text-txt-muted">
                {t.project && (
                  <span className="mr-2 inline-flex rounded-full bg-bronze/15 px-2 py-0.5 text-xs font-semibold text-bronze">
                    {t.project.status === 'found' ? 'Projet · trouvé' : 'Projet'}
                  </span>
                )}
                {showGroup && t.group && <span className="mr-2 inline-flex rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-txt-secondary">Groupe · {t.group.name}</span>}
                {showCategory && category && <span className="text-bronze">{category.name} · </span>}
                {t.author.name}
                {t.author.detail && ` · ${t.author.detail}`}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-[13px] text-txt-muted sm:text-right">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="message" className="h-4 w-4" />
                {t.replyCount} réponse{t.replyCount > 1 ? 's' : ''}
              </span>
              <time dateTime={t.lastActivityAt.toISOString()}>{postDate(t.lastActivityAt)}</time>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
