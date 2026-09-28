import Link from 'next/link'
import { Icon } from '@/components/Icon'

/** Affiché quand la base de données n'est pas encore branchée (ou ne répond pas) : le reste du site marche. */
export function ForumUnavailable() {
  return (
    <div className="card mx-auto max-w-[640px] p-8 text-center md:p-10">
      <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-bronze/[0.14] text-bronze">
        <Icon name="clock" className="h-6 w-6" />
      </span>
      <h2 className="mb-3 font-outfit text-2xl font-semibold text-white">Le forum ouvre très bientôt</h2>
      <p className="mb-7 leading-relaxed text-txt-secondary">
        L&apos;espace membres est en cours de mise en route. Laisse ton e-mail sur la liste de la communauté&nbsp;: tu seras prévenu dès
        l&apos;ouverture.
      </p>
      <Link href="/communaute/inscription/" className="btn-bronze">
        Être prévenu de l&apos;ouverture
        <Icon name="arrow-right" className="h-[18px] w-[18px]" />
      </Link>
    </div>
  )
}
