'use server'

import { revalidatePath } from 'next/cache'
import { type InboxRequest, type RequestStatus, STATUSES } from '@/data/requests'
import { requireAdmin } from '@/lib/admin/auth'
import { readStore, updateStore } from '@/lib/admin/store'
import { testMail } from '@/lib/emails'
import { MAIL_FROM, mailConfigured, mailProblem, sendMails } from '@/lib/mail'
import { purgeOldRequests } from '@/lib/requests'
import type { FormState } from './actions'

/** Actions de l'onglet « Demandes » et du test d'e-mail (toutes réservées à la personne connectée). */
const PAGE = '/admin/demandes/'

async function change(id: string, apply: (request: InboxRequest) => void) {
  try {
    await updateStore((store) => {
      purgeOldRequests(store)
      const request = store.requests.find((r) => r.id === id)
      if (!request) return
      apply(request)
      request.updatedAt = new Date().toISOString()
    })
  } catch (error) {
    console.error('demandes : modification non enregistrée', error)
  }
  // Le compteur du menu fait partie de la mise en page : on la rafraîchit aussi.
  revalidatePath('/admin', 'layout')
}

export async function setRequestStatus(formData: FormData) {
  await requireAdmin()
  const status = String(formData.get('status') ?? '') as RequestStatus
  if (!STATUSES.some((s) => s.value === status)) return
  await change(String(formData.get('id') ?? ''), (r) => {
    r.status = status
  })
}

export async function saveRequestNote(formData: FormData) {
  await requireAdmin()
  const note = String(formData.get('note') ?? '').trim().slice(0, 2000)
  await change(String(formData.get('id') ?? ''), (r) => {
    if (note) r.note = note
    else delete r.note
  })
}

export async function deleteRequest(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') ?? '')
  try {
    await updateStore((store) => {
      store.requests = store.requests.filter((r) => r.id !== id)
    })
  } catch (error) {
    console.error('demandes : suppression non enregistrée', error)
  }
  revalidatePath('/admin', 'layout')
  revalidatePath(PAGE)
}

/** Réglages → E-mails : un e-mail de test vers ta boîte. */
export async function sendTestMail(): Promise<FormState> {
  await requireAdmin()
  if (!mailConfigured()) {
    return { error: `Envoi pas encore configuré : ajoute la variable SMTP_PASSWORD (mot de passe de la boîte ${MAIL_FROM}) dans hPanel, puis redéploie.` }
  }
  const [sent] = await sendMails([testMail()])
  revalidatePath('/admin/reglages/')
  if (sent) return { ok: `E-mail de test envoyé à ${MAIL_FROM} : regarde ta boîte de réception.` }
  const { mailLast } = await readStore()
  return { error: `Échec de l'envoi : ${mailProblem(mailLast?.code ?? 'ERREUR')}` }
}
