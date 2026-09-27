# Mettre le site en ligne sur Hostinger (application Node.js)

## Comment ça marche

Hostinger construit la branche **`main`** du dépôt GitHub : il récupère le code, installe les paquets, construit le
site (`npm run build`) et le redémarre.

Pour modifier le site :
1. Claude fait les modifications et les envoie sur GitHub ;
2. GitHub lance le **Contrôle qualité** (onglet **Actions**) : il doit être vert ;
3. les modifications sont versées dans `main` ;
4. tu cliques sur **Déployer** dans hPanel, puis tu vérifies sur `https://babtech.fr`.

## Réglages de l'application Node.js (hPanel, une seule fois)

| Réglage | Valeur |
|---|---|
| Framework | Next.js |
| Branche | `main` |
| Version de Node | 22 |
| Commande de build | `npm run build` |
| Dossier de sortie | `.next` (valeur proposée par Hostinger) |
| Domaine | `babtech.fr` |

Hostinger construit les sites Next.js en mode serveur (« standalone ») : c'est prévu, rien à changer dans le code.
Les pages publiques sont préparées à l'avance au moment du build : le site reste très rapide.

**Variables d'environnement** (réglages de l'application, puis redéployer) :

| Variable | Rôle |
|---|---|
| `ADMIN_USERNAME` | Identifiant de l'espace `/admin` |
| `ADMIN_PASSWORD` | Mot de passe de départ de `/admin`, à remplacer ensuite dans **Réglages** |
| `ADMIN_DATA_DIR` | Facultatif : dossier des données de `/admin` (par défaut `~/.babtech-admin`, hors du dossier du site) |
| `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`… | Facultatives : téléphone, mesure d'audience… (liste dans `.env.example`) |

Ces valeurs ne s'écrivent que dans hPanel, jamais dans le code : le dépôt GitHub est public.

## Tableau de bord `/admin`

`https://babtech.fr/admin/` : connexion avec l'identifiant et le mot de passe ci-dessus.
- **Tableau de bord** : avancement, prochaine action, checklist (tu coches tes tâches, Claude tient les siennes), santé
  du site, chiffres du mois à saisir chaque début de mois, zones visées, décisions prises, liens utiles.
- **Partager** : les QR codes de ta présentation, du site et de ta carte de visite (fichiers pour l'impression,
  affichage en grand, lien à copier) et le nombre de scans de chaque mois.
- **Réglages** : changer le mot de passe (il remplace alors celui de hPanel et déconnecte les autres appareils),
  installer le tableau de bord comme une application, télécharger une sauvegarde de tes données.
- Après 5 mots de passe faux, la connexion est bloquée 15 minutes.
- Tes coches, tes chiffres, les scans et ton mot de passe (sous une forme illisible) sont enregistrés sur le serveur, hors du dossier
  du site : un déploiement ne les efface pas. Si **Réglages** signale le contraire, renseigne `ADMIN_DATA_DIR`.

## Si une mise à jour n'apparaît pas

1. hPanel → application Node.js → **déploiements** : le dernier doit être réussi. S'il a échoué, son journal indique
   l'erreur : copie-le dans la conversation avec Claude.
2. Relance le déploiement depuis hPanel.
3. Vide le cache (hPanel → Performances → CDN, s'il est actif), puis recharge la page (Ctrl + F5).

## Netlify

Le site n'utilise plus Netlify. Tu peux supprimer l'ancien site `agence-babtech` dans ton compte Netlify quand tu veux
(*Site configuration → Delete this site*).

## Après la mise en ligne (pour le référencement)

- [ ] **Adresse e-mail** : créer la boîte `contact@babtech.fr` (hPanel → Emails) avant ou juste après le premier
      déploiement : c'est l'adresse affichée sur tout le site et dans ta carte de visite.

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
| Téléphone (`phone`, ou variable `NEXT_PUBLIC_PHONE` dans Hostinger) | Obligation légale, SEO local, appels directs |
| Email à ton domaine (`email`, ex. `contact@babtech.fr`, à créer dans hPanel → Emails) | Image professionnelle, cohérence avec la fiche Google |
| Profils LinkedIn, Malt, Google Business Profile (`social`, `founder.sameAs`) | Relient ton entreprise pour Google et les IA |

Et la photo de Bastien sur la page À propos, dès que possible. Le plan de référencement complet est dans
[`STRATEGIE-SEO-GEO.md`](STRATEGIE-SEO-GEO.md).
