'use server'

import { after } from 'next/server'
import { PROJECT_LIMITS, PROJECTS_PATH, topicPath } from '@/data/forum'
import { notifyDevices } from '@/lib/admin/push'
import { authorDetail, getTopic } from '@/lib/community/forum'
import { currentMember, displayName, findMemberById } from '@/lib/community/members'
import { createProject, forgetOffer, getProjectDetails, offersToday, recordOffer, setProjectStatus } from '@/lib/community/projects'
import { goTo } from '@/lib/community/redirect'
import { cleanText } from '@/lib/community/text'
import { formId, linksError, readProject, readTopic } from '@/lib/community/validate'
import { forumTopicAlert, helpOffer } from '@/lib/emails'
import { limiter } from '@/lib/limits'
import { sendMails } from '@/lib/mail'
import { absoluteUrl } from '@/lib/site'

/**
 * Projets des membres : publication directe (tu es prévenu, tu modères ensuite comme sur le forum), statut
 * « trouvé » géré par l'auteur, et « Proposer mon aide » : un message envoyé par e-mail à l'auteur du projet,
 * avec l'adresse du membre qui propose pour qu'il puisse lui répondre directement.
 */
export type ProjectState = { error?: string; ok?: string }

const projectsPerMember = limiter({ perVisitor: 3, windowMs: 86_400_000, perDay: 200 })
const offersPerMember = limiter({ perVisitor: 5, windowMs: 86_400_000, perDay: 500 })
const MAX_OFFERS_PER_DAY = 5

const LOGIN = 'Connecte-toi pour participer.'
const BROKEN = 'Enregistrement impossible pour le moment : réessaie dans quelques minutes.'

export async function publishProject(_prev: ProjectState, formData: FormData): Promise<ProjectState> {
  const member = await currentMember()
  if (!member) return { error: LOGIN }
  const { category, title, body, error } = readTopic(formData)
  if (error) return { error: error.replace('une vraie question, précise', 'le nom ou le but de ton projet') }
  const { project, error: projectError } = readProject(formData)
  if (projectError) return { error: projectError }
  const links = linksError(member, body)
  if (links) return { error: links }
  if (!projectsPerMember.take(`m${member.id}`)) return { error: "Tu as déjà présenté 3 projets aujourd'hui : réessaie demain." }
  let path: string
  try {
    path = topicPath(await createProject(member.id, { category, title, body, ...project }), title)
  } catch (error) {
    console.error('projets : projet non publié', error)
    return { error: BROKEN }
  }
  const author = displayName(member)
  after(async () => {
    const results = await Promise.allSettled([
      notifyDevices({ title: 'Nouveau projet', body: `${author} : ${title}`, url: '/admin/communaute/', tag: `projet-${path}` }),
      sendMails([forumTopicAlert({ title, body, path: `${path}/`, project: true }, author)]),
    ])
    for (const r of results) if (r.status === 'rejected') console.error('projets : alerte non envoyée', r.reason)
  })
  goTo(`${path}/`)
}

/** « J'ai trouvé » ou « Je cherche encore » (auteur du projet seulement). */
export async function changeProjectStatus(formData: FormData) {
  const member = await currentMember()
  const topicId = formId(formData.get('id'))
  let back = `${PROJECTS_PATH}/`
  if (member && topicId) {
    try {
      await setProjectStatus(topicId, member.id, formData.get('statut') === 'found' ? 'found' : 'open')
      const data = await getTopic(topicId, { withHidden: true })
      if (data) back = `${topicPath(data.topic.id, data.topic.title)}/`
    } catch (error) {
      console.error('projets : statut non enregistré', error)
    }
  }
  goTo(back)
}

/** « Proposer mon aide » : un e-mail à l'auteur du projet, qui répond directement au membre. */
export async function offerHelp(_prev: ProjectState, formData: FormData): Promise<ProjectState> {
  const member = await currentMember()
  if (!member) return { error: LOGIN }
  const topicId = formId(formData.get('id'))
  const message = cleanText(formData.get('message'))
  const { min, max } = PROJECT_LIMITS.offer
  if (message.length < min) return { error: `Explique en quelques phrases ce que tu proposes (${min} caractères au moins).` }
  if (message.length > max) return { error: `Message trop long : ${max} caractères au plus.` }
  const links = linksError(member, message)
  if (links) return { error: links }
  try {
    const data = await getTopic(topicId)
    const details = data ? await getProjectDetails(topicId) : undefined
    if (!data || !details) return { error: "Ce projet n'existe plus." }
    if (details.status === 'found') return { error: "Ce projet a déjà trouvé ce qu'il cherchait." }
    const authorId = data.topic.author.id
    if (authorId === member.id) return { error: "C'est ton propre projet." }
    const author = authorId ? await findMemberById(authorId) : undefined
    if (!author || author.status !== 'active') return { error: "L'auteur de ce projet n'est plus membre de la communauté." }
    if ((await offersToday(member.id)) >= MAX_OFFERS_PER_DAY || !offersPerMember.take(`m${member.id}`)) {
      return { error: "Tu as déjà proposé ton aide 5 fois aujourd'hui : réessaie demain." }
    }
    if (!(await recordOffer(topicId, member.id))) return { error: 'Tu as déjà proposé ton aide pour ce projet : sa réponse arrivera par e-mail.' }
    const [sent] = await sendMails([
      helpOffer(author, {
        projectTitle: data.topic.title,
        helper: displayName(member),
        helperDetail: authorDetail(member.activity, member.city),
        helperEmail: member.email,
        message,
        link: absoluteUrl(`${topicPath(data.topic.id, data.topic.title)}/`),
      }),
    ])
    if (!sent) {
      await forgetOffer(topicId, member.id)
      return { error: "L'envoi n'a pas fonctionné : réessaie dans quelques minutes." }
    }
    return { ok: `Ton message est parti chez ${displayName(author)}. Sa réponse arrivera directement dans ta boîte e-mail.` }
  } catch (error) {
    console.error('projets : proposition non envoyée', error)
    return { error: BROKEN }
  }
}
