import type { Metadata } from 'next'
import Link from 'next/link'
import { resetPassword } from '@/app/communaute/compte-actions'
import { AccountCard, AccountShell } from '@/components/community/AccountShell'
import { ActionForm } from '@/components/community/ActionForm'
import { LIMITS } from '@/data/forum'
import { peekToken } from '@/lib/community/members'
import { dbConfigured } from '@/lib/db'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const PATH = '/communaute/nouveau-mot-de-passe'

export const metadata: Metadata = pageMetadata({
  title: 'Choisir un nouveau mot de passe',
  description: 'Choisis un nouveau mot de passe pour ton compte de la communauté BabTech, depuis le lien reçu par e-mail.',
  path: PATH,
  og: 'communaute',
  noindex: true,
})

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const token = (await searchParams).t ?? ''
  let valid = false
  if (dbConfigured() && token) {
    try {
      valid = Boolean(await peekToken(token, 'reset'))
    } catch (error) {
      console.error('communauté : lien de mot de passe illisible', error)
    }
  }

  return (
    <AccountShell title="Nouveau mot de passe" path={PATH}>
      <AccountCard>
        {valid ? (
          <ActionForm action={resetPassword} submit="Enregistrer le mot de passe" pending="Enregistrement…" buttonClassName="btn-primary w-full">
            <input type="hidden" name="t" value={token} />
            <div>
              <label htmlFor="mot_de_passe" className="label">
                Nouveau mot de passe
              </label>
              <input
                id="mot_de_passe"
                name="mot_de_passe"
                type="password"
                required
                autoComplete="new-password"
                minLength={LIMITS.password.min}
                maxLength={LIMITS.password.max}
                className="input"
              />
              <p className="mt-1.5 text-[13px] text-txt-muted">{LIMITS.password.min} caractères au moins.</p>
            </div>
            <div>
              <label htmlFor="confirmation" className="label">
                Le même, une deuxième fois
              </label>
              <input id="confirmation" name="confirmation" type="password" required autoComplete="new-password" className="input" />
            </div>
          </ActionForm>
        ) : (
          <p className="leading-relaxed text-txt-secondary">
            Ce lien n&apos;est plus valable (déjà utilisé ou plus d&apos;une heure).{' '}
            <Link href="/communaute/mot-de-passe-oublie/" className="text-bronze underline-offset-2 hover:underline">
              Demande un nouveau lien
            </Link>
            .
          </p>
        )}
      </AccountCard>
    </AccountShell>
  )
}
