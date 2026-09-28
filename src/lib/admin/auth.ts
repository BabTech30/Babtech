import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { hashPassword, verifyPassword } from '@/lib/password'
import { readStore, updateStore } from './store'

/**
 * Connexion à l'espace /admin.
 * - Identifiant et mot de passe de départ : variables d'environnement ADMIN_USERNAME et ADMIN_PASSWORD,
 *   saisies dans hPanel (jamais dans le code : le dépôt GitHub est public).
 * - Un mot de passe changé dans les réglages est enregistré haché (scrypt) et remplace celui de hPanel.
 * - Session : cookie signé (HMAC), HttpOnly, 7 jours, invalidé par un changement de mot de passe.
 * - 5 essais ratés par adresse IP → blocage de 15 minutes ; au-delà de 30 essais ratés en 15 minutes,
 *   toutes les connexions sont suspendues (au cas où l'adresse IP serait falsifiée).
 */
export const LOGIN_PATH = '/admin/connexion/'
export const MIN_PASSWORD_LENGTH = 12
export const MAX_PASSWORD_LENGTH = 256

const COOKIE = 'babtech_admin'
const SESSION_DAYS = 7

/** Comparaison à durée constante de deux textes. */
function sameText(a: string, b: string) {
  return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest())
}

export function adminUsername() {
  return process.env.ADMIN_USERNAME?.trim() ?? ''
}

/** Mot de passe de départ saisi dans hPanel, sans les espaces ajoutés par erreur au début ou à la fin (clavier du téléphone). */
function initialPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? ''
}

/** Le compte est prêt quand l'identifiant existe et qu'un mot de passe est connu (réglages ou hPanel). */
export async function isConfigured() {
  if (!adminUsername()) return false
  return Boolean((await readStore()).passwordHash || initialPassword())
}

export async function passwordChanged() {
  return Boolean((await readStore()).passwordHash)
}

export async function checkPassword(password: string) {
  const { passwordHash } = await readStore()
  if (passwordHash) return verifyPassword(password, passwordHash)
  const initial = initialPassword()
  return initial ? sameText(password, initial) : false
}

export async function checkCredentials(username: string, password: string) {
  const expected = adminUsername()
  // Identifiant sans distinction de majuscules : un téléphone met souvent une majuscule à la première lettre.
  const userOk = expected !== '' && sameText(username.trim().toLowerCase(), expected.toLowerCase())
  const passOk = await checkPassword(password)
  return userOk && passOk
}

export async function setPassword(password: string) {
  const hash = await hashPassword(password)
  await updateStore((store) => {
    store.passwordHash = hash
    store.sessionVersion = (store.sessionVersion || 1) + 1
  })
}

/* ---------- Session ---------- */

let memorySecret: string | undefined

async function sessionSecret() {
  const fromEnv = process.env.ADMIN_SESSION_SECRET
  if (fromEnv && fromEnv.length >= 32) return fromEnv
  const { sessionSecret: saved } = await readStore()
  if (saved) return saved
  const fresh = randomBytes(32).toString('base64url')
  try {
    return (await updateStore((store) => void (store.sessionSecret ??= fresh))).sessionSecret ?? fresh
  } catch {
    // Données non enregistrables : secret gardé en mémoire (reconnexion après un redémarrage).
    memorySecret ??= fresh
    return memorySecret
  }
}

const sign = (secret: string, payload: string) => createHmac('sha256', secret).update(payload).digest('base64url')

export async function startSession() {
  const { sessionVersion } = await readStore()
  const expires = Date.now() + SESSION_DAYS * 86_400_000
  const payload = Buffer.from(JSON.stringify({ exp: expires, v: sessionVersion })).toString('base64url')
  const jar = await cookies()
  jar.set(COOKIE, `${payload}.${sign(await sessionSecret(), payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    expires: new Date(expires),
  })
}

export async function endSession() {
  const jar = await cookies()
  jar.set(COOKIE, '', { path: '/admin', maxAge: 0 })
}

export async function hasSession() {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false
  const expected = Buffer.from(sign(await sessionSecret(), payload))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false
  try {
    const { exp, v } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp: unknown; v: unknown }
    return typeof exp === 'number' && exp > Date.now() && v === (await readStore()).sessionVersion
  } catch {
    return false
  }
}

/** À appeler en tête de chaque page et action protégée. */
export async function requireAdmin() {
  if (!(await hasSession())) redirect(LOGIN_PATH)
}

/* ---------- Limite d'essais ---------- */

const WINDOW_MS = 15 * 60_000
const MAX_FAILURES = 5
const MAX_FAILURES_ALL = 30
const failures = new Map<string, { count: number; since: number }>()
const ALL = '*'

/** Adresse du visiteur : la dernière de X-Forwarded-For, ajoutée par le proxy d'Hostinger (les précédentes se falsifient). */
export async function clientKey() {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',').pop()?.trim() || h.get('x-real-ip') || 'inconnu'
}

function count(key: string) {
  const entry = failures.get(key)
  if (!entry) return 0
  if (Date.now() - entry.since > WINDOW_MS) {
    failures.delete(key)
    return 0
  }
  return entry.count
}

export function isLocked(key: string) {
  return count(key) >= MAX_FAILURES || count(ALL) >= MAX_FAILURES_ALL
}

export function noteFailure(key: string) {
  if (failures.size > 5000) failures.clear()
  for (const k of [key, ALL]) {
    const now = Date.now()
    const entry = failures.get(k)
    if (!entry || now - entry.since > WINDOW_MS) failures.set(k, { count: 1, since: now })
    else entry.count += 1
  }
}

export function clearFailures(key: string) {
  failures.delete(key)
}
