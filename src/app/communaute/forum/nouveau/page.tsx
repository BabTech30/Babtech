import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { publishTopic } from '@/app/communaute/forum/actions'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ActionForm } from '@/components/community/ActionForm'
import { TopicFields } from '@/components/community/TopicFields'
import { FORUM_PATH, getForumCategory, groupPath, GROUPS_PATH } from '@/data/forum'
import { getGroup, membership } from '@/lib/community/groups'
import { currentMember } from '@/lib/community/members'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const PATH = '/communaute/forum/nouveau'

export const metadata: Metadata = pageMetadata({
  title: 'Ouvrir un sujet sur le forum',
  description: "Pose ta question aux entrepreneurs de la communauté BabTech : site internet, visibilité, IA, automatisation, outils de gestion.",
  path: PATH,
  og: 'forum',
  noindex: true,
})

export default async function NewTopicPage({ searchParams }: { searchParams: Promise<{ categorie?: string; groupe?: string }> }) {
  const { categorie = '', groupe = '' } = await searchParams
  const member = await currentMember()
  if (!member) redirect(`/communaute/connexion/?suite=${encodeURIComponent(`${PATH}/${groupe ? `?groupe=${groupe}` : ''}`)}`)
  // Sujet ouvert dans un groupe : réservé à ses membres (sinon, retour à la page du groupe pour le rejoindre).
  const groupId = Number(groupe)
  const group = Number.isInteger(groupId) && groupId > 0 ? await getGroup(groupId) : undefined
  if (groupe && !group) redirect(`${GROUPS_PATH}/`)
  if (group && !(await membership(group.id, member.id))) redirect(`${groupPath(group.id, group.name)}/`)

  return (
    <div className="container-b max-w-[760px] pb-20 pt-8 md:pt-12">
      <Breadcrumbs
        items={
          group
            ? [
                { name: 'Communauté', path: '/communaute' },
                { name: 'Groupes', path: GROUPS_PATH },
                { name: group.name, path: groupPath(group.id, group.name) },
                { name: 'Nouveau sujet', path: PATH },
              ]
            : [
                { name: 'Communauté', path: '/communaute' },
                { name: 'Forum', path: FORUM_PATH },
                { name: 'Nouveau sujet', path: PATH },
              ]
        }
      />
      <p className="section-tag text-bronze">{group ? `Groupe · ${group.name}` : 'Forum'}</p>
      <h1 className="mb-4 font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">{group ? 'Ouvrir un sujet dans le groupe' : 'Ouvrir un sujet'}</h1>
      <p className="mb-8 leading-relaxed text-txt-secondary">
        Ton sujet est publié tout de suite et visible par tous. Reste concret et bienveillant, sans publicité ni données personnelles de tes clients
        (voir la{' '}
        <Link href="/communaute/charte/" className="text-bronze underline-offset-2 hover:underline">
          charte
        </Link>
        ).
      </p>
      <div className="card p-6 md:p-8">
        <ActionForm action={publishTopic} submit="Publier mon sujet" pending="Publication…">
          {group && <input type="hidden" name="groupe" value={group.id} />}
          <TopicFields category={getForumCategory(categorie) ? categorie : (group?.category ?? '')} />
        </ActionForm>
      </div>
    </div>
  )
}
