import { forumCategories, publicName, TOPICS_PER_PAGE } from '@/data/forum'
import { inCity } from '@/data/zones'
import { dbConfigured, execute, type Row, select, sqlDate, transaction } from '@/lib/db'

/**
 * Forum de la communauté (tables bt_topics, bt_replies, bt_reports) : lecture publique, écriture par les
 * membres, modération depuis le tableau de bord. Un message masqué par la modération disparaît du site public.
 * Un sujet peut être un projet (bt_projects) ou appartenir à un groupe (bt_group_topics) : il disparaît aussi
 * du site si son groupe est masqué.
 */
export type PostStatus = 'visible' | 'hidden'
export type Author = { id: number | null; name: string; detail: string }
export type ProjectStatus = 'open' | 'found'
export type GroupStatus = 'pending' | 'active' | 'hidden'

export type Topic = {
  id: number
  category: string
  title: string
  body: string
  status: PostStatus
  replyCount: number
  createdAt: Date
  editedAt: Date | null
  lastActivityAt: Date
  author: Author
  /** Projet d'un membre : recherche en cours ou trouvée. */
  project?: { status: ProjectStatus }
  /** Groupe dans lequel le sujet a été ouvert. */
  group?: { id: number; name: string; status: GroupStatus }
}

export type Reply = { id: number; topicId: number; body: string; status: PostStatus; createdAt: Date; editedAt: Date | null; author: Author }

/** « Fleuriste à Nîmes », « Fleuriste au Grau-du-Roi », « Fleuriste », « Nîmes ». */
export function authorDetail(activity: string, city: string) {
  if (activity && city) return `${activity} ${inCity(city)}`
  return activity || city
}

function toAuthor(r: Row): Author {
  if (r.member_id == null || r.first_name == null) return { id: null, name: 'Ancien membre', detail: '' }
  return { id: Number(r.member_id), name: publicName(String(r.first_name), String(r.last_name)), detail: authorDetail(String(r.activity ?? ''), String(r.city ?? '')) }
}

function toTopic(r: Row): Topic {
  return {
    id: Number(r.id),
    category: String(r.category),
    title: String(r.title),
    body: String(r.body),
    status: r.status as PostStatus,
    replyCount: Number(r.reply_count),
    createdAt: new Date(r.created_at),
    editedAt: r.edited_at ? new Date(r.edited_at) : null,
    lastActivityAt: new Date(r.last_activity_at),
    author: toAuthor(r),
    ...(r.project_status ? { project: { status: r.project_status as ProjectStatus } } : {}),
    ...(r.group_id != null ? { group: { id: Number(r.group_id), name: String(r.group_name), status: r.group_status as GroupStatus } } : {}),
  }
}

function toReply(r: Row): Reply {
  return {
    id: Number(r.id),
    topicId: Number(r.topic_id),
    body: String(r.body),
    status: r.status as PostStatus,
    createdAt: new Date(r.created_at),
    editedAt: r.edited_at ? new Date(r.edited_at) : null,
    author: toAuthor(r),
  }
}

const TOPIC_COLUMNS = `t.id, t.category, t.title, t.body, t.status, t.reply_count, t.created_at, t.edited_at, t.last_activity_at,
  t.member_id, m.first_name, m.last_name, m.activity, m.city, p.status AS project_status, g.id AS group_id, g.name AS group_name,
  g.status AS group_status`
export const TOPIC_FROM = `bt_topics t LEFT JOIN bt_members m ON m.id = t.member_id
  LEFT JOIN bt_projects p ON p.topic_id = t.id
  LEFT JOIN bt_group_topics gt ON gt.topic_id = t.id
  LEFT JOIN bt_groups g ON g.id = gt.group_id`
/** Sujet visible sur le site : pas masqué, et son groupe (s'il en a un) est publié. */
export const PUBLIC_TOPIC = "t.status = 'visible' AND (g.id IS NULL OR g.status = 'active')"
export { TOPIC_COLUMNS, toTopic }
const REPLY_COLUMNS = `r.id, r.topic_id, r.body, r.status, r.created_at, r.edited_at, r.member_id, m.first_name, m.last_name, m.activity, m.city`

/* ---------- Lecture publique ---------- */

/** Accueil du forum : nombre de sujets par catégorie et derniers sujets actifs. */
export async function forumOverview(latest = 8) {
  const counts = await select(`SELECT t.category, COUNT(*) AS n FROM ${TOPIC_FROM} WHERE ${PUBLIC_TOPIC} GROUP BY t.category`)
  const topics = await select(`SELECT ${TOPIC_COLUMNS} FROM ${TOPIC_FROM} WHERE ${PUBLIC_TOPIC} ORDER BY t.last_activity_at DESC LIMIT ?`, [latest])
  const byCategory = Object.fromEntries(forumCategories.map((c) => [c.slug, 0])) as Record<string, number>
  for (const row of counts) if (row.category in byCategory) byCategory[String(row.category)] = Number(row.n)
  return { counts: byCategory, latest: topics.map(toTopic) }
}

export async function topicsInCategory(category: string, page: number) {
  const [count] = await select(`SELECT COUNT(*) AS n FROM ${TOPIC_FROM} WHERE t.category = ? AND ${PUBLIC_TOPIC}`, [category])
  const rows = await select(
    `SELECT ${TOPIC_COLUMNS} FROM ${TOPIC_FROM}
     WHERE t.category = ? AND ${PUBLIC_TOPIC} ORDER BY t.last_activity_at DESC LIMIT ? OFFSET ?`,
    [category, TOPICS_PER_PAGE, (page - 1) * TOPICS_PER_PAGE],
  )
  return { total: Number(count?.n ?? 0), topics: rows.map(toTopic) }
}

/**
 * Un sujet et ses réponses. Par défaut, seulement s'il est visible sur le site (pas masqué, groupe publié),
 * et seulement ses réponses visibles.
 */
export async function getTopic(id: number, { withHidden = false } = {}) {
  const [row] = await select(`SELECT ${TOPIC_COLUMNS} FROM ${TOPIC_FROM} WHERE t.id = ? LIMIT 1`, [id])
  if (!row) return undefined
  const topic = toTopic(row)
  if (!withHidden && (topic.status !== 'visible' || (topic.group && topic.group.status !== 'active'))) return undefined
  const replies = await select(
    `SELECT ${REPLY_COLUMNS} FROM bt_replies r LEFT JOIN bt_members m ON m.id = r.member_id
     WHERE r.topic_id = ? ${withHidden ? '' : "AND r.status = 'visible'"} ORDER BY r.created_at ASC, r.id ASC`,
    [id],
  )
  return { topic, replies: replies.map(toReply) }
}

export async function getReply(id: number) {
  const [row] = await select(`SELECT ${REPLY_COLUMNS} FROM bt_replies r LEFT JOIN bt_members m ON m.id = r.member_id WHERE r.id = ? LIMIT 1`, [id])
  return row ? toReply(row) : undefined
}

/* ---------- Écriture par les membres ---------- */

export async function createTopic(memberId: number, category: string, title: string, body: string) {
  const now = sqlDate()
  const result = await execute(
    `INSERT INTO bt_topics (category, member_id, title, body, status, reply_count, created_at, last_activity_at)
     VALUES (?, ?, ?, ?, 'visible', 0, ?, ?)`,
    [category, memberId, title, body, now, now],
  )
  return result.insertId
}

export async function createReply(memberId: number, topicId: number, body: string) {
  const now = sqlDate()
  return transaction(async (run) => {
    const result = await run("INSERT INTO bt_replies (topic_id, member_id, body, status, created_at) VALUES (?, ?, ?, 'visible', ?)", [
      topicId,
      memberId,
      body,
      now,
    ])
    await run('UPDATE bt_topics SET reply_count = reply_count + 1, last_activity_at = ? WHERE id = ?', [now, topicId])
    return result.insertId
  })
}

/** Modification par l'auteur (le message garde la mention « modifié »). Renvoie faux si ce n'est pas son message. */
export async function editTopic(id: number, memberId: number, p: { category: string; title: string; body: string }) {
  const { affectedRows } = await execute('UPDATE bt_topics SET category = ?, title = ?, body = ?, edited_at = ? WHERE id = ? AND member_id = ?', [
    p.category,
    p.title,
    p.body,
    sqlDate(),
    id,
    memberId,
  ])
  return affectedRows === 1
}

export async function editReply(id: number, memberId: number, body: string) {
  const { affectedRows } = await execute('UPDATE bt_replies SET body = ?, edited_at = ? WHERE id = ? AND member_id = ?', [body, sqlDate(), id, memberId])
  return affectedRows === 1
}

/** L'auteur supprime sa réponse. */
export async function deleteOwnReply(id: number, memberId: number) {
  const reply = await getReply(id)
  if (!reply || reply.author.id !== memberId) return false
  await removeReply(reply)
  return true
}

/** L'auteur supprime son sujet, tant que personne d'autre n'y a répondu. */
export async function deleteOwnTopic(id: number, memberId: number) {
  const [row] = await select(
    'SELECT COUNT(*) AS n FROM bt_replies WHERE topic_id = ? AND (member_id IS NULL OR member_id <> ?)',
    [id, memberId],
  )
  if (Number(row?.n ?? 0) > 0) return 'replies' as const
  const { affectedRows } = await execute('DELETE FROM bt_topics WHERE id = ? AND member_id = ?', [id, memberId])
  return affectedRows === 1 ? ('deleted' as const) : ('forbidden' as const)
}

/** Signalement d'un message par un membre (une seule fois par membre et par message). */
export async function reportPost(memberId: number, target: 'topic' | 'reply', targetId: number, reason: string) {
  const [existing] = await select('SELECT id FROM bt_reports WHERE member_id = ? AND target = ? AND target_id = ? AND resolved_at IS NULL LIMIT 1', [
    memberId,
    target,
    targetId,
  ])
  if (existing) return false
  await execute('INSERT INTO bt_reports (target, target_id, member_id, reason, created_at) VALUES (?, ?, ?, ?, ?)', [
    target,
    targetId,
    memberId,
    reason,
    sqlDate(),
  ])
  return true
}

/* ---------- Modération (tableau de bord) ---------- */

async function removeReply(reply: Reply) {
  await transaction(async (run) => {
    await run('DELETE FROM bt_replies WHERE id = ?', [reply.id])
    if (reply.status === 'visible') await run('UPDATE bt_topics SET reply_count = GREATEST(reply_count, 1) - 1 WHERE id = ?', [reply.topicId])
    await run("UPDATE bt_reports SET resolved_at = ? WHERE target = 'reply' AND target_id = ? AND resolved_at IS NULL", [sqlDate(), reply.id])
  })
}

/** Masque ou réaffiche un message ; les signalements le concernant sont classés. */
export async function setPostStatus(target: 'topic' | 'reply', id: number, status: PostStatus) {
  if (target === 'topic') {
    await execute('UPDATE bt_topics SET status = ? WHERE id = ?', [status, id])
  } else {
    const reply = await getReply(id)
    if (!reply || reply.status === status) return
    await transaction(async (run) => {
      await run('UPDATE bt_replies SET status = ? WHERE id = ?', [status, id])
      await run(
        status === 'hidden'
          ? 'UPDATE bt_topics SET reply_count = GREATEST(reply_count, 1) - 1 WHERE id = ?'
          : 'UPDATE bt_topics SET reply_count = reply_count + 1 WHERE id = ?',
        [reply.topicId],
      )
    })
  }
  if (status === 'hidden') await resolveReports(target, id)
}

export async function deletePost(target: 'topic' | 'reply', id: number) {
  if (target === 'topic') {
    await execute('DELETE FROM bt_topics WHERE id = ?', [id])
    await resolveReports('topic', id)
  } else {
    const reply = await getReply(id)
    if (reply) await removeReply(reply)
  }
}

export async function resolveReports(target: 'topic' | 'reply', id: number) {
  await execute('UPDATE bt_reports SET resolved_at = ? WHERE target = ? AND target_id = ? AND resolved_at IS NULL', [sqlDate(), target, id])
}

export type OpenReport = {
  target: 'topic' | 'reply'
  targetId: number
  reasons: string[]
  count: number
  firstAt: Date
  topicId: number
  topicTitle: string
  body: string
  status: PostStatus
  author: Author
}

/** Signalements en attente, regroupés par message, avec le message concerné. */
export async function openReports(): Promise<OpenReport[]> {
  const rows = await select(
    `SELECT target, target_id, GROUP_CONCAT(reason SEPARATOR '\\n') AS reasons, COUNT(*) AS n, MIN(created_at) AS first_at
     FROM bt_reports WHERE resolved_at IS NULL GROUP BY target, target_id ORDER BY first_at ASC LIMIT 100`,
  )
  const reports: OpenReport[] = []
  for (const r of rows) {
    const target = r.target as 'topic' | 'reply'
    const targetId = Number(r.target_id)
    let found: { topicId: number; topicTitle: string; body: string; status: PostStatus; author: Author } | undefined
    if (target === 'topic') {
      const data = await getTopic(targetId, { withHidden: true })
      if (data) found = { topicId: data.topic.id, topicTitle: data.topic.title, body: data.topic.body, status: data.topic.status, author: data.topic.author }
    } else {
      const reply = await getReply(targetId)
      const [topic] = reply ? await select('SELECT title FROM bt_topics WHERE id = ?', [reply.topicId]) : []
      if (reply && topic) found = { topicId: reply.topicId, topicTitle: String(topic.title), body: reply.body, status: reply.status, author: reply.author }
    }
    if (!found) {
      // Message déjà supprimé : signalement sans objet.
      await resolveReports(target, targetId)
      continue
    }
    reports.push({ target, targetId, reasons: String(r.reasons ?? '').split('\n').filter(Boolean), count: Number(r.n), firstAt: new Date(r.first_at), ...found })
  }
  return reports
}

export type RecentPost = {
  target: 'topic' | 'reply'
  id: number
  topicId: number
  topicTitle: string
  body: string
  status: PostStatus
  createdAt: Date
  author: Author
  /** Pour un sujet : projet, ou groupe dans lequel il a été ouvert. */
  project?: boolean
  groupName?: string
}

/** Derniers messages publiés (sujets et réponses mêlés), pour la modération. */
export async function recentPosts(limit = 30): Promise<RecentPost[]> {
  const topics = await select(`SELECT ${TOPIC_COLUMNS} FROM ${TOPIC_FROM} ORDER BY t.created_at DESC LIMIT ?`, [limit])
  const replies = await select(
    `SELECT ${REPLY_COLUMNS}, t.title AS topic_title FROM bt_replies r JOIN bt_topics t ON t.id = r.topic_id
     LEFT JOIN bt_members m ON m.id = r.member_id ORDER BY r.created_at DESC LIMIT ?`,
    [limit],
  )
  const posts: RecentPost[] = [
    ...topics.map((r) => {
      const t = toTopic(r)
      return {
        target: 'topic' as const,
        id: t.id,
        topicId: t.id,
        topicTitle: t.title,
        body: t.body,
        status: t.status,
        createdAt: t.createdAt,
        author: t.author,
        project: Boolean(t.project),
        ...(t.group ? { groupName: t.group.name } : {}),
      }
    }),
    ...replies.map((r) => {
      const reply = toReply(r)
      return { target: 'reply' as const, id: reply.id, topicId: reply.topicId, topicTitle: String(r.topic_title), body: reply.body, status: reply.status, createdAt: reply.createdAt, author: reply.author }
    }),
  ]
  return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit)
}

/**
 * Ce qui attend une action dans l'onglet Communauté (messages signalés, groupes à valider), pour la pastille du menu.
 * Jamais bloquant : 0 si la base tarde.
 */
export async function communityTodoCount() {
  if (!dbConfigured()) return 0
  const count = select(
    `SELECT (SELECT COUNT(DISTINCT target, target_id) FROM bt_reports WHERE resolved_at IS NULL)
       + (SELECT COUNT(*) FROM bt_groups WHERE status = 'pending') AS n`,
  ).then(([r]) => Number(r?.n ?? 0))
  const timeout = new Promise<number>((resolve) => setTimeout(() => resolve(0), 1500))
  return Promise.race([count, timeout]).catch(() => 0)
}

export async function communityStats() {
  const [members] = await select(
    `SELECT SUM(status = 'active') AS active, SUM(status = 'pending') AS pending, SUM(status = 'blocked') AS blocked FROM bt_members`,
  )
  const [topics] = await select("SELECT COUNT(*) AS n, SUM(status = 'hidden') AS hidden FROM bt_topics")
  const [replies] = await select('SELECT COUNT(*) AS n FROM bt_replies')
  const [reports] = await select('SELECT COUNT(DISTINCT target, target_id) AS n FROM bt_reports WHERE resolved_at IS NULL')
  const [projects] = await select("SELECT COUNT(*) AS n, SUM(status = 'open') AS open FROM bt_projects")
  const [groups] = await select("SELECT SUM(status = 'active') AS active, SUM(status = 'pending') AS pending FROM bt_groups")
  return {
    activeMembers: Number(members?.active ?? 0),
    pendingMembers: Number(members?.pending ?? 0),
    blockedMembers: Number(members?.blocked ?? 0),
    topics: Number(topics?.n ?? 0),
    hiddenTopics: Number(topics?.hidden ?? 0),
    replies: Number(replies?.n ?? 0),
    openReports: Number(reports?.n ?? 0),
    projects: Number(projects?.n ?? 0),
    openProjects: Number(projects?.open ?? 0),
    activeGroups: Number(groups?.active ?? 0),
    pendingGroups: Number(groups?.pending ?? 0),
  }
}

export type MemberAdminRow = {
  id: number
  email: string
  name: string
  fullName: string
  detail: string
  status: 'pending' | 'active' | 'blocked'
  createdAt: Date
  lastLoginAt: Date | null
  topics: number
  replies: number
}

/** Membres, les plus récents d'abord, filtrés par statut ou par recherche (nom, e-mail). */
export async function listMembers({ q = '', status = '' }: { q?: string; status?: string }) {
  const where: string[] = []
  const params: unknown[] = []
  if (['pending', 'active', 'blocked'].includes(status)) {
    where.push('m.status = ?')
    params.push(status)
  }
  if (q.trim()) {
    const like = `%${q.trim().replace(/[\\%_]/g, (c) => `\\${c}`)}%`
    where.push('(m.email LIKE ? OR m.first_name LIKE ? OR m.last_name LIKE ? OR m.activity LIKE ? OR m.city LIKE ?)')
    params.push(like, like, like, like, like)
  }
  const rows = await select(
    `SELECT m.*, (SELECT COUNT(*) FROM bt_topics t WHERE t.member_id = m.id) AS topic_count,
       (SELECT COUNT(*) FROM bt_replies r WHERE r.member_id = m.id) AS reply_count
     FROM bt_members m ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY m.created_at DESC LIMIT 200`,
    params,
  )
  return rows.map(
    (r): MemberAdminRow => ({
      id: Number(r.id),
      email: String(r.email),
      name: publicName(String(r.first_name), String(r.last_name)),
      fullName: `${r.first_name} ${r.last_name}`,
      detail: authorDetail(String(r.activity ?? ''), String(r.city ?? '')),
      status: r.status as MemberAdminRow['status'],
      createdAt: new Date(r.created_at),
      lastLoginAt: r.last_login_at ? new Date(r.last_login_at) : null,
      topics: Number(r.topic_count),
      replies: Number(r.reply_count),
    }),
  )
}

/** Suspend ou rétablit un compte ; un compte suspendu est déconnecté partout. */
export async function setMemberStatus(id: number, status: 'active' | 'blocked') {
  await transaction(async (run) => {
    await run("UPDATE bt_members SET status = ? WHERE id = ? AND status <> 'pending'", [status, id])
    if (status === 'blocked') await run('DELETE FROM bt_tokens WHERE member_id = ?', [id])
  })
}
