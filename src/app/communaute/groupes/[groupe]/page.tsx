import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { cache } from 'react'
import { groupEmailsAction, joinGroupAction, leaveGroupAction } from '@/app/communaute/groupes/actions'
import { ConfirmForm } from '@/components/admin/ConfirmForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ForumUnavailable } from '@/components/community/ForumUnavailable'
import { groupCountLabel } from '@/components/community/GroupList'
import { MemberBar } from '@/components/community/MemberBar'
import { PostBody } from '@/components/community/PostBody'
import { TopicList } from '@/components/community/TopicList'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { FORUM_PATH, getForumCategory, groupLevelLabel, groupPath, GROUPS_PATH, topicPath, topicSlug } from '@/data/forum'
import { getGroup, groupMembers, groupTopics, membership, placesLeft } from '@/lib/community/groups'
import { currentMember } from '@/lib/community/members'
import { excerpt } from '@/lib/community/text'
import { dbConfigured } from '@/lib/db'
import { graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { fr } from '@/lib/typography'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ groupe: string }>; searchParams: Promise<{ adhesion?: string }> }

/** « 3-ia-pour-artisans » → 3. */
const parseId = (value: string) => {
  const match = /^(\d{1,10})(?:-[a-z0-9-]*)?$/.exec(value)
  return match ? Number(match[1]) : 0
}

/** Groupe lu une seule fois par requête (métadonnées et page) ; « unavailable » si la base ne répond pas. */
const load = cache(async (value: string) => {
  const id = parseId(value)
  if (!id) return undefined
  if (!dbConfigured()) return 'unavailable' as const
  try {
    return await getGroup(id)
  } catch (error) {
    console.error('groupes : groupe illisible', error)
    return 'unavailable' as const
  }
})

function description(text: string) {
  const short = excerpt(text, 155)
  return short.length >= 70 ? short : `${short} Groupe de la communauté BabTech.`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const group = await load((await params).groupe)
  if (group === 'unavailable') return { title: 'Groupes', robots: { index: false, follow: true } }
  if (!group) return {}
  return pageMetadata({ title: excerpt(group.name, 60), description: description(group.description), path: groupPath(group.id, group.name), og: 'forum' })
}

const NOTICES: Record<string, [string, boolean]> = {
  joined: ['Bienvenue dans le groupe ! Tu peux ouvrir un sujet et répondre aux autres membres.', true],
  full: ['Ce groupe est complet : plus aucune place pour le moment.', false],
  unavailable: ["Impossible de rejoindre ce groupe pour le moment : réessaie un peu plus tard.", false],
  left: ['Tu as quitté le groupe.', true],
}

const small = 'inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] px-3 py-2 text-sm font-medium text-txt-primary hover:border-white/30 hover:text-white'

export default async function GroupPage({ params, searchParams }: Props) {
  const value = (await params).groupe
  const group = await load(value)
  if (group === 'unavailable') {
    return (
      <div className="container-b py-12">
        <Breadcrumbs
          items={[
            { name: 'Communauté', path: '/communaute' },
            { name: 'Groupes', path: GROUPS_PATH },
          ]}
        />
        <h1 className="sr-only">Groupes</h1>
        <ForumUnavailable />
      </div>
    )
  }
  if (!group) notFound()
  const path = groupPath(group.id, group.name)
  if (value !== `${group.id}-${topicSlug(group.name)}`) permanentRedirect(`${path}/`)

  const member = await currentMember()
  const [members, topics, role] = await Promise.all([
    groupMembers(group.id),
    groupTopics(group.id),
    member ? membership(group.id, member.id) : Promise.resolve(undefined),
  ])
  const category = getForumCategory(group.category)
  const left = placesLeft(group)
  const notice = NOTICES[(await searchParams).adhesion ?? '']

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path,
            name: group.name,
            description: description(group.description),
            type: 'CollectionPage',
            og: 'forum',
            ...(topics.topics.length
              ? {
                  mainEntity: {
                    '@type': 'ItemList',
                    itemListElement: topics.topics.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.title, url: absoluteUrl(topicPath(t.id, t.title)) })),
                  },
                }
              : {}),
          }),
        )}
      />

      <section className="pb-8 pt-8 md:pt-12" aria-labelledby="nom-groupe">
        <div className="container-b max-w-[900px]">
          <Breadcrumbs
            items={[
              { name: 'Communauté', path: '/communaute' },
              { name: 'Groupes', path: GROUPS_PATH },
              { name: excerpt(group.name, 40), path },
            ]}
          />
          <p className="section-tag text-bronze">Groupe{category ? ` · ${category.name}` : ''}</p>
          <h1 id="nom-groupe" className="mb-4 font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">
            {group.name}
          </h1>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-txt-muted">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="users" className="h-4 w-4 text-bronze" />
              {groupCountLabel(group)}
            </span>
            {group.city && (
              <span className="inline-flex items-center gap-1.5">
                <Icon name="map-pin" className="h-4 w-4 text-bronze" />
                {group.city}
              </span>
            )}
            <span>{groupLevelLabel(group.level)}</span>
            <span>Animation&nbsp;: {group.organizer.name}</span>
          </p>

          {notice && (
            <p
              role="status"
              className={`mt-6 rounded-xl border px-4 py-3 text-sm ${notice[1] ? 'border-emerald-b/30 bg-emerald-b/[0.08] text-emerald-200' : 'border-bronze/30 bg-bronze/10 text-txt-primary'}`}
            >
              {fr(notice[0])}
            </p>
          )}

          <div className="card mt-6 p-6 md:p-7">
            <PostBody text={group.description} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!member ? (
              <>
                <Link href="/communaute/inscription/" className="btn-bronze">
                  Créer mon compte pour rejoindre le groupe
                </Link>
                <Link href={`/communaute/connexion/?suite=${encodeURIComponent(`${path}/`)}`} className="btn-secondary">
                  Me connecter
                </Link>
              </>
            ) : role ? (
              <>
                <Link href={`${FORUM_PATH}/nouveau/?groupe=${group.id}`} className="btn-bronze">
                  Ouvrir un sujet dans le groupe
                  <Icon name="arrow-right" className="h-[18px] w-[18px]" />
                </Link>
                {role.role === 'organizer' ? (
                  <Link href={`${GROUPS_PATH}/modifier/?groupe=${group.id}`} className={small}>
                    <Icon name="pencil" className="h-4 w-4" /> Modifier le groupe
                  </Link>
                ) : (
                  <ConfirmForm
                    action={leaveGroupAction}
                    fields={{ groupe: String(group.id) }}
                    message={`Quitter le groupe « ${group.name} » ?`}
                    label="Quitter le groupe"
                    className={small}
                  />
                )}
                <form action={groupEmailsAction}>
                  <input type="hidden" name="groupe" value={group.id} />
                  <input type="hidden" name="emails" value={role.notify ? 'non' : 'oui'} />
                  <button type="submit" className={small}>
                    <Icon name="mail" className="h-4 w-4" />
                    {role.notify ? 'Couper les e-mails du groupe' : 'Recevoir les e-mails du groupe'}
                  </button>
                </form>
              </>
            ) : left === 0 ? (
              <p className="rounded-xl border border-bord px-4 py-3 text-sm text-txt-secondary">Ce groupe est complet pour le moment.</p>
            ) : (
              <form action={joinGroupAction}>
                <input type="hidden" name="groupe" value={group.id} />
                <input type="hidden" name="retour" value={`${path}/`} />
                <button type="submit" className="btn-bronze">
                  <Icon name="user-plus" className="h-[18px] w-[18px]" />
                  Rejoindre le groupe
                </button>
              </form>
            )}
          </div>
          {role && (
            <p className="mt-3 text-[13px] text-txt-muted">
              {fr(
                role.notify
                  ? "Tu reçois un e-mail pour chaque nouveau sujet du groupe."
                  : "Tu ne reçois pas d'e-mail pour les nouveaux sujets du groupe.",
              )}
              {role.role === 'organizer' && fr(" Tu animes ce groupe : pour le transmettre ou le fermer, écris à contact@babtech.fr.")}
            </p>
          )}
        </div>
      </section>

      <MemberBar member={member} next={`${path}/`} />

      <section className="py-10 md:py-12" aria-labelledby="sujets-groupe">
        <div className="container-b max-w-[900px]">
          <h2 id="sujets-groupe" className="mb-6 font-outfit text-2xl font-semibold text-white">
            Les échanges du groupe
          </h2>
          {topics.topics.length ? (
            <TopicList topics={topics.topics} showGroup={false} />
          ) : (
            <p className="card p-6 text-txt-secondary">
              {fr(role ? 'Aucun sujet pour le moment : lance le premier échange !' : "Aucun sujet pour le moment. Rejoins le groupe pour lancer le premier échange.")}
            </p>
          )}

          <h2 className="mb-4 mt-12 font-outfit text-2xl font-semibold text-white">
            {members.length} membre{members.length > 1 ? 's' : ''}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {members.map((m) => (
              <li key={`${m.id}-${m.role}`} className="flex items-center gap-3 rounded-xl border border-bord px-4 py-3 text-sm">
                <Icon name="user" className="h-4 w-4 shrink-0 text-bronze" />
                <span>
                  <span className="font-medium text-txt-primary">{m.name}</span>
                  {m.detail && <span className="text-txt-muted"> · {m.detail}</span>}
                  {m.role === 'organizer' && <span className="ml-2 rounded-full bg-bronze/15 px-2 py-0.5 text-xs text-bronze">Animation</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm">
            <Link href={`${GROUPS_PATH}/`} className="inline-flex items-center gap-1.5 text-bronze hover:underline">
              Tous les groupes <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
