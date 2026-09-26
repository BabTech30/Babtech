# Mettre le site en ligne sur Hostinger

Le site est **100 % statique** : la commande de build produit un dossier `out/` (pages HTML, images, sitemap, llms.txt…)
qu'il suffit de copier dans `public_html`. Pas besoin de Node.js ni de base de données chez Hostinger : n'importe quelle
offre d'hébergement web convient.

Le build génère aussi le fichier **`.htaccess`** utilisé par les serveurs d'Hostinger (LiteSpeed, compatible Apache) :
HTTPS obligatoire, redirection `www` → domaine principal, page 404 personnalisée, en-têtes de sécurité, cache,
compression, protection des fichiers cachés. Cette configuration a été testée sur un serveur Apache 2.4.

Deux façons de publier :
- **A. à la main** : une commande crée un fichier zip à importer dans hPanel (idéal pour la première mise en ligne) ;
- **B. automatiquement** : chaque mise à jour de la branche `main` sur GitHub reconstruit et envoie le site par FTP sécurisé.

## 1. Préparer Hostinger (une seule fois)

1. **Domaine.** Au 26 septembre 2026, `babtech.fr` n'est enregistré par personne (vérifié auprès de l'AFNIC). Enregistre-le
   (directement chez Hostinger ou chez un autre registraire), puis relie-le à ton hébergement.
2. **Site.** Dans hPanel, ajoute un site pour ce domaine, **vide** : ni WordPress, ni créateur de site.
3. **SSL.** Vérifie que le certificat SSL gratuit est actif pour le domaine (il l'est généralement automatiquement).
4. **Email pro (conseillé).** Crée une adresse du type `contact@babtech.fr` et reporte-la dans `src/lib/site.ts` (`email`) :
   une adresse à ton domaine inspire plus confiance qu'une adresse iCloud et renforce la cohérence de tes informations en ligne.

## 2. Indiquer l'adresse du site

Crée à la racine du projet un fichier **`.env.production`** (il peut être versionné : il ne contient rien de secret) :

```
NEXT_PUBLIC_SITE_URL=https://babtech.fr
NEXT_PUBLIC_PHONE=+33600000000
```

Toutes les URL du site en dépendent : liens canoniques, sitemap, Open Graph, données structurées, flux RSS, llms.txt
et `.htaccess`. Les autres variables possibles sont décrites dans `.env.example`.

> Pour un premier essai sur l'adresse temporaire fournie par Hostinger, mets cette adresse temporaire dans
> `NEXT_PUBLIC_SITE_URL`, puis reconstruis avec le vrai domaine avant d'annoncer le site.

## 3A. Mise en ligne à la main

```bash
npm install
npm run build:hostinger
```

La commande construit le site, lance le contrôle qualité (liens, balises SEO, données structurées…), vérifie que
l'adresse n'est plus celle de Netlify, puis crée **`hostinger-site.zip`**.

Dans hPanel → **Gestionnaire de fichiers** → dossier **`public_html`** :
1. supprime l'ancien contenu et les fichiers de démonstration d'Hostinger (garde le dossier `.well-known` s'il existe) ;
2. importe `hostinger-site.zip`, fais un clic droit → **Extraire** dans `public_html`, puis supprime le zip ;
3. ouvre `https://babtech.fr` : le site doit s'afficher en HTTPS.

## 3B. Mise en ligne automatique depuis GitHub

Le fichier `.github/workflows/deploy-hostinger.yml` publie le site à chaque push sur `main`. Il est inactif tant qu'il
n'est pas configuré.

1. hPanel → **Fichiers → Comptes FTP** : note l'hôte FTP, l'identifiant et le mot de passe (à créer ou réinitialiser si besoin).
2. GitHub → dépôt `Babtech` → **Settings → Secrets and variables → Actions** :

| Type | Nom | Valeur |
|---|---|---|
| Secret | `FTP_SERVER` | l'hôte FTP indiqué par Hostinger |
| Secret | `FTP_USERNAME` | l'identifiant FTP |
| Secret | `FTP_PASSWORD` | le mot de passe FTP |
| Variable | `HOSTINGER_DEPLOY` | `true` (active le déploiement) |
| Variable | `SITE_URL` | `https://babtech.fr` |
| Variable | `PHONE` | `+33…` (facultatif) |
| Variable | `FTP_SERVER_DIR` | facultatif, `public_html/` par défaut ; mets `./` si le compte FTP s'ouvre directement dans `public_html` |
| Variable | `FTP_PROTOCOL` | facultatif, `ftps` (chiffré) par défaut ; `ftp` seulement si la connexion chiffrée est refusée |

3. Onglet **Actions** du dépôt → « Déploiement Hostinger » → **Run workflow** pour le premier envoi.
   Ensuite, chaque fusion dans `main` met le site à jour ; seuls les fichiers modifiés sont envoyés.

Si le contrôle qualité échoue (lien cassé, page manquante…), **rien n'est envoyé** et le site en ligne reste intact :
l'erreur est détaillée dans l'onglet Actions. L'envoi dépose aussi un petit fichier de suivi
(`.ftp-deploy-sync-state.json`), que le `.htaccess` rend inaccessible au public.

## 4. Quitter Netlify sans perdre le référencement

L'ancienne adresse `agence-babtech.netlify.app` est déjà connue de Google. Une fois le site en ligne et vérifié sur
`babtech.fr` :

1. Netlify → site `agence-babtech` → **Site configuration → Environment variables** : ajoute
   `REDIRECT_SITE_TO` = `https://babtech.fr`, puis **Deploys → Trigger deploy**.
   Toutes les anciennes pages redirigent alors définitivement (301) vers les nouvelles : Google transfère leur historique.
   Le fichier de validation Search Console reste accessible pour que la propriété reste vérifiée.
2. Google Search Console : ajoute la propriété `babtech.fr`, puis, si l'outil le propose, déclare le
   **changement d'adresse** depuis l'ancienne propriété.
3. Garde le site Netlify en ligne au moins 6 à 12 mois (il ne sert plus qu'à rediriger), puis supprime-le.

Tant que la migration n'est pas faite, le site peut toujours être déployé sur Netlify (`netlify.toml`) : les mentions
légales y affichent alors automatiquement Netlify comme hébergeur.

## 5. Check-list après la mise en ligne

### Moteurs de recherche
- [ ] **Google Search Console** : propriété de type *Domaine* (enregistrement TXT à ajouter dans la zone DNS du domaine chez Hostinger).
- [ ] Soumettre le sitemap : `https://babtech.fr/sitemap.xml`
- [ ] Inspecter et demander l'indexation de l'accueil, des 5 pages services et des 7 articles.
- [ ] **Bing Webmaster Tools** : importer le site depuis la Search Console, soumettre le sitemap.
      Bing alimente aussi Copilot et une partie des recherches de ChatGPT.
- [ ] **IndexNow** : `npm run indexnow` (toutes les pages du sitemap en ligne), puis après chaque nouvel article :
      `npm run indexnow -- /blog/<slug>/`.

### Contrôles techniques
- [ ] `http://babtech.fr`, `http://www.babtech.fr` et `https://www.babtech.fr` redirigent vers `https://babtech.fr/`.
- [ ] Une adresse inventée (`https://babtech.fr/test/`) affiche la page 404 du site.
- [ ] [Test des résultats enrichis](https://search.google.com/test/rich-results) et [validateur Schema.org](https://validator.schema.org) sur l'accueil, un service, une ville et un article.
- [ ] Aperçu des partages : [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) et l'outil de débogage de partage de Facebook.
- [ ] `/robots.txt`, `/llms.txt`, `/llms-full.txt` et `/blog/rss.xml` s'affichent.
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

## 6. À compléter avant ou juste après la mise en ligne

| Élément | Où | Pourquoi |
|---|---|---|
| SIRET, adresse (ou domiciliation) | `src/lib/site.ts` → `legal` | Obligatoire dans les mentions légales (loi LCEN) |
| Téléphone | `NEXT_PUBLIC_PHONE` | Obligation LCEN + SEO local + conversions |
| Email à ton domaine | `src/lib/site.ts` → `email` | Confiance et cohérence des informations |
| Photo de Bastien | page À propos, cartes auteur | Confiance et E-E-A-T (Google valorise l'expérience réelle de l'auteur) |
| Profils LinkedIn, Malt, Google Business Profile | `src/lib/site.ts` → `social`, `founder.sameAs` | Relie les entités pour Google et les IA |
| Témoignages clients | `src/data/portfolio.ts` | Preuve sociale, citée par les IA |
