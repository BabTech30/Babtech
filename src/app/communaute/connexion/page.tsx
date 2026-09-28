import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { logIn } from '@/app/communaute/compte-actions'
import { AccountCard, AccountShell } from '@/components/community/AccountShell'
import { ActionForm } from '@/components/community/ActionForm'
import { currentMember } from '@/lib/community/members'
import { dbConfigured } from '@/lib/db'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const PATH = '/communaute/connexion'

export const metadata: Metadata = pageMetadata({
  title: 'Me connecter à la communauté',
  description: 'Connexion à ton compte de la communauté BabTech, pour écrire sur le forum et gérer ton profil.',
  path: PATH,
  og: 'communaute',
  noindex: true,
})

/** Retour après connexion : une page de la communauté seulement. */
const safeNext = (value?: string) => (value && /^\/communaute\/[\w\-/?=&#%.]*$/.test(value) && !value.includes('//') ? value : '/communaute/forum/')

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ suite?: string }> }) {
  const next = safeNext((await searchParams).suite)
  if (await currentMember()) redirect(next)

  return (
    <AccountShell title="Me connecter" path={PATH} intro="Connecte-toi pour écrire sur le forum de la communauté.">
      <AccountCard>
        {dbConfigured() ? (
          <ActionForm action={logIn} submit="Me connecter" pending="Connexion…" buttonClassName="btn-primary w-full">
            <input type="hidden" name="suite" value={next} />
            <div>
              <label htmlFor="email" className="label">
                E-mail
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" className="input" />
            </div>
            <div>
              <label htmlFor="mot_de_passe" className="label">
                Mot de passe
              </label>
              <input id="mot_de_passe" name="mot_de_passe" type="password" required autoComplete="current-password" className="input" />
              <p className="mt-2 text-right text-[13px]">
                <Link href="/communaute/mot-de-passe-oublie/" className="text-txt-secondary underline-offset-2 hover:text-white hover:underline">
                  Mot de passe oublié&nbsp;?
                </Link>
              </p>
            </div>
          </ActionForm>
        ) : (
          <p className="text-txt-secondary">
            L&apos;espace membres ouvre très bientôt.{' '}
            <Link href="/communaute/inscription/" className="text-bronze underline-offset-2 hover:underline">
              Laisse ton e-mail pour être prévenu
            </Link>
            .
          </p>
        )}
      </AccountCard>
      <p className="mt-6 text-center text-sm text-txt-secondary">
        Pas encore de compte&nbsp;?{' '}
        <Link href="/communaute/inscription/" className="font-medium text-bronze hover:underline">
          Créer mon compte gratuit
        </Link>
      </p>
    </AccountShell>
  )
}
