import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { updateGroupAction } from '@/app/communaute/groupes/actions'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ActionForm } from '@/components/community/ActionForm'
import { GroupFields } from '@/components/community/GroupFields'
import { groupPath, GROUPS_PATH } from '@/data/forum'
import { getGroup, membership } from '@/lib/community/groups'
import { currentMember } from '@/lib/community/members'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const PATH = `${GROUPS_PATH}/modifier`

export const metadata: Metadata = pageMetadata({
  title: 'Modifier mon groupe',
  description: "Modifier le nom, la description, la ville, le niveau ou le nombre de places d'un groupe que tu animes sur la communauté BabTech.",
  path: PATH,
  og: 'forum',
  noindex: true,
})

const toId = (value?: string) => {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : 0
}

/** Modification d'un groupe par son animateur ou son animatrice (?groupe=ID). */
export default async function EditGroupPage({ searchParams }: { searchParams: Promise<{ groupe?: string }> }) {
  const member = await currentMember()
  if (!member) redirect('/communaute/connexion/')
  const id = toId((await searchParams).groupe)
  const group = id ? await getGroup(id) : undefined
  if (!group || (await membership(group.id, member.id))?.role !== 'organizer') notFound()

  return (
    <div className="container-b max-w-[760px] pb-20 pt-8 md:pt-12">
      <Breadcrumbs
        items={[
          { name: 'Communauté', path: '/communaute' },
          { name: 'Groupes', path: GROUPS_PATH },
          { name: group.name, path: groupPath(group.id, group.name) },
          { name: 'Modifier', path: PATH },
        ]}
      />
      <p className="section-tag text-bronze">Groupes</p>
      <h1 className="mb-8 font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">Modifier le groupe</h1>
      <div className="card p-6 md:p-8">
        <ActionForm action={updateGroupAction} submit="Enregistrer" pending="Enregistrement…">
          <input type="hidden" name="groupe" value={group.id} />
          <GroupFields group={group} />
        </ActionForm>
      </div>
    </div>
  )
}
