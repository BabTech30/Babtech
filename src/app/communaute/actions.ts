'use server'

import { limiter } from '@/lib/limits'
import { mailConfigured } from '@/lib/mail'
import { receiveRequest } from '@/lib/requests'
import { site } from '@/lib/site'
import { visitorAddress } from '@/lib/visitor'

/** Inscription à la liste des membres fondateurs : rangée dans « Demandes », e-mail de bienvenue à la personne. */
export type JoinState = { ok?: boolean; receipt?: boolean; error?: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const limit = limiter({ perVisitor: 3, windowMs: 3_600_000, perDay: 100 })

export async function joinCommunity(_prev: JoinState, formData: FormData): Promise<JoinState> {
  const field = (name: string, max: number) => String(formData.get(name) ?? '').trim().slice(0, max)
  // Champs d'une ligne : jamais de retour à la ligne (ils finissent dans l'objet des e-mails).
  const line = (name: string, max: number) => field(name, max).replace(/\s+/g, ' ')
  if (field('site_web', 200)) return { error: "L'inscription n'a pas pu aboutir." }

  const name = line('prenom', 60)
  const email = line('email', 160).toLowerCase()
  if (name.length < 2) return { error: 'Indique ton prénom.' }
  if (!EMAIL.test(email)) return { error: 'Ton adresse e-mail semble incomplète.' }
  if (field('consentement', 10) !== 'oui') return { error: "Coche la case d'accord pour être recontacté(e) au sujet de la communauté." }

  const themes = formData
    .getAll('themes')
    .map((t) => String(t).replace(/\s+/g, ' ').trim().slice(0, 120))
    .filter(Boolean)
    .slice(0, 10)
  const details = [
    `Thèmes : ${themes.join(', ') || 'non précisés'}`,
    `Format : ${line('format', 60) || 'non précisé'}`,
    `Niveau : ${line('niveau', 80) || 'non précisé'}`,
    'Accord pour être recontacté(e) : oui',
  ].join('\n')

  if (!limit.take(await visitorAddress())) return { error: `Trop d'envois d'un coup. Écris-moi directement à ${site.email}.` }
  const delivered = await receiveRequest({
    source: 'communaute',
    name,
    email,
    ...(line('activite', 120) ? { company: line('activite', 120) } : {}),
    ...(line('ville', 80) ? { city: line('ville', 80) } : {}),
    need: 'Membre fondateur de la communauté',
    message: field('message', 2000) || '(pas de message)',
    details,
  })
  if (!delivered) return { error: `L'inscription n'a pas fonctionné. Réessaie dans un instant ou écris-moi à ${site.email}.` }
  return { ok: true, receipt: mailConfigured() }
}
