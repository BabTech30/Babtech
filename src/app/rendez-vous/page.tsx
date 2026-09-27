import type { Metadata } from 'next'
import { BookingWidget } from '@/components/booking/BookingWidget'
import { Icon, type IconName } from '@/components/Icon'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { graph, ids, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { formatPhone, site, telLink } from '@/lib/site'
import { fr } from '@/lib/typography'

const title = 'Prendre rendez-vous : appel découverte gratuit de 30 minutes'
const description =
  "Réserve un appel découverte gratuit avec Bastien Ferrer (BabTech), par téléphone ou en visio : choisis ton créneau, la confirmation est immédiate."

export const metadata: Metadata = pageMetadata({ title, description, path: '/rendez-vous', og: 'rendez-vous' })

const steps: { icon: IconName; title: string; text: string }[] = [
  { icon: 'calendar', title: 'Tu choisis ton créneau', text: 'Par téléphone ou en visio, au moment qui te convient. La confirmation est immédiate.' },
  { icon: 'message', title: 'On parle de ton activité', text: "30 minutes pour comprendre où tu en es, ce qui te freine et ce que tu veux obtenir. Sans jargon." },
  { icon: 'check', title: 'Tu repars avec une piste claire', text: "Une première recommandation et, si tu le souhaites, un devis détaillé. Sans engagement." },
]

export default function RendezVous() {
  return (
    <>
      <JsonLd
        data={graph(
          webPageNode({
            path: '/rendez-vous',
            name: title,
            description,
            og: 'rendez-vous',
            about: { '@id': ids.organization },
          }),
        )}
      />

      <PageHero
        eyebrow="Rendez-vous"
        title="Réserve ton appel découverte."
        lead="30 minutes, gratuites et sans engagement, pour parler de ton projet par téléphone ou en visio. Choisis ton créneau : c'est confirmé tout de suite."
        crumbs={[{ name: 'Rendez-vous', path: '/rendez-vous' }]}
      />

      <section className="border-t border-bord pb-20 pt-12 md:pt-16">
        <div className="container-b grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="card relative overflow-hidden p-6 sm:p-8 md:p-10">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-emerald-b to-bronze" />
            <h2 className="sr-only">Choisir un créneau</h2>
            <BookingWidget contact={{ name: site.founder.name, email: site.email, phone: formatPhone(), phoneHref: telLink() }} />
          </div>

          <aside className="grid gap-5" aria-labelledby="deroulement">
            <div className="card p-7">
              <h2 id="deroulement" className="mb-5 font-outfit text-lg font-semibold text-white">
                Comment ça se passe
              </h2>
              <ol className="grid gap-5">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-b/[0.12] text-emerald-b">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-white">
                        {i + 1}. {s.title}
                      </span>
                      <span className="block text-sm leading-relaxed text-txt-secondary">{fr(s.text)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card p-7">
              <h2 className="mb-3 font-outfit text-lg font-semibold text-white">Pas de créneau qui te va&nbsp;?</h2>
              <p className="mb-4 text-sm leading-relaxed text-txt-secondary">Appelle-moi ou écris-moi, on trouve un moment ensemble.</p>
              <p className="grid gap-2 text-[15px]">
                <a href={telLink()} className="inline-flex items-center gap-2 font-medium text-white hover:text-emerald-b" data-track="phone">
                  <Icon name="phone" className="h-4 w-4 text-emerald-b" /> {formatPhone()}
                </a>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 font-medium text-white hover:text-emerald-b" data-track="email">
                  <Icon name="mail" className="h-4 w-4 text-emerald-b" /> {site.email}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
