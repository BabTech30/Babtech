import Link from 'next/link'
import { logOut } from '@/app/communaute/compte-actions'
import { Icon } from '@/components/Icon'
import { displayName, type Member } from '@/lib/community/members'

/** Bandeau du forum : le membre connecté (compte, déconnexion) ou l'invitation à créer un compte. */
export function MemberBar({ member, next }: { member?: Member; next: string }) {
  return (
    <div className="border-y border-bord bg-nuit-light">
      <div className="container-b flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
        {member ? (
          <>
            <p className="flex items-center gap-2 text-txt-secondary">
              <Icon name="user" className="h-4 w-4 text-emerald-b" />
              Ton compte&nbsp;: <span className="font-medium text-white">{displayName(member)}</span>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/communaute/compte/" className="rounded-lg px-3 py-2 font-medium text-txt-primary hover:bg-white/[0.04] hover:text-white">
                Mon compte
              </Link>
              <form action={logOut}>
                <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] px-3 py-2 font-medium text-txt-primary hover:border-white/30 hover:text-white">
                  <Icon name="log-out" className="h-4 w-4" />
                  Se déconnecter
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <p className="text-txt-secondary">Lecture libre. Pour écrire, il suffit d&apos;un compte gratuit.</p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/communaute/connexion/?suite=${encodeURIComponent(next)}`}
                className="rounded-lg px-3 py-2 font-medium text-txt-primary hover:bg-white/[0.04] hover:text-white"
              >
                Me connecter
              </Link>
              <Link href="/communaute/inscription/" className="btn-primary btn-sm">
                Créer mon compte
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
