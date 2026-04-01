import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Parlons de ton projet',
  description: 'Envoie-moi un message ou prends rendez-vous. Réponse sous 24h. Freelance digital disponible 100% en remote.',
}

export default function Contact() {
  return (
    <>
      <section className="pt-24 md:pt-28 pb-16 relative">
        <div className="absolute -top-16 -right-48 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="container-b">
          <div className="max-w-[680px] relative">
            <span className="section-tag text-emerald-b">Contact</span>
            <h1 className="font-outfit text-4xl md:text-5xl font-bold text-white leading-[1.12] tracking-tight mb-5">
              Parlons de ton projet.
            </h1>
            <p className="text-lg text-txt-secondary leading-relaxed">
              Un message, un appel, un café virtuel — choisis ce qui te convient. Je réponds sous 24h.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-b">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
            <div className="bg-white/[0.03] border border-bord rounded-[20px] p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-b to-bronze" />
              <h2 className="font-outfit text-[22px] font-semibold text-white tracking-tight mb-2">Envoie-moi un message</h2>
              <p className="text-sm text-txt-secondary mb-8">Décris ton besoin en quelques mots — je reviens vers toi rapidement.</p>
              <form action="https://formspree.io/f/VOTRE_ID" method="POST" className="space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-txt-secondary mb-2 tracking-wide">Nom</label>
                  <input type="text" name="name" required placeholder="Ton nom ou celui de ta boîte"
                    className="w-full px-4 py-3.5 bg-white/[0.04] border border-bord rounded-[10px] text-txt-primary text-[15px] font-dm outline-none transition-all focus:border-emerald-b/40 focus:bg-white/[0.06] placeholder:text-txt-muted" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-txt-secondary mb-2 tracking-wide">Email</label>
                  <input type="email" name="email" required placeholder="ton@email.com"
                    className="w-full px-4 py-3.5 bg-white/[0.04] border border-bord rounded-[10px] text-txt-primary text-[15px] font-dm outline-none transition-all focus:border-emerald-b/40 focus:bg-white/[0.06] placeholder:text-txt-muted" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-txt-secondary mb-2 tracking-wide">Type de besoin</label>
                  <select name="type" required defaultValue=""
                    className="w-full px-4 py-3.5 bg-white/[0.04] border border-bord rounded-[10px] text-txt-primary text-[15px] font-dm outline-none transition-all focus:border-emerald-b/40 focus:bg-white/[0.06] appearance-none cursor-pointer">
                    <option value="" disabled className="bg-nuit-light text-txt-muted">Choisis une catégorie</option>
                    <option value="visibilite" className="bg-nuit-light">Visibilité — Site, Google, SEO, réseaux</option>
                    <option value="outils" className="bg-nuit-light">Outils Métier — PWA, dashboard, app</option>
                    <option value="ia" className="bg-nuit-light">IA et Automatisation — Workflows, intégrations</option>
                    <option value="autre" className="bg-nuit-light">Autre / Je ne sais pas encore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-txt-secondary mb-2 tracking-wide">Message</label>
                  <textarea name="message" required rows={5} placeholder="Dis-moi en quelques lignes ce que tu as en tête."
                    className="w-full px-4 py-3.5 bg-white/[0.04] border border-bord rounded-[10px] text-txt-primary text-[15px] font-dm outline-none transition-all focus:border-emerald-b/40 focus:bg-white/[0.06] placeholder:text-txt-muted resize-y min-h-[120px]" />
                </div>
                <button type="submit" className="w-full py-4 rounded-[10px] bg-emerald-b text-[#0a1a10] font-semibold text-[15px] font-dm transition-all hover:brightness-110 hover:-translate-y-0.5 mt-2 cursor-pointer">
                  Envoyer →
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-5">
              <div className="bg-white/[0.03] border border-bord rounded-2xl p-7">
                <p className="font-outfit text-sm font-semibold tracking-[2px] uppercase text-txt-muted mb-5">Coordonnées</p>
                <div className="space-y-5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-[10px] bg-emerald-b/[0.12] flex items-center justify-center text-lg shrink-0">✉</div>
                    <div>
                      <span className="text-xs text-txt-muted tracking-wide">Email</span>
                      <a href="mailto:babtech@gmail.com" className="block text-[15px] text-emerald-b font-medium hover:underline">babtech@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-[10px] bg-bronze/10 flex items-center justify-center text-lg shrink-0">☎</div>
                    <div>
                      <span className="text-xs text-txt-muted tracking-wide">Téléphone</span>
                      <span className="block text-[15px] text-txt-primary font-medium">Sur demande</span>
                      <span className="text-xs text-txt-muted italic">Communiqué après un premier échange</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-[10px] bg-emerald-b/[0.12] flex items-center justify-center text-lg shrink-0">◎</div>
                    <div>
                      <span className="text-xs text-txt-muted tracking-wide">Disponibilité</span>
                      <span className="block text-[15px] text-txt-primary font-medium">100% remote</span>
                      <span className="text-xs text-txt-muted italic">Je travaille avec des clients partout en France</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-bord rounded-2xl p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-bronze" />
                <p className="font-outfit text-sm font-semibold tracking-[2px] uppercase text-txt-muted mb-5">Prendre rendez-vous</p>
                <div className="border border-dashed border-white/10 rounded-xl p-8 text-center bg-white/[0.015]">
                  <div className="w-12 h-12 rounded-xl bg-bronze/10 flex items-center justify-center text-[22px] mx-auto mb-4">📅</div>
                  <h3 className="font-outfit text-[17px] font-semibold text-white mb-2">Réserve un créneau</h3>
                  <p className="text-sm text-txt-secondary leading-relaxed mb-5">30 minutes pour parler de ton projet. Sans engagement, sans jargon.</p>
                  <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] bg-bronze text-[#1a1207] font-semibold text-sm font-dm transition-all hover:brightness-110 hover:-translate-y-0.5">
                    Choisir un créneau →
                  </a>
                  <p className="text-xs text-txt-muted italic mt-3">Lien Calendly à intégrer</p>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-bord rounded-2xl p-5 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-b/[0.12] border border-emerald-b/20 mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-b animate-pulse" />
                  <span className="text-[13px] font-medium text-emerald-b">Disponible pour de nouveaux projets</span>
                </div>
                <p className="text-[13px] text-txt-muted">Réponse sous 24h en moyenne</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
