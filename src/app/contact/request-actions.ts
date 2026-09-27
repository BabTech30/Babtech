'use server'

import { BUDGETS, NEEDS } from '@/data/requests'
import { limiter } from '@/lib/limits'
import { mailConfigured } from '@/lib/mail'
import { receiveRequest } from '@/lib/requests'
import { site } from '@/lib/site'
import { visitorAddress } from '@/lib/visitor'

/**
 * Formulaire de contact (et envoi final de l'assistant IA) : la demande arrive dans l'onglet « Demandes »
 * du tableau de bord et sur contact@babtech.fr ; la personne reçoit un accusé de réception.
 */
export type RequestFormState = { ok?: boolean; receipt?: boolean; error?: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Au plus 5 demandes par heure depuis une même connexion, 100 par jour au total. */
const limit = limiter({ perVisitor: 5, windowMs: 3_600_000, perDay: 100 })

export async function sendRequest(_prev: RequestFormState, formData: FormData): Promise<RequestFormState> {
  const field = (name: string, max: number) => String(formData.get(name) ?? '').trim().slice(0, max)
  // Champs d'une ligne (nom, ville…) : jamais de retour à la ligne, ils finissent dans l'objet des e-mails.
  const line = (name: string, max: number) => field(name, max).replace(/\s+/g, ' ')
  // Champ invisible rempli : c'est un robot. On ne lui dit rien de plus.
  if (field('site_web', 200)) return { error: "L'envoi n'a pas pu aboutir." }

  const source = line('source', 20) === 'assistant' ? 'assistant' : 'contact'
  const name = line('nom', 80)
  const email = line('email', 160).toLowerCase()
  const phone = line('telephone', 30)
  if (name.length < 2) return { error: 'Indique ton nom.' }
  if (!EMAIL.test(email)) return { error: 'Ton adresse e-mail semble incomplète.' }

  let message: string
  let details: string | undefined
  let need: string | undefined
  if (source === 'assistant') {
    const project = field('projet', 1500)
    const answers = field('precisions', 2000)
    if (project.length < 3) return { error: 'Décris ton projet en quelques mots.' }
    message = answers ? `${project}\n\nPrécisions : ${answers}` : project
    details = field('synthese_ia', 3000) || undefined
  } else {
    need = NEEDS.find((n) => n.value === line('besoin', 40))?.label
    message = field('message', 3000)
    if (!need) return { error: 'Choisis la catégorie de ton besoin.' }
    if (message.length < 3) return { error: 'Écris-moi quelques mots sur ton besoin.' }
  }

  if (!limit.take(await visitorAddress())) {
    return { error: `Trop d'envois d'un coup. Écris-moi directement à ${site.email}.` }
  }
  const budget = line('budget', 40)
  const delivered = await receiveRequest({
    source,
    name,
    email,
    ...(phone ? { phone } : {}),
    ...(line('entreprise', 120) ? { company: line('entreprise', 120) } : {}),
    ...(line('ville', 80) ? { city: line('ville', 80) } : {}),
    ...(BUDGETS.includes(budget) ? { budget } : {}),
    ...(need ? { need } : {}),
    message,
    ...(details ? { details } : {}),
  })
  if (!delivered) return { error: `L'envoi n'a pas fonctionné. Réessaie dans un instant ou écris-moi directement à ${site.email}.` }
  return { ok: true, receipt: mailConfigured() }
}
