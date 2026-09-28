import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { proposeGroupAction } from '@/app/communaute/groupes/actions'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ActionForm } from '@/components/community/ActionForm'
import { GroupFields } from '@/components/community/GroupFields'
import { GROUPS_PATH } from '@/data/forum'
import { currentMember } from '@/lib/community/members'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const PATH = `${GROUPS_PATH}/proposer`

export const metadata: Metadata = pageMetadata({
  title: 'Proposer un groupe à la communauté',
  description: "Propose un groupe d'entrepreneurs autour d'un thème, d'une ville ou d'un niveau. Il est publié sur la communauté BabTech une fois validé.",
  path: PATH,
  og: 'forum',
  noindex: true,
})

export default async function ProposeGroupPage() {
  const member = await currentMember()
  if (!member) redirect(`/communaute/connexion/?suite=${encodeURIComponent(`${PATH}/`)}`)

  return (
    <div className="container-b max-w-[760px] pb-20 pt-8 md:pt-12">
      <Breadcrumbs
        items={[
          { name: 'Communauté', path: '/communaute' },
          { name: 'Groupes', path: GROUPS_PATH },
          { name: 'Proposer un groupe', path: PATH },
        ]}
      />
      <p className="section-tag text-bronze">Groupes</p>
      <h1 className="mb-4 font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">Proposer un groupe</h1>
      <p className="mb-8 leading-relaxed text-txt-secondary">
        Un thème, une ville, un métier, un niveau&nbsp;: réunis les entrepreneurs qui veulent avancer sur le même sujet que toi. Ta proposition est
        relue avant d&apos;être publiée, puis tu en deviens l&apos;animateur ou l&apos;animatrice. Les échanges du
        groupe sont lisibles par tous (voir la{' '}
        <Link href="/communaute/charte/" className="text-bronze underline-offset-2 hover:underline">
          charte
        </Link>
        ).
      </p>
      <div className="card p-6 md:p-8">
        <ActionForm action={proposeGroupAction} submit="Envoyer ma proposition" pending="Envoi…">
          <GroupFields />
        </ActionForm>
      </div>
    </div>
  )
}
