import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { LegalPage } from '@/components/LegalPage'
import { NEW_ACCOUNT_DAYS, NEW_ACCOUNT_MAX_LINKS } from '@/data/forum'
import { graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const title = 'Charte de la communauté'
const description =
  "Les règles du forum de la communauté BabTech : entraide concrète et bienveillante, ce qui est accepté ou non, modération, compte et données personnelles."
const path = '/communaute/charte'
const updatedAt = '28 septembre 2026'

export const metadata: Metadata = pageMetadata({ title, description, path, og: 'communaute' })

export default function ChartePage() {
  const { legal } = site
  return (
    <>
      <JsonLd data={graph(webPageNode({ path, name: title, description, og: 'communaute' }))} />
      <LegalPage title={title} path={path} updatedAt={updatedAt}>
        <p>
          La communauté BabTech réunit des dirigeants de TPE, artisans, commerçants et indépendants qui veulent progresser sur le digital et
          l&apos;IA. Le forum sert à s&apos;entraider&nbsp;: poser une vraie question, partager ce qui marche, éviter aux autres les erreurs
          qu&apos;on a faites. En créant ton compte, tu acceptes cette charte.
        </p>

        <h2>1. Ce qui est bienvenu</h2>
        <ul>
          <li>Les questions concrètes, tirées de ton quotidien de chef d&apos;entreprise.</li>
          <li>Les retours d&apos;expérience, les outils testés, les méthodes qui t&apos;ont fait gagner du temps.</li>
          <li>Les réponses argumentées et bienveillantes, y compris pour dire qu&apos;une idée ne marche pas.</li>
          <li>La recherche d&apos;un partenaire ou d&apos;un prestataire, dans le thème «&nbsp;Entraide entre entrepreneurs&nbsp;».</li>
        </ul>

        <h2>2. Ce qui n&apos;a pas sa place</h2>
        <ul>
          <li>La publicité, le démarchage et les messages envoyés en série.</li>
          <li>Les propos insultants, discriminatoires, diffamatoires ou contraires à la loi.</li>
          <li>
            Les données personnelles d&apos;autres personnes (clients, salariés, fournisseurs)&nbsp;: noms, coordonnées, factures, captures
            d&apos;écran non anonymisées.
          </li>
          <li>Les contenus que tu n&apos;as pas le droit de diffuser (textes, images ou documents protégés, informations confidentielles).</li>
          <li>Les faux comptes, l&apos;usurpation d&apos;identité et les liens trompeurs.</li>
        </ul>

        <h2>3. Publication et modération</h2>
        <p>
          Tes messages sont publiés tout de suite et lisibles par tous, y compris par les moteurs de recherche et les assistants IA. Le forum est
          modéré par {site.founder.name} ({site.name})&nbsp;: un message contraire à cette charte peut être masqué ou supprimé, et un compte
          suspendu en cas de manquement grave ou répété. Si un message te semble poser problème, utilise le bouton «&nbsp;Signaler&nbsp;»&nbsp;: il
          est examiné rapidement.
        </p>
        <p>
          Pour limiter les abus, un compte de moins de {NEW_ACCOUNT_DAYS} jours peut mettre {NEW_ACCOUNT_MAX_LINKS} liens au plus par message, et le
          nombre de sujets et de réponses par jour est limité.
        </p>

        <h2>4. Ton compte et ce qui s&apos;affiche</h2>
        <ul>
          <li>Avec tes messages s&apos;affichent ton prénom, l&apos;initiale de ton nom, et ton activité et ta ville si tu les indiques.</li>
          <li>Ton adresse e-mail n&apos;est jamais affichée.</li>
          <li>
            Tu peux modifier tes messages et supprimer tes réponses à tout moment. Un sujet ne peut plus être supprimé une fois que d&apos;autres
            membres y ont répondu&nbsp;: écris à <a href={`mailto:${site.email}`}>{site.email}</a> si besoin.
          </li>
          <li>
            Tu peux supprimer ton compte depuis la page «&nbsp;Mon compte&nbsp;», une fois connecté&nbsp;: tes messages restent alors signés
            «&nbsp;Ancien membre&nbsp;», ou sont effacés si tu le choisis.
          </li>
        </ul>

        <h2>5. Responsabilité</h2>
        <p>
          Chaque membre est responsable de ce qu&apos;il publie. Les conseils partagés sur le forum n&apos;engagent que leurs auteurs&nbsp;: vérifie-les
          avant de les appliquer à ton entreprise, en particulier pour les questions juridiques, fiscales ou de sécurité. {site.name} héberge les
          messages des membres et retire promptement tout contenu manifestement illicite qui lui est signalé.
        </p>

        <h2>6. Données personnelles</h2>
        <p>
          Ce qui est enregistré, pourquoi, combien de temps et comment exercer tes droits&nbsp;: tout est détaillé dans la{' '}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>

        <h2>7. Éditeur et contact</h2>
        <p>
          Le forum est édité par <strong>{site.founder.name}</strong>, entrepreneur individuel (EI), nom commercial {site.name}, SIRET {legal.siret},{' '}
          {legal.postalAddress}. Contact&nbsp;: <a href={`mailto:${site.email}`}>{site.email}</a>. Voir aussi les{' '}
          <Link href="/mentions-legales">mentions légales</Link>.
        </p>

        <h2>8. Évolution de la charte</h2>
        <p>
          Cette charte peut évoluer avec la communauté. En cas de changement important, les membres sont prévenus par e-mail ou par un message sur
          le forum.
        </p>
      </LegalPage>
    </>
  )
}
