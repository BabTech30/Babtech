'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin/auth'
import { GROUP_LIMITS, groupPath } from '@/data/forum'
import { deletePost, resolveReports, setMemberStatus, setPostStatus } from '@/lib/community/forum'
import { approveGroup, deleteGroup, getGroup, groupProposer, refuseGroup, removeGroupMember, setGroupVisibility } from '@/lib/community/groups'
import { createToken, deleteMember, findMemberById, recentTokens } from '@/lib/community/members'
import { singleLine } from '@/lib/community/text'
import { dbProblem, dbStatus } from '@/lib/db'
import { groupApproved, groupRefused, memberVerify } from '@/lib/emails'
import { sendMails } from '@/lib/mail'
import { absoluteUrl } from '@/lib/site'
import type { FormState } from './actions'

/** Modération de la communauté depuis le tableau de bord (réservé à la personne connectée). */
const PAGE = '/admin/communaute/'

const toId = (value: FormDataEntryValue | null) => {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : 0
}

function done() {
  revalidatePath(PAGE)
  // Pastille « Communauté » du menu, sur toutes les pages du tableau de bord.
  revalidatePath('/admin', 'layout')
}

/** Masquer, réafficher, supprimer un message, ou classer ses signalements sans rien changer. */
export async function moderatePost(formData: FormData) {
  await requireAdmin()
  const target = formData.get('type') === 'reply' ? 'reply' : 'topic'
  const id = toId(formData.get('id'))
  const op = String(formData.get('op') ?? '')
  if (!id) return
  try {
    if (op === 'hide') await setPostStatus(target, id, 'hidden')
    else if (op === 'show') await setPostStatus(target, id, 'visible')
    else if (op === 'delete') await deletePost(target, id)
    else if (op === 'dismiss') await resolveReports(target, id)
  } catch (error) {
    console.error('modération : action impossible', error)
  }
  done()
}

/** Suspendre, rétablir, supprimer un membre, ou lui renvoyer le lien de confirmation. */
export async function moderateMember(formData: FormData) {
  await requireAdmin()
  const id = toId(formData.get('id'))
  const op = String(formData.get('op') ?? '')
  if (!id) return
  try {
    if (op === 'block') await setMemberStatus(id, 'blocked')
    else if (op === 'unblock') await setMemberStatus(id, 'active')
    else if (op === 'delete') await deleteMember(id, false)
    else if (op === 'delete-all') await deleteMember(id, true)
    else if (op === 'resend') {
      const member = await findMemberById(id)
      if (member?.status === 'pending' && (await recentTokens(id, 'verify', 10 * 60_000)) < 3) {
        const token = await createToken(id, 'verify')
        await sendMails([memberVerify(member, absoluteUrl(`/communaute/confirmer?t=${token}`))])
      }
    }
  } catch (error) {
    console.error('modération : action sur le membre impossible', error)
  }
  done()
}

/**
 * Groupes : valider (publié, son auteur prévenu et nommé animateur ou animatrice), refuser (proposition effacée,
 * son auteur prévenu avec le motif éventuel), masquer, réafficher, supprimer, retirer un membre.
 */
export async function moderateGroup(formData: FormData) {
  await requireAdmin()
  const id = toId(formData.get('id'))
  const op = String(formData.get('op') ?? '')
  if (!id) return
  try {
    if (op === 'approve') {
      await approveGroup(id)
      const [group, proposer] = await Promise.all([getGroup(id), groupProposer(id)])
      if (group && proposer) await sendMails([groupApproved(proposer, group.name, absoluteUrl(`${groupPath(group.id, group.name)}/`))])
    } else if (op === 'refuse') {
      const proposer = await groupProposer(id)
      const reason = singleLine(formData.get('motif')).slice(0, GROUP_LIMITS.refusal.max)
      if ((await refuseGroup(id)) && proposer) await sendMails([groupRefused(proposer, proposer.groupName, reason)])
    } else if (op === 'hide') await setGroupVisibility(id, false)
    else if (op === 'show') await setGroupVisibility(id, true)
    else if (op === 'delete') await deleteGroup(id)
    else if (op === 'remove-member') {
      const memberId = toId(formData.get('membre'))
      if (memberId) await removeGroupMember(id, memberId)
    }
  } catch (error) {
    console.error('modération : action sur le groupe impossible', error)
  }
  done()
}

/** Réglages → Communauté : vérifie la connexion à la base et la création des tables. */
export async function testDatabase(): Promise<FormState> {
  await requireAdmin()
  const status = await dbStatus()
  if (!status.configured) return { error: 'Base non configurée : ajoute DB_NAME, DB_USER et DB_PASSWORD dans hPanel, puis redéploie.' }
  if (!status.ok) return { error: `Connexion impossible : ${dbProblem(status.code ?? 'ERREUR')}` }
  return { ok: 'Connexion réussie : la base répond et les tables de la communauté sont en place.' }
}
