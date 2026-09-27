'use client'

import { useEffect } from 'react'
import { type InstallPrompt, setInstallPrompt } from './pwa'

/** Enregistre le service worker de /admin/ et garde la proposition d'installation du navigateur. */
export function AdminPwa() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/admin/sw.js', { scope: '/admin/' }).catch((error) => console.warn('Service worker non installé', error))
    }
    const onPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPrompt)
    }
    const onInstalled = () => setInstallPrompt(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])
  return null
}
