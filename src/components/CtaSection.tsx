import Link from 'next/link'
import { formatPhone, site, telLink } from '@/lib/site'
import { fr } from '@/lib/typography'
import { Icon } from './Icon'

type Props = {
  title?: string
  text?: string
}

export function CtaSection({
  title = 'Un projet ? Une idée ? Parlons-en.',
  text = "Pas de jargon, pas d'engagement. Un premier échange de 30 minutes, gratuit, pour voir ce qu'on peut faire ensemble.",
}: Props) {
  return (
    <section className="relative overflow-hidden border-t border-bord py-20 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-160px] left-1/2 h-[420px] w-[860px] -translate-x-1/2"
        style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)' }}
      />
      <div className="container-b relative text-center">
        <h2 className="section-title mx-auto mb-4 max-w-[720px]">{fr(title)}</h2>
        <p className="mx-auto mb-9 max-w-[600px] text-[17px] leading-relaxed text-txt-secondary">{fr(text)}</p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Link href={site.bookingPath} className="btn-primary" data-track="rendez-vous">
            <Icon name="calendar" className="h-[18px] w-[18px]" />
            Réserver un appel gratuit
          </Link>
          <Link href="/contact" className="btn-secondary">
            Écrire un message
          </Link>
        </div>
        {site.phone && (
          <p className="mt-5 text-[15px] text-txt-secondary">
            Ou appelle directement le{' '}
            <a href={telLink()} className="font-semibold whitespace-nowrap text-white hover:text-emerald-b" data-track="phone">
              {formatPhone()}
            </a>
          </p>
        )}
        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-txt-muted">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="clock" className="h-4 w-4 text-emerald-b" /> Réponse sous 24 h
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="check" className="h-4 w-4 text-emerald-b" /> Devis gratuit
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="map-pin" className="h-4 w-4 text-emerald-b" /> Hérault & Gard
          </span>
        </p>
      </div>
    </section>
  )
}
