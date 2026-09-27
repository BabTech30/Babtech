# Mettre le site en ligne sur Hostinger

Le site est **100 % statique** : c'est un dossier de fichiers (pages, images, sitemap…) servi depuis `public_html`.
Pas besoin de Node.js ni de base de données chez Hostinger : n'importe quelle offre d'hébergement web convient.
Le fichier `.htaccess` (HTTPS obligatoire, `www` redirigé, page 404, sécurité, cache, compression) est fourni avec le site.

## Comment ça marche

1. Tu modifies le site sur la branche **`main`** (le code source).
2. GitHub construit le site et le contrôle (liens, balises SEO, données structurées…) en 2 à 3 minutes, puis range le
   résultat, prêt à servir, dans la branche **`hostinger`**. Si le contrôle échoue, rien n'est publié et le site en
   ligne reste intact.
3. Hostinger récupère la branche `hostinger` dans `public_html`.

> **Ne branche jamais Hostinger sur `main`** : `main` contient le code source, pas le site. Hostinger ne sait pas le
> construire et afficherait une page vide ou une erreur. La branche `hostinger` est régénérée à chaque mise à jour :
> ne la modifie jamais à la main.

## 1. Brancher Hostinger sur la branche `hostinger` (une seule fois)

La branche `hostinger` est créée automatiquement la première fois que `main` est mise à jour avec cette version du
site : vérifie sur GitHub → onglet **Actions** que l'exécution « Site Hostinger » est verte.

1. hPanel → **Sites web** → babtech.fr → **Avancé → Git**. Si un dépôt est déjà branché sur `main`, supprime-le.
2. hPanel → **Gestionnaire de fichiers** → `public_html` : supprime tout son contenu, dont `default.php` (la page par
   défaut d'Hostinger). Le déploiement Git n'accepte qu'un dossier vide.
3. Retour dans **Git**, crée un dépôt :
   - dépôt : `https://github.com/BabTech30/Babtech.git` (dépôt public : aucune clé SSH nécessaire) ;
   - branche : `hostinger` ;
   - répertoire : laisse vide (le site va directement dans `public_html`).
4. Clique sur **Déployer**, puis ouvre `https://babtech.fr` : le site s'affiche en HTTPS.

**Mise à jour automatique** : dans Git, active le **déploiement automatique** et copie l'URL du webhook fournie par
Hostinger. Sur GitHub → dépôt `Babtech` → **Settings → Webhooks → Add webhook** : colle l'URL dans *Payload URL*,
laisse le reste par défaut, puis **Add webhook**. Désormais, chaque mise à jour de `main` arrive en ligne toute seule,
quelques minutes plus tard. Sans webhook, il suffit de cliquer sur **Déployer** dans hPanel.

Le dossier `.git` que Hostinger crée dans `public_html` est bloqué par le `.htaccess` : il n'est pas lisible depuis le web.
Ne modifie pas les fichiers de `public_html` à la main et évite les réglages d'hPanel qui réécrivent le `.htaccess`
(redirections, « Forcer HTTPS »…) : le site gère déjà HTTPS et `www`, et une modification sur le serveur peut bloquer
les mises à jour Git.

## Autres façons de mettre en ligne (sans le Git d'Hostinger)

Une seule méthode à la fois : si le déploiement Git est en place, n'utilise ni le zip ni le FTP (ils écriraient dans le
même dossier et bloqueraient les mises à jour Git).

**Zip, à la main.** GitHub → onglet **Actions** → dernière exécution « Site Hostinger » → section **Artifacts** →
télécharge **site-hostinger**. Ou, sur ton ordinateur (Node.js installé) : `npm install` puis `npm run build:hostinger`
→ fichier `hostinger-site.zip`. Ensuite, hPanel → **Gestionnaire de fichiers** → `public_html` : supprime l'ancien
contenu (garde le dossier `.well-known` s'il existe), importe le zip, clic droit → **Extraire**, puis supprime le zip.

**FTP automatique.** Ajoute tes accès FTP dans GitHub → dépôt `Babtech` → **Settings → Secrets and variables →
Actions → New repository secret** (ne les écris jamais ailleurs) :

| Secret | Où le trouver |
|---|---|
| `FTP_SERVER` | hPanel → Fichiers → Comptes FTP (hôte FTP) |
| `FTP_USERNAME` | même page (identifiant) |
| `FTP_PASSWORD` | même page (mot de passe, à réinitialiser si besoin) |

Chaque mise à jour de `main` est alors envoyée sur Hostinger (seuls les fichiers modifiés partent). Deux réglages
facultatifs, en *Variables* sur la même page : `FTP_SERVER_DIR` (`public_html/` par défaut ; mets `./` si ton compte FTP
s'ouvre directement dans `public_html`) et `FTP_PROTOCOL` (`ftps`, chiffré, par défaut ; `ftp` seulement si la
connexion chiffrée est refusée).

## Si une mise à jour n'apparaît pas

1. GitHub → **Actions** : la dernière exécution « Site Hostinger » doit être verte. En rouge, ouvre-la : le contrôle
   qualité indique la page et le problème.
2. hPanel → **Git** : clique sur **Déployer** pour forcer la récupération. Si le déploiement échoue, supprime le dépôt
   dans Git, vide `public_html` et recrée-le (étapes 2 à 4 ci-dessus).
3. hPanel → **Performances → CDN** : vide le cache du CDN, puis recharge la page (Ctrl + F5).

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
| Email à ton domaine (`email`, ex. `contact@babtech.fr`, à créer dans hPanel → Emails) | Image professionnelle, cohérence avec la fiche Google |
| Profils LinkedIn, Malt, Google Business Profile (`social`, `founder.sameAs`) | Relient ton entreprise pour Google et les IA |

Et la photo de Bastien sur la page À propos, dès que possible. Le plan de référencement complet est dans
[`STRATEGIE-SEO-GEO.md`](STRATEGIE-SEO-GEO.md).
