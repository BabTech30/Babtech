import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { getForumCategory, groupLevelLabel, groupPath } from '@/data/forum'
import { type Group, placesLeft } from '@/lib/community/groups'
import { excerpt } from '@/lib/community/text'
import { fr } from '@/lib/typography'

/** « 5 membres · 3 places restantes », « 1 membre », « Complet ». */
export function groupCountLabel(g: Pick<Group, 'capacity' | 'memberCount'>) {
  const members = `${g.memberCount} membre${g.memberCount > 1 ? 's' : ''}`
  const left = placesLeft(g)
  if (left === undefined) return members
  return left === 0 ? `${members} · complet` : `${members} · ${left} place${left > 1 ? 's' : ''} restante${left > 1 ? 's' : ''}`
}

/** Cartes des groupes : nom, thème, ville, niveau, description, membres et places. */
export function GroupList({ groups }: { groups: Group[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <li key={g.id} className="card card-hover relative flex flex-col p-6">
          <p className="mb-3 text-[13px] text-bronze">{getForumCategory(g.category)?.name}</p>
          <h3 className="mb-2 font-outfit text-lg font-semibold leading-snug text-white">
            <Link href={`${groupPath(g.id, g.name)}/`} className="after:absolute after:inset-0">
              {g.name}
            </Link>
          </h3>
          <p className="mb-4 flex-1 text-[14px] leading-relaxed text-txt-secondary">{fr(excerpt(g.description, 160))}</p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-txt-muted">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="users" className="h-4 w-4" />
              {groupCountLabel(g)}
            </span>
            {g.city && (
              <span className="inline-flex items-center gap-1.5">
                <Icon name="map-pin" className="h-4 w-4" />
                {g.city}
              </span>
            )}
            <span>{groupLevelLabel(g.level)}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}
