'use client'

import { useSyncExternalStore } from 'react'
import { detectPlatform, install, installPrompt, noSubscribe } from './pwa'

/** Bouton discret dans l'en-tête : visible seulement quand le navigateur peut installer l'application. */
export function InstallButton() {
  const prompt = useSyncExternalStore(installPrompt.subscribe, installPrompt.get, installPrompt.getServer)
  if (!prompt) return null
  return (
    <button type="button" onClick={install} className="rounded-lg bg-emerald-b/15 px-3 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-b/25">
      Installer l&apos;app
    </button>
  )
}

/** Réglages : installer le tableau de bord, ou la marche à suivre selon l'appareil. */
export function InstallApp() {
  const prompt = useSyncExternalStore(installPrompt.subscribe, installPrompt.get, installPrompt.getServer)
  const platform = useSyncExternalStore(noSubscribe, detectPlatform, () => 'unknown' as const)

  if (platform === 'installed') {
    return <p className="mt-2 text-sm text-emerald-300">Le tableau de bord est installé&nbsp;: tu l&apos;utilises en ce moment comme une application.</p>
  }
  return (
    <div className="mt-3 grid gap-3 text-sm text-txt-secondary">
      {prompt && (
        <button type="button" onClick={install} className="btn-primary btn-sm justify-self-start">
          Installer l&apos;application
        </button>
      )}
      {platform === 'ios' && (
        <p>
          Sur iPhone ou iPad&nbsp;: ouvre cette page dans Safari, touche le bouton Partager (le carré avec une flèche), puis «&nbsp;Sur
          l&apos;écran d&apos;accueil&nbsp;».
        </p>
      )}
      {platform === 'mac-safari' && <p>Sur Mac avec Safari&nbsp;: menu Fichier, puis «&nbsp;Ajouter au Dock&nbsp;».</p>}
      {platform === 'other' && !prompt && (
        <p>
          Avec Chrome ou Edge&nbsp;: clique sur l&apos;icône d&apos;installation à droite de la barre d&apos;adresse, ou choisis
          «&nbsp;Installer&nbsp;» dans le menu du navigateur. Firefox ne sait pas encore installer d&apos;application&nbsp;: ouvre le
          tableau de bord dans Chrome ou Edge.
        </p>
      )}
    </div>
  )
}
