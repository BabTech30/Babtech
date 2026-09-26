# Mettre le site en ligne

Le site est **100 % statique** : `npm run build` produit un dossier `out/` que n'importe quel hébergeur peut servir.
La configuration est prête pour **Netlify** (`netlify.toml`).

## 1. Déployer sur Netlify

Le site actuel `agence-babtech.netlify.app` est déjà sur Netlify.

1. **Fusionner la branche de travail dans `main`** (pull request sur GitHub). Si le site Netlify est relié au dépôt GitHub,
   chaque push sur `main` déclenche un déploiement, et chaque pull request obtient une URL de prévisualisation.
2. Si le site n'est pas encore relié au dépôt : Netlify → *Add new site → Import an existing project → GitHub* →
   dépôt `Babtech`. Les réglages sont lus dans `netlify.toml` : commande `npm run build && npm run check`,
   dossier publié `out`, Node 22.
3. Le build **échoue volontairement** si le contrôle qualité trouve une erreur (lien interne cassé, page du sitemap
   manquante, JSON-LD invalide…) : la version en ligne n'est alors pas remplacée. Le détail est dans le log du déploiement.

Pour revenir en arrière : Netlify → *Deploys* → choisir un déploiement précédent → *Publish deploy*.

## 2. Variables d'environnement

Netlify → *Site configuration → Environment variables* (liste complète et commentée dans `.env.example`) :

| Variable | Rôle | Conseil |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canonique du site | À définir **dès que le domaine est branché** (ex. `https://babtech.fr`) |
| `NEXT_PUBLIC_PHONE` | Téléphone (format `+33…`) | Fortement conseillé pour le SEO local et le clic-pour-appeler |
| `NEXT_PUBLIC_FORMSPREE_COMMUNITY_ID` | Formulaire dédié à la communauté | Créer un 2ᵉ formulaire Formspree pour séparer les listes |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` ou `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Mesure d'audience sans cookie | Umami Cloud a une offre gratuite ; Plausible est payant |
| `NEXT_PUBLIC_CLIENT_SPACE_URL` | Bouton « Espace client » | Laisser vide tant que l'espace n'existe pas |

Après toute modification de variable : *Deploys → Trigger deploy*.

## 3. Brancher un nom de domaine (recommandé)

Au 26 septembre 2026, **`babtech.fr` n'est enregistré par personne** (vérifié auprès de l'AFNIC). Un domaine à ton nom
est un signal de confiance pour les clients, pour Google et pour les IA, et évite de dépendre d'un sous-domaine Netlify.

1. Enregistrer `babtech.fr` chez un registraire (OVHcloud, Gandi, Infomaniak…, ou directement dans Netlify).
2. Netlify → *Domain management → Add a domain* → `babtech.fr`, puis le définir comme **Primary domain**.
   Netlify redirige alors automatiquement `agence-babtech.netlify.app` et `www.babtech.fr` vers `https://babtech.fr`
   (redirections 301) et fournit le certificat HTTPS.
3. Définir `NEXT_PUBLIC_SITE_URL=https://babtech.fr` et redéployer : canonicals, sitemap, Open Graph, RSS, llms.txt et
   données structurées basculent sur le nouveau domaine.
4. Déclarer le nouveau domaine dans Google Search Console et Bing Webmaster Tools (étape 4).

> L'ancien code annonçait déjà `babtech.fr` comme domaine officiel alors qu'il n'existait pas : c'est corrigé, l'URL est
> désormais pilotée par `NEXT_PUBLIC_SITE_URL`.

## 4. Check-list après la mise en ligne

### Moteurs de recherche
- [ ] **Google Search Console** : ajouter la propriété (idéalement de type *Domaine*, via un enregistrement DNS TXT).
      Le fichier `public/google88869f3f4ae30174.html` vérifie déjà `agence-babtech.netlify.app`.
- [ ] Soumettre le sitemap : `https://<domaine>/sitemap.xml`
- [ ] Inspecter et demander l'indexation de l'accueil, des 5 pages services et des 7 articles.
- [ ] **Bing Webmaster Tools** : importer le site depuis la Search Console, soumettre le sitemap.
      Bing alimente aussi Copilot et une partie des recherches de ChatGPT.
- [ ] **IndexNow** : `NEXT_PUBLIC_SITE_URL=https://<domaine> npm run indexnow` (toutes les pages du sitemap).
      Ensuite, après chaque nouvel article : `npm run indexnow -- /blog/<slug>`.

### Contrôles techniques
- [ ] [Test des résultats enrichis](https://search.google.com/test/rich-results) et [validateur Schema.org](https://validator.schema.org) sur l'accueil, un service, une ville et un article.
- [ ] Aperçu des partages : [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) et l'outil de débogage de partage de Facebook.
- [ ] `https://<domaine>/robots.txt`, `/llms.txt`, `/llms-full.txt` et `/blog/rss.xml` s'affichent.
- [ ] PageSpeed Insights sur mobile (objectif : vert partout).
- [ ] Envoyer un message test via le formulaire de contact et via le formulaire de la communauté.
- [ ] Formspree : activer la restriction au domaine du site (anti-spam). Les formulaires envoient en arrière-plan (AJAX) :
      si un message test affiche une erreur, désactiver le reCAPTCHA dans les réglages du formulaire Formspree
      (le site a déjà son propre piège anti-robots).

### Présence locale (le plus gros levier de référencement régional)
- [ ] **Google Business Profile** : créer ou revendiquer la fiche « BabTech ». Entreprise en zone de service (adresse masquée),
      zone : Montpellier + communes de l'Hérault réellement desservies. Catégorie principale du type « Concepteur de sites Web »
      et catégories secondaires cohérentes avec les services (vérifier les libellés proposés par Google).
      Lien vers le site, description (750 caractères), services avec prix « à partir de », photos, premier post.
- [ ] **Bing Places** et **Apple Business Connect** : mêmes informations.
- [ ] Mêmes nom, ville, téléphone et URL partout (site, fiches, LinkedIn, Malt, annuaires) → compléter `social` et
      `founder.sameAs` dans `src/lib/site.ts` avec les URL de ces profils.
- [ ] Demander un avis Google à chaque client (Le Terrier, Hôtel Saint Eloi…) et répondre à chacun.

Le plan détaillé (mots-clés, contenus, GEO, suivi mensuel) est dans [`STRATEGIE-SEO-GEO.md`](STRATEGIE-SEO-GEO.md).

## 5. À compléter avant ou juste après la mise en ligne

| Élément | Où | Pourquoi |
|---|---|---|
| SIRET, adresse (ou domiciliation) | `src/lib/site.ts` → `legal` | Obligatoire dans les mentions légales (loi LCEN) |
| Téléphone | `NEXT_PUBLIC_PHONE` | Obligation LCEN + SEO local + conversions |
| Photo de Bastien | page À propos, cartes auteur | Confiance et E-E-A-T (Google valorise l'expérience réelle de l'auteur) |
| Profils LinkedIn, Malt, Google Business Profile | `src/lib/site.ts` → `social`, `founder.sameAs` | Relie les entités pour Google et les IA |
| Témoignages clients | `src/data/portfolio.ts` | Preuve sociale, citée par les IA |
