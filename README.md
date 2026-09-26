# BabTech — site vitrine, blog et communauté

Site de **BabTech**, studio digital basé près de Montpellier (Hérault) : sites internet, applications métier, automatisations IA,
référencement local + GEO, et accompagnement des TPE.

Le site est pensé pour être trouvé **sur Google** (SEO local) **et dans les réponses des assistants IA** (ChatGPT, Perplexity,
Gemini, Claude, Copilot…), grâce au GEO (*Generative Engine Optimization*).

- Stack : **Next.js 16** (App Router, export statique), **React 19**, **Tailwind CSS 3**, **TypeScript**
- Hébergement : **Hostinger** (fichiers statiques + `.htaccess` généré au build)
- Formulaires : **Formspree** · Rendez-vous : **Calendly** · Mesure d'audience optionnelle et sans cookie : **Plausible** ou **Umami**

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Génère le site statique dans `out/` (avec le `.htaccess` pour Hostinger) |
| `npm run build:hostinger` | Build + contrôle + archive `hostinger-site.zip` à importer dans `public_html` |
| `npm run check` | Contrôle qualité du site généré : liens cassés, balises SEO, JSON-LD, sitemap… |
| `npm run verify` | Tout d'un coup : TypeScript + ESLint + build + contrôle |
| `npm run preview` | Sert `out/` en local, comme en production |
| `npm run indexnow` | Signale les pages à Bing & co. après une mise en ligne (voir `docs/DEPLOIEMENT.md`) |

## Où modifier quoi ?

| Je veux modifier… | Fichier |
|---|---|
| Domaine, nom, email, téléphone, adresse, réseaux sociaux, SIRET | `src/lib/site.ts` |
| Les services (textes, prix, FAQ) | `src/data/services.ts` |
| Les pages des villes (zones d'intervention) | `src/data/zones.ts` et `src/data/area.ts` |
| La FAQ générale | `src/data/faq.ts` |
| Les réalisations | `src/data/portfolio.ts` |
| La communauté (formats, thèmes, étapes, FAQ) | `src/data/community.ts` |
| Les catégories du blog | `src/data/blog.ts` |
| Un article | `content/blog/<slug>.md` |

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

Le guide pas à pas est dans **[`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md)**. En résumé :

1. à chaque mise à jour de `main`, GitHub construit le site : onglet **Actions** → dernière exécution → télécharger
   **site-hostinger** (zip) — ou, sur ton ordinateur, `npm run build:hostinger` ;
2. hPanel → Gestionnaire de fichiers → `public_html` → importer le zip → **Extraire**.

En ajoutant tes accès FTP dans les secrets GitHub, l'envoi sur Hostinger devient automatique.

## Documentation

- [`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md) — mise en ligne sur Hostinger et check-list après la mise en ligne
- [`docs/STRATEGIE-SEO-GEO.md`](docs/STRATEGIE-SEO-GEO.md) — positionnement, mots-clés, plan local, GEO, calendrier éditorial
- [`docs/COMMUNAUTE.md`](docs/COMMUNAUTE.md) — feuille de route et architecture de la future plateforme communautaire

## Structure

```
content/blog/          Articles en Markdown
public/                Fichiers servis tels quels (favicon, vérification Google, clé IndexNow)
scripts/               postbuild.mjs (.htaccess), build-hostinger.mjs, check-build.mjs (contrôle qualité), indexnow.mjs
.github/workflows/     deploy-hostinger.yml (zip du site à chaque mise à jour, envoi FTP facultatif)
src/app/               Pages (App Router) + routes générées : sitemap, robots, llms.txt, RSS, images OG, icônes
src/components/        Composants d'interface (Header, Footer, formulaires, FAQ, cartes…)
src/data/              Contenus structurés (services, villes, FAQ, communauté…)
src/fonts/             Polices auto-hébergées (Outfit, DM Sans — licence OFL)
src/lib/               Configuration du site, SEO, Schema.org, blog, llms.txt, typographie
```
