import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { getForumCategory, topicPath } from '@/data/forum'
import type { Topic } from '@/lib/community/forum'
import { postDate } from '@/lib/community/text'

/** Liste de sujets : titre, catégorie, auteur, dernière activité, nombre de réponses. */
export function TopicList({ topics, showCategory = true }: { topics: Topic[]; showCategory?: boolean }) {
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
