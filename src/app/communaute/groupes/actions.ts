'use server'

import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { getForumCategory, groupLevelLabel, groupPath, GROUPS_PATH } from '@/data/forum'
import { notifyDevices } from '@/lib/admin/push'
import { getGroup, joinGroup, leaveGroup, membership, pendingProposals, proposeGroup, setGroupNotify, updateGroup } from '@/lib/community/groups'
import { currentMember, displayName } from '@/lib/community/members'
import { goTo, safeReturn } from '@/lib/community/redirect'
import { formId, linksError, readGroup } from '@/lib/community/validate'
import { groupProposalAlert } from '@/lib/emails'
import { limiter } from '@/lib/limits'
import { sendMails } from '@/lib/mail'

/**
 * Groupes de la communauté : un membre en propose un (publié une fois validé dans le tableau de bord), les membres
 * le rejoignent en un clic dans la limite des places, et l'animateur ou l'animatrice peut le modifier.
 */
export type GroupState = { error?: string; ok?: string }

const proposalsPerMember = limiter({ perVisitor: 2, windowMs: 86_400_000, perDay: 100 })
const joinsPerMember = limiter({ perVisitor: 30, windowMs: 86_400_000, perDay: 3000 })
const MAX_PENDING = 3

const LOGIN = 'Connecte-toi pour participer.'
const BROKEN = 'Enregistrement impossible pour le moment : réessaie dans quelques minutes.'

/** Résumé d'un groupe pour l'alerte : thème, ville, niveau, places. */
function details(g: { category: string; city: string; level: string; capacity: number }) {
  return [getForumCategory(g.category)?.name, g.city, groupLevelLabel(g.level), g.capacity ? `${g.capacity} places` : 'places illimitées']
    .filter(Boolean)
    .join(' · ')
}

export async function proposeGroupAction(_prev: GroupState, formData: FormData): Promise<GroupState> {
  const member = await currentMember()
  if (!member) return { error: LOGIN }
  const { group, error } = readGroup(formData)
  if (error) return { error }
  const links = linksError(member, group.description)
  if (links) return { error: links }
  try {
    if ((await pendingProposals(member.id)) >= MAX_PENDING) {
      return { error: `Tu as déjà ${MAX_PENDING} propositions en attente de validation : attends la réponse avant d'en proposer d'autres.` }
    }
    if (!proposalsPerMember.take(`m${member.id}`)) return { error: "Tu as déjà proposé 2 groupes aujourd'hui : réessaie demain." }
    await proposeGroup(member.id, group)
  } catch (error) {
    console.error('groupes : proposition non enregistrée', error)
    return { error: BROKEN }
  }
  const proposer = displayName(member)
  after(async () => {
    const results = await Promise.allSettled([
      notifyDevices({ title: 'Groupe proposé', body: `${proposer} : ${group.name}`, url: '/admin/communaute/', tag: `groupe-${group.name}` }),
      sendMails([groupProposalAlert({ name: group.name, description: group.description, details: details(group) }, proposer)]),
    ])
    for (const r of results) if (r.status === 'rejected') console.error('groupes : alerte non envoyée', r.reason)
  })
  goTo(`${GROUPS_PATH}/?proposition=envoyee`)
}

/** Rejoindre un groupe ; retour sur la page d'où vient le membre (le groupe, ou un sujet du groupe pour y répondre). */
export async function joinGroupAction(formData: FormData) {
  const groupId = formId(formData.get('groupe'))
  const back = safeReturn(formData.get('retour'), `${GROUPS_PATH}/`)
  const member = await currentMember()
  if (!member) redirect(`/communaute/connexion/?suite=${encodeURIComponent(back)}`)
  let result = 'unavailable'
  try {
    result = joinsPerMember.take(`m${member.id}`) ? await joinGroup(groupId, member.id) : 'unavailable'
  } catch (error) {
    console.error('groupes : adhésion impossible', error)
  }
  const [path, hash] = back.split('#')
  goTo(`${path}${path.includes('?') ? '&' : '?'}adhesion=${result === 'already' ? 'joined' : result}${hash ? `#${hash}` : ''}`)
}

export async function leaveGroupAction(formData: FormData) {
  const groupId = formId(formData.get('groupe'))
  const member = await currentMember()
  let back = `${GROUPS_PATH}/`
  if (member && groupId) {
    try {
      const group = await getGroup(groupId)
      if (group) back = `${groupPath(group.id, group.name)}/`
      if (await leaveGroup(groupId, member.id)) back += '?adhesion=left'
    } catch (error) {
      console.error('groupes : départ impossible', error)
    }
  }
  goTo(back)
}

/** Recevoir ou non un e-mail pour chaque nouveau sujet du groupe. */
export async function groupEmailsAction(formData: FormData) {
  const groupId = formId(formData.get('groupe'))
  const member = await currentMember()
  let back = `${GROUPS_PATH}/`
  if (member && groupId) {
    try {
      const group = await getGroup(groupId)
      if (group) back = `${groupPath(group.id, group.name)}/`
      if (await membership(groupId, member.id)) await setGroupNotify(groupId, member.id, formData.get('emails') === 'oui')
    } catch (error) {
      console.error('groupes : préférence non enregistrée', error)
    }
  }
  goTo(back)
}

/** Modification du groupe par son animateur ou son animatrice. */
export async function updateGroupAction(_prev: GroupState, formData: FormData): Promise<GroupState> {
  const member = await currentMember()
  if (!member) return { error: LOGIN }
  const groupId = formId(formData.get('groupe'))
  const { group, error } = readGroup(formData)
  if (error) return { error }
  const links = linksError(member, group.description)
  if (links) return { error: links }
  try {
    const current = await getGroup(groupId, { withHidden: true })
    if (!current) return { error: "Ce groupe n'existe plus." }
    if (group.capacity && group.capacity < current.memberCount) {
      return { error: `Le groupe compte déjà ${current.memberCount} membres : choisis au moins ${current.memberCount} places, ou laisse vide.` }
    }
    if (!(await updateGroup(groupId, member.id, group))) return { error: "Seul l'animateur ou l'animatrice du groupe peut le modifier." }
  } catch (error) {
    console.error('groupes : modification non enregistrée', error)
    return { error: BROKEN }
  }
  goTo(`${groupPath(groupId, group.name)}/`)
}
