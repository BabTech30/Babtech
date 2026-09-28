import type { Metadata } from 'next'
import Link from 'next/link'
import { requestReset } from '@/app/communaute/compte-actions'
import { AccountCard, AccountShell } from '@/components/community/AccountShell'
import { ActionForm } from '@/components/community/ActionForm'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const PATH = '/communaute/mot-de-passe-oublie'

export const metadata: Metadata = pageMetadata({
  title: 'Mot de passe oublié',
  description: 'Reçois par e-mail un lien pour choisir un nouveau mot de passe pour ton compte de la communauté BabTech.',
  path: PATH,
  og: 'communaute',
  noindex: true,
})

export default function ForgotPasswordPage() {
  return (
    <AccountShell title="Mot de passe oublié" path={PATH} intro="Indique ton e-mail : tu reçois un lien pour choisir un nouveau mot de passe.">
      <AccountCard>
        <ActionForm
          action={requestReset}
          submit="Recevoir le lien"
          pending="Envoi…"
          buttonClassName="btn-primary w-full"
          sentView={
            <p className="leading-relaxed text-txt-secondary">
              Si un compte existe avec cette adresse, un e-mail vient de partir. Le lien est valable une heure (pense à regarder dans les indésirables).
            </p>
          }
        >
          <div>
            <label htmlFor="email" className="label">
              E-mail
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" className="input" />
          </div>
        </ActionForm>
      </AccountCard>
      <p className="mt-6 text-center text-sm text-txt-secondary">
        <Link href="/communaute/connexion/" className="font-medium text-bronze hover:underline">
          Retour à la connexion
        </Link>
      </p>
    </AccountShell>
  )
}
