import { readFileSync } from 'node:fs'
import path from 'node:path'
import { escapeText as text, joinLines } from './ics'
import { absoluteUrl, site } from './site'

/** Adresse de la carte de contact téléchargeable (servie par src/app/carte/bastien-ferrer.vcf). */
export const VCARD_PATH = '/carte/bastien-ferrer.vcf'

/**
 * Carte de contact au format vCard 3.0, le plus largement reconnu (iPhone, Android, Outlook, Gmail) :
 * nom, entreprise, e-mail, téléphone s'il est renseigné, site et photo.
 */
export function buildVcard() {
  const f = site.founder
  const photo = readFileSync(path.join(process.cwd(), 'src/assets/bastien-ferrer-vcard.jpg')).toString('base64')
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${text(f.familyName)};${text(f.givenName)};;;`,
    `FN:${text(f.name)}`,
    `ORG:${text(site.name)}`,
    `TITLE:${text(`Fondateur de ${site.name}`)}`,
    `EMAIL;TYPE=INTERNET,WORK:${site.email}`,
    ...(site.phone ? [`TEL;TYPE=CELL,VOICE:${site.phone.replace(/[^+\d]/g, '')}`] : []),
    `URL:${absoluteUrl('/')}`,
    `ADR;TYPE=WORK:;;;${text(site.address.locality)};${text(site.address.department)};;France`,
    `NOTE:${text(`Sites internet, outils métier, sites de réservation et IA pour les TPE, artisans et loueurs de l'Hérault. Premier échange gratuit : ${absoluteUrl(site.bookingPath)}`)}`,
    `PHOTO;ENCODING=b;TYPE=JPEG:${photo}`,
    `REV:${new Date().toISOString().slice(0, 10)}`,
    'END:VCARD',
  ]
  return joinLines(lines)
}
