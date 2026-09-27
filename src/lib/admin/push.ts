import { generateVAPIDKeys, sendNotification, WebPushError } from 'web-push'
import { site } from '@/lib/site'
import { readStore, updateStore } from './store'

/**
 * Notifications sur tes appareils (tableau de bord installé comme application). Les clés du serveur
 * (VAPID) sont créées au premier besoin et gardées dans les données du tableau de bord, jamais dans le code.
 * Le contenu de chaque notification est chiffré jusqu'à ton appareil.
 */
export type Notice = { title: string; body: string; url: string; tag?: string }

export async function vapidKeys() {
  const { push } = await readStore()
  if (push.vapid) return push.vapid
  const fresh = generateVAPIDKeys()
  const saved = await updateStore((store) => void (store.push.vapid ??= fresh))
  return saved.push.vapid ?? fresh
}

/** Envoie la notification à tous tes appareils abonnés ; ceux qui se sont désabonnés sont retirés. */
export async function notifyDevices(notice: Notice) {
  const { push } = await readStore()
  if (!push.devices.length) return { sent: 0, total: 0 }
  const keys = await vapidKeys()
  const gone: string[] = []
  let sent = 0
  await Promise.all(
    push.devices.map(async (device) => {
      try {
        await sendNotification({ endpoint: device.endpoint, keys: device.keys }, JSON.stringify(notice), {
          vapidDetails: { subject: `mailto:${site.email}`, publicKey: keys.publicKey, privateKey: keys.privateKey },
          TTL: 24 * 3600,
          urgency: 'high',
          timeout: 10_000,
        })
        sent++
      } catch (error) {
        if (error instanceof WebPushError && (error.statusCode === 404 || error.statusCode === 410)) gone.push(device.endpoint)
        else console.error('notification non envoyée', error)
      }
    }),
  )
  if (gone.length) {
    await updateStore((store) => {
      store.push.devices = store.push.devices.filter((d) => !gone.includes(d.endpoint))
    })
  }
  return { sent, total: push.devices.length }
}
