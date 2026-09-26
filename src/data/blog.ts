export type Category = {
  slug: string
  name: string
  description: string
}

/** Thématiques du blog : elles préfigurent les groupes d'apprentissage de la communauté. */
export const categories: Category[] = [
  {
    slug: 'ia-automatisation',
    name: 'IA & automatisation',
    description:
      "Utiliser l'IA générative et l'automatisation pour gagner du temps dans une TPE : cas concrets, méthodes et bonnes pratiques.",
  },
  {
    slug: 'visibilite-referencement',
    name: 'Visibilité & référencement',
    description:
      'Être trouvé sur Google, Google Maps et dans les réponses des IA : SEO local, GEO, site internet et Google Business Profile.',
  },
  {
    slug: 'outils-metier',
    name: 'Outils métier & applications',
    description:
      'Applications sur mesure, PWA, logiciels du marché : choisir et construire les bons outils pour travailler plus vite.',
  },
  {
    slug: 'entreprendre',
    name: 'Entreprendre avec le digital',
    description:
      'Retours de terrain et feuilles de route pour digitaliser son entreprise pas à pas, sans se perdre.',
  },
]

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug)
}
