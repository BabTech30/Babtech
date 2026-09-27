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

export const adminUpdatedAt = '2026-09-27'

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
    id: 'site-tour',
    phase: 'launch',
    owner: 'toi',
    title: 'Parcourir le site sur mobile et sur ordinateur',
    detail: 'Note ce qui te gêne (textes, photos, couleurs) : Claude corrige.',
    link: 'https://babtech.fr',
    linkLabel: 'babtech.fr',
  },
  {
    id: 'forms-test',
    phase: 'launch',
    owner: 'toi',
    title: 'Envoyer un message test avec les deux formulaires',
    detail: "Contact et communauté : vérifie qu'ils arrivent dans Formspree.",
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
    title: 'Signaler toutes les pages à Bing (IndexNow)',
    detail: 'Dès que le site est en ligne.',
  },
  {
    id: 'gbp',
    phase: 'local',
    owner: 'toi',
    title: 'Créer la fiche Google Business Profile',
    detail: "Zone de service : Montpellier et l'Hérault. Le premier levier pour être trouvé en local.",
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
    title: 'Envoyer SIRET, adresse et téléphone',
    detail: "Obligatoires dans les mentions légales. Une domiciliation convient pour l'adresse.",
  },
  {
    id: 'email-pro',
    phase: 'legal',
    owner: 'toi',
    title: "Créer l'adresse contact@babtech.fr",
    detail: 'hPanel → Emails. Claude la reporte ensuite sur le site.',
    link: 'https://hpanel.hostinger.com',
    linkLabel: 'hPanel',
  },
  {
    id: 'photo',
    phase: 'legal',
    owner: 'toi',
    title: 'Envoyer une photo pour la page À propos',
    detail: 'Un visage rassure les clients.',
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
    title: 'Mettre à jour mentions légales et coordonnées',
    detail: 'Dès réception de tes informations.',
  },
  {
    id: 'community-promo',
    phase: 'community',
    owner: 'toi',
    title: 'Faire connaître la page Communauté',
    detail: "LinkedIn, clients, réseaux d'entrepreneurs.",
    link: 'https://babtech.fr/communaute/',
    linkLabel: 'Communauté',
  },
  {
    id: 'workshop',
    phase: 'community',
    owner: 'toi',
    title: 'Organiser un premier atelier',
    detail: 'Sur le thème le plus demandé par les inscrits.',
  },
]

export const adminDecisions = [
  { date: '2026-09-27', text: 'Hébergement : Hostinger, application Node.js (Node 22). Claude prépare les modifications, tu déploies à la main depuis hPanel.' },
  { date: '2026-09-27', text: 'Tableau de bord sur babtech.fr/admin, protégé par identifiant et mot de passe.' },
  { date: '2026-09-27', text: "Priorité : décrocher des contrats en local, à Montpellier et dans l'Hérault. La France entière viendra plus tard." },
  { date: '2026-09-27', text: 'Infos légales (SIRET, adresse, téléphone) : fournies après la mise en ligne.' },
  { date: '2026-09-27', text: 'Communauté : après la mise en ligne et le référencement local.' },
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
    { label: 'Pages', value: '35' },
    { label: 'Articles de blog', value: '7' },
    { label: 'Zones couvertes', value: '9' },
    { label: 'Affichage principal', value: '2,4 s' },
  ],
}

export const METRICS = [
  { key: 'leads', label: 'Demandes de devis', source: 'Formulaires et emails', primary: true },
  { key: 'contracts', label: 'Contrats signés', source: 'Ton suivi', primary: true },
  { key: 'gscClicks', label: 'Clics depuis Google', source: 'Search Console', primary: false },
  { key: 'gscImpressions', label: 'Affichages dans Google', source: 'Search Console', primary: false },
  { key: 'gbpActions', label: 'Actions sur la fiche Google', source: 'Appels, itinéraires, visites', primary: false },
  { key: 'reviews', label: 'Avis Google', source: 'Total sur la fiche', primary: false },
  { key: 'calls', label: 'Appels et rendez-vous', source: 'Téléphone et Calendly', primary: false },
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
      { label: 'Formspree', hint: 'demandes reçues', href: 'https://formspree.io/forms' },
      { label: 'Calendly', hint: 'rendez-vous', href: 'https://calendly.com/app/scheduled_events/user/me' },
    ],
  },
]
