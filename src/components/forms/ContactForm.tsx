'use client'

import Link from 'next/link'
import { startTransition, useActionState, useEffect, useRef } from 'react'
import { type RequestFormState, sendRequest } from '@/app/contact/request-actions'
import { track } from '@/components/Analytics'
import { Icon } from '@/components/Icon'
import { BUDGETS, NEEDS } from '@/data/requests'
import { site } from '@/lib/site'
import { fr } from '@/lib/typography'

/** Correspondance entre les pages services (?besoin=slug) et les choix du formulaire. */
const fromService: Record<string, string> = {
  'creation-site-internet': 'site-internet',
  'application-metier': 'application-metier',
  'automatisation-ia': 'automatisation-ia',
  'site-reservation-location-saisonniere': 'site-reservation',
  'referencement-local-geo': 'referencement-geo',
  'accompagnement-formation-ia': 'formation-ia',
}

/**
 * Formulaire de contact : la demande arrive dans l'onglet « Demandes » du tableau de bord et sur
 * contact@babtech.fr, et la personne reçoit un accusé de réception. `defaultMessage` : texte déjà écrit
 * ailleurs (assistant de projet), repris dans le message.
 */
export function ContactForm({ defaultMessage = '' }: { defaultMessage?: string }) {
  const [state, formAction, pending] = useActionState(async (prev: RequestFormState, data: FormData) => {
    const result = await sendRequest(prev, data)
    if (result.ok) track('contact_form')
    return result
  }, {})
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    const besoin = new URLSearchParams(window.location.search).get('besoin')
    const value = besoin && (fromService[besoin] ?? (NEEDS.some((n) => n.value === besoin) ? besoin : undefined))
    if (value && selectRef.current) selectRef.current.value = value
  }, [])

  if (state.ok) {
    return (
      <div role="status" className="rounded-2xl border border-emerald-b/30 bg-emerald-b/[0.08] p-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-b/20 text-emerald-b">
          <Icon name="check" className="h-6 w-6" />
        </span>
        <p className="mb-2 font-outfit text-xl font-semibold text-white">Message bien reçu, merci&nbsp;!</p>
        <p className="text-[15px] leading-relaxed text-txt-secondary">
          {state.receipt && `${fr('Un accusé de réception vient de partir à ton adresse e-mail.')} `}
          Je te réponds sous 24 heures. En attendant, tu peux{' '}
          <Link href={site.bookingPath} className="text-emerald-b underline" data-track="rendez-vous">
            réserver directement un créneau
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        // Envoi sans rechargement (et sans vider le formulaire en cas d'erreur) ; sans JavaScript, le formulaire marche aussi.
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(() => formAction(data))
      }}
      className="space-y-5"
    >
      <input type="hidden" name="source" value="contact" />
      <div aria-hidden="true" className="hidden">
        <label htmlFor="contact-gotcha">Ne pas remplir</label>
        <input id="contact-gotcha" type="text" name="site_web" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="label">
            Nom <span className="text-emerald-b">*</span>
          </label>
          <input id="contact-name" name="nom" type="text" required autoComplete="name" placeholder="Ton nom" className="input" />
        </div>
        <div>
          <label htmlFor="contact-company" className="label">
            Entreprise / activité
          </label>
          <input id="contact-company" name="entreprise" type="text" autoComplete="organization" placeholder="Ex. plomberie, restaurant…" className="input" />
        </div>
        <div>
          <label htmlFor="contact-email" className="label">
            Email <span className="text-emerald-b">*</span>
          </label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="ton@email.fr" className="input" />
        </div>
        <div>
          <label htmlFor="contact-phone" className="label">
            Téléphone
          </label>
          <input id="contact-phone" name="telephone" type="tel" autoComplete="tel" placeholder="Pour te rappeler (facultatif)" className="input" />
        </div>
        <div>
          <label htmlFor="contact-city" className="label">
            Ville
          </label>
          <input id="contact-city" name="ville" type="text" autoComplete="address-level2" placeholder="Montpellier, Sète, Lunel…" className="input" />
        </div>
        <div>
          <label htmlFor="contact-budget" className="label">
            Budget envisagé
          </label>
          <select id="contact-budget" name="budget" defaultValue="" className="input cursor-pointer appearance-none">
            <option value="">Facultatif</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-need" className="label">
          Ton besoin <span className="text-emerald-b">*</span>
        </label>
        <select id="contact-need" ref={selectRef} name="besoin" required defaultValue="" className="input cursor-pointer appearance-none">
          <option value="" disabled>
            Choisis une catégorie
          </option>
          {NEEDS.map((n) => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="label">
          Message <span className="text-emerald-b">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          defaultValue={defaultMessage}
          placeholder="Dis-moi en quelques lignes où tu en es et ce que tu aimerais obtenir."
          className="input min-h-[140px] resize-y"
        />
      </div>

      <p className="text-xs leading-relaxed text-txt-muted">
        Tes informations servent uniquement à répondre à ta demande. Voir la{' '}
        <Link href="/confidentialite" className="underline hover:text-white">
          politique de confidentialité
        </Link>
        .
      </p>

      <button type="submit" disabled={pending} className="btn-primary w-full disabled:cursor-wait disabled:opacity-70">
        {pending ? 'Envoi en cours…' : 'Envoyer ma demande'}
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
