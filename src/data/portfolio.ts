import type { ServiceSlug } from './services'

export type CaseImage = { src: string; alt: string; width: number; height: number }

export type CaseStudy = {
  slug: string
  title: string
  sector: string
  services: ServiceSlug[]
  context: string
  delivered: string[]
  result: string
  /** Chiffres clés du projet (uniquement des faits vérifiables). */
  facts?: { value: string; label: string }[]
  stack?: string[]
  /** Captures et vidéo, dans public/realisations/. */
  media?: {
    images: CaseImage[]
    video?: { src: string; poster: string; width: number; height: number; label: string }
    note?: string
  }
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
    slug: 'hotel-le-saint-eloi',
    title: 'Hôtel Le Saint Éloi',
    sector: 'Hôtellerie · Montpellier',
    services: ['creation-site-internet', 'application-metier'],
    context:
      "Un hôtel de 17 chambres à Montpellier, à cinq minutes du CHU Saint-Éloi et du tramway. Objectif : vendre les chambres en direct, sans commission, et faire tourner l'hôtel au quotidien depuis un seul outil, pour toute l'équipe. Mon premier gros projet de développement, conçu sur le terrain avec le gérant. Pour le même hôtel, j'ai aussi digitalisé le règlement intérieur.",
    delivered: [
      'Site de réservation en français et en anglais : disponibilités et prix en temps réel, choix de sa chambre en photos',
      'Réservations en direct, sans commission, et jamais deux fois la même chambre, même si deux clients réservent à la même seconde',
      'Tableau de bord avec un accès par rôle : gérant, réception, veilleur de nuit, ménage, maintenance',
      'Planning sur 14 jours, chambres à vendre nuit par nuit et synchronisation avec Booking.com',
      "E-mails automatiques et arrivée autonome : code de la porte, Wi-Fi et numéro de chambre envoyés 48 h avant l'arrivée",
      "Pilotage : chiffre d'affaires, occupation, commissions évitées, taxe de séjour, export comptable",
      'Règlement intérieur accessible par QR code, traduit en 5 langues et plus',
    ],
    result:
      "Le site est en service : l'hôtel vend ses chambres en direct, et toute l'équipe voit les mêmes chiffres, du site au tableau de bord. 189 tests automatiques sont rejoués avant chaque mise en ligne.",
    facts: [
      { value: '17', label: 'chambres gérées' },
      { value: '5', label: "rôles dans l'équipe, chacun son accès" },
      { value: '189', label: 'tests automatiques avant chaque mise en ligne' },
      { value: '0 %', label: 'de commission sur les réservations directes' },
    ],
    stack: ['React', 'Node.js', 'MariaDB', 'Hostinger'],
    media: {
      images: [
        {
          src: '/realisations/hotel-le-saint-eloi-site.webp',
          alt: "Page d'accueil du site de l'Hôtel Le Saint Éloi, avec la recherche de disponibilités par dates et par nombre de voyageurs",
          width: 1200,
          height: 750,
        },
        {
          src: '/realisations/hotel-le-saint-eloi-tableau-de-bord.webp',
          alt: "Tableau de bord de l'hôtel : occupation du soir, arrivées, départs, chiffre d'affaires du mois et commissions évitées",
          width: 1200,
          height: 750,
        },
        {
          src: '/realisations/hotel-le-saint-eloi-reservation-mobile.webp',
          alt: 'Réservation sur téléphone : le client choisit sa chambre en photos',
          width: 390,
          height: 844,
        },
        {
          src: '/realisations/hotel-le-saint-eloi-planning-mobile.webp',
          alt: 'Plan des chambres sur téléphone : qui dort où ce soir, chambres libres et propres',
          width: 390,
          height: 844,
        },
      ],
      video: {
        src: '/realisations/hotel-le-saint-eloi-demo.mp4',
        poster: '/realisations/hotel-le-saint-eloi-demo.webp',
        width: 720,
        height: 1558,
        label: 'Démonstration du site et du tableau de bord (1 min 15, sans son)',
      },
      note: 'Captures et vidéo réalisées avec des données de démonstration.',
    },
  },
]

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug)
}
