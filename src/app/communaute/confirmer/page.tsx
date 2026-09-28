import type { Metadata } from 'next'
import Link from 'next/link'
import { confirmEmail } from '@/app/communaute/compte-actions'
import { AccountCard, AccountShell } from '@/components/community/AccountShell'
import { ActionForm } from '@/components/community/ActionForm'
import { peekToken } from '@/lib/community/members'
import { dbConfigured } from '@/lib/db'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const PATH = '/communaute/confirmer'

export const metadata: Metadata = pageMetadata({
  title: 'Confirmer mon adresse e-mail',
  description: "Dernière étape de l'inscription à la communauté BabTech : confirmer ton adresse e-mail pour activer ton compte.",
  path: PATH,
  og: 'communaute',
  noindex: true,
})

/**
 * Arrivée depuis le lien de l'e-mail : un bouton confirme l'adresse (un simple affichage ne suffit pas, pour que
 * les logiciels qui ouvrent les liens des e-mails à l'avance n'utilisent pas le lien à la place du membre).
 */
export default async function ConfirmPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const token = (await searchParams).t ?? ''
  let valid = false
  if (dbConfigured() && token) {
    try {
      valid = Boolean(await peekToken(token, 'verify'))
    } catch (error) {
      console.error('communauté : lien de confirmation illisible', error)
    }
  }

  return (
    <AccountShell title="Confirmer mon adresse" path={PATH}>
      <AccountCard>
        {valid ? (
          <>
            <p className="mb-6 leading-relaxed text-txt-secondary">Un clic, et ton compte est actif&nbsp;: tu pourras écrire sur le forum tout de suite.</p>
            <ActionForm action={confirmEmail} submit="Confirmer mon adresse" pending="Confirmation…" buttonClassName="btn-primary w-full">
              <input type="hidden" name="t" value={token} />
            </ActionForm>
          </>
        ) : (
          <p className="leading-relaxed text-txt-secondary">
            Ce lien n&apos;est plus valable (déjà utilisé ou trop ancien).{' '}
            <Link href="/communaute/connexion/" className="text-bronze underline-offset-2 hover:underline">
              Connecte-toi
            </Link>
            &nbsp;: si ton adresse n&apos;est pas encore confirmée, un nouveau lien te sera envoyé.
          </p>
        )}
      </AccountCard>
    </AccountShell>
  )
}
