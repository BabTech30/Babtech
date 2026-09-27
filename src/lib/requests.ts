import { randomBytes } from 'node:crypto'
import { after } from 'next/server'
import { type InboxRequest, RETENTION_DAYS, SOURCE_LABELS } from '@/data/requests'
import { notifyDevices } from '@/lib/admin/push'
import { type AdminStore, updateStore } from '@/lib/admin/store'
import { requestAlert, requestReceipt } from '@/lib/emails'
import { sendMails } from '@/lib/mail'

/** Réception des demandes du site : rangées dans le tableau de bord, puis annoncées (notification, e-mails). */
export type NewRequest = Omit<InboxRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'note'>

/** Efface les demandes dont la durée de conservation est passée (à appeler dans chaque écriture qui y touche). */
export function purgeOldRequests(store: AdminStore, now = Date.now()) {
  store.requests = store.requests.filter((r) => Date.parse(r.updatedAt) >= now - RETENTION_DAYS[r.source] * 86_400_000)
}

/** Vrai si la demande est arrivée à bon port : enregistrée, ou à défaut partie par e-mail. */
export async function receiveRequest(input: NewRequest) {
  const now = new Date().toISOString()
  const request: InboxRequest = { ...input, id: randomBytes(9).toString('base64url'), status: 'new', createdAt: now, updatedAt: now }
  try {
    await updateStore((store) => {
      purgeOldRequests(store)
      store.requests.push(request)
    })
  } catch (error) {
    // Sans enregistrement, l'e-mail est le seul filet : il part tout de suite, et la demande n'est confirmée que s'il est parti.
    console.error('demande : enregistrement impossible', error)
    const [alerted] = await sendMails([requestAlert(request), requestReceipt(request)])
    return alerted
  }
  after(() => announce(request))
  return true
}

async function announce(r: InboxRequest) {
  const title = r.source === 'communaute' ? 'Nouveau membre fondateur' : 'Nouvelle demande'
  const results = await Promise.allSettled([
    notifyDevices({ title, body: `${r.name}${r.company ? ` (${r.company})` : ''} · ${r.need ?? SOURCE_LABELS[r.source]}`, url: '/admin/demandes/', tag: `demande-${r.id}` }),
    sendMails([requestAlert(r), requestReceipt(r)]),
  ])
  for (const result of results) if (result.status === 'rejected') console.error('demande : alerte non envoyée', result.reason)
}
