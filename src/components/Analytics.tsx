'use client'

import Script from 'next/script'
import { useEffect } from 'react'

/**
 * Mesure d'audience optionnelle et sans cookie (pas de bandeau de consentement requis) :
 * - Plausible : NEXT_PUBLIC_PLAUSIBLE_DOMAIN (+ NEXT_PUBLIC_PLAUSIBLE_SRC si auto-hébergé)
 * - Umami     : NEXT_PUBLIC_UMAMI_WEBSITE_ID (+ NEXT_PUBLIC_UMAMI_SRC si auto-hébergé)
 * Sans variable définie, rien n'est chargé.
 *
 * Les éléments portant data-track="nom" envoient un événement au clic (RDV, email, téléphone…).
 */
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.outbound-links.js'
const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://cloud.umami.is/script.js'

type TrackWindow = Window & {
  plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  umami?: { track: (event: string, data?: Record<string, string>) => void }
}

export function track(event: string, props?: Record<string, string>) {
  if (typeof window === 'undefined') return
  const w = window as TrackWindow
  w.plausible?.(event, props ? { props } : undefined)
  w.umami?.track(event, props)
}

export function Analytics() {
  useEffect(() => {
    if (!plausibleDomain && !umamiId) return
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]')
      if (el?.dataset.track) track(el.dataset.track, { page: window.location.pathname })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      {plausibleDomain && <Script src={plausibleSrc} data-domain={plausibleDomain} strategy="afterInteractive" />}
      {umamiId && <Script src={umamiSrc} data-website-id={umamiId} strategy="afterInteractive" />}
    </>
  )
}
