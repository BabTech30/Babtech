import { type GroupLevel, GROUPS_PER_PAGE, publicName, TOPICS_PER_PAGE } from '@/data/forum'
import { execute, type Row, select, sqlDate, transaction } from '@/lib/db'
import { type Author, authorDetail, type GroupStatus, PUBLIC_TOPIC, TOPIC_COLUMNS, TOPIC_FROM, toTopic } from './forum'

/**
 * Groupes de la communauté (bt_groups, bt_group_members, bt_group_topics). Un membre propose un groupe, qui
 * n'apparaît qu'une fois validé dans le tableau de bord ; son auteur en devient l'animateur ou l'animatrice.
 * Les échanges du groupe sont des sujets du forum, lisibles par tous, ouverts et commentés par ses membres.
 * On rejoint un groupe en un clic, dans la limite des places (0 = sans limite).
 */
export type GroupRole = 'organizer' | 'member'

export type Group = {
  id: number
  name: string
  description: string
  category: string
  city: string
  level: GroupLevel
  capacity: number
  status: GroupStatus
  createdAt: Date
  lastActivityAt: Date
  /** Auteur de la proposition (l'animateur ou l'animatrice), « Ancien membre » si son compte est supprimé. */
  organizer: Author
  memberCount: number
  topicCount: number
}

export type GroupInput = { name: string; description: string; category: string; city: string; level: GroupLevel; capacity: number }

export type GroupMember = Author & { role: GroupRole; joinedAt: Date }

/** Groupe avec son animateur ou animatrice et ses compteurs ; l'e-mail n'est lu que pour le tableau de bord. */
const groupSelect = ({ withEmail = false } = {}) => `SELECT g.*, m.first_name, m.last_name, m.activity, m.city AS member_city${withEmail ? ', m.email AS member_email' : ''},
    (SELECT COUNT(*) FROM bt_group_members gm WHERE gm.group_id = g.id) AS member_count,
    (SELECT COUNT(*) FROM bt_group_topics gt JOIN bt_topics t ON t.id = gt.topic_id WHERE gt.group_id = g.id AND t.status = 'visible') AS topic_count
  FROM bt_groups g LEFT JOIN bt_members m ON m.id = g.created_by`

function person(r: Row, city: unknown): Author {
  if (r.first_name == null) return { id: null, name: 'Ancien membre', detail: '' }
  return { id: Number(r.member_id ?? r.created_by), name: publicName(String(r.first_name), String(r.last_name)), detail: authorDetail(String(r.activity ?? ''), String(city ?? '')) }
}

function toGroup(r: Row): Group {
  return {
    id: Number(r.id),
    name: String(r.name),
    description: String(r.description),
    category: String(r.category),
    city: String(r.city ?? ''),
    level: r.level as GroupLevel,
    capacity: Number(r.capacity),
    status: r.status as GroupStatus,
    createdAt: new Date(r.created_at),
    lastActivityAt: new Date(r.last_activity_at),
    organizer: person({ ...r, member_id: r.created_by }, r.member_city),
    memberCount: Number(r.member_count),
    topicCount: Number(r.topic_count),
  }
}

/** Places restantes (undefined : sans limite). */
export const placesLeft = (g: Pick<Group, 'capacity' | 'memberCount'>) => (g.capacity ? Math.max(0, g.capacity - g.memberCount) : undefined)

/* ---------- Lecture publique ---------- */

/** Groupes publiés, les plus actifs d'abord. */
export async function listGroups(page: number) {
  const [count] = await select("SELECT COUNT(*) AS n FROM bt_groups WHERE status = 'active'")
  const rows = await select(`${groupSelect()} WHERE g.status = 'active' ORDER BY g.last_activity_at DESC LIMIT ? OFFSET ?`, [
    GROUPS_PER_PAGE,
    (page - 1) * GROUPS_PER_PAGE,
  ])
  return { total: Number(count?.n ?? 0), groups: rows.map(toGroup) }
}

/** Un groupe ; par défaut seulement s'il est publié. */
export async function getGroup(id: number, { withHidden = false } = {}) {
  const [row] = await select(`${groupSelect()} WHERE g.id = ? LIMIT 1`, [id])
  if (!row) return undefined
  const group = toGroup(row)
  return withHidden || group.status === 'active' ? group : undefined
}

/** Membres d'un groupe : l'animateur ou l'animatrice d'abord, puis par ordre d'arrivée. */
export async function groupMembers(groupId: number): Promise<GroupMember[]> {
  const rows = await select(
    `SELECT gm.member_id, gm.role, gm.joined_at, m.first_name, m.last_name, m.activity, m.city
     FROM bt_group_members gm JOIN bt_members m ON m.id = gm.member_id
     WHERE gm.group_id = ? AND m.status = 'active' ORDER BY gm.role = 'organizer' DESC, gm.joined_at ASC`,
    [groupId],
  )
  return rows.map((r) => ({ ...person(r, r.city), role: r.role as GroupRole, joinedAt: new Date(r.joined_at) }))
}

export async function membership(groupId: number, memberId: number) {
  const [row] = await select('SELECT role, notify FROM bt_group_members WHERE group_id = ? AND member_id = ? LIMIT 1', [groupId, memberId])
  return row ? { role: row.role as GroupRole, notify: Boolean(Number(row.notify)) } : undefined
}

/** Sujets visibles d'un groupe, les plus actifs d'abord. */
export async function groupTopics(groupId: number, page = 1) {
  const [count] = await select(`SELECT COUNT(*) AS n FROM ${TOPIC_FROM} WHERE g.id = ? AND ${PUBLIC_TOPIC}`, [groupId])
  const rows = await select(
    `SELECT ${TOPIC_COLUMNS} FROM ${TOPIC_FROM} WHERE g.id = ? AND ${PUBLIC_TOPIC} ORDER BY t.last_activity_at DESC LIMIT ? OFFSET ?`,
    [groupId, TOPICS_PER_PAGE, (page - 1) * TOPICS_PER_PAGE],
  )
  return { total: Number(count?.n ?? 0), topics: rows.map(toTopic) }
}

/** Groupes d'un membre (publiés), et ses propositions en attente de validation. */
export async function memberGroups(memberId: number) {
  const rows = await select(
    `SELECT g.id, g.name, g.status, gm.role FROM bt_groups g JOIN bt_group_members gm ON gm.group_id = g.id
     WHERE gm.member_id = ? AND g.status = 'active' ORDER BY g.name`,
    [memberId],
  )
  const pending = await select("SELECT id, name FROM bt_groups WHERE created_by = ? AND status = 'pending' ORDER BY created_at DESC", [memberId])
  return {
    joined: rows.map((r) => ({ id: Number(r.id), name: String(r.name), role: r.role as GroupRole })),
    pending: pending.map((r) => ({ id: Number(r.id), name: String(r.name) })),
  }
}

/* ---------- Actions des membres ---------- */

/** Proposition d'un groupe : invisible sur le site tant qu'elle n'est pas validée. */
export async function proposeGroup(memberId: number, p: GroupInput) {
  const now = sqlDate()
  const result = await execute(
    `INSERT INTO bt_groups (name, description, category, city, level, capacity, status, created_by, created_at, last_activity_at)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
    [p.name, p.description, p.category, p.city, p.level, p.capacity, memberId, now, now],
  )
  return result.insertId
}

export async function pendingProposals(memberId: number) {
  const [row] = await select("SELECT COUNT(*) AS n FROM bt_groups WHERE created_by = ? AND status = 'pending'", [memberId])
  return Number(row?.n ?? 0)
}

export type JoinResult = 'joined' | 'already' | 'full' | 'unavailable'

/** Rejoindre un groupe publié, s'il reste de la place (vérifié et enregistré d'un seul tenant). */
export async function joinGroup(groupId: number, memberId: number): Promise<JoinResult> {
  return transaction(async (run) => {
    // Lectures dans la transaction : la ligne du groupe est verrouillée jusqu'à l'inscription (pas de dépassement des places).
    const rows = async (sql: string, params: unknown[]) => (await run(sql, params)) as unknown as Row[]
    const [group] = await rows('SELECT status, capacity FROM bt_groups WHERE id = ? FOR UPDATE', [groupId])
    if (!group || group.status !== 'active') return 'unavailable'
    const [existing] = await rows('SELECT 1 AS ok FROM bt_group_members WHERE group_id = ? AND member_id = ?', [groupId, memberId])
    if (existing) return 'already'
    const [count] = await rows('SELECT COUNT(*) AS n FROM bt_group_members WHERE group_id = ?', [groupId])
    if (Number(group.capacity) > 0 && Number(count.n) >= Number(group.capacity)) return 'full'
    await run("INSERT INTO bt_group_members (group_id, member_id, role, notify, joined_at) VALUES (?, ?, 'member', 1, ?)", [groupId, memberId, sqlDate()])
    return 'joined'
  })
}

/** Quitter un groupe (l'animateur ou l'animatrice ne peut pas : le groupe se transmet ou se ferme avec toi). */
export async function leaveGroup(groupId: number, memberId: number) {
  const result = await execute("DELETE FROM bt_group_members WHERE group_id = ? AND member_id = ? AND role = 'member'", [groupId, memberId])
  return result.affectedRows === 1
}

/** E-mail à chaque nouveau sujet du groupe : oui ou non. */
export async function setGroupNotify(groupId: number, memberId: number, notify: boolean) {
  await execute('UPDATE bt_group_members SET notify = ? WHERE group_id = ? AND member_id = ?', [notify ? 1 : 0, groupId, memberId])
}

/** Modification par l'animateur ou l'animatrice ; faux si ce n'est pas son groupe. */
export async function updateGroup(groupId: number, memberId: number, p: GroupInput) {
  const [row] = await select("SELECT 1 AS ok FROM bt_group_members WHERE group_id = ? AND member_id = ? AND role = 'organizer'", [groupId, memberId])
  if (!row) return false
  await execute('UPDATE bt_groups SET name = ?, description = ?, category = ?, city = ?, level = ?, capacity = ? WHERE id = ?', [
    p.name,
    p.description,
    p.category,
    p.city,
    p.level,
    p.capacity,
    groupId,
  ])
  return true
}

/** Nouveau sujet dans un groupe : le sujet, son rattachement au groupe et l'activité du groupe, ensemble. */
export async function createGroupTopic(memberId: number, groupId: number, p: { category: string; title: string; body: string }) {
  const now = sqlDate()
  return transaction(async (run) => {
    const topic = await run(
      `INSERT INTO bt_topics (category, member_id, title, body, status, reply_count, created_at, last_activity_at)
       VALUES (?, ?, ?, ?, 'visible', 0, ?, ?)`,
      [p.category, memberId, p.title, p.body, now, now],
    )
    await run('INSERT INTO bt_group_topics (topic_id, group_id) VALUES (?, ?)', [topic.insertId, groupId])
    await run('UPDATE bt_groups SET last_activity_at = ? WHERE id = ?', [now, groupId])
    return topic.insertId
  })
}

/** Une réponse dans un sujet de groupe rend le groupe actif. */
export async function touchGroupOfTopic(topicId: number) {
  await execute('UPDATE bt_groups g JOIN bt_group_topics gt ON gt.group_id = g.id SET g.last_activity_at = ? WHERE gt.topic_id = ?', [sqlDate(), topicId])
}

/** Membres à prévenir d'un nouveau sujet (e-mails activés, compte actif), sauf son auteur. */
export async function groupRecipients(groupId: number, exceptMemberId: number) {
  const rows = await select(
    `SELECT m.email, m.first_name FROM bt_group_members gm JOIN bt_members m ON m.id = gm.member_id
     WHERE gm.group_id = ? AND gm.notify = 1 AND m.status = 'active' AND m.id <> ?`,
    [groupId, exceptMemberId],
  )
  return rows.map((r) => ({ email: String(r.email), firstName: String(r.first_name) }))
}

/* ---------- Modération (tableau de bord) ---------- */

export type GroupAdminRow = Group & { organizerEmail: string; organizerFullName: string; members: (GroupMember & { email: string })[] }

/** Tous les groupes : à valider d'abord, puis publiés et masqués, avec leurs membres. */
export async function groupsForAdmin(): Promise<GroupAdminRow[]> {
  const rows = await select(
    `${groupSelect({ withEmail: true })}
     ORDER BY g.status = 'pending' DESC, g.status = 'active' DESC, g.last_activity_at DESC LIMIT 200`,
  )
  const members = rows.length
    ? await select(
        `SELECT gm.group_id, gm.member_id, gm.role, gm.joined_at, m.first_name, m.last_name, m.activity, m.city, m.email
         FROM bt_group_members gm JOIN bt_members m ON m.id = gm.member_id
         WHERE gm.group_id IN (?) ORDER BY gm.role = 'organizer' DESC, gm.joined_at ASC`,
        [rows.map((r) => Number(r.id))],
      )
    : []
  return rows.map((r) => ({
    ...toGroup(r),
    organizerEmail: String(r.member_email ?? ''),
    organizerFullName: r.first_name == null ? '' : `${r.first_name} ${r.last_name}`,
    members: members
      .filter((m) => Number(m.group_id) === Number(r.id))
      .map((m) => ({ ...person(m, m.city), role: m.role as GroupRole, joinedAt: new Date(m.joined_at), email: String(m.email) })),
  }))
}

/** Validation : le groupe est publié et son auteur en devient l'animateur ou l'animatrice. */
export async function approveGroup(groupId: number) {
  const now = sqlDate()
  await transaction(async (run) => {
    const result = await run("UPDATE bt_groups SET status = 'active', reviewed_at = ?, last_activity_at = ? WHERE id = ? AND status = 'pending'", [
      now,
      now,
      groupId,
    ])
    if (result.affectedRows !== 1) return
    await run(
      `INSERT IGNORE INTO bt_group_members (group_id, member_id, role, notify, joined_at)
       SELECT id, created_by, 'organizer', 1, ? FROM bt_groups WHERE id = ? AND created_by IS NOT NULL`,
      [now, groupId],
    )
  })
}

/** Refus : la proposition est effacée (son auteur est prévenu par e-mail). */
export async function refuseGroup(groupId: number) {
  const result = await execute("DELETE FROM bt_groups WHERE id = ? AND status = 'pending'", [groupId])
  return result.affectedRows === 1
}

/** Masquer un groupe publié (il disparaît du site, ses sujets aussi) ou le réafficher. */
export async function setGroupVisibility(groupId: number, visible: boolean) {
  await execute('UPDATE bt_groups SET status = ? WHERE id = ? AND status <> ?', [visible ? 'active' : 'hidden', groupId, 'pending'])
}

/** Supprimer un groupe : ses sujets restent sur le forum, sans groupe. */
export async function deleteGroup(groupId: number) {
  await execute('DELETE FROM bt_groups WHERE id = ?', [groupId])
}

export async function removeGroupMember(groupId: number, memberId: number) {
  await execute('DELETE FROM bt_group_members WHERE group_id = ? AND member_id = ?', [groupId, memberId])
}

/** Contact de l'auteur d'une proposition (pour lui écrire après la validation ou le refus). */
export async function groupProposer(groupId: number) {
  const [row] = await select(
    `SELECT g.name, m.email, m.first_name, m.status FROM bt_groups g JOIN bt_members m ON m.id = g.created_by WHERE g.id = ? LIMIT 1`,
    [groupId],
  )
  return row && row.status === 'active' ? { groupName: String(row.name), email: String(row.email), firstName: String(row.first_name) } : undefined
}
