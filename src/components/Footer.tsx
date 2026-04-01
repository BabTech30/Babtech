import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-bord bg-nuit-light">
      <div className="container-b py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <Link href="/" className="font-outfit font-bold text-[22px] text-white tracking-tight inline-block mb-3">
              Bab<span className="text-emerald-b">Tech</span>
            </Link>
            <p className="text-sm text-txt-muted leading-relaxed max-w-[260px]">
              Solutions digitales pour commerces et TPE. Basé près de Montpellier, disponible partout.
            </p>
          </div>
          <div>
            <h4 className="font-outfit text-[13px] font-semibold tracking-[1.5px] uppercase text-txt-secondary mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {['/', '/services', '/portfolio', '/a-propos', '/contact'].map((href, i) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-txt-muted hover:text-txt-secondary transition-colors">
                    {['Accueil', 'Services', 'Portfolio', 'À propos', 'Contact'][i]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-outfit text-[13px] font-semibold tracking-[1.5px] uppercase text-txt-secondary mb-4">Légal</h4>
            <ul className="space-y-2.5">
              <li><Link href="/faq" className="text-sm text-txt-muted hover:text-txt-secondary transition-colors">FAQ</Link></li>
              <li><Link href="/mentions-legales" className="text-sm text-txt-muted hover:text-txt-secondary transition-colors">Mentions légales</Link></li>
              <li><Link href="/confidentialite" className="text-sm text-txt-muted hover:text-txt-secondary transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-bord gap-3">
          <span className="text-[13px] text-txt-muted">© 2026 BabTech. Tous droits réservés.</span>
          <span className="text-sm text-txt-muted tracking-wide">Créé avec <span className="text-bronze text-[15px]">♥</span> IAmour</span>
        </div>
      </div>
    </footer>
  )
}
