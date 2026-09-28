import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { cache } from 'react'
import { publishReply, removeOwnPost } from '@/app/communaute/forum/actions'
import { joinGroupAction } from '@/app/communaute/groupes/actions'
import { changeProjectStatus, offerHelp } from '@/app/communaute/projets/actions'
import { ConfirmForm } from '@/components/admin/ConfirmForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ActionForm } from '@/components/community/ActionForm'
import { ForumUnavailable } from '@/components/community/ForumUnavailable'
import { MemberBar } from '@/components/community/MemberBar'
import { PostBody } from '@/components/community/PostBody'
import { ProjectBadges } from '@/components/community/ProjectBadges'
import { ReportForm } from '@/components/community/ReportForm'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { FORUM_PATH, getForumCategory, groupPath, GROUPS_PATH, LIMITS, PROJECT_LIMITS, PROJECTS_PATH, topicPath, topicSlug } from '@/data/forum'
import { type Author, getTopic } from '@/lib/community/forum'
import { getGroup, membership, placesLeft } from '@/lib/community/groups'
import { currentMember } from '@/lib/community/members'
import { getProjectDetails, hasOffered } from '@/lib/community/projects'
import { excerpt, postDate } from '@/lib/community/text'
import { dbConfigured } from '@/lib/db'
import { graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { fr } from '@/lib/typography'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ sujet: string }>; searchParams: Promise<{ erreur?: string }> }

/** « 12-bien-utiliser-chatgpt » → 12. */
const parseId = (value: string) => {
  const match = /^(\d{1,10})(?:-[a-z0-9-]*)?$/.exec(value)
  return match ? Number(match[1]) : 0
}

/** Sujet lu une seule fois par requête (métadonnées et page) ; « unavailable » si la base ne répond pas. */
const load = cache(async (value: string) => {
  const id = parseId(value)
  if (!id) return undefined
  if (!dbConfigured()) return 'unavailable' as const
  try {
    return await getTopic(id)
  } catch (error) {
    console.error('forum : sujet illisible', error)
    return 'unavailable' as const
  }
})

function description(body: string, project = false) {
  const text = excerpt(body, 155)
  if (text.length >= 70) return text
  return `${text} ${project ? 'Projet présenté sur la communauté BabTech.' : 'Question posée sur le forum de la communauté BabTech.'}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await load((await params).sujet)
  if (result === 'unavailable') return { title: 'Forum', robots: { index: false, follow: true } }
  if (!result) return {}
  const { topic } = result
  return pageMetadata({ title: excerpt(topic.title, 60), description: description(topic.body, Boolean(topic.project)), path: topicPath(topic.id, topic.title), og: 'forum' })
}

function Byline({ author, date, edited }: { author: Author; date: Date; edited: Date | null }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-txt-muted">
      <Icon name="user" className="h-4 w-4 text-bronze" />
      <span className="font-medium text-txt-primary">{author.name}</span>
      {author.detail && <span>· {author.detail}</span>}
      <span>
        · <time dateTime={date.toISOString()}>{postDate(date)}</time>
      </span>
      {edited && <span>· modifié</span>}
    </p>
  )
}

const small = 'inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] text-txt-muted hover:text-white'

export default async function TopicPage({ params, searchParams }: Props) {
  const value = (await params).sujet
  const result = await load(value)
  if (result === 'unavailable') {
    return (
      <div className="container-b py-12">
        <Breadcrumbs
          items={[
            { name: 'Communauté', path: '/communaute' },
            { name: 'Forum', path: FORUM_PATH },
          ]}
        />
        <h1 className="sr-only">Forum</h1>
        <ForumUnavailable />
      </div>
    )
  }
  if (!result) notFound()
  const { topic, replies } = result
  const path = topicPath(topic.id, topic.title)
  if (value !== `${topic.id}-${topicSlug(topic.title)}`) permanentRedirect(`${path}/`)

  const member = await currentMember()
  const category = getForumCategory(topic.category)
  const { erreur } = await searchParams
  const url = absoluteUrl(path)
  const isAuthor = (a: Author) => Boolean(member && a.id === member.id)
  // Projet : ce qu'il cherche ; groupe : on répond seulement si on en fait partie.
  const [project, offered, group, inGroup] = await Promise.all([
    topic.project ? getProjectDetails(topic.id) : Promise.resolve(undefined),
    topic.project && member ? hasOffered(topic.id, member.id) : Promise.resolve(false),
    topic.group ? getGroup(topic.group.id) : Promise.resolve(undefined),
    topic.group && member ? membership(topic.group.id, member.id) : Promise.resolve(undefined),
  ])
  const canReply = Boolean(member && (!group || inGroup))
  const crumbs = project
    ? [
        { name: 'Communauté', path: '/communaute' },
        { name: 'Projets', path: PROJECTS_PATH },
      ]
    : group
      ? [
          { name: 'Communauté', path: '/communaute' },
          { name: 'Groupes', path: GROUPS_PATH },
          { name: excerpt(group.name, 30), path: groupPath(group.id, group.name) },
        ]
      : [
          { name: 'Communauté', path: '/communaute' },
          { name: 'Forum', path: FORUM_PATH },
          ...(category ? [{ name: category.name, path: `${FORUM_PATH}/${category.slug}` }] : []),
        ]

  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({ path, name: topic.title, description: description(topic.body, Boolean(project)), og: 'forum', about: { '@id': `${url}#sujet` } }),
          {
            '@type': 'DiscussionForumPosting',
            '@id': `${url}#sujet`,
            mainEntityOfPage: { '@id': `${url}#webpage` },
            url,
            headline: topic.title,
            text: topic.body,
            inLanguage: 'fr-FR',
            datePublished: topic.createdAt.toISOString(),
            ...(topic.editedAt ? { dateModified: topic.editedAt.toISOString() } : {}),
            author: { '@type': 'Person', name: topic.author.name },
            interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/CommentAction', userInteractionCount: replies.length },
            comment: replies.map((r) => ({
              '@type': 'Comment',
              url: `${url}#reponse-${r.id}`,
              text: r.body,
              datePublished: r.createdAt.toISOString(),
              author: { '@type': 'Person', name: r.author.name },
            })),
          },
        )}
      />

      <article className="pb-6 pt-8 md:pt-12" aria-labelledby="titre-sujet">
        <div className="container-b max-w-[860px]">
          <Breadcrumbs items={[...crumbs, { name: excerpt(topic.title, 40), path }]} />
          {group ? (
            <Link href={`${groupPath(group.id, group.name)}/`} className="section-tag text-bronze hover:underline">
              Groupe · {group.name}
            </Link>
          ) : (
            category && (
              <Link href={`${FORUM_PATH}/${category.slug}/`} className="section-tag text-bronze hover:underline">
                {project ? `Projet · ${category.name}` : category.name}
              </Link>
            )
          )}
          <h1 id="titre-sujet" className="mb-4 font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">
            {topic.title}
          </h1>
          <Byline author={topic.author} date={topic.createdAt} edited={topic.editedAt} />
          {project && (
            <div className="mt-4">
              <ProjectBadges needs={project.needs} skill={project.skill} stage={project.stage} status={project.status} />
            </div>
          )}
          {erreur === 'reponses' && (
            <p role="alert" className="mt-5 rounded-xl border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-txt-primary">
              {fr("D'autres membres ont déjà répondu : ce sujet ne peut plus être supprimé. Tu peux le modifier, ou écrire à contact@babtech.fr.")}
            </p>
          )}
          <div className="card mt-6 p-6 md:p-7">
            <PostBody text={topic.body} />
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-bord pt-4">
              {isAuthor(topic.author) ? (
                <>
                  <Link href={`/communaute/forum/modifier/?sujet=${topic.id}`} className={small}>
                    <Icon name="pencil" className="h-3.5 w-3.5" /> Modifier
                  </Link>
                  {replies.every((r) => isAuthor(r.author)) && (
                    <ConfirmForm
                      action={removeOwnPost}
                      fields={{ type: 'sujet', id: String(topic.id) }}
                      message="Supprimer ce sujet ? C'est définitif."
                      label="Supprimer"
                      className={small}
                    />
                  )}
                </>
              ) : (
                member && <ReportForm type="sujet" id={topic.id} />
              )}
              {project && isAuthor(topic.author) && (
                <form action={changeProjectStatus}>
                  <input type="hidden" name="id" value={topic.id} />
                  <input type="hidden" name="statut" value={project.status === 'found' ? 'open' : 'found'} />
                  <button type="submit" className={small}>
                    <Icon name="check" className="h-3.5 w-3.5" />
                    {project.status === 'found' ? 'Je cherche encore' : "J'ai trouvé"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {project && !isAuthor(topic.author) && project.status === 'open' && topic.author.id !== null && (
            <div className="card mt-6 p-6 md:p-7" id="proposer">
              <h2 className="mb-2 font-outfit text-xl font-semibold text-white">Proposer mon aide</h2>
              {!member ? (
                <>
                  <p className="mb-5 text-sm leading-relaxed text-txt-secondary">
                    {fr(`Tu peux aider ${topic.author.name} (un conseil, une compétence, l'envie de t'associer) ? Il suffit d'un compte gratuit.`)}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/communaute/inscription/" className="btn-bronze">
                      Créer mon compte
                    </Link>
                    <Link href={`/communaute/connexion/?suite=${encodeURIComponent(`${path}/#proposer`)}`} className="btn-secondary">
                      Me connecter
                    </Link>
                  </div>
                </>
              ) : offered ? (
                <p className="text-sm text-txt-secondary">
                  {fr(`Tu as déjà proposé ton aide pour ce projet : la réponse de ${topic.author.name} arrivera directement dans ta boîte e-mail.`)}
                </p>
              ) : (
                <>
                  <p className="mb-5 text-sm leading-relaxed text-txt-secondary">
                    {fr(
                      `Ton message part par e-mail à ${topic.author.name}, avec ton adresse e-mail pour pouvoir te répondre directement. Pour un conseil utile à tous, réponds plutôt plus bas.`,
                    )}
                  </p>
                  <ActionForm action={offerHelp} submit="Envoyer ma proposition" pending="Envoi…">
                    <input type="hidden" name="id" value={topic.id} />
                    <label htmlFor="proposition" className="sr-only">
                      Ton message
                    </label>
                    <textarea
                      id="proposition"
                      name="message"
                      rows={5}
                      required
                      minLength={PROJECT_LIMITS.offer.min}
                      maxLength={PROJECT_LIMITS.offer.max}
                      className="input resize-y"
                      placeholder="Qui tu es, ce que tu proposes, pourquoi ça peut l'aider…"
                    />
                  </ActionForm>
                </>
              )}
            </div>
          )}
        </div>
      </article>

      <MemberBar member={member} next={`${path}/`} />

      <section className="py-10 md:py-12" aria-labelledby="reponses">
        <div className="container-b max-w-[860px]">
          <h2 id="reponses" className="mb-6 font-outfit text-2xl font-semibold text-white">
            {replies.length ? `${replies.length} réponse${replies.length > 1 ? 's' : ''}` : 'Aucune réponse pour le moment'}
          </h2>
          <ol className="space-y-4">
            {replies.map((r) => (
              <li key={r.id} id={`reponse-${r.id}`} className="card scroll-mt-24 p-5 md:p-6">
                <div className="mb-3">
                  <Byline author={r.author} date={r.createdAt} edited={r.editedAt} />
                </div>
                <PostBody text={r.body} />
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-bord pt-3">
                  {isAuthor(r.author) ? (
                    <>
                      <Link href={`/communaute/forum/modifier/?reponse=${r.id}`} className={small}>
                        <Icon name="pencil" className="h-3.5 w-3.5" /> Modifier
                      </Link>
                      <ConfirmForm
                        action={removeOwnPost}
                        fields={{ type: 'reponse', id: String(r.id) }}
                        message="Supprimer ta réponse ? C'est définitif."
                        label="Supprimer"
                        className={small}
                      />
                    </>
                  ) : (
                    member && <ReportForm type="reponse" id={r.id} />
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10" id="repondre">
            {member && group && !inGroup ? (
              <div className="card p-6 text-center md:p-8">
                <p className="mb-5 text-txt-secondary">
                  {fr(`Ce sujet fait partie du groupe « ${group.name} » : rejoins le groupe pour répondre.`)}
                </p>
                {placesLeft(group) === 0 ? (
                  <p className="text-sm text-txt-muted">Le groupe est complet pour le moment.</p>
                ) : (
                  <form action={joinGroupAction} className="flex justify-center">
                    <input type="hidden" name="groupe" value={group.id} />
                    <input type="hidden" name="retour" value={`${path}/#repondre`} />
                    <button type="submit" className="btn-bronze">
                      <Icon name="user-plus" className="h-[18px] w-[18px]" />
                      Rejoindre le groupe
                    </button>
                  </form>
                )}
              </div>
            ) : canReply ? (
              <div className="card p-6 md:p-7">
                <h2 className="mb-4 font-outfit text-xl font-semibold text-white">Répondre</h2>
                <ActionForm action={publishReply} submit="Publier ma réponse" pending="Publication…">
                  <input type="hidden" name="sujet" value={topic.id} />
                  <label htmlFor="message" className="sr-only">
                    Ta réponse
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    maxLength={LIMITS.reply.max}
                    className="input resize-y"
                    placeholder="Partage ton expérience, une piste, un outil… Reste concret et bienveillant."
                  />
                </ActionForm>
              </div>
            ) : (
              <div className="card p-6 text-center md:p-8">
                <p className="mb-5 text-txt-secondary">Tu as une réponse ou une expérience à partager&nbsp;? Il suffit d&apos;un compte gratuit.</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/communaute/inscription/" className="btn-bronze">
                    Créer mon compte
                  </Link>
                  <Link href={`/communaute/connexion/?suite=${encodeURIComponent(`${path}/#repondre`)}`} className="btn-secondary">
                    Me connecter
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
