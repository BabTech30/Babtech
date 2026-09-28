import Link from 'next/link'
import { Icon, type IconName } from '@/components/Icon'
import { FORUM_PATH, GROUPS_PATH, PROJECTS_PATH } from '@/data/forum'

type Space = 'forum' | 'projets' | 'groupes'

const SPACES: { key: Space; href: string; label: string; icon: IconName }[] = [
  { key: 'forum', href: `${FORUM_PATH}/`, label: 'Forum', icon: 'message' },
  { key: 'projets', href: `${PROJECTS_PATH}/`, label: 'Projets', icon: 'rocket' },
  { key: 'groupes', href: `${GROUPS_PATH}/`, label: 'Groupes', icon: 'users' },
]

/** Les trois espaces de la communauté, en onglets (en haut du forum, des projets et des groupes). */
export function CommunityNav({ current }: { current: Space }) {
  return (
    <nav aria-label="Espaces de la communauté" className="mb-10 flex flex-wrap gap-2">
      {SPACES.map((s) => (
        <Link
          key={s.key}
          href={s.href}
          aria-current={s.key === current ? 'page' : undefined}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            s.key === current ? 'border-bronze/60 bg-bronze/15 text-white' : 'border-bord text-txt-secondary hover:border-white/30 hover:text-white'
          }`}
        >
          <Icon name={s.icon} className="h-4 w-4" />
          {s.label}
        </Link>
      ))}
    </nav>
  )
}
