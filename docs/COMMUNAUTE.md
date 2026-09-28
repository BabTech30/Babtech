# La communauté BabTech — feuille de route

Des **groupes de travail et d'apprentissage autour du digital et de l'IA**, où les entrepreneurs de Montpellier et de
l'Hérault se rencontrent, apprennent ensemble et se mettent en relation.

C'est aussi un levier stratégique pour BabTech : notoriété locale, liens et mentions (SEO), contenus réels et expérience
démontrée (E-E-A-T, GEO), et une source naturelle de clients.

## Ce qui existe dans le site

- Page [`/communaute`](../src/app/communaute/page.tsx) : concept, formats, thèmes, feuille de route, FAQ, invitation à
  créer un compte.
- **Comptes des membres**, gratuits : inscription (prénom, nom, e-mail, mot de passe, activité et ville facultatives,
  acceptation de la charte), adresse confirmée par un lien envoyé depuis contact@babtech.fr (valable 48 h), mot de passe
  oublié (lien valable 1 h), page « Mon compte » (profil, notifications, mot de passe) et suppression du compte en
  libre-service : ses messages restent signés « Ancien membre », ou sont effacés si le membre le choisit.
- **Forum** [`/communaute/forum`](../src/app/communaute/forum/page.tsx) : lecture libre pour tout le monde, écriture
  réservée aux membres, 6 thèmes. Publication directe ; le nom affiché est « Prénom + initiale » avec l'activité et la
  ville (« Marie D. · Fleuriste à Nîmes »), jamais l'e-mail. Le membre est prévenu par e-mail quand quelqu'un répond à
  ses sujets (il peut le couper) et chacun peut signaler un message.
- **Projets** [`/communaute/projets`](../src/app/communaute/projets/page.tsx) : un membre présente son projet et ce qu'il
  cherche (des conseils, un ou une partenaire, une compétence précise) et où il en est (idée, lancement, déjà en activité).
  Les autres répondent sur sa page, qui est un sujet du forum, ou cliquent sur « Proposer mon aide » : un e-mail part à
  l'auteur avec l'adresse de la personne, pour qu'ils échangent directement. L'auteur indique « J'ai trouvé » quand c'est fait.
- **Groupes** [`/communaute/groupes`](../src/app/communaute/groupes/page.tsx) : un membre propose un groupe (thème, ville,
  niveau, nombre de places), publié une fois validé dans le tableau de bord ; il en devient l'animateur ou l'animatrice et
  peut le modifier. On rejoint un groupe en un clic, dans la limite des places. Ses échanges sont des sujets du forum,
  lisibles par tous, ouverts et commentés par ses membres, qui reçoivent un e-mail à chaque nouveau sujet (ils peuvent le couper).
- **Charte** [`/communaute/charte`](../src/app/communaute/charte/page.tsx) : bienveillance, pas de démarchage, modération,
  règles des projets et des groupes.
- **Modération** : tableau de bord → **Communauté** (chiffres, signalements, groupes à valider, derniers messages à masquer,
  réafficher ou supprimer, groupes à masquer ou supprimer, membres à rechercher, suspendre, rétablir ou supprimer).
  Notification et e-mail pour chaque nouveau sujet, projet, groupe proposé et signalement, notification pour chaque nouveau membre.
- **Sans base de données** (variables `DB_…` absentes ou base injoignable), le forum affiche « Le forum ouvre très
  bientôt » ; sans base ou sans e-mails (`SMTP_PASSWORD`), l'inscription redevient une liste d'attente, rangée dans
  l'onglet Demandes.
- **Le blog comme porte d'entrée** : ses 4 catégories (IA & automatisation, Visibilité & référencement, Outils métier,
  Entreprendre) correspondent aux thèmes du forum et des futurs groupes, et chaque article invite à rejoindre la communauté.
- Contenus : [`src/data/community.ts`](../src/data/community.ts) (page Communauté) et
  [`src/data/forum.ts`](../src/data/forum.ts) (thèmes, longueurs, limites).

## Architecture en place (comptes, forum, projets et groupes)

| Brique | Choix | Pourquoi |
|---|---|---|
| Application | Le site Next.js lui-même : pages du forum et des comptes rendues à la demande, le reste du site reste prérendu | Un seul déploiement, même design, rien à héberger en plus |
| Base de données | MySQL de l'hébergement Hostinger (hPanel → Bases de données), variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Incluse dans l'offre, sauvegardée par Hostinger |
| E-mails | Serveur d'envoi d'Hostinger, depuis contact@babtech.fr (`SMTP_PASSWORD`) | Déjà utilisé pour les demandes et les rendez-vous |
| Code | [`src/lib/db.ts`](../src/lib/db.ts), [`src/lib/community/`](../src/lib/community/), Server Actions [`compte-actions.ts`](../src/app/communaute/compte-actions.ts), [`forum/actions.ts`](../src/app/communaute/forum/actions.ts), [`projets/actions.ts`](../src/app/communaute/projets/actions.ts) et [`groupes/actions.ts`](../src/app/communaute/groupes/actions.ts), modération [`admin/community-actions.ts`](../src/app/admin/community-actions.ts) | |

### Tables (créées automatiquement au premier accès, préfixe `bt_`)

| Table | Contenu |
|---|---|
| `bt_members` | prénom, nom, e-mail, mot de passe haché, activité, ville, statut (en attente, actif, suspendu), notifications, dates |
| `bt_tokens` | liens de confirmation et de nouveau mot de passe, sessions : seule leur empreinte est enregistrée |
| `bt_topics`, `bt_replies` | sujets et réponses, en texte brut, visibles ou masqués |
| `bt_reports` | signalements : message visé, motif, auteur du signalement, date de traitement |
| `bt_projects` | pour un sujet qui est un projet : ce que le membre cherche, la compétence précise, l'étape, « trouvé » ou non |
| `bt_project_offers` | propositions d'aide : projet, membre et date seulement (le message part par e-mail, il n'est pas gardé) |
| `bt_groups` | groupes : nom, description, thème, ville, niveau, nombre de places, statut (à valider, publié, masqué), auteur |
| `bt_group_members` | membres de chaque groupe, rôle (animation ou membre), e-mails du groupe activés ou non |
| `bt_group_topics` | sujets du forum ouverts dans un groupe |

### Sécurité et anti-abus
- Mots de passe hachés (scrypt) ; liens de confirmation et de nouveau mot de passe à usage unique ; session de 30 jours
  dans un cookie inaccessible aux scripts de la page.
- Même réponse que l'adresse soit déjà inscrite ou non (impossible de deviner qui est membre) ; champ piège contre les
  robots ; limites par adresse IP et par membre (inscriptions, connexions, sujets, réponses, signalements).
- Limites par membre et par jour pour les projets, les propositions d'aide (une seule par projet), les propositions de
  groupe (3 en attente au plus) et les adhésions.
- Pendant ses 7 premiers jours, un membre met 2 liens au plus par message ; les liens des messages sont marqués
  `rel="ugc nofollow"` (Google sait qu'ils viennent des membres).
- Messages affichés en texte brut : aucun code HTML n'est interprété.
- Comptes jamais confirmés effacés au bout de 7 jours.

### Référencement
- Forum, thèmes, sujets, projets et groupes indexables, avec données structurées (`DiscussionForumPosting`,
  `CollectionPage`) et des adresses stables `/communaute/forum/sujet/<numéro>-<titre>/` et
  `/communaute/groupes/<numéro>-<nom>/` (l'ancienne adresse redirige si le titre ou le nom change). Les listes de projets
  filtrées restent hors de Google.
- Pages de compte (inscription, connexion, mon compte…) en `noindex`, hors du sitemap.

## Les étapes

### Étape 1 — Premiers membres, forum, projets et groupes (maintenant)
- Faire connaître la communauté : LinkedIn, clients, réseaux d'entrepreneurs, fiche Google Business Profile.
- Ouvrir soi-même les premiers sujets (les questions que posent les clients) et proposer un premier groupe, pour qu'un
  nouveau venu trouve déjà des échanges.
- Suivre les inscriptions, les projets et les groupes dans l'onglet Communauté, repérer les thèmes les plus actifs.

### Étape 2 — Premiers ateliers et rencontres (sans développement)
- Un atelier pratique par mois (présentiel à Montpellier + visio), sur le thème le plus demandé.
- Billetterie et inscriptions avec un outil existant (Luma, Meetup, Eventbrite…) ; annonces et échanges sur le forum.
- **Sur le site** : ajouter une section « Événements » (fichiers Markdown, comme le blog) avec des données structurées
  `Event` : chaque événement local devient une page indexable, excellente pour le référencement à Montpellier.
- Publier un compte rendu de chaque atelier sur le blog (preuve d'expérience, contenu unique).

### Étape 3 — Cercles de travail réguliers
- Groupes de 6 à 10 personnes par thème et par niveau, rythme mensuel, objectifs concrets.
- Définir le modèle économique (gratuit, adhésion, ateliers payants, lien avec l'offre de formation).

### Étape 4 — Événements (prochaine étape technique, plus tard)
Les projets et les groupes sont en place (voir plus haut). Prochaine brique, quand les ateliers auront commencé :

| Table | Contenu |
|---|---|
| `bt_events` | titre, date, lieu ou lien visio, capacité, groupe éventuel |
| `bt_event_registrations` | événement, membre, statut (inscrit, présent, liste d'attente) |

Pages d'événements avec données structurées `Event` (visibles sur Google, utiles au référencement local), inscription
en un clic, rappel par e-mail, fichier agenda. Pistes pour ensuite : annuaire des membres qui l'acceptent (non indexé).

### RGPD et confiance
- En place : charte, politique de confidentialité à jour, suppression du compte en libre-service (le membre quitte aussi
  ses groupes), e-mail jamais affiché, propositions d'aide transmises seulement à l'auteur du projet.
- À prévoir : export de ses données par le membre, profil public choisi par le membre, pages de profil non indexées.
