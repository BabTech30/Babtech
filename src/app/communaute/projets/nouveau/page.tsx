import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { publishProject } from '@/app/communaute/projets/actions'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ActionForm } from '@/components/community/ActionForm'
import { ProjectFields } from '@/components/community/ProjectFields'
import { TopicFields } from '@/components/community/TopicFields'
import { PROJECTS_PATH } from '@/data/forum'
import { currentMember } from '@/lib/community/members'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const PATH = `${PROJECTS_PATH}/nouveau`

export const metadata: Metadata = pageMetadata({
  title: 'Présenter mon projet à la communauté',
  description: "Présente ton projet aux entrepreneurs de la communauté BabTech et dis ce que tu cherches : des conseils, un partenaire ou une compétence.",
  path: PATH,
  og: 'forum',
  noindex: true,
})

export default async function NewProjectPage() {
  const member = await currentMember()
  if (!member) redirect(`/communaute/connexion/?suite=${encodeURIComponent(`${PATH}/`)}`)

  return (
    <div className="container-b max-w-[760px] pb-20 pt-8 md:pt-12">
      <Breadcrumbs
        items={[
          { name: 'Communauté', path: '/communaute' },
          { name: 'Projets', path: PROJECTS_PATH },
          { name: 'Présenter mon projet', path: PATH },
        ]}
      />
      <p className="section-tag text-bronze">Projets</p>
      <h1 className="mb-4 font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">Présenter mon projet</h1>
      <p className="mb-8 leading-relaxed text-txt-secondary">
        Ton projet est publié tout de suite et visible par tous. Les membres peuvent te répondre sur sa page, ou te proposer leur aide par un message
        qui t&apos;arrive par e-mail (ton adresse reste cachée tant que tu ne réponds pas). Pas de publicité ni de données personnelles de tes clients
        (voir la{' '}
        <Link href="/communaute/charte/" className="text-bronze underline-offset-2 hover:underline">
          charte
        </Link>
        ).
      </p>
      <div className="card p-6 md:p-8">
        <ActionForm action={publishProject} submit="Publier mon projet" pending="Publication…">
          <TopicFields
            titleLabel="Ton projet en une phrase"
            titlePlaceholder="Ex. Je lance un food truck à Sète et je cherche un graphiste"
            titleHint="Le nom ou le but de ton projet, et ce que tu cherches : c'est ce qui attire les bonnes réponses."
            bodyLabel="Présente ton projet"
            bodyPlaceholder="Ton activité, ce que tu veux faire, où tu en es, ce qui te manque… Pas de données personnelles de clients."
          />
          <ProjectFields />
        </ActionForm>
      </div>
    </div>
  )
}
