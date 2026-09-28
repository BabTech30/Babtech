import { createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { publicName } from '@/data/forum'
import { dbConfigured, dbErrorCode, execute, type Row, select, sqlDate, transaction } from '@/lib/db'
import { hashPassword } from '@/lib/password'

/**
 * Comptes des membres de la communauté (table bt_members) : création, confirmation de l'adresse e-mail,
 * connexion par cookie de session, mot de passe, suppression. Les jetons (confirmation, nouveau mot de passe,
 * session) ne sont enregistrés que hachés : une fuite de la base ne permet pas de s'en servir.
 */
export type MemberStatus = 'pending' | 'active' | 'blocked'

export type Member = {
  id: number
  email: string
  firstName: string
  lastName: string
  activity: string
  city: string
  status: MemberStatus
  notifyReplies: boolean
  createdAt: Date
  verifiedAt: Date | null
  lastLoginAt: Date | null
}

export type TokenKind = 'verify' | 'reset' | 'session'

const COOKIE = 'babtech_membre'
const SESSION_DAYS = 30
/** Durée de validité des liens envoyés par e-mail et des sessions. */
export const TOKEN_TTL: Record<TokenKind, number> = { verify: 48 * 3_600_000, reset: 3_600_000, session: SESSION_DAYS * 86_400_000 }
/** Un compte jamais confirmé est effacé au bout de 7 jours. */
const PENDING_DAYS = 7

const hashToken = (raw: string) => createHash('sha256').update(raw).digest('hex')

function toMember(r: Row): Member {
  return {
    id: Number(r.id),
    email: String(r.email),
    firstName: String(r.first_name),
    lastName: String(r.last_name),
    activity: String(r.activity ?? ''),
    city: String(r.city ?? ''),
    status: r.status as MemberStatus,
    notifyReplies: Boolean(r.notify_replies),
    createdAt: new Date(r.created_at),
    verifiedAt: r.verified_at ? new Date(r.verified_at) : null,
    lastLoginAt: r.last_login_at ? new Date(r.last_login_at) : null,
  }
}

/** Nom affiché sur le forum : « Marie D. ». */
export const displayName = (m: Pick<Member, 'firstName' | 'lastName'>) => publicName(m.firstName, m.lastName)

export const normalizeEmail = (email: string) => email.trim().toLowerCase()

export async function findMemberByEmail(email: string) {
  const [row] = await select('SELECT * FROM bt_members WHERE email = ? LIMIT 1', [normalizeEmail(email)])
  return row ? toMember(row) : undefined
}

export async function findMemberById(id: number) {
  const [row] = await select('SELECT * FROM bt_members WHERE id = ? LIMIT 1', [id])
  return row ? toMember(row) : undefined
}

export async function memberPasswordHash(id: number) {
  const [row] = await select('SELECT password_hash FROM bt_members WHERE id = ? LIMIT 1', [id])
  return row ? String(row.password_hash) : ''
}

export type NewMember = { email: string; password: string; firstName: string; lastName: string; activity: string; city: string }

/** Crée un compte en attente de confirmation. Renvoie undefined si l'adresse est déjà prise. */
export async function createMember(input: NewMember) {
  const now = sqlDate()
  try {
    const result = await execute(
      `INSERT INTO bt_members (email, password_hash, first_name, last_name, activity, city, status, created_at, terms_accepted_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [normalizeEmail(input.email), await hashPassword(input.password), input.firstName, input.lastName, input.activity, input.city, now, now],
    )
    return result.insertId
  } catch (error) {
    if (dbErrorCode(error) === 'ER_DUP_ENTRY') return undefined
    throw error
  }
}

/** Compte confirmé : l'adresse e-mail est prouvée, le membre peut participer. */
export async function activateMember(id: number) {
  await execute("UPDATE bt_members SET status = 'active', verified_at = ? WHERE id = ? AND status = 'pending'", [sqlDate(), id])
}

export async function updateProfile(id: number, p: { firstName: string; lastName: string; activity: string; city: string; notifyReplies: boolean }) {
  await execute('UPDATE bt_members SET first_name = ?, last_name = ?, activity = ?, city = ?, notify_replies = ? WHERE id = ?', [
    p.firstName,
    p.lastName,
    p.activity,
    p.city,
    p.notifyReplies ? 1 : 0,
    id,
  ])
}

/** Nouveau mot de passe : toutes les sessions et tous les liens en cours sont annulés. */
export async function setMemberPassword(id: number, password: string) {
  const hash = await hashPassword(password)
  await transaction(async (run) => {
    await run('UPDATE bt_members SET password_hash = ? WHERE id = ?', [hash, id])
    await run("DELETE FROM bt_tokens WHERE member_id = ? AND kind IN ('session', 'reset')", [id])
  })
}

/* ---------- Jetons (liens envoyés par e-mail, sessions) ---------- */

export async function createToken(memberId: number, kind: TokenKind) {
  const raw = randomBytes(32).toString('base64url')
  const now = Date.now()
  await execute('INSERT INTO bt_tokens (token_hash, member_id, kind, created_at, expires_at) VALUES (?, ?, ?, ?, ?)', [
    hashToken(raw),
    memberId,
    kind,
    sqlDate(new Date(now)),
    sqlDate(new Date(now + TOKEN_TTL[kind])),
  ])
  return raw
}

const validToken = (raw: string) => /^[\w-]{20,100}$/.test(raw)

/** Membre visé par un lien encore valable, sans l'utiliser (pour afficher la page du lien). */
export async function peekToken(raw: string, kind: TokenKind) {
  if (!validToken(raw)) return undefined
  const [row] = await select('SELECT member_id FROM bt_tokens WHERE token_hash = ? AND kind = ? AND expires_at > ? LIMIT 1', [
    hashToken(raw),
    kind,
    sqlDate(),
  ])
  return row ? Number(row.member_id) : undefined
}

/** Utilise un lien : il ne sert qu'une fois. Renvoie le membre concerné, ou undefined si le lien est périmé. */
export async function consumeToken(raw: string, kind: TokenKind) {
  const memberId = await peekToken(raw, kind)
  if (!memberId) return undefined
  const { affectedRows } = await execute('DELETE FROM bt_tokens WHERE token_hash = ? AND kind = ?', [hashToken(raw), kind])
  return affectedRows === 1 ? memberId : undefined
}

export async function deleteTokens(memberId: number, kind: TokenKind) {
  await execute('DELETE FROM bt_tokens WHERE member_id = ? AND kind = ?', [memberId, kind])
}

/** Nombre de liens d'un type envoyés récemment (limite les renvois d'e-mails). */
export async function recentTokens(memberId: number, kind: TokenKind, withinMs: number) {
  const [row] = await select('SELECT COUNT(*) AS n FROM bt_tokens WHERE member_id = ? AND kind = ? AND created_at > ?', [
    memberId,
    kind,
    sqlDate(new Date(Date.now() - withinMs)),
  ])
  return Number(row?.n ?? 0)
}

/* ---------- Session ---------- */

export async function startMemberSession(memberId: number) {
  const raw = await createToken(memberId, 'session')
  const jar = await cookies()
  jar.set(COOKIE, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 86_400,
  })
  await execute('UPDATE bt_members SET last_login_at = ? WHERE id = ?', [sqlDate(), memberId])
}

export async function endMemberSession() {
  const jar = await cookies()
  const raw = jar.get(COOKIE)?.value
  if (raw && validToken(raw) && dbConfigured()) {
    await execute("DELETE FROM bt_tokens WHERE token_hash = ? AND kind = 'session'", [hashToken(raw)]).catch((error) =>
      console.error('communauté : session non effacée', error),
    )
  }
  jar.set(COOKIE, '', { path: '/', maxAge: 0 })
}

/** Membre connecté (compte actif), lu une seule fois par requête. */
export const currentMember = cache(async (): Promise<Member | undefined> => {
  if (!dbConfigured()) return undefined
  const raw = (await cookies()).get(COOKIE)?.value
  if (!raw || !validToken(raw)) return undefined
  try {
    const [row] = await select(
      `SELECT m.* FROM bt_tokens t JOIN bt_members m ON m.id = t.member_id
       WHERE t.token_hash = ? AND t.kind = 'session' AND t.expires_at > ? AND m.status = 'active' LIMIT 1`,
      [hashToken(raw), sqlDate()],
    )
    return row ? toMember(row) : undefined
  } catch (error) {
    console.error('communauté : session illisible', error)
    return undefined
  }
})

/* ---------- Nettoyage ---------- */

/** Efface les liens périmés et les comptes jamais confirmés (appelé de temps en temps, jamais bloquant). */
export async function purgeStale() {
  const now = Date.now()
  await execute('DELETE FROM bt_tokens WHERE expires_at < ?', [sqlDate(new Date(now))])
  await execute("DELETE FROM bt_members WHERE status = 'pending' AND created_at < ?", [sqlDate(new Date(now - PENDING_DAYS * 86_400_000))])
}

/** Supprime un compte. Ses messages restent (signés « Ancien membre »), sauf si `withContent` : ils sont effacés aussi. */
export async function deleteMember(id: number, withContent: boolean) {
  await transaction(async (run) => {
    if (withContent) {
      await run('DELETE FROM bt_topics WHERE member_id = ?', [id])
      await run('DELETE FROM bt_replies WHERE member_id = ?', [id])
      // Les compteurs des sujets touchés sont recalculés (réponses visibles restantes).
      await run(
        `UPDATE bt_topics t SET reply_count = (SELECT COUNT(*) FROM bt_replies r WHERE r.topic_id = t.id AND r.status = 'visible')`,
      )
    }
    await run('DELETE FROM bt_members WHERE id = ?', [id])
  })
}
