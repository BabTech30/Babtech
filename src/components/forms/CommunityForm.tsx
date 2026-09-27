'use client'

import Link from 'next/link'
import { startTransition, useActionState } from 'react'
import { type JoinState, joinCommunity } from '@/app/communaute/actions'
import { track } from '@/components/Analytics'
import { Icon } from '@/components/Icon'
import { community } from '@/data/community'
import { fr } from '@/lib/typography'

const formats = ['En présentiel à Montpellier', 'En visio', 'Les deux']
const levels = ['Je débute', "J'utilise déjà quelques outils", "Je suis à l'aise et je veux aller plus loin"]

/** Inscription à la liste des membres fondateurs : rangée dans « Demandes » du tableau de bord, e-mail de bienvenue. */
export function CommunityForm() {
  const [state, formAction, pending] = useActionState(async (prev: JoinState, data: FormData) => {
    const result = await joinCommunity(prev, data)
    if (result.ok) track('community_signup')
    return result
  }, {})

  if (state.ok) {
    return (
      <div role="status" className="rounded-2xl border border-emerald-b/30 bg-emerald-b/[0.08] p-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-b/20 text-emerald-b">
          <Icon name="sparkles" className="h-6 w-6" />
        </span>
        <p className="mb-2 font-outfit text-xl font-semibold text-white">Bienvenue parmi les membres fondateurs&nbsp;!</p>
        <p className="text-[15px] leading-relaxed text-txt-secondary">
          {state.receipt && `${fr('Un e-mail de bienvenue vient de partir à ton adresse.')} `}
          Tu seras parmi les premiers informés des ateliers et des rencontres. Merci de ta confiance.
        </p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => formAction(data))
      }}
      className="space-y-6"
    >
      <div aria-hidden="true" className="hidden">
        <label htmlFor="community-gotcha">Ne pas remplir</label>
        <input id="community-gotcha" type="text" name="site_web" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="community-name" className="label">
            Prénom <span className="text-emerald-b">*</span>
          </label>
          <input id="community-name" name="prenom" type="text" required autoComplete="given-name" className="input" />
        </div>
        <div>
          <label htmlFor="community-email" className="label">
            Email <span className="text-emerald-b">*</span>
          </label>
          <input id="community-email" name="email" type="email" required autoComplete="email" className="input" />
        </div>
        <div>
          <label htmlFor="community-job" className="label">
            Ton activité
          </label>
          <input id="community-job" name="activite" type="text" placeholder="Ex. électricien, fleuriste, consultante…" className="input" />
        </div>
        <div>
          <label htmlFor="community-city" className="label">
            Ta ville
          </label>
          <input id="community-city" name="ville" type="text" autoComplete="address-level2" placeholder="Montpellier, Lattes, Sète…" className="input" />
        </div>
      </div>

      <fieldset>
        <legend className="label">Les thèmes qui t&apos;intéressent</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {community.themes.map((theme, i) => (
            <label
              key={theme}
              htmlFor={`community-theme-${i}`}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 text-sm text-txt-secondary transition-colors hover:border-white/20 has-[:checked]:border-emerald-b/50 has-[:checked]:bg-emerald-b/[0.07] has-[:checked]:text-txt-primary"
            >
              <input id={`community-theme-${i}`} type="checkbox" name="themes" value={theme} className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-500" />
              {theme}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <fieldset>
          <legend className="label">Format préféré</legend>
          <div className="space-y-2">
            {formats.map((f, i) => (
              <label key={f} htmlFor={`community-format-${i}`} className="flex cursor-pointer items-center gap-3 text-sm text-txt-secondary">
                <input id={`community-format-${i}`} type="radio" name="format" value={f} defaultChecked={i === 2} className="h-4 w-4 accent-emerald-500" />
                {f}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="label">Ton niveau aujourd&apos;hui</legend>
          <div className="space-y-2">
            {levels.map((l, i) => (
              <label key={l} htmlFor={`community-level-${i}`} className="flex cursor-pointer items-center gap-3 text-sm text-txt-secondary">
                <input id={`community-level-${i}`} type="radio" name="niveau" value={l} defaultChecked={i === 0} className="h-4 w-4 accent-emerald-500" />
                {l}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div>
        <label htmlFor="community-message" className="label">
          Ce que tu aimerais apprendre ou partager
        </label>
        <textarea id="community-message" name="message" rows={3} className="input resize-y" placeholder="Facultatif" />
      </div>

      <label htmlFor="community-consent" className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-txt-secondary">
        <input id="community-consent" type="checkbox" name="consentement" value="oui" required className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-500" />
        <span>
          J&apos;accepte d&apos;être recontacté(e) au sujet de la communauté BabTech. Désinscription possible à tout moment. Voir la{' '}
          <Link href="/confidentialite" className="underline hover:text-white">
            politique de confidentialité
          </Link>
          .
        </span>
      </label>

      <button type="submit" disabled={pending} className="btn-primary w-full disabled:cursor-wait disabled:opacity-70">
        {pending ? 'Inscription en cours…' : 'Rejoindre les membres fondateurs'}
        {!pending && <Icon name="arrow-right" className="h-[18px] w-[18px]" />}
      </button>

      <div aria-live="polite">
        {state.error && (
          <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/[0.08] p-4 text-sm text-red-200">
            {fr(state.error)}
          </p>
        )}
      </div>
    </form>
  )
}
