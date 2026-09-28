import { type ProjectNeed, type ProjectStage, PROJECTS_PER_PAGE } from '@/data/forum'
import { execute, select, sqlDate, transaction } from '@/lib/db'
import { PUBLIC_TOPIC, TOPIC_COLUMNS, TOPIC_FROM, type ProjectStatus, toTopic } from './forum'

/**
 * Projets des membres : un sujet du forum (bt_topics) avec ce que le membre cherche (bt_projects). Les réponses,
 * les signalements et la modération sont ceux du forum. « Proposer mon aide » envoie un e-mail à l'auteur ;
 * seule la date de la proposition est gardée (bt_project_offers), pour limiter les abus.
 */
export type ProjectDetails = {
  needs: ProjectNeed[]
  skill: string
  stage: ProjectStage
  status: ProjectStatus
}

export type ProjectInput = { needs: ProjectNeed[]; skill: string; stage: ProjectStage }

function toDetails(r: Record<string, unknown>): ProjectDetails {
  const needs: ProjectNeed[] = []
  if (Number(r.wants_advice)) needs.push('conseils')
  if (Number(r.wants_partner)) needs.push('partenaire')
  if (Number(r.wants_skill)) needs.push('competence')
  return { needs, skill: String(r.skill ?? ''), stage: r.stage as ProjectStage, status: r.status as ProjectStatus }
}

const NEED_COLUMN: Record<ProjectNeed, string> = { conseils: 'wants_advice', partenaire: 'wants_partner', competence: 'wants_skill' }

const flags = (needs: ProjectNeed[]) => [needs.includes('conseils') ? 1 : 0, needs.includes('partenaire') ? 1 : 0, needs.includes('competence') ? 1 : 0]

export async function getProjectDetails(topicId: number) {
  const [row] = await select('SELECT * FROM bt_projects WHERE topic_id = ? LIMIT 1', [topicId])
  return row ? toDetails(row) : undefined
}

/** Projets visibles, les recherches en cours d'abord ; filtre facultatif sur ce que le membre cherche. */
export async function listProjects({ need, page }: { need?: ProjectNeed; page: number }) {
  const where = `p.topic_id IS NOT NULL AND ${PUBLIC_TOPIC}${need ? ` AND p.${NEED_COLUMN[need]} = 1` : ''}`
  const [count] = await select(`SELECT COUNT(*) AS n FROM ${TOPIC_FROM} WHERE ${where}`)
  const rows = await select(
    `SELECT ${TOPIC_COLUMNS}, p.wants_advice, p.wants_partner, p.wants_skill, p.skill, p.stage
     FROM ${TOPIC_FROM} WHERE ${where}
     ORDER BY p.status = 'found', t.last_activity_at DESC LIMIT ? OFFSET ?`,
    [PROJECTS_PER_PAGE, (page - 1) * PROJECTS_PER_PAGE],
  )
  return {
    total: Number(count?.n ?? 0),
    projects: rows.map((r) => ({ topic: toTopic(r), details: toDetails({ ...r, status: r.project_status }) })),
  }
}

/** Nouveau projet : le sujet et ses informations, ensemble. */
export async function createProject(memberId: number, p: { category: string; title: string; body: string } & ProjectInput) {
  const now = sqlDate()
  return transaction(async (run) => {
    const topic = await run(
      `INSERT INTO bt_topics (category, member_id, title, body, status, reply_count, created_at, last_activity_at)
       VALUES (?, ?, ?, ?, 'visible', 0, ?, ?)`,
      [p.category, memberId, p.title, p.body, now, now],
    )
    await run(
      'INSERT INTO bt_projects (topic_id, wants_advice, wants_partner, wants_skill, skill, stage, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [topic.insertId, ...flags(p.needs), p.skill, p.stage, 'open'],
    )
    return topic.insertId
  })
}

/** Modification par l'auteur (le sujet lui-même est modifié par editTopic). */
export async function updateProjectDetails(topicId: number, p: ProjectInput) {
  await execute('UPDATE bt_projects SET wants_advice = ?, wants_partner = ?, wants_skill = ?, skill = ?, stage = ? WHERE topic_id = ?', [
    ...flags(p.needs),
    p.skill,
    p.stage,
    topicId,
  ])
}

/** « J'ai trouvé » / « Je cherche encore » : réservé à l'auteur du projet. */
export async function setProjectStatus(topicId: number, memberId: number, status: ProjectStatus) {
  const result = await execute('UPDATE bt_projects p JOIN bt_topics t ON t.id = p.topic_id SET p.status = ? WHERE p.topic_id = ? AND t.member_id = ?', [
    status,
    topicId,
    memberId,
  ])
  // Déjà dans cet état : rien ne change, mais c'est bien son projet.
  return result.affectedRows === 1 || (await select('SELECT 1 AS ok FROM bt_topics WHERE id = ? AND member_id = ?', [topicId, memberId])).length === 1
}

/** Le membre a-t-il déjà proposé son aide pour ce projet ? */
export async function hasOffered(topicId: number, memberId: number) {
  const [row] = await select('SELECT 1 AS ok FROM bt_project_offers WHERE topic_id = ? AND member_id = ? LIMIT 1', [topicId, memberId])
  return Boolean(row)
}

/** Propositions d'aide envoyées par un membre depuis 24 heures (limite anti-abus, gardée même après un redémarrage). */
export async function offersToday(memberId: number) {
  const [row] = await select('SELECT COUNT(*) AS n FROM bt_project_offers WHERE member_id = ? AND created_at > ?', [
    memberId,
    sqlDate(new Date(Date.now() - 86_400_000)),
  ])
  return Number(row?.n ?? 0)
}

/** Réserve la proposition (une seule par membre et par projet) ; faux si elle existait déjà. */
export async function recordOffer(topicId: number, memberId: number) {
  const result = await execute('INSERT IGNORE INTO bt_project_offers (topic_id, member_id, created_at) VALUES (?, ?, ?)', [topicId, memberId, sqlDate()])
  return result.affectedRows === 1
}

/** L'e-mail n'est pas parti : la proposition pourra être refaite. */
export async function forgetOffer(topicId: number, memberId: number) {
  await execute('DELETE FROM bt_project_offers WHERE topic_id = ? AND member_id = ?', [topicId, memberId])
}
