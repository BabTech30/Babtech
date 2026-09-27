/**
 * Installation du tableau de bord comme application : le navigateur (Chrome, Edge, Android) propose
 * l'installation par l'évènement « beforeinstallprompt », capté dès l'ouverture de l'espace /admin et
 * gardé ici pour les boutons « Installer ».
 */
export type InstallPrompt = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: InstallPrompt | null = null
const listeners = new Set<() => void>()

export function setInstallPrompt(event: InstallPrompt | null) {
  deferred = event
  listeners.forEach((listener) => listener())
}

export const installPrompt = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => void listeners.delete(listener)
  },
  get: () => deferred,
  getServer: () => null,
}

/** Lance la boîte d'installation du navigateur. */
export async function install() {
  if (!deferred) return
  await deferred.prompt()
  await deferred.userChoice
  setInstallPrompt(null)
}

export type Platform = 'installed' | 'ios' | 'mac-safari' | 'other' | 'unknown'

/** Où tourne le tableau de bord : déjà installé, iPhone/iPad, Safari sur Mac, ou autre navigateur. */
export function detectPlatform(): Platform {
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
  if (standalone) return 'installed'
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'ios'
  if (/macintosh/i.test(ua) && /safari/i.test(ua) && !/chrome|chromium|edg|firefox/i.test(ua)) return 'mac-safari'
  return 'other'
}

export const noSubscribe = () => () => {}
