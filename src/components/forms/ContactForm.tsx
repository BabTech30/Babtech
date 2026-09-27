'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Icon } from '@/components/Icon'
import { site } from '@/lib/site'
import { useFormspree } from './useFormspree'

const needs = [
  { value: 'site-internet', label: 'Site internet — création ou refonte' },
  { value: 'application-metier', label: 'Application métier / PWA' },
  { value: 'automatisation-ia', label: 'Automatisation & IA' },
  { value: 'referencement-geo', label: 'Référencement Google & IA (SEO / GEO)' },
  { value: 'formation-ia', label: 'Accompagnement ou formation IA' },
  { value: 'autre', label: 'Autre / je ne sais pas encore' },
]

/** Correspondance entre les pages services (?besoin=slug) et les choix du formulaire. */
const fromService: Record<string, string> = {
  'creation-site-internet': 'site-internet',
  'application-metier': 'application-metier',
  'automatisation-ia': 'automatisation-ia',
  'referencement-local-geo': 'referencement-geo',
  'accompagnement-formation-ia': 'formation-ia',
}

const budgets = ['Moins de 1 000 €', '1 000 à 3 000 €', '3 000 à 6 000 €', 'Plus de 6 000 €', 'Je ne sais pas encore']

export function ContactForm() {
  const { status, submit } = useFormspree(site.forms.contact, 'contact_form')
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    const besoin = new URLSearchParams(window.location.search).get('besoin')
    const value = besoin && (fromService[besoin] ?? (needs.some((n) => n.value === besoin) ? besoin : undefined))
    if (value && selectRef.current) selectRef.current.value = value
  }, [])

  if (status === 'success') {
    return (
      <div role="status" className="rounded-2xl border border-emerald-b/30 bg-emerald-b/[0.08] p-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-b/20 text-emerald-b">
          <Icon name="check" className="h-6 w-6" />
        </span>
        <p className="mb-2 font-outfit text-xl font-semibold text-white">Message bien reçu, merci&nbsp;!</p>
        <p className="text-[15px] leading-relaxed text-txt-secondary">
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
      action={site.forms.contact}
      method="POST"
      onSubmit={(e) => {
        e.preventDefault()
        submit(e.currentTarget)
      }}
      className="space-y-5"
    >
      <input type="hidden" name="_subject" value="Nouvelle demande via le site BabTech" />
      <div aria-hidden="true" className="hidden">
        <label htmlFor="contact-gotcha">Ne pas remplir</label>
        <input id="contact-gotcha" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
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
            {budgets.map((b) => (
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
          {needs.map((n) => (
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

      <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:cursor-wait disabled:opacity-70">
        {status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande'}
        {status !== 'sending' && <Icon name="arrow-right" className="h-[18px] w-[18px]" />}
      </button>

      <div aria-live="polite">
        {status === 'error' && (
          <p className="rounded-xl border border-red-400/30 bg-red-400/[0.08] p-4 text-sm text-red-200">
            L&apos;envoi n&apos;a pas fonctionné. Réessaie dans un instant ou écris-moi directement à{' '}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  )
}
