import { headers } from 'next/headers'

/**
 * Adresse du visiteur, pour limiter les abus (réservations, assistant IA). La première adresse de
 * X-Forwarded-For est celle du visiteur, même derrière le CDN d'Hostinger (la dernière serait celle du
 * relais, commune à tous). Gardée en mémoire le temps de la limite, jamais enregistrée.
 */
export async function visitorAddress() {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'inconnu'
}
