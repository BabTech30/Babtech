export type ZoneSector = { name: string; need: string }
export type ZoneFaq = { q: string; a: string }

export type Zone = {
  slug: string
  name: string
  postalCode: string
  department: string
  /** French Wikipedia URL of the commune (used as schema.org sameAs) */
  wikipedia: string
  /** Short positioning relative to Montpellier, e.g. « Commune limitrophe de Montpellier, au nord-est » */
  situation: string
  /** <title> without brand, ≤ 55 chars, e.g. « Création de site internet à Sète » */
  metaTitle: string
  /** 140–160 chars, unique per city */
  metaDescription: string
  /** H1, unique, includes the city name and the main offer */
  h1: string
  /** 2–3 sentences, answer-first: who we help in this city and how */
  lead: string
  /** 3 paragraphs (70–120 words each): local economic fabric & its digital stakes, what local customers search for, why a local partner who knows the area helps */
  context: string[]
  /** 4 local business types with their typical digital need (1–2 sentences each) */
  sectors: ZoneSector[]
  /** 2–3 sentences: how we work together from/in this city (video call, in-person meeting in the area when useful, travel time from Montpellier stated vaguely e.g. « à une vingtaine de minutes de Montpellier » only if you are sure) */
  meeting: string
  /** 3 questions specific to this city (not generic), answers 2–4 sentences */
  faq: ZoneFaq[]
  /** 2–3 slugs of OTHER zones from this list, the geographically closest */
  nearby: string[]
  /** 4–6 neighbouring communes (names only, real neighbours) */
  nearbyTowns: string[]
}

export const zones: Zone[] = [
  {
    slug: 'castelnau-le-lez',
    name: 'Castelnau-le-Lez',
    postalCode: '34170',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Castelnau-le-Lez',
    situation: 'Commune limitrophe de Montpellier, au nord-est, sur la rive gauche du Lez',
    metaTitle: 'Création de site internet à Castelnau-le-Lez',
    metaDescription:
      'Site internet, fiche Google et prise de rendez-vous en ligne pour les cabinets, indépendants et commerces de Castelnau-le-Lez. Premier appel gratuit de 30 min.',
    h1: 'Création de site internet à Castelnau-le-Lez pour les cabinets et les indépendants',
    lead:
      "Je crée des sites internet, j'optimise les fiches Google et j'automatise la prise de rendez-vous des professions libérales, indépendants et commerçants de Castelnau-le-Lez. Objectif : que les habitants de Castelnau et de l'est montpelliérain te trouvent vite et te contactent sans attendre.",
    context: [
      "Castelnau-le-Lez vit au rythme de Montpellier tout en gardant son identité : une ville résidentielle où se sont installés de nombreux professionnels de santé, cabinets de conseil, agences et commerces de proximité, desservis par la ligne 2 du tram qui traverse la commune par l'avenue de l'Europe. Beaucoup vivent de la confiance et du bouche-à-oreille. Mais même un patient recommandé par un voisin vérifie en ligne avant d'appeler : fiche Google incomplète ou horaires faux, et il passe au cabinet suivant.",
      "Tes futurs clients tapent « ostéopathe Castelnau-le-Lez » ou « expert-comptable près de moi », ou posent la question à ChatGPT, Perplexity ou Gemini. En quelques secondes, ils veulent savoir ce que tu fais, quand tu es disponible, comment venir (tram, stationnement) et ce qu'en pensent les autres clients. Beaucoup cherchent le soir, sur leur téléphone, et préfèrent réserver en ligne plutôt qu'attendre l'ouverture du secrétariat. Un site clair, relié à ta fiche Google et à ton outil de réservation, répond à tout ça.",
      "Entre Castelnau, Montpellier, Jacou, Clapiers et Le Crès, les limites de communes ne se voient pas dans la rue, mais elles comptent pour Google : il faut décrire ta vraie zone de clientèle plutôt que multiplier les pages artificielles. Quelqu'un qui connaît le secteur t'évite ces erreurs. Ancien chef d'entreprise, je sais ce que pèsent l'accueil, les relances et les rendez-vous manqués en plus du métier. Je te propose des outils qui font gagner du temps, pas des gadgets.",
    ],
    sectors: [
      {
        name: 'Professionnels de santé libéraux',
        need: "Kinés, ostéopathes, infirmiers : un site sobre avec tes spécialités, l'accès au cabinet et ta prise de rendez-vous, dans le respect des règles de ta profession.",
      },
      {
        name: 'Avocats, experts-comptables et consultants',
        need: "Des pages claires par domaine d'intervention, un formulaire de premier contact qui trie les demandes et des relances automatiques pour les pièces manquantes.",
      },
      {
        name: 'Bien-être et services à la personne',
        need: 'Coachs, praticiens, esthéticiennes, aide à domicile : une réservation en ligne simple et des rappels automatiques pour limiter les rendez-vous oubliés.',
      },
      {
        name: 'Artisans de la rénovation',
        need: "Une galerie de réalisations, ta zone d'intervention entre Castelnau, Jacou et Le Crès, et un formulaire de devis qui récupère les bonnes infos.",
      },
    ],
    meeting:
      "Tout part d'un échange en visio de 30 minutes, offert, puis on avance à distance et tu valides chaque étape. Castelnau-le-Lez est aux portes de Montpellier : si ton projet le demande, je passe à ton cabinet ou à ta boutique. Et la communauté BabTech, qui se monte à Montpellier, te permettra d'échanger avec d'autres pros du coin.",
    faq: [
      {
        q: 'Mon cabinet est à Castelnau-le-Lez, mais une partie de mes clients vient de Montpellier : comment être visible des deux côtés ?',
        a: "Google s'appuie d'abord sur l'adresse de ta fiche Google Business Profile, puis sur ton site. On complète la fiche, on décrit ta vraie zone (Castelnau, l'est de Montpellier, les communes voisines) et on ajoute les infos pratiques, comme le tram ou le stationnement. Personne ne peut garantir la première place, mais tu mets toutes les chances de ton côté.",
      },
      {
        q: "Je suis professionnel de santé à Castelnau-le-Lez : ai-je le droit d'avoir un site internet ?",
        a: "Oui, un site d'information est tout à fait possible : ton parcours, tes actes, l'accès au cabinet, les modalités de rendez-vous. Chaque profession a ses règles de communication, alors on les vérifie ensemble avant la mise en ligne. Le ton reste factuel, sans promesse ni argument commercial.",
      },
      {
        q: "Mon cabinet à Castelnau-le-Lez reçoit trop d'appels pour des questions simples : qu'est-ce qu'on peut automatiser ?",
        a: 'Pas mal de choses : réponses automatiques aux demandes reçues par formulaire, rappels de rendez-vous, envoi des documents à préparer avant la première séance. Avec n8n, je relie tes outils pour que tout ça tourne seul, dès 3 000 €. Une FAQ claire sur ton site règle déjà une partie du problème.',
      },
    ],
    nearby: ['lattes', 'mauguio', 'saint-jean-de-vedas'],
    nearbyTowns: ['Montpellier', 'Clapiers', 'Jacou', 'Le Crès', 'Saint-Aunès'],
  },
  {
    slug: 'lattes',
    name: 'Lattes',
    postalCode: '34970',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Lattes',
    situation: 'Commune limitrophe de Montpellier, au sud, traversée par le Lez',
    metaTitle: 'Site internet et référencement local à Lattes',
    metaDescription:
      'Commerces, restaurants de Port Ariane, agences et artisans de Lattes : site internet, fiche Google et SEO local pour être trouvé. Premier appel gratuit.',
    h1: 'Site internet et référencement local pour les commerces et entreprises de Lattes',
    lead:
      "À Lattes, je crée des sites internet et je travaille le référencement local des commerces, restaurants, agences et entreprises de services, de Port Ariane à Boirargues. Le but : que les clients qui cherchent sur Google Maps ou auprès d'une IA tombent sur toi.",
    context: [
      "Lattes, c'est plusieurs visages dans une même commune : Lattes-Centre, Maurin, Boirargues et ses zones commerciales, les quais de Port Ariane au bord du Lez, et les espaces naturels de l'étang du Méjean. On y trouve des enseignes de toutes tailles, des restaurants, des agences immobilières, des sièges d'entreprises et beaucoup d'indépendants. L'enjeu digital : sortir du lot dans un secteur très concurrentiel, où un concurrent qui soigne déjà sa fiche Google n'est jamais loin, et te faire connaître des nouveaux habitants.",
      "Dans une zone commerciale, on cherche souvent juste avant de prendre la voiture, voire sur le parking : « magasin de literie Lattes », « ouvert le dimanche », « restaurant Port Ariane terrasse ». Les clients veulent des horaires exacts, l'itinéraire, des photos, des avis, et savoir si ce qu'ils cherchent est disponible. Les habitants, eux, cherchent leur artisan ou leur agence au plus près de chez eux. Et quand ils interrogent une IA, ce sont les infos précises et à jour qui ont le plus de chances d'être reprises.",
      "Lattes est éclatée entre plusieurs pôles, et ta clientèle vient souvent aussi de Montpellier, de Pérols ou de Palavas-les-Flots. Ta stratégie doit s'appuyer sur les bons repères (Port Ariane, Boirargues, la ligne 3 du tram), décrire ta vraie zone de chalandise et parler de ce qui compte pour les gens du coin, plutôt qu'aligner des mots-clés. Quelqu'un qui connaît ces réalités, et qui peut passer regarder ta fiche Google avec toi, t'évite pas mal d'erreurs de départ.",
    ],
    sectors: [
      {
        name: 'Restaurants et bars de Port Ariane',
        need: "Une carte en QR code modifiable en deux clics, une fiche Google à jour et un site qui donne envie de réserver au bord de l'eau.",
      },
      {
        name: 'Magasins indépendants des zones commerciales',
        need: "Une fiche Google impeccable, un site qui met en avant tes gammes et tes services, et des infos pratiques qui t'évitent les appels inutiles.",
      },
      {
        name: 'Agences immobilières',
        need: "Un site qui montre ta connaissance des quartiers de Lattes, un formulaire d'estimation bien pensé et un suivi automatique des contacts pour ne laisser filer aucun vendeur.",
      },
      {
        name: 'Garages et services automobiles',
        need: "Rendez-vous d'entretien en ligne, rappels automatiques avant la révision et avis récents sur Google, pour organiser l'atelier sans passer ta journée au téléphone.",
      },
    ],
    meeting:
      "Premier échange en visio, 30 minutes, offert : tu m'expliques ton activité, je te dis franchement ce qui vaut le coup. Ensuite on travaille à distance, et comme Lattes touche Montpellier, je passe volontiers à Port Ariane, à Boirargues ou ailleurs sur la commune quand c'est utile.",
    faq: [
      {
        q: "Mon magasin est dans une zone commerciale de Lattes : ai-je vraiment besoin d'un site en plus de ma fiche Google ?",
        a: 'La fiche Google capte surtout les clients déjà dans le secteur. Le site rassure ceux qui comparent avant de se déplacer : gammes, services, conseils, photos du magasin. Les deux se renforcent, et un site vitrine avec fiche Google optimisée démarre à 800 €.',
      },
      {
        q: "J'ai un restaurant à Port Ariane : comment attirer des clients au-delà des habitués du quartier ?",
        a: 'On soigne ta fiche Google (photos récentes, horaires, lien de réservation), on met ta carte en ligne avec un QR code que tu modifies toi-même, et on crée un site qui parle de ta cuisine et du cadre au bord du Lez. De quoi séduire ceux qui cherchent « restaurant Port Ariane » sur leur téléphone.',
      },
      {
        q: 'Je travaille à Lattes, Pérols et Montpellier : faut-il créer une page par ville ?',
        a: "Seulement si tu as quelque chose d'utile et de différent à dire pour chacune. Des pages identiques où seul le nom de la ville change n'apportent rien, ni à Google ni à tes clients. Mieux vaut une page principale solide, une fiche Google qui indique ta zone, et des pages locales seulement quand tu as du vrai contenu.",
      },
    ],
    nearby: ['perols', 'saint-jean-de-vedas', 'castelnau-le-lez'],
    nearbyTowns: [
      'Montpellier',
      'Pérols',
      'Palavas-les-Flots',
      'Villeneuve-lès-Maguelone',
      'Saint-Jean-de-Védas',
      'Mauguio',
    ],
  },
  {
    slug: 'perols',
    name: 'Pérols',
    postalCode: '34470',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Pérols',
    situation: "Au sud-est de Montpellier, entre l'étang de Pérols et l'étang de l'Or",
    metaTitle: 'Site internet et outils digitaux à Pérols',
    metaDescription:
      "À Pérols, près du Parc des Expositions et de l'Arena : site internet, suivi des contacts de salon et automatisations pour l'événementiel et le commerce.",
    h1: 'Site internet et outils digitaux à Pérols, au rythme des salons et des événements',
    lead:
      "À Pérols, j'aide les exposants, traiteurs, hôteliers, restaurateurs et commerçants à profiter de l'activité du Parc des Expositions et de la Sud de France Arena. Site internet, fiche Google et automatisations travaillent pour toi avant, pendant et après chaque événement.",
    context: [
      "Pérols a une particularité rare : le Parc des Expositions de Montpellier et la Sud de France Arena sont sur son territoire. Salons, foires, concerts, compétitions : le calendrier attire des visiteurs de toute la région, parfois en masse sur quelques jours. Autour, des zones d'activités, de grandes surfaces, un cœur de village héritier d'une tradition de pêche sur les étangs, et la mer tout près. L'enjeu digital : être prêt quand le flux arrive, et garder le contact après l'événement.",
      "Les recherches autour de Pérols suivent l'agenda : « restaurant près du Parc des Expositions », « hôtel près de l'Arena », « traiteur pour salon », « où manger à Pérols ce soir ». Les visiteurs arrivent en voiture ou par la ligne 3 du tram et cherchent tout sur leur téléphone, à la dernière minute. Si ta fiche Google affiche de mauvais horaires un soir d'événement, ils vont ailleurs. Côté entreprises, organisateurs et exposants comparent les prestataires sur leur site avant de demander un devis.",
      "Ici, l'activité ne suit pas seulement les saisons : un restaurant de Pérols peut être plein un soir de concert et calme le lendemain. Un partenaire qui connaît le secteur t'aide à anticiper, avec des offres activées selon le calendrier, une fiche Google tenue à jour et des relances après chaque événement. J'ai dirigé deux magasins : je sais ce que coûte un rush mal préparé. On construit des outils simples, faits pour les jours de forte affluence.",
    ],
    sectors: [
      {
        name: 'Exposants des foires et salons',
        need: "Un QR code sur ton stand, un formulaire rapide pour les contacts, puis des relances automatiques après le salon, au lieu d'une pile de cartes de visite.",
      },
      {
        name: 'Traiteurs et prestataires événementiels',
        need: "Un site qui montre tes réalisations et tes formules, avec un formulaire de devis qui demande la date, le lieu et le nombre d'invités.",
      },
      {
        name: 'Hôtels, restaurants et bars',
        need: "Horaires adaptés aux soirs d'événement, carte en ligne, accès depuis le Parc des Expositions ou le tram : tout doit être juste quand le public cherche.",
      },
      {
        name: 'Commerces du cœur de village',
        need: 'Face aux grandes surfaces voisines, une fiche Google soignée, des avis et un site qui raconte ton savoir-faire donnent aux habitants une raison de venir chez toi.',
      },
    ],
    meeting:
      "On cale un premier appel de 30 minutes en visio, sans frais, en dehors de tes jours de rush, puis le projet avance à distance. Pérols est à deux pas de Montpellier : quand c'est utile, je viens dans ton établissement, voire sur ton stand pendant un salon.",
    faq: [
      {
        q: 'Je fais plusieurs salons par an au Parc des Expositions : comment ne plus perdre les contacts récoltés sur mon stand ?',
        a: "On remplace les cartes de visite par un QR code et un formulaire court, rempli sur le téléphone du visiteur ou ta tablette. Chaque contact arrive dans ton tableau de suivi, et un workflow n8n envoie la relance après le salon. Ce type d'automatisation démarre à 3 000 €, mais une page dédiée au salon est déjà un bon début.",
      },
      {
        q: "Mon restaurant à Pérols tourne fort les soirs d'événement à l'Arena, beaucoup moins le reste du temps : que faire ?",
        a: "Les soirs d'événement, il faut être impeccable en ligne (horaires, réservation, carte, avis) pour capter les spectateurs qui cherchent à la dernière minute. Le reste du temps, on s'adresse aux habitants de Pérols et des communes voisines, avec une fiche Google active et des offres pour le midi ou le week-end.",
      },
      {
        q: 'Je suis traiteur à Pérols : comment recevoir des demandes de devis vraiment complètes ?',
        a: "Avec un formulaire qui pose les bonnes questions dès le départ : date, lieu, nombre d'invités, type de prestation, budget. Tu reçois une demande exploitable au lieu d'un simple « c'est combien ? ». Pour aller plus loin, un outil sur mesure peut préparer une base de devis, à partir de 1 500 €.",
      },
    ],
    nearby: ['lattes', 'mauguio', 'castelnau-le-lez'],
    nearbyTowns: ['Lattes', 'Mauguio', 'Palavas-les-Flots', 'Montpellier'],
  },
  {
    slug: 'saint-jean-de-vedas',
    name: 'Saint-Jean-de-Védas',
    postalCode: '34430',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Saint-Jean-de-Védas',
    situation: 'Commune limitrophe de Montpellier, au sud-ouest, au terminus de la ligne 2 du tram',
    metaTitle: 'Site web et outils métier à Saint-Jean-de-Védas',
    metaDescription:
      'PME, bâtiment et services à Saint-Jean-de-Védas : site web, outils métier sur mesure (PWA) et automatisations pour gagner du temps. Premier appel offert.',
    h1: 'Site web, outils métier et automatisation pour les entreprises de Saint-Jean-de-Védas',
    lead:
      "J'accompagne les PME, entreprises du bâtiment et sociétés de services de Saint-Jean-de-Védas : visibilité en ligne, mais surtout outils sur mesure et automatisations pour en finir avec les tableurs et les ressaisies. Du site vitrine à l'application métier, on avance étape par étape.",
    context: [
      "Saint-Jean-de-Védas est l'une des portes d'entrée économiques de la métropole : zones d'activités de La Lauze et Marcel Dassault, pôles commerciaux de La Condamine et de La Peyrière, nouveau quartier de Roque-Fraïsse, le tout desservi par l'A9 et le terminus de la ligne 2 du tram. On y croise des artisans du bâtiment, des négoces, des PME industrielles et des entreprises de services. Pour beaucoup, l'enjeu digital n'est pas seulement d'être vu, mais de mieux s'organiser, avec d'autres outils que ceux bricolés au démarrage.",
      "Les clients professionnels ne cherchent pas comme les particuliers. Un acheteur ou un maître d'ouvrage tape « menuiserie aluminium Montpellier », « location nacelle Saint-Jean-de-Védas » ou « électricien tertiaire Hérault », puis passe ton site au crible : savoir-faire, certifications, zone d'intervention, réactivité. Et de plus en plus de décideurs demandent à une IA de leur lister des prestataires locaux. Si ton site ne dit pas clairement ce que tu fais et où, tu n'apparais nulle part.",
      "Je viens du BTP : pendant 14 ans, j'ai géré une entreprise, ses équipes, ses devis et ses chantiers, souvent avec des outils qui ne se parlaient pas. C'est ce que je règle aujourd'hui pour les entreprises des zones d'activités : un suivi de chantier sur téléphone, un tableau de bord qui regroupe tes chiffres, des devis qui partent plus vite. Et être proche compte : je peux passer du temps dans tes locaux pour voir comment ton équipe travaille vraiment, avant d'écrire une ligne de code.",
    ],
    sectors: [
      {
        name: 'Entreprises du bâtiment et des travaux',
        need: 'Suivi de chantier sur téléphone, photos et rapports envoyés au bureau, planning partagé : une application web (PWA) pensée pour le terrain, à partir de 1 500 €.',
      },
      {
        name: 'Négoces et distributeurs professionnels',
        need: 'Un catalogue en ligne clair pour tes clients pros, un formulaire de demande de prix et des automatisations qui préparent les devis et relancent les clients silencieux.',
      },
      {
        name: 'PME industrielles et sous-traitants',
        need: "Un site B2B qui présente ton savoir-faire et tes capacités, et des tableaux de bord qui remplacent les fichiers Excel envoyés par mail d'un service à l'autre.",
      },
      {
        name: 'Entreprises de services et de maintenance',
        need: "Planning d'interventions, bons signés sur téléphone, rapport envoyé automatiquement au client : on digitalise le terrain et l'administratif en même temps.",
      },
    ],
    meeting:
      "Après un premier rendez-vous en visio (30 minutes, gratuit), on voit ensemble s'il faut se rencontrer. Pour un outil métier, c'est souvent utile : Saint-Jean-de-Védas est juste à côté de Montpellier, je viens observer tes process avec ton équipe. La suite se fait à distance, avec une démo à chaque étape.",
    faq: [
      {
        q: "Mon entreprise est dans une zone d'activités de Saint-Jean-de-Védas et travaille surtout en B2B : un site sert-il vraiment ?",
        a: "Oui : un acheteur qui ne te connaît pas commence par chercher ton nom en ligne. Un site B2B clair (savoir-faire, zone d'intervention, contact direct) te crédibilise face à des concurrents plus gros, et c'est la base pour être cité quand on demande à une IA des prestataires dans l'Hérault. Compte 800 € minimum pour un site vitrine.",
      },
      {
        q: 'Notre PME à Saint-Jean-de-Védas gère encore devis et planning sur Excel : par où commencer ?',
        a: 'Par un diagnostic simple : ce qui te fait perdre le plus de temps, ce qui provoque des erreurs. Souvent, un seul outil bien pensé (planning partagé, suivi des devis, tableau de bord) change le quotidien. Je le développe sur mesure, à partir de 1 500 €, puis on automatise le reste si besoin.',
      },
      {
        q: "Tu peux former mon équipe à l'IA directement dans nos locaux à Saint-Jean-de-Védas ?",
        a: "Oui, et c'est souvent plus efficace sur place, avec les cas concrets de ton équipe : devis, mails, synthèses de documents, premières automatisations. Et pour continuer à progresser ensuite, la communauté BabTech, qui se lance à Montpellier, réunira des entrepreneurs qui apprennent le digital et l'IA ensemble.",
      },
    ],
    nearby: ['lattes', 'castelnau-le-lez', 'perols'],
    nearbyTowns: ['Montpellier', 'Lattes', 'Villeneuve-lès-Maguelone', 'Fabrègues', 'Saussan', 'Lavérune'],
  },
  {
    slug: 'mauguio',
    name: 'Mauguio',
    postalCode: '34130',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Mauguio',
    situation: "Commune voisine de Montpellier, à l'est, qui s'étend jusqu'à la mer avec Carnon",
    metaTitle: 'Création de site internet à Mauguio et Carnon',
    metaDescription:
      "Commerces de Carnon, producteurs de la plaine, services proches de l'aéroport : site internet et fiche Google à Mauguio-Carnon, en saison comme hors saison.",
    h1: "Création de site internet à Mauguio et Carnon, pour exister toute l'année",
    lead:
      "À Mauguio et à Carnon, j'accompagne les commerçants, producteurs, loueurs saisonniers et entreprises de services qui veulent être trouvés en ligne, en saison comme hors saison. Site internet, fiche Google, outil de réservation ou de commande : on construit ce qui colle à ton rythme.",
    context: [
      "Mauguio est une commune à plusieurs vitesses. Le centre, l'ancienne Melgueil, vit toute l'année avec ses commerces et ses services. Autour, la plaine reste agricole, avec des maraîchers, des vergers et des vignes. Entre le bourg et Pérols, l'aéroport Montpellier-Méditerranée et ses zones d'activités attirent entreprises et voyageurs. Et côté mer, Carnon, avec son port de plaisance et ses plages, change de visage entre l'été et l'hiver. Chaque activité a ses besoins, mais un défi commun : ne pas dépendre uniquement du passage.",
      "Les recherches changent avec la saison. L'été, les vacanciers tapent « restaurant port de Carnon » ou « location paddle Carnon », souvent depuis la plage, sur leur téléphone. Toute l'année, les habitants cherchent un artisan, un commerce ou un producteur près de Mauguio. Les voyageurs, eux, cherchent un parking, une navette ou un hôtel près de l'aéroport. Et beaucoup préparent désormais leur séjour avec un assistant IA : si tes infos ne sont pas claires et à jour en ligne, tu n'apparais pas dans ses réponses.",
      "Sur un territoire pareil, connaître le coin évite des erreurs. Faut-il parler de Mauguio, de Carnon, ou des deux ? Selon ton activité, la réponse change, et elle se règle dès la construction du site et de la fiche Google. Je t'aide aussi à préparer la saison avant qu'elle démarre, puis à garder le lien avec tes clients l'hiver : offres hors saison, messages de réouverture, relances automatiques. Ancien chef d'entreprise, je sais qu'un pic d'activité s'anticipe.",
    ],
    sectors: [
      {
        name: 'Maraîchers et arboriculteurs de la plaine',
        need: 'Précommande de paniers, créneaux de retrait, horaires de vente à la ferme : un outil simple pour vendre en direct aux habitants de Mauguio et de la métropole.',
      },
      {
        name: 'Restaurants et commerces de Carnon',
        need: "Une fiche Google active, une carte en QR code que tu adaptes à la saison, et des horaires qui collent à la réalité de l'été comme de l'hiver.",
      },
      {
        name: 'Locations saisonnières et conciergeries',
        need: "Un site pour réserver en direct et des messages automatiques d'arrivée, de consignes et de demande d'avis, pour moins dépendre des plateformes.",
      },
      {
        name: "Services autour de l'aéroport",
        need: 'Parkings, navettes, location de véhicules : les voyageurs réservent sur mobile, souvent au dernier moment, et veulent un site rapide, des tarifs clairs et une confirmation immédiate.',
      },
    ],
    meeting:
      "On fait connaissance en visio, 30 minutes, gratuitement, puis on travaille à distance. Mauguio est à une dizaine de kilomètres de Montpellier : je viens volontiers au bourg, à Carnon ou sur ton exploitation quand c'est utile. Pour une activité saisonnière, le bon moment pour lancer le projet, c'est l'hiver.",
    faq: [
      {
        q: "Mon activité à Carnon tourne surtout l'été : comment ne pas disparaître le reste de l'année ?",
        a: "En restant actif hors saison : fiche Google à jour avec tes horaires d'hiver, quelques publications, et un fichier clients que tu recontactes au bon moment. Un workflow automatique peut envoyer une offre de réouverture à ceux qui sont déjà venus. Et c'est l'hiver qu'on prépare, au calme, le site de la saison suivante.",
      },
      {
        q: 'Sur mon site, je parle de Mauguio, de Carnon ou des deux ?',
        a: 'Ça dépend de qui te cherche : un vacancier tape « Carnon », un habitant de la plaine pense « Mauguio ». On utilise les deux noms naturellement, selon où tu es installé et la clientèle que tu vises, avec une adresse exacte sur ta fiche Google, et sans bourrer tes pages de mots-clés.',
      },
      {
        q: "Je suis producteur dans la plaine de Mauguio : vendre en direct en ligne, c'est réaliste ?",
        a: "Oui, si l'outil reste simple pour toi comme pour tes clients. Une application de précommande (paniers, créneaux de retrait, produits du moment) t'évite les messages dans tous les sens. Je la développe sur mesure dès 1 500 €, et on peut démarrer par une page avec tes horaires et tes produits de saison.",
      },
    ],
    nearby: ['perols', 'castelnau-le-lez', 'lunel'],
    nearbyTowns: ['La Grande-Motte', 'Palavas-les-Flots', 'Saint-Aunès', 'Mudaison', 'Candillargues', 'Lansargues'],
  },
  {
    slug: 'lunel',
    name: 'Lunel',
    postalCode: '34400',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Lunel',
    situation: "À une vingtaine de kilomètres à l'est de Montpellier, en direction de Nîmes",
    metaTitle: 'Digitalisation des TPE à Lunel : site, outils, IA',
    metaDescription:
      "Vignerons du Muscat de Lunel, manades, commerces et artisans : je t'aide à digitaliser ta TPE à Lunel pas à pas, du site internet à l'IA. Premier appel gratuit.",
    h1: 'Digitalisation des TPE à Lunel : site internet, outils et IA, pas à pas',
    lead:
      "Je t'aide à digitaliser ta TPE à Lunel et dans le Pays de Lunel, à ton rythme : site internet, fiche Google, outils de gestion, puis automatisations et IA quand ça a du sens. Pour les vignerons, manades, commerces et artisans du coin.",
    context: [
      "Lunel, la ville des Pescalunes, a un vrai caractère : porte de la Petite Camargue, terre du Muscat de Lunel, ville taurine où la course camarguaise fait partie de la vie locale. Son économie repose sur des TPE : vignerons, commerces du centre-ville, artisans, entreprises des zones d'activités, sans oublier les manades des environs. Beaucoup ont bâti leur réputation sur le bouche-à-oreille. Le défi, aujourd'hui, c'est que cette réputation se voie aussi en ligne, là où les nouveaux clients vont la vérifier.",
      "Les clients de Lunel viennent de partout : des villages du Pays de Lunel, du Gard voisin de l'autre côté du Vidourle, de Montpellier et, l'été, des touristes en route vers la Petite Camargue ou les plages. Ils tapent « caveau muscat Lunel », « journée en manade » ou « plombier Lunel ». Ils veulent des horaires fiables, des avis, un numéro qui répond et, de plus en plus, pouvoir réserver ou commander en ligne. Sinon, ils appellent le suivant.",
      "Un partenaire qui connaît le coin sait que le calendrier lunellois a ses temps forts : vendanges, fêtes et courses camarguaises, saison touristique. Je ne vais pas te proposer de tout digitaliser d'un coup : j'ai dirigé une TPE pendant 14 ans, je sais qu'on n'a ni le temps ni l'envie de tout changer en même temps. On commence par l'essentiel, souvent une fiche Google solide et un site clair, puis on ajoute un outil, une automatisation ou une formation à l'IA au bon moment.",
    ],
    sectors: [
      {
        name: 'Vignerons et caves du Muscat de Lunel',
        need: 'Un site qui raconte ton domaine et ton muscat, des horaires de caveau à jour sur Google et la réservation des dégustations ou des commandes de fêtes.',
      },
      {
        name: 'Manades et activités camarguaises',
        need: "Journées en manade, balades à cheval, accueil de groupes : un calendrier clair, des demandes de réservation complètes et l'essentiel traduit pour les visiteurs étrangers.",
      },
      {
        name: 'Commerces du centre-ville',
        need: 'Fiche Google soignée, avis clients, click & collect ou réservation : de quoi donner aux habitants de bonnes raisons de faire leurs achats en cœur de ville.',
      },
      {
        name: 'Artisans et entreprises du bâtiment',
        need: "Tes réalisations, ta zone d'intervention des deux côtés du Vidourle, et une application de suivi de chantier pour ne plus courir après les infos.",
      },
    ],
    meeting:
      "On se parle d'abord 30 minutes en visio, sans engagement. Lunel est à une vingtaine de kilomètres de Montpellier : quand le projet s'y prête, je viens te voir au caveau, en boutique ou sur ton exploitation. Le reste se fait à distance, avec ton feu vert à chaque étape.",
    faq: [
      {
        q: "Je suis vigneron en Muscat de Lunel : un site peut-il vraiment m'aider à vendre en direct ?",
        a: "Il t'aide surtout à être trouvé par ceux qui cherchent un caveau, un cadeau ou une dégustation entre Montpellier et Nîmes. Un site clair, relié à une fiche Google à jour, donne envie de passer. Pour les précommandes de fin d'année ou les visites de groupes, un outil dédié est possible, à partir de 1 500 €.",
      },
      {
        q: 'À Lunel, beaucoup de mes clients viennent du Gard : comment les toucher aussi ?',
        a: "Lunel touche le Gard, de l'autre côté du Vidourle. On décrit ta vraie zone d'intervention sur ta fiche Google et sur ton site, avec des infos utiles pour les communes où tu travailles, plutôt qu'une liste de villes. Google comme tes clients savent alors jusqu'où tu te déplaces.",
      },
      {
        q: "Je n'ai jamais rien fait côté digital pour ma TPE à Lunel : par quoi je commence ?",
        a: "Par un appel gratuit de 30 minutes, pour faire le point sur l'existant et ce qui te fait perdre du temps. Souvent, la première étape est une fiche Google complète et un site vitrine simple, dès 800 €. Ensuite, on voit ensemble si un outil de gestion, une automatisation ou une formation à l'IA s'impose.",
      },
    ],
    nearby: ['mauguio', 'perols', 'castelnau-le-lez'],
    nearbyTowns: ['Lunel-Viel', 'Marsillargues', 'Saint-Just', 'Saturargues', 'Aimargues', 'Gallargues-le-Montueux'],
  },
  {
    slug: 'sete',
    name: 'Sète',
    postalCode: '34200',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Sète',
    situation:
      "Sur le littoral, à une trentaine de kilomètres au sud-ouest de Montpellier, entre la mer et l'étang de Thau",
    metaTitle: 'Création de site web à Sète et sur le bassin de Thau',
    metaDescription:
      'Tu cherches une agence web à Sète ? Site internet, SEO local et outils sur mesure pour les pros de la mer, du tourisme et du commerce sétois. Appel offert.',
    h1: "Création de site internet à Sète : l'alternative simple à l'agence web",
    lead:
      "À Sète et autour de l'étang de Thau, je conçois des sites internet et des outils sur mesure pour les restaurateurs, conchyliculteurs, commerçants et entreprises du port. Un seul interlocuteur, et un site pensé autant pour les Sétois que pour les visiteurs de l'été.",
    context: [
      "Surnommée « l'île singulière », Sète ne ressemble à aucune autre ville de l'Hérault. Elle vit de son port (pêche, commerce, plaisance), de la conchyliculture sur l'étang de Thau, de ses restaurants et de ses commerces, et d'un tourisme qui culmine l'été entre les canaux, le mont Saint-Clair, la Corniche et les plages du lido. Ici, le savoir-faire et la réputation comptent. L'enjeu digital : les montrer en ligne sans perdre ton authenticité, et lisser une activité très marquée par les saisons.",
      "Les recherches mélangent Sétois et visiteurs. Les habitants cherchent un artisan ou un restaurant ouvert hors saison. Les touristes tapent « restaurant tielle Sète », « dégustation huîtres étang de Thau » ou « sortie en mer Sète », parfois en anglais ou en espagnol, souvent en marchant le long des quais. Ils veulent la carte, les photos, les avis, et réserver vite. Quand ils demandent à une IA où manger des coquillages près de Sète, les entreprises bien décrites en ligne ont plus de chances d'être citées.",
      "Un partenaire qui connaît le bassin de Thau sait qu'on ne vend pas des huîtres comme des chaussures, et qu'un restaurant sur le quai n'a pas les contraintes d'une boutique du centre. Je t'aide à parler aux deux publics, à préparer l'été dès le printemps et à garder le lien avec ta clientèle locale le reste de l'année. Pas de modèle tout fait : un site à ton image, que tu mets à jour toi-même, sans dépendre d'un prestataire à chaque changement de carte.",
    ],
    sectors: [
      {
        name: "Conchyliculteurs de l'étang de Thau",
        need: 'Un site qui raconte ton métier et ton mas, des horaires de vente fiables sur Google et la précommande en ligne pour les fêtes, quand le téléphone sonne sans arrêt.',
      },
      {
        name: 'Restaurants du port et des canaux',
        need: "Une carte en QR code traduite, modifiable selon l'arrivage, une fiche Google avec des photos récentes et des horaires calés sur la saison.",
      },
      {
        name: 'Commerces et artisans du centre-ville',
        need: "Une fiche Google impeccable, des avis entretenus et un site simple pour exister auprès des Sétois toute l'année, pas seulement pendant le rush de l'été.",
      },
      {
        name: 'Entreprises du port et de la plaisance',
        need: 'Entretien de bateaux, gardiennage, sorties en mer : un site clair sur tes prestations, des demandes de devis complètes et un planning partagé.',
      },
    ],
    meeting:
      "Premier contact : 30 minutes en visio, gratuites, pour comprendre ton activité et tes saisons. Le projet avance ensuite à distance, et je viens à Sète quand c'est utile, au mas, au restaurant ou sur le port. Par l'autoroute comme par le train, Sète est facile d'accès depuis Montpellier.",
    faq: [
      {
        q: "Pourquoi choisir un freelance plutôt qu'une agence web à Sète ?",
        a: "Tu parles directement à celui qui conçoit et construit ton site : pas d'intermédiaire, pas de projet qui passe de main en main. Les tarifs sont pensés pour une TPE, à partir de 800 € pour un site vitrine, référencement local compris. Et je tiens compte d'une réalité très sétoise : on ne travaille pas au même rythme en août qu'en février.",
      },
      {
        q: "Mon restaurant à Sète reçoit beaucoup de touristes étrangers l'été : faut-il un site en plusieurs langues ?",
        a: "Pas forcément tout le site, mais au moins l'essentiel : ta carte, tes horaires, l'accès et la réservation. Une carte en QR code peut s'afficher dans la langue du téléphone du client. On choisit les langues selon ta clientèle réelle, sans alourdir tes mises à jour.",
      },
      {
        q: 'Je suis conchyliculteur à Sète : comment gérer les commandes des fêtes sans y passer mes nuits ?',
        a: "Avec un outil de précommande en ligne : tes clients choisissent leurs produits, la quantité et un créneau de retrait, et tu reçois une liste claire, triée par jour. Fini les dizaines d'appels notés sur un carnet. Compte à partir de 1 500 € pour ce type d'application.",
      },
    ],
    nearby: ['saint-jean-de-vedas', 'lattes', 'beziers'],
    nearbyTowns: ['Frontignan', 'Marseillan', 'Mèze', 'Bouzigues', 'Loupian'],
  },
  {
    slug: 'beziers',
    name: 'Béziers',
    postalCode: '34500',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Béziers',
    situation: "Deuxième ville de l'Hérault, à environ une heure de route à l'ouest de Montpellier",
    metaTitle: 'Développeur web à Béziers et dans le Biterrois',
    metaDescription:
      'Développeur web freelance à Béziers : site internet, outils métier et automatisations pour les domaines viticoles, commerces et acteurs du Canal du Midi.',
    h1: 'Développeur web freelance pour les entreprises de Béziers et du Biterrois',
    lead:
      "Développeur web freelance, j'accompagne les domaines viticoles, commerces, pros du tourisme et artisans de Béziers et du Biterrois : site internet, outils de gestion sur mesure et automatisations. On travaille en visio au quotidien, et sur place quand il le faut.",
    context: [
      "Deuxième ville de l'Hérault, Béziers est le cœur du Biterrois, grand territoire viticole. Son patrimoine attire du monde : la cathédrale Saint-Nazaire qui domine l'Orb, le Canal du Midi imaginé par Pierre-Paul Riquet, enfant de la ville, et les écluses de Fonseranes. Ajoute une vraie culture du rugby et une feria qui fait vibrer la ville autour du 15 août. Pour les domaines, les commerces et les TPE, l'enjeu digital : capter une clientèle locale fidèle et des visiteurs de passage.",
      "À Béziers, les recherches sont très concrètes : « électricien Béziers », « restaurant allées Paul-Riquet », « caveau dégustation Biterrois », « location vélo Canal du Midi ». Les habitants veulent un pro fiable, proche, avec des avis. Les visiteurs préparent souvent leur séjour en ligne, parfois depuis l'étranger, et certains découvrent la ville en suivant le canal à vélo ou en bateau. Ils comparent, réservent et demandent de plus en plus conseil à une IA. Sans site clair ni fiche Google complète, tu passes à côté.",
      "Basé près de Montpellier, je connais l'Hérault, ses TPE et la réalité d'un patron qui gère tout de front : pendant 14 ans, j'ai dirigé une entreprise avec deux magasins et huit salariés. Je sais aussi que le centre-ville de Béziers et les zones de périphérie comme Montimaran ne jouent pas avec les mêmes armes, et que ta stratégie doit en tenir compte. Ce que je t'apporte : un regard de chef d'entreprise et des outils concrets.",
    ],
    sectors: [
      {
        name: 'Domaines et caves du Biterrois',
        need: "Un site à l'image de ton terroir et de tes cuvées, des horaires de caveau fiables sur Google et la réservation en ligne des visites et dégustations.",
      },
      {
        name: 'Tourisme autour du Canal du Midi',
        need: "Loueurs de vélos ou de bateaux, chambres d'hôtes, guides : l'essentiel en plusieurs langues, une réservation simple et des infos pratiques pour ceux qui suivent le canal.",
      },
      {
        name: 'Restaurants et bars du centre',
        need: 'Carte en QR code, fiche Google à jour et réservation en ligne, avec des horaires calés sur la feria ou les soirs de match.',
      },
      {
        name: 'Artisans et PME du Biterrois',
        need: "Devis plus rapides, suivi de chantier sur téléphone, relances automatiques des factures : des outils sur mesure pour passer moins de temps sur l'administratif.",
      },
    ],
    meeting:
      "La première étape, c'est un appel visio gratuit de 30 minutes, et un projet avance bien à distance. Béziers est à environ une heure de route de Montpellier : quand se voir apporte vraiment quelque chose, pour un lancement ou une formation, je fais le déplacement.",
    faq: [
      {
        q: "Tu es basé près de Montpellier : c'est un problème pour un projet à Béziers ?",
        a: "Non. L'essentiel du travail se fait en visio et par écran partagé, avec une validation à chaque étape, aussi efficace à une heure de route qu'à cinq minutes. Pour les moments où se voir compte vraiment, comme le lancement ou une formation de ton équipe, je viens à Béziers. Et je réponds sous 24h.",
      },
      {
        q: 'Mon activité à Béziers vit en partie du Canal du Midi : comment capter les touristes qui préparent leur voyage ?',
        a: "En étant présent là où ils préparent leur itinéraire : Google Maps, les recherches comme « location vélo Béziers » ou « chambre d'hôtes près des écluses de Fonseranes », et les assistants IA. Il te faut une fiche Google complète, un site rapide sur mobile avec l'essentiel en anglais, et des infos claires : horaires, accès, tarifs.",
      },
      {
        q: "Mon commerce est en centre-ville de Béziers : face aux zones commerciales, le digital peut-il m'aider ?",
        a: 'Il peut rendre ta boutique plus facile à trouver et à choisir. Une fiche Google bien tenue, des avis récents, un site qui montre tes produits et ton conseil, et pourquoi pas le click & collect, donnent aux clients de bonnes raisons de venir en ville. On démarre petit, dès 800 €, puis on ajuste selon ce qui fonctionne.',
      },
    ],
    nearby: ['sete', 'saint-jean-de-vedas'],
    nearbyTowns: [
      'Villeneuve-lès-Béziers',
      'Boujan-sur-Libron',
      'Sauvian',
      'Lignan-sur-Orb',
      'Maraussan',
      'Colombiers',
    ],
  },
]

export function getZone(slug: string): Zone | undefined {
  return zones.find((z) => z.slug === slug)
}
