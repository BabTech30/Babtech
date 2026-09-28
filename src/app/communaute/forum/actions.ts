'use server'

import { refresh } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { FORUM_PATH, getForumCategory, LIMITS, NEW_ACCOUNT_DAYS, NEW_ACCOUNT_MAX_LINKS, topicPath } from '@/data/forum'
import { notifyDevices } from '@/lib/admin/push'
import { createReply, createTopic, deleteOwnReply, deleteOwnTopic, editReply, editTopic, getReply, getTopic, reportPost } from '@/lib/community/forum'
import { currentMember, displayName, findMemberById, type Member } from '@/lib/community/members'
import { cleanText, countLinks, excerpt, singleLine } from '@/lib/community/text'
import { forumReportAlert, forumTopicAlert, memberReplyNotice } from '@/lib/emails'
import { limiter } from '@/lib/limits'
import { sendMails } from '@/lib/mail'
import { absoluteUrl } from '@/lib/site'

/**
 * Écriture sur le forum, réservée aux membres connectés. Publication directe : tu es prévenu de chaque nouveau
 * sujet et de chaque signalement, et tu modères depuis le tableau de bord (/admin/communaute/).
 */
export type PostState = { error?: string; ok?: string }

const topicsPerMember = limiter({ perVisitor: 5, windowMs: 86_400_000, perDay: 300 })
const repliesPerMember = limiter({ perVisitor: 40, windowMs: 86_400_000, perDay: 3000 })
const reportsPerMember = limiter({ perVisitor: 10, windowMs: 86_400_000, perDay: 500 })

const LOGIN = 'Connecte-toi pour participer au forum.'
const BROKEN = 'Publication impossible pour le moment : réessaie dans quelques minutes.'

/**
 * Après une écriture, la page affichée est rechargée depuis le serveur : sans cela, une redirection vers la même page
 * (seule l'ancre #reponse-… change) peut laisser l'ancienne version à l'écran, sans la nouvelle réponse.
 */
function goTo(path: string): never {
  refresh()
  redirect(path)
}

const id = (value: FormDataEntryValue | null) => {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : 0
}

function linksError(member: Member, text: string) {
  const recent = Date.now() - member.createdAt.getTime() < NEW_ACCOUNT_DAYS * 86_400_000
  if (recent && countLinks(text) > NEW_ACCOUNT_MAX_LINKS) {
    return `Pendant tes ${NEW_ACCOUNT_DAYS} premiers jours, tu peux mettre ${NEW_ACCOUNT_MAX_LINKS} liens au plus par message.`
  }
  return undefined
}

function readTopic(formData: FormData) {
  const category = String(formData.get('categorie') ?? '')
  const title = singleLine(formData.get('titre'))
  const body = cleanText(formData.get('message'))
  let error: string | undefined
  if (!getForumCategory(category)) error = 'Choisis une catégorie.'
  else if (title.length < LIMITS.title.min || title.length > LIMITS.title.max) {
    error = `Le titre doit faire entre ${LIMITS.title.min} et ${LIMITS.title.max} caractères : une vraie question, précise.`
  } else if (body.length < LIMITS.topic.min) error = `Donne un peu plus de détails (${LIMITS.topic.min} caractères au moins).`
  else if (body.length > LIMITS.topic.max) error = `Message trop long : ${LIMITS.topic.max} caractères au plus.`
  return { category, title, body, error }
}

function replyError(body: string) {
  if (body.length < LIMITS.reply.min) return 'Ta réponse est vide.'
  if (body.length > LIMITS.reply.max) return `Réponse trop longue : ${LIMITS.reply.max} caractères au plus.`
  return undefined
}

/* ---------- Publier ---------- */

export async function publishTopic(_prev: PostState, formData: FormData): Promise<PostState> {
  const member = await currentMember()
  if (!member) return { error: LOGIN }
  const { category, title, body, error } = readTopic(formData)
  if (error) return { error }
  const links = linksError(member, body)
  if (links) return { error: links }
  if (!topicsPerMember.take(`m${member.id}`)) return { error: "Tu as déjà ouvert 5 sujets aujourd'hui : réessaie demain." }
  let path: string
  try {
    path = topicPath(await createTopic(member.id, category, title, body), title)
  } catch (error) {
    console.error('forum : sujet non publié', error)
    return { error: BROKEN }
  }
  const author = displayName(member)
  after(async () => {
    const results = await Promise.allSettled([
      notifyDevices({ title: 'Nouveau sujet sur le forum', body: `${author} : ${title}`, url: '/admin/communaute/', tag: `sujet-${path}` }),
      sendMails([forumTopicAlert({ title, body, path: `${path}/` }, author)]),
    ])
    for (const r of results) if (r.status === 'rejected') console.error('forum : alerte non envoyée', r.reason)
  })
  goTo(`${path}/`)
}

export async function publishReply(_prev: PostState, formData: FormData): Promise<PostState> {
  const member = await currentMember()
  if (!member) return { error: LOGIN }
  const body = cleanText(formData.get('message'))
  const problem = replyError(body) ?? linksError(member, body)
  if (problem) return { error: problem }
  let target: string
  try {
    const data = await getTopic(id(formData.get('sujet')))
    if (!data) return { error: "Ce sujet n'existe plus." }
    if (!repliesPerMember.take(`m${member.id}`)) return { error: "Tu as beaucoup répondu aujourd'hui : réessaie demain." }
    const replyId = await createReply(member.id, data.topic.id, body)
    const path = topicPath(data.topic.id, data.topic.title)
    target = `${path}/#reponse-${replyId}`
    const authorId = data.topic.author.id
    if (authorId && authorId !== member.id) {
      const replier = displayName(member)
      after(async () => {
        const author = await findMemberById(authorId)
        if (author?.status === 'active' && author.notifyReplies) {
          await sendMails([memberReplyNotice(author, data.topic.title, replier, excerpt(body, 400), absoluteUrl(target))])
        }
      })
    }
  } catch (error) {
    console.error('forum : réponse non publiée', error)
    return { error: BROKEN }
  }
  goTo(target)
}

/* ---------- Modifier, supprimer (auteur) ---------- */

export async function updatePost(_prev: PostState, formData: FormData): Promise<PostState> {
  const member = await currentMember()
  if (!member) return { error: LOGIN }
  let back: string
  try {
    if (formData.get('type') === 'reponse') {
      const reply = await getReply(id(formData.get('id')))
      if (!reply || reply.author.id !== member.id) return { error: "Tu ne peux modifier que tes propres messages." }
      const body = cleanText(formData.get('message'))
      const problem = replyError(body) ?? linksError(member, body)
      if (problem) return { error: problem }
      await editReply(reply.id, member.id, body)
      const data = await getTopic(reply.topicId, { withHidden: true })
      back = data ? `${topicPath(data.topic.id, data.topic.title)}/#reponse-${reply.id}` : `${FORUM_PATH}/`
    } else {
      const topicId = id(formData.get('id'))
      const { category, title, body, error } = readTopic(formData)
      if (error) return { error }
      const links = linksError(member, body)
      if (links) return { error: links }
      if (!(await editTopic(topicId, member.id, { category, title, body }))) return { error: 'Tu ne peux modifier que tes propres sujets.' }
      back = `${topicPath(topicId, title)}/`
    }
  } catch (error) {
    console.error('forum : modification non enregistrée', error)
    return { error: BROKEN }
  }
  goTo(back)
}

export async function removeOwnPost(formData: FormData) {
  const member = await currentMember()
  if (!member) redirect('/communaute/connexion/')
  const postId = id(formData.get('id'))
  let back = `${FORUM_PATH}/`
  try {
    if (formData.get('type') === 'reponse') {
      const reply = await getReply(postId)
      const data = reply ? await getTopic(reply.topicId) : undefined
      await deleteOwnReply(postId, member.id)
      if (data) back = `${topicPath(data.topic.id, data.topic.title)}/`
    } else {
      const data = await getTopic(postId)
      const result = await deleteOwnTopic(postId, member.id)
      if (result === 'replies' && data) back = `${topicPath(data.topic.id, data.topic.title)}/?erreur=reponses`
      else if (result === 'deleted') back = `${FORUM_PATH}/?sujet=supprime`
    }
  } catch (error) {
    console.error('forum : suppression impossible', error)
  }
  goTo(back)
}

/* ---------- Signaler ---------- */

export async function reportMessage(_prev: PostState, formData: FormData): Promise<PostState> {
  const member = await currentMember()
  if (!member) return { error: LOGIN }
  const target = formData.get('type') === 'reponse' ? 'reply' : 'topic'
  const targetId = id(formData.get('id'))
  const reason = singleLine(formData.get('motif')).slice(0, LIMITS.report.max) || 'Sans précision'
  if (!reportsPerMember.take(`m${member.id}`)) return { error: "Tu as déjà fait beaucoup de signalements aujourd'hui. Écris à contact@babtech.fr si c'est urgent." }
  try {
    let topicTitle = ''
    let body = ''
    let path = ''
    if (target === 'reply') {
      const reply = await getReply(targetId)
      const data = reply ? await getTopic(reply.topicId) : undefined
      if (!reply || !data) return { error: "Ce message n'existe plus." }
      ;[topicTitle, body, path] = [data.topic.title, reply.body, `${topicPath(data.topic.id, data.topic.title)}/#reponse-${reply.id}`]
    } else {
      const data = await getTopic(targetId)
      if (!data) return { error: "Ce message n'existe plus." }
      ;[topicTitle, body, path] = [data.topic.title, data.topic.body, `${topicPath(data.topic.id, data.topic.title)}/`]
    }
    if (await reportPost(member.id, target, targetId, reason)) {
      const reporter = displayName(member)
      after(async () => {
        const results = await Promise.allSettled([
          notifyDevices({ title: 'Message signalé', body: `${reporter} : ${reason}`, url: '/admin/communaute/', tag: `signalement-${target}-${targetId}` }),
          sendMails([forumReportAlert({ reason, excerpt: excerpt(body, 600), topicTitle, path }, reporter)]),
        ])
        for (const r of results) if (r.status === 'rejected') console.error('forum : alerte de signalement non envoyée', r.reason)
      })
    }
    return { ok: 'Merci : le message est signalé, il sera examiné rapidement.' }
  } catch (error) {
    console.error('forum : signalement non enregistré', error)
    return { error: BROKEN }
  }
}
