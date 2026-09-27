'use client'

import { useEffect, useState, useSyncExternalStore, useTransition } from 'react'
import type { FormState } from '@/app/admin/actions'
import { pushPublicKey, removePushDevice, savePushDevice, sendTestNotification } from '@/app/admin/booking-actions'
import { FormMessage } from './FormMessage'
import { detectPlatform, noSubscribe } from './pwa'

export type PushDeviceView = { endpoint: string; label: string; since: string }

type Support = 'unknown' | 'ok' | 'ios-browser' | 'unsupported'

function detectSupport(): Support {
  if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) return 'ok'
  // Sur iPhone et iPad, les notifications n'existent que dans l'application installée sur l'écran d'accueil.
  return detectPlatform() === 'ios' ? 'ios-browser' : 'unsupported'
}

const readPermission = (): NotificationPermission => ('Notification' in window ? Notification.permission : 'default')

/** Clé publique du serveur (texte base64url) → octets attendus par le navigateur. */
function keyBytes(base64url: string) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(base64url.length / 4) * 4, '=')
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
}

function sameKey(buffer: ArrayBuffer | null, bytes: Uint8Array) {
  if (!buffer || buffer.byteLength !== bytes.length) return false
  const current = new Uint8Array(buffer)
  return current.every((byte, i) => byte === bytes[i])
}

async function currentSubscription() {
  const registration = await navigator.serviceWorker.getRegistration('/admin/')
  return (await registration?.pushManager.getSubscription()) ?? null
}

const BLOCKED =
  "Les notifications sont bloquées pour ce site dans ton navigateur : autorise-les dans les réglages du site (l'icône à gauche de l'adresse), puis recharge la page. Sur iPhone : Réglages → Notifications → BabTech admin."

/** Notifications de nouveaux rendez-vous sur l'appareil utilisé : activer, tester, désactiver. */
export function PushSetup({ devices }: { devices: PushDeviceView[] }) {
  const support = useSyncExternalStore(noSubscribe, detectSupport, () => 'unknown' as const)
  const permission = useSyncExternalStore(noSubscribe, readPermission, () => 'default' as const)
  const [endpoint, setEndpoint] = useState<string | null>(null)
  const [message, setMessage] = useState<FormState>({})
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (support !== 'ok') return
    let alive = true
    currentSubscription()
      .then((subscription) => {
        if (alive) setEndpoint(subscription?.endpoint ?? null)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [support])

  function enable() {
    startTransition(async () => {
      setMessage({})
      try {
        // Demandée en premier, pendant le clic : Safari refuse la demande sinon.
        const answer = await Notification.requestPermission()
        if (answer !== 'granted') {
          setMessage({ error: answer === 'denied' ? BLOCKED : 'Accepte les notifications quand ton navigateur te le demande.' })
          return
        }
        const publicKey = await pushPublicKey()
        if (!publicKey) {
          setMessage({ error: "Le serveur n'a pas pu enregistrer ses clés de notification : voir Réglages, rubrique Données." })
          return
        }
        await navigator.serviceWorker.register('/admin/sw.js', { scope: '/admin/' })
        const registration = await navigator.serviceWorker.ready
        const key = keyBytes(publicKey)
        let subscription = await registration.pushManager.getSubscription()
        if (subscription && !sameKey(subscription.options.applicationServerKey, key)) {
          await subscription.unsubscribe()
          subscription = null
        }
        subscription ??= await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key })
        const result = await savePushDevice(subscription.toJSON())
        if (result.ok) setEndpoint(subscription.endpoint)
        setMessage(result)
      } catch (error) {
        console.error('notifications : abonnement impossible', error)
        setMessage({ error: "Le navigateur a refusé l'abonnement. Réessaie, ou utilise Chrome, Edge, Firefox ou Safari à jour." })
      }
    })
  }

  function disable() {
    startTransition(async () => {
      setMessage({})
      try {
        const subscription = await currentSubscription()
        const target = subscription?.endpoint ?? endpoint
        await subscription?.unsubscribe()
        setEndpoint(null)
        setMessage(target ? await removePushDevice(target) : {})
      } catch {
        setMessage({ error: 'Désactivation impossible pour le moment. Réessaie.' })
      }
    })
  }

  function test() {
    startTransition(async () => {
      setMessage({})
      setMessage(await sendTestNotification())
    })
  }

  function forget(target: string) {
    startTransition(async () => {
      setMessage(await removePushDevice(target))
    })
  }

  if (support === 'unknown') return null
  const active = Boolean(endpoint && devices.some((d) => d.endpoint === endpoint))

  return (
    <div className="mt-3 grid gap-4 text-sm">
      {support === 'ios-browser' ? (
        <p className="text-txt-secondary">
          Sur iPhone et iPad, les notifications ne marchent que dans l&apos;application installée&nbsp;: ajoute d&apos;abord le tableau de bord à
          l&apos;écran d&apos;accueil (Réglages → Application), ouvre-le depuis son icône, puis reviens ici.
        </p>
      ) : support === 'unsupported' ? (
        <p className="text-txt-secondary">Ce navigateur ne sait pas recevoir de notifications. Ouvre le tableau de bord dans Chrome, Edge, Firefox ou Safari.</p>
      ) : active ? (
        <>
          <p className="text-emerald-300">Activées sur cet appareil&nbsp;: une alerte arrive à chaque nouvelle réservation.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={test} disabled={pending} className="btn-secondary btn-sm">
              Envoyer un test
            </button>
            <button
              type="button"
              onClick={disable}
              disabled={pending}
              className="rounded-lg border border-white/[0.12] px-3 py-1.5 text-sm font-medium text-txt-primary hover:border-red-400/50 hover:text-red-200"
            >
              Désactiver sur cet appareil
            </button>
          </div>
        </>
      ) : permission === 'denied' ? (
        <FormMessage state={{ error: BLOCKED }} />
      ) : (
        <>
          <p className="text-txt-secondary">Une alerte sur cet appareil dès qu&apos;un rendez-vous est réservé, même quand l&apos;application est fermée.</p>
          <button type="button" onClick={enable} disabled={pending} className="btn-primary btn-sm justify-self-start">
            {pending ? 'Activation…' : 'Activer les notifications'}
          </button>
        </>
      )}
      <FormMessage state={message} />
      {devices.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[1.5px] text-txt-muted">Appareils prévenus</p>
          <ul className="mt-1">
            {devices.map((d) => (
              <li key={d.endpoint} className="flex items-center justify-between gap-3 border-b border-bord py-2 last:border-0">
                <span className="text-txt-primary">
                  {d.label}
                  {d.endpoint === endpoint && <span className="text-txt-muted"> (cet appareil)</span>}
                  <span className="block text-xs text-txt-muted">depuis le {d.since}</span>
                </span>
                {d.endpoint !== endpoint && (
                  <button type="button" onClick={() => forget(d.endpoint)} disabled={pending} className="text-sm text-txt-secondary underline hover:text-white">
                    Retirer
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
