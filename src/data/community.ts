import type { IconName } from '@/components/Icon'

export const community = {
  name: 'La communauté BabTech',
  tagline: "Apprendre le digital et l'IA entre entrepreneurs, à Montpellier et dans l'Hérault.",
  status: 'En construction · inscriptions ouvertes aux membres fondateurs',
  intro:
    "L'IA et le digital évoluent chaque semaine. Seul, on décroche vite. À plusieurs, on avance : la communauté BabTech réunit des dirigeants de TPE, artisans, commerçants et indépendants qui veulent apprendre en pratiquant, partager ce qui marche et se rencontrer.",
  formats: [
    {
      icon: 'users' as IconName,
      title: 'Cercles de travail',
      desc: "De petits groupes d'entrepreneurs qui avancent ensemble sur un objectif concret : lancer son site, automatiser sa facturation, intégrer l'IA dans son quotidien. On partage, on s'entraide, on se tient motivés.",
    },
    {
      icon: 'graduation' as IconName,
      title: 'Ateliers pratiques',
      desc: 'Des sessions courtes et concrètes, ordinateur ouvert : bien utiliser les assistants IA, optimiser sa fiche Google, créer une première automatisation. Tu repars avec quelque chose qui marche.',
    },
    {
      icon: 'coffee' as IconName,
      title: 'Rencontres entre entrepreneurs',
      desc: "Des moments conviviaux à Montpellier pour rencontrer d'autres dirigeants, échanger des retours d'expérience et faire naître des collaborations.",
    },
    {
      icon: 'handshake' as IconName,
      title: 'Entraide et mises en relation',
      desc: 'Trouver le bon contact, un partenaire, un prestataire de confiance, ou simplement un regard extérieur sur ton projet.',
    },
  ],
  themes: [
    "L'IA générative au quotidien (ChatGPT, Claude, Gemini, Le Chat)",
    'Automatiser ses tâches répétitives (n8n, Make, Zapier)',
    'Être visible sur Google et dans les IA (SEO local, GEO)',
    'Créer et faire vivre son site internet',
    'Applications, outils de gestion et no-code',
    'Piloter son activité avec ses données',
  ],
  audience: [
    'Dirigeants de TPE et PME',
    'Artisans et commerçants',
    'Indépendants et freelances',
    "Porteurs de projet et créateurs d'entreprise",
  ],
  roadmap: [
    {
      title: 'Liste des membres fondateurs',
      desc: "Les inscriptions sont ouvertes. Tu indiques tes thèmes et formats préférés : ce sont eux qui construisent le programme.",
      current: true,
    },
    {
      title: 'Premiers ateliers et rencontres',
      desc: 'Des premiers rendez-vous à Montpellier et en visio, autour des thèmes les plus demandés.',
      current: false,
    },
    {
      title: 'Cercles de travail réguliers',
      desc: 'Des groupes par thème et par niveau, animés et suivis dans la durée.',
      current: false,
    },
    {
      title: 'Plateforme membres',
      desc: "Un espace en ligne pour retrouver les membres, rejoindre des groupes, s'inscrire aux événements et se mettre en relation.",
      current: false,
    },
  ],
  faq: [
    {
      q: "La communauté BabTech, c'est pour qui ?",
      a: "Pour les dirigeants de TPE, artisans, commerçants, indépendants et porteurs de projet de Montpellier et de l'Hérault qui veulent progresser sur le digital et l'IA, quel que soit leur niveau de départ.",
    },
    {
      q: "Faut-il être à l'aise avec la technique ?",
      a: "Non. Les ateliers partent de ton métier et de tes vraies tâches, pas de la technologie. Débutants bienvenus : c'est justement l'intérêt d'apprendre en groupe.",
    },
    {
      q: 'Où se passent les rencontres ?',
      a: "À Montpellier et dans l'Hérault pour les rencontres en présentiel, et en visio pour les ateliers à distance. Les lieux et les dates sont communiqués en priorité aux inscrits.",
    },
    {
      q: "Combien coûte l'inscription ?",
      a: "L'inscription à la liste des membres fondateurs est gratuite et sans engagement. Les modalités des ateliers et des cercles seront annoncées en priorité aux inscrits.",
    },
    {
      q: 'Que deviennent mes informations ?',
      a: "Elles servent uniquement à te prévenir du lancement et à construire un programme adapté aux besoins exprimés. Tu peux te désinscrire à tout moment sur simple demande.",
    },
  ],
}
