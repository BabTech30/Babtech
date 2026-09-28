/**
 * Contenu du tableau de bord /admin, tenu à jour par Claude à chaque étape (tâches, décisions,
 * santé du site). Tes coches et tes chiffres du mois sont enregistrés sur le serveur
 * (src/lib/admin/store.ts) : une nouvelle version de ce fichier ne les efface pas.
 */

export type Owner = 'toi' | 'claude'

export type AdminPhase = { id: string; title: string }

export type AdminTask = {
  id: string
  phase: string
  owner: Owner
  title: string
  detail?: string
  link?: string
  linkLabel?: string
  /** Tâches de Claude : cochées ici. Les tiennes : cochées par toi dans le tableau de bord. */
  done?: boolean
  /** Cochée automatiquement quand la condition est remplie. */
  auto?: 'password-changed'
}

export const adminUpdatedAt = '2026-09-28'

export const adminPhases: AdminPhase[] = [
  { id: 'site', title: 'Site prêt' },
  { id: 'node', title: 'Hébergement Node.js' },
  { id: 'launch', title: 'Mise en ligne' },
  { id: 'local', title: 'Visibilité locale' },
  { id: 'legal', title: 'Infos légales' },
  { id: 'community', title: 'Communauté' },
]

export const adminTasks: AdminTask[] = [
  {
    id: 'site-pages',
    phase: 'site',
    owner: 'claude',
    done: true,
    title: 'Créer le site : 35 pages, 7 articles, 9 zones',
    detail: 'Accueil, 5 services, Montpellier et 8 villes, blog, communauté, contact, FAQ.',
  },
  {
    id: 'site-quality',
    phase: 'site',
    owner: 'claude',
    done: true,
    title: 'Contrôle qualité : SEO et accessibilité à 100',
    detail: 'Liens, balises, données structurées et sitemap vérifiés à chaque modification.',
  },
  {
    id: 'offer-booking',
    phase: 'site',
    owner: 'claude',
    done: true,
    title: "Ajouter l'offre « site de réservation » pour les locations saisonnières",
    detail: 'Dès 250 €, tableau de bord en option (+ 350 €), maintenance dès 35 € par mois : page service, accueil, FAQ, pages des villes.',
    link: 'https://babtech.fr/services/site-reservation-location-saisonniere/',
    linkLabel: "Voir l'offre",
  },
  {
    id: 'presentation',
    phase: 'site',
    owner: 'claude',
    done: true,
    title: 'Page de présentation, carte de visite et page À propos avec ta photo',
    detail: 'babtech.fr/bastien/ et babtech.fr/carte/ (hors Google), vidéo CVC Energies Habitat, projet Hôtel Le Saint Éloi.',
    link: 'https://babtech.fr/carte/',
    linkLabel: 'Ta carte',
  },
  {
    id: 'node-adapt',
    phase: 'node',
    owner: 'claude',
    done: true,
    title: "Adapter le site à l'application Node.js d'Hostinger",
    detail: 'Mode serveur Next.js, en-têtes de sécurité, redirection www.',
  },
  {
    id: 'admin',
    phase: 'node',
    owner: 'claude',
    done: true,
    title: 'Créer ce tableau de bord sur /admin',
    detail: 'Connexion par identifiant et mot de passe, réglages, chiffres du mois.',
  },
  {
    id: 'password',
    phase: 'launch',
    owner: 'toi',
    auto: 'password-changed',
    title: 'Changer le mot de passe',
    detail: "Il est passé dans la conversation avec Claude : choisis-en un nouveau dans Réglages.",
    link: '/admin/reglages/',
    linkLabel: 'Réglages',
  },
  {
    id: 'email-pro',
    phase: 'launch',
    owner: 'toi',
    title: 'Créer la boîte contact@babtech.fr et brancher les e-mails du site',
    detail:
      "hPanel → Emails : crée la boîte. Puis, dans l'application Node.js, ajoute la variable SMTP_PASSWORD avec son mot de passe et redéploie. Vérifie avec Réglages → E-mails → « Envoyer un e-mail de test ».",
    link: 'https://hpanel.hostinger.com',
    linkLabel: 'hPanel',
  },
  {
    id: 'site-tour',
    phase: 'launch',
    owner: 'toi',
    title: 'Parcourir le site sur mobile et sur ordinateur',
    detail: 'Note ce qui te gêne (textes, photos, couleurs) : Claude corrige.',
    link: 'https://babtech.fr',
    linkLabel: 'babtech.fr',
  },
  {
    id: 'card-test',
    phase: 'launch',
    owner: 'toi',
    title: 'Tester ta carte de visite sur ton téléphone',
    detail: 'Touche « Enregistrer le contact » et vérifie la fiche, puis essaie « Partager ma carte ».',
    link: 'https://babtech.fr/carte/',
    linkLabel: 'Ta carte',
  },
  {
    id: 'forms-test',
    phase: 'launch',
    owner: 'toi',
    title: 'Envoyer un message test avec le formulaire de contact',
    detail: "Vérifie qu'il arrive dans l'onglet Demandes et sur contact@babtech.fr, et que tu reçois bien l'accusé de réception.",
    link: 'https://babtech.fr/contact/',
    linkLabel: 'Contact',
  },
  {
    id: 'live-check',
    phase: 'launch',
    owner: 'claude',
    title: 'Contrôler le site en ligne',
    detail: 'Vitesse, redirections, page 404, en-têtes, données structurées.',
  },
  {
    id: 'qr-codes',
    phase: 'launch',
    owner: 'claude',
    done: true,
    title: 'QR codes et compteur de scans dans ce tableau de bord',
    detail: 'Un QR code pour la présentation, un pour le site, un pour la carte de visite : à imprimer depuis « Partager ».',
    link: '/admin/partager/',
    linkLabel: 'Partager',
  },
  {
    id: 'qr-print',
    phase: 'launch',
    owner: 'toi',
    title: 'Imprimer tes QR codes',
    detail: "Après le déploiement : scanne-les d'abord avec ton téléphone, puis ajoute-les à ta carte de visite, tes flyers ou ton véhicule.",
    link: '/admin/partager/',
    linkLabel: 'Partager',
  },
  {
    id: 'pwa',
    phase: 'launch',
    owner: 'claude',
    done: true,
    title: 'Rendre ce tableau de bord installable comme une application',
    detail: 'Icône sur ton ordinateur ou ton téléphone, fenêtre à part, page « Pas de connexion » quand Internet coupe.',
  },
  {
    id: 'booking',
    phase: 'launch',
    owner: 'claude',
    done: true,
    title: 'Remplacer Calendly par ta propre prise de rendez-vous',
    detail: "Page babtech.fr/rendez-vous/, réglée dans l'onglet Rendez-vous : disponibilités, jours fermés, notification et e-mail à chaque réservation, agenda pour ton téléphone.",
    link: '/admin/rendez-vous/',
    linkLabel: 'Rendez-vous',
  },
  {
    id: 'booking-setup',
    phase: 'launch',
    owner: 'toi',
    title: 'Régler tes disponibilités et activer les notifications',
    detail: "Après le déploiement, onglet Rendez-vous. Sur iPhone, installe d'abord le tableau de bord sur l'écran d'accueil : les notifications ne marchent que dans l'application.",
    link: '/admin/rendez-vous/',
    linkLabel: 'Rendez-vous',
  },
  {
    id: 'booking-test',
    phase: 'launch',
    owner: 'toi',
    title: 'Faire une réservation test',
    detail: "Réserve un créneau avec ton adresse e-mail, vérifie la notification et l'e-mail reçus, puis annule-le dans l'onglet Rendez-vous.",
    link: 'https://babtech.fr/rendez-vous/',
    linkLabel: 'Réserver',
  },
  {
    id: 'assistant',
    phase: 'launch',
    owner: 'claude',
    done: true,
    title: 'Ajouter un assistant IA au formulaire de contact',
    detail:
      "Prêt mais en sommeil pour maîtriser le budget : il s'activera le jour où tu ajouteras une clé d'API (Réglages). D'ici là, la page Contact affiche le formulaire classique.",
  },
  {
    id: 'inbox',
    phase: 'launch',
    owner: 'claude',
    done: true,
    title: 'Recevoir les demandes dans le tableau de bord et par e-mail',
    detail:
      'Onglet Demandes (statut, note, réponse) ; e-mails depuis contact@babtech.fr : alerte pour toi, accusé de réception, confirmation et annulation de rendez-vous.',
    link: '/admin/demandes/',
    linkLabel: 'Demandes',
  },
  {
    id: 'install-app',
    phase: 'launch',
    owner: 'toi',
    title: 'Installer le tableau de bord sur ton ordinateur',
    detail: "Après le déploiement : bouton « Installer l'app » en haut, ou Réglages → Application. Tu peux faire pareil sur ton téléphone.",
    link: '/admin/reglages/',
    linkLabel: 'Réglages',
  },
  {
    id: 'zones-herault-gard',
    phase: 'local',
    owner: 'claude',
    done: true,
    title: "Pages villes : 17 dans l'Hérault, 8 dans le Gard",
    detail:
      'Un contenu propre à chaque ville (faits vérifiés, aucun chiffre inventé), le service le plus utile sur place mis en avant, des liens entre villes voisines et des données lisibles par Google et les IA.',
    link: '/zones-intervention/',
    linkLabel: 'Voir les villes',
  },
  {
    id: 'gsc',
    phase: 'local',
    owner: 'toi',
    title: 'Ajouter babtech.fr dans Google Search Console',
    detail: 'Vérification par DNS dans hPanel, puis envoi du sitemap.',
    link: 'https://search.google.com/search-console',
    linkLabel: 'Search Console',
  },
  {
    id: 'bing',
    phase: 'local',
    owner: 'toi',
    title: 'Importer le site dans Bing Webmaster Tools',
    detail: 'Bing alimente aussi Copilot et une partie de ChatGPT.',
    link: 'https://www.bing.com/webmasters',
    linkLabel: 'Bing',
  },
  {
    id: 'indexnow',
    phase: 'local',
    owner: 'claude',
    done: true,
    title: 'Signaler toutes les pages à Bing (IndexNow)',
    detail: "C'est fait le 28 septembre 2026 : les 62 pages du plan du site (villes, forum compris). Après un nouvel article, Claude signale sa page.",
  },
  {
    id: 'gbp',
    phase: 'local',
    owner: 'toi',
    title: 'Créer la fiche Google Business Profile',
    detail:
      "Zone de service : l'Hérault, le Gard et les villes principales (Montpellier, Nîmes, Béziers, Sète, Alès, Uzès…). Le premier levier pour être trouvé en local.",
    link: 'https://business.google.com',
    linkLabel: 'Business Profile',
  },
  {
    id: 'reviews',
    phase: 'local',
    owner: 'toi',
    title: 'Demander un avis Google à chaque client',
    detail: 'Juste après chaque projet livré.',
  },
  {
    id: 'analytics',
    phase: 'local',
    owner: 'toi',
    title: "Choisir la mesure d'audience sans cookie",
    detail: 'Plausible (payant) ou Umami (gratuit). Claude la branche ensuite sur le site.',
  },
  {
    id: 'legal-info',
    phase: 'legal',
    owner: 'toi',
    done: true,
    title: 'Envoyer SIRET et adresse',
    detail: "C'est fait : SIRET 801 478 306 00054 et adresse du siège, vérifiés dans l'annuaire des entreprises.",
  },
  {
    id: 'photo',
    phase: 'legal',
    owner: 'toi',
    done: true,
    title: 'Envoyer une photo pour la page À propos',
    detail: "C'est fait : ta photo est sur l'accueil, la page À propos, la présentation et la carte. Envoie-en d'autres quand tu veux.",
  },
  {
    id: 'profiles',
    phase: 'legal',
    owner: 'toi',
    title: 'Envoyer tes liens LinkedIn et Malt',
    detail: 'Ils relient ton entreprise au site pour Google et les assistants IA.',
  },
  {
    id: 'legal-update',
    phase: 'legal',
    owner: 'claude',
    done: true,
    title: 'Mettre à jour mentions légales et coordonnées',
    detail: 'SIRET et adresse dans les mentions légales, la confidentialité, la carte de visite et les données lues par Google et les IA.',
    link: '/mentions-legales/',
    linkLabel: 'Mentions légales',
  },
  {
    id: 'community-forum',
    phase: 'community',
    owner: 'claude',
    done: true,
    title: 'Créer les comptes des membres et le forum',
    detail: "Inscription confirmée par e-mail, forum lisible par tous, 6 thèmes, signalements ; modération dans l'onglet Communauté.",
    link: 'https://babtech.fr/communaute/forum/',
    linkLabel: 'Le forum',
  },
  {
    id: 'community-db',
    phase: 'community',
    owner: 'toi',
    title: 'Brancher la base de données du forum',
    detail:
      "Dans l'application Node.js de hPanel, ajoute les variables DB_HOST (localhost), DB_PORT (3306), DB_NAME, DB_USER et DB_PASSWORD de ta base (hPanel → Bases de données), redéploie, puis Réglages → Communauté → « Tester la connexion ». Les inscriptions ont aussi besoin des e-mails du site (SMTP_PASSWORD).",
    link: '/admin/reglages/',
    linkLabel: 'Réglages',
  },
  {
    id: 'community-first-topics',
    phase: 'community',
    owner: 'toi',
    title: 'Créer ton compte et ouvrir les premiers sujets',
    detail: 'Deux ou trois questions que tes clients te posent souvent : un nouveau venu trouve déjà des échanges.',
    link: 'https://babtech.fr/communaute/inscription/',
    linkLabel: 'Créer mon compte',
  },
  {
    id: 'community-promo',
    phase: 'community',
    owner: 'toi',
    title: 'Faire connaître la communauté et son forum',
    detail: "LinkedIn, clients, réseaux d'entrepreneurs, fiche Google.",
    link: 'https://babtech.fr/communaute/',
    linkLabel: 'Communauté',
  },
  {
    id: 'workshop',
    phase: 'community',
    owner: 'toi',
    title: 'Organiser un premier atelier',
    detail: 'Sur le thème le plus demandé par les membres.',
  },
  {
    id: 'community-groups',
    phase: 'community',
    owner: 'claude',
    title: 'Projets et groupes (étape 4)',
    detail: "Groupes par thème ou par projet, événements, mises en relation entre membres : Claude s'y met quand tu donnes ton accord.",
  },
]

export const adminDecisions = [
  { date: '2026-09-27', text: 'Hébergement : Hostinger, application Node.js (Node 22). Claude prépare les modifications, tu déploies à la main depuis hPanel.' },
  { date: '2026-09-27', text: 'Tableau de bord sur babtech.fr/admin, protégé par identifiant et mot de passe.' },
  { date: '2026-09-27', text: "Priorité : décrocher des contrats en local, à Montpellier et dans l'Hérault. La France entière viendra plus tard." },
  { date: '2026-09-27', text: 'Infos légales (SIRET, adresse, téléphone) : fournies après la mise en ligne.' },
  { date: '2026-09-27', text: 'Communauté : après la mise en ligne et le référencement local.' },
  {
    date: '2026-09-27',
    text: 'Nouvelle offre : site de réservation pour 1 à 4 logements ou chambres. Dès 250 €, tableau de bord en option (+ 350 €), maintenance dès 35 € par mois, personnalisation sur devis.',
  },
  { date: '2026-09-27', text: 'Adresse e-mail affichée sur le site : contact@babtech.fr.' },
  {
    date: '2026-09-27',
    text: 'Page de présentation (/bastien/) et carte de visite (/carte/) : partagées par lien ou QR code, volontairement hors de Google.',
  },
  {
    date: '2026-09-27',
    text: 'QR codes : adresses courtes babtech.fr/q/…, qui comptent les scans par mois sans aucune donnée personnelle.',
  },
  {
    date: '2026-09-27',
    text: "Tableau de bord installable comme une application (ordinateur et téléphone). Rien n'est gardé sur l'appareil : les chiffres viennent toujours du serveur.",
  },
  {
    date: '2026-09-27',
    text: 'Site de réservation : le tableau de bord est une option (+ 350 €). Calendriers synchronisés avec Airbnb et Booking.com par iCal (mise à jour toutes les 2 à 3 heures, pas en temps réel).',
  },
  { date: '2026-09-27', text: 'Téléphone affiché sur le site, la carte de visite et les données pour Google : 07 63 51 93 63.' },
  {
    date: '2026-09-27',
    text: "Rendez-vous : ta propre page babtech.fr/rendez-vous/ remplace Calendly. Tu règles tes disponibilités dans le tableau de bord ; chaque réservation t'envoie une notification et un e-mail.",
  },
  {
    date: '2026-09-27',
    text: "Page Contact : assistant IA (Claude, d'Anthropic), actif avec ta clé d'API. Au plus 60 analyses par jour ; les prix affichés viennent du site, jamais de l'IA.",
  },
  { date: '2026-09-27', text: "Assistant IA mis en sommeil pour maîtriser le budget : on l'activera quand les premiers clients seront là." },
  {
    date: '2026-09-27',
    text: "Demandes du site : dans l'onglet Demandes du tableau de bord et sur contact@babtech.fr. Les e-mails aux clients partent de contact@babtech.fr ; Formspree n'est plus utilisé.",
  },
  {
    date: '2026-09-27',
    text: "Espace communauté : ouvert à tous (compte validé par e-mail), forum lisible par tous, projets et groupes dès le lancement. Tu le gères en super admin depuis le tableau de bord ; données dans une base MySQL d'Hostinger.",
  },
  {
    date: '2026-09-27',
    text: 'Ordre des étapes : 1. e-mails et demandes, 2. référencement ville par ville et pour les IA, 3. comptes et forum, 4. projets et groupes.',
  },
  {
    date: '2026-09-27',
    text: "Référencement local étendu au Gard : 25 pages villes (17 dans l'Hérault, 8 dans le Gard), chacune avec son contenu. Dans les villes touristiques, le site de réservation passe en premier.",
  },
  {
    date: '2026-09-28',
    text: 'Adresse publiée : siège au 27 avenue du Professeur Grasset, 34090 Montpellier (SIRET 801 478 306 00054, entrepreneur individuel).',
  },
  {
    date: '2026-09-28',
    text: "Échecs de construction chez Hostinger (manque de mémoire) : le site se construit avec webpack, moins gourmand. Ne jamais accepter la « correction » automatique de Hostinger, qui ramène une ancienne version de Next.js.",
  },
  {
    date: '2026-09-28',
    text: "Forum : publication directe, sans validation préalable. Tu es prévenu de chaque nouveau sujet et de chaque signalement, et tu modères après coup depuis l'onglet Communauté.",
  },
  {
    date: '2026-09-28',
    text: "Sur le forum, un membre apparaît sous son prénom et l'initiale de son nom (« Marie D. · Fleuriste à Nîmes ») ; son e-mail n'est jamais affiché.",
  },
  {
    date: '2026-09-28',
    text: 'Bas de page plus court sur téléphone : villes et liens utiles côte à côte (1,1 écran au lieu de 1,6). Ordinateur et tablette inchangés.',
  },
]

/** Dernière mesure Lighthouse (mobile), mise à jour par Claude. */
export const adminHealth = {
  checkedAt: '2026-09-27',
  context: 'Lighthouse mobile, mesuré avant la mise en ligne.',
  scores: [
    { label: 'Vitesse', value: 96 },
    { label: 'Accessibilité', value: 100 },
    { label: 'Bonnes pratiques', value: 100 },
    { label: 'SEO', value: 100 },
  ],
  facts: [
    { label: 'Pages', value: '62' },
    { label: 'Articles de blog', value: '7' },
    { label: 'Villes couvertes', value: '25' },
    { label: 'Affichage principal', value: '2,4 s' },
  ],
}

export const METRICS = [
  { key: 'leads', label: 'Demandes de devis', source: 'Onglet Demandes', primary: true },
  { key: 'contracts', label: 'Contrats signés', source: 'Ton suivi', primary: true },
  { key: 'gscClicks', label: 'Clics depuis Google', source: 'Search Console', primary: false },
  { key: 'gscImpressions', label: 'Affichages dans Google', source: 'Search Console', primary: false },
  { key: 'gbpActions', label: 'Actions sur la fiche Google', source: 'Appels, itinéraires, visites', primary: false },
  { key: 'reviews', label: 'Avis Google', source: 'Total sur la fiche', primary: false },
  { key: 'calls', label: 'Appels et rendez-vous', source: 'Téléphone et page Rendez-vous', primary: false },
  { key: 'visits', label: 'Visites du site', source: 'Plausible ou Umami', primary: false },
] as const

export type MetricKey = (typeof METRICS)[number]['key']

export const adminLinks = [
  {
    group: 'Site et code',
    items: [
      { label: 'babtech.fr', hint: 'le site', href: 'https://babtech.fr' },
      { label: 'Contrôle qualité', hint: 'GitHub Actions', href: 'https://github.com/BabTech30/Babtech/actions' },
      { label: 'Code du site', hint: 'GitHub', href: 'https://github.com/BabTech30/Babtech' },
    ],
  },
  {
    group: 'Hébergement',
    items: [{ label: 'hPanel', hint: 'déployer, emails, DNS', href: 'https://hpanel.hostinger.com' }],
  },
  {
    group: 'Visibilité',
    items: [
      { label: 'Google Search Console', hint: 'recherches, clics', href: 'https://search.google.com/search-console' },
      { label: 'Google Business Profile', hint: 'fiche, avis', href: 'https://business.google.com' },
      { label: 'Bing Webmaster Tools', hint: 'Bing, Copilot', href: 'https://www.bing.com/webmasters' },
      { label: 'PageSpeed Insights', hint: 'vitesse', href: 'https://pagespeed.web.dev/report?url=https%3A%2F%2Fbabtech.fr%2F' },
    ],
  },
  {
    group: 'Clients',
    items: [
      { label: 'Boîte mail', hint: 'contact@babtech.fr', href: 'https://mail.hostinger.com' },
      { label: 'Claude Platform', hint: 'assistant IA : clé, dépenses', href: 'https://platform.claude.com' },
      { label: 'Page de rendez-vous', hint: 'ce que voient tes clients', href: 'https://babtech.fr/rendez-vous/' },
    ],
  },
]
