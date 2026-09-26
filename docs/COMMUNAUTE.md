# La communauté BabTech — feuille de route

Des **groupes de travail et d'apprentissage autour du digital et de l'IA**, où les entrepreneurs de Montpellier et de
l'Hérault se rencontrent, apprennent ensemble et se mettent en relation.

C'est aussi un levier stratégique pour BabTech : notoriété locale, liens et mentions (SEO), contenus réels et expérience
démontrée (E-E-A-T, GEO), et une source naturelle de clients.

## Ce qui existe déjà dans le site

- Page [`/communaute`](../src/app/communaute/page.tsx) : concept, formats, thèmes, feuille de route, FAQ.
- **Liste des membres fondateurs** : formulaire (prénom, email, activité, ville, thèmes, format, niveau, consentement RGPD)
  envoyé à Formspree. Pour séparer ces inscriptions des demandes de devis, créer un 2ᵉ formulaire Formspree et renseigner
  `NEXT_PUBLIC_FORMSPREE_COMMUNITY_ID`.
- **Le blog comme porte d'entrée** : ses 4 catégories (IA & automatisation, Visibilité & référencement, Outils métier,
  Entreprendre) correspondent aux thèmes des futurs groupes, et chaque article invite à rejoindre la communauté.
- Contenus centralisés dans [`src/data/community.ts`](../src/data/community.ts).

## Les étapes

### Étape 1 — Membres fondateurs (maintenant)
- Faire connaître la page : LinkedIn, clients, réseaux d'entrepreneurs, fiche Google Business Profile.
- Exporter régulièrement les inscriptions (Formspree → CSV) et envoyer un email de bienvenue.
- Repérer les 2 ou 3 thèmes et le format les plus demandés.

### Étape 2 — Premiers ateliers et rencontres (sans développement)
- Un atelier pratique par mois (présentiel à Montpellier + visio), sur le thème le plus demandé.
- Billetterie et inscriptions avec un outil existant (Luma, Meetup, Eventbrite…) ; échanges entre membres sur un espace
  de discussion simple (groupe WhatsApp, Discord ou Circle).
- **Sur le site** : ajouter une section « Événements » (fichiers Markdown, comme le blog) avec des données structurées
  `Event` : chaque événement local devient une page indexable, excellente pour le référencement à Montpellier.
- Publier un compte rendu de chaque atelier sur le blog (preuve d'expérience, contenu unique).

### Étape 3 — Cercles de travail réguliers
- Groupes de 6 à 10 personnes par thème et par niveau, rythme mensuel, objectifs concrets.
- Définir le modèle économique (gratuit, adhésion, ateliers payants, lien avec l'offre de formation).
- Rédiger une charte (bienveillance, confidentialité, pas de démarchage agressif).

### Étape 4 — Plateforme membres
À lancer quand la communauté est active (quelques dizaines de membres réguliers) : on construit alors l'outil à partir
d'usages réels, pas d'hypothèses.

## Architecture technique proposée pour l'étape 4

### Principe
Garder le site vitrine **statique** (rapide, sûr, excellent pour le SEO) et créer la plateforme dans une **application
séparée**, par exemple `app.babtech.fr`, qui pourra aussi accueillir l'espace client (le bouton « Espace client » du site
s'affiche dès que `NEXT_PUBLIC_CLIENT_SPACE_URL` est renseignée).

| Brique | Choix proposé | Pourquoi |
|---|---|---|
| Application | Next.js (même stack que le site) en rendu serveur | Réutilise le design, les composants et les compétences |
| Base de données + authentification | Supabase (PostgreSQL, connexion par lien magique, règles d'accès RLS, stockage) | Offre gratuite pour démarrer, hébergement en Europe possible, standard ouvert |
| Emails | Brevo ou Resend | Notifications, rappels d'événements, lettre d'information |
| Hébergement | Offre Node.js ou VPS d'Hostinger | Contrairement au site vitrine statique, l'application a besoin d'un serveur Node.js |

### Modèle de données (première version)

| Table | Contenu |
|---|---|
| `profiles` | nom, activité, ville, bio, compétences, centres d'intérêt, niveau, visibilité du profil |
| `groups` | nom, thème, niveau, format (présentiel / visio), ville, description, capacité, statut |
| `group_members` | groupe, membre, rôle (animateur, membre) |
| `events` | titre, date, lieu ou lien visio, capacité, groupe éventuel |
| `event_registrations` | événement, membre, statut (inscrit, présent, liste d'attente) |
| `posts` / `comments` | discussions de groupe |
| `connections` | demandes de mise en relation (demandeur, destinataire, message, statut) |

### Fonctionnalités du MVP
1. Connexion par email (lien magique), création du profil.
2. Annuaire des membres (uniquement ceux qui l'acceptent) avec filtres : métier, ville, compétences.
3. Groupes : rejoindre, discuter, retrouver les ressources.
4. Événements : s'inscrire, recevoir un rappel, exporter dans son agenda.
5. Mise en relation : envoyer une demande de contact motivée, acceptée ou non par le destinataire.
6. Administration : modération, création d'événements, export des données.

### RGPD et confiance
- Profil privé par défaut, visibilité choisie par le membre ; pages de profil non indexées par les moteurs.
- Export et suppression du compte en libre-service ; consentements tracés.
- Conditions d'utilisation et charte de la communauté ; politique de confidentialité mise à jour.

### SEO de la plateforme
- Pages publiques : événements (données structurées `Event`), présentation des groupes, comptes rendus.
- Pages privées (profils, discussions) : `noindex`, derrière connexion.
- Le site vitrine reste la vitrine : il liste les prochains événements et renvoie vers la plateforme.
