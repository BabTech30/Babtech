# Consignes pour travailler sur le site BabTech

Site vitrine + blog de BabTech (studio digital près de Montpellier). Next.js 16 (App Router, toutes les pages prérendues),
React 19, Tailwind CSS 3, TypeScript. Voir `README.md` pour les commandes et `docs/` pour la stratégie.

## Avant de pousser
- `npm run verify` doit passer (TypeScript, ESLint, build, puis `scripts/check-build.mjs` qui exporte une copie statique
  dans `out/` et contrôle chaque page). Le workflow GitHub « Contrôle qualité » lance la même chose à chaque envoi.
- Mise en ligne : Hostinger (application Node.js, Node 22) est relié à la branche `main` et redéploie à chaque mise à
  jour (`npm run build`, puis serveur Next.js « standalone » imposé par Hostinger). Ne fusionner dans `main` qu'avec
  l'accord explicite de l'utilisateur.
- Domaine défini par `DEFAULT_SITE_URL` dans `src/lib/site.ts`. `trailingSlash: true` : toutes les URL de pages finissent
  par « / » — construire les URL avec `absoluteUrl()` / `withTrailingSlash()` (`src/lib/site.ts`). En-têtes de sécurité,
  redirection www → domaine principal et favicon : `next.config.js`.
- Ne pas créer de route sous `/icons/` : ce chemin est réservé par beaucoup de serveurs Apache/LiteSpeed (d'où `/brand/`).
- Toutes les pages doivent rester prérendues (le contrôle qualité les exporte en statique) : pas d'API routes, middleware
  ni ISR sans décision explicite (future plateforme communauté). Les routes générées (sitemap, robots, llms.txt, RSS,
  images OG) utilisent `dynamic = 'force-static'`, les routes dynamiques `dynamicParams = false`.

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
