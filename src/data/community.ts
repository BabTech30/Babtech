import type { IconName } from '@/components/Icon'

export const community = {
  name: 'La communauté BabTech',
  tagline: "Apprendre le digital et l'IA entre entrepreneurs, à Montpellier et dans l'Hérault.",
  status: 'Forum, projets et groupes · inscription gratuite',
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
      title: 'Forum, projets et groupes',
      desc: "Crée ton compte gratuit, pose tes questions, présente ton projet ou rejoins un groupe : ce sont vos échanges qui construisent le programme.",
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
      title: 'Événements en ligne',
      desc: "S'inscrire aux ateliers et aux rencontres directement sur le site, avec un rappel par e-mail.",
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
      a: "Le compte membre et le forum sont gratuits et sans engagement. Les modalités des ateliers et des cercles seront annoncées en priorité aux membres.",
    },
    {
      q: 'Qui peut lire le forum ?',
      a: "Tout le monde : le forum est en lecture libre, y compris pour Google et les assistants IA. Pour écrire, il suffit d'un compte gratuit, confirmé par e-mail.",
    },
    {
      q: 'Comment présenter mon projet ou rejoindre un groupe ?',
      a: "Avec ton compte gratuit. Dans l'espace Projets, présente ton projet et ce que tu cherches (des conseils, un partenaire, une compétence) : les membres te répondent sur sa page ou te proposent leur aide par e-mail. Dans l'espace Groupes, rejoins un groupe en un clic, ou propose le tien : il est publié une fois validé.",
    },
    {
      q: 'Que deviennent mes informations ?',
      a: "Ton e-mail sert à te connecter et, si tu le souhaites, à te prévenir des réponses : il n'est jamais affiché. Sur le forum, les projets et les groupes, seuls ton prénom, l'initiale de ton nom, ton activité et ta ville apparaissent. Si tu proposes ton aide pour un projet, ton message et ton e-mail sont transmis à son auteur, pour qu'il puisse te répondre. Tu peux supprimer ton compte à tout moment.",
    },
  ],
}
