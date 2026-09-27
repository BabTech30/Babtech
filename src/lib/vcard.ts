import { readFileSync } from 'node:fs'
import path from 'node:path'
import { absoluteUrl, site } from './site'

/** Adresse de la carte de contact téléchargeable (servie par src/app/carte/bastien-ferrer.vcf). */
export const VCARD_PATH = '/carte/bastien-ferrer.vcf'

/** Échappe une valeur texte (virgule, point-virgule, antislash, retour à la ligne). */
const text = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([,;])/g, '\\$1')

/** Coupe les lignes à 75 octets, continuées par un espace (RFC 6350, §3.2). */
function fold(line: string) {
  const parts: string[] = []
  let current = ''
  let bytes = 0
  for (const char of line) {
    const size = Buffer.byteLength(char)
    if (bytes + size > (parts.length ? 74 : 75)) {
      parts.push(current)
      current = ''
      bytes = 0
    }
    current += char
    bytes += size
  }
  parts.push(current)
  return parts.join('\r\n ')
}

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
    `NOTE:${text(`Sites internet, outils métier, sites de réservation et IA pour les TPE, artisans et loueurs de l'Hérault. Premier échange gratuit : ${site.calendlyUrl}`)}`,
    `PHOTO;ENCODING=b;TYPE=JPEG:${photo}`,
    `REV:${new Date().toISOString().slice(0, 10)}`,
    'END:VCARD',
  ]
  return `${lines.map(fold).join('\r\n')}\r\n`
}
