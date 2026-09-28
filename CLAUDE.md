# Consignes pour travailler sur le site BabTech

Site vitrine + blog de BabTech (studio digital près de Montpellier). Next.js 16 (App Router, toutes les pages prérendues),
React 19, Tailwind CSS 3, TypeScript. Voir `README.md` pour les commandes et `docs/` pour la stratégie.

## Avant de pousser
- `npm run verify` doit passer (TypeScript, ESLint, build, puis `scripts/check-build.mjs` qui démarre le site construit
  et contrôle chaque page ainsi que la protection de `/admin`). Le workflow GitHub « Contrôle qualité » lance la même
  chose à chaque envoi.
- Mise en ligne : Hostinger (application Node.js, Node 22) construit la branche `main` (`npm run build`, puis serveur
  Next.js « standalone » imposé par Hostinger). Les modifications validées vont dans `main` ; l'utilisateur déploie
  ensuite lui-même, à la main, depuis hPanel. Ne jamais accepter la « correction » automatique de Hostinger.
- Construction avec webpack (`next build --webpack`), pas Turbopack : Turbopack demande environ 1,5 Go de mémoire et
  échoue chez Hostinger ; webpack passe avec environ 1,2 Go. Surveiller ce qui alourdit la construction (images générées).
- Manifestes déclarés par `metadata.manifest` : site `/manifest.webmanifest` (route `src/app/manifest.webmanifest`),
  tableau de bord `/admin/manifest.webmanifest`. Pas de fichier `app/manifest.ts` : avec webpack, il serait relié à /admin.
- Domaine défini par `DEFAULT_SITE_URL` dans `src/lib/site.ts`. `trailingSlash: true` : toutes les URL de pages finissent
  par « / » — construire les URL avec `absoluteUrl()` / `withTrailingSlash()` (`src/lib/site.ts`). En-têtes de sécurité,
  redirection www → domaine principal et favicon : `next.config.js`.
- Ne pas créer de route sous `/icons/` : ce chemin est réservé par beaucoup de serveurs Apache/LiteSpeed (d'où `/brand/`).
- Pages publiques : toutes prérendues, sans API routes, middleware ni ISR. Les routes générées (sitemap, robots, llms.txt,
  RSS, images OG, fiche .vcf) utilisent `dynamic = 'force-static'`, les routes dynamiques `dynamicParams = false`.
  Exceptions publiques : `/q/<code>/` (`src/app/q`), l'adresse courte des QR codes, qui compte le scan puis redirige
  (codes dans `src/data/qr.ts`, jamais d'adresse déjà imprimée à supprimer ; exclue de robots.txt) ; la prise de rendez-vous
  de `/rendez-vous/` (page prérendue, créneaux lus et réservés par les Server Actions de `src/app/rendez-vous/actions.ts`) ;
  les formulaires de contact et de la communauté (Server Actions `src/app/contact/request-actions.ts` et
  `src/app/communaute/actions.ts`) ; l'assistant IA de `/contact/`, en sommeil (Server Actions de `src/app/contact/actions.ts`,
  API Claude avec la variable `ANTHROPIC_API_KEY`, jamais dans le code ; sans clé, formulaire classique) ; le forum et les comptes
  des membres (voir « Communauté » ci-dessous). Consignes et catalogue de l'assistant :
  `src/lib/assistant/prompt.ts`, construits depuis `src/data/services.ts` et `src/data/portfolio.ts` (rien d'inventé).

## Espace /admin (tableau de bord privé)
- Partie dynamique du site : connexion, réglages, chiffres du mois, QR codes à partager, rendez-vous, modération de la
  communauté (`src/app/admin`, `src/lib/admin`, `src/lib/booking`). Jamais indexée (noindex, robots.txt), jamais liée
  depuis le site public, absente du sitemap.
- Demandes : tout message du site est rangé dans `/admin/demandes/` (`src/lib/requests.ts`, types dans `src/data/requests.ts`)
  et envoyé sur contact@babtech.fr. E-mails envoyés depuis contact@babtech.fr par le SMTP d'Hostinger (`src/lib/mail.ts`,
  modèles `src/lib/emails.ts`, variable `SMTP_PASSWORD`) ; sans mot de passe, rien ne part mais rien ne se perd.
  Pas de Formspree.
- Rendez-vous : réglages de départ dans `src/data/booking.ts`, puis modifiés dans `/admin/rendez-vous/` (enregistrés sur le
  serveur). Heures de Paris (`src/lib/booking/time.ts`). Notifications Web Push (`src/lib/admin/push.ts`, clés créées sur le
  serveur, jamais dans le code) affichées par le service worker. Agenda privé `/admin/agenda/<jeton>.ics` : 404 sans le bon jeton.
- Identifiant et mot de passe de départ : variables `ADMIN_USERNAME` / `ADMIN_PASSWORD` dans hPanel. Ne jamais écrire
  d'identifiant, de mot de passe ou de secret dans le code : le dépôt GitHub est public.
- Installable comme application : manifeste `/admin/manifest.webmanifest` et service worker `/admin/sw.js` (portée
  `/admin/` seulement). Le service worker ne met rien en cache (pages privées toujours servies par le serveur) ; il
  affiche seulement une page « Pas de connexion » et les notifications. Le site public n'a pas de service worker.
- Les coches, les chiffres, les scans, les rendez-vous, les demandes et le mot de passe changé (haché) de l'utilisateur sont dans un fichier JSON sur le serveur,
  jamais dans le dépôt. Ce que Claude tient à jour est dans `src/data/admin.ts` : cocher ses propres tâches, ajouter
  les décisions prises, mettre à jour la santé du site et `adminUpdatedAt` à chaque étape.

## Communauté (comptes des membres et forum)
- Pages rendues à la demande (`force-dynamic`) : `/communaute/forum/…` (lecture libre, écriture réservée aux membres) et
  les pages de compte (inscription, confirmer, connexion, mot de passe, compte). Server Actions `src/app/communaute/compte-actions.ts`
  et `src/app/communaute/forum/actions.ts`, logique dans `src/lib/community/`, thèmes et limites dans `src/data/forum.ts`.
- Base MySQL d'Hostinger (`src/lib/db.ts`, variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` dans hPanel,
  jamais dans le code). Tables `bt_…` créées par `CREATE TABLE IF NOT EXISTS`, sans migration automatique : toute
  évolution du schéma doit marcher sur une base déjà remplie, sans perte de données.
- Sans base (ou base injoignable), le site marche quand même : forum « Le forum ouvre très bientôt » ; sans base ou sans
  `SMTP_PASSWORD`, l'inscription redevient la liste d'attente (onglet Demandes).
- Publication directe, modération après coup dans `/admin/communaute/` (notification + e-mail pour chaque sujet et
  signalement). Nom affiché « Prénom + initiale » (`publicName()`), e-mail jamais affiché. Messages rendus en texte brut
  (`PostBody`), liens en `rel="ugc nofollow"`, 2 liens au plus pendant les 7 premiers jours d'un compte.
- Mots de passe hachés (`src/lib/password.ts`), liens et sessions stockés sous forme d'empreinte, réponses identiques que
  l'adresse existe ou non. Après une écriture qui reste sur la même page : `refresh()` avant `redirect()`, sinon l'ancienne
  version peut rester affichée.
- Pages de compte en `noindex` (liste `MEMBER_PAGES` de `check-build.mjs`) ; forum, thèmes et sujets indexables (JSON-LD
  `CollectionPage`, `DiscussionForumPosting`), accueil du forum, thèmes et charte dans le sitemap.

## Contenus
- Français, **tutoiement**, ton direct et concret, sans jargon (expliquer chaque terme technique en une phrase).
- **Ne jamais inventer** de statistiques, d'études, de clients, de témoignages ou de résultats. Les ordres de grandeur sont
  présentés comme indicatifs. Aucune promesse de classement garanti.
- Faits sur BabTech : uniquement ceux de `src/lib/site.ts`, `src/data/*` et de la page À propos. Tarifs : dès 800 €
  (site), 1 500 € (application métier), 3 000 € (automatisation & IA) ; site de réservation pour locations saisonnières
  (1 à 4 logements) dès 250 €, tableau de bord en option (+ 350 €), maintenance dès 35 €/mois ; synchronisation des
  calendriers Airbnb et Booking.com par iCal, jamais présentée comme instantanée ; SEO/GEO inclus dans les sites ;
  formation sur devis. Les documents internes fournis par l'utilisateur (devis, budgets) ne se publient pas.
- Photos : `public/photos/` (Bastien) et `public/realisations/` (captures faites avec des données de démonstration).
  Toujours retirer les métadonnées (EXIF, GPS) avant publication et recadrer les passants. Pas de détails de vie privée.
- Vidéo YouTube : uniquement avec `<YouTubeVideo>` (chargée au clic, miniature hébergée sur le site), déjà décrite dans
  la page Confidentialité.
- Typographie : guillemets « », montants « 1 500 € ». Les textes issus des données passent par `fr()`
  (`src/lib/typography.ts`) qui pose les espaces insécables ; dans le JSX écrit en dur, utiliser `&nbsp;` avant `: ; ! ?`.
- Articles : `content/blog/*.md` (format décrit dans le README). Réponse dès le premier paragraphe, intertitres en questions,
  `tldr` et `faq` renseignés, liens internes vers services / articles / contact / communauté.
- Pages villes : contenu local réellement différent pour chaque ville (pas de pages « copier-coller »), faits vérifiés.
  Nom de ville après « à » ou « de » dans le code : `inCity()` / `ofCity()` (`src/data/zones.ts`), pour « au Grau-du-Roi », « d'Agde ».

## SEO / GEO
- Toute nouvelle page : `pageMetadata()` (`src/lib/seo.ts`) avec un `path` canonique, une image OG déclarée dans
  `src/lib/og.ts`, un JSON-LD (`src/lib/schema.ts`) et, si besoin, un fil d'Ariane (`<Breadcrumbs>` ou `crumbs` de `PageHero`).
- Ajouter la page au sitemap (`src/app/sitemap.ts`) si elle n'est pas générée depuis les données.
- Exception : les pages partagées par lien ou QR code, `/bastien/` (présentation) et `/carte/` (carte de visite, fiche
  `/carte/bastien-ferrer.vcf`), sont en `noindex`, hors du sitemap et du menu (liste `NOINDEX_PAGES` de `check-build.mjs`).
- Un seul `<h1>` par page. Accessibilité : contrastes AA (utiliser `txt-secondary` / `txt-muted`, jamais plus sombre),
  libellés de formulaire associés, zones défilantes focusables.
