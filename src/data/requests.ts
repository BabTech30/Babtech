/**
 * Demandes reçues par le site (formulaire de contact, assistant IA, communauté) : elles arrivent dans
 * l'onglet « Demandes » du tableau de bord et par e-mail sur contact@babtech.fr.
 */
export type RequestSource = 'contact' | 'assistant' | 'communaute'
export type RequestStatus = 'new' | 'in_progress' | 'done'

export type InboxRequest = {
  id: string
  source: RequestSource
  status: RequestStatus
  createdAt: string
  /** Dernier changement (statut, note) : sert à la durée de conservation. */
  updatedAt: string
  name: string
  email: string
  phone?: string
  company?: string
  city?: string
  budget?: string
  need?: string
  message: string
  /** Compléments : synthèse de l'assistant, thèmes et format choisis pour la communauté… */
  details?: string
  /** Ta note privée, jamais envoyée à personne. */
  note?: string
}

export const SOURCE_LABELS: Record<RequestSource, string> = {
  contact: 'Formulaire de contact',
  assistant: 'Assistant IA',
  communaute: 'Communauté',
}

export const STATUSES: { value: RequestStatus; label: string }[] = [
  { value: 'new', label: 'Nouvelle' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'done', label: 'Traitée' },
]

/** Besoins proposés dans le formulaire de contact (les pages services préremplissent le leur avec ?besoin=…). */
export const NEEDS = [
  { value: 'site-internet', label: 'Site internet — création ou refonte' },
  { value: 'application-metier', label: 'Application métier / PWA' },
  { value: 'automatisation-ia', label: 'Automatisation & IA' },
  { value: 'site-reservation', label: 'Site de réservation (location saisonnière)' },
  { value: 'referencement-geo', label: 'Référencement Google & IA (SEO / GEO)' },
  { value: 'formation-ia', label: 'Accompagnement ou formation IA' },
  { value: 'autre', label: 'Autre / je ne sais pas encore' },
]

export const BUDGETS = ['Moins de 1 000 €', '1 000 à 3 000 €', '3 000 à 6 000 €', 'Plus de 6 000 €', 'Je ne sais pas encore']

/** Conservation (page Confidentialité) : 12 mois après le dernier échange ; 3 ans pour la liste de la communauté. */
export const RETENTION_DAYS: Record<RequestSource, number> = { contact: 365, assistant: 365, communaute: 3 * 365 }
