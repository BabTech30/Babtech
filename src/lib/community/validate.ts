import {
  getForumCategory,
  GROUP_LEVELS,
  GROUP_LIMITS,
  type GroupLevel,
  LIMITS,
  NEW_ACCOUNT_DAYS,
  NEW_ACCOUNT_MAX_LINKS,
  PROJECT_LIMITS,
  PROJECT_NEEDS,
  PROJECT_STAGES,
  type ProjectNeed,
  type ProjectStage,
} from '@/data/forum'
import type { GroupInput } from './groups'
import type { Member } from './members'
import type { ProjectInput } from './projects'
import { cleanText, countLinks, singleLine } from './text'

/**
 * Vérification des formulaires de la communauté (sujets, réponses, projets, groupes), commune à toutes les
 * Server Actions : mêmes longueurs, mêmes messages d'erreur, même limite de liens pour les nouveaux comptes.
 */

/** Pendant ses premiers jours, un compte ne peut mettre que quelques liens par message (frein au spam). */
export function linksError(member: Member, text: string) {
  const recent = Date.now() - member.createdAt.getTime() < NEW_ACCOUNT_DAYS * 86_400_000
  if (recent && countLinks(text) > NEW_ACCOUNT_MAX_LINKS) {
    return `Pendant tes ${NEW_ACCOUNT_DAYS} premiers jours, tu peux mettre ${NEW_ACCOUNT_MAX_LINKS} liens au plus par message.`
  }
  return undefined
}

/** Thème, titre et message d'un sujet (ou d'un projet). */
export function readTopic(formData: FormData) {
  const category = String(formData.get('categorie') ?? '')
  const title = singleLine(formData.get('titre'))
  const body = cleanText(formData.get('message'))
  let error: string | undefined
  if (!getForumCategory(category)) error = 'Choisis un thème.'
  else if (title.length < LIMITS.title.min || title.length > LIMITS.title.max) {
    error = `Le titre doit faire entre ${LIMITS.title.min} et ${LIMITS.title.max} caractères : une vraie question, précise.`
  } else if (body.length < LIMITS.topic.min) error = `Donne un peu plus de détails (${LIMITS.topic.min} caractères au moins).`
  else if (body.length > LIMITS.topic.max) error = `Message trop long : ${LIMITS.topic.max} caractères au plus.`
  return { category, title, body, error }
}

export function replyError(body: string) {
  if (body.length < LIMITS.reply.min) return 'Ta réponse est vide.'
  if (body.length > LIMITS.reply.max) return `Réponse trop longue : ${LIMITS.reply.max} caractères au plus.`
  return undefined
}

/** Ce que cherche le porteur du projet, précision sur la compétence, étape du projet. */
export function readProject(formData: FormData): { project: ProjectInput; error?: string } {
  const wanted = formData.getAll('cherche').map(String)
  const needs = PROJECT_NEEDS.map((n) => n.value).filter((v): v is ProjectNeed => wanted.includes(v))
  const skill = singleLine(formData.get('competence')).slice(0, PROJECT_LIMITS.skill.max)
  const stageValue = String(formData.get('etape') ?? '')
  const stage = (PROJECT_STAGES.find((s) => s.value === stageValue)?.value ?? '') as ProjectStage
  const project = { needs, skill: needs.includes('competence') ? skill : '', stage }
  if (!needs.length) return { project, error: 'Coche au moins une chose que tu cherches : des conseils, un partenaire ou une compétence.' }
  if (needs.includes('competence') && skill.length < 3) return { project, error: 'Précise la compétence que tu cherches (ex. photographe, comptable, développeur).' }
  if (!stage) return { project, error: 'Indique où en est ton projet.' }
  return { project }
}

/** Nom, thème, description, ville, niveau et nombre de places d'un groupe. */
export function readGroup(formData: FormData): { group: GroupInput; error?: string } {
  const name = singleLine(formData.get('nom'))
  const description = cleanText(formData.get('description'))
  const category = String(formData.get('categorie') ?? '')
  const city = singleLine(formData.get('ville')).slice(0, GROUP_LIMITS.city.max)
  const levelValue = String(formData.get('niveau') ?? 'tous')
  const level = (GROUP_LEVELS.find((l) => l.value === levelValue)?.value ?? 'tous') as GroupLevel
  const places = String(formData.get('places') ?? '').trim()
  const capacity = places ? Number(places) : 0
  const group = { name, description, category, city, level, capacity: Number.isInteger(capacity) ? capacity : 0 }
  const { name: n, description: d, capacity: c } = GROUP_LIMITS
  if (name.length < n.min || name.length > n.max) return { group, error: `Le nom du groupe doit faire entre ${n.min} et ${n.max} caractères.` }
  if (!getForumCategory(category)) return { group, error: 'Choisis le thème du groupe.' }
  if (description.length < d.min) return { group, error: `Décris le groupe en quelques phrases (${d.min} caractères au moins) : pour qui, pour faire quoi.` }
  if (description.length > d.max) return { group, error: `Description trop longue : ${d.max} caractères au plus.` }
  if (places && (!Number.isInteger(capacity) || capacity < c.min || capacity > c.max)) {
    return { group, error: `Nombre de places : entre ${c.min} et ${c.max}, ou laisse vide pour ne pas limiter.` }
  }
  return { group }
}

/** Identifiant numérique envoyé par un formulaire (0 si absent ou invalide). */
export const formId = (value: FormDataEntryValue | null) => {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : 0
}
