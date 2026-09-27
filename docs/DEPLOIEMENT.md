# Mettre le site en ligne sur Hostinger (application Node.js)

## Comment ça marche

Hostinger est relié à la branche **`main`** du dépôt GitHub. À chaque mise à jour de `main`, Hostinger récupère le code,
installe les paquets, construit le site (`npm run build`) et le redémarre : **ce qui est dans `main` est en ligne**.

Pour modifier le site :
1. les modifications sont faites sur une branche de travail ;
2. GitHub lance le **Contrôle qualité** (onglet **Actions**) : il doit être vert ;
3. tu valides (« ok main »), la branche est fusionnée dans `main` et Hostinger met le site à jour en quelques minutes ;
4. tu vérifies sur `https://babtech.fr`.

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
Toutes les pages sont préparées à l'avance au moment du build, le serveur n'a qu'à les envoyer : le site reste très rapide.

**Variables d'environnement** (facultatives) : dans les réglages de l'application, puis redéployer. Par exemple
`NEXT_PUBLIC_PHONE` (`+33…`), `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (mesure d'audience sans cookie),
`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. La liste complète est dans `.env.example`.

## Si une mise à jour n'apparaît pas

1. hPanel → application Node.js → **déploiements** : le dernier doit être réussi. S'il a échoué, son journal indique
   l'erreur : copie-le dans la conversation avec Claude.
2. Relance le déploiement depuis hPanel.
3. Vide le cache (hPanel → Performances → CDN, s'il est actif), puis recharge la page (Ctrl + F5).

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
| Téléphone (`phone`, ou variable `NEXT_PUBLIC_PHONE` dans Hostinger) | Obligation légale, SEO local, appels directs |
| Email à ton domaine (`email`, ex. `contact@babtech.fr`, à créer dans hPanel → Emails) | Image professionnelle, cohérence avec la fiche Google |
| Profils LinkedIn, Malt, Google Business Profile (`social`, `founder.sameAs`) | Relient ton entreprise pour Google et les IA |

Et la photo de Bastien sur la page À propos, dès que possible. Le plan de référencement complet est dans
[`STRATEGIE-SEO-GEO.md`](STRATEGIE-SEO-GEO.md).
