import { buildVcard } from '@/lib/vcard'

export const dynamic = 'force-static'

/** Fiche contact à enregistrer dans le téléphone, liée depuis la carte de visite (/carte/). */
export function GET() {
  return new Response(buildVcard(), {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'inline; filename="bastien-ferrer.vcf"',
      'X-Robots-Tag': 'noindex',
    },
  })
}
