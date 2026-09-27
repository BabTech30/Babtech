import type { IconName } from '@/components/Icon'

export type ServiceSlug =
  | 'creation-site-internet'
  | 'application-metier'
  | 'automatisation-ia'
  | 'site-reservation-location-saisonniere'
  | 'referencement-local-geo'
  | 'accompagnement-formation-ia'

export type Accent = 'emerald' | 'bronze' | 'gradient'

export type Service = {
  slug: ServiceSlug
  icon: IconName
  accent: Accent
  /** Étiquette : niveau de l'offre ou rôle transversal. */
  badge: string
  name: string
  /** Promesse courte, affichée sur les cartes. */
  promise: string
  /** Une phrase factuelle : cartes, llms.txt, données structurées. */
  summary: string
  metaTitle: string
  metaDescription: string
  h1: string
  lead: string
  priceFrom?: number
  priceLabel: string
  priceNote: string
  duration?: string
  audience: string[]
  /** Public visé, pour les données structurées (par défaut : TPE, artisans, commerçants…). */
  audienceType?: string
  deliverables: { title: string; desc: string }[]
  extras?: string[]
  result: string
  stack?: string[]
  faq: { q: string; a: string }[]
  related: ServiceSlug[]
  caseStudy?: string
  relatedPosts: string[]
  keywords: string[]
}

export const services: Service[] = [
  {
    slug: 'creation-site-internet',
    icon: 'globe',
    accent: 'emerald',
    badge: 'Niveau 1 · Visibilité',
    name: 'Création de site internet',
    promise: 'Être trouvé. Être crédible.',
    summary:
      'Sites vitrines rapides, optimisés pour le référencement local et les moteurs IA, livrés en 2 à 4 semaines à partir de 800 €.',
    metaTitle: 'Création de site internet à Montpellier pour TPE',
    metaDescription:
      'Site vitrine rapide, bien référencé sur Google et visible dans les IA (ChatGPT, Perplexity, Gemini). Dès 800 €, livré en 2 à 4 semaines, près de Montpellier.',
    h1: 'Création de site internet à Montpellier pour les TPE, artisans et commerçants',
    lead:
      "Un site vitrine qui ne se contente pas d'être joli : il te fait trouver sur Google, rassure tes futurs clients et les pousse à te contacter. Conçu par un ancien chef d'entreprise, livré en 2 à 4 semaines, à partir de 800 €.",
    priceFrom: 800,
    priceLabel: 'À partir de 800 €',
    priceNote: 'Tarif ajusté selon le nombre de pages et les fonctionnalités. Devis gratuit.',
    duration: '2 à 4 semaines',
    audience: [
      "Tu lances ton activité et tu n'existes pas encore en ligne.",
      'Ton site actuel est lent, daté ou introuvable sur Google.',
      "Tu dépends des réseaux sociaux ou du bouche-à-oreille et tu veux une vitrine qui t'appartient.",
      'Tu veux des demandes de devis qualifiées, pas seulement des visites.',
    ],
    deliverables: [
      {
        title: 'Un site sur mesure, rapide et responsive',
        desc: "Un design à ton image, pensé d'abord pour le mobile, avec des pages qui s'affichent en un clin d'œil.",
      },
      {
        title: 'Des textes qui convertissent',
        desc: 'Structure des pages et rédaction (ou réécriture) de tes contenus avec les mots que tapent vraiment tes clients.',
      },
      {
        title: 'Le SEO local intégré',
        desc: 'Balises, données structurées LocalBusiness, pages par service et par zone, fiche Google Business Profile optimisée.',
      },
      {
        title: 'Visible dans les moteurs IA (GEO)',
        desc: 'FAQ structurée, fichier llms.txt et informations factuelles pour être cité par ChatGPT, Perplexity ou Gemini.',
      },
      {
        title: 'Contact et prise de rendez-vous',
        desc: 'Formulaire, clic-pour-appeler et réservation de créneau : les demandes arrivent directement chez toi.',
      },
      {
        title: 'Mise en ligne et prise en main',
        desc: "Mise en ligne, mentions légales, et une prise en main courte pour que tu sois autonome sur l'essentiel.",
      },
    ],
    extras: [
      'QR menu pour restaurants et commerces',
      'Présence et cohérence sur les réseaux sociaux',
      'Blog pour publier tes actualités et conseils',
      'Site multilingue pour une clientèle touristique',
    ],
    result:
      'Tes clients te trouvent sur Google et dans les réponses des IA, ton image est pro, tu inspires confiance dès le premier clic.',
    stack: ['Next.js', 'Tailwind CSS', 'Schema.org', 'Google Business Profile', 'Google Search Console'],
    faq: [
      {
        q: 'Combien coûte un site vitrine chez BabTech ?',
        a: "À partir de 800 €. Le prix dépend du nombre de pages, des textes à rédiger et des fonctionnalités (réservation, multilingue, blog…). Le périmètre est défini ensemble lors d'un premier échange gratuit, et tu reçois un devis clair avant de t'engager.",
      },
      {
        q: 'Combien de temps faut-il pour créer mon site ?',
        a: "Entre 2 et 4 semaines pour un site vitrine. Tu valides chaque étape (structure, maquette, contenus) : pas de mauvaise surprise à la livraison.",
      },
      {
        q: 'Le référencement est-il compris ?',
        a: 'Oui. Les fondations du SEO local (balises, vitesse, données structurées, pages services, fiche Google Business Profile) et du GEO pour les moteurs IA sont intégrées dès la conception, pas ajoutées après coup.',
      },
      {
        q: 'Pourrai-je modifier mon site moi-même ?',
        a: "Oui, selon ton besoin : je peux mettre en place une interface simple pour modifier tes textes, photos, horaires ou ton menu. Pour le reste, je reste disponible après la mise en ligne.",
      },
      {
        q: 'Que se passe-t-il après la mise en ligne ?',
        a: "Je reste disponible pour les questions, les ajustements et les évolutions de ton site. Tu as un interlocuteur qui connaît ton projet, pas un ticket de support.",
      },
    ],
    related: ['referencement-local-geo', 'application-metier'],
    caseStudy: 'le-terrier',
    relatedPosts: ['prix-site-internet-tpe-montpellier', 'seo-local-montpellier-google-business-profile'],
    keywords: [
      'création site internet Montpellier',
      'site vitrine artisan',
      'site internet TPE Hérault',
      'freelance web Montpellier',
    ],
  },
  {
    slug: 'application-metier',
    icon: 'app',
    accent: 'bronze',
    badge: 'Niveau 2 · Outils métier',
    name: 'Application métier sur mesure',
    promise: 'Travailler plus vite. Mieux.',
    summary:
      'Applications web et PWA sur mesure (devis, planning, suivi, stocks, tableaux de bord) pour gagner des heures chaque semaine, à partir de 1 500 €.',
    metaTitle: 'Application métier sur mesure à Montpellier (PWA)',
    metaDescription:
      'Applications web et PWA sur mesure pour TPE : devis, planning, suivi de chantier, stocks, tableaux de bord. Dès 1 500 €, conçues près de Montpellier.',
    h1: "Applications métier sur mesure pour les TPE de Montpellier et de l'Hérault",
    lead:
      "Fini les tableaux Excel bricolés, les post-it et les doubles saisies. Je conçois des applications web simples, installables sur téléphone (PWA), taillées pour ta façon de travailler — pas l'inverse. À partir de 1 500 €.",
    priceFrom: 1500,
    priceLabel: 'À partir de 1 500 €',
    priceNote: 'Tarif selon le périmètre fonctionnel. Livraison par étapes, devis gratuit.',
    duration: 'Livraison par étapes, avec une première version rapidement utilisable',
    audience: [
      'Tu gères encore tes devis, ton planning ou tes stocks sur papier ou sur Excel.',
      'Tu ressaisis les mêmes informations dans plusieurs outils.',
      "Tes équipes sur le terrain n'ont pas l'info à jour au bon moment.",
      'Aucun logiciel du marché ne colle vraiment à ton métier.',
    ],
    deliverables: [
      {
        title: 'Application web progressive (PWA)',
        desc: "Installable sur téléphone, tablette et ordinateur sans passer par les stores, pensée pour le terrain.",
      },
      {
        title: 'Tableaux de bord de pilotage',
        desc: "Activité, devis en cours, chiffre d'affaires, alertes : les indicateurs qui comptent, en un coup d'œil.",
      },
      {
        title: 'Gestion interne sur mesure',
        desc: 'Devis, planning, interventions, stocks, clients, fournisseurs… modélisés selon ton organisation réelle.',
      },
      {
        title: 'Plusieurs utilisateurs, chacun son rôle',
        desc: 'Gérant, équipe, comptable : chacun voit et modifie uniquement ce dont il a besoin.',
      },
      {
        title: 'Connexion à tes outils existants',
        desc: 'Import, export et synchronisation avec ton agenda, ta comptabilité, ton site ou tes tableurs.',
      },
      {
        title: 'Une prise en main immédiate',
        desc: "Une interface conçue pour des gens qui n'ont pas trois semaines à passer en formation.",
      },
    ],
    result: 'Tu gagnes des heures chaque semaine et tu pilotes ton activité avec des outils taillés pour toi.',
    stack: ['Next.js', 'PWA', 'Bases de données sécurisées', 'API', 'n8n'],
    faq: [
      {
        q: "C'est quoi une PWA ?",
        a: "Une Progressive Web App est une application qui s'ouvre dans le navigateur et s'installe sur l'écran d'accueil d'un téléphone, sans passer par l'App Store ou Google Play. Une seule version fonctionne sur mobile, tablette et ordinateur, ce qui réduit fortement le coût de développement.",
      },
      {
        q: "Pourquoi du sur-mesure plutôt qu'un logiciel du marché ?",
        a: "Un logiciel du marché est idéal pour les besoins standards (comptabilité, facturation). Le sur-mesure devient rentable quand ton organisation est spécifique, quand tu jongles entre plusieurs outils ou quand ta méthode de travail est un avantage concurrentiel. On peut aussi combiner les deux.",
      },
      {
        q: 'Combien coûte une application métier ?',
        a: "À partir de 1 500 € pour un premier outil ciblé sur un besoin précis. Le prix dépend du nombre d'écrans, d'utilisateurs et d'intégrations. On commence souvent petit, puis on fait évoluer l'outil selon l'usage réel.",
      },
      {
        q: 'Mes données sont-elles en sécurité ?',
        a: "C'est une priorité : accès protégés par identifiant, droits par utilisateur, hébergement sécurisé et sauvegardes. On choisit ensemble où sont hébergées tes données, et elles restent les tiennes.",
      },
    ],
    related: ['automatisation-ia', 'creation-site-internet'],
    caseStudy: 'pwa-budget',
    relatedPosts: ['application-metier-sur-mesure-ou-logiciel', 'digitaliser-entreprise-artisanale-par-ou-commencer'],
    keywords: [
      'application métier sur mesure Montpellier',
      'développement PWA',
      'logiciel sur mesure TPE',
      'outil de gestion artisan',
    ],
  },
  {
    slug: 'automatisation-ia',
    icon: 'bot',
    accent: 'gradient',
    badge: 'Niveau 3 · IA & automatisation',
    name: 'Automatisation & intégration IA',
    promise: 'Faire bosser la tech à ta place.',
    summary:
      "Workflows automatisés (n8n) et intégrations d'IA sur mesure pour supprimer les tâches répétitives : devis, relances, emails, saisies. À partir de 3 000 €.",
    metaTitle: 'Automatisation et IA pour TPE à Montpellier (n8n)',
    metaDescription:
      "Automatise devis, relances, emails et saisies avec n8n et l'IA. Workflows sur mesure pour TPE et artisans, dès 3 000 €, conçus près de Montpellier.",
    h1: "Automatisation et intelligence artificielle pour les TPE de Montpellier et de l'Hérault",
    lead:
      "Les tâches répétitives te volent des heures chaque semaine. Je connecte tes outils entre eux et je mets l'IA au travail pour que les devis, relances, emails et saisies tournent tout seuls — avec toi aux commandes. À partir de 3 000 €.",
    priceFrom: 3000,
    priceLabel: 'À partir de 3 000 €',
    priceNote: 'Tarif selon le nombre de processus automatisés et les intégrations. Devis gratuit.',
    audience: [
      'Tu veux te développer sans embaucher pour des tâches administratives.',
      'Tu passes tes soirées sur les relances, les emails et la saisie.',
      'Des demandes clients se perdent entre ta boîte mail, ton téléphone et tes tableurs.',
      "Tu veux utiliser l'IA sérieusement, pas juste « tester ChatGPT ».",
    ],
    deliverables: [
      {
        title: 'Audit de tes process',
        desc: 'On repère ensemble les tâches répétitives qui te coûtent le plus de temps, et on priorise celles qui rapportent le plus.',
      },
      {
        title: 'Workflows automatisés avec n8n',
        desc: 'Formulaire → CRM → email → tableau de suivi : les informations circulent sans ressaisie.',
      },
      {
        title: "Intégrations d'IA sur mesure",
        desc: 'Tri et résumé des emails, brouillons de réponses, extraction de données de documents, assistants internes.',
      },
      {
        title: 'Relances et suivis automatiques',
        desc: "Devis non signés, factures impayées, demandes d'avis clients : plus rien ne passe entre les mailles.",
      },
      {
        title: 'Tes outils enfin connectés',
        desc: 'Agenda, messagerie, comptabilité, CRM, site web, tableurs : tes outils se parlent entre eux.',
      },
      {
        title: 'Des données maîtrisées',
        desc: 'n8n peut être auto-hébergé, les accès sont limités au strict nécessaire et le RGPD est pris en compte dès la conception.',
      },
    ],
    result: 'Les tâches répétitives tournent toutes seules. Tu te concentres sur ton métier et sur tes clients.',
    stack: ['n8n', 'API OpenAI, Anthropic, Mistral', 'Google Workspace', 'Microsoft 365', 'CRM'],
    faq: [
      {
        q: "C'est quoi n8n ?",
        a: "n8n est un outil d'automatisation qui relie tes logiciels entre eux sous forme de « workflows ». Exemple : une demande de devis sur ton site crée la fiche client, t'envoie une notification et programme une relance. Il est open source et peut être hébergé sur ton propre serveur.",
      },
      {
        q: "L'IA va-t-elle remplacer mes salariés ?",
        a: "Non. L'objectif est de retirer les tâches à faible valeur (ressaisie, tri, relances) pour libérer du temps sur ce qui compte : le terrain, le conseil, la relation client. Les décisions importantes restent humaines.",
      },
      {
        q: 'Mes données clients sont-elles envoyées à ChatGPT ?',
        a: "Seulement si c'est utile et avec ton accord. On limite les données transmises, on privilégie les offres professionnelles des fournisseurs d'IA et, si besoin, des alternatives européennes comme Mistral AI.",
      },
      {
        q: 'Que se passe-t-il si une automatisation tombe en panne ?',
        a: "Les workflows sont surveillés : en cas d'erreur, tu es alerté et rien ne disparaît. Je reste disponible pour la maintenance et les évolutions.",
      },
    ],
    related: ['application-metier', 'accompagnement-formation-ia'],
    relatedPosts: ['automatisations-ia-tpe-artisans', 'ia-generative-tpe-par-ou-commencer'],
    keywords: [
      'automatisation TPE Montpellier',
      'intégration IA entreprise',
      'consultant n8n',
      'intelligence artificielle artisan',
    ],
  },
  {
    slug: 'site-reservation-location-saisonniere',
    icon: 'bed',
    accent: 'emerald',
    badge: 'Offre clé en main · Hébergement',
    name: 'Site de réservation pour locations saisonnières',
    promise: 'Tes réservations en direct. Sans commission.',
    summary:
      'Site de réservation pour 1 à 4 logements ou chambres : réservation en direct, e-mail de confirmation, tableau de bord et synchronisation avec Booking.com. À partir de 250 €.',
    metaTitle: 'Site de réservation pour location saisonnière à Montpellier',
    metaDescription:
      'Loue en direct, sans commission : site de réservation pour 1 à 4 logements, e-mail de confirmation, tableau de bord, synchro Booking.com. Dès 250 €.',
    h1: "Site de réservation pour tes locations saisonnières à Montpellier et dans l'Hérault",
    lead:
      "Airbnb et Booking.com t'amènent des voyageurs, mais prennent une commission sur chaque séjour. Avec ton propre site, tes voyageurs réservent en direct : e-mail de confirmation automatique, tableau de bord simple, calendrier synchronisé avec Booking.com si tu y loues aussi. Pour 1 à 4 logements ou chambres, à partir de 250 €.",
    priceFrom: 250,
    priceLabel: 'À partir de 250 €',
    priceNote: 'Tableau de bord : 350 €. Maintenance à partir de 35 € par mois. Assistance, améliorations et personnalisation sur devis.',
    audience: [
      "Tu loues un appartement, une maison, un gîte ou quelques chambres d'hôtes : jusqu'à 4 logements ou chambres.",
      'Tu laisses une commission aux plateformes sur chaque séjour, même quand un voyageur revient chez toi.',
      'Tu veux un lien à donner à tes voyageurs fidèles, sur tes réseaux ou dans tes messages, pour réserver directement.',
      "Tu veux voir tes réservations et les visites de ton site en un coup d'œil, sans tableur.",
    ],
    audienceType: "Propriétaires de locations saisonnières, gîtes et chambres d'hôtes",
    deliverables: [
      {
        title: 'Un site de réservation pour tes logements',
        desc: "Jusqu'à 4 logements ou chambres, avec photos, descriptions et disponibilités. Pensé d'abord pour le téléphone, là où tes voyageurs réservent.",
      },
      {
        title: 'Réservation en direct et e-mail de confirmation',
        desc: 'Le voyageur choisit ses dates et réserve. Il reçoit aussitôt un e-mail de confirmation, et la réservation apparaît dans ton tableau de bord.',
      },
      {
        title: 'Un tableau de bord simple et efficace',
        desc: "Tes réservations, ton calendrier et le nombre de visites de ton site en un coup d'œil, sur ton téléphone comme sur ton ordinateur.",
      },
      {
        title: 'Photos et textes modifiables par toi',
        desc: 'Tu changes une photo ou une description toi-même, sans compétence technique et sans attendre personne.',
      },
      {
        title: 'Synchronisation avec Booking.com',
        desc: "Si tu loues aussi sur Booking.com, les calendriers se synchronisent : une nuit réservée d'un côté se ferme de l'autre, pour éviter les doubles réservations.",
      },
      {
        title: 'Maintenance et assistance',
        desc: "À partir de 35 € par mois, ton site est suivi et maintenu. Besoin d'une amélioration ou d'une fonction sur mesure ? On en parle, sur devis.",
      },
    ],
    extras: [
      'Version anglaise pour les voyageurs étrangers',
      "Arrivée autonome : code d'accès et consignes envoyés avant le séjour",
      "Demande d'avis après le séjour",
      'Nom de domaine et adresse e-mail à ton nom',
    ],
    result:
      'Tes voyageurs réservent chez toi, en direct : pas de commission sur ces séjours, ton propre site à partager, et tes réservations toujours sous les yeux.',
    faq: [
      {
        q: 'Combien coûte un site de réservation pour ma location ?',
        a: "Le site de réservation démarre à 250 €, le tableau de bord est à 350 € et la maintenance à partir de 35 € par mois. L'assistance, les améliorations et la personnalisation sont sur devis. Tu reçois un devis clair avant de t'engager.",
      },
      {
        q: 'Pour combien de logements ou de chambres ?',
        a: "Jusqu'à 4 : un appartement, une maison, un gîte ou quelques chambres d'hôtes. Au-delà, c'est un projet sur mesure, comme le site de réservation et de gestion créé pour l'Hôtel Le Saint Éloi à Montpellier (17 chambres).",
      },
      {
        q: 'Dois-je quitter Airbnb ou Booking.com ?',
        a: "Non. Ton site s'ajoute aux plateformes, il ne les remplace pas : elles t'amènent de nouveaux voyageurs, ton site te permet de recevoir en direct ceux qui reviennent ou qui te trouvent autrement. Avec Booking.com, les calendriers se synchronisent pour éviter les doubles réservations. Pour Airbnb, on regarde ensemble ce qui est possible selon ton annonce.",
      },
      {
        q: 'Pourrai-je modifier mon site moi-même ?',
        a: "Oui. Tu modifies tes photos et tes textes toi-même, sans compétence technique. Pour le reste, la maintenance et l'assistance sont là.",
      },
      {
        q: 'Mon site sera-t-il visible sur Google ?',
        a: "Il est rapide et bien structuré, ce qui aide Google à le comprendre, mais aucun classement ne peut être garanti. Pour une location, le levier le plus direct reste de partager ton lien : à tes voyageurs fidèles, sur tes réseaux et dans tes messages. Chaque réservation faite en direct est une réservation sans commission.",
      },
    ],
    related: ['creation-site-internet', 'application-metier'],
    caseStudy: 'hotel-le-saint-eloi',
    relatedPosts: ['prix-site-internet-tpe-montpellier'],
    keywords: [
      'site de réservation location saisonnière',
      'site Airbnb sans commission',
      'réservation en direct gîte Hérault',
      "site chambres d'hôtes Montpellier",
    ],
  },
  {
    slug: 'referencement-local-geo',
    icon: 'search',
    accent: 'emerald',
    badge: 'Inclus dans chaque projet',
    name: 'Référencement local & GEO',
    promise: 'Trouvé sur Google. Recommandé par les IA.',
    summary:
      'SEO local (Google, Google Maps) et GEO (Generative Engine Optimization) pour être trouvé sur Google et cité par ChatGPT, Perplexity et Gemini.',
    metaTitle: 'Référencement local et GEO à Montpellier (Google + IA)',
    metaDescription:
      'Sois trouvé sur Google Maps et recommandé par ChatGPT, Perplexity et Gemini : SEO local, Google Business Profile, données structurées et GEO, à Montpellier.',
    h1: 'Référencement local et GEO : être trouvé sur Google et recommandé par les IA',
    lead:
      "Tes clients ne cherchent plus seulement sur Google : ils posent aussi leurs questions à ChatGPT, Perplexity ou Gemini. J'optimise ta présence pour les deux — le SEO local pour Google Maps et la recherche classique, le GEO pour les moteurs de réponse IA.",
    priceLabel: 'Inclus dans les sites BabTech',
    priceNote: 'Audit et accompagnement seuls : sur devis, après un premier échange gratuit.',
    audience: [
      "Tu as un site, mais personne ne le trouve.",
      "Tes concurrents apparaissent dans Google Maps et pas toi.",
      'Tu veux savoir ce que ChatGPT ou Perplexity répondent quand on cherche ton métier dans ta ville.',
      'Tu veux des clients de ta zone, pas du trafic sans intérêt.',
    ],
    deliverables: [
      {
        title: 'Audit de visibilité Google + IA',
        desc: "Où apparais-tu sur Google, Google Maps et dans les réponses des IA ? Un diagnostic clair et un plan d'action priorisé.",
      },
      {
        title: 'Google Business Profile optimisé',
        desc: "Catégories, services, zone desservie, photos, publications et stratégie d'avis clients.",
      },
      {
        title: 'SEO technique et local',
        desc: 'Vitesse, balisage, données structurées, pages par service et par zone, maillage interne.',
      },
      {
        title: 'GEO : optimisation pour les moteurs IA',
        desc: "Contenus « réponse d'abord », FAQ structurées, fichier llms.txt, accès des robots IA (GPTBot, PerplexityBot, ClaudeBot…).",
      },
      {
        title: 'Une identité cohérente partout',
        desc: 'Même nom, même adresse, même téléphone et même activité sur ton site, Google, les annuaires et les réseaux.',
      },
      {
        title: 'Contenus et suivi',
        desc: 'Articles et pages locales, suivi dans Google Search Console et Bing Webmaster Tools, ajustements réguliers.',
      },
    ],
    result: "Tu apparais là où tes clients cherchent : dans Google, dans Google Maps et dans les réponses des assistants IA.",
    stack: ['Google Search Console', 'Bing Webmaster Tools', 'IndexNow', 'Schema.org', 'llms.txt'],
    faq: [
      {
        q: "C'est quoi le GEO ?",
        a: "Le GEO (Generative Engine Optimization) regroupe les techniques pour qu'un assistant IA comme ChatGPT, Perplexity ou Gemini cite ton entreprise dans ses réponses. Il s'appuie sur un bon SEO, des informations factuelles et structurées, et une identité cohérente partout sur le web.",
      },
      {
        q: 'En combien de temps voit-on des résultats ?',
        a: "Une fiche Google Business Profile bien optimisée peut progresser en quelques semaines. Sur les recherches concurrentielles, compte plutôt plusieurs mois. Le référencement est un travail de fond : ce qui est construit reste.",
      },
      {
        q: 'Peux-tu garantir la première place sur Google ?',
        a: "Non, et méfie-toi de ceux qui le promettent : personne ne contrôle l'algorithme de Google. Ce que je garantis, c'est une méthode sérieuse, des actions concrètes et un suivi transparent de tes résultats.",
      },
      {
        q: 'Une petite entreprise peut-elle vraiment être citée par ChatGPT ?',
        a: "Oui. Quand un assistant IA fait une recherche sur le web pour répondre, il privilégie des sources claires, factuelles et cohérentes. Une TPE locale bien structurée en ligne a toutes ses chances sur les questions de sa zone et de son métier.",
      },
    ],
    related: ['creation-site-internet', 'accompagnement-formation-ia'],
    relatedPosts: ['geo-referencement-ia-chatgpt-perplexity-gemini', 'seo-local-montpellier-google-business-profile'],
    keywords: [
      'référencement local Montpellier',
      'SEO local Hérault',
      'GEO ChatGPT Perplexity',
      'Google Business Profile Montpellier',
    ],
  },
  {
    slug: 'accompagnement-formation-ia',
    icon: 'users',
    accent: 'bronze',
    badge: 'Pour avancer durablement',
    name: 'Accompagnement digital & formation IA',
    promise: 'Monter en compétence. Garder la main.',
    summary:
      "Diagnostic digital, feuille de route et formation pratique à l'IA générative (ChatGPT, Claude, Gemini, Le Chat) pour les dirigeants et équipes de TPE.",
    metaTitle: 'Formation IA et accompagnement digital à Montpellier',
    metaDescription:
      "Formation pratique à l'IA générative (ChatGPT, Claude, Gemini, Mistral) et accompagnement digital pour dirigeants et équipes de TPE, à Montpellier ou à distance.",
    h1: "Accompagnement digital et formation à l'IA pour les dirigeants et équipes de TPE",
    lead:
      "Le digital et l'IA, ce n'est pas qu'une affaire d'outils : c'est une façon de travailler. Je t'aide à fixer tes priorités, à choisir les bons outils et à monter en compétence, toi et ton équipe — en individuel, en atelier ou au sein de la communauté BabTech.",
    priceLabel: 'Sur devis',
    priceNote: 'Format et durée adaptés à ton équipe. Premier échange gratuit.',
    audience: [
      "Tu sens que l'IA peut t'aider, mais tu ne sais pas par où commencer.",
      'Ton équipe utilise déjà ChatGPT « en cachette », sans règles ni méthode.',
      'Tu veux une feuille de route digitale réaliste, adaptée à ton budget.',
      'Tu préfères apprendre en pratiquant, sur tes vrais dossiers.',
    ],
    deliverables: [
      {
        title: 'Diagnostic et feuille de route digitale',
        desc: "Où en es-tu, quelles priorités, quel budget : un plan d'action concret à 3, 6 et 12 mois.",
      },
      {
        title: "Formation pratique à l'IA générative",
        desc: 'Ateliers sur tes cas réels avec ChatGPT, Claude, Gemini ou Le Chat de Mistral : emails, devis, contenus, synthèses.',
      },
      {
        title: 'Bonnes pratiques et sécurité',
        desc: "Confidentialité, RGPD, vérification des réponses : utiliser l'IA sans mettre ton entreprise en danger.",
      },
      {
        title: 'Des règles simples pour ton équipe',
        desc: "Une charte d'usage de l'IA claire : ce qu'on peut faire, avec quels outils, et ce qu'on évite.",
      },
      {
        title: 'Accompagnement dans la durée',
        desc: 'Des points réguliers pour avancer, lever les blocages et ajuster les outils à la réalité du terrain.',
      },
      {
        title: "Ateliers de groupe entre entrepreneurs",
        desc: "Apprendre avec d'autres dirigeants du coin et partager ce qui marche : c'est l'esprit de la communauté BabTech.",
      },
    ],
    result: "Tu sais quoi faire, dans quel ordre, et ton équipe utilise l'IA avec méthode et en confiance.",
    stack: ['ChatGPT', 'Claude', 'Gemini', 'Le Chat (Mistral AI)', 'Microsoft Copilot'],
    faq: [
      {
        q: "À qui s'adresse la formation à l'IA ?",
        a: "Aux dirigeants de TPE, artisans, commerçants, indépendants et à leurs équipes. Aucun prérequis technique : on part de ton métier et de tes tâches quotidiennes.",
      },
      {
        q: 'En présentiel ou à distance ?',
        a: "Les deux : en visio partout en France, et en présentiel à Montpellier et dans l'Hérault selon le format et la taille du groupe.",
      },
      {
        q: "Quels outils d'IA utilise-t-on ?",
        a: "Ceux qui correspondent à ton usage et à tes contraintes : ChatGPT, Claude, Gemini, Le Chat de Mistral AI ou Microsoft Copilot. L'important, c'est la méthode, qui reste valable quand les outils évoluent.",
      },
      {
        q: "Quel lien avec la communauté BabTech ?",
        a: "L'accompagnement individuel se prolonge dans la communauté : des groupes de travail et d'apprentissage où les entrepreneurs de la région progressent ensemble sur le digital et l'IA.",
      },
    ],
    related: ['automatisation-ia', 'referencement-local-geo'],
    relatedPosts: ['ia-generative-tpe-par-ou-commencer', 'digitaliser-entreprise-artisanale-par-ou-commencer'],
    keywords: [
      'formation IA Montpellier',
      'formation ChatGPT entreprise',
      'accompagnement digital TPE',
      'transformation numérique Hérault',
    ],
  },
]

export function getService(slug: string) {
  return services.find((s) => s.slug === slug)
}

function pick(...slugs: ServiceSlug[]): Service[] {
  return slugs.map((slug) => {
    const service = getService(slug)
    if (!service) throw new Error(`Service inconnu : ${slug}`)
    return service
  })
}

/** Les 3 niveaux de l'offre, dans l'ordre. */
export const levels = pick('creation-site-internet', 'application-metier', 'automatisation-ia')
/** Les offres clés en main, pour un métier précis. */
export const turnkey = pick('site-reservation-location-saisonniere')
/** Les expertises transversales. */
export const transversal = pick('referencement-local-geo', 'accompagnement-formation-ia')

/** Méthode commune à tous les projets. */
export const process = [
  {
    title: 'Écoute',
    desc: 'On parle de ton business, pas de technologie. Je comprends ton quotidien, tes blocages et tes objectifs.',
  },
  {
    title: 'Proposition',
    desc: 'Je te présente une solution claire, sans jargon. Tu sais exactement ce que tu vas avoir et pourquoi.',
  },
  {
    title: 'Réalisation',
    desc: "Je construis, tu valides à chaque étape. Pas d'effet tunnel, pas de mauvaise surprise.",
  },
  {
    title: 'Suivi',
    desc: "Ton projet ne s'arrête pas à la livraison. Tu as un interlocuteur, pas un ticket de support.",
  },
]
