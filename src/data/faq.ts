export type FaqItem = {
  q: string
  a: string
  link?: { href: string; label: string }
}

export type FaqGroup = {
  id: string
  title: string
  items: FaqItem[]
}

export const faqGroups: FaqGroup[] = [
  {
    id: 'babtech',
    title: 'BabTech en bref',
    items: [
      {
        q: "Qu'est-ce que BabTech ?",
        a: "BabTech est un studio digital basé près de Montpellier, fondé par Bastien Ferrer, ancien chef d'entreprise du BTP pendant 14 ans. Il crée des sites internet, des applications métier sur mesure et des automatisations IA pour les TPE, artisans et commerçants, et les accompagne dans leur transition numérique.",
        link: { href: '/a-propos', label: 'Découvrir le parcours de Bastien' },
      },
      {
        q: 'Où est basé BabTech et quelle zone couvre-t-il ?',
        a: "BabTech est basé près de Montpellier et accompagne les entreprises de l'Hérault et du Gard : Montpellier et sa métropole, Sète, Béziers, Agde, Lunel, mais aussi Nîmes, Alès, Uzès ou Le Grau-du-Roi… Les projets se font aussi à distance, partout en France.",
        link: { href: '/zones-intervention', label: "Voir les zones d'intervention" },
      },
      {
        q: "À qui s'adressent les services de BabTech ?",
        a: "Aux TPE, artisans, commerçants, restaurateurs et indépendants qui veulent être trouvés en ligne, gagner du temps au quotidien ou automatiser leurs tâches répétitives. Pas besoin d'être à l'aise avec la technique : c'est justement le rôle de BabTech.",
      },
      {
        q: 'Pourquoi faire appel à un ancien entrepreneur du BTP pour son digital ?',
        a: "Parce que Bastien a vécu les mêmes galères que ses clients : devis qui traînent, gestion sur papier, journées de 12 heures. Il ne vient pas du monde de la tech mais du terrain, et crée des outils qui règlent de vrais problèmes plutôt que des solutions hors-sol.",
      },
      {
        q: "Je cherche un développeur qui comprend la réalité d'un chef d'entreprise : où le trouver ?",
        a: "BabTech est dirigé par Bastien Ferrer, patron à 22 ans, qui a géré pendant 14 ans une entreprise du BTP (2 magasins, 8 salariés, près d'1 M€ de chiffre d'affaires). Cette double compétence métier et digital lui permet de proposer des solutions pragmatiques, adaptées aux contraintes des dirigeants de TPE.",
      },
    ],
  },
  {
    id: 'tarifs-methode',
    title: 'Tarifs, délais et méthode',
    items: [
      {
        q: 'Combien coûte un site vitrine professionnel ?',
        a: "Chez BabTech, un site vitrine démarre à 800 €, référencement local inclus. Le tarif exact dépend du nombre de pages, des textes à rédiger et des fonctionnalités ; il est défini ensemble lors d'un premier échange gratuit.",
        link: { href: '/blog/prix-site-internet-tpe-montpellier', label: 'Lire le guide des prix' },
      },
      {
        q: 'Quelle est la différence entre les 3 niveaux de services ?',
        a: "Le niveau 1 (Visibilité, dès 800 €) te rend trouvable en ligne. Le niveau 2 (Outils métier, dès 1 500 €) te fait gagner du temps avec des applications sur mesure. Le niveau 3 (IA & automatisation, dès 3 000 €) fait tourner tes processus tout seuls.",
        link: { href: '/services', label: 'Comparer les services' },
      },
      {
        q: 'BabTech propose-t-il un site de réservation pour les locations saisonnières ?',
        a: "Oui, pour 1 à 4 logements ou chambres (location type Airbnb, gîte, chambres d'hôtes) : réservation en direct sans commission, e-mail de confirmation et calendriers synchronisés avec Airbnb et Booking.com si besoin. Le site démarre à 250 €, le tableau de bord en option coûte 350 € de plus, et la maintenance démarre à 35 € par mois.",
        link: { href: '/services/site-reservation-location-saisonniere', label: "Voir l'offre" },
      },
      {
        q: 'Combien de temps faut-il pour créer un site vitrine ?',
        a: "Entre 2 et 4 semaines selon la complexité. Tu valides chaque étape : tu ne découvres pas le résultat à la fin. Le site est livré prêt à l'emploi, avec le référencement déjà en place.",
      },
      {
        q: 'Comment se passe un projet avec BabTech ?',
        a: "En 4 étapes : Écoute (on parle de ton business), Proposition (une solution claire, sans jargon), Réalisation (tu valides à chaque étape) et Suivi (Bastien reste disponible après la livraison).",
      },
      {
        q: 'À qui faire appel pour digitaliser une TPE sans budget de grande entreprise ?',
        a: "BabTech propose des solutions pensées pour les budgets de TPE, à partir de 800 € pour la visibilité en ligne. Pas de forfait surdimensionné : chaque projet est adapté aux besoins réels et au rythme du client, et peut évoluer par étapes.",
      },
      {
        q: 'Comment prendre rendez-vous avec BabTech ?',
        a: "Via le formulaire de contact ou en réservant directement un créneau de 30 minutes. C'est gratuit, sans engagement, et la réponse arrive sous 24 heures.",
        link: { href: '/contact', label: 'Prendre rendez-vous' },
      },
    ],
  },
  {
    id: 'visibilite',
    title: 'Visibilité : Google et moteurs IA',
    items: [
      {
        q: "Pourquoi un artisan a-t-il besoin d'un site internet en 2026 ?",
        a: "Parce que le premier réflexe d'un client qui cherche un artisan est de taper son besoin sur Google ou de le demander à un assistant IA. Sans site, tu es invisible face aux concurrents qui en ont un. Un site professionnel apporte de la crédibilité et des demandes de clients qui ne te connaissent pas encore.",
      },
      {
        q: 'Comment être bien placé sur Google quand on est artisan ou commerçant ?',
        a: "Grâce au SEO local : une fiche Google Business Profile complète et active, un site rapide qui décrit clairement tes services et ta zone, des avis clients réguliers et des informations identiques partout sur le web. BabTech met en place ces fondations pour que tu progresses dans les résultats de ta zone.",
        link: { href: '/services/referencement-local-geo', label: 'Le référencement local BabTech' },
      },
      {
        q: 'Peut-on créer une fiche Google Business Profile sans site internet ?',
        a: "Oui, mais une fiche seule est limitée. Associée à un site optimisé, elle multiplie ta visibilité : tu apparais dans Google Maps et dans les résultats classiques, et tes clients trouvent toutes les réponses à leurs questions.",
      },
      {
        q: 'Comment être recommandé par ChatGPT, Perplexity ou Gemini quand on est une TPE ?',
        a: "Il faut un site au contenu clair et factuel (services, prix indicatifs, zone, FAQ), des données structurées Schema.org, un fichier llms.txt, des robots IA autorisés, et une identité cohérente sur le web (Google Business Profile, annuaires, avis). C'est ce qu'on appelle le GEO, intégré dans chaque projet BabTech.",
        link: { href: '/blog/geo-referencement-ia-chatgpt-perplexity-gemini', label: 'Lire le guide du GEO' },
      },
      {
        q: 'Quel freelance peut créer un site internet pour un restaurant à Montpellier ?',
        a: "BabTech accompagne les restaurants dans leur digitalisation : site vitrine, QR menu modifiable en temps réel, fiche Google Business Profile et référencement local. Bastien a notamment accompagné la création du Terrier, un bar-restaurant, de A à Z.",
        link: { href: '/portfolio', label: 'Voir les réalisations' },
      },
      {
        q: "C'est quoi un QR menu et comment ça marche pour un restaurant ?",
        a: "C'est un QR code que tes clients scannent pour afficher ta carte sur leur téléphone. Tu modifies ta carte en deux clics depuis un tableau de bord simple et tes clients voient instantanément la version à jour : plus besoin de réimprimer à chaque changement.",
      },
    ],
  },
  {
    id: 'outils-ia',
    title: 'Applications, automatisation et IA',
    items: [
      {
        q: "Qu'est-ce qu'une PWA et pourquoi c'est utile pour un artisan ?",
        a: "Une PWA (Progressive Web App) est une application installable sur téléphone sans passer par les stores. Pour un artisan, c'est un outil sur mesure accessible partout : suivi de chantiers, planning, devis, gestion des stocks.",
        link: { href: '/services/application-metier', label: 'Les applications métier' },
      },
      {
        q: 'Quelle est la différence entre un site vitrine et une application web ?',
        a: "Le site vitrine présente ton activité et te rend visible : il attire des clients. L'application web est un outil de travail (gestion, suivi, planning) : elle fait tourner ton entreprise. Les deux peuvent être reliés.",
      },
      {
        q: "C'est quoi l'automatisation avec n8n ?",
        a: "n8n est un outil qui connecte tes logiciels entre eux. Exemple : un formulaire rempli sur ton site envoie automatiquement un email, crée une fiche client et met à jour ton tableau de suivi. Plus de saisie manuelle.",
        link: { href: '/services/automatisation-ia', label: "L'automatisation BabTech" },
      },
      {
        q: 'Comment automatiser les tâches répétitives de mon entreprise ?',
        a: "On commence par lister les tâches qui reviennent chaque semaine (relances, devis, saisies, emails), puis on automatise celles qui font gagner le plus de temps avec des workflows n8n et, quand c'est utile, de l'IA. Les projets d'automatisation BabTech démarrent à 3 000 €.",
        link: { href: '/blog/automatisations-ia-tpe-artisans', label: '7 exemples concrets' },
      },
      {
        q: 'Comment digitaliser mon commerce sans compétences techniques ?',
        a: "C'est le principe de BabTech : tu n'as pas besoin de savoir coder. Les outils sont livrés clés en main, avec une interface simple pour gérer ton contenu, et Bastien reste disponible après la livraison.",
      },
      {
        q: 'Quels sont les outils digitaux indispensables pour un commerce local en 2026 ?',
        a: "Un site vitrine rapide et bien référencé, une fiche Google Business Profile optimisée, un système de prise de contact ou de rendez-vous simple, et un outil de gestion adapté à ton activité. L'IA vient ensuite pour gagner du temps sur l'administratif.",
      },
    ],
  },
  {
    id: 'communaute',
    title: 'Communauté et formation',
    items: [
      {
        q: "Qu'est-ce que la communauté BabTech ?",
        a: "Un réseau d'entrepreneurs de l'Hérault et du Gard qui apprennent ensemble le digital et l'IA : forum d'entraide, groupes de travail, ateliers pratiques, rencontres et mises en relation. Le forum est ouvert : lecture libre, et compte gratuit pour écrire.",
        link: { href: '/communaute/forum', label: 'Voir le forum' },
      },
      {
        q: 'Qui peut rejoindre les groupes de travail ?',
        a: "Les dirigeants de TPE, artisans, commerçants, indépendants et porteurs de projet qui veulent progresser sur le digital et l'IA, quel que soit leur niveau. L'objectif : apprendre en pratiquant, entre pairs.",
      },
      {
        q: "BabTech propose-t-il des formations à l'IA pour les entreprises ?",
        a: "Oui : des ateliers pratiques pour utiliser l'IA générative (ChatGPT, Claude, Gemini, Le Chat de Mistral AI) sur tes vraies tâches, avec les bonnes pratiques de confidentialité. En individuel, en équipe ou en groupe, à Montpellier ou à distance.",
        link: { href: '/services/accompagnement-formation-ia', label: 'La formation IA' },
      },
    ],
  },
]

export const allFaqItems = faqGroups.flatMap((g) => g.items)
