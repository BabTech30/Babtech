import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { publishTopic } from '@/app/communaute/forum/actions'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ActionForm } from '@/components/community/ActionForm'
import { TopicFields } from '@/components/community/TopicFields'
import { FORUM_PATH, getForumCategory } from '@/data/forum'
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

export default async function NewTopicPage({ searchParams }: { searchParams: Promise<{ categorie?: string }> }) {
  const member = await currentMember()
  if (!member) redirect(`/communaute/connexion/?suite=${encodeURIComponent(`${PATH}/`)}`)
  const { categorie = '' } = await searchParams

  return (
    <div className="container-b max-w-[760px] pb-20 pt-8 md:pt-12">
      <Breadcrumbs
        items={[
          { name: 'Communauté', path: '/communaute' },
          { name: 'Forum', path: FORUM_PATH },
          { name: 'Nouveau sujet', path: PATH },
        ]}
      />
      <p className="section-tag text-bronze">Forum</p>
      <h1 className="mb-4 font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">Ouvrir un sujet</h1>
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
          <TopicFields category={getForumCategory(categorie) ? categorie : ''} />
        </ActionForm>
      </div>
    </div>
  )
}
