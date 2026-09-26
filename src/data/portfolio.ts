import type { ServiceSlug } from './services'

export type CaseStudy = {
  slug: string
  title: string
  sector: string
  services: ServiceSlug[]
  context: string
  delivered: string[]
  result: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'le-terrier',
    title: 'Le Terrier',
    sector: 'Bar / Restaurant',
    services: ['creation-site-internet', 'application-metier'],
    context:
      "Un projet parti de zéro. Pas juste la partie digitale : j'ai accompagné la création complète du lieu — concept, réalisation des travaux et mise en place de tout l'écosystème digital. Un engagement total, du premier coup de crayon à l'ouverture.",
    delivered: [
      'Identité visuelle et branding complet',
      'Site vitrine professionnel',
      'QR menu pour les clients',
      'Dashboard de gestion accessible sans compétence technique',
      'Accompagnement à la création du business',
    ],
    result:
      "Un établissement opérationnel de A à Z avec une présence digitale pro dès l'ouverture. Le gérant pilote son menu, son site et son suivi en totale autonomie.",
  },
  {
    slug: 'pwa-budget',
    title: 'PWA Budget',
    sector: 'Application web',
    services: ['application-metier'],
    context:
      "Un outil conçu pour prouver ce que je sais faire — et que j'utilise au quotidien. Une vraie application de gestion de budget, pensée pour être utilisée par plusieurs profils.",
    delivered: [
      'PWA complète (installable, responsive)',
      'Gestion multi-profils',
      'Tableau de bord visuel',
      'Système de notifications et alertes',
    ],
    result:
      'Une application fonctionnelle qui montre concrètement ma capacité à livrer un outil métier complet, de la conception au déploiement.',
  },
  {
    slug: 'hotel-saint-eloi',
    title: 'Hôtel Saint Eloi',
    sector: 'Hôtellerie',
    services: ['creation-site-internet', 'application-metier'],
    context:
      "Un hôtel qui accueille des résidents de nombreuses nationalités. Le règlement intérieur devait être accessible, compréhensible par tous et conforme à la réglementation.",
    delivered: [
      'Règlement intérieur digitalisé via QR code',
      'Traduction en 5 langues et plus',
      'Dashboard de suivi de la conformité',
    ],
    result:
      "Fini les documents papier que personne ne lit. Chaque résident accède au règlement dans sa langue en un scan, et l'hôtel peut prouver la bonne diffusion de ses obligations réglementaires.",
  },
]

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug)
}
