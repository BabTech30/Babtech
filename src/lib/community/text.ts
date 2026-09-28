import { formatDay } from '@/lib/admin/format'
import { frTime, utcToParis } from '@/lib/booking/time'

/**
 * Textes saisis par les membres : nettoyage avant enregistrement, extraits, dates. Les messages restent du texte
 * brut (pas de HTML) : ils sont affichés par <PostBody>, qui transforme seulement les adresses web en liens.
 */

/** Texte sur plusieurs lignes : retours à la ligne unifiés, caractères de contrôle retirés, 2 lignes vides au plus. */
export function cleanText(value: FormDataEntryValue | null) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Texte sur une seule ligne (titre, nom, ville) : espaces multiples réduits. */
export const singleLine = (value: FormDataEntryValue | null) =>
  String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/** Nombre d'adresses web dans un texte (les nouveaux comptes sont limités). */
export const countLinks = (text: string) => (text.match(/https?:\/\/|www\./gi) ?? []).length

/** Début d'un texte, coupé proprement (description de page, e-mail d'alerte). */
export function excerpt(text: string, max = 155) {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= max) return flat
  const cut = flat.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ') > max * 0.6 ? cut.lastIndexOf(' ') : cut.length)}…`
}

/** « 28 septembre 2026 à 14 h 05 », heure de Paris. */
export function postDate(date: Date) {
  const { date: day, time } = utcToParis(date.getTime())
  return `${formatDay(day)} à ${frTime(time)}`
}
