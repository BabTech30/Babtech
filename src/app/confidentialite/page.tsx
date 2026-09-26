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
          <strong>{site.founder.name}</strong> ({site.name}, {site.legal.status.toLowerCase()}) — {mail}
        </p>

        <h2>2. Données collectées</h2>
        <ul>
          <li>
            <strong>Formulaire de contact&nbsp;:</strong> nom, entreprise ou activité, email, téléphone (facultatif), ville, budget envisagé, type de
            besoin et message.
          </li>
          <li>
            <strong>Inscription à la communauté&nbsp;:</strong> prénom, email, activité, ville, thèmes et formats souhaités, niveau, message
            (facultatif) et consentement.
          </li>
          <li>
            <strong>Prise de rendez-vous&nbsp;:</strong> les informations saisies sur le service Calendly lorsque tu réserves un créneau.
          </li>
          <li>
            <strong>Navigation&nbsp;:</strong> le site ne dépose aucun cookie publicitaire ni traceur. Si une mesure d&apos;audience est activée,
            elle utilise un outil sans cookie (Plausible ou Umami) qui produit des statistiques agrégées et anonymes. L&apos;hébergeur conserve
            des journaux techniques (adresse IP, navigateur) pour assurer la sécurité du service.
          </li>
        </ul>

        <h2>3. Finalités et bases légales</h2>
        <ul>
          <li>Répondre à tes demandes et établir un devis&nbsp;: mesures précontractuelles et intérêt légitime.</li>
          <li>Te tenir informé(e) du lancement de la communauté et organiser les ateliers&nbsp;: consentement, retirable à tout moment.</li>
          <li>Mesurer la fréquentation de façon anonyme et sécuriser le site&nbsp;: intérêt légitime.</li>
        </ul>
        <p>
          Tes données ne sont <strong>jamais vendues</strong> ni cédées à des tiers à des fins commerciales.
        </p>

        <h2>4. Destinataires et sous-traitants</h2>
        <p>Les données sont destinées uniquement à {site.name}. Elles transitent par des prestataires techniques&nbsp;:</p>
        <ul>
          <li>Formspree (réception des formulaires)&nbsp;;</li>
          <li>Calendly (prise de rendez-vous)&nbsp;;</li>
          <li>Netlify (hébergement du site)&nbsp;;</li>
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
          <li>Liste de la communauté&nbsp;: jusqu&apos;à ta désinscription, et au plus 3 ans après ton dernier échange.</li>
          <li>Statistiques de fréquentation&nbsp;: données anonymes et agrégées.</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>
          Le site fonctionne sans cookie de mesure ni cookie publicitaire&nbsp;: aucun bandeau de consentement n&apos;est donc nécessaire. Les
          services tiers ouverts depuis le site (Calendly, par exemple) appliquent leur propre politique lorsque tu les utilises.
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
