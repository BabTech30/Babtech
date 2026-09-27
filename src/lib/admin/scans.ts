import { createHash } from 'node:crypto'
import type { QrCodeName } from '@/data/qr'
import { currentMonth } from './format'
import { type AdminStore, updateStore } from './store'

/**
 * Compteur de scans des QR codes. Rien de personnel n'est enregistré : seulement « tel code, tel mois,
 * +1 ». Un même visiteur qui rescanne dans la demi-heure n'est compté qu'une fois (empreinte de son
 * adresse IP et de son navigateur, gardée en mémoire, jamais écrite sur le disque), et les robots
 * (aperçus de liens, moteurs) sont ignorés.
 */
const BOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|skype|embedly|curl|wget|python|java\/|go-http|headless|lighthouse/i
const DEDUPE_MS = 30 * 60_000
const recent = new Map<string, number>()

export function isBot(userAgent: string) {
  return !userAgent || BOTS.test(userAgent)
}

/**
 * Empreinte du visiteur, pour ne pas compter deux fois le même scan. La première adresse de
 * X-Forwarded-For est celle du téléphone, même derrière plusieurs relais (CDN, proxy d'Hostinger).
 */
export function visitorKey(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip')
  if (!ip) return undefined
  return createHash('sha256').update(`${ip}|${request.headers.get('user-agent') ?? ''}`).digest('base64url')
}

/** `visitor` : empreinte du visiteur (voir visitorKey) ; sans elle, chaque scan compte. */
export async function countScan(code: QrCodeName, visitor?: string) {
  if (visitor) {
    const now = Date.now()
    const key = `${code}|${visitor}`
    if (now - (recent.get(key) ?? 0) < DEDUPE_MS) return
    if (recent.size > 5000) recent.clear()
    recent.set(key, now)
  }
  const month = currentMonth()
  await updateStore((store) => {
    const byCode = (store.scans[month] ??= {})
    byCode[code] = (byCode[code] ?? 0) + 1
  })
}

/** Mois précédent (AAAA-MM). */
export function previousMonth(month: string) {
  const [y, m] = month.split('-').map(Number)
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`
}

/** Scans d'un code : ce mois-ci, le mois dernier, depuis le début. */
export function scanStats(scans: AdminStore['scans'], code: string) {
  const month = currentMonth()
  return {
    month: scans[month]?.[code] ?? 0,
    previous: scans[previousMonth(month)]?.[code] ?? 0,
    total: Object.values(scans).reduce((sum, byCode) => sum + (byCode[code] ?? 0), 0),
  }
}
