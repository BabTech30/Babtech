import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site babtech.fr — éditeur, hébergement, propriété intellectuelle.',
}

export default function MentionsLegales() {
  return (
    <article className="py-24 md:py-28">
      <div className="max-w-[780px] mx-auto px-7">
        <span className="section-tag text-bronze">Page légale</span>
        <h1 className="font-outfit text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">Mentions légales</h1>
        <p className="text-sm text-txt-muted italic mb-12">Dernière mise à jour : <span className="px-2.5 py-0.5 bg-bronze/10 border border-dashed border-bronze/30 rounded-md text-bronze text-xs font-medium not-italic">date de mise en ligne</span></p>
        <div className="space-y-10">
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">1. Éditeur du site</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8] mb-3">Le site babtech.fr est édité par :</p>
            <p className="text-[15px] text-txt-secondary leading-[1.8]">
              <strong className="text-txt-primary font-medium">Bastien</strong> <span className="px-2.5 py-0.5 bg-bronze/10 border border-dashed border-bronze/30 rounded-md text-bronze text-xs font-medium">NOM DE FAMILLE</span><br />
              Statut : <span className="px-2.5 py-0.5 bg-bronze/10 border border-dashed border-bronze/30 rounded-md text-bronze text-xs font-medium">statut juridique</span><br />
              SIRET : <span className="px-2.5 py-0.5 bg-bronze/10 border border-dashed border-bronze/30 rounded-md text-bronze text-xs font-medium">numéro SIRET</span><br />
              TVA intracommunautaire : <span className="px-2.5 py-0.5 bg-bronze/10 border border-dashed border-bronze/30 rounded-md text-bronze text-xs font-medium">numéro de TVA</span><br />
              Adresse : <span className="px-2.5 py-0.5 bg-bronze/10 border border-dashed border-bronze/30 rounded-md text-bronze text-xs font-medium">adresse professionnelle</span><br />
              Email : babtech@gmail.com<br />
              Téléphone : sur demande
            </p>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">2. Directeur de la publication</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8]"><strong className="text-txt-primary font-medium">Bastien</strong> <span className="px-2.5 py-0.5 bg-bronze/10 border border-dashed border-bronze/30 rounded-md text-bronze text-xs font-medium">NOM DE FAMILLE</span>, en qualité de dirigeant.</p>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">3. Hébergement</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8]"><strong className="text-txt-primary font-medium">Netlify, Inc.</strong><br />512 2nd Street, Suite 200, San Francisco, CA 94107, USA<br />Site web : netlify.com</p>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">4. Propriété intellectuelle</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8]">L&apos;ensemble du contenu du site babtech.fr (textes, images, graphismes, logo, icônes, structure) est la propriété exclusive de BabTech, sauf mention contraire. Toute reproduction, totale ou partielle, est interdite sans autorisation écrite préalable.</p>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">5. Responsabilité</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8]">BabTech s&apos;efforce de fournir des informations aussi précises que possible. Toutefois, BabTech ne pourra être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour des informations.</p>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">6. Liens hypertextes</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8]">Le site peut contenir des liens vers d&apos;autres sites. BabTech décline toute responsabilité quant à leur contenu.</p>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">7. Droit applicable</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8]">Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
          </section>
        </div>
      </div>
    </article>
  )
}
