import { randomUUID } from 'node:crypto'
import { constants } from 'node:fs'
import { access, mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import type { MetricKey } from '@/data/admin'
import type { Appointment, BookingSettings } from '@/data/booking'

/**
 * Données enregistrées par l'espace /admin : tes coches, tes chiffres du mois, les scans des QR codes,
 * les rendez-vous et ton mot de passe (haché). Un simple fichier JSON sur le serveur, rangé hors du
 * dossier du site pour survivre aux déploiements : ADMIN_DATA_DIR s'il est défini, sinon ~/.babtech-admin.
 */
export type Kpi = { month: string; note?: string; updatedAt: string } & Partial<Record<MetricKey, number>>

/** Appareil abonné aux notifications (format standard PushSubscription du navigateur). */
export type PushDevice = { endpoint: string; keys: { p256dh: string; auth: string }; createdAt: string; label: string }

export type AdminStore = {
  passwordHash?: string
  /** Augmente à chaque changement de mot de passe : les anciennes sessions sont alors refusées. */
  sessionVersion: number
  sessionSecret?: string
  tasks: Record<string, { done: boolean; at: string }>
  kpis: Record<string, Kpi>
  /** Scans des QR codes par mois (AAAA-MM) puis par code : de simples compteurs, aucune donnée personnelle. */
  scans: Record<string, Record<string, number>>
  /** Rendez-vous pris sur /rendez-vous/ (effacés 12 mois après leur date). */
  appointments: Appointment[]
  /** Réglages de la prise de rendez-vous modifiés dans le tableau de bord (sinon, ceux de src/data/booking.ts). */
  booking?: BookingSettings
  /** Notifications : clés propres au serveur et appareils abonnés. */
  push: { vapid?: { publicKey: string; privateKey: string }; devices: PushDevice[] }
  /** Jeton du lien d'agenda privé (abonnement iCal pour ton téléphone). */
  calendarToken?: string
}

const FILE = 'admin.json'
const empty = (): AdminStore => ({ sessionVersion: 1, tasks: {}, kpis: {}, scans: {}, appointments: [], push: { devices: [] } })

type Location = { dir: string; persistent: boolean }
let location: Promise<Location | null> | null = null

/** Premier dossier inscriptible : ADMIN_DATA_DIR, ~/.babtech-admin, puis le dossier du site en dernier recours. */
function dataDir(): Promise<Location | null> {
  location ??= (async () => {
    const candidates: Location[] = [
      ...(process.env.ADMIN_DATA_DIR ? [{ dir: path.resolve(process.env.ADMIN_DATA_DIR), persistent: true }] : []),
      { dir: path.join(os.homedir(), '.babtech-admin'), persistent: true },
      { dir: path.join(process.cwd(), '.babtech-admin'), persistent: false },
    ]
    for (const candidate of candidates) {
      try {
        await mkdir(candidate.dir, { recursive: true, mode: 0o700 })
        await access(candidate.dir, constants.W_OK)
        return candidate
      } catch {
        // dossier suivant
      }
    }
    return null
  })()
  return location
}

async function readFrom(loc: Location): Promise<AdminStore> {
  let raw: string
  try {
    raw = await readFile(path.join(loc.dir, FILE), 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return empty()
    throw error
  }
  const data = JSON.parse(raw) as Partial<AdminStore>
  return {
    ...empty(),
    ...data,
    tasks: data.tasks ?? {},
    kpis: data.kpis ?? {},
    scans: data.scans ?? {},
    appointments: data.appointments ?? [],
    push: { devices: [], ...data.push },
  }
}

/** Lecture pour l'affichage : un fichier absent ou illisible donne des données vides. */
export async function readStore(): Promise<AdminStore> {
  const loc = await dataDir()
  if (!loc) return empty()
  try {
    return await readFrom(loc)
  } catch (error) {
    console.error('admin : lecture des données impossible', error)
    return empty()
  }
}

let queue: Promise<unknown> = Promise.resolve()

/**
 * Modifie les données, une écriture à la fois. Écriture atomique (fichier temporaire puis
 * renommage) : un fichier illisible n'est jamais écrasé, l'erreur remonte.
 */
export function updateStore(change: (store: AdminStore) => void): Promise<AdminStore> {
  const run = queue.then(async () => {
    const loc = await dataDir()
    if (!loc) throw new Error('Aucun dossier inscriptible pour les données du tableau de bord.')
    const store = await readFrom(loc)
    change(store)
    const file = path.join(loc.dir, FILE)
    const tmp = `${file}.${randomUUID()}.tmp`
    await writeFile(tmp, JSON.stringify(store, null, 2), { mode: 0o600 })
    await rename(tmp, file)
    return store
  })
  queue = run.catch(() => undefined)
  return run
}

export async function storageInfo() {
  return dataDir()
}
