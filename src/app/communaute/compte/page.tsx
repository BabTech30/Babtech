import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { changePassword, deleteAccount, logOut, saveProfile } from '@/app/communaute/compte-actions'
import { AccountCard, AccountShell } from '@/components/community/AccountShell'
import { ActionForm } from '@/components/community/ActionForm'
import { Icon } from '@/components/Icon'
import { LIMITS } from '@/data/forum'
import { currentMember, displayName } from '@/lib/community/members'
import { postDate } from '@/lib/community/text'
import { pageMetadata } from '@/lib/seo'
import { fr } from '@/lib/typography'

export const dynamic = 'force-dynamic'

const PATH = '/communaute/compte'

export const metadata: Metadata = pageMetadata({
  title: 'Mon compte de membre',
  description: 'Ton profil sur la communauté BabTech : nom affiché, activité, ville, notifications, mot de passe et suppression du compte.',
  path: PATH,
  og: 'communaute',
  noindex: true,
})

function Input({ id, label, ...input }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input id={id} className="input" {...input} />
    </div>
  )
}

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ mdp?: string }> }) {
  const member = await currentMember()
  if (!member) redirect(`/communaute/connexion/?suite=${encodeURIComponent(`${PATH}/`)}`)
  const { mdp } = await searchParams

  return (
    <AccountShell title="Mon compte" path={PATH} wide intro={`Membre depuis le ${postDate(member.createdAt).split(' à ')[0]}. Sur le forum, tu apparais sous le nom « ${displayName(member)} ».`}>
      {mdp === '1' && (
        <p role="status" className="mb-6 rounded-xl border border-emerald-b/30 bg-emerald-b/[0.08] px-4 py-3 text-sm text-emerald-200">
          {fr('Ton nouveau mot de passe est enregistré.')}
        </p>
      )}
      <div className="grid gap-6">
        <AccountCard title="Mon profil">
          <ActionForm action={saveProfile} submit="Enregistrer" pending="Enregistrement…">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input id="prenom" name="prenom" label="Prénom" required maxLength={60} defaultValue={member.firstName} autoComplete="given-name" />
              <Input id="nom" name="nom" label="Nom (seule l'initiale est affichée)" required maxLength={80} defaultValue={member.lastName} autoComplete="family-name" />
              <Input id="activite" name="activite" label="Activité" maxLength={80} defaultValue={member.activity} />
              <Input id="ville" name="ville" label="Ville" maxLength={80} defaultValue={member.city} autoComplete="address-level2" />
            </div>
            <label htmlFor="notifications" className="flex cursor-pointer items-start gap-3 text-sm text-txt-secondary">
              <input
                id="notifications"
                type="checkbox"
                name="notifications"
                value="oui"
                defaultChecked={member.notifyReplies}
                className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-500"
              />
              Me prévenir par e-mail quand quelqu&apos;un répond à mes sujets
            </label>
            <p className="text-[13px] text-txt-muted">E-mail du compte&nbsp;: {member.email} (jamais affiché sur le site).</p>
          </ActionForm>
        </AccountCard>

        <AccountCard title="Mot de passe">
          <ActionForm action={changePassword} submit="Changer le mot de passe" pending="Enregistrement…">
            <Input id="actuel" name="actuel" type="password" label="Mot de passe actuel" required autoComplete="current-password" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                id="nouveau"
                name="mot_de_passe"
                type="password"
                label={`Nouveau (${LIMITS.password.min} caractères au moins)`}
                required
                minLength={LIMITS.password.min}
                maxLength={LIMITS.password.max}
                autoComplete="new-password"
              />
              <Input id="confirmation" name="confirmation" type="password" label="Le même, une deuxième fois" required autoComplete="new-password" />
            </div>
          </ActionForm>
        </AccountCard>

        <AccountCard title="Supprimer mon compte">
          <p className="mb-5 text-sm leading-relaxed text-txt-secondary">
            {fr("Ton compte et tes informations sont effacés. Tes messages restent en ligne signés « Ancien membre », sauf si tu choisis de les effacer aussi (les réponses des autres à tes sujets disparaissent alors avec eux).")}
          </p>
          <ActionForm
            action={deleteAccount}
            submit="Supprimer définitivement"
            pending="Suppression…"
            confirm="Supprimer ton compte ? C'est définitif."
            buttonClassName="btn-secondary border-red-400/40 text-red-200 hover:border-red-300"
          >
            <fieldset className="space-y-2">
              <legend className="label">Mes messages</legend>
              <label htmlFor="garder" className="flex cursor-pointer items-center gap-3 text-sm text-txt-secondary">
                <input id="garder" type="radio" name="messages" value="garder" defaultChecked className="h-4 w-4 accent-emerald-500" />
                Les laisser en ligne, signés « Ancien membre »
              </label>
              <label htmlFor="effacer" className="flex cursor-pointer items-center gap-3 text-sm text-txt-secondary">
                <input id="effacer" type="radio" name="messages" value="effacer" className="h-4 w-4 accent-emerald-500" />
                Les effacer aussi
              </label>
            </fieldset>
            <Input id="mdp-suppression" name="mot_de_passe" type="password" label="Ton mot de passe, pour confirmer" required autoComplete="current-password" />
          </ActionForm>
        </AccountCard>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/communaute/forum/" className="inline-flex items-center gap-1.5 text-sm font-medium text-bronze hover:underline">
            Retour au forum <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
          <form action={logOut}>
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] px-3 py-2 text-sm font-medium text-txt-primary hover:border-white/30 hover:text-white">
              <Icon name="log-out" className="h-4 w-4" /> Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </AccountShell>
  )
}
