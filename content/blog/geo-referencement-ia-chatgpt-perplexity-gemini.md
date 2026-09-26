---
title: "GEO : comment être recommandé par ChatGPT, Perplexity et Gemini"
seoTitle: "GEO : être recommandé par ChatGPT, Perplexity et Gemini"
description: "GEO ou référencement IA : comment aider ChatGPT, Perplexity et Gemini à trouver, comprendre et recommander ton entreprise. Checklist concrète pour TPE."
date: "2026-09-26"
category: "visibilite-referencement"
tags: ["geo", "référencement ia", "chatgpt", "seo", "données structurées"]
tldr:
  - "Le GEO (Generative Engine Optimization) regroupe les actions qui aident les assistants IA comme ChatGPT, Perplexity ou Gemini à trouver, comprendre et citer ton entreprise."
  - "Pour les questions locales, les assistants cherchent leurs sources sur le web, notamment via les index de Google et de Bing : un bon référencement classique reste la base."
  - "Les leviers concrets : autoriser les robots d'IA, ajouter des données structurées Schema.org, publier des réponses factuelles et garder la même identité partout."
  - "Le fichier llms.txt est une convention proposée en 2024 : simple à mettre en place, mais rien ne garantit que chaque moteur le lise."
  - "Personne ne peut garantir qu'une IA recommandera ton entreprise : on mesure en posant chaque mois aux assistants les questions de tes clients."
faq:
  - q: "Combien de temps faut-il pour que ChatGPT cite mon entreprise ?"
    a: "Il n'existe pas de délai garanti. Tout dépend du passage des robots sur ton site, de son indexation par les moteurs de recherche et de la façon dont chaque assistant choisit ses sources. Compte plutôt en semaines ou en mois qu'en jours, et teste régulièrement."
  - q: "Faut-il bloquer les robots d'IA pour protéger mon contenu ?"
    a: "C'est un choix qui t'appartient. Pour une TPE qui veut être recommandée, bloquer les robots de recherche des assistants réduit fortement ses chances d'apparaître dans leurs réponses. Tu peux en revanche traiter différemment les robots qui servent à entraîner les modèles et ceux qui servent à la recherche, par exemple bloquer GPTBot tout en autorisant OAI-SearchBot."
  - q: "Le GEO fonctionne-t-il pour une entreprise sans site internet ?"
    a: "En partie seulement. Ta fiche Google Business Profile, les annuaires et les avis peuvent déjà être repris par les assistants. Mais sans site, tu n'as aucune page que tu contrôles pour présenter tes services, tes tarifs et ta zone d'intervention avec tes propres mots."
  - q: "Que faire si ChatGPT donne une mauvaise information sur mon entreprise ?"
    a: "Corrige d'abord la source : ton site, ta fiche Google ou l'annuaire où l'erreur apparaît. Les assistants s'appuient sur ce qu'ils trouvent en ligne, donc une info juste et identique partout a plus de chances d'être reprise. Tu peux aussi signaler la réponse avec les boutons de retour prévus dans l'assistant."
---

Pour que ChatGPT, Perplexity ou Gemini recommandent ton entreprise, ils doivent pouvoir trouver ton site, comprendre ce que tu fais et faire confiance à ce qu'ils lisent. C'est tout l'objet du GEO. Pour un artisan ou un commerçant de Montpellier et de l'Hérault, ça passe par des actions concrètes : laisser entrer les robots d'IA, structurer tes informations, publier des réponses claires et te faire citer par d'autres sources.

Pas de formule magique : personne ne peut programmer une IA pour qu'elle te recommande. Mais on peut mettre toutes les chances de ton côté, et la plupart de ces actions servent aussi ton référencement sur Google. Si tu débutes avec l'IA, commence par [ce guide pour savoir par où commencer avec l'IA générative](/blog/ia-generative-tpe-par-ou-commencer).

## Le GEO, c'est quoi exactement ?

Le GEO (Generative Engine Optimization), c'est l'ensemble des actions qui rendent ton entreprise facile à trouver, à comprendre et à citer par les moteurs de réponse. Un moteur de réponse, c'est un outil d'IA qui répond directement à une question au lieu d'afficher une liste de liens : ChatGPT, Perplexity, Gemini ou Copilot, par exemple.

Le SEO (référencement naturel), lui, vise les résultats classiques de Google et de Bing. Les deux se ressemblent beaucoup, avec une différence de taille : une réponse d'IA ne cite souvent que quelques entreprises, pas une page de dix liens.

| Critère | SEO (référencement naturel) | GEO (référencement IA) |
|---|---|---|
| Objectif | Apparaître dans les résultats de Google et Bing | Être cité ou recommandé dans une réponse d'IA |
| Ce que voit ton client | Une liste de liens et une carte | Une réponse rédigée, avec quelques sources |
| Ce qui compte | Pages utiles, mots-clés, liens, fiche Google | Les mêmes bases, plus des infos factuelles, structurées et identiques partout |
| Comment mesurer | Positions, clics, Search Console | Tests réguliers dans les assistants, visites venues de chatgpt.com ou perplexity.ai |

En clair : le GEO ne remplace pas le SEO, il s'appuie dessus. Les deux se travaillent ensemble.

## Comment ChatGPT, Perplexity et Gemini choisissent-ils leurs sources ?

Un assistant IA a deux façons de « savoir » quelque chose. Il y a ce qu'il a appris pendant son entraînement, figé à une certaine date. Et il y a ce qu'il va chercher sur le web au moment de ta question, ce qui est généralement le cas pour une demande locale comme « quel électricien à Lunel pour une mise aux normes ? ».

Chaque éditeur a sa méthode et n'en publie pas tous les détails. En restant prudent, voici ce qu'on sait :

- **ChatGPT** s'appuie notamment sur des résultats de recherche web, dont ceux de Bing, et sur ses propres robots d'exploration.
- **Perplexity** cherche sur le web pour répondre, explore les sites avec son propre robot et affiche ses sources.
- **Gemini** et les AI Overviews, les résumés générés par IA dans les résultats de Google, s'appuient sur l'index de Google, c'est-à-dire sa base de pages connues.
- **Copilot**, l'assistant de Microsoft, s'appuie sur Bing.

Conséquence directe : un site que Google et Bing connaissent mal a peu de chances d'être cité. Et comme ces outils croisent souvent plusieurs sources, ce que disent de toi les annuaires, les avis et la presse locale compte aussi.

## La checklist GEO pour une TPE

### 1. Laisse entrer les robots d'IA

Les robots sont des programmes qui parcourent les sites pour les lire. Le fichier robots.txt, placé à la racine de ton site, leur indique ce qu'ils ont le droit d'explorer. S'il bloque ceux des assistants, ton site devient invisible pour eux. Les principaux à connaître :

- **GPTBot** : le robot d'OpenAI qui collecte des contenus pouvant servir à entraîner ses modèles ;
- **OAI-SearchBot** : le robot utilisé pour la recherche dans ChatGPT ;
- **ChatGPT-User** : les visites faites par ChatGPT à la demande d'un utilisateur ;
- **PerplexityBot** : le robot de Perplexity ;
- **ClaudeBot** : le robot d'Anthropic, l'éditeur de Claude ;
- **Google-Extended** : pas un robot à part, mais un signal qui dit à Google si ton contenu peut servir à ses modèles Gemini. Il ne change rien à ta place dans Google Search, et les AI Overviews dépendent, elles, du robot classique de Google.

Exemple de robots.txt ouvert aux assistants :

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: https://www.ton-site.fr/sitemap.xml
```

Vérifie aussi les réglages de ton hébergeur ou de ton pare-feu : certains services de sécurité proposent de bloquer les robots d'IA, parfois par défaut.

### 2. Ajoute des données structurées

Les données structurées, ce sont des étiquettes invisibles pour tes visiteurs mais lisibles par les machines. Elles disent clairement : « ceci est une entreprise, voici son adresse, ses horaires, sa zone d'intervention ». On utilise Schema.org, le vocabulaire commun créé par les grands moteurs de recherche :

- **LocalBusiness**, ou un type plus précis comme Plumber ou Restaurant, pour ton entreprise ;
- **FAQPage** pour tes questions-réponses ;
- **Article** pour tes articles de blog, avec leur date de publication.

Depuis 2023, Google n'affiche plus les questions-réponses directement dans ses résultats pour la plupart des sites, mais ce balisage reste une façon nette de les présenter aux machines. Pour le tester, la documentation [Google Search Central](https://developers.google.com/search) présente les outils officiels.

### 3. Publie un fichier llms.txt, sans en attendre de miracle

Le llms.txt, c'est un fichier texte placé à la racine du site, qui résume qui tu es et liste tes pages importantes dans un format simple pour les IA. C'est une convention émergente, proposée en 2024 et décrite sur [llmstxt.org](https://llmstxt.org).

Soyons honnêtes : rien ne garantit que chaque moteur le lise ou en tienne compte. Mais il demande peu de travail et ne gêne rien, donc je l'ajoute à chaque projet.

### 4. Réponds d'abord, détaille ensuite

Une phrase claire qui répond à une question est plus facile à citer qu'un long paragraphe flou. Commence chaque page par la réponse, puis développe.

Publie surtout les informations que toi seul peux donner : tes prix « à partir de », tes délais, ta zone d'intervention, tes horaires, tes spécialités. Exemple pour un plombier : « Dépannage à Montpellier, Castelnau-le-Lez et Lattes, du lundi au samedi, devis gratuit. » Une info précise et vérifiable a plus de chances d'être reprise qu'un slogan comme « des solutions adaptées à tous vos besoins ».

Date tes contenus et tiens-les à jour. Un tarif affiché pour 2026 ou des horaires de vacances à jour inspirent plus confiance qu'une page figée depuis des années.

### 5. Garde la même identité partout

Ton nom, ton adresse, ton téléphone et ta description doivent être identiques sur ton site, ta fiche Google Business Profile, Bing Places, les annuaires comme PagesJaunes, tes réseaux sociaux et LinkedIn. Si un assistant trouve deux adresses ou deux numéros différents, il doute, et le doute ne joue pas en ta faveur. Tout le détail est dans le [guide du SEO local à Montpellier](/blog/seo-local-montpellier-google-business-profile).

### 6. Fais parler de toi : avis et sources locales

Quand un assistant recommande un commerce, il peut reprendre sa réputation : note, avis, mentions sur d'autres sites. Demande des avis à tes clients satisfaits, réponds à tous, et n'achète jamais de faux avis.

Les mentions locales comptent aussi : un article dans la presse régionale, la page partenaires d'une association ou d'un club que tu soutiens, le site d'un fournisseur, l'agenda d'un événement de ta commune. Pour un restaurant à Sète ou un électricien à Lunel, ce sont autant de sources indépendantes qui confirment que tu existes et que tu fais du bon travail.

### 7. Inscris ton site sur Bing Webmaster Tools et active IndexNow

[Bing Webmaster Tools](https://www.bing.com/webmasters) est l'outil gratuit de Microsoft pour voir comment Bing explore ton site. Comme Copilot et, en partie, ChatGPT s'appuient sur Bing, ça vaut le coup. Tu peux y importer ton site en quelques clics depuis la Google Search Console, l'outil équivalent chez Google.

IndexNow est un système ouvert et gratuit qui prévient tout de suite certains moteurs, dont Bing, qu'une page a été ajoutée ou modifiée. Pour Google, passe par la Search Console et ton sitemap, la liste des pages de ton site.

## Comment savoir si les IA recommandent ton entreprise ?

La méthode la plus simple, et gratuite, consiste à poser toi-même les questions de tes clients, régulièrement. Note 5 à 10 questions qu'on te pose vraiment, et teste-les une fois par mois dans ChatGPT, Perplexity, Gemini et Copilot. Un tableau suffit, comme cette grille d'exemple (fictive) :

| Question testée | Assistant | Entreprise citée ? | Sources affichées | À corriger |
|---|---|---|---|---|
| Quel plombier à Castelnau-le-Lez pour une fuite urgente ? | ChatGPT | Non | Un annuaire, le site d'un concurrent | Fiche Google incomplète |
| Boulangerie ouverte le dimanche à Sète ? | Perplexity | Oui | Fiche Google, site | Horaires d'été absents |

Côté statistiques, regarde dans ton outil de mesure d'audience (Google Analytics, Matomo, Plausible…) les visites venues de chatgpt.com, perplexity.ai, gemini.google.com ou copilot.microsoft.com. Une partie de ce trafic arrive sans provenance identifiable, notamment depuis les applis : c'est un indicateur, pas un compteur exact. Et le réflexe le plus simple : demande à chaque nouveau client comment il t'a trouvé.

## Ce qu'il ne faut pas faire

- Croire aux promesses de « recommandation garantie » : personne ne contrôle les réponses d'un assistant.
- Cacher du texte destiné aux robots et invisible pour tes visiteurs : c'est contraire aux règles des moteurs et ça peut se retourner contre toi.
- Publier en masse des pages générées automatiquement sans relecture, ou des pages par ville toutes identiques.
- Acheter des avis ou en écrire de faux.
- Laisser traîner des infos contradictoires : ancienne adresse, ancien numéro, anciens tarifs.
- Bloquer les robots d'IA sans le savoir, à cause d'un réglage de sécurité par défaut.

## Comment BabTech intègre le GEO dans chaque projet

Chez BabTech, le GEO n'est pas une option ajoutée à la fin : je l'intègre dans chaque projet, dès la conception. Concrètement :

- des données structurées Schema.org adaptées à ton activité ;
- un fichier llms.txt qui présente ton entreprise ;
- des contenus factuels qui répondent d'abord aux questions de tes clients ;
- des robots d'IA autorisés à explorer ton site.

Ça vaut pour tous les projets, y compris ceux de visibilité, qui démarrent à partir de 800 €. Le détail est sur la page [référencement local et GEO](/services/referencement-local-geo). Et si tu te demandes ce que coûte un site complet, j'ai détaillé les [prix d'un site internet pour une TPE](/blog/prix-site-internet-tpe-montpellier).

J'ai été chef d'entreprise dans le BTP pendant 14 ans : je sais qu'un patron n'a pas le temps de suivre chaque nouveauté technique. C'est justement mon travail de le faire pour toi.

## En résumé

- Le GEO aide les assistants IA à trouver, comprendre et citer ton entreprise, et il s'appuie sur un bon SEO.
- Autorise les robots d'IA, ajoute des données structurées et un llms.txt, publie des réponses factuelles et datées.
- Garde la même identité partout, collecte de vrais avis et fais-toi citer par des sources locales.
- Mesure en testant chaque mois les questions de tes clients dans les assistants.

Tu veux savoir ce que ChatGPT ou Perplexity répondent aujourd'hui quand on cherche ton métier dans ta ville ? [Réserve un premier appel gratuit de 30 minutes](/contact) et on regarde ça ensemble. Et si tu veux apprendre à te servir de l'IA avec d'autres entrepreneurs de Montpellier, rejoins la liste d'attente de la [communauté BabTech](/communaute) : ateliers, cercles et rencontres autour du digital et de l'IA.
