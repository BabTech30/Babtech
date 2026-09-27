# Stratégie SEO local + GEO — BabTech

Objectif : faire de BabTech **la référence digitale et IA des TPE de l'Hérault et du Gard**, visible à la fois
dans Google (recherche classique et Google Maps) et dans les réponses des assistants IA (ChatGPT, Perplexity, Gemini,
Claude, Copilot).

## 1. Positionnement

**« Le studio digital & IA des TPE de l'Hérault et du Gard, créé par un ancien chef d'entreprise. »**

Trois piliers, répétés de façon cohérente partout (site, Google Business Profile, LinkedIn, annuaires) :

1. **Le vécu du terrain** : 14 ans de direction d'entreprise dans le BTP. Différenciant, crédible, difficile à copier.
2. **Du site à l'IA** : un seul interlocuteur pour la visibilité, les outils métier et l'automatisation, en 3 niveaux lisibles
   (dès 800 €, 1 500 €, 3 000 €).
3. **Un temps d'avance** : GEO intégré à chaque projet et communauté locale d'apprentissage autour du digital et de l'IA.
   Peu d'acteurs locaux occupent ce terrain.

## 2. Architecture du site (silos et maillage)

```
Accueil
├── Services (hub)            → 6 pages services (1 page = 1 intention de recherche)
├── Zones d'intervention (hub) → 25 pages villes au contenu local unique (17 dans l'Hérault, 8 dans le Gard)
├── Blog (hub)                → 4 catégories = 4 thèmes de la future communauté
├── Communauté                → liste d'attente, puis événements et groupes
├── Réalisations, À propos, FAQ, Contact
```

Règles de maillage déjà en place :
- chaque page service renvoie vers toutes les villes, rangées par département (« Création de site internet à Nîmes »…),
  ses articles liés et 2 services associés ;
- chaque ville renvoie vers les 6 services (le plus utile sur place en premier, par exemple le site de réservation dans
  les villes touristiques) et vers ses villes voisines ;
- l'accueil et la page « Zones d'intervention » relient toutes les villes, rangées par département ;
- chaque article renvoie vers 4 à 8 pages (services, articles, contact, communauté) ;
- le pied de page relie toutes les pages services et les 8 villes principales depuis chaque page.

## 3. Carte des mots-clés

| Page | Requête principale | Requêtes secondaires |
|---|---|---|
| `/` | agence web / studio digital Montpellier | freelance web Montpellier, digitalisation TPE Hérault |
| `/services/creation-site-internet` | création site internet Montpellier | site vitrine artisan, site internet TPE Hérault, prix site vitrine |
| `/services/application-metier` | application métier sur mesure Montpellier | développement PWA, logiciel sur mesure TPE, outil de gestion artisan |
| `/services/automatisation-ia` | automatisation IA TPE Montpellier | consultant n8n, intégration IA entreprise, automatiser devis relances |
| `/services/referencement-local-geo` | référencement local Montpellier | SEO local Hérault, GEO ChatGPT, fiche Google Business Profile |
| `/services/accompagnement-formation-ia` | formation IA Montpellier | formation ChatGPT entreprise, accompagnement digital TPE |
| `/zones-intervention` | agence web Hérault, agence web Gard | création site internet Hérault / Gard |
| `/zones-intervention/<ville>` | création site internet <ville> | agence web <ville>, développeur web <ville>, site de réservation gîte <ville> |
| `/blog/prix-site-internet-tpe-montpellier` | prix site internet TPE | combien coûte un site vitrine, location site internet |
| `/blog/seo-local-montpellier-google-business-profile` | SEO local Montpellier | Google Maps, avis Google, fiche Google Business |
| `/blog/geo-referencement-ia-chatgpt-perplexity-gemini` | GEO référencement IA | être recommandé par ChatGPT, llms.txt |
| `/communaute` | communauté IA Montpellier | atelier IA entrepreneurs, formation IA TPE Montpellier |

Suivre ces requêtes dans Google Search Console (*Performances → Requêtes*) et ajuster titres et contenus tous les trimestres.

## 4. Ce qui est déjà en place techniquement

**SEO**
- URL canonique unique par page, pilotée par `NEXT_PUBLIC_SITE_URL`
- Balises title/description uniques, Open Graph et Twitter Cards avec une image générée pour chaque page
- Sitemap XML avec dates de mise à jour, flux RSS, fil d'Ariane, un seul H1 par page, HTML sémantique
- Site statique ultra-rapide, polices auto-hébergées (aucun appel à Google Fonts), contrastes conformes WCAG AA
- Contrôle qualité automatique à chaque déploiement (`npm run check`)

**GEO (moteurs IA)**
- `robots.txt` qui autorise explicitement GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot,
  Google-Extended, Applebot-Extended, Bingbot, MistralAI-User, CCBot…
- `/llms.txt` (sommaire) et `/llms-full.txt` (tout le contenu en texte brut), générés automatiquement
- Données structurées reliées entre elles : `ProfessionalService` (zone desservie, catalogue d'offres, prix),
  `Person` (fondateur), `WebSite`, `Service`, `FAQPage`, `BlogPosting`, `BreadcrumbList`, villes liées à Wikipédia
- Contenus « réponse d'abord » : encadré « L'essentiel en 30 secondes », FAQ, tableaux, prix et délais explicites
- Identité cohérente : mêmes nom, zone, tarifs et descriptions sur toutes les pages et dans les données structurées

## 5. Plan d'action local (hors site) — les 90 premiers jours

Le classement Google Maps repose sur la **pertinence**, la **distance** et la **notoriété**. Le site couvre la pertinence ;
la notoriété se construit à l'extérieur.

1. **Google Business Profile** (semaine 1) : fiche complète, zone de service (Hérault, Gard et les villes principales :
   Montpellier, Nîmes, Béziers, Sète, Alès…), services avec prix, photos réelles, un post par semaine pendant 2 mois puis
   un par mois.
2. **Avis** (en continu) : demander un avis à chaque client, avec un lien direct et un QR code ; répondre à tous.
   Objectif : des avis réguliers, détaillés (le métier du client, la ville, le service).
3. **Citations NAP** (mois 1) : Bing Places, Apple Business Connect, PagesJaunes, LinkedIn (page entreprise), Malt,
   annuaires des CCI de l'Hérault et du Gard. Toujours le même nom, la même ville, le même téléphone, la même URL.
4. **Liens et mentions locales** (mois 2-3) :
   - clubs et réseaux d'entrepreneurs de Montpellier et de Nîmes (réseaux d'affaires, associations de commerçants, clubs
     d'entreprises) ;
   - partenaires naturels : experts-comptables, photographes, imprimeurs, agences immobilières (échanges de recommandations) ;
   - presse locale (Midi Libre, médias en ligne de Montpellier et de Nîmes) : communiquer sur le lancement de la communauté ;
   - interventions dans des événements tech ou entrepreneuriaux locaux ;
   - chaque client accompagné : un lien « site réalisé par BabTech » dans le pied de page, avec son accord.
5. **Études de cas** : transformer chaque projet en page détaillée avec chiffres réels (avec l'accord du client) et témoignage.

## 6. Plan GEO — être cité par les assistants IA

Les assistants s'appuient sur les index de Google et Bing, puis croisent les sources. Donc :

- **Être indexé partout** : Search Console + Bing Webmaster Tools + IndexNow après chaque publication.
- **Multiplier les sources concordantes** : fiches d'entreprise, annuaires, LinkedIn, articles invités, podcasts,
  presse locale. Les IA recommandent ce que plusieurs sources indépendantes confirment.
- **Publier ce que toi seul peux dire** : prix, délais, méthode, retours d'expérience, résultats chiffrés de clients (réels).
- **Mettre à jour** : dater les contenus, rafraîchir les articles clés chaque année (`updated:` dans l'article).
- **Mesurer chaque mois** avec la même grille, dans ChatGPT, Perplexity, Gemini, Copilot et Claude :

| Question à tester | Ce qu'on regarde |
|---|---|
| Quelle agence web à Montpellier pour une petite entreprise ? | BabTech cité ? Quelles sources ? |
| Qui peut créer le site de mon restaurant à Montpellier avec un menu QR code ? | Cité ? Prix repris correctement ? |
| Freelance pour automatiser mes devis avec l'IA dans l'Hérault ? | Cité ? Lien vers la bonne page ? |
| Formation à l'IA pour dirigeants de TPE à Montpellier ? | Cité ? La communauté est-elle mentionnée ? |
| Combien coûte un site vitrine pour un artisan à Montpellier ? | L'article prix est-il utilisé comme source ? |
| Développeur d'application métier à Sète / Lunel / Béziers ? | Les pages villes sont-elles reprises ? |
| Qui peut créer le site internet de mon commerce à Nîmes ou à Alès ? | Les pages du Gard sont-elles reprises ? |
| Site de réservation en direct pour mon gîte à Uzès ou au Grau-du-Roi ? | Prix et synchro iCal repris correctement ? |

Et dans l'outil d'audience : surveiller les visites venant de `chatgpt.com`, `perplexity.ai`, `gemini.google.com`,
`copilot.microsoft.com`, `claude.ai`.

## 7. Calendrier éditorial (12 mois, 2 articles par mois)

Chaque article : une vraie question de client, une réponse dès le premier paragraphe, un ancrage local, un appel à l'action.

| Mois | Articles proposés |
|---|---|
| 1 | Site vitrine ou page Facebook : que choisir pour un artisan ? · 10 erreurs qui empêchent un site d'apparaître sur Google |
| 2 | QR menu pour restaurant : mode d'emploi · Comment rédiger la description de sa fiche Google Business Profile |
| 3 | Facturation électronique : ce qui change pour les TPE (avec un expert-comptable invité) · Relancer ses devis automatiquement |
| 4 | ChatGPT, Claude, Gemini, Le Chat : lequel choisir pour une TPE ? · Compte rendu du premier atelier de la communauté |
| 5 | Étude de cas : Le Terrier, un bar-restaurant digitalisé de A à Z · PWA ou application mobile : que choisir ? |
| 6 | Répondre aux avis négatifs : méthode et modèles · Créer une charte d'usage de l'IA pour son équipe |
| 7 | Site multilingue pour le tourisme (Sète, Agde, La Grande-Motte, Le Grau-du-Roi) · Automatiser la prise de rendez-vous |
| 8 | RGPD et IA : les règles simples pour une petite entreprise · Étude de cas : Hôtel Le Saint Éloi |
| 9 | Mesurer son trafic sans cookie (Plausible, Umami) · Bilan des cercles de travail de la communauté |
| 10 | Les métiers du BTP face à l'IA : ce qui change vraiment · Tableau de bord : les 5 chiffres qu'un artisan doit suivre |
| 11 | GEO : bilan d'un an de tests dans les assistants IA · Refonte de site : quand et comment |
| 12 | Le guide 2027 du digital pour les TPE de l'Hérault et du Gard (article pilier, mis à jour chaque année) |

## 8. Indicateurs à suivre chaque mois

| Indicateur | Outil |
|---|---|
| Impressions et clics sur les requêtes locales (« Montpellier », noms de villes) | Google Search Console |
| Pages indexées, erreurs | Search Console, Bing Webmaster Tools |
| Appels, itinéraires, clics vers le site depuis la fiche | Google Business Profile |
| Nombre et note des avis | Google Business Profile |
| Demandes de contact, rendez-vous réservés, inscriptions communauté | Onglets Demandes et Rendez-vous du tableau de bord, outil d'audience (événements `contact_form`, `rendez_vous`, `community_signup`) |
| Citations dans les assistants IA (grille du §6) | Tests manuels mensuels |
| Visites venant des assistants IA | Plausible / Umami |

## 9. Routine mensuelle (1 heure)

1. Publier 2 articles, puis `npm run indexnow -- /blog/<slug>`.
2. Un post et des photos sur Google Business Profile ; répondre aux avis.
3. Passer la grille GEO (§6) et noter les résultats.
4. Regarder la Search Console : quelles requêtes montent ? Enrichir la page correspondante.
5. Ajouter une réalisation ou un témoignage dès qu'un projet se termine.
