import type { ServiceSlug } from './services'

export type ZoneSector = { name: string; need: string }
export type ZoneFaq = { q: string; a: string }
export type Department = 'Hérault' | 'Gard'

export type Zone = {
  slug: string
  name: string
  postalCode: string
  department: Department
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
  /** Service le plus utile localement (ex. site de réservation dans les villes touristiques), mis en avant sur la page. */
  featured?: ServiceSlug
}

export const zones: Zone[] = [
  {
    slug: 'montpellier',
    name: 'Montpellier',
    postalCode: '34000',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Montpellier',
    situation: "Préfecture de l'Hérault et ville de rattachement de BabTech",
    metaTitle: "Studio web à Montpellier, de l'Écusson à Port Marianne",
    metaDescription:
      "Boutiques de l'Écusson, cabinets, artisans, hébergeurs : ton site, ta fiche Google et tes outils sur mesure, partout dans Montpellier. Premier appel offert.",
    h1: 'Site internet et outils sur mesure à Montpellier, quartier par quartier',
    lead:
      "À Montpellier, je travaille avec les commerçants, restaurateurs, professions de santé, artisans et hébergeurs : site internet, fiche Google soignée et outils sur mesure. De l'Écusson à Port Marianne, de Celleneuve aux Prés d'Arènes, chaque quartier a sa clientèle : ton site doit parler à la tienne.",
    context: [
      "Préfecture de l'Hérault, Montpellier réunit des mondes très différents. Dans l'Écusson, le centre historique en grande partie piéton, boutiques, bars et restaurants se partagent les ruelles. Le CHU et les universités font vivre soins, recherche et formation dans une ville très étudiante. L'économie s'appuie aussi sur le numérique, les biotechnologies et la pharmacie, avec des pôles d'activités comme le Millénaire ou Garosud, et le Polygone comme Odysseum attirent les amateurs de shopping. Ajoute les festivals, les musées et le patrimoine qui font venir les visiteurs. L'enjeu digital : te démarquer, quand un client trouve la même offre à quelques rues.",
      "Ici, on cherche sur son téléphone, souvent avec le nom du quartier : « coiffeur Beaux-Arts », « brunch Écusson dimanche », « kiné près de Lapeyronie ». Les étudiants lisent les avis avant de pousser une porte, les visiteurs tapent « que faire à Montpellier ce week-end », et les pros demandent à ChatGPT ou à Gemini de leur conseiller un expert-comptable. Dans un centre où l'on vient à pied ou en tram, une question compte : comment venir ? Arrêt de tram, parking de la Comédie ou du Corum, horaires exacts : si ta fiche Google et ton site n'y répondent pas, le client choisit la vitrine voisine.",
      "Quelqu'un qui connaît Montpellier sait qu'une boutique de l'Écusson, un cabinet près des hôpitaux et une entreprise de Garosud ne vivent pas au même rythme : clients à pied ou en voiture, rentrée universitaire, festivals, fêtes de fin d'année. Je t'aide à t'adresser aux gens de ton quartier sans te couper du reste de la métropole. J'ai été patron à 22 ans : je sais qu'un outil ne vaut que par le temps qu'il te fait gagner. Et c'est à Montpellier que je lance la communauté BabTech, pour que les dirigeants du coin progressent ensemble sur le digital et l'IA.",
    ],
    sectors: [
      {
        name: "Boutiques, bars et restaurants de l'Écusson",
        need: 'En centre piéton, ta fiche Google doit dire comment venir (arrêt de tram, parking de la Comédie ou du Corum) et afficher des horaires exacts. Ajoute une carte en QR code ou un catalogue en ligne que tu modifies toi-même.',
      },
      {
        name: 'Cabinets de santé et professions libérales',
        need: "Kinés, dentistes, avocats, experts-comptables : un site sobre sur tes domaines et l'accès au cabinet, la prise de rendez-vous en ligne et des rappels automatiques, en suivant les règles de communication de ta profession.",
      },
      {
        name: 'Artisans et dépanneurs de la métropole',
        need: "Ta zone d'intervention décrite quartier par quartier, un formulaire qui récupère l'adresse et les photos du problème, et une application pour suivre tes chantiers sans ressaisir tes notes le soir.",
      },
      {
        name: "Hôtels, meublés et chambres d'hôtes",
        need: "Des réservations en direct, sans commission, avec les calendriers d'Airbnb et de Booking.com synchronisés par iCal toutes les quelques heures. Au-delà de 4 logements ou chambres, on part sur un outil sur mesure.",
      },
    ],
    meeting:
      "On commence par un appel découverte de 30 minutes, offert, en visio ou par téléphone. Je suis basé tout près : je peux passer dans ta boutique, ton cabinet ou ton atelier dès que c'est utile, aux Beaux-Arts comme à Port Marianne ou à la Croix-d'Argent. Entre deux rendez-vous, tu vois ton projet avancer étape par étape, et je te réponds sous 24 h.",
    faq: [
      {
        q: "Ma boutique est dans l'Écusson, en zone piétonne : comment aider mes clients à venir jusqu'à moi ?",
        a: "Commence par ta fiche Google : adresse exacte, photo de ta devanture, horaires à jour et un mot sur l'accès, comme l'arrêt de tram le plus proche ou le parking de la Comédie ou du Corum. Sur ton site, une page « Venir » reprend ces infos avec un plan. Tes clients arrivent sans tourner dans les ruelles, et les IA qui décrivent ton commerce s'appuient sur des infos justes.",
      },
      {
        q: 'Ma clientèle est en grande partie étudiante : comment la toucher à chaque rentrée ?',
        a: "Chaque septembre, de nouveaux étudiants découvrent la ville, téléphone en main : ta fiche Google, les avis et tes photos font la première impression. On prépare la rentrée dès l'été, avec des horaires à jour, une offre claire et un site qui s'affiche vite sur téléphone. Ensuite, un fichier clients et quelques messages automatiques aident à fidéliser ceux qui t'ont découvert.",
      },
      {
        q: "À Montpellier, j'ai le choix entre beaucoup d'agences web : qu'est-ce qui te distingue ?",
        a: "Un seul interlocuteur du premier appel à la mise en ligne, celui qui conçoit et développe ton projet, avec des tarifs pensés pour une TPE : site vitrine dès 800 €. J'ai dirigé une entreprise pendant 14 ans, alors je pense à ton temps et à tes clients avant la technique. Et mon premier gros projet est montpelliérain : le site de réservation et l'outil de gestion de l'Hôtel Le Saint Éloi, à découvrir dans mes réalisations.",
      },
    ],
    nearby: ['castelnau-le-lez', 'juvignac', 'lattes'],
    nearbyTowns: ['Grabels', 'Montferrier-sur-Lez', 'Clapiers', 'Saint-Clément-de-Rivière', 'Saint-Aunès'],
    featured: 'creation-site-internet',
  },
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
    nearby: ['montpellier', 'lattes', 'mauguio'],
    nearbyTowns: ['Montpellier', 'Clapiers', 'Jacou', 'Le Crès', 'Saint-Aunès'],
  },
  {
    slug: 'juvignac',
    name: 'Juvignac',
    postalCode: '34990',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Juvignac',
    situation: "Commune limitrophe de Montpellier, à l'ouest, de l'autre côté de la Mosson",
    metaTitle: 'Fiche Google et site web pour les pros de Juvignac',
    metaDescription:
      'Commerces du cœur de ville, artisans, santé, domaines et événements : je crée ton site et je soigne ta fiche Google à Juvignac. Premier appel de 30 min offert.',
    h1: 'Fiche Google et site internet pour les commerces et services de proximité de Juvignac',
    lead:
      "À Juvignac, j'aide les commerçants, artisans, soignants et prestataires de services à se faire connaître des habitants, du cœur de ville aux Constellations. Un site clair, une fiche Google complète et, si ton activité s'y prête, la réservation en ligne : de quoi transformer une recherche sur téléphone en client qui pousse ta porte.",
    context: [
      "Juvignac, c'est la voisine de Montpellier, de l'autre côté de la Mosson, qui n'a cessé de grandir depuis les années 1980. De nouveaux quartiers ont vu le jour, comme les Constellations, au terminus de la ligne 3 du tram. Le cœur de ville est commerçant, le marché de la place du Soleil anime le samedi matin, et la commune garde ses garrigues, ses vignes de l'appellation Saint-Georges-d'Orques et le golf de Fontcaude. Beaucoup de Juvignacois travaillent ailleurs dans la métropole, puis cherchent un commerce, un artisan ou un soignant près de chez eux. L'enjeu digital : qu'ils te trouvent sans aller jusqu'à Montpellier.",
      "Les recherches sont très locales : « boulangerie Juvignac », « kiné Juvignac », « coiffeur Constellations ». Les nouveaux arrivants cherchent un peu de tout : médecin, garde d'enfants, artisan pour aménager la maison. Le golf et les domaines viticoles attirent aussi une clientèle de passage, qui tape « golf Fontcaude » ou « dégustation Saint-Georges-d'Orques ». Et de plus en plus, on demande à une IA : « un bon plombier à Juvignac ? ». Ses réponses s'appuient sur ce qui est écrit en ligne : ta fiche Google, tes avis, ton site. Si rien ne dit que tu travailles à Juvignac, tu passes à côté.",
      "Juvignac touche Montpellier, mais ses habitants ont leurs repères : le cœur de ville, la Plaine, Fontcaude, les Constellations. Quelqu'un du coin sait qu'on y circule surtout en voiture, parfois en tram, et que ta clientèle déborde vite sur Grabels, Saint-Georges-d'Orques ou Lavérune. Je t'aide à le dire clairement en ligne, sans remplir ton site de pages copiées-collées. Et parce que j'ai moi-même tenu une entreprise, je sais qu'un commerçant ou un artisan n'a pas de temps à perdre : je mise sur des outils simples, que tu utiliseras vraiment, plutôt qu'une usine à gaz.",
    ],
    sectors: [
      {
        name: 'Commerces du cœur de ville',
        need: "Une fiche Google à jour (horaires, photos, avis), un site simple et, si ton activité s'y prête, la commande en ligne à retirer en boutique.",
      },
      {
        name: 'Artisans du bâtiment et de la maison',
        need: "Tes réalisations en photos, ta zone d'intervention dans l'ouest montpelliérain et une demande de devis en ligne qui réclame d'emblée photos, adresse et type de travaux.",
      },
      {
        name: 'Santé, beauté et bien-être',
        need: 'Kinés, infirmiers, coiffeurs, esthéticiennes : un agenda en ligne que tes clients consultent quand ils veulent, un rappel par SMS ou par e-mail la veille, et le stationnement indiqué sur ta fiche Google.',
      },
      {
        name: 'Domaines viticoles et lieux de réception',
        need: "Dégustations, soirées d'été, séminaires ou mariages : un site qui met ton domaine en valeur, un agenda de tes événements et des demandes de réservation qui arrivent avec toutes les infos, sans échanges de mails à rallonge.",
      },
    ],
    meeting:
      "Premier appel : 30 minutes, sans frais, au téléphone ou en visio. Pour moi, Juvignac, c'est la porte à côté : je passe volontiers te voir, au magasin, au cabinet ou sur ton domaine, si le projet s'y prête. Ensuite, le travail se fait à distance, par étapes courtes, et rien ne part en ligne sans ton accord.",
    faq: [
      {
        q: 'Mon commerce est à Juvignac, et les grandes enseignes sont tout près : comment rester dans la course ?',
        a: "En jouant la proximité : fiche Google complète, avis récents, photos de ta boutique et horaires fiables, pour que les Juvignacois te trouvent quand ils cherchent près de chez eux. Un site simple, dès 800 €, raconte ce que les grandes surfaces n'offrent pas : ton conseil, tes produits, ton service. Si ton activité s'y prête, la commande à retirer en boutique leur évite même un détour.",
      },
      {
        q: 'De nouveaux habitants arrivent à Juvignac : comment devenir leur commerce ou leur artisan de référence ?',
        a: "Un nouvel arrivant n'a pas encore de carnet d'adresses : il cherche sur Google Maps, lit les avis et, de plus en plus, demande conseil à une IA. Une fiche Google complète, des avis récents et un site qui explique ton métier et ta zone d'intervention t'aident à entrer dans sa liste de départ. Ensuite, ton accueil et ton travail font le reste, et le bouche-à-oreille prend le relais.",
      },
      {
        q: "Je suis vigneron ou j'organise des événements à Juvignac : comment éviter de passer mes soirées à répondre aux demandes de réservation ?",
        a: "Avec un formulaire de réservation qui demande d'emblée la date, le nombre de personnes et les options, relié à l'agenda de tes événements. Tes invités reçoivent une confirmation automatique, et toi une liste claire, prête pour le jour J. Pour aller plus loin, avec la gestion des groupes ou le suivi des acomptes, une application sur mesure démarre à 1 500 €.",
      },
    ],
    nearby: ['saint-jean-de-vedas', 'montpellier', 'castelnau-le-lez'],
    nearbyTowns: ['Grabels', "Saint-Georges-d'Orques", 'Lavérune', 'Pignan', 'Murviel-lès-Montpellier'],
    featured: 'referencement-local-geo',
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
    nearby: ['montpellier', 'juvignac', 'lattes'],
    nearbyTowns: ['Montpellier', 'Lattes', 'Villeneuve-lès-Maguelone', 'Fabrègues', 'Saussan', 'Lavérune'],
    featured: 'application-metier',
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
    nearby: ['montpellier', 'perols', 'palavas-les-flots'],
    nearbyTowns: [
      'Montpellier',
      'Pérols',
      'Palavas-les-Flots',
      'Villeneuve-lès-Maguelone',
      'Saint-Jean-de-Védas',
      'Mauguio',
    ],
    featured: 'referencement-local-geo',
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
    nearby: ['lattes', 'palavas-les-flots', 'mauguio'],
    nearbyTowns: ['Lattes', 'Mauguio', 'Palavas-les-Flots', 'Montpellier'],
  },
  {
    slug: 'palavas-les-flots',
    name: 'Palavas-les-Flots',
    postalCode: '34250',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Palavas-les-Flots',
    situation: "Sur le littoral, à une dizaine de kilomètres au sud de Montpellier, à l'embouchure du Lez",
    metaTitle: 'Site web et fiche Google à Palavas-les-Flots',
    metaDescription:
      'Restaurants, loisirs nautiques, commerces et pêcheurs de Palavas-les-Flots : site mobile et fiche Google à jour pour les clients du week-end. Appel offert.',
    h1: 'Site internet et fiche Google à Palavas-les-Flots, pour les clients de dernière minute',
    lead:
      "À Palavas-les-Flots, j'aide les restaurants, loueurs d'activités nautiques, commerçants et pêcheurs à être trouvés par ceux qui arrivent de Montpellier pour la journée, le week-end ou les vacances. Un site rapide sur téléphone et une fiche Google juste, c'est la base pour être choisi au moment où ils cherchent.",
    context: [
      "Palavas-les-Flots a trois casquettes : port de pêche à l'embouchure du Lez, station balnéaire et lieu de promenade tout proche pour les Montpelliérains. Le Lez la coupe en deux, rive gauche et rive droite, reliées notamment par le Transcanal, un petit télésiège au-dessus du canal que les Palavasiens surnomment le « Mickey ». Le matin, les pêcheurs vendent leur poisson sur les quais ; plus loin, jet-ski, parachute ascensionnel et sorties en mer attendent les visiteurs, sous l'œil du phare de la Méditerranée. L'enjeu digital : être trouvé par des clients qui choisissent sur leur téléphone, parfois le jour même.",
      "Palavas vit d'un tourisme de proximité : les Montpelliérains viennent surtout le week-end, souvent en famille, en voiture, en bus ou à vélo par les pistes cyclables. En juillet et en août s'ajoutent les vacanciers venus d'autres régions. Sur place, tout le monde cherche sur son téléphone : « restaurant Palavas ouvert ce soir », « poisson frais Palavas », « cours de surf Palavas », « sortie en mer Palavas ». Ils veulent les horaires du jour, le menu, les prix et un moyen de réserver. Et quand ils demandent à une IA quoi faire à Palavas avec des enfants, elle s'appuie sur ce qui est clairement décrit en ligne : autant que ce soit ton activité.",
      "Un partenaire du coin sait que Palavas ne s'arrête pas après l'été : féria, village de Noël en bord de mer, puces du samedi autour des arènes, la ville garde de l'animation au fil des saisons, et Montpellier est à deux pas. Il sait aussi qu'ici, la météo décide souvent de la journée : tes horaires, tes créneaux et tes messages doivent pouvoir changer vite. J'ai tenu deux magasins : une belle journée bien préparée, je sais ce qu'elle rapporte. Je mets en place des outils simples, que tu gères depuis ton téléphone, pour garder ta fiche Google juste et répondre aux avis sans y passer tes soirées.",
    ],
    sectors: [
      {
        name: 'Restaurants et bars des quais et du front de mer',
        need: 'Une carte en ligne que tu changes selon la pêche du jour, des horaires justes le dimanche soir comme en semaine et un lien de réservation bien visible sur ta fiche Google.',
      },
      {
        name: 'Loisirs nautiques et sorties en mer',
        need: 'Jet-ski, parachute ascensionnel, surf, sorties en mer : des créneaux réservables en ligne, des photos et des avis récents, et les infos pratiques (âge minimum, équipement, lieu de rendez-vous) pour limiter les appels.',
      },
      {
        name: 'Pêcheurs des quais du Lez',
        need: 'Une page simple, mise à jour depuis ton téléphone, qui annonce ta pêche du jour et tes horaires de vente, et permet à tes clients de réserver leur poisson avant de passer au quai.',
      },
      {
        name: 'Commerces de la rue piétonne et du centre',
        need: "Une fiche Google complète, des photos récentes et des horaires d'hiver à jour, pour vendre aux Palavasiens et aux promeneurs du dimanche, pas seulement aux vacanciers.",
      },
    ],
    meeting:
      "Pour démarrer, un appel de 30 minutes en visio, offert, un jour calme pour toi. Palavas n'est qu'à une dizaine de kilomètres de Montpellier : je passe volontiers sur les quais, dans ton restaurant ou ta boutique, rive gauche comme rive droite. Le reste avance à distance, avec une validation à chaque étape.",
    faq: [
      {
        q: 'Mon restaurant à Palavas se remplit surtout le week-end : comment attirer du monde en semaine ?',
        a: 'En étant présent quand les gens organisent leur sortie : fiche Google avec photos récentes et horaires exacts, menu du midi en ligne, lien de réservation. Un site simple peut aussi mettre en avant une formule de semaine ou un événement, que tu changes toi-même. Côté budget, un site vitrine part de 800 €, fiche Google optimisée comprise.',
      },
      {
        q: 'Je suis pêcheur et je vends sur les quais de Palavas : à quoi me servirait un site ?',
        a: "À dire, avant que le client se déplace, si tu es là ce matin, ce que tu as pêché et jusqu'à quelle heure tu vends. Une page simple, que tu mets à jour depuis ton téléphone, et une fiche Google à ton nom suffisent pour commencer. Pour prendre des réservations de poisson, par exemple pour le week-end, un petit outil sur mesure est possible, à partir de 1 500 €.",
      },
      {
        q: 'Beaucoup de mes clients viennent de Montpellier : mon site doit-il en parler ?',
        a: "Oui, si tes clients viennent de là, mais sans tricher : on explique comment venir de Montpellier, en voiture, en bus ou à vélo, et ce que tu proposes pour une sortie à la journée. Ta fiche Google, elle, garde ton adresse palavasienne : c'est elle qui sert aux recherches faites sur place. On évite en revanche les pages « Montpellier » copiées-collées, qui n'apportent rien.",
      },
    ],
    nearby: ['perols', 'lattes', 'mauguio'],
    nearbyTowns: ['Villeneuve-lès-Maguelone', 'Vic-la-Gardiole', 'Mireval'],
    featured: 'creation-site-internet',
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
    nearby: ['perols', 'la-grande-motte', 'lunel'],
    nearbyTowns: ['La Grande-Motte', 'Palavas-les-Flots', 'Saint-Aunès', 'Mudaison', 'Candillargues', 'Lansargues'],
    featured: 'site-reservation-location-saisonniere',
  },
  {
    slug: 'la-grande-motte',
    name: 'La Grande-Motte',
    postalCode: '34280',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/La_Grande-Motte',
    situation:
      'Sur le littoral, à une vingtaine de kilomètres au sud-est de Montpellier, aux portes de la Petite Camargue',
    metaTitle: 'La Grande-Motte : un site web pour chaque clientèle',
    metaDescription:
      'Propriétaires qui louent, hôtels, restaurants, pros du port, golf et thalasso : à La Grande-Motte, un site qui parle à chaque clientèle. Premier appel offert.',
    h1: 'Site internet à La Grande-Motte : une vitrine pour chaque clientèle de la station',
    lead:
      "À La Grande-Motte, j'accompagne les propriétaires qui louent, les hôtels et restaurants, les pros du port et ceux qui accueillent golfeurs, curistes ou séminaires : site internet, réservation en ligne, fiche Google. Un site clair, traduit quand il le faut, qui parle à chaque clientèle sans en perdre aucune.",
    context: [
      "La Grande-Motte a une identité à part : une station imaginée de toutes pièces par l'architecte Jean Balladur, avec ses pyramides, son port de plaisance au cœur de la ville et le label « Architecture contemporaine remarquable ». Elle vit d'abord du tourisme d'été, et la grande majorité de ses logements sont des résidences secondaires. Mais le palais des congrès accueille séminaires et congrès, la ville mise sur le golf et le bien-être pour vivre toute l'année, et les commerces restent ouverts pour les Grand-Mottois. L'enjeu digital : parler à des clientèles très différentes, chacune au bon moment.",
      "Selon la période, ce ne sont pas les mêmes personnes qui te cherchent. L'été, les vacanciers, dont des visiteurs étrangers, tapent « location appartement La Grande-Motte vue mer », « restaurant port La Grande-Motte » ou « cours de planche à voile étang du Ponant ». Les Montpelliérains, eux, viennent à la plage du Grand Travers et cherchent où déjeuner après la baignade. Toute l'année, des organisateurs cherchent un hôtel pour un séminaire ou un traiteur près du palais des congrès. Et de plus en plus de gens posent la question à une IA, qui puise dans les infos claires et à jour qu'elle trouve en ligne.",
      "Être du coin aide à comprendre qu'on ne parle pas de la même façon à un plaisancier du port, à une famille du Couchant et à un organisateur de séminaire. Ça aide aussi à savoir que beaucoup de propriétaires vivent ailleurs une partie de l'année, et qu'ils ont besoin d'outils qui tournent sans eux. Mon rôle : un site qui fait le tri, avec une page claire par clientèle et les bonnes langues, puis des outils qui répondent à ta place aux questions répétitives. Après 14 ans à la tête d'une entreprise du BTP, je sais que ton temps est mieux employé auprès de tes clients que devant ton site.",
    ],
    sectors: [
      {
        name: 'Propriétaires qui louent leur appartement',
        need: "Pour 1 à 4 logements, un site où tes voyageurs réservent en direct, dès 250 €, avec l'arrivée autonome en option : code d'accès et consignes envoyés avant le séjour, même quand tu es loin.",
      },
      {
        name: 'Hôtels, restaurants et plages privées',
        need: 'Des pages dans les langues de tes clients, une fiche Google aux horaires justes selon la saison et la réservation en ligne, pour les vacanciers comme pour les groupes.',
      },
      {
        name: 'Chantiers, écoles de voile et pros du port',
        need: "Un site qui présente tes services, la réservation des stages en ligne et, pour l'entretien des bateaux, un suivi des travaux envoyé aux propriétaires, photos à l'appui.",
      },
      {
        name: 'Golf, thalasso et bien-être',
        need: "Des offres lisibles pour chaque saison, la réservation en ligne des soins ou des cours et un message de bienvenue envoyé avant l'arrivée, en français comme en anglais.",
      },
    ],
    meeting:
      "Premier rendez-vous : 30 minutes en visio, gratuites, pour cerner tes clientèles et tes saisons. Ensuite, on avance à distance, et je viens sur le port ou dans ton établissement quand c'est utile : La Grande-Motte est à une vingtaine de kilomètres de Montpellier par la voie rapide.",
    faq: [
      {
        q: 'Je loue mon appartement à La Grande-Motte mais je vis ailleurs : comment gérer les arrivées à distance ?',
        a: "Avec l'arrivée autonome, une option du site de réservation : le code d'accès et les consignes partent avant le séjour, puis une demande d'avis après le départ. Tes voyageurs réservent chez toi, sans commission de plateforme, à partir de 250 € pour 1 à 4 logements. Tes annonces sur les plateformes peuvent continuer : les calendriers se mettent à jour entre eux toutes les quelques heures, pas en instantané.",
      },
      {
        q: "Mon hôtel à La Grande-Motte reçoit des vacanciers l'été et des séminaires le reste de l'année : un seul site peut-il parler aux deux ?",
        a: 'Oui, à condition de séparer clairement les parcours : une entrée « séjour » pour les vacanciers, une entrée « groupes et séminaires » avec un formulaire qui demande dates, effectif et besoins. Chacun trouve vite ce qui le concerne, et tu reçois des demandes exploitables. Un site vitrine démarre à 800 € ; pour relancer automatiquement les demandes de groupe, compte à partir de 3 000 €.',
      },
      {
        q: "Je propose des soins ou des cours à La Grande-Motte : comment garder des réservations en dehors de l'été ?",
        a: "En t'adressant à ceux qui sont là toute l'année : les Grand-Mottois, les Montpelliérains et les participants aux séminaires. Une fiche Google active, des offres de saison sur ton site et un e-mail envoyé au bon moment à tes anciens clients sont une bonne base. Pour que ces relances partent toutes seules, on peut les automatiser, à partir de 3 000 €.",
      },
    ],
    nearby: ['le-grau-du-roi', 'aigues-mortes', 'mauguio'],
    nearbyTowns: ['Candillargues', 'Lansargues', 'Saint-Nazaire-de-Pézan', "Saint-Laurent-d'Aigouze", 'Marsillargues'],
    featured: 'site-reservation-location-saisonniere',
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
    nearby: ['sommieres', 'mauguio', 'aigues-mortes'],
    nearbyTowns: ['Lunel-Viel', 'Marsillargues', 'Saint-Just', 'Saturargues', 'Aimargues', 'Gallargues-le-Montueux'],
  },
  {
    slug: 'frontignan',
    name: 'Frontignan',
    postalCode: '34110',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Frontignan',
    situation:
      'Sur le littoral, à une vingtaine de kilomètres au sud-ouest de Montpellier, entre le massif de la Gardiole et la mer',
    metaTitle: 'Frontignan : être trouvé sur Google et par les IA',
    metaDescription:
      'Artisans, commerces, caves de muscat et pros de Frontignan-Plage : site web et référencement local pour être trouvé sur Google et par les IA. Appel offert.',
    h1: 'Référencement local à Frontignan : sur Google et dans les IA, de La Peyrade à la plage',
    lead:
      "À Frontignan la Peyrade, j'aide les artisans, commerçants, caves de muscat et pros de la plage à être trouvés par ceux qui cherchent près de chez eux, sur Google comme auprès des IA. Fiche Google, site rapide et réponses claires aux questions de tes clients : le référencement local est inclus dans chaque site que je crée.",
    context: [
      "Frontignan n'est pas qu'une station balnéaire. Entre le massif de la Gardiole, l'étang d'Ingril et la mer, c'est une ville qui vit toute l'année, du cœur de ville à La Peyrade, avec ses commerces, ses artisans et des entreprises liées au port de Sète. C'est aussi la ville du muscat, en appellation d'origine, et de sa bouteille torsadée. L'été, Frontignan-Plage, les ports et les écoles de glisse changent le rythme. L'enjeu digital : être la réponse évidente quand un habitant ou un vacancier cherche un pro près de lui, plutôt que de laisser la place à un concurrent mieux décrit.",
      "Toute l'année, les habitants cherchent au plus près : « plombier Frontignan », « garage La Peyrade », « boulangerie ouverte dimanche Frontignan ». L'été, les vacanciers tapent « cours de kitesurf étang d'Ingril », « cave muscat Frontignan » ou « plage des Aresquiers ». Tous regardent d'abord la carte Google, les avis et les horaires, puis ton site pour se décider. Et de plus en plus posent la question à ChatGPT ou à Gemini, du genre « où acheter du muscat de Frontignan directement au producteur ? ». Les IA s'appuient sur des infos claires, complètes et identiques partout : c'est ce qui te donne une chance d'être cité.",
      "Connaître le coin, ici, c'est savoir que Frontignan, La Peyrade et Frontignan-Plage ne se cherchent pas de la même façon, et qu'un artisan d'ici peut tout aussi bien intervenir à Sète, à Balaruc ou à Vic-la-Gardiole. On décrit ta vraie zone, sans empiler des pages copiées-collées qui n'apportent rien. Ancien chef d'entreprise du BTP, je sais que tu n'as pas le temps de devenir expert en référencement : je pose les bases, je t'explique l'essentiel sans jargon, et tu gardes la main sur ta fiche Google.",
    ],
    sectors: [
      {
        name: 'Caves et vignerons du muscat de Frontignan',
        need: 'Des fiches claires pour chaque cuvée, des horaires de vente justes sur Google et une page qui répond à ceux qui demandent à une IA où acheter du muscat de Frontignan.',
      },
      {
        name: 'Artisans et dépannage du quotidien',
        need: "Plombiers, électriciens, serruriers, jardiniers : une fiche Google complète, des avis récents et une zone d'intervention claire, de La Peyrade à Frontignan-Plage et dans les communes voisines.",
      },
      {
        name: "Écoles de glisse de l'étang d'Ingril",
        need: 'Kitesurf, wing, paddle : des cours réservables en ligne, des consignes envoyées avant la séance et un message automatique quand le vent oblige à décaler.',
      },
      {
        name: "Entreprises du port et des zones d'activités",
        need: 'Mareyage, transport, maintenance, bâtiment : un site professionnel clair sur tes services et ta zone, et des demandes qui arrivent directement au bon interlocuteur.',
      },
    ],
    meeting:
      "On démarre par un appel de 30 minutes, en visio ou par téléphone, offert, pour voir où tu en es sur Google. La suite se fait à distance, et comme Frontignan est à une vingtaine de kilomètres de Montpellier, je passe volontiers à ta boutique, à ta cave ou à ton atelier pour faire le point sur ta fiche Google avec toi.",
    faq: [
      {
        q: 'Mon commerce est à La Peyrade, tout près de Sète : comment être trouvé des deux côtés ?',
        a: "Ta fiche Google reste à ton adresse, à Frontignan, et c'est elle qui compte pour les recherches à proximité. On y ajoute le nom du quartier, La Peyrade, que tes clients utilisent, et on décrit sur ton site les communes où tu travailles, Sète comprise. Aucun classement n'est garanti, mais Google comprend mieux où tu travailles, et tes clients aussi.",
      },
      {
        q: 'Je vends du muscat de Frontignan : comment être cité quand on demande à une IA où en acheter ?',
        a: "Les IA s'appuient sur ce qu'elles trouvent en ligne : ton site, ta fiche Google, les avis et les pages qui parlent de toi. Il faut donc des infos claires et identiques partout : ce que tu produis, où et quand acheter, comment venir. C'est ce qu'on appelle le GEO, le référencement dans les IA, inclus dans les sites que je crée dès 800 €. Aucune citation n'est garantie, mais tu donnes aux IA de quoi te recommander.",
      },
      {
        q: "J'enseigne le kitesurf sur l'étang d'Ingril : comment gérer les réservations quand le vent change tout ?",
        a: "Avec un outil de réservation de créneaux : tes élèves réservent en ligne, et si tu décides de décaler la séance, un message part automatiquement pour proposer un autre créneau. Tu gardes la décision, l'outil se charge des messages. Ce type d'application démarre à 1 500 €, et un simple formulaire de demande sur ton site est déjà un bon début.",
      },
    ],
    nearby: ['sete', 'saint-jean-de-vedas', 'palavas-les-flots'],
    nearbyTowns: ['Balaruc-les-Bains', 'Balaruc-le-Vieux', 'Vic-la-Gardiole', 'Gigean', 'Villeneuve-lès-Maguelone'],
    featured: 'referencement-local-geo',
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
    nearby: ['frontignan', 'marseillan', 'agde'],
    nearbyTowns: ['Frontignan', 'Marseillan', 'Mèze', 'Bouzigues', 'Loupian'],
  },
  {
    slug: 'marseillan',
    name: 'Marseillan',
    postalCode: '34340',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Marseillan_(Hérault)',
    situation:
      "Au bord de l'étang de Thau, entre Sète et Agde, à une cinquantaine de kilomètres au sud-ouest de Montpellier",
    metaTitle: 'Site internet à Marseillan : vendre et louer en direct',
    metaDescription:
      'Vignerons, loueurs, campings et artisans de Marseillan et Marseillan-Plage : site pour vendre et louer en direct, sans commission de plateforme. Appel offert.',
    h1: 'Site internet à Marseillan pour vendre et louer en direct, du port à Marseillan-Plage',
    lead:
      "À Marseillan, je crée des sites internet et des outils de réservation pour les vignerons, loueurs, campings et artisans, du port de l'étang de Thau jusqu'à Marseillan-Plage. L'idée : que tes clients découvrent, commandent ou réservent chez toi en direct, sans passer par un intermédiaire à chaque fois.",
    context: [
      "Marseillan a deux visages, séparés par la pointe de l'étang de Thau. D'un côté, le village, habité toute l'année, avec son centre ancien, sa place couverte et son port, où se croisent barques de pêche, voiliers et péniches, et où Noilly Prat a ses chais ; tout près, à la pointe des Onglous, le canal du Midi se jette dans l'étang. De l'autre, Marseillan-Plage, ses campings et ses logements surtout loués l'été. L'économie tient à l'étang, avec les huîtres et les moules, à la vigne, surtout en blanc, et au tourisme. L'enjeu digital : vendre et louer davantage en direct.",
      "Les recherches suivent cette frontière. L'été, les vacanciers tapent « camping Marseillan-Plage », « dégustation huîtres Marseillan » ou « visite chai Marseillan », depuis la plage ou à vélo, sur les pistes qui mènent à Sète et à Agde. Le reste de l'année, les habitants et les propriétaires de résidences secondaires cherchent un artisan, un restaurant ouvert, un vigneron pour les fêtes. Et quand un visiteur demande à une IA où manger une brasucade de moules au bord de l'étang de Thau, ce sont les pros bien décrits en ligne qui ont une chance d'être cités.",
      "Quelqu'un qui connaît le coin sait qu'un vigneron du village, un camping de Marseillan-Plage et un artisan qui entretient des maisons de vacances n'ont ni les mêmes clients ni le même calendrier. Il sait aussi que tu n'as pas de temps à perdre avec un site compliqué, en pleines vendanges ou en plein mois d'août. Patron à 22 ans, j'ai dirigé une entreprise pendant 14 ans : ce qu'il te faut, ce sont des outils simples que tu gardes en main, des commandes et des réservations qui arrivent en ordre, et des mises à jour que tu fais toi-même, sans attendre un prestataire.",
    ],
    sectors: [
      {
        name: 'Vignerons et caves de Marseillan',
        need: 'Un site qui présente ton domaine et tes cuvées, des horaires de caveau justes sur Google et une précommande en ligne pour les fêtes, pour vendre en direct aux habitants comme aux visiteurs.',
      },
      {
        name: 'Loueurs de Marseillan-Plage et gîtes du village',
        need: 'Un lien de réservation à envoyer à tes locataires fidèles, pour 1 à 4 logements ou chambres, dès 250 €, avec des calendriers alignés sur Airbnb et Booking.com, à quelques heures près.',
      },
      {
        name: 'Campings de Marseillan-Plage',
        need: "Une page claire par hébergement, rapide sur téléphone, des demandes de réservation qui arrivent complètes et des messages envoyés automatiquement avant l'arrivée : accès, horaires d'accueil, consignes.",
      },
      {
        name: 'Artisans et services aux propriétaires de résidences secondaires',
        need: "Entretien, travaux, jardin, gardiennage : un formulaire de devis où le propriétaire joint ses photos, et un compte rendu d'intervention envoyé par e-mail, photos à l'appui, quand il vit loin.",
      },
    ],
    meeting:
      "On commence par 30 minutes en visio, gratuites, à caler en dehors de ta pleine saison. Le projet avance ensuite à distance, étape par étape, et je passe au village, sur le port ou à Marseillan-Plage quand c'est utile : Marseillan est à une cinquantaine de kilomètres de Montpellier.",
    faq: [
      {
        q: "Mes locataires de Marseillan-Plage reviennent d'une année sur l'autre : comment les faire réserver en direct ?",
        a: "Avec ton propre site de réservation : tu leur envoies le lien, ils choisissent leurs dates et reçoivent un e-mail de confirmation, sans commission de plateforme sur ce séjour. Tes annonces Airbnb ou Booking.com peuvent rester en ligne : les calendriers s'échangent les dates prises par iCal toutes les quelques heures, donc on fixe ensemble une règle pour les réservations de dernière minute. Compte à partir de 250 € pour 1 à 4 logements.",
      },
      {
        q: 'Je suis vigneron à Marseillan : comment attirer au caveau les visiteurs du port et des pistes cyclables ?',
        a: "En étant visible là où ils cherchent : une fiche Google complète, avec tes horaires de caveau et des photos, et un site qui dit ce qu'on peut goûter chez toi et comment venir, y compris à vélo. Pense aussi aux IA : un site précis sur ton domaine leur donne de quoi te citer. Un site vitrine démarre à 800 €, référencement local compris.",
      },
      {
        q: "Je suis artisan à Marseillan et beaucoup de mes clients ne vivent ici qu'une partie de l'année : comment m'organiser ?",
        a: "Avec des outils qui remplacent les allers-retours et les appels : un formulaire de devis où le propriétaire joint ses photos, un planning de tes interventions et un compte rendu envoyé par e-mail une fois le travail fait. C'est une application sur mesure, utilisable sur ton téléphone, à partir de 1 500 €. Tes clients sont rassurés, même à distance, et tu passes moins de temps au téléphone.",
      },
    ],
    nearby: ['agde', 'sete', 'pezenas'],
    nearbyTowns: ['Mèze', 'Pomérols', 'Pinet', 'Florensac'],
    featured: 'site-reservation-location-saisonniere',
  },
  {
    slug: 'agde',
    name: 'Agde',
    postalCode: '34300',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Agde',
    situation:
      "Sur le littoral, à une cinquantaine de kilomètres au sud-ouest de Montpellier, à l'embouchure de l'Hérault",
    metaTitle: "Agde et Cap d'Agde : site web et réservation directe",
    metaDescription:
      "Loueurs du Cap d'Agde, commerces du centre historique, restaurants du Grau, pros du port : site de réservation dès 250 €, site vitrine dès 800 €. Appel offert.",
    h1: "Site internet et réservation en ligne à Agde, du centre historique au Cap d'Agde",
    lead:
      "À Agde, au Grau d'Agde et au Cap d'Agde, j'aide les loueurs, commerçants, restaurateurs et pros du nautisme à préparer leur saison et à garder le contact avec leurs clients. Site de réservation en direct pour ton logement, site vitrine traduit pour tes clients étrangers, fiche Google à jour : on cale tout sur le rythme de la commune.",
    context: [
      "Agde, c'est trois villes en une. La cité historique, surnommée « la perle noire de la Méditerranée » pour ses monuments en basalte, borde l'Hérault et le canal du Midi. Le Grau d'Agde et la Tamarissière, plus familiaux, vivent de la pêche, avec la criée, et de leurs campings. Le Cap d'Agde, station bâtie de toutes pièces autour de son port de plaisance, réunit commerces, hôtels et résidences de vacances. Le tourisme et le commerce font vivre la commune, mais la saison se concentre sur l'été : l'enjeu digital, c'est d'être prêt avant, puis de ne pas disparaître après.",
      "L'été, la plupart de tes clients sont des vacanciers qui ont préparé leur séjour de loin, depuis une autre région ou un autre pays. Ils tapent « location appartement Cap d'Agde », « restaurant Grau d'Agde » ou « location bateau Cap d'Agde », parfois dans une autre langue, puis comparent photos, avis et disponibilités. Sur place, tout se joue sur le téléphone : horaires, itinéraire, réservation. Et de plus en plus de vacanciers demandent à une IA où dormir près de la plage de la Conque ou quoi faire avec des enfants au Cap d'Agde : si ton activité est clairement décrite en ligne, elle a plus de chances d'être citée.",
      "Travailler avec quelqu'un qui connaît Agde, c'est ne pas confondre le centre historique, le Grau et le Cap, qui n'ont ni la même clientèle ni les mêmes horaires, ni traiter une boutique ouverte seulement l'été comme un commerce à l'année. C'est aussi savoir qu'en juillet, entre les arrivées, les saisonniers à recruter et les messages en anglais, tu n'as plus une minute pour ton site. Pendant 14 ans, j'ai moi-même jonglé entre les clients, l'équipe et l'administratif : je te propose des outils qui travaillent pendant que tu travailles, comme les réservations en direct, les réponses automatiques ou une fiche Google à jour.",
    ],
    sectors: [
      {
        name: "Loueurs d'appartements et de villas au Cap d'Agde",
        need: 'Ton propre site pour louer en direct 1 à 4 logements, dès 250 €, en anglais si besoin, avec des calendriers alignés sur tes annonces Airbnb et Booking.com toutes les quelques heures.',
      },
      {
        name: 'Restaurants et boutiques saisonnières du Cap et du Grau',
        need: 'Des horaires Google qui suivent la saison, une carte en QR code traduite et une page « on recrute » avec un formulaire qui trie les candidatures de tes saisonniers.',
      },
      {
        name: 'Pros du nautisme de la zone technique du port',
        need: "Réparation, manutention, accastillage : un site clair sur tes services, des demandes de devis qui précisent le bateau et les travaux, et un suivi des contacts pris au salon nautique d'automne.",
      },
      {
        name: 'Commerces et artisans du centre historique',
        need: "Une fiche Google soignée, des avis récents et un site qui donne aux Agathois comme aux vacanciers une bonne raison de venir entre la cathédrale et les quais de l'Hérault.",
      },
    ],
    meeting:
      "Premier échange : 30 minutes en visio, offertes, idéalement avant le printemps, afin d'être prêt pour l'été. Ensuite, tout avance à distance, et je viens au Cap, au Grau ou dans le centre historique quand c'est utile : Agde est à moins d'une heure de Montpellier par l'A9.",
    faq: [
      {
        q: "Je loue au Cap d'Agde à beaucoup de voyageurs étrangers : mon site de réservation peut-il être en anglais ?",
        a: "Oui, la version anglaise fait partie des options du site de réservation : présentation, équipements, accès et conditions, pour que tes voyageurs comprennent tout avant de réserver. Le site démarre à 250 € pour 1 à 4 logements. Et si tu restes sur Airbnb ou Booking.com, une nuit réservée d'un côté se ferme de l'autre grâce à l'iCal, un lien qui échange les dates prises : ce n'est jamais instantané, la mise à jour se fait toutes les quelques heures.",
      },
      {
        q: 'Je recrute des saisonniers chaque été à Agde : un outil peut-il me faire gagner du temps ?',
        a: "Oui : une page « on recrute » sur ton site, avec un formulaire qui demande le poste, les dates de disponibilité et l'expérience, et toutes les candidatures arrivent au même endroit, triées. Tu peux y ajouter une réponse automatique et un planning des entretiens. Pour ce type d'application sur mesure, compte à partir de 1 500 €.",
      },
      {
        q: "Ma boutique est dans le centre historique d'Agde : comment attirer aussi les vacanciers du Cap ?",
        a: "En parlant à ceux qui cherchent quoi faire un jour sans plage : une fiche Google complète, avec photos et horaires, et un site qui situe ta boutique près de la cathédrale et des quais de l'Hérault. On précise aussi comment venir et où se garer. Les Agathois, eux, y trouvent une raison de plus de rester fidèles au cœur de ville.",
      },
    ],
    nearby: ['marseillan', 'pezenas', 'sete'],
    nearbyTowns: ['Vias', 'Bessan', 'Florensac', 'Pomérols', 'Portiragnes'],
    featured: 'site-reservation-location-saisonniere',
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
    nearby: ['pezenas', 'agde', 'marseillan'],
    nearbyTowns: [
      'Villeneuve-lès-Béziers',
      'Boujan-sur-Libron',
      'Sauvian',
      'Lignan-sur-Orb',
      'Maraussan',
      'Colombiers',
    ],
  },
  {
    slug: 'pezenas',
    name: 'Pézenas',
    postalCode: '34120',
    department: 'Hérault',
    wikipedia: 'https://fr.wikipedia.org/wiki/Pézenas',
    situation:
      "Dans la plaine de l'Hérault, à une cinquantaine de kilomètres à l'ouest de Montpellier, près de Béziers",
    metaTitle: "Site web pour artisans d'art et commerces à Pézenas",
    metaDescription:
      "Artisans d'art, antiquaires, caves et chambres d'hôtes de Pézenas : un site internet et une fiche Google pour être trouvé toute l'année. Premier appel offert.",
    h1: "Site internet pour les métiers d'art, antiquaires et commerces de Pézenas",
    lead:
      "À Pézenas, je donne aux artisans d'art, antiquaires, commerçants, vignerons et hébergeurs un site internet et des outils simples, pensés pour une ville où l'on vient flâner. L'objectif : que les visiteurs te repèrent avant de venir et te retrouvent une fois rentrés chez eux, et que les Piscénois pensent à toi toute l'année.",
    context: [
      "Pézenas vit de son patrimoine et de ses savoir-faire. Le centre historique, secteur sauvegardé depuis 1965, aligne hôtels particuliers, boutiques et ateliers : souffleurs de verre, céramistes, doreurs, modistes, avec la Maison des Métiers d'Art place Gambetta. Les antiquaires et brocanteurs, avenue de Verdun et dans le cœur de ville, reçoivent toute l'année. Autour, les vignes de l'AOP Languedoc Pézenas et de l'IGP Côtes de Thongue font vivre caves et domaines, et chambres d'hôtes, hôtels et campings accueillent les visiteurs. L'enjeu digital : transformer une balade d'un jour en relation durable, et rester visible en dehors des temps forts.",
      "Les visiteurs préparent leur venue en ligne et continuent sur place, téléphone en main : « que voir à Pézenas », « atelier céramique Pézenas », « où acheter des petits pâtés », « chambre d'hôtes centre historique Pézenas ». Certains demandent à une IA un itinéraire sur les pas de Molière ou une sortie pour le samedi, jour de marché. Les Piscénois et les habitants des villages voisins cherchent plutôt un artisan, un commerce ouvert ou un restaurant. Pour tous, il faut des horaires fiables, des photos qui donnent envie, l'accès et un moyen simple de réserver, de commander ou de te recontacter après la visite.",
      "Connaître Pézenas, c'est savoir que la ville vit au rythme de ses rendez-vous : carnaval autour de Mardi gras, Printival Boby Lapointe en avril, Molière dans tous ses éclats en juin, Mirondela dels Arts l'été, grands déballages des antiquaires au printemps et à l'automne. Je t'aide à préparer ces temps forts à l'avance, puis à rester en contact avec ceux qui sont repartis : catalogue en ligne, demande de devis pour une pièce, message après l'achat. Ton site montre tes créations comme on les découvre dans ta boutique, et tu le modifies toi-même, sans compétence technique.",
    ],
    sectors: [
      {
        name: "Artisans d'art et créateurs",
        need: 'Tes pièces et ton atelier en photos, un catalogue que tu complètes toi-même et un formulaire pour les commandes sur mesure, même quand le visiteur est rentré chez lui.',
      },
      {
        name: 'Antiquaires et brocanteurs',
        need: "Tes derniers arrivages en ligne, des horaires fiables sur Google et un moyen simple de réserver une pièce repérée pendant la balade, ou d'annoncer ta présence au prochain grand déballage.",
      },
      {
        name: 'Caves, domaines et producteurs',
        need: 'Les horaires du caveau à jour, la réservation des dégustations et la précommande pour les fêtes, pour garder le contact avec les visiteurs une fois la saison passée.',
      },
      {
        name: "Chambres d'hôtes et gîtes",
        need: 'Un site qui te ressemble, avec la réservation en direct dès 250 € pour 1 à 4 chambres ou logements, et une version anglaise en option pour les voyageurs étrangers.',
      },
    ],
    meeting:
      "Premier échange : une demi-heure offerte, en visio ou au téléphone, à un moment calme pour toi. Pézenas se rejoint facilement depuis Montpellier par l'autoroute : je viens à l'atelier, en boutique ou au caveau quand ça compte, par exemple pour lancer ton site. Entre-temps, tout se fait à distance, étape par étape.",
    faq: [
      {
        q: "Je suis artisan d'art à Pézenas : un site sert-il si mes clients me découvrent en flânant dans les ruelles ?",
        a: "Oui, parce que la visite peut n'être qu'un début : un visiteur qui a repéré une pièce peut vouloir la retrouver une fois rentré, ou te commander une création. Sans site, il ne sait pas où te chercher. Un site simple montre ton travail, ton atelier et la façon de te passer commande, dès 800 €, avec le référencement local.",
      },
      {
        q: 'Je suis antiquaire à Pézenas : comment préparer les grands déballages en ligne ?',
        a: "Quelques semaines avant, mets en avant tes pièces phares sur ton site et sur ta fiche Google, avec la date et l'endroit où te trouver. Les acheteurs qui viennent de loin repèrent ce qui les intéresse et peuvent te contacter à l'avance. Après le déballage, un message aux contacts récoltés garde le lien jusqu'au suivant.",
      },
      {
        q: "Je tiens une chambre d'hôtes dans le centre historique de Pézenas : un site de réservation vaut-il le coup ?",
        a: "Oui, si tu veux recevoir en direct les voyageurs qui reviennent ou qui te trouvent autrement que par les plateformes : sur ces séjours, pas de commission. Le site démarre à 250 € pour 1 à 4 chambres, avec un tableau de bord en option (+ 350 €). Tes calendriers se synchronisent par iCal avec Airbnb et Booking.com toutes les quelques heures, ce n'est pas instantané : on convient donc ensemble d'une règle pour les réservations de dernière minute.",
      },
    ],
    nearby: ['marseillan', 'agde', 'clermont-l-herault'],
    nearbyTowns: ['Montagnac', 'Castelnau-de-Guers', "Nézignan-l'Évêque", 'Caux', 'Tourbes', 'Saint-Thibéry'],
    featured: 'creation-site-internet',
  },
  {
    slug: 'clermont-l-herault',
    name: "Clermont-l'Hérault",
    postalCode: '34800',
    department: 'Hérault',
    wikipedia: "https://fr.wikipedia.org/wiki/Clermont-l'Hérault",
    situation: "Au cœur de l'Hérault, à une cinquantaine de kilomètres à l'ouest de Montpellier par l'A750",
    metaTitle: "Site web à Clermont-l'Hérault, du marché au Salagou",
    metaDescription:
      "Du marché du mercredi au Salagou : site internet et réservation en ligne pour les commerces, artisans et pros du tourisme de Clermont-l'Hérault. Appel offert.",
    h1: "Site internet pour le commerce, l'artisanat et le tourisme à Clermont-l'Hérault",
    lead:
      "À Clermont-l'Hérault et dans le Clermontais, j'aide les commerçants, artisans, vignerons et professionnels du tourisme à être trouvés en ligne : un site internet, une fiche Google et, si besoin, la réservation en ligne. Que ton client habite un village voisin ou prépare une journée au lac du Salagou, il doit comprendre vite ce que tu proposes et pouvoir te contacter ou réserver.",
    context: [
      "Clermont-l'Hérault est une ville de commerce depuis le Moyen Âge, au carrefour des routes entre le littoral et le Massif central. Son marché du mercredi matin, qui remonte à cette époque, installe toujours ses étals place de la République, devant l'église Saint-Paul et sur les allées Salengro. Commerces, services, artisans et zones d'activités comme le Souc attirent les habitants des villages alentour. Le tourisme compte aussi : le lac du Salagou, en partie sur la commune, le cirque de Mourèze et Villeneuvette sont tout près. L'enjeu digital : capter à la fois la clientèle du Clermontais et les visiteurs de passage.",
      "Les recherches mélangent habitants et visiteurs. Les Clermontais et leurs voisins tapent « garage Clermont-l'Hérault », « boulangerie ouverte dimanche » ou « maçon Clermontais ». Les visiteurs cherchent « activités nautiques lac du Salagou », « randonnée cirque de Mourèze », « restaurant près du Salagou » ou « camping Salagou », souvent depuis leur téléphone, parfois déjà sur place. Certains demandent même à une IA d'organiser leur journée autour du lac. Les pros dont les infos sont claires et à jour (horaires, tarifs, accès, dates d'ouverture) ont plus de chances d'apparaître dans ces réponses.",
      "Travailler avec quelqu'un qui connaît le Cœur d'Hérault, c'est savoir que la saison du lac ne dure pas toute l'année, que le mercredi n'est pas un jour comme les autres pour un commerçant du centre, et que ta clientèle se partage entre la ville, les villages et les visiteurs. Je t'aide à parler à chacun sans multiplier les outils : des pages claires, une fiche Google soignée et une réservation en ligne si tu proposes des activités ou un hébergement. Quatorze ans à la tête d'une entreprise du bâtiment m'ont appris qu'en pleine saison, il faut des outils qui tournent sans toi.",
    ],
    sectors: [
      {
        name: 'Commerçants et producteurs du marché du mercredi',
        need: 'Une fiche Google à jour, des horaires fiables et quelques pages claires, pour que les habitants du Clermontais pensent à toi aussi les autres jours de la semaine.',
      },
      {
        name: 'Activités de pleine nature autour du Salagou',
        need: "Sports nautiques, VTT, randonnées accompagnées : un planning de réservation en ligne, des créneaux adaptés à la saison et les infos clés en anglais pour les visiteurs venus de loin.",
      },
      {
        name: "Gîtes et chambres d'hôtes",
        need: "Réservation en direct, e-mail de confirmation et, en option, arrivée autonome avec le code d'accès envoyé avant le séjour, pour accueillir les visiteurs du lac sans vivre au téléphone.",
      },
      {
        name: "Artisans et entreprises des zones d'activités",
        need: "Ta zone d'intervention dans le Clermontais, un formulaire de devis complet et, pour tes équipes sur les chantiers, une application qui centralise photos, notes et plannings, dès 1 500 €.",
      },
    ],
    meeting:
      "On démarre par 30 minutes d'échange, offertes, par téléphone ou en visio, pour parler de ton activité et de ta saison. Depuis Montpellier, l'A750 mène tout droit vers Clermont-l'Hérault : je fais le déplacement en boutique, à l'atelier ou au bord du lac quand le projet le demande. Le suivi se fait ensuite à distance, avec une réponse sous 24 h.",
    faq: [
      {
        q: "Je propose des activités autour du lac du Salagou : comment gérer les réservations sans passer l'été au téléphone ?",
        a: "Avec un planning de réservation en ligne : chaque client choisit l'activité, le créneau et le nombre de personnes, puis reçoit une confirmation automatique. Tu fixes tes jours d'ouverture selon la saison et tu suis tout depuis ton téléphone. Un outil de ce genre, développé pour toi, part de 1 500 €, mais un simple formulaire de demande peut suffire pour commencer.",
      },
      {
        q: "Mon commerce est dans le centre de Clermont-l'Hérault : comment profiter du monde qui vient au marché du mercredi ?",
        a: "Le mercredi, c'est le moment de récupérer des contacts et des avis : un QR code en vitrine vers ta fiche Google ou vers ta lettre d'info, et une offre à utiliser dans la semaine. Les autres jours, un message automatique à ce fichier donne une raison de revenir. Et une fiche Google à jour rassure ceux qui cherchent un commerce ouvert un autre jour que le mercredi.",
      },
      {
        q: "Je suis vigneron dans le Clermontais : comment attirer jusqu'à mon caveau les visiteurs du Salagou ?",
        a: "Il faut d'abord qu'ils te voient pendant qu'ils organisent leur journée : une fiche Google du caveau avec tes horaires de saison, des photos et l'itinéraire, et un site qui propose dégustations ou visites sur réservation. Quand on demande à une IA quoi faire autour du lac, elle puise dans ce que les sites et les fiches Google disent de toi : autant que ce soit clair et à jour. Pour démarrer, un site vitrine avec son référencement local coûte à partir de 800 €.",
      },
    ],
    nearby: ['pezenas', 'juvignac', 'marseillan'],
    nearbyTowns: ['Ceyras', 'Nébian', 'Canet', 'Brignac', 'Villeneuvette', 'Mourèze'],
    featured: 'creation-site-internet',
  },
  {
    slug: 'nimes',
    name: 'Nîmes',
    postalCode: '30000',
    department: 'Gard',
    wikipedia: 'https://fr.wikipedia.org/wiki/Nîmes',
    situation: 'Préfecture du Gard, à une cinquantaine de kilomètres au nord-est de Montpellier',
    metaTitle: 'Site web à Nîmes : visibilité sur Google et les IA',
    metaDescription:
      "Commerces de l'Écusson, restaurants, cabinets, vignerons : à Nîmes, je crée ton site et je soigne ta visibilité sur Google et auprès des IA. Appel offert.",
    h1: "Site internet et visibilité locale à Nîmes, de l'Écusson aux zones d'activités",
    lead:
      "À Nîmes, j'aide les commerçants de l'Écusson, les restaurateurs, les professions libérales, les vignerons des Costières et les entreprises des zones d'activités à être trouvés en ligne. Je crée ton site internet, je soigne ta fiche Google et je rends tes infos lisibles par les assistants IA, pour que les Nîmois comme les visiteurs puissent te trouver et te contacter sans effort.",
    context: [
      "Préfecture du Gard, Nîmes réunit plusieurs économies en une. Dans l'Écusson, son centre historique, les boutiques, les Halles et les restaurants vivent entre les arènes, le musée de la Romanité et la Maison Carrée, récemment inscrite au patrimoine mondial de l'UNESCO. Autour, il y a les administrations, le CHU Carémeau, l'université, les zones d'activités comme Grézan ou le parc Georges-Besse, et les vignerons des Costières de Nîmes. Beaucoup de ces entreprises doivent leurs clients au bouche-à-oreille. L'enjeu digital : dans une ville où la concurrence est forte, être facile à trouver, vite compris et choisi au bon moment.",
      "Les recherches suivent le calendrier nîmois. Toute l'année, les habitants tapent « plombier Nîmes », « ostéopathe près de Carémeau » ou « coiffeur Écusson ». Pendant les ferias de Pentecôte et des Vendanges, ce sont plutôt « restaurant près des arènes », « bodega ce soir » ou « appartement à louer pour la feria ». Les visiteurs veulent savoir où goûter une brandade ou quel domaine des Costières visiter, et ils le cherchent sur leur téléphone. De plus en plus, ils demandent aussi à une IA comme ChatGPT ou Gemini « un bon restaurant près de la Maison Carrée ». Pour être cité, il faut des infos exactes, à jour et cohérentes partout.",
      "Un partenaire qui connaît Nîmes ne s'adresse pas de la même façon aux clients d'une boutique de l'Écusson, d'un cabinet de l'avenue Jean-Jaurès ou d'une entreprise de Grézan. Il sait aussi qu'une feria se prépare des semaines à l'avance (horaires exceptionnels sur Google, carte adaptée, réservation en ligne prête) et que l'été, les concerts aux arènes amènent un autre public. Chef d'entreprise pendant 14 ans, je connais la course permanente entre les clients, les salariés et les papiers. Je te propose l'essentiel, bien fait, et des outils simples que tu tiens à jour toi-même.",
    ],
    sectors: [
      {
        name: "Boutiques et artisans de l'Écusson",
        need: 'Une fiche Google impeccable (horaires, photos, avis) et un site qui met en valeur ce que tu vends et ce que tu sais faire, avec le retrait en boutique pour les clients pressés du centre-ville.',
      },
      {
        name: 'Restaurants et bars autour des arènes',
        need: 'Une carte en ligne accessible par QR code, mise à jour en quelques secondes, la réservation depuis le téléphone et des horaires exceptionnels bien affichés les soirs de feria ou de concert.',
      },
      {
        name: 'Vignerons des Costières de Nîmes',
        need: "Un site qui fait découvrir ton domaine et tes cuvées, des heures d'ouverture du caveau justes sur Google et les commandes en ligne, pour que ceux qui t'ont découvert aux Jeudis de Nîmes te retrouvent facilement.",
      },
      {
        name: 'Entreprises de Grézan et du parc Georges-Besse',
        need: 'Un site qui parle à tes clients professionnels, un formulaire de devis qui pose les bonnes questions et, quand les tableurs débordent, une application métier sur mesure, dès 1 500 €.',
      },
    ],
    meeting:
      "On commence par 30 minutes en visio ou par téléphone, offertes, et je te réponds sous 24 h. Ensuite, on travaille surtout à distance, et rien ne part en ligne sans ton accord. Nîmes est à une cinquantaine de kilomètres de Montpellier par l'autoroute : je viens sur place quand c'est utile, pour le lancement ou pour former ton équipe.",
    faq: [
      {
        q: 'Mon restaurant est près des arènes de Nîmes : comment capter les clients des jours de feria ?',
        a: "En préparant ta présence en ligne plusieurs semaines avant : horaires exceptionnels sur ta fiche Google, photos récentes, carte à jour et réservation qui fonctionne bien sur mobile. Les jours de feria, les visiteurs cherchent souvent à la dernière minute, autour de l'endroit où ils se trouvent. Le reste de l'année, cette même fiche, bien tenue, te fait connaître des Nîmois.",
      },
      {
        q: 'Je loue un appartement à Nîmes, surtout pendant les ferias : un site de réservation en direct, ça vaut le coup ?',
        a: 'Oui, si tu veux fidéliser les voyageurs qui reviennent et moins dépendre des plateformes. Je crée un site de réservation pour 1 à 4 logements dès 250 €, avec tes calendriers Airbnb et Booking.com synchronisés par iCal (un lien de calendrier standard) et mis à jour toutes les quelques heures. Le tableau de bord pour suivre tes réservations est en option (+ 350 €), et la maintenance démarre à 35 € par mois.',
      },
      {
        q: "Comment faire pour qu'une IA recommande mon commerce nîmois ?",
        a: "Les assistants comme ChatGPT, Gemini ou Perplexity s'appuient sur ce qu'ils trouvent en ligne : ton site, ta fiche Google, tes avis, les annuaires. On décrit donc clairement ce que tu fais, où tu es (Écusson, quartier, arrêt de Tram'Bus) et pour qui, avec les mêmes infos partout. Personne ne peut garantir d'être cité, mais des infos précises et à jour augmentent tes chances. Ce travail de référencement sur Google (SEO) et auprès des IA (GEO) est inclus dans les sites que je crée, dès 800 €.",
      },
    ],
    nearby: ['uzes', 'sommieres', 'beaucaire'],
    nearbyTowns: ['Marguerittes', 'Caissargues', 'Bouillargues', 'Milhaud', 'Caveirac', 'Saint-Gilles'],
    featured: 'referencement-local-geo',
  },
  {
    slug: 'ales',
    name: 'Alès',
    postalCode: '30100',
    department: 'Gard',
    wikipedia: 'https://fr.wikipedia.org/wiki/Alès',
    situation: 'Au pied des Cévennes, à une quarantaine de kilomètres au nord-ouest de Nîmes',
    metaTitle: "Partenaire web des entreprises d'Alès et des Cévennes",
    metaDescription:
      "Commerces, artisans, ateliers et gîtes d'Alès : site internet, fiche Google et applications sur mesure, pour être trouvé et mieux t'organiser. Appel offert.",
    h1: "Sites internet et applications métier pour les entreprises d'Alès et du bassin alésien",
    lead:
      "À Alès et dans le bassin alésien, j'aide les commerçants, artisans, ateliers et entreprises de services à être trouvés en ligne et à mieux s'organiser. On commence par un site clair et une fiche Google solide, puis je développe des outils sur mesure quand les tableurs et les carnets ne suffisent plus.",
    context: [
      "Souvent considérée comme la capitale des Cévennes, Alès a grandi avec le charbon, dont la Mine témoin raconte l'histoire, et avec la soie : c'est ici que Louis Pasteur a étudié la maladie des vers à soie. La ville vit aujourd'hui surtout du commerce et des services, mais elle garde une vraie culture technique, avec IMT Mines Alès, des industriels et, juste à côté, le Pôle mécanique. Beaucoup d'entreprises y gèrent encore devis, plannings et commandes avec des outils bricolés au fil des années. L'enjeu digital : montrer ce savoir-faire en ligne et gagner du temps sur l'administratif.",
      "Les Alésiens cherchent d'abord près de chez eux : « garage Alès », « électricien Alès » ou « restaurant centre-ville Alès ». Les visiteurs qui partent vers les Cévennes tapent « gîte près d'Alès », « visite Mine témoin » ou « que faire autour d'Anduze », et certains confient à une IA le soin de préparer leur week-end cévenol. Les entreprises, elles, cherchent un sous-traitant ou un prestataire technique et regardent son site avant de décrocher le téléphone. Dans tous les cas, il faut des horaires fiables, des avis récents, des infos claires sur mobile et un moyen simple de te contacter.",
      "Quand on connaît le bassin alésien, on sait que tes clients viennent du centre-ville comme des communes voisines et des vallées cévenoles, et que le calendrier local compte : feria de l'Ascension, Fous Chantants l'été, foires traditionnelles, fête de la Châtaigne à l'automne. Venu du BTP, où j'ai dirigé une entreprise pendant 14 ans, je parle le même langage que les artisans et les ateliers : devis, plannings, chantiers, relances. On part de la tâche qui te coûte le plus d'heures chaque semaine, et on construit un outil simple que ton équipe utilise vraiment.",
    ],
    sectors: [
      {
        name: 'Commerçants et producteurs du centre-ville',
        need: "Des horaires et des photos à jour sur ta fiche Google, des avis auxquels tu réponds et un site simple qui montre tes produits, pour que les clients des Halles de l'Abbaye et du centre te retrouvent aussi en ligne.",
      },
      {
        name: 'Ateliers et industriels',
        need: 'Un site qui présente ton savoir-faire à tes clients professionnels, et une application pour suivre commandes, maintenance et planning sans ressaisie ni fichiers en double.',
      },
      {
        name: 'Artisans du bâtiment',
        need: 'Tes réalisations en photos, les communes où tu interviens dans le bassin alésien et le suivi de chantier depuis le téléphone, avec une application sur mesure dès 1 500 €.',
      },
      {
        name: "Gîtes et chambres d'hôtes aux portes des Cévennes",
        need: "Des photos qui donnent envie, l'essentiel en anglais, un accès bien expliqué et la réservation en direct sur ton propre site, dès 250 €.",
      },
    ],
    meeting:
      "On fait connaissance en 30 minutes, par téléphone ou en visio, gratuitement, et tu as une réponse sous 24 h. Pour un outil métier, je viens à Alès voir comment ton équipe travaille, puis je développe à distance et je te montre l'avancement au fil de l'eau. Depuis Montpellier, on rejoint Alès par la route de Sommières.",
    faq: [
      {
        q: 'Mon atelier à Alès travaille surtout pour des industriels : à quoi me servirait une application métier ?',
        a: "À remplacer les fichiers Excel, les carnets et les messages éparpillés : suivi des commandes, planning des interventions, fiches de maintenance, bons signés sur téléphone. Tout le monde voit la même information, au bureau comme à l'atelier. Je la développe sur mesure, sous forme d'application web installable sur téléphone (une PWA), à partir de 1 500 €.",
      },
      {
        q: 'Je suis artisan à Alès et je travaille jusque dans les vallées cévenoles : comment le montrer sur Google ?',
        a: "On renseigne sur ta fiche Google les communes où tu interviens vraiment, sans forcément afficher ton adresse si tu travailles chez tes clients. Sur ton site, on montre des réalisations situées dans ces communes, plutôt qu'une longue liste de villages. Tes futurs clients voient tout de suite si tu viens jusque chez eux, et Google dispose d'infos cohérentes.",
      },
      {
        q: "J'ai un gîte près d'Alès : comment moins dépendre d'Airbnb et de Booking.com ?",
        a: "Avec un site de réservation à ton nom : les voyageurs qui t'ont découvert sur une plateforme peuvent réserver chez toi la fois suivante. Il démarre à 250 € pour 1 à 4 logements, et la synchronisation de tes calendriers par iCal se fait toutes les quelques heures, pour limiter les doubles réservations. Les plateformes servent à te faire connaître, ton site à fidéliser.",
      },
    ],
    nearby: ['uzes', 'sommieres', 'nimes'],
    nearbyTowns: [
      'Saint-Martin-de-Valgalgues',
      'Saint-Privat-des-Vieux',
      'Saint-Hilaire-de-Brethmas',
      'Saint-Christol-lez-Alès',
      'Saint-Jean-du-Pin',
      'Cendras',
    ],
    featured: 'application-metier',
  },
  {
    slug: 'uzes',
    name: 'Uzès',
    postalCode: '30700',
    department: 'Gard',
    wikipedia: 'https://fr.wikipedia.org/wiki/Uzès',
    situation: "À environ vingt-cinq kilomètres au nord de Nîmes, au cœur de l'Uzège",
    metaTitle: "Site de réservation pour gîtes à Uzès et dans l'Uzège",
    metaDescription:
      "Gîtes, chambres d'hôtes, producteurs et boutiques d'Uzès : un site de réservation dès 250 €, un site vitrine et une fiche Google soignée. Premier appel offert.",
    h1: "Uzès et l'Uzège : un site de réservation pour tes gîtes, un site internet pour ton terroir",
    lead:
      "À Uzès et dans l'Uzège, j'aide les propriétaires de gîtes et de chambres d'hôtes à recevoir des réservations en direct, et les producteurs, restaurateurs et commerçants à gagner en visibilité sur Google. Un seul interlocuteur, du site de réservation à la fiche Google, et des outils simples à faire vivre toi-même.",
    context: [
      "À Uzès, le patrimoine et le terroir font tourner l'économie. Ville d'art et d'histoire, la cité du Duché, de la tour Fenestrelle et de la place aux Herbes reçoit des visiteurs au fil des saisons : marchés aux truffes l'hiver, festival de danse en juin, foire aux vins en août. Dans l'Uzège, gîtes, mas et chambres d'hôtes les accueillent, pendant que vignerons du Duché d'Uzès, oléiculteurs, trufficulteurs et commerces indépendants du centre historique font vivre la ville. L'enjeu digital : être choisi avant même que le voyageur arrive, puis lui donner envie de revenir.",
      "Un séjour à Uzès se prépare souvent de loin, parfois des semaines à l'avance. Le voyageur tape « chambre d'hôtes Uzès avec piscine », « gîte près du pont du Gard » ou « marché d'Uzès horaires », puis compare les disponibilités, les photos et ce qu'en disent les autres voyageurs. De plus en plus, il demande aussi à un assistant comme ChatGPT de lui composer une semaine dans le Gard, avec des adresses où dormir et manger. Une fois sur place, il cherche une table ouverte un soir de semaine ou un caveau où goûter le Duché d'Uzès. Si tes infos sont floues ou anciennes, c'est une autre adresse qui sort.",
      "Quelqu'un qui connaît l'Uzège sait qu'un séjour ici se choisit pour une ambiance : les vieilles pierres, la garrigue, le marché du samedi et la saison des truffes font partie de ce que tu proposes. On le raconte avec tes mots, sur un site qui t'appartient, et on synchronise ton calendrier avec Airbnb et Booking.com par iCal, un lien qui recense les nuits déjà réservées : les plateformes le relisent à quelques heures d'intervalle, pas à la seconde. J'ai été patron pendant 14 ans : pour moi, un outil doit te libérer du temps, pas t'en prendre.",
    ],
    sectors: [
      {
        name: "Gîtes, mas et chambres d'hôtes de l'Uzège",
        need: "Un site où l'on réserve chez toi sans intermédiaire (de 1 à 4 logements ou chambres, à partir de 250 €) : le voyageur choisit ses dates, reçoit un e-mail de confirmation, et tes disponibilités se mettent à jour côté Airbnb et Booking.com en quelques heures.",
      },
      {
        name: 'Trufficulteurs, vignerons et oléiculteurs',
        need: 'Tes jours de marché et les horaires de ton caveau ou de ton moulin, justes sur Google, et, pendant la saison de la truffe, un formulaire de commande avec créneaux de retrait.',
      },
      {
        name: 'Restaurants et cafés du centre historique',
        need: "Une carte que tu changes au fil du marché et des saisons, des horaires justes même en hiver, et des photos récentes pour qu'en passant place aux Herbes, on choisisse ta table plutôt que celle d'à côté.",
      },
      {
        name: 'Boutiques et artisans des ruelles piétonnes',
        need: "Un site vitrine pour montrer ton savoir-faire, l'essentiel traduit en anglais si ta clientèle le demande, et une demande de pièce sur mesure en quelques champs.",
      },
    ],
    meeting:
      "Premier pas : une demi-heure au téléphone ou en visio, offerte, pour faire connaissance. Le travail se poursuit à distance : tu vois chaque version et tu donnes ton accord avant qu'elle soit publiée. Uzès est à un peu plus d'une heure de route de Montpellier : je viens sur place pour les étapes où c'est vraiment utile, comme voir ton gîte ou te montrer comment gérer tes réservations.",
    faq: [
      {
        q: "J'ai un gîte près d'Uzès, déjà loué sur Airbnb : pourquoi ajouter mon propre site de réservation ?",
        a: "Pour accueillir en direct tes habitués et ceux qui te découvrent par le bouche-à-oreille, sans laisser de commission à une plateforme. Ton site s'ajoute à Airbnb, il ne le remplace pas : les disponibilités s'échangent par iCal, avec un décalage de quelques heures, et une règle simple, convenue ensemble, encadre les arrivées de dernière minute. Compte 250 € pour démarrer, et 350 € de plus pour le tableau de bord en option.",
      },
      {
        q: 'Je suis trufficulteur ou restaurateur à Uzès : comment profiter de la saison de la truffe en ligne ?',
        a: "En la préparant dès l'automne. Prévois une page dédiée avec tes produits ou ton menu, les dates des marchés aux truffes et du week-end de la truffe en janvier, ta fiche Google mise à jour pour la saison et, si tu vends, une précommande en ligne avec des créneaux de retrait. Pour ce genre d'outil, compte 1 500 € au minimum ; la page seule te met déjà sur les rails.",
      },
      {
        q: "Ma boutique est dans une ruelle du centre historique d'Uzès : comment aider les clients à me trouver ?",
        a: "Première étape, ta fiche Google : adresse exacte, repère bien placé sur la carte, photos de ta devanture et de la rue. Sur ton site, indique un chemin simple depuis la place aux Herbes ou le Duché, et les parkings les plus proches. Tu évites les appels « je ne vous trouve pas » et tu facilites la vie de ceux qui découvrent la ville.",
      },
    ],
    nearby: ['nimes', 'bagnols-sur-ceze', 'ales'],
    nearbyTowns: [
      'Saint-Quentin-la-Poterie',
      'Montaren-et-Saint-Médiers',
      'Arpaillargues-et-Aureillac',
      'Saint-Siffret',
      'Blauzac',
      'Sanilhac-Sagriès',
    ],
    featured: 'site-reservation-location-saisonniere',
  },
  {
    slug: 'bagnols-sur-ceze',
    name: 'Bagnols-sur-Cèze',
    postalCode: '30200',
    department: 'Gard',
    wikipedia: 'https://fr.wikipedia.org/wiki/Bagnols-sur-Cèze',
    situation: 'Au bord de la Cèze, dans le Gard rhodanien, à une cinquantaine de kilomètres de Nîmes vers le nord-est',
    metaTitle: 'Sites, automatisations et IA à Bagnols-sur-Cèze',
    metaDescription:
      'Commerces, entreprises techniques, vignerons : à Bagnols-sur-Cèze, site internet, automatisations et IA pour gagner du temps chaque semaine. Appel offert.',
    h1: 'Bagnols-sur-Cèze : site internet, automatisations et IA pour les pros du Gard rhodanien',
    lead:
      "À Bagnols-sur-Cèze et dans le Gard rhodanien, j'aide les commerçants, les entreprises techniques, les vignerons et les artisans à se faire connaître en ligne et à gagner du temps. On pose d'abord les bases, avec un site et ta fiche Google bien tenus, puis on confie à des automatisations et à l'IA les tâches qui reviennent sans cesse : rapports, relances, devis.",
    context: [
      "Capitale du Gard rhodanien, Bagnols-sur-Cèze a gardé son vieux centre, sa place Mallet à arcades et un marché du mercredi qui remonte au Moyen Âge. Au milieu du siècle dernier, l'arrivée du site nucléaire de Marcoule, tout proche, a transformé la ville, et exploitants comme sous-traitants y travaillent toujours. Autour, les vignes des Côtes-du-Rhône, les zones commerciales des entrées de ville et la zone industrielle de la route d'Avignon complètent le tableau. L'enjeu digital : présenter un vrai savoir-faire en ligne, et alléger l'administratif qui pèse sur les métiers techniques.",
      "À Bagnols, les habitants cherchent un commerce ou un artisan proche : « plombier Bagnols-sur-Cèze », « fleuriste Bagnols » ou « marché de Bagnols mercredi ». Les entreprises qui cherchent un prestataire dans le secteur regardent son site avant de le contacter : compétences, références, réactivité. Les visiteurs, eux, préparent une journée entre la vallée de la Cèze, le Pont du Gard et les gorges de l'Ardèche, cherchent « musée Albert-André » ou « caveau Côtes-du-Rhône près de Bagnols », et demandent parfois à une IA où déjeuner le jour du marché. À chaque fois, il faut des réponses claires et faciles à trouver sur mobile.",
      "Quelqu'un qui connaît le secteur sait que Bagnols regarde à la fois vers Nîmes, Avignon, Alès et Montélimar, et que tes clients viennent des villages voisins autant que de la ville. Il sait aussi qu'une entreprise technique ne se présente pas comme une boutique : on parle compétences, sécurité, qualité et délais. J'ai dirigé une entreprise du BTP pendant 14 ans, avec ses devis, ses équipes et ses comptes rendus. Je t'aide à automatiser ce qui revient chaque semaine, à utiliser l'IA en protégeant tes données, et à garder un site à jour sans y passer tes soirées.",
    ],
    sectors: [
      {
        name: 'Commerces du centre et du marché du mercredi',
        need: 'Une fiche Google à jour, des avis récents et un site simple, pour que les clients du marché pensent aussi à ta boutique le reste de la semaine.',
      },
      {
        name: 'Entreprises techniques et sous-traitants industriels',
        need: "Un site qui présente tes compétences et tes références, et des automatisations pour produire rapports d'intervention, relances et devis sans tout ressaisir.",
      },
      {
        name: 'Vignerons des Côtes-du-Rhône',
        need: "Un site qui donne envie de pousser la porte de ton caveau, des horaires de dégustation justes sur ta fiche Google et des réservations prises en ligne, pour que les visiteurs passés par l'Espace Rabelais te trouvent ensuite.",
      },
      {
        name: 'Artisans du bâtiment du Gard rhodanien',
        need: "Tes chantiers terminés en photos, ta zone d'intervention autour de Bagnols et des devis envoyés plus vite, grâce à des modèles et des relances automatiques.",
      },
    ],
    meeting:
      "Tout commence par un appel découverte d'une demi-heure, gratuit, en visio ou par téléphone, et je reviens vers toi sous 24 h. La suite avance à distance, avec ta validation à chaque étape, et je viens à Bagnols quand c'est utile, par exemple pour former ton équipe. Depuis Montpellier, on rejoint Bagnols par l'autoroute A9 jusqu'à Roquemaure.",
    faq: [
      {
        q: "Mon entreprise travaille pour les sites industriels autour de Bagnols : l'IA peut-elle m'aider sans exposer nos données ?",
        a: "Oui, avec des règles claires : on choisit des outils adaptés, on définit ce qui peut y entrer ou non, et les documents sensibles restent hors des services grand public. L'IA peut déjà t'aider à rédiger un premier jet de rapport, à résumer un cahier des charges ou à préparer une relance. Je t'accompagne pour la mettre en place et former ton équipe : la formation est sur devis, et les automatisations sur mesure démarrent à 3 000 €.",
      },
      {
        q: 'Je tiens une boutique dans le centre de Bagnols : comment profiter du marché du mercredi ?',
        a: 'En étant facile à trouver ce jour-là : horaires à jour sur Google, photos de ta vitrine, et pourquoi pas une nouveauté annoncée la veille sur ta fiche. Les visiteurs du marché qui te découvrent doivent pouvoir te retrouver en ligne ensuite, avec un site qui présente ta boutique et ce que tu vends. Pour un site vitrine, compte à partir de 800 €, avec la fiche Google et le référencement local inclus.',
      },
      {
        q: "Je suis vigneron près de Bagnols-sur-Cèze : comment toucher les visiteurs de la vallée de la Cèze et de l'Ardèche ?",
        a: "Ces visiteurs organisent souvent leur journée sur leur téléphone, la veille ou le matin même, sur Google Maps ou en interrogeant une IA. Ta fiche Google doit donc afficher des horaires de caveau exacts, ton site doit être rapide et proposer l'essentiel en anglais, et la réservation des visites doit se faire en quelques clics. On commence simplement, puis on ajoute la vente en ligne si elle a du sens pour toi.",
      },
    ],
    nearby: ['uzes', 'beaucaire', 'nimes'],
    nearbyTowns: ['Saint-Nazaire', 'Vénéjan', 'Chusclan', 'Orsan', "Laudun-l'Ardoise", 'Sabran'],
    featured: 'automatisation-ia',
  },
  {
    slug: 'beaucaire',
    name: 'Beaucaire',
    postalCode: '30300',
    department: 'Gard',
    wikipedia: 'https://fr.wikipedia.org/wiki/Beaucaire_(Gard)',
    situation: "Sur la rive droite du Rhône, face à Tarascon, à moins de trente kilomètres à l'est de Nîmes",
    metaTitle: 'Beaucaire : un site web pour les deux rives du Rhône',
    metaDescription:
      'Commerces, restaurants du port, vignerons, entreprises : à Beaucaire, un site et une fiche Google qui parlent au Gard comme à la Provence. Premier appel offert.',
    h1: 'Site internet et visibilité Google à Beaucaire, pour être trouvé des deux côtés du Rhône',
    lead:
      "À Beaucaire et en Terre d'Argence, je conçois le site internet et je soigne la fiche Google des commerçants, artisans, restaurateurs, vignerons et entreprises. Ta clientèle peut venir des deux rives du Rhône et, l'été, des plaisanciers et des cyclistes s'y ajoutent : ton site doit parler à chacun, simplement.",
    context: [
      "Ville d'art et d'histoire au bord du Rhône, face à Tarascon, Beaucaire est à la croisée du Languedoc et de la Provence, entre les Costières au nord et la Camargue au sud. Son économie mêle les commerces du centre historique et de la zone des Milliaires, les artisans, les domaines des Costières de Nîmes, les producteurs de la plaine, les entreprises installées près de l'A9 et de l'A54, et un tourisme porté par le château, l'abbaye troglodytique de Saint-Roman et le port. L'enjeu digital : exister auprès d'une clientèle répartie sur deux départements, et capter les visiteurs de passage.",
      "Les Beaucairois et leurs voisins de Tarascon cherchent au plus près : « boulangerie Beaucaire », « électricien Beaucaire » ou « restaurant sur le port ». L'été, les plaisanciers du canal du Rhône à Sète et les cyclistes de la ViaRhôna tapent « où dormir à Beaucaire » ou « abbaye de Saint-Roman », souvent sur leur téléphone, en cours de route. Pendant les fêtes de la Madeleine, en juillet, on cherche où manger et où sortir. Certains visiteurs demandent aussi à une IA quoi voir entre Nîmes, Avignon et Arles : si ton activité est bien décrite en ligne, elle a une chance d'apparaître dans la réponse.",
      "Connaître Beaucaire, c'est savoir que ta zone de clientèle ne s'arrête pas au Rhône : tes clients habitent le Gard ou les Bouches-du-Rhône, et ta fiche Google doit le refléter. C'est aussi savoir que l'été, entre les fêtes de la Madeleine, les animations du port et les visiteurs, la ville change de rythme. J'ai été chef d'entreprise : tenir la boutique, les clients et les papiers en même temps, je connais. Je te propose un site clair, que tu peux modifier sans aide, et une fiche Google tenue au bon moment, plutôt qu'un projet lourd que tu n'aurais pas le temps de suivre.",
    ],
    sectors: [
      {
        name: 'Commerces et artisans du centre historique',
        need: 'Une fiche Google soignée, des photos récentes de ta boutique et un site qui montre ton savoir-faire, pour attirer les Beaucairois comme les habitants de Tarascon.',
      },
      {
        name: 'Restaurants et hébergements du port',
        need: 'Ta carte traduite, lisible sur téléphone grâce à un QR code, des horaires qui suivent la saison et une réservation simple, pour les plaisanciers et les cyclistes qui cherchent une table ou un lit pour le soir.',
      },
      {
        name: 'Vignerons des Costières et producteurs de la plaine',
        need: "Tes jours et heures de vente bien indiqués sur Google, un site qui présente ta ferme ou ton domaine, et la précommande en ligne des asperges en saison ou des colis de fin d'année.",
      },
      {
        name: "Entreprises des zones d'activités",
        need: 'Un site pour tes clients professionnels comme pour tes futurs salariés, des demandes de prix bien détaillées dès le premier message et, si besoin, un outil sur mesure pour suivre commandes et plannings.',
      },
    ],
    meeting:
      "Premier échange : un appel découverte de 30 minutes, offert, en visio ou au téléphone, avec une réponse sous 24 h. On avance ensuite surtout à distance, et je passe à Beaucaire quand c'est utile, en boutique, au caveau ou sur le port. Depuis Montpellier, on rejoint Beaucaire en passant par Nîmes.",
    faq: [
      {
        q: 'Mon commerce est à Beaucaire et je vois passer des clients de Tarascon : comment mieux les toucher ?',
        a: "Google ne s'arrête pas aux limites de département. On décrit ta vraie zone de clientèle sur ta fiche et ton site, en citant des repères connus des deux côtés du Rhône, et on entretient tes avis. Personne ne peut garantir un classement, mais des infos cohérentes aident Google comme tes clients à comprendre qui tu sers.",
      },
      {
        q: "Je tiens un restaurant ou une chambre d'hôtes près du port de Beaucaire : faut-il un site en anglais ?",
        a: "Au moins l'essentiel : ce que tu proposes, quand tu es ouvert, comment venir et comment réserver. Les plaisanciers et les cyclistes de la ViaRhôna viennent parfois de loin et préparent leur étape sur leur téléphone. Un site rapide, avec les pages clés traduites, suffit souvent, dès 800 €, référencement local compris.",
      },
      {
        q: "Mon entreprise est installée dans une zone d'activités de Beaucaire : un site peut-il m'aider à recruter ?",
        a: "Oui, car un candidat regarde souvent ton site avant de postuler. Une page claire sur tes métiers, tes horaires, comment venir et ce que tu proposes, avec un formulaire simple, t'évite des candidatures hors sujet. Le même site rassure tes clients professionnels, qui veulent savoir ce que tu fais et jusqu'où tu livres ou interviens.",
      },
    ],
    nearby: ['nimes', 'uzes', 'bagnols-sur-ceze'],
    nearbyTowns: ['Tarascon', 'Vallabrègues', 'Comps', 'Jonquières-Saint-Vincent', 'Bellegarde', 'Fourques'],
    featured: 'creation-site-internet',
  },
  {
    slug: 'sommieres',
    name: 'Sommières',
    postalCode: '30250',
    department: 'Gard',
    wikipedia: 'https://fr.wikipedia.org/wiki/Sommières',
    situation: "Sur le Vidourle, à la limite de l'Hérault, à mi-chemin entre Nîmes et Montpellier",
    metaTitle: 'Site internet à Sommières, entre Nîmes et Montpellier',
    metaDescription:
      'Commerçants, artisans, restaurateurs et vignerons de Sommières : un site internet et une fiche Google pour être trouvés de Nîmes à Montpellier. Appel offert.',
    h1: 'Site internet à Sommières : ton commerce visible toute la semaine, pas seulement le jour de marché',
    lead:
      "À Sommières, j'aide les commerçants, artisans, restaurateurs et vignerons du centre médiéval et du Pays de Sommières à exister en ligne, avec un site internet lisible et une fiche Google bien tenue. Ta clientèle peut venir du Gard comme de l'Hérault : on fait en sorte qu'elle te trouve, un samedi de marché comme un jour de semaine.",
    context: [
      "Sommières est une petite ville de caractère posée sur le Vidourle, à la limite de l'Hérault. Son centre médiéval en damier, ses places à arcades, son château et son pont romain attirent les promeneurs, et la ville vit du négoce depuis des siècles : marché du samedi, marché nocturne le mercredi en juillet et en août, brocante sur l'esplanade. Ajoute les vignerons du Languedoc-Sommières, les artisans d'art et les galeries. L'enjeu digital : que ces adresses se voient aussi en ligne, y compris par ceux qui ne viennent pas le samedi.",
      "À mi-chemin entre Nîmes et Montpellier, Sommières peut attirer des clients des deux bords : villages du Pays de Sommières, Vaunage, Lunel, périphérie montpelliéraine. Ils tapent « marché de Sommières », « restaurant Sommières bord du Vidourle », « galerie d'art Sommières » ou « électricien Pays de Sommières ». Un cycliste arrivé par la voie verte cherche un café ou un atelier vélo. Et certains demandent maintenant à une IA ce qu'il y a à faire autour de Sommières un samedi. Si tes infos sont claires et à jour, sur ta fiche comme sur ton site, tu fais partie des adresses qu'elle peut citer.",
      "Ici, on vit avec le Vidourle. Quand il déborde, il faut pouvoir prévenir tes clients vite : horaires exceptionnels sur Google, message sur ton site, e-mail à tes habitués. Quelqu'un du coin pense à ces détails avant qu'ils deviennent urgents. Pour les artisans, travailler dans le secteur sauvegardé, où les travaux passent par l'avis de l'Architecte des Bâtiments de France, est un vrai savoir-faire à montrer. Ancien patron dans le BTP, je sais le mettre en valeur sans en rajouter, et te proposer des outils simples pour gagner du temps.",
    ],
    sectors: [
      {
        name: "Commerces et artisans d'art du centre médiéval",
        need: "Une fiche Google avec tes vrais horaires, samedis de marché et soirs d'été compris, et un site vitrine où l'on découvre tes créations avant de passer ta porte.",
      },
      {
        name: 'Restaurants et cafés du centre ancien',
        need: 'Une carte en ligne, des horaires calés sur le marché nocturne du mercredi en juillet et en août, et des tables du samedi midi réservables simplement.',
      },
      {
        name: 'Vignerons et oléiculteurs du Pays de Sommières',
        need: "Un site qui explique le Languedoc-Sommières à ceux qui le découvrent, et un fichier clients relancé automatiquement avant tes portes ouvertes ou les fêtes de fin d'année.",
      },
      {
        name: 'Artisans du bâti ancien',
        need: "Des photos avant et après de tes chantiers en centre ancien, un devis en ligne où le client précise l'adresse et le type de travaux, et un dossier par chantier pour suivre les échanges.",
      },
    ],
    meeting:
      "Notre premier rendez-vous dure 30 minutes, il est gratuit et se fait au téléphone ou en visio, un jour qui t'arrange, hors samedi matin si tu es au marché ou en boutique. Le travail avance ensuite à distance, avec ton accord à chaque étape. Sommières est à une trentaine de kilomètres de Montpellier, et je passe volontiers dans ta boutique, ton atelier ou ton caveau chaque fois que c'est utile.",
    faq: [
      {
        q: 'Ma boutique de Sommières est exposée aux crues du Vidourle : comment prévenir mes clients si je dois fermer ?',
        a: "En préparant tout à l'avance : des horaires exceptionnels à publier rapidement sur ta fiche Google, un bandeau d'information prêt sur ton site et une liste de clients fidèles à prévenir par e-mail. Le jour venu, tu t'occupes de ton magasin, pas de ton téléphone. Et à la réouverture, un message peut partir tout seul pour annoncer que tu es de nouveau ouvert.",
      },
      {
        q: 'Je suis artisan et je travaille dans le secteur sauvegardé de Sommières : comment le valoriser en ligne ?',
        a: "En le montrant concrètement : photos de chantiers en centre ancien, matériaux et techniques utilisés, habitude des travaux soumis à l'avis de l'Architecte des Bâtiments de France. Un propriétaire qui rénove une maison du centre cherche exactement ce savoir-faire. Ce type de site vitrine, avec sa galerie de réalisations, se lance dès 800 €, et le référencement local est compris dans le prix.",
      },
      {
        q: 'Je vends au marché du samedi à Sommières : comment garder le lien avec les clients de passage ?',
        a: "Avec un QR code affiché sur ton étal, qui mène à une page simple : tes produits, tes autres marchés ou ta boutique, et un moyen de commander ou de recevoir tes nouvelles. Les visiteurs venus de Nîmes ou de Montpellier peuvent ainsi te retrouver entre deux samedis. Pas besoin d'un gros site pour commencer : une page claire, reliée à ta fiche Google, fait déjà le travail.",
      },
    ],
    nearby: ['lunel', 'mauguio', 'nimes'],
    nearbyTowns: ['Villevieille', 'Salinelles', 'Junas', 'Aspères', 'Boisseron', 'Saussines'],
    featured: 'creation-site-internet',
  },
  {
    slug: 'aigues-mortes',
    name: 'Aigues-Mortes',
    postalCode: '30220',
    department: 'Gard',
    wikipedia: 'https://fr.wikipedia.org/wiki/Aigues-Mortes',
    situation: 'À la pointe sud du Gard, en Petite Camargue, à une trentaine de kilomètres de Montpellier',
    metaTitle: "Visibilité Google et IA pour les pros d'Aigues-Mortes",
    metaDescription:
      "Restaurants, boutiques, croisières et producteurs d'Aigues-Mortes : fiche Google, site clair et infos à jour pour être choisis par les visiteurs. Appel offert.",
    h1: 'Site internet et référencement à Aigues-Mortes : capter les visiteurs au pied des remparts',
    lead:
      "À Aigues-Mortes, j'aide les restaurants, commerces, producteurs et organisateurs de visites à se rendre visibles pour ceux qui préparent leur venue ou cherchent sur place, dans Google Maps comme dans les réponses des assistants IA. Fiche Google soignée, site clair et infos à jour : l'essentiel pour être choisi entre la porte de la Gardette et la place Saint-Louis.",
    context: [
      "Aigues-Mortes, c'est d'abord une silhouette : des remparts qui enserrent toute la ville et la tour de Constance voulue par Saint Louis, au milieu des étangs et des marais salants de la Petite Camargue. La cité vit du tourisme, avec ses restaurants et ses boutiques intra-muros, mais aussi du sel des Salins, de la vigne, de l'asperge et de l'élevage des manades, gardiennes des traditions camarguaises. Pour ceux qui y travaillent, l'enjeu digital est clair : être trouvé au bon moment par des gens qui ne connaissent pas la ville et qui décident souvent sur leur téléphone.",
      "Les recherches se font souvent au pied des remparts, téléphone en main : « restaurant place Saint-Louis Aigues-Mortes », « visite des salins », « croisière canal Camargue », « fougasse d'Aigues-Mortes où acheter ». D'autres préparent leur venue : « que faire à Aigues-Mortes en une journée », « manade Petite Camargue ». Et la question est de plus en plus posée à une IA : « Organise-moi une journée entre Aigues-Mortes et Le Grau-du-Roi. » Les assistants s'appuient sur des sources claires : une adresse qui affiche horaires, tarifs, accès et un lien pour réserver est plus facile à recommander.",
      "Ici, tout le monde n'est pas de passage : les Aigues-Mortais vivent leur ville toute l'année, avec la fête votive d'octobre et ses courses camarguaises dans le Plan des Théâtres. Un partenaire qui connaît la cité t'aide à t'adresser aux uns comme aux autres sans te disperser : une fiche Google impeccable pour ceux qui passent la porte de la Gardette, un site clair pour ceux qui préparent leur venue, et les mêmes infos partout pour que Google et les IA comprennent qui tu es. Je t'explique chaque étape simplement, sans jargon.",
    ],
    sectors: [
      {
        name: 'Restaurants et commerces intra-muros',
        need: "Des horaires exacts sur Google, des photos récentes, ta carte ou tes produits en ligne et l'essentiel en anglais, pour convaincre le visiteur qui hésite entre deux adresses de la place Saint-Louis.",
      },
      {
        name: 'Croisières sur le canal et visites guidées',
        need: "Un planning des départs toujours juste, des places réservables en ligne et un rappel automatique la veille, avec l'heure et le point d'embarquement.",
      },
      {
        name: "Vignerons et producteurs d'asperges",
        need: 'Un caveau ou une vente à la ferme bien placés sur Google Maps, avec des horaires de saison, et un site qui présente le Sable de Camargue et tes asperges à ceux qui les découvrent.',
      },
      {
        name: 'Boulangeries et pâtisseries',
        need: "Une fiche Google qui répond à « fougasse d'Aigues-Mortes près de moi », des horaires fiables et, pour Noël, des commandes prises en ligne et retirées au comptoir.",
      },
    ],
    meeting:
      "On commence par un rendez-vous de 30 minutes, gratuit, au téléphone ou en visio, calé en dehors de ton service. Ensuite, je travaille à distance et je te soumets chaque étape avant d'aller plus loin. Depuis Montpellier, la route est directe : je viens volontiers faire le point sur place, dans ta boutique, ton restaurant ou à ton point d'embarquement.",
    faq: [
      {
        q: "Les visiteurs d'Aigues-Mortes cherchent sur place, au dernier moment : par quoi commencer ?",
        a: "Par ta fiche Google : horaires exacts, y compris les jours fériés et les soirs d'été, photos récentes, lien vers ta carte ou ta réservation, et des réponses aux avis. C'est souvent elle qu'un visiteur voit en premier sur Google Maps. Vient ensuite un site simple et rapide sur mobile, à partir de 800 € et avec le référencement local dans le prix.",
      },
      {
        q: 'Comment être cité quand un touriste demande à ChatGPT que faire à Aigues-Mortes ?',
        a: "Personne ne peut le garantir, mais tu peux nettement améliorer tes chances. Les assistants IA s'appuient sur des sources claires et cohérentes : un site qui dit précisément ce que tu proposes, où, quand et à quel prix, une fiche Google remplie avec soin et les mêmes infos partout ailleurs. Une FAQ qui répond aux vraies questions des visiteurs, comme la durée, l'accès ou le stationnement, aide aussi.",
      },
      {
        q: "J'organise des croisières ou des visites au départ d'Aigues-Mortes : la réservation en ligne vaut-elle le coup ?",
        a: "Si tu passes tes journées au téléphone pour prendre des places, oui. Un outil sur mesure affiche les départs, gère les places restantes, envoie la confirmation puis un rappel la veille avec le point de rendez-vous. Ce type de développement se chiffre à partir de 1 500 € ; en attendant, une simple page de demande de places sur ton site peut suffire.",
      },
    ],
    nearby: ['le-grau-du-roi', 'la-grande-motte', 'lunel'],
    nearbyTowns: ["Saint-Laurent-d'Aigouze", 'Marsillargues', 'Saintes-Maries-de-la-Mer', 'Le Cailar', 'Aimargues'],
    featured: 'referencement-local-geo',
  },
  {
    slug: 'le-grau-du-roi',
    name: 'Le Grau-du-Roi',
    postalCode: '30240',
    department: 'Gard',
    wikipedia: 'https://fr.wikipedia.org/wiki/Le_Grau-du-Roi',
    situation: "Sur le littoral de Petite Camargue, au sud-est de Montpellier, à la limite de l'Hérault",
    metaTitle: 'Site de réservation pour ta location au Grau-du-Roi',
    metaDescription:
      'Le Grau-du-Roi : ton site de réservation dès 250 € pour louer en direct, et une présence en ligne pour les pros du port et de Port-Camargue. Appel offert.',
    h1: 'Le Grau-du-Roi : site de réservation pour les loueurs, présence en ligne pour les métiers de la mer',
    lead:
      "Au Grau-du-Roi, j'aide les propriétaires de locations de vacances à louer en direct, sans commission sur ces séjours, grâce à leur propre site de réservation. Je donne aussi aux pêcheurs, restaurateurs et entreprises nautiques une présence en ligne qui suit le rythme de la station.",
    context: [
      "Le Grau-du-Roi est la seule commune du Gard au bord de la mer. Autour du chenal qui relie Aigues-Mortes à la mer, le centre garde son âme de village de pêcheurs, avec ses chalutiers, ses quais et le vieux phare. À l'ouest s'étend le Boucanet, à l'est Port-Camargue et sa marina, puis la plage sauvage de l'Espiguette. On y vit de la pêche, du nautisme, du commerce et surtout de l'accueil des vacanciers, en hôtel, en camping ou en location. L'enjeu digital : remplir la saison sans tout laisser aux plateformes.",
      "Les vacanciers réservent parfois des mois à l'avance, en tapant « location Grau-du-Roi à pied de la plage », « appartement Port-Camargue avec parking » ou « location près de l'Espiguette ». Quand l'un d'eux revient l'été suivant, chaque séjour repassé par une plateforme te coûte une commission. Sur place, ils cherchent « poisson frais Grau-du-Roi », « restaurant tellines » ou « cours de voile Port-Camargue ». Et avant de partir, certains interrogent une IA : où loger en famille au bord de la mer, côté Gard ? Autant que ta location soit clairement décrite en ligne.",
      "Ici, les voyageurs choisissent sur des détails : rive droite ou rive gauche, Boucanet ou Port-Camargue, à pied de la plage ou du chenal, avec ou sans stationnement. Je t'aide à les mettre en avant sur un site à ton nom, relié à Airbnb et Booking.com grâce à l'iCal, le lien qui échange les nuits réservées, avec quelques heures de décalage entre deux mises à jour. Et je tiens compte du calendrier graulen, qui ne se résume pas à l'été : abrivado des plages en mars, fête votive en septembre avec ses joutes et ses courses camarguaises. Autant de temps forts à annoncer, et de dates à remplir hors du plein été.",
    ],
    sectors: [
      {
        name: 'Propriétaires de locations de vacances',
        need: "Ton site de réservation à partir de 250 €, un lien à donner à tes habitués pour qu'ils reviennent en direct, et en option l'envoi du code d'accès et des consignes avant l'arrivée.",
      },
      {
        name: 'Petits métiers de la pêche',
        need: "Une fiche Google qui indique où et quand tu vends sur le quai, et une page d'arrivage que tu modifies depuis ton portable, le bateau à peine amarré.",
      },
      {
        name: 'Restaurants des quais et paillotes',
        need: 'Tellines, rouille graulenne ou poisson du jour : une carte en ligne à jour, des horaires ajustés au fil de la saison, et une table réservable en quelques clics sur mobile.',
      },
      {
        name: 'Entreprises nautiques de Port-Camargue',
        need: "Écoles de voile, loueurs, chantiers de la zone technique : la réservation de tes créneaux en ligne, et des devis où le client indique d'emblée son bateau et la prestation voulue.",
      },
    ],
    meeting:
      "On fait d'abord le point ensemble pendant 30 minutes, gratuitement et sans engagement, par téléphone ou en visio. Le travail se fait ensuite en ligne, et je te montre le site au fil de l'avancement pour que tu gardes la main. Le Grau-du-Roi est à une trentaine de kilomètres de Montpellier, et je viens volontiers dans ta location, sur les quais ou à Port-Camargue dès que se voir fait avancer le projet.",
    faq: [
      {
        q: "J'ai un appartement en location à Port-Camargue : comment faire revenir mes voyageurs en direct l'été suivant ?",
        a: "En leur donnant ton lien au bon moment : dans le message de bienvenue, sur une carte dans le logement, dans l'e-mail de fin de séjour. Ton site affiche tes disponibilités, le voyageur réserve et reçoit sa confirmation, sans commission sur ce séjour. Si tu restes aussi sur Airbnb ou Booking.com, tes calendriers restent alignés grâce à l'iCal, avec un délai de quelques heures entre deux synchronisations.",
      },
      {
        q: 'Mes voyageurs arrivent au Grau-du-Roi à toute heure : comment gérer les arrivées sans attendre sur place ?',
        a: "Avec l'arrivée autonome, proposée en option : avant le séjour, ton voyageur reçoit le code d'accès, les consignes et les infos pratiques, comme le stationnement ou le chemin de la plage. Tu n'attends plus avec les clés un samedi de juillet. Et après son départ, une demande d'avis peut lui être envoyée automatiquement.",
      },
      {
        q: "Je suis pêcheur au Grau-du-Roi et je vends sur le quai : un site, c'est utile ?",
        a: "Un grand site, pas forcément. Une fiche Google bien remplie (emplacement sur le quai, jours de vente, photos) et une petite page d'arrivage, modifiable depuis ton portable, sont souvent un bon point de départ, pour les Graulens comme pour les vacanciers. Si les réservations de poisson arrivent de partout par téléphone, un outil fait pour toi peut les centraliser, à partir de 1 500 €.",
      },
    ],
    nearby: ['aigues-mortes', 'la-grande-motte', 'mauguio'],
    nearbyTowns: ['Saintes-Maries-de-la-Mer', "Saint-Laurent-d'Aigouze", 'Saint-Nazaire-de-Pézan', 'Candillargues'],
    featured: 'site-reservation-location-saisonniere',
  },
]

export function getZone(slug: string): Zone | undefined {
  return zones.find((z) => z.slug === slug)
}

/** « à Nîmes », « au Grau-du-Roi » : le nom précédé de « à », article contracté si besoin. */
export function inCity(name: string) {
  if (name.startsWith('Le ')) return `au ${name.slice(3)}`
  if (name.startsWith('Les ')) return `aux ${name.slice(4)}`
  return `à ${name}`
}

/** « de Nîmes », « d'Agde », « du Grau-du-Roi » : le nom précédé de « de », élidé ou contracté si besoin. */
export function ofCity(name: string) {
  if (name.startsWith('Le ')) return `du ${name.slice(3)}`
  if (name.startsWith('Les ')) return `des ${name.slice(4)}`
  return /^[AÂÀEÉÈÊIÎOÔUÛY]/.test(name) ? `d'${name}` : `de ${name}`
}

/** Les deux départements couverts, dans l'ordre d'affichage, avec leurs villes. */
export const departments: { name: Department; label: string; intro: string }[] = [
  { name: 'Hérault', label: "Dans l'Hérault", intro: "Montpellier et sa métropole, le littoral, le Biterrois et le cœur d'Hérault." },
  { name: 'Gard', label: 'Dans le Gard', intro: "Nîmes, Alès et les Cévennes, l'Uzège, la Camargue gardoise et la vallée du Rhône." },
]

export const zonesIn = (department: Department) => zones.filter((z) => z.department === department)

/** Villes principales, reprises dans le pied de page (les autres restent accessibles depuis « Zones d'intervention »). */
export const mainZones = ['montpellier', 'nimes', 'beziers', 'sete', 'ales', 'lunel', 'agde', 'uzes']
