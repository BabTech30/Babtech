# BabTech — site vitrine, blog et communauté

Site de **BabTech**, studio digital basé près de Montpellier (Hérault) : sites internet, applications métier, automatisations IA,
référencement local + GEO, et accompagnement des TPE.

Le site est pensé pour être trouvé **sur Google** (SEO local) **et dans les réponses des assistants IA** (ChatGPT, Perplexity,
Gemini, Claude, Copilot…), grâce au GEO (*Generative Engine Optimization*).

- Stack : **Next.js 16** (App Router, pages prérendues servies par Node.js), **React 19**, **Tailwind CSS 3**, **TypeScript**
- Hébergement : **Hostinger**, application Node.js qui construit la branche `main` (déploiement depuis hPanel)
- Formulaires et rendez-vous : **intégrés** (demandes et rendez-vous dans `/admin`, e-mails envoyés depuis contact@babtech.fr) · Assistant IA **Claude** sur la page Contact, facultatif et en sommeil sans clé · Mesure d'audience optionnelle et sans cookie : **Plausible** ou **Umami**

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Construit le site, comme Hostinger |
| `npm start` | Lance le site construit, comme en production (après `npm run build`) |
| `npm run check` | Contrôle qualité : démarre le site construit et vérifie liens, balises SEO, JSON-LD, sitemap et protection de `/admin` |
| `npm run verify` | Tout d'un coup : TypeScript + ESLint + build + contrôle |
| `npm run indexnow` | Signale les pages à Bing & co. après une mise en ligne (voir `docs/DEPLOIEMENT.md`) |

## Où modifier quoi ?

| Je veux modifier… | Fichier |
|---|---|
| Domaine, nom, email, téléphone, adresse, réseaux sociaux, SIRET | `src/lib/site.ts` |
| Tes photos, ton ancienne entreprise et sa vidéo | `src/lib/site.ts` (`founder`) et `public/photos/` |
| Les services (textes, prix, FAQ) | `src/data/services.ts` |
| Les pages des villes (zones d'intervention) | `src/data/zones.ts` et `src/data/area.ts` |
| La FAQ générale | `src/data/faq.ts` |
| Les réalisations (textes, chiffres, captures, vidéo) | `src/data/portfolio.ts` et `public/realisations/` |
| La page de présentation et la carte de visite | `src/app/bastien/page.tsx`, `src/app/carte/page.tsx`, `src/lib/vcard.ts` |
| La communauté (formats, thèmes, étapes, FAQ) | `src/data/community.ts` |
| Les catégories du blog | `src/data/blog.ts` |
| Un article | `content/blog/<slug>.md` |
| Le tableau de bord `/admin` (étapes, tâches, décisions, santé du site) | `src/data/admin.ts` |
| Les rendez-vous : réglages de départ, sujets proposés | `src/data/booking.ts` (ensuite, tout se règle dans `/admin/rendez-vous/`) |

Tout le reste (sitemap, robots.txt, llms.txt, flux RSS, images de partage, données structurées Schema.org) est **généré
automatiquement** à partir de ces fichiers.

## Écrire un article de blog

Crée un fichier `content/blog/mon-article.md` (le nom du fichier devient l'URL `/blog/mon-article`) :

```markdown
---
title: "Titre affiché en H1 (≈ 60-80 caractères)"
seoTitle: "Titre pour Google, mot-clé en premier (≤ 58 caractères)"
description: "Résumé pour Google et les réseaux sociaux (140-160 caractères)."
date: "2026-10-15"
updated: "2026-10-20"          # facultatif
category: "ia-automatisation"  # ia-automatisation | visibilite-referencement | outils-metier | entreprendre
tags: ["ia", "tpe", "montpellier"]
tldr:                          # encadré « L'essentiel en 30 secondes », très utile pour les IA
  - "Une phrase factuelle qui se suffit à elle-même."
faq:                           # questions-réponses en fin d'article (+ données structurées)
  - q: "Une question que se posent tes clients ?"
    a: "Une réponse claire en 2 à 4 phrases."
draft: true                    # facultatif : l'article n'est pas publié tant que draft vaut true
---

Premier paragraphe : réponds directement à la question du titre.

## Un intertitre formulé comme une question ?

Texte, listes, [liens internes](/services/creation-site-internet), tableaux…
```

Bonnes pratiques (SEO + GEO) : répondre dès les premières lignes, intertitres en questions, au moins un tableau ou une liste,
des liens vers les services et les autres articles, des informations vérifiables (jamais de statistiques inventées),
et un appel à l'action vers `/contact` ou `/communaute`.

## Déployer

Hostinger (application Node.js) construit la branche **`main`**. Les modifications validées y sont versées, puis tu
cliques sur **Déployer** dans hPanel. Le **Contrôle qualité** GitHub doit être vert avant. Réglages et dépannage :
**[`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md)**.

## Présentation et carte de visite

Deux pages à partager par lien ou par QR code, volontairement absentes de Google : `https://babtech.fr/bastien/`
(qui tu es, ce que tu fais, ton parcours et un projet) et `https://babtech.fr/carte/` (ta carte de visite, avec le bouton
« Enregistrer le contact » qui ajoute ta fiche au téléphone, et son propre QR code).

Les QR codes à imprimer sont dans le tableau de bord, rubrique **Partager** : présentation, site et carte de visite. Chacun
mène à une adresse courte (`/q/presentation/`, `/q/site/`, `/q/carte/`) qui compte les scans du mois, sans aucune donnée
personnelle, puis redirige vers la page. Pour en ajouter un : `src/data/qr.ts`.

## Demandes et e-mails

Les messages du formulaire de contact et les inscriptions à la communauté arrivent dans l'onglet **Demandes** du tableau
de bord (statut, note privée, réponse par e-mail) et sur contact@babtech.fr, avec une notification sur tes appareils. La
personne reçoit un accusé de réception. Tous les e-mails partent de contact@babtech.fr, par le serveur d'envoi
d'Hostinger (`src/lib/mail.ts`, modèles dans `src/lib/emails.ts`) : il suffit de la variable `SMTP_PASSWORD` dans hPanel
(mot de passe de la boîte). **Réglages → E-mails** indique si l'envoi marche et permet d'envoyer un e-mail de test.

## Assistant IA de la page Contact

Sur `/contact/`, le visiteur décrit son projet en quelques phrases ; Claude (l'IA d'Anthropic) lui répond aussitôt :
ce qu'il a compris, les offres adaptées (avec leur prix, tiré de `src/data/services.ts`), trois idées, les réalisations
proches (`src/data/portfolio.ts`) et des questions pour préparer l'échange. Le visiteur envoie ensuite sa demande, avec
la synthèse, qui arrive dans l'onglet **Demandes**. Consignes et catalogue : `src/lib/assistant/prompt.ts` ; appel à l'API :
`src/app/contact/actions.ts` (modèle `claude-opus-5`, limites anti-abus, 60 analyses par jour au plus).

Il ne s'active qu'avec la variable `ANTHROPIC_API_KEY` dans hPanel ; sans elle, ou en cas de souci, la page affiche le
formulaire classique. **Réglages** indique s'il est actif et ce qu'il a coûté dans le mois.

## Prise de rendez-vous

`https://babtech.fr/rendez-vous/` : le visiteur choisit téléphone ou visio, un jour, une heure, puis laisse ses coordonnées.
Le créneau est réservé aussitôt ; tu reçois une notification sur tes appareils et un e-mail, et la personne reçoit sa
confirmation (avec le fichier agenda) depuis contact@babtech.fr, puis un e-mail si tu annules. Tout se gère dans le tableau de bord, onglet **Rendez-vous** : rendez-vous à venir (appeler, écrire, annuler),
disponibilités par jour, durée, délai minimum, jours fermés, pause, notifications et lien d'agenda privé à ajouter à ton
téléphone (Apple Calendrier, Google Agenda). Les rendez-vous sont enregistrés sur le serveur avec les autres données du
tableau de bord et effacés 12 mois après leur date.

## Tableau de bord privé

`https://babtech.fr/admin/` : avancement du projet, checklist, prochains rendez-vous, santé du site, chiffres du mois (demandes de devis,
contrats, Google…), scans des QR codes, zones visées et décisions. Connexion par identifiant et mot de passe (variables `ADMIN_USERNAME` et
`ADMIN_PASSWORD` dans hPanel), mot de passe modifiable dans **Réglages**.

Il s'installe comme une application, sur ordinateur comme sur téléphone : bouton **Installer l'app** en haut du tableau
de bord (Chrome, Edge, Android), ou **Réglages → Application** pour la marche à suivre sur iPhone, iPad et Mac.

## Documentation

- [`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md) — mise en ligne sur Hostinger (Node.js) et check-list après la mise en ligne
- [`docs/STRATEGIE-SEO-GEO.md`](docs/STRATEGIE-SEO-GEO.md) — positionnement, mots-clés, plan local, GEO, calendrier éditorial
- [`docs/COMMUNAUTE.md`](docs/COMMUNAUTE.md) — feuille de route et architecture de la future plateforme communautaire

## Structure

```
content/blog/          Articles en Markdown
public/                Fichiers servis tels quels (favicon, photos, captures et vidéo des réalisations, vérification Google, clé IndexNow)
scripts/               check-build.mjs (contrôle qualité), postbuild.mjs (serveur Node.js autonome), indexnow.mjs
.github/workflows/     ci.yml (contrôle qualité à chaque envoi sur GitHub)
src/app/               Pages (App Router) + routes générées : sitemap, robots, llms.txt, RSS, images OG, icônes ; admin/ (espace privé)
src/components/        Composants d'interface (Header, Footer, formulaires, FAQ, cartes…)
src/data/              Contenus structurés (services, villes, FAQ, communauté…)
src/assets/            Photo intégrée à la fiche contact (.vcf) de la carte de visite
src/fonts/             Polices auto-hébergées (Outfit, DM Sans — licence OFL)
src/lib/               Configuration du site, SEO, Schema.org, blog, llms.txt, typographie
```
