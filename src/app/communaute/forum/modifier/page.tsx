import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { updatePost } from '@/app/communaute/forum/actions'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ActionForm } from '@/components/community/ActionForm'
import { ProjectFields } from '@/components/community/ProjectFields'
import { TopicFields } from '@/components/community/TopicFields'
import { FORUM_PATH, LIMITS } from '@/data/forum'
import { getReply, getTopic } from '@/lib/community/forum'
import { currentMember } from '@/lib/community/members'
import { getProjectDetails } from '@/lib/community/projects'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const PATH = '/communaute/forum/modifier'

export const metadata: Metadata = pageMetadata({
  title: 'Modifier mon message',
  description: 'Modifier un sujet ou une réponse que tu as publié sur le forum de la communauté BabTech.',
  path: PATH,
  og: 'forum',
  noindex: true,
})

const toId = (value?: string) => {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : 0
}

/** Modification d'un message par son auteur (?sujet=ID ou ?reponse=ID). */
export default async function EditPostPage({ searchParams }: { searchParams: Promise<{ sujet?: string; reponse?: string }> }) {
  const params = await searchParams
  const member = await currentMember()
  if (!member) redirect('/communaute/connexion/')
  const topicId = toId(params.sujet)
  const replyId = toId(params.reponse)

  const topic = topicId ? (await getTopic(topicId))?.topic : undefined
  const reply = replyId ? await getReply(replyId) : undefined
  const post = topic ?? reply
  if (!post || post.author.id !== member.id) notFound()
  const project = topic?.project ? await getProjectDetails(topic.id) : undefined

  return (
    <div className="container-b max-w-[760px] pb-20 pt-8 md:pt-12">
      <Breadcrumbs
        items={[
          { name: 'Communauté', path: '/communaute' },
          { name: 'Forum', path: FORUM_PATH },
          { name: 'Modifier', path: PATH },
        ]}
      />
      <p className="section-tag text-bronze">Forum</p>
      <h1 className="mb-8 font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">
        {project ? 'Modifier mon projet' : topic ? 'Modifier mon sujet' : 'Modifier ma réponse'}
      </h1>
      <div className="card p-6 md:p-8">
        <ActionForm action={updatePost} submit="Enregistrer" pending="Enregistrement…">
          <input type="hidden" name="type" value={topic ? 'sujet' : 'reponse'} />
          <input type="hidden" name="id" value={post.id} />
          {topic && project ? (
            <>
              <TopicFields
                category={topic.category}
                title={topic.title}
                body={topic.body}
                titleLabel="Ton projet en une phrase"
                titleHint="Le nom ou le but de ton projet, et ce que tu cherches : c'est ce qui attire les bonnes réponses."
                bodyLabel="Présente ton projet"
              />
              <ProjectFields needs={project.needs} skill={project.skill} stage={project.stage} />
            </>
          ) : topic ? (
            <TopicFields category={topic.category} title={topic.title} body={topic.body} />
          ) : (
            <div>
              <label htmlFor="message" className="label">
                Ta réponse
              </label>
              <textarea id="message" name="message" rows={8} required maxLength={LIMITS.reply.max} defaultValue={reply?.body} className="input resize-y" />
            </div>
          )}
        </ActionForm>
      </div>
    </div>
  )
}
