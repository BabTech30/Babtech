'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adminTasks, METRICS } from '@/data/admin'
import {
  checkCredentials,
  checkPassword,
  clearFailures,
  clientKey,
  endSession,
  hasSession,
  isConfigured,
  isLocked,
  LOGIN_PATH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  noteFailure,
  setPassword,
  startSession,
} from '@/lib/admin/auth'
import { currentMonth, formatMonth, todayInParis } from '@/lib/admin/format'
import { type Kpi, updateStore } from '@/lib/admin/store'

export type FormState = { error?: string; ok?: string }

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const WRITE_ERROR = "Enregistrement impossible : le serveur refuse l'écriture des données (voir Réglages)."

async function guard() {
  if (!(await hasSession())) redirect(LOGIN_PATH)
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const key = await clientKey()
  if (isLocked(key)) return { error: "Trop d'essais ratés. Réessaie dans 15 minutes." }
  if (!(await isConfigured())) {
    return { error: 'Compte non configuré : ajoute ADMIN_USERNAME et ADMIN_PASSWORD dans hPanel, puis redéploie.' }
  }
  const username = String(formData.get('username') ?? '').slice(0, 200)
  const password = String(formData.get('password') ?? '').slice(0, MAX_PASSWORD_LENGTH)
  if (!(await checkCredentials(username, password))) {
    noteFailure(key)
    await pause(600)
    return { error: 'Identifiant ou mot de passe incorrect.' }
  }
  clearFailures(key)
  await startSession()
  redirect('/admin/')
}

export async function logout() {
  await endSession()
  redirect(LOGIN_PATH)
}

/** Coche ou décoche une de tes tâches (celles de Claude sont tenues à jour dans src/data/admin.ts). */
export async function toggleTask(formData: FormData) {
  await guard()
  const id = String(formData.get('id') ?? '')
  const task = adminTasks.find((t) => t.id === id)
  if (!task || task.owner !== 'toi' || task.auto) return
  try {
    await updateStore((store) => {
      store.tasks[id] = { done: !(store.tasks[id]?.done ?? Boolean(task.done)), at: todayInParis() }
    })
  } catch (error) {
    console.error('admin : coche non enregistrée', error)
  }
  revalidatePath('/admin/')
}

export async function saveKpis(_prev: FormState, formData: FormData): Promise<FormState> {
  await guard()
  const month = String(formData.get('month') ?? '')
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return { error: 'Choisis le mois à enregistrer.' }
  if (month > currentMonth()) return { error: "Ce mois n'est pas encore commencé." }
  const kpi: Kpi = { month, updatedAt: todayInParis() }
  let filled = 0
  for (const metric of METRICS) {
    const raw = String(formData.get(metric.key) ?? '').trim()
    if (!raw) continue
    const value = Number(raw.replace(',', '.'))
    if (!Number.isFinite(value) || value < 0) return { error: `« ${metric.label} » : saisis un nombre positif.` }
    kpi[metric.key] = Math.round(value)
    filled += 1
  }
  if (!filled) return { error: 'Saisis au moins un chiffre.' }
  const note = String(formData.get('note') ?? '').trim().slice(0, 280)
  if (note) kpi.note = note
  try {
    await updateStore((store) => {
      store.kpis[month] = kpi
    })
  } catch {
    return { error: WRITE_ERROR }
  }
  revalidatePath('/admin/')
  return { ok: `Chiffres de ${formatMonth(month)} enregistrés.` }
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  await guard()
  const current = String(formData.get('current') ?? '').slice(0, MAX_PASSWORD_LENGTH)
  const next = String(formData.get('next') ?? '')
  const confirm = String(formData.get('confirm') ?? '')
  if (!(await checkPassword(current))) {
    await pause(600)
    return { error: 'Mot de passe actuel incorrect.' }
  }
  if (next.length < MIN_PASSWORD_LENGTH) {
    return { error: `Le nouveau mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.` }
  }
  if (next.length > MAX_PASSWORD_LENGTH) return { error: `Le nouveau mot de passe doit contenir au plus ${MAX_PASSWORD_LENGTH} caractères.` }
  if (next !== confirm) return { error: 'Les deux saisies du nouveau mot de passe sont différentes.' }
  if (next === current) return { error: "Choisis un mot de passe différent de l'actuel." }
  try {
    await setPassword(next)
  } catch {
    return { error: WRITE_ERROR }
  }
  await startSession()
  revalidatePath('/admin/')
  return { ok: 'Mot de passe changé. Il remplace celui de hPanel.' }
}
