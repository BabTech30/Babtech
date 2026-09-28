import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { LegalPage } from '@/components/LegalPage'
import { graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

const title = 'Politique de confidentialité'
const description =
  'Politique de confidentialité de BabTech : données collectées, finalités, durées de conservation, sous-traitants et droits RGPD.'

export const metadata: Metadata = pageMetadata({ title, description, path: '/confidentialite' })

export default function Confidentialite() {
  const mail = <a href={`mailto:${site.email}`}>{site.email}</a>
  return (
    <>
      <JsonLd data={graph(webPageNode({ path: '/confidentialite', name: title, description }))} />
      <LegalPage title={title} path="/confidentialite" updatedAt={site.legal.updatedAt}>
        <h2>1. Responsable du traitement</h2>
        <p>
          <strong>{site.founder.name}</strong> ({site.name}, {site.legal.status.toLowerCase()}), {site.legal.postalAddress} — {mail}
        </p>

        <h2>2. Données collectées</h2>
        <ul>
          <li>
            <strong>Formulaire de contact&nbsp;:</strong> nom, entreprise ou activité, email, téléphone (facultatif), ville, budget envisagé, type de
            besoin et message. Avec l&apos;assistant IA&nbsp;: nom, email, téléphone (facultatif), description de ton projet, synthèse proposée par
            l&apos;assistant et tes précisions. Ta demande est enregistrée sur le serveur du site et m&apos;est transmise par email et par une
            notification sur mes appareils&nbsp;; tu reçois un accusé de réception envoyé depuis {site.email}.
          </li>
          <li>
            <strong>Assistant IA de la page Contact&nbsp;:</strong> si tu lances l&apos;assistant, le texte qui décrit ton projet est transmis à
            Anthropic, qui fournit l&apos;IA Claude, pour générer la réponse affichée à l&apos;écran. Ce texte n&apos;est pas enregistré sur le
            site et ne m&apos;est transmis que si tu envoies ensuite ta demande. Anthropic ne l&apos;utilise pas pour entraîner ses modèles.
          </li>
          <li>
            <strong>Compte membre et forum de la communauté&nbsp;:</strong> prénom, nom, email, mot de passe (enregistré seulement sous forme
            chiffrée irréversible), activité et ville (facultatives), date d&apos;inscription et de dernière connexion, préférence de
            notification, ainsi que tes sujets, tes réponses et tes signalements. Sur le forum, seuls ton prénom, l&apos;initiale de ton nom,
            ton activité et ta ville s&apos;affichent avec tes messages, qui sont publics&nbsp;; ton email n&apos;est jamais affiché. Un cookie
            de session garde ta connexion pendant 30 jours au plus.
          </li>
          <li>
            <strong>Liste de la communauté (avant l&apos;ouverture du forum)&nbsp;:</strong> prénom, email, activité, ville, thèmes et formats
            souhaités, niveau, message (facultatif) et consentement, enregistrés sur le serveur du site et transmis par email&nbsp;; tu reçois
            un email de bienvenue.
          </li>
          <li>
            <strong>Prise de rendez-vous&nbsp;:</strong> nom, email, téléphone (obligatoire pour un rendez-vous par téléphone), entreprise
            (facultatif), sujet, message (facultatif), ainsi que la date et le mode du rendez-vous choisis. Ces informations sont
            enregistrées sur le serveur du site et me sont transmises par email et par une notification sur mes appareils&nbsp;; tu reçois
            une confirmation par email, et un email si je dois annuler.
          </li>
          <li>
            <strong>Vidéos YouTube&nbsp;:</strong> sur certaines pages, une vidéo YouTube ne se charge que si tu cliques pour la lancer.
            YouTube (Google) reçoit alors ton adresse IP et peut déposer des cookies, selon sa propre politique de confidentialité.
            Avant ton clic, la page ne contacte pas YouTube.
          </li>
          <li>
            <strong>QR codes&nbsp;:</strong> les QR codes de {site.name} passent par une adresse courte ({new URL(site.url).host}/q/…) qui compte le
            nombre de scans par mois, sans rien enregistrer sur la personne qui scanne.
          </li>
          <li>
            <strong>Navigation&nbsp;:</strong> le site ne dépose aucun cookie publicitaire ni traceur. Si une mesure d&apos;audience est activée,
            elle utilise un outil sans cookie (Plausible ou Umami) qui produit des statistiques agrégées et anonymes. L&apos;hébergeur conserve
            des journaux techniques (adresse IP, navigateur) pour assurer la sécurité du service.
          </li>
        </ul>

        <h2>3. Finalités et bases légales</h2>
        <ul>
          <li>Répondre à tes demandes, organiser les rendez-vous que tu réserves et établir un devis&nbsp;: mesures précontractuelles et intérêt légitime.</li>
          <li>Te proposer une première piste avec l&apos;assistant IA, quand tu le lances&nbsp;: mesures précontractuelles prises à ta demande.</li>
          <li>Te tenir informé(e) du lancement de la communauté et organiser les ateliers&nbsp;: consentement, retirable à tout moment.</li>
          <li>
            Gérer ton compte membre, publier tes messages sur le forum et te prévenir des réponses&nbsp;: exécution des conditions
            d&apos;utilisation (la <a href="/communaute/charte/">charte de la communauté</a>) que tu acceptes en créant ton compte.
          </li>
          <li>Modérer le forum et prévenir les abus (limites d&apos;envoi, signalements)&nbsp;: intérêt légitime.</li>
          <li>Mesurer la fréquentation de façon anonyme et sécuriser le site&nbsp;: intérêt légitime.</li>
        </ul>
        <p>
          Tes données ne sont <strong>jamais vendues</strong> ni cédées à des tiers à des fins commerciales.
        </p>

        <h2>4. Destinataires et sous-traitants</h2>
        <p>Les données sont destinées uniquement à {site.name}. Elles transitent par des prestataires techniques&nbsp;:</p>
        <ul>
          <li>
            {site.legal.host.name} (hébergement du site, des demandes, des rendez-vous, des comptes et du forum de la communauté, et messagerie{' '}
            {site.email})&nbsp;;
          </li>
          <li>Anthropic (IA Claude de l&apos;assistant de la page Contact), seulement si tu lances l&apos;assistant&nbsp;;</li>
          <li>
            les services de notification d&apos;Apple, de Google ou de Mozilla, qui acheminent jusqu&apos;à mes appareils les alertes de
            demandes et de rendez-vous sous forme chiffrée, sans pouvoir les lire&nbsp;;
          </li>
          <li>l&apos;agenda que j&apos;utilise (Apple Calendrier ou Google Agenda, par exemple), où j&apos;inscris les rendez-vous&nbsp;;</li>
          <li>YouTube (Google), seulement si tu lances une vidéo&nbsp;;</li>
          <li>le cas échéant, l&apos;outil de mesure d&apos;audience sans cookie.</li>
        </ul>
        <p>
          Certains de ces prestataires sont situés hors de l&apos;Union européenne, notamment aux États-Unis. Ces transferts sont encadrés par
          les garanties prévues par le RGPD (clauses contractuelles types de la Commission européenne ou adhésion du prestataire au Data
          Privacy Framework UE–États-Unis).
        </p>

        <h2>5. Durées de conservation</h2>
        <ul>
          <li>Demandes de contact&nbsp;: 12 mois après le dernier échange (hors relation commerciale, régie par les durées légales).</li>
          <li>Rendez-vous&nbsp;: effacés du serveur du site 12 mois après leur date.</li>
          <li>
            Texte analysé par l&apos;assistant IA&nbsp;: aucune conservation sur le site&nbsp;; Anthropic l&apos;efface de ses serveurs sous 30 jours,
            sauf obligation légale ou utilisation abusive de son service.
          </li>
          <li>Liste de la communauté&nbsp;: jusqu&apos;à ta désinscription, et au plus 3 ans après ton dernier échange.</li>
          <li>
            Compte membre&nbsp;: jusqu&apos;à sa suppression, que tu peux faire à tout moment depuis la page «&nbsp;Mon compte&nbsp;». Un compte
            jamais confirmé est effacé au bout de 7 jours. À la suppression, tes messages restent signés «&nbsp;Ancien membre&nbsp;», ou sont
            effacés si tu le choisis.
          </li>
          <li>Statistiques de fréquentation&nbsp;: données anonymes et agrégées.</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>
          Le site fonctionne sans cookie de mesure ni cookie publicitaire&nbsp;: aucun bandeau de consentement n&apos;est donc nécessaire. Seul
          un cookie de session, indispensable, est déposé quand tu te connectes à ton compte membre. Les
          services tiers vers lesquels le site renvoie appliquent leur propre politique lorsque tu les utilises. Les vidéos
          YouTube restent inactives tant que tu ne cliques pas dessus&nbsp;: lancer une vidéo vaut accord pour les cookies de YouTube.
        </p>

        <h2>7. Tes droits</h2>
        <p>
          Tu disposes d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition et de portabilité
          de tes données, ainsi que du droit de retirer ton consentement à tout moment. Pour les exercer, écris à {mail}. Tu peux aussi
          introduire une réclamation auprès de la CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            cnil.fr
          </a>
          ).
        </p>

        <h2>8. Sécurité</h2>
        <p>
          Le site est servi exclusivement en HTTPS. {site.name} met en œuvre des mesures techniques et organisationnelles adaptées pour
          protéger tes données.
        </p>

        <h2>9. Modifications</h2>
        <p>Cette politique peut évoluer. La date de dernière mise à jour figure en haut de cette page.</p>
      </LegalPage>
    </>
  )
}
