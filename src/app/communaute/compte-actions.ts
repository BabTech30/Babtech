'use server'

import { refresh } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { LIMITS } from '@/data/forum'
import { notifyDevices } from '@/lib/admin/push'
import {
  activateMember,
  consumeToken,
  createMember,
  createToken,
  currentMember,
  deleteMember,
  deleteTokens,
  displayName,
  endMemberSession,
  findMemberByEmail,
  findMemberById,
  memberPasswordHash,
  normalizeEmail,
  purgeStale,
  recentTokens,
  setMemberPassword,
  startMemberSession,
  updateProfile,
} from '@/lib/community/members'
import { singleLine } from '@/lib/community/text'
import { dbConfigured } from '@/lib/db'
import { memberAlreadyRegistered, memberReset, memberVerify } from '@/lib/emails'
import { limiter } from '@/lib/limits'
import { mailConfigured, sendMails } from '@/lib/mail'
import { hashPassword, verifyPassword } from '@/lib/password'
import { absoluteUrl } from '@/lib/site'
import { visitorAddress } from '@/lib/visitor'

/** Comptes de la communauté : inscription, confirmation, connexion, mot de passe, profil, suppression. */
export type AccountState = { ok?: string; error?: string; sent?: boolean }

const FORUM = '/communaute/forum/'
const UNAVAILABLE = "L'espace membres n'est pas encore ouvert : réessaie un peu plus tard."
const BROKEN = 'Action impossible pour le moment : réessaie dans quelques minutes.'

const signups = limiter({ perVisitor: 5, windowMs: 3_600_000, perDay: 200 })
const logins = limiter({ perVisitor: 10, windowMs: 15 * 60_000, perDay: 5000 })
const loginsByEmail = limiter({ perVisitor: 6, windowMs: 15 * 60_000, perDay: 5000 })
const resets = limiter({ perVisitor: 5, windowMs: 3_600_000, perDay: 300 })

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Prénom ou nom : lettres (accents compris), espaces, tirets, apostrophes. */
const NAME = new RegExp("^\\p{L}[\\p{L}\\p{M}' .-]*$", 'u')

function readProfile(formData: FormData) {
  return {
    firstName: singleLine(formData.get('prenom')),
    lastName: singleLine(formData.get('nom')),
    activity: singleLine(formData.get('activite')),
    city: singleLine(formData.get('ville')),
  }
}

function profileError(p: ReturnType<typeof readProfile>) {
  if (!p.firstName || p.firstName.length > 60 || !NAME.test(p.firstName)) return 'Indique ton prénom (lettres, espaces, tirets).'
  if (!p.lastName || p.lastName.length > 80 || !NAME.test(p.lastName)) return 'Indique ton nom (seule son initiale est affichée).'
  if (p.activity.length > 80) return 'Activité : 80 caractères au plus.'
  if (p.city.length > 80) return 'Ville : 80 caractères au plus.'
  return undefined
}

function passwordError(password: string, email = '') {
  if (password.length < LIMITS.password.min) return `Mot de passe trop court : ${LIMITS.password.min} caractères au moins.`
  if (password.length > LIMITS.password.max) return 'Mot de passe trop long.'
  if (email && password.toLowerCase() === email.toLowerCase()) return "Le mot de passe ne doit pas être ton adresse e-mail."
  return undefined
}

/** Adresse de retour après connexion : seulement une page de la communauté. */
function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? '')
  return /^\/communaute\/[\w\-/?=&#%.]*$/.test(next) && !next.includes('//') ? next : FORUM
}

/** Envoie (ou renvoie) le lien de confirmation, 3 fois au plus en 10 minutes. */
async function sendVerification(member: { id: number; email: string; firstName: string }) {
  if ((await recentTokens(member.id, 'verify', 10 * 60_000)) >= 3) return true
  const token = await createToken(member.id, 'verify')
  const [sent] = await sendMails([memberVerify(member, absoluteUrl(`/communaute/confirmer?t=${token}`))])
  return sent
}

/* ---------- Inscription ---------- */

export async function signUp(_prev: AccountState, formData: FormData): Promise<AccountState> {
  // Champ piège invisible : un robot le remplit, on fait comme si tout allait bien.
  if (String(formData.get('site_web') ?? '')) return { sent: true }
  if (!dbConfigured() || !mailConfigured()) return { error: UNAVAILABLE }

  const profile = readProfile(formData)
  const email = normalizeEmail(String(formData.get('email') ?? ''))
  const password = String(formData.get('mot_de_passe') ?? '')
  const problem = profileError(profile)
  if (problem) return { error: problem }
  if (!EMAIL.test(email) || email.length > 190) return { error: 'Adresse e-mail invalide.' }
  const weak = passwordError(password, email)
  if (weak) return { error: weak }
  if (formData.get('charte') !== 'oui') return { error: 'Coche la case pour accepter la charte de la communauté.' }
  if (!signups.take(await visitorAddress())) return { error: "Trop d'inscriptions depuis cette connexion : réessaie dans une heure." }

  try {
    await purgeStale().catch((error) => console.error('communauté : nettoyage impossible', error))
    const existing = await findMemberByEmail(email)
    if (existing) {
      // Même réponse que pour une nouvelle inscription : le site ne révèle pas qui est déjà membre.
      if (existing.status === 'pending') await sendVerification(existing)
      else if (existing.status === 'active') after(() => sendMails([memberAlreadyRegistered(existing)]))
      return { sent: true }
    }
    const id = await createMember({ ...profile, email, password })
    if (!id) return { sent: true }
    const sent = await sendVerification({ id, email, firstName: profile.firstName })
    if (!sent) {
      return { error: "Ton compte est créé, mais l'e-mail de confirmation n'est pas parti. Réessaie dans quelques minutes avec le même formulaire." }
    }
    return { sent: true }
  } catch (error) {
    console.error('communauté : inscription impossible', error)
    return { error: BROKEN }
  }
}

/** Clic sur « Confirmer mon adresse » (depuis le lien de l'e-mail) : compte activé et membre connecté. */
export async function confirmEmail(_prev: AccountState, formData: FormData): Promise<AccountState> {
  if (!dbConfigured()) return { error: UNAVAILABLE }
  let memberId: number | undefined
  try {
    memberId = await consumeToken(String(formData.get('t') ?? ''), 'verify')
    if (!memberId) {
      return { error: "Ce lien n'est plus valable (déjà utilisé ou trop ancien). Connecte-toi : si ton adresse n'est pas confirmée, un nouveau lien te sera envoyé." }
    }
    await activateMember(memberId)
    // Les autres liens de confirmation envoyés (renvois) ne servent plus.
    await deleteTokens(memberId, 'verify')
    await startMemberSession(memberId)
    const member = await findMemberById(memberId)
    if (member) {
      after(() =>
        notifyDevices({ title: 'Nouveau membre', body: `${displayName(member)} a rejoint la communauté`, url: '/admin/communaute/', tag: `membre-${member.id}` }).catch(
          (error) => console.error('communauté : notification non envoyée', error),
        ),
      )
    }
  } catch (error) {
    console.error('communauté : confirmation impossible', error)
    return { error: BROKEN }
  }
  redirect(`${FORUM}?bienvenue=1`)
}

/* ---------- Connexion ---------- */

let dummyHash: Promise<string> | undefined
/** Même durée de vérification qu'il existe un compte ou non (on ne devine pas les adresses inscrites). */
const fakeCheck = async (password: string) => verifyPassword(password, await (dummyHash ??= hashPassword('mot-de-passe-factice')))

export async function logIn(_prev: AccountState, formData: FormData): Promise<AccountState> {
  if (!dbConfigured()) return { error: UNAVAILABLE }
  const email = normalizeEmail(String(formData.get('email') ?? ''))
  const password = String(formData.get('mot_de_passe') ?? '')
  if (!email || !password) return { error: 'Indique ton e-mail et ton mot de passe.' }
  if (!logins.take(await visitorAddress()) || !loginsByEmail.take(email)) {
    return { error: "Trop d'essais : attends un quart d'heure, ou choisis un nouveau mot de passe." }
  }
  try {
    const member = await findMemberByEmail(email)
    const valid = member ? await verifyPassword(password, await memberPasswordHash(member.id)) : await fakeCheck(password)
    if (!member || !valid) return { error: 'E-mail ou mot de passe incorrect.' }
    if (member.status === 'blocked') return { error: 'Ce compte est suspendu. Écris à contact@babtech.fr si tu penses que c\'est une erreur.' }
    if (member.status === 'pending') {
      await sendVerification(member)
      return { error: "Ton adresse n'est pas encore confirmée : un lien vient de partir (pense à regarder dans les indésirables)." }
    }
    await startMemberSession(member.id)
  } catch (error) {
    console.error('communauté : connexion impossible', error)
    return { error: BROKEN }
  }
  redirect(safeNext(formData.get('suite')))
}

export async function logOut() {
  await endMemberSession()
  redirect(FORUM)
}

/* ---------- Mot de passe oublié ---------- */

export async function requestReset(_prev: AccountState, formData: FormData): Promise<AccountState> {
  if (!dbConfigured() || !mailConfigured()) return { error: UNAVAILABLE }
  const email = normalizeEmail(String(formData.get('email') ?? ''))
  if (!EMAIL.test(email)) return { error: 'Adresse e-mail invalide.' }
  if (!resets.take(await visitorAddress())) return { error: "Trop de demandes depuis cette connexion : réessaie dans une heure." }
  try {
    const member = await findMemberByEmail(email)
    if (member && member.status !== 'blocked' && (await recentTokens(member.id, 'reset', 3_600_000)) < 3) {
      const token = await createToken(member.id, 'reset')
      // Envoi après la réponse : même délai qu'il y ait un compte ou non.
      after(() => sendMails([memberReset(member, absoluteUrl(`/communaute/nouveau-mot-de-passe?t=${token}`))]))
    }
    return { sent: true }
  } catch (error) {
    console.error('communauté : demande de mot de passe impossible', error)
    return { error: BROKEN }
  }
}

export async function resetPassword(_prev: AccountState, formData: FormData): Promise<AccountState> {
  if (!dbConfigured()) return { error: UNAVAILABLE }
  const password = String(formData.get('mot_de_passe') ?? '')
  const weak = passwordError(password)
  if (weak) return { error: weak }
  if (password !== String(formData.get('confirmation') ?? '')) return { error: 'Les deux mots de passe ne sont pas identiques.' }
  try {
    const memberId = await consumeToken(String(formData.get('t') ?? ''), 'reset')
    if (!memberId) return { error: "Ce lien n'est plus valable (déjà utilisé ou plus d'une heure). Demande un nouveau lien." }
    const member = await findMemberById(memberId)
    if (!member || member.status === 'blocked') return { error: "Ce lien n'est plus valable." }
    await setMemberPassword(memberId, password)
    // Le lien reçu par e-mail prouve aussi l'adresse : un compte pas encore confirmé l'est maintenant.
    await activateMember(memberId)
    await startMemberSession(memberId)
  } catch (error) {
    console.error('communauté : nouveau mot de passe impossible', error)
    return { error: BROKEN }
  }
  redirect('/communaute/compte/?mdp=1')
}

/* ---------- Compte ---------- */

async function requireMember() {
  const member = await currentMember()
  if (!member) redirect('/communaute/connexion/?suite=/communaute/compte/')
  return member
}

export async function saveProfile(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const member = await requireMember()
  const profile = readProfile(formData)
  const problem = profileError(profile)
  if (problem) return { error: problem }
  try {
    await updateProfile(member.id, { ...profile, notifyReplies: formData.get('notifications') === 'oui' })
    // Recharge la page pour afficher tout de suite le nouveau nom (« tu apparais sous le nom… »).
    refresh()
    return { ok: 'Profil enregistré.' }
  } catch (error) {
    console.error('communauté : profil non enregistré', error)
    return { error: BROKEN }
  }
}

export async function changePassword(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const member = await requireMember()
  const current = String(formData.get('actuel') ?? '')
  const password = String(formData.get('mot_de_passe') ?? '')
  const weak = passwordError(password, member.email)
  if (weak) return { error: weak }
  if (password !== String(formData.get('confirmation') ?? '')) return { error: 'Les deux nouveaux mots de passe ne sont pas identiques.' }
  try {
    if (!(await verifyPassword(current, await memberPasswordHash(member.id)))) return { error: 'Mot de passe actuel incorrect.' }
    // Toutes les sessions sont fermées (autres appareils compris), puis celle-ci est rouverte.
    await setMemberPassword(member.id, password)
    await startMemberSession(member.id)
    return { ok: 'Mot de passe changé. Tes autres appareils sont déconnectés.' }
  } catch (error) {
    console.error('communauté : mot de passe non changé', error)
    return { error: BROKEN }
  }
}

export async function deleteAccount(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const member = await requireMember()
  try {
    if (!(await verifyPassword(String(formData.get('mot_de_passe') ?? ''), await memberPasswordHash(member.id)))) {
      return { error: 'Mot de passe incorrect : ton compte n\'est pas supprimé.' }
    }
    await deleteMember(member.id, formData.get('messages') === 'effacer')
    await endMemberSession()
  } catch (error) {
    console.error('communauté : suppression du compte impossible', error)
    return { error: BROKEN }
  }
  redirect(`${FORUM}?compte=supprime`)
}
