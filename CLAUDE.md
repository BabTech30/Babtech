# Consignes pour travailler sur le site BabTech

Site vitrine + blog de BabTech (studio digital près de Montpellier). Next.js 16 en **export statique** (`output: 'export'`),
React 19, Tailwind CSS 3, TypeScript. Voir `README.md` pour les commandes et `docs/` pour la stratégie.

## Avant de pousser
- `npm run verify` doit passer (TypeScript, ESLint, build, `scripts/check-build.mjs`). Le workflow GitHub Actions
  publie le site construit sur la branche `hostinger` (suivie par le déploiement Git d'Hostinger), en zip et, en option,
  par FTP ; rien n'est publié si le contrôle qualité échoue. Ne jamais modifier la branche `hostinger` à la main.
- Hébergement : Hostinger uniquement (Apache/LiteSpeed), domaine défini par `DEFAULT_SITE_URL` dans `src/lib/site.ts`. `trailingSlash: true` : chaque page est exportée en `dossier/index.html`
  et toutes les URL de pages finissent par « / » — construire les URL avec `absoluteUrl()` / `withTrailingSlash()`
  (`src/lib/site.ts`). Le `.htaccess` est généré par `scripts/postbuild.mjs` (ne pas l'écrire à la main dans `public/`).
- Ne pas créer de route sous `/icons/` : ce chemin est réservé par beaucoup de serveurs Apache (d'où `/brand/`).
- Pas de fonctionnalité serveur (API routes, middleware, ISR) : tout doit rester générable statiquement. Les routes
  générées (sitemap, robots, llms.txt, RSS, images OG) utilisent `dynamic = 'force-static'`.

## Contenus
- Français, **tutoiement**, ton direct et concret, sans jargon (expliquer chaque terme technique en une phrase).
- **Ne jamais inventer** de statistiques, d'études, de clients, de témoignages ou de résultats. Les ordres de grandeur sont
  présentés comme indicatifs. Aucune promesse de classement garanti.
- Faits sur BabTech : uniquement ceux de `src/lib/site.ts`, `src/data/*` et de la page À propos. Tarifs : dès 800 €
  (site), 1 500 € (application métier), 3 000 € (automatisation & IA) ; SEO/GEO inclus dans les sites ; formation sur devis.
- Typographie : guillemets « », montants « 1 500 € ». Les textes issus des données passent par `fr()`
  (`src/lib/typography.ts`) qui pose les espaces insécables ; dans le JSX écrit en dur, utiliser `&nbsp;` avant `: ; ! ?`.
- Articles : `content/blog/*.md` (format décrit dans le README). Réponse dès le premier paragraphe, intertitres en questions,
  `tldr` et `faq` renseignés, liens internes vers services / articles / contact / communauté.
- Pages villes : contenu local réellement différent pour chaque ville (pas de pages « copier-coller »).

## SEO / GEO
- Toute nouvelle page : `pageMetadata()` (`src/lib/seo.ts`) avec un `path` canonique, une image OG déclarée dans
  `src/lib/og.ts`, un JSON-LD (`src/lib/schema.ts`) et, si besoin, un fil d'Ariane (`<Breadcrumbs>` ou `crumbs` de `PageHero`).
- Ajouter la page au sitemap (`src/app/sitemap.ts`) si elle n'est pas générée depuis les données.
- Un seul `<h1>` par page. Accessibilité : contrastes AA (utiliser `txt-secondary` / `txt-muted`, jamais plus sombre),
  libellés de formulaire associés, zones défilantes focusables.
