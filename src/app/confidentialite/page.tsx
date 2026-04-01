import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité du site babtech.fr — données collectées, finalités, droits RGPD.',
}

export default function Confidentialite() {
  return (
    <article className="py-24 md:py-28">
      <div className="max-w-[780px] mx-auto px-7">
        <span className="section-tag text-emerald-b">Page légale</span>
        <h1 className="font-outfit text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">Politique de confidentialité</h1>
        <p className="text-sm text-txt-muted italic mb-12">Dernière mise à jour : <span className="px-2.5 py-0.5 bg-bronze/10 border border-dashed border-bronze/30 rounded-md text-bronze text-xs font-medium not-italic">date de mise en ligne</span></p>
        <div className="space-y-10">
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">1. Responsable du traitement</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8]"><strong className="text-txt-primary font-medium">Bastien</strong> <span className="px-2.5 py-0.5 bg-bronze/10 border border-dashed border-bronze/30 rounded-md text-bronze text-xs font-medium">NOM DE FAMILLE</span><br />Email : babtech@gmail.com</p>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">2. Données collectées</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8] mb-3">BabTech est susceptible de collecter :</p>
            <ul className="space-y-1.5 text-[15px] text-txt-secondary leading-[1.8]">
              <li className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-txt-muted"><strong className="text-txt-primary font-medium">Formulaire de contact :</strong> nom, email, type de besoin, message</li>
              <li className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-txt-muted"><strong className="text-txt-primary font-medium">Notification app.babtech.fr :</strong> adresse email</li>
              <li className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-txt-muted"><strong className="text-txt-primary font-medium">Navigation :</strong> données anonymes via Google Analytics</li>
            </ul>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">3. Finalités</h2>
            <ul className="space-y-1.5 text-[15px] text-txt-secondary leading-[1.8]">
              <li className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-txt-muted">Répondre aux demandes de contact</li>
              <li className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-txt-muted">Notifier du lancement de l&apos;espace client</li>
              <li className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-txt-muted">Analyser la fréquentation du site</li>
            </ul>
            <p className="text-[15px] text-txt-secondary leading-[1.8] mt-3">Les données ne sont <strong className="text-txt-primary font-medium">jamais vendues ni transmises à des tiers</strong> à des fins commerciales.</p>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">4. Base légale</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8]"><strong className="text-txt-primary font-medium">Consentement</strong> (formulaires) et <strong className="text-txt-primary font-medium">intérêt légitime</strong> (analyse de fréquentation).</p>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">5. Durée de conservation</h2>
            <ul className="space-y-1.5 text-[15px] text-txt-secondary leading-[1.8]">
              <li className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-txt-muted"><strong className="text-txt-primary font-medium">Données de contact :</strong> 12 mois après le dernier échange</li>
              <li className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-txt-muted"><strong className="text-txt-primary font-medium">Emails de notification :</strong> jusqu&apos;au lancement de l&apos;espace client</li>
              <li className="pl-5 relative before:content-['→'] before:absolute before:left-0 before:text-txt-muted"><strong className="text-txt-primary font-medium">Données Analytics :</strong> anonymisées, conservées 14 mois</li>
            </ul>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">6. Cookies</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8]">Le site utilise Google Analytics 4 (cookies _ga, _ga_*) pour mesurer la fréquentation de manière anonyme. Aucun cookie publicitaire. Tu peux refuser les cookies via le bandeau ou les paramètres de ton navigateur.</p>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">7. Tes droits (RGPD)</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8] mb-3">Tu disposes des droits d&apos;accès, de rectification, de suppression, d&apos;opposition et de portabilité.</p>
            <p className="text-[15px] text-txt-secondary leading-[1.8]">Pour les exercer : <strong className="text-txt-primary font-medium">babtech@gmail.com</strong></p>
            <p className="text-[15px] text-txt-secondary leading-[1.8]">Réclamation : <strong className="text-txt-primary font-medium">cnil.fr</strong></p>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">8. Sécurité</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8]">Le site est servi en HTTPS. BabTech met en œuvre les mesures techniques appropriées pour protéger les données personnelles.</p>
          </section>
          <section>
            <h2 className="font-outfit text-lg font-semibold text-txt-primary mb-4 pb-2.5 border-b border-bord">9. Modifications</h2>
            <p className="text-[15px] text-txt-secondary leading-[1.8]">BabTech se réserve le droit de modifier cette politique à tout moment. La date de mise à jour est indiquée en haut de cette page.</p>
          </section>
        </div>
      </div>
    </article>
  )
}
