import type { IconName } from '@/components/Icon'

/**
 * Forum de la communauté : catégories (les thèmes de la communauté), règles de saisie et limites anti-abus.
 * Les sujets et les réponses sont dans la base MySQL (src/lib/community), pas ici.
 */
export type ForumCategory = { slug: string; name: string; description: string; icon: IconName }

/** Ordre d'affichage. Un slug ne doit jamais valoir « sujet », « nouveau » ni « modifier » (adresses réservées). */
export const forumCategories: ForumCategory[] = [
  {
    slug: 'ia-au-quotidien',
    name: "L'IA au quotidien",
    description: 'ChatGPT, Claude, Gemini, Le Chat : ce qui marche vraiment dans ton métier, les bons réflexes et les limites.',
    icon: 'sparkles',
  },
  {
    slug: 'automatisation',
    name: 'Automatiser ses tâches',
    description: "Devis, relances, factures, rendez-vous : les outils (n8n, Make, Zapier…) et les retours d'expérience pour gagner du temps.",
    icon: 'zap',
  },
  {
    slug: 'visibilite-google-ia',
    name: 'Être visible sur Google et les IA',
    description: 'Fiche Google, avis, référencement local et GEO : se faire trouver par les clients du coin.',
    icon: 'search',
  },
  {
    slug: 'site-internet',
    name: 'Créer et faire vivre son site',
    description: 'Contenus, photos, réservation en ligne, sites de location saisonnière : créer un site utile et le garder à jour.',
    icon: 'globe',
  },
  {
    slug: 'outils-gestion',
    name: 'Outils et gestion',
    description: "Applications, no-code, tableaux de bord, facturation : bien s'équiper et piloter son activité avec ses chiffres.",
    icon: 'app',
  },
  {
    slug: 'entraide',
    name: 'Entraide entre entrepreneurs',
    description: "Questions libres, bons plans, recherche d'un partenaire ou d'un prestataire dans l'Hérault et le Gard.",
    icon: 'handshake',
  },
]

export const getForumCategory = (slug: string) => forumCategories.find((c) => c.slug === slug)

export const FORUM_PATH = '/communaute/forum'

/** Longueurs acceptées (en caractères). */
export const LIMITS = {
  title: { min: 10, max: 120 },
  topic: { min: 20, max: 5000 },
  reply: { min: 2, max: 5000 },
  report: { max: 500 },
  password: { min: 10, max: 256 },
}

/** Sujets par page dans une catégorie. */
export const TOPICS_PER_PAGE = 20

/** Un compte de moins de 7 jours ne peut mettre que 2 liens par message (frein aux comptes de spam). */
export const NEW_ACCOUNT_DAYS = 7
export const NEW_ACCOUNT_MAX_LINKS = 2

/** Nom public d'un membre : prénom + initiale du nom (« Marie D. »). L'e-mail n'est jamais affiché. */
export function publicName(firstName: string, lastName: string) {
  const initial = lastName.trim().charAt(0).toUpperCase()
  return initial ? `${firstName.trim()} ${initial}.` : firstName.trim()
}

/** Adresse d'un sujet : identifiant + titre lisible (« /communaute/forum/sujet/12-bien-utiliser-chatgpt/ »). */
export function topicSlug(title: string) {
  return (
    title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/['’]/g, ' ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70)
      .replace(/-+$/, '') || 'sujet'
  )
}

export const topicPath = (id: number, title: string) => `${FORUM_PATH}/sujet/${id}-${topicSlug(title)}`
