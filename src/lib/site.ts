/**
 * Configuration centrale de BabTech.
 *
 * Tout ce qui décrit l'entreprise (nom, adresse, contact, réseaux) vit ici :
 * les pages, les données structurées Schema.org, le sitemap, le flux RSS et
 * les fichiers llms.txt s'en servent. Modifier une info ici la met à jour partout.
 *
 * Les champs marqués « À COMPLÉTER » améliorent fortement le référencement local
 * (cohérence Nom / Adresse / Téléphone avec la fiche Google Business Profile).
 */

/**
 * Domaine du site. Si tu choisis un autre nom de domaine, c'est la seule ligne à changer :
 * canonicals, sitemap, Open Graph, données structurées, RSS et llms.txt suivent.
 */
const DEFAULT_SITE_URL = 'https://babtech.fr'

/**
 * URL canonique du site, sans slash final. NEXT_PUBLIC_SITE_URL permet, si besoin, de construire
 * une version de test pour l'adresse temporaire fournie par Hostinger.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).trim().replace(/\/+$/, '')

const FORMSPREE_CONTACT_ID = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID || 'xykbpjbz'
const FORMSPREE_COMMUNITY_ID = process.env.NEXT_PUBLIC_FORMSPREE_COMMUNITY_ID || FORMSPREE_CONTACT_ID

export const site = {
  name: 'BabTech',
  url: SITE_URL,
  locale: 'fr_FR',
  lang: 'fr-FR',
  tagline: 'Le digital qui fait tourner ton business',
  /** Phrase courte : cartes, pied de page, balises. */
  shortDescription:
    "Sites internet, applications métier et automatisations IA pour les TPE, artisans et commerçants de Montpellier et de l'Hérault.",
  /** Description complète : Schema.org, llms.txt, page d'accueil. */
  description:
    "BabTech est un studio digital basé près de Montpellier (Hérault). Il crée des sites internet, des applications métier sur mesure et des automatisations IA pour les TPE, artisans et commerçants, et les accompagne dans leur transition numérique. Fondé par Bastien Ferrer, ancien chef d'entreprise du BTP (14 ans).",

  email: 'contact@babtech.fr',
  /** Téléphone au format international (07 63 51 93 63) : site, carte de visite, fiche contact, données structurées. */
  phone: process.env.NEXT_PUBLIC_PHONE || '+33763519363',
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/babferrer',
  /** URL de l'espace client (ex. https://app.babtech.fr). Vide = bouton masqué. */
  clientSpaceUrl: process.env.NEXT_PUBLIC_CLIENT_SPACE_URL || '',

  forms: {
    contact: `https://formspree.io/f/${FORMSPREE_CONTACT_ID}`,
    community: `https://formspree.io/f/${FORMSPREE_COMMUNITY_ID}`,
  },

  founder: {
    name: 'Bastien Ferrer',
    givenName: 'Bastien',
    familyName: 'Ferrer',
    jobTitle: 'Fondateur de BabTech — développeur web et consultant IA',
    description:
      "Chef d'entreprise à 22 ans, 14 ans d'entrepreneuriat dans le BTP (2 magasins, 8 salariés, près d'1 M€ de chiffre d'affaires), reconverti dans le digital pour aider les TPE, artisans et commerçants.",
    /** À COMPLÉTER : profils personnels (LinkedIn, Malt…). Renforce l'autorité (E-E-A-T). */
    sameAs: [] as string[],
    /** Portraits : carré en JPEG (données structurées, images de partage), 4:5 et avatars ronds en WebP (pages). */
    photo: '/photos/bastien-ferrer-carre.jpg',
    portrait: '/photos/bastien-ferrer.webp',
    avatar: '/photos/bastien-ferrer-avatar.webp',
    avatarSmall: '/photos/bastien-ferrer-avatar-petit.webp',
    /** Son entreprise du bâtiment avant BabTech, et la vidéo de présentation tournée à l'époque. */
    formerCompany: {
      name: 'CVC Energies Habitat',
      youtubeId: 'X1jGCQEJLOA',
      videoTitle: 'Faites des économies grâce au solaire avec CVC ENERGIES HABITAT',
    },
  },

  address: {
    /** Ville de rattachement affichée publiquement (entreprise en zone de service). */
    locality: 'Montpellier',
    /** À COMPLÉTER si l'adresse est publique (sinon laisser vide). */
    streetAddress: '',
    postalCode: '',
    department: 'Hérault',
    region: 'Occitanie',
    country: 'FR',
  },
  /** Centre de Montpellier : point de départ de la zone d'intervention. */
  geo: { latitude: 43.6108, longitude: 3.8767 },
  serviceRadiusKm: 75,
  priceRange: '€€',

  /** À COMPLÉTER : chaque URL renseignée alimente le « sameAs » Schema.org (signal fort pour Google et les IA). */
  social: {
    googleBusinessProfile: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    github: '',
    malt: '',
  },

  /** Mentions légales (obligatoires, loi LCEN) — À COMPLÉTER. */
  legal: {
    status: 'Entreprise individuelle',
    siret: '',
    /** Uniquement si assujetti à la TVA (sinon laisser vide). */
    vatNumber: '',
    /** Adresse de l'établissement ou de domiciliation. */
    postalAddress: '',
    updatedAt: '27 septembre 2026',
    host: {
      name: 'Hostinger International Ltd',
      address: '61 Lordou Vironos Street, 6023 Larnaca, Chypre',
      url: 'https://www.hostinger.com/fr',
    },
  },

  /** Clé IndexNow (Bing, Yandex, Seznam…) : le fichier public/<clé>.txt doit exister. */
  indexNowKey: '4b1a87421e3279530e3df9612528e727',
}

export const socialLinks = Object.values(site.social).filter(Boolean)

/**
 * Les pages se terminent par « / » (export en dossier/index.html, cf. `trailingSlash` dans
 * next.config.js — à garder synchronisés) ; les fichiers (.png, .txt, .xml…) non.
 * « /services#tarifs » → « /services/#tarifs ».
 */
export function withTrailingSlash(path: string) {
  const [, pathname = '', rest = ''] = path.match(/^([^?#]*)(.*)$/) ?? []
  const last = pathname.split('/').pop() ?? ''
  if (!pathname || pathname.endsWith('/') || /\.[a-z0-9]+$/i.test(last)) return path
  return `${pathname}/${rest}`
}

/** Transforme un chemin en URL absolue (« /services » → https://…/services/). */
export function absoluteUrl(path = '/') {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${withTrailingSlash(path.startsWith('/') ? path : `/${path}`)}`
}

export function telLink(phone = site.phone) {
  return `tel:${phone.replace(/[^+\d]/g, '')}`
}

/** +33612345678 → 06 12 34 56 78 */
export function formatPhone(phone = site.phone) {
  const digits = phone.replace(/[^\d+]/g, '').replace(/^\+33/, '0')
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
}
