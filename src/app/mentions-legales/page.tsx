import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { LegalPage } from '@/components/LegalPage'
import { graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { formatPhone, site } from '@/lib/site'

const title = 'Mentions légales'
const description = 'Mentions légales du site BabTech : éditeur, directeur de la publication, hébergement, propriété intellectuelle.'

export const metadata: Metadata = pageMetadata({ title, description, path: '/mentions-legales' })

const pending = 'en cours de mise à jour'

export default function MentionsLegales() {
  const { legal } = site
  return (
    <>
      <JsonLd data={graph(webPageNode({ path: '/mentions-legales', name: title, description }))} />
      <LegalPage title={title} path="/mentions-legales" updatedAt={legal.updatedAt}>
        <h2>1. Éditeur du site</h2>
        <p>
          Le site {site.url.replace(/^https?:\/\//, '')} est édité par <strong>{site.founder.name}</strong>, entrepreneur individuel (EI), exerçant
          sous le nom commercial <strong>{site.name}</strong>.
        </p>
        <ul>
          <li>Statut&nbsp;: {legal.status}</li>
          <li>SIRET&nbsp;: {legal.siret || pending}</li>
          {legal.vatNumber && <li>TVA intracommunautaire&nbsp;: {legal.vatNumber}</li>}
          <li>Adresse&nbsp;: {legal.postalAddress || `${site.address.locality} (${site.address.department}) — adresse complète ${pending}`}</li>
          <li>
            Email&nbsp;: <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>Téléphone&nbsp;: {site.phone ? formatPhone() : 'communiqué sur demande par email'}</li>
        </ul>

        <h2>2. Directeur de la publication</h2>
        <p>
          <strong>{site.founder.name}</strong>, en qualité d&apos;entrepreneur individuel.
        </p>

        <h2>3. Hébergement</h2>
        <p>
          <strong>{legal.host.name}</strong>
          <br />
          {legal.host.address}
          <br />
          <a href={legal.host.url} target="_blank" rel="noopener noreferrer">
            {legal.host.url.replace(/^https?:\/\//, '')}
          </a>
        </p>

        <h2>4. Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus du site (textes, graphismes, logo, icônes, structure, articles) est la propriété de {site.name}, sauf
          mention contraire. Toute reproduction, totale ou partielle, est interdite sans autorisation écrite préalable. Les courtes citations
          sont autorisées à condition de mentionner la source et de renvoyer vers la page d&apos;origine.
        </p>

        <h2>5. Responsabilité</h2>
        <p>
          {site.name} s&apos;efforce de fournir des informations aussi précises que possible. Les tarifs indiqués sont des prix « à partir de »,
          donnés à titre indicatif&nbsp;: seul un devis signé engage les parties. {site.name} ne pourra être tenu responsable des omissions,
          inexactitudes ou carences dans la mise à jour des informations.
        </p>

        <h2>6. Liens hypertextes</h2>
        <p>
          Le site peut contenir des liens vers d&apos;autres sites. {site.name} n&apos;exerce aucun contrôle sur leur contenu et décline toute
          responsabilité à leur sujet.
        </p>

        <h2>7. Données personnelles</h2>
        <p>
          Le traitement des données personnelles collectées sur le site est détaillé dans la{' '}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>

        <h2>8. Droit applicable</h2>
        <p>Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français sont seuls compétents.</p>
      </LegalPage>
    </>
  )
}
