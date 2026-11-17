# Dupliquer cette structure pour un autre projet

Ce site est construit pour être **repris** : le contenu vit dans quelques fichiers de données, et tout le reste
(pages, sitemap, données pour Google et les IA, images de partage, contrôles) se génère à partir d'eux.
Ce guide explique comment il est organisé, ce qui se réutilise tel quel, et la marche à suivre pour en tirer un nouveau site.

## 1. L'idée en une image

```
        CE QUE TU ÉCRIS                         CE QUI SE GÉNÈRE TOUT SEUL
┌──────────────────────────────┐        ┌────────────────────────────────────────┐
│ src/lib/site.ts   identité   │        │ pages (accueil, services, villes, FAQ…) │
│ src/data/*.ts     contenus   │  ───▶  │ sitemap.xml, robots.txt, flux RSS        │
│ content/blog/*.md articles   │        │ llms.txt et llms-full.txt (pour les IA)  │
│ public/           photos     │        │ données structurées Schema.org           │
└──────────────────────────────┘        │ images de partage (une par page)         │
                                        │ contrôle qualité (npm run verify)        │
                                        └────────────────────────────────────────┘
```

Règle d'or : **une information n'est écrite qu'à un seul endroit.** Le téléphone est dans `src/lib/site.ts` ; le pied de
page, la carte de visite, la fiche contact et les données pour Google le lisent tous là. On ne recopie jamais.

## 2. Les trois couches

| Couche | Dossiers | Rôle | À changer pour un nouveau projet ? |
|---|---|---|---|
| **Contenu** | `src/lib/site.ts`, `src/data/`, `content/blog/`, `public/` | Qui tu es, ce que tu vends, où, à quel prix | **Oui, entièrement** |
| **Présentation** | `src/app/` (pages), `src/components/`, `tailwind.config.ts`, `src/app/globals.css`, `src/fonts/` | À quoi ça ressemble | Couleurs, polices, logo ; les pages se gardent ou s'adaptent |
| **Moteur** | `src/lib/` (SEO, Schema.org, llms.txt, images de partage, e-mails, base, sécurité), `scripts/`, `next.config.js` | Ce qui fait tourner le site | **Non** : se réutilise tel quel |

Le moteur ne contient presque rien de propre à BabTech. C'est lui qui a de la valeur d'un projet à l'autre.

## 3. Les modules : garder, adapter, retirer

Chaque module est indépendant. Pour un nouveau projet, on choisit ceux dont le client a besoin.

| Module | Fichiers | Besoin côté serveur | Générique ? |
|---|---|---|---|
| Site vitrine (accueil, services, FAQ, contact, mentions) | `src/app/`, `src/data/services.ts`, `src/data/faq.ts` | Aucun | Oui |
| Pages par ville (référencement local) | `src/data/zones.ts`, `src/data/area.ts`, `src/app/zones-intervention/` | Aucun | Oui, mais le contenu de chaque ville doit être réécrit (jamais de copier-coller) |
| Blog | `content/blog/`, `src/lib/blog.ts`, `src/data/blog.ts` | Aucun | Oui |
| SEO et GEO (sitemap, robots, llms.txt, Schema.org, images de partage) | `src/lib/seo.ts`, `schema.ts`, `llms.ts`, `og.ts`, `src/app/sitemap.ts`… | Aucun | Oui |
| Formulaire de contact et demandes | `src/app/contact/`, `src/lib/requests.ts`, `src/lib/mail.ts`, `src/lib/emails.ts` | Boîte e-mail (SMTP) | Oui (textes des e-mails à adapter) |
| Prise de rendez-vous | `src/app/rendez-vous/`, `src/lib/booking/`, `src/data/booking.ts` | Dossier de données | Oui |
| Tableau de bord privé `/admin` | `src/app/admin/`, `src/lib/admin/`, `src/data/admin.ts` | Dossier de données, identifiants dans l'hébergeur | Oui (la liste des tâches est propre au projet) |
| QR codes suivis | `src/data/qr.ts`, `src/app/q/`, `src/lib/qr.ts` | Dossier de données | Oui |
| Communauté (comptes, forum, projets, groupes) | `src/app/communaute/`, `src/lib/community/`, `src/data/forum.ts`, `src/lib/db.ts` | Base MySQL + e-mail | Oui (thèmes et textes à adapter) |
| Carte de visite et page de présentation | `src/app/carte/`, `src/app/bastien/`, `src/lib/vcard.ts` | Aucun | À adapter à la personne |
| Assistant IA du formulaire de contact | `src/app/contact/actions.ts`, `src/lib/assistant/` | Clé d'API (facultatif) | Oui |

Retirer un module : supprimer son dossier dans `src/app/`, ses liens dans le menu (`src/components/Header.tsx`,
`Footer.tsx`), ses lignes dans `src/app/sitemap.ts` et `scripts/check-build.mjs`. `npm run verify` signale ce qui reste cassé.

## 4. Marche à suivre pour un nouveau site

Compte une à deux journées de travail pour un site vitrine, hors rédaction des contenus.

### Étape 1 — Copier la base
1. Sur GitHub : créer un nouveau dépôt à partir de celui-ci (bouton « Use this template », une fois la case « Template
   repository » cochée dans les réglages du dépôt ; ou simple copie du dossier sans `.git`).
2. `npm install`, puis `npm run dev` : le site tourne, encore aux couleurs de BabTech.

### Étape 2 — L'identité (`src/lib/site.ts`)
Nom, domaine (`DEFAULT_SITE_URL`), e-mail, téléphone, adresse, SIRET, réseaux sociaux, fondateur. C'est le fichier le plus
important : tout le reste s'y réfère. Remplacer aussi les photos de `public/photos/` (mêmes noms de fichiers, métadonnées
retirées).

### Étape 3 — Les contenus (`src/data/`)
Dans cet ordre, parce que chaque fichier s'appuie sur le précédent :
1. `services.ts` : les offres, leurs prix, leurs questions fréquentes.
2. `faq.ts` : la FAQ générale.
3. `zones.ts` et `area.ts` : les villes couvertes, avec un contenu réellement différent pour chacune.
4. `portfolio.ts` : les réalisations (captures dans `public/realisations/`).
5. `blog.ts` et `content/blog/` : catégories et premiers articles.
6. `booking.ts`, `forum.ts`, `community.ts`, `qr.ts` : seulement si les modules sont gardés.

### Étape 4 — L'apparence
1. Couleurs : `tailwind.config.ts` (`nuit`, `emerald-b`, `bronze`). Vérifier les contrastes (niveau AA).
2. Polices : `src/fonts/` et `src/app/layout.tsx`.
3. Logo et icônes : `src/components/Logo.tsx`, `src/app/brand/`, `public/favicon.svg`.
4. Textes écrits en dur dans les pages : chercher l'ancien nom avec `grep -rn "BabTech\|Bastien" src/`. Il en reste dans une
   trentaine de fichiers (titres d'accueil, À propos, e-mails, mentions légales) : c'est la liste exacte de ce qu'il faut relire.

### Étape 5 — Les textes légaux
`src/app/mentions-legales/` et `src/app/confidentialite/` : à réécrire pour la nouvelle entreprise (éditeur, hébergeur,
données collectées). Ne jamais les reprendre tels quels.

### Étape 6 — Vérifier
`npm run verify` : TypeScript, ESLint, construction, puis contrôle de chaque page (liens, balises, données structurées,
sitemap, en-têtes de sécurité, protection de `/admin`). Tant qu'il ne passe pas, on ne met pas en ligne.

### Étape 7 — Mettre en ligne
Suivre `docs/DEPLOIEMENT.md` : application Node.js chez Hostinger, branche `main`, variables d'environnement, puis
Google Search Console, Bing Webmaster Tools et fiche Google Business Profile.

## 5. Les réglages qui vivent chez l'hébergeur (jamais dans le code)

Le dépôt peut être public : aucun mot de passe ni clé n'y figure. Ils se saisissent dans l'hébergeur, pour chaque projet.

| Variable | Sert à | Obligatoire ? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Adresse du site, si elle diffère de celle de `site.ts` | Non |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Connexion au tableau de bord | Oui, si `/admin` est gardé |
| `ADMIN_DATA_DIR`, `ADMIN_SESSION_SECRET` | Dossier des données du tableau de bord, clé des sessions | Non (valeurs par défaut) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Envoi des e-mails | Oui, pour les formulaires et les comptes |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Base MySQL de la communauté | Oui, si le forum est gardé |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Vérification Google et Bing | Non |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` ou `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Mesure d'audience sans cookie | Non |
| `ANTHROPIC_API_KEY` | Assistant IA du formulaire de contact | Non |

Sans base ni e-mail, le site fonctionne quand même : les modules concernés se mettent en attente au lieu de casser.

## 6. Les règles qui font tenir l'ensemble

À garder dans chaque projet issu de cette base :

1. **Une seule source par information** (voir §1).
2. **Rien d'inventé** : ni chiffre, ni client, ni témoignage. Les faits viennent des fichiers de données.
3. **Toute nouvelle page** a un titre, une description, une adresse canonique, une image de partage, des données
   structurées, et figure dans le sitemap (`pageMetadata()` dans `src/lib/seo.ts`).
4. **Aucun secret dans le code.**
5. **`npm run verify` avant chaque mise en ligne**, et la sécurité se traite comme indiqué dans `CLAUDE.md`
   (mises à jour avec les deux fichiers de dépendances, politique CSP dans `next.config.js`).
6. **Les consignes pour Claude sont dans `CLAUDE.md`** : les copier et les adapter au nouveau projet, c'est ce qui
   permet de reprendre le travail au même niveau d'un échange à l'autre.

## 7. Trois façons de dupliquer, selon l'ambition

| Formule | Principe | Pour qui | Limite |
|---|---|---|---|
| **Une copie par client** | Un dépôt et un hébergement par site, tirés de cette base | Les premiers clients | Une amélioration du moteur se reporte à la main sur chaque copie |
| **Base commune + contenus par client** | Le moteur dans un dépôt « modèle », chaque client n'apporte que `site.ts`, `data/`, `content/`, `public/` | À partir de 3 à 5 sites | Demande de sortir du moteur les derniers textes écrits en dur (§4, étape 4) |
| **Plateforme unique** | Un seul site qui sert plusieurs clients, avec abonnement | Une offre industrialisée | Projet à part entière : séparation des données, facturation, support |

Conseil : commencer par la première, et passer à la deuxième dès que la même correction a dû être faite deux fois.
Le site de réservation de l'Hôtel Le Saint Éloi suit la même logique (une source par règle, des données séparées du
moteur), avec une autre base technique : les deux projets se dupliquent de la même façon.
