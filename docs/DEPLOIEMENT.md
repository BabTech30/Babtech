# Mettre le site en ligne sur Hostinger

Le site est **100 % statique** : c'est un dossier de fichiers (pages, images, sitemap…) à copier dans `public_html`.
Pas besoin de Node.js ni de base de données chez Hostinger : n'importe quelle offre d'hébergement web convient.
Le fichier `.htaccess` (HTTPS obligatoire, `www` redirigé, page 404, sécurité, cache) est fourni avec le site.

## 1. Côté Hostinger (une seule fois)

1. Prendre l'hébergement et le domaine **babtech.fr** (libre au 26 septembre 2026).
   Autre domaine ? Change la ligne `DEFAULT_SITE_URL` dans `src/lib/site.ts`, c'est tout.
2. Dans hPanel, ajouter un site **vide** pour ce domaine (ni WordPress, ni créateur de site).
3. Vérifier que le certificat SSL gratuit est actif (il l'est en général automatiquement).
4. Conseillé : créer une adresse email à ton domaine (ex. `contact@babtech.fr`) et la reporter dans `src/lib/site.ts` (`email`).

## 2. Récupérer le site prêt à l'emploi

**Sans rien installer (recommandé).** À chaque mise à jour de la branche `main` sur GitHub, le site est construit et
contrôlé automatiquement. Sur GitHub → onglet **Actions** → dernière exécution « Site Hostinger » → section **Artifacts** →
télécharge **site-hostinger** (un fichier zip). Pour relancer à la main : **Run workflow** sur la même page.

**Ou sur ton ordinateur** (Node.js installé) : `npm install` puis `npm run build:hostinger` → fichier `hostinger-site.zip`.

## 3. Mettre en ligne

hPanel → **Gestionnaire de fichiers** → dossier **`public_html`** :
1. supprime l'ancien contenu et les fichiers de démonstration d'Hostinger (garde le dossier `.well-known` s'il existe) ;
2. importe le zip, clic droit → **Extraire** dans `public_html`, puis supprime le zip ;
3. ouvre `https://babtech.fr` : le site s'affiche en HTTPS.

Pour une mise à jour : même opération avec le nouveau zip.

## Option : envoi automatique

Pour ne plus rien faire à la main, ajoute tes accès FTP dans GitHub → dépôt `Babtech` → **Settings → Secrets and variables
→ Actions → New repository secret** :

| Secret | Où le trouver |
|---|---|
| `FTP_SERVER` | hPanel → Fichiers → Comptes FTP (hôte FTP) |
| `FTP_USERNAME` | même page (identifiant) |
| `FTP_PASSWORD` | même page (mot de passe, à réinitialiser si besoin) |

Ensuite, chaque mise à jour de `main` est envoyée sur Hostinger toute seule (seuls les fichiers modifiés partent).
Si le contrôle qualité trouve une erreur, rien n'est envoyé et le site en ligne reste intact.

Deux réglages facultatifs, en *Variables* sur la même page : `FTP_SERVER_DIR` (`public_html/` par défaut ; mets `./` si
ton compte FTP s'ouvre directement dans `public_html`) et `FTP_PROTOCOL` (`ftps`, chiffré, par défaut ; `ftp` seulement si
la connexion chiffrée est refusée). Le téléphone peut aussi être ajouté en variable `PHONE` (`+33…`).

## Netlify

Le site n'utilise plus Netlify. Tu peux supprimer l'ancien site `agence-babtech` dans ton compte Netlify quand tu veux
(*Site configuration → Delete this site*).

## Après la mise en ligne (pour le référencement)

- [ ] **Google Search Console** : ajouter `babtech.fr` (vérification par enregistrement DNS, à coller dans hPanel →
      Zone DNS), soumettre `https://babtech.fr/sitemap.xml`, demander l'indexation de l'accueil et des pages services.
- [ ] **Bing Webmaster Tools** : importer le site depuis la Search Console (Bing alimente aussi Copilot et une partie de ChatGPT).
- [ ] **IndexNow** : `npm run indexnow` pour signaler toutes les pages à Bing ; après un nouvel article : `npm run indexnow -- /blog/<slug>/`.
- [ ] **Google Business Profile** : créer la fiche « BabTech » (zone de service : Montpellier et l'Hérault), avec le lien du
      site, les services et des photos, puis demander un avis à chaque client. C'est le levier n° 1 pour le référencement local.
- [ ] Envoyer un message test avec le formulaire de contact et celui de la communauté. En cas d'erreur, désactiver le
      reCAPTCHA dans les réglages du formulaire Formspree (le site a déjà son propre anti-spam).

## À compléter dans `src/lib/site.ts`

| Élément | Pourquoi |
|---|---|
| SIRET et adresse (`legal`) | Obligatoires dans les mentions légales |
| Téléphone (`phone`, ou variable `PHONE` dans GitHub) | Obligation légale, SEO local, appels directs |
| Profils LinkedIn, Malt, Google Business Profile (`social`, `founder.sameAs`) | Relient ton entreprise pour Google et les IA |

Et la photo de Bastien sur la page À propos, dès que possible. Le plan de référencement complet est dans
[`STRATEGIE-SEO-GEO.md`](STRATEGIE-SEO-GEO.md).
