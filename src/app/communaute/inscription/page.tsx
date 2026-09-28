import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { signUp } from '@/app/communaute/compte-actions'
import { AccountCard, AccountShell } from '@/components/community/AccountShell'
import { ActionForm } from '@/components/community/ActionForm'
import { CommunityForm } from '@/components/forms/CommunityForm'
import { Icon } from '@/components/Icon'
import { LIMITS } from '@/data/forum'
import { currentMember } from '@/lib/community/members'
import { dbConfigured } from '@/lib/db'
import { mailConfigured } from '@/lib/mail'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const PATH = '/communaute/inscription'

export const metadata: Metadata = pageMetadata({
  title: 'Créer mon compte sur la communauté',
  description: "Crée ton compte gratuit sur la communauté BabTech pour poser tes questions sur le forum et échanger avec d'autres entrepreneurs.",
  path: PATH,
  og: 'communaute',
  noindex: true,
})

function Field({ id, label, required, hint, ...input }: { id: string; label: string; required?: boolean; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {required && <span className="text-bronze">*</span>}
      </label>
      <input id={id} required={required} className="input" {...input} />
      {hint && <p className="mt-1.5 text-[13px] text-txt-muted">{hint}</p>}
    </div>
  )
}

export default async function SignUpPage() {
  if (await currentMember()) redirect('/communaute/forum/')
  const open = dbConfigured() && mailConfigured()

  if (!open) {
    return (
      <AccountShell
        title="Rejoindre la communauté"
        path={PATH}
        intro="L'espace membres (compte et forum) ouvre très bientôt. Laisse ton e-mail : tu seras prévenu dès l'ouverture et tu nous aides à construire le programme."
      >
        <AccountCard>
          <CommunityForm />
        </AccountCard>
      </AccountShell>
    )
  }

  return (
    <AccountShell
      title="Créer mon compte"
      path={PATH}
      intro="Gratuit, en une minute. Ton compte te permet d'écrire sur le forum : poser tes questions, répondre, partager ce qui marche."
    >
      <AccountCard>
        <ActionForm
          action={signUp}
          submit="Créer mon compte"
          pending="Création…"
          buttonClassName="btn-primary w-full"
          sentView={
            <div className="py-4 text-center">
              <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-b/20 text-emerald-b">
                <Icon name="mail" className="h-6 w-6" />
              </span>
              <p className="mb-2 font-outfit text-xl font-semibold text-white">Vérifie ta boîte mail</p>
              <p className="text-[15px] leading-relaxed text-txt-secondary">
                Un lien de confirmation vient de partir à l&apos;adresse indiquée. Clique dessus pour activer ton compte (pense à regarder dans les
                indésirables).
              </p>
            </div>
          }
        >
          <div aria-hidden="true" className="hidden">
            <label htmlFor="signup-gotcha">Ne pas remplir</label>
            <input id="signup-gotcha" type="text" name="site_web" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="prenom" name="prenom" label="Prénom" required autoComplete="given-name" maxLength={60} />
            <Field id="nom" name="nom" label="Nom" required autoComplete="family-name" maxLength={80} hint="Seule l'initiale est affichée (« Marie D. »)." />
          </div>
          <Field id="email" name="email" type="email" label="E-mail" required autoComplete="email" maxLength={190} hint="Jamais affiché sur le site." />
          <Field
            id="mot_de_passe"
            name="mot_de_passe"
            type="password"
            label="Mot de passe"
            required
            autoComplete="new-password"
            minLength={LIMITS.password.min}
            maxLength={LIMITS.password.max}
            hint={`${LIMITS.password.min} caractères au moins. Une phrase facile à retenir fait un très bon mot de passe.`}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="activite" name="activite" label="Ton activité" maxLength={80} placeholder="Ex. fleuriste, électricien…" />
            <Field id="ville" name="ville" label="Ta ville" autoComplete="address-level2" maxLength={80} placeholder="Montpellier, Nîmes…" />
          </div>
          <label htmlFor="charte" className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-txt-secondary">
            <input id="charte" type="checkbox" name="charte" value="oui" required className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-500" />
            <span>
              J&apos;accepte la{' '}
              <Link href="/communaute/charte/" className="underline hover:text-white">
                charte de la communauté
              </Link>{' '}
              et la{' '}
              <Link href="/confidentialite/" className="underline hover:text-white">
                politique de confidentialité
              </Link>
              . Mon prénom, l&apos;initiale de mon nom, mon activité et ma ville s&apos;affichent avec mes messages.
            </span>
          </label>
        </ActionForm>
      </AccountCard>
      <p className="mt-6 text-center text-sm text-txt-secondary">
        Déjà un compte&nbsp;?{' '}
        <Link href="/communaute/connexion/" className="font-medium text-bronze hover:underline">
          Me connecter
        </Link>
      </p>
    </AccountShell>
  )
}
