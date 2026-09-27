'use client'

import Link from 'next/link'
import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { type AssistantResult, analyzeProject, assistantAvailable } from '@/app/contact/actions'
import { type RequestFormState, sendRequest } from '@/app/contact/request-actions'
import { track } from '@/components/Analytics'
import { Icon, type IconName } from '@/components/Icon'
import type { ServiceSlug } from '@/data/services'
import type { Proposal } from '@/lib/assistant/prompt'
import { site } from '@/lib/site'
import { fr } from '@/lib/typography'
import { ContactForm } from './ContactForm'

export type OfferCard = { slug: ServiceSlug; name: string; promise: string; price: string; icon: IconName }
export type WorkCard = { slug: string; title: string; sector: string; result: string; image?: { src: string; alt: string; width: number; height: number } }

type Phase = 'describe' | 'thinking' | 'proposal' | 'classic'

const MIN_LENGTH = 20
const MAX_LENGTH = 1500
const EXAMPLES = [
  { label: 'Gîte en direct', text: "J'ai un gîte de 3 chambres près de Sète et je voudrais que mes clients réservent en direct, sans commission." },
  { label: 'Artisan sur Google', text: 'Je suis plombier à Lunel : je veux être trouvé sur Google et recevoir des demandes de devis.' },
  { label: 'Devis automatiques', text: 'Je passe mes soirées à refaire mes devis et mes relances à la main, je voudrais automatiser tout ça.' },
  { label: "L'IA pour mon équipe", text: "Mon équipe de 5 personnes utilise un peu ChatGPT, je voudrais la former à utiliser l'IA sérieusement." },
]
const STEPS = ['Je lis ton projet', 'Je choisis les offres adaptées', 'Je cherche mes réalisations proches', 'Je prépare des idées et des questions']

/** Défilement doux, sauf si le visiteur a demandé moins d'animations. */
const scrollBehavior = (): ScrollBehavior => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth')

/**
 * Formulaire de contact avec assistant IA : le visiteur décrit son projet, Claude propose aussitôt une piste
 * (offres, idées, réalisations proches, questions), puis la demande part avec la synthèse. Sans assistant
 * disponible (clé absente, souci), c'est le formulaire classique qui s'affiche.
 */
export function ProjectAssistant({ offers, works }: { offers: OfferCard[]; works: WorkCard[] }) {
  const [available, setAvailable] = useState<boolean | null>(null)
  const [phase, setPhase] = useState<Phase>('describe')
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [step, setStep] = useState(0)
  const [proposal, setProposal] = useState<Proposal | null>(null)

  useEffect(() => {
    let alive = true
    assistantAvailable()
      .then((ok) => {
        if (!alive) return
        setAvailable(ok)
        // Venu d'une page service (?besoin=…) : le projet commence par l'offre qui l'intéresse.
        const service = offers.find((o) => o.slug === new URLSearchParams(window.location.search).get('besoin'))
        if (ok && service) setText((current) => current || `Je m'intéresse à l'offre « ${service.name} ». `)
      })
      .catch(() => alive && setAvailable(false))
    return () => {
      alive = false
    }
  }, [offers])

  useEffect(() => {
    if (phase !== 'thinking') return
    const timer = window.setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 2400)
    return () => window.clearInterval(timer)
  }, [phase])

  function analyze() {
    const project = text.trim()
    if (project.length < MIN_LENGTH) {
      setError('Décris ton projet en une ou deux phrases.')
      return
    }
    setError('')
    setStep(0)
    setPhase('thinking')
    startTransition(async () => {
      const result: AssistantResult = await analyzeProject(project).catch(() => ({ unavailable: true }))
      if (result.proposal) {
        setProposal(result.proposal)
        setPhase('proposal')
        track('assistant_ia', { offres: result.proposal.services.join(',') || 'aucune' })
      } else if (result.unavailable) {
        setNotice("L'assistant ne répond pas pour le moment : écris-moi directement, ton texte est déjà dans le message.")
        setPhase('classic')
      } else {
        setError(result.error ?? '')
        setPhase('describe')
      }
    })
  }

  // Tant qu'on ne sait pas si l'assistant est actif (et sans clé d'API), c'est le formulaire classique.
  if (available !== true || phase === 'classic') {
    return (
      <>
        <h2 className="mb-2 font-outfit text-[22px] font-semibold tracking-tight text-white">Envoie-moi un message</h2>
        <p className="mb-8 text-sm text-txt-secondary">Décris ton besoin en quelques mots&nbsp;: je reviens vers toi rapidement.</p>
        {notice && <p className="mb-6 rounded-xl border border-bronze/30 bg-bronze/10 px-4 py-3 text-sm text-txt-primary">{fr(notice)}</p>}
        <ContactForm defaultMessage={text} />
        {available && !notice && (
          <button type="button" onClick={() => setPhase('describe')} className="mt-5 text-sm text-txt-secondary underline hover:text-white">
            Revenir à l&apos;assistant IA
          </button>
        )}
      </>
    )
  }

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="font-outfit text-[22px] font-semibold tracking-tight text-white">Raconte-moi ton projet</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-b/30 bg-emerald-b/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
          <Icon name="sparkles" className="h-3.5 w-3.5" />
          Assistant IA
        </span>
      </div>
      <p className="mb-7 text-sm leading-relaxed text-txt-secondary">
        Quelques phrases suffisent&nbsp;: mon assistant te propose aussitôt une piste, des idées et mes réalisations proches. Ensuite, tu
        m&apos;envoies ta demande en un clic, et c&apos;est moi qui te réponds.
      </p>

      {phase === 'describe' && (
        <Describe text={text} setText={setText} error={error} onAnalyze={analyze} onClassic={() => setPhase('classic')} ready={available === true} />
      )}
      {phase === 'thinking' && <Thinking text={text} step={step} />}
      {phase === 'proposal' && proposal && (
        <ProposalView
          proposal={proposal}
          text={text}
          offers={offers}
          works={works}
          onEdit={() => {
            setProposal(null)
            setPhase('describe')
          }}
        />
      )}
    </>
  )
}

function Describe({
  text,
  setText,
  error,
  onAnalyze,
  onClassic,
  ready,
}: {
  text: string
  setText: (value: string) => void
  error: string
  onAnalyze: () => void
  onClassic: () => void
  ready: boolean
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onAnalyze()
      }}
      className="grid gap-4"
    >
      <div>
        <label htmlFor="assistant-project" className="label">
          Ton projet en quelques phrases
        </label>
        <textarea
          id="assistant-project"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              onAnalyze()
            }
          }}
          rows={5}
          maxLength={MAX_LENGTH}
          aria-describedby="assistant-privacy"
          placeholder="Ton activité, ce qui te fait perdre du temps ou des clients, ce que tu aimerais obtenir…"
          className="input min-h-[150px] resize-y"
        />
        <p className="mt-1.5 text-right text-xs tabular-nums text-txt-muted" aria-hidden="true">
          {text.length} / {MAX_LENGTH}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-txt-muted">Exemples&nbsp;:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            type="button"
            onClick={() => setText(ex.text)}
            className="rounded-full border border-white/[0.12] px-3 py-1.5 text-xs font-medium text-txt-secondary transition-colors hover:border-emerald-b/50 hover:text-white"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/[0.08] p-4 text-sm text-red-200">
          {fr(error)}
        </p>
      )}

      <button type="submit" disabled={!ready} className="btn-primary w-full disabled:cursor-wait disabled:opacity-70">
        <Icon name="sparkles" className="h-[18px] w-[18px]" />
        Analyser mon projet
      </button>

      <p id="assistant-privacy" className="text-xs leading-relaxed text-txt-muted">
        Ton texte est analysé par Claude, l&apos;IA d&apos;Anthropic, pour te répondre tout de suite. Rien ne m&apos;est envoyé tant que tu
        n&apos;envoies pas ta demande. Évite d&apos;y mettre des informations sensibles. Voir la{' '}
        <Link href="/confidentialite" className="underline hover:text-white">
          politique de confidentialité
        </Link>
        .
      </p>
      <button type="button" onClick={onClassic} className="justify-self-start text-sm text-txt-secondary underline hover:text-white">
        Je préfère le formulaire classique
      </button>
    </form>
  )
}

function Thinking({ text, step }: { text: string; step: number }) {
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => box.current?.scrollIntoView({ block: 'nearest', behavior: scrollBehavior() }), [])
  return (
    <div ref={box} role="status" aria-live="polite" className="rounded-2xl border border-emerald-b/30 bg-emerald-b/[0.06] p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-b/15 text-emerald-b">
          <Icon name="sparkles" className="h-5 w-5 motion-safe:animate-pulse" />
        </span>
        <p className="font-outfit text-lg font-semibold text-white">L&apos;assistant analyse ton projet…</p>
      </div>
      <ol className="mt-5 grid gap-2.5 text-sm">
        {STEPS.map((label, i) => (
          <li key={label} className={`flex items-center gap-2.5 ${i < step ? 'text-emerald-300' : i === step ? 'text-white' : 'text-txt-muted'}`}>
            {i < step ? (
              <Icon name="check" className="h-4 w-4" />
            ) : i === step ? (
              <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-emerald-b border-t-transparent motion-safe:animate-spin" />
            ) : (
              <span aria-hidden="true" className="mx-1.5 h-1.5 w-1.5 rounded-full bg-white/25" />
            )}
            {label}
          </li>
        ))}
      </ol>
      <p className="mt-5 line-clamp-3 border-l-2 border-emerald-b/40 pl-3 text-sm italic text-txt-secondary">{text}</p>
    </div>
  )
}

function ProposalView({
  proposal,
  text,
  offers,
  works,
  onEdit,
}: {
  proposal: Proposal
  text: string
  offers: OfferCard[]
  works: WorkCard[]
  onEdit: () => void
}) {
  const [state, formAction, pending] = useActionState(async (prev: RequestFormState, data: FormData) => {
    const result = await sendRequest(prev, data)
    if (result.ok) track('contact_form', { via: 'assistant' })
    return result
  }, {})
  // La réponse remplace l'analyse : on y amène le visiteur, et le focus pour les lecteurs d'écran.
  const top = useRef<HTMLElement>(null)
  useEffect(() => {
    top.current?.focus({ preventScroll: true })
    top.current?.scrollIntoView({ block: 'start', behavior: scrollBehavior() })
  }, [])
  const chosen = proposal.services.map((slug) => offers.find((o) => o.slug === slug)).filter((o): o is OfferCard => Boolean(o))
  const similar = proposal.projects.map((slug) => works.find((w) => w.slug === slug)).filter((w): w is WorkCard => Boolean(w))
  const synthesis = [
    `Résumé : ${proposal.summary}`,
    chosen.length ? `Offres proposées : ${chosen.map((o) => o.name).join(', ')}` : '',
    proposal.ideas.length ? `Idées : ${proposal.ideas.join(' / ')}` : '',
    similar.length ? `Réalisations proches : ${similar.map((w) => w.title).join(', ')}` : '',
    proposal.questions.length ? `Questions : ${proposal.questions.join(' / ')}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  if (state.ok) {
    return (
      <div role="status" className="rounded-2xl border border-emerald-b/30 bg-emerald-b/[0.08] p-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-b/20 text-emerald-b">
          <Icon name="check" className="h-6 w-6" />
        </span>
        <p className="mb-2 font-outfit text-xl font-semibold text-white">Demande bien reçue, merci&nbsp;!</p>
        <p className="text-[15px] leading-relaxed text-txt-secondary">
          J&apos;ai ton projet et la synthèse de l&apos;assistant&nbsp;: je te réponds sous 24 heures. Tu peux aussi{' '}
          <Link href={site.bookingPath} className="text-emerald-b underline" data-track="rendez-vous">
            réserver directement un créneau
          </Link>
          .
        </p>
      </div>
    )
  }

  if (!proposal.relevant) {
    return (
      <div className="grid gap-5">
        <p
          ref={top as React.RefObject<HTMLParagraphElement>}
          tabIndex={-1}
          className="rounded-2xl border border-bord bg-white/[0.03] p-6 text-[15px] leading-relaxed text-txt-primary focus:outline-none"
        >
          {fr(proposal.summary)}
        </p>
        <button type="button" onClick={onEdit} className="btn-primary justify-self-start">
          Décrire mon projet
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-8">
      <section aria-labelledby="assistant-summary">
        <h3
          id="assistant-summary"
          ref={top as React.RefObject<HTMLHeadingElement>}
          tabIndex={-1}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[1.5px] text-emerald-b focus:outline-none"
        >
          <Icon name="sparkles" className="h-4 w-4" />
          Ce que j&apos;ai compris
        </h3>
        <p className="mt-2 font-outfit text-xl leading-snug text-white">{fr(proposal.summary)}</p>
        <button type="button" onClick={onEdit} className="mt-2 text-sm text-txt-secondary underline hover:text-white">
          Modifier mon projet
        </button>
      </section>

      {chosen.length > 0 && (
        <section aria-labelledby="assistant-offers">
          <h3 id="assistant-offers" className="mb-3 font-outfit text-lg font-semibold text-white">
            {chosen.length > 1 ? 'Les offres qui te correspondent' : "L'offre qui te correspond"}
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {chosen.map((o, i) => (
              <li key={o.slug} className={`rounded-xl border p-4 ${i === 0 ? 'border-emerald-b/50 bg-emerald-b/[0.06]' : 'border-bord bg-white/[0.02]'}`}>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-b/[0.12] text-emerald-b">
                    <Icon name={o.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug text-white">{o.name}</p>
                    <p className="text-sm text-txt-secondary">{fr(o.promise)}</p>
                    <p className="mt-1.5 text-sm font-medium text-bronze">{fr(o.price)}</p>
                    <Link href={`/services/${o.slug}/`} className="mt-1 inline-block text-sm text-emerald-300 hover:underline">
                      Voir l&apos;offre
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {proposal.ideas.length > 0 && (
        <section aria-labelledby="assistant-ideas">
          <h3 id="assistant-ideas" className="mb-3 font-outfit text-lg font-semibold text-white">
            Des idées pour ton projet
          </h3>
          <ul className="grid gap-2.5">
            {proposal.ideas.map((idea) => (
              <li key={idea} className="flex gap-3 text-[15px] leading-relaxed text-txt-primary">
                <Icon name="zap" className="mt-1 h-4 w-4 shrink-0 text-emerald-b" />
                {fr(idea)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {similar.length > 0 && (
        <section aria-labelledby="assistant-works">
          <h3 id="assistant-works" className="mb-3 font-outfit text-lg font-semibold text-white">
            Ce que j&apos;ai déjà réalisé dans ce genre
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {similar.map((w) => (
              <li key={w.slug} className="overflow-hidden rounded-xl border border-bord bg-white/[0.02]">
                {w.image && (
                  // Capture déjà optimisée (WebP) : pas besoin de next/image ici.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.image.src} alt={w.image.alt} width={w.image.width} height={w.image.height} loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
                )}
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wide text-txt-muted">{w.sector}</p>
                  <p className="font-semibold text-white">{w.title}</p>
                  <p className="mt-1 line-clamp-3 text-sm text-txt-secondary">{fr(w.result)}</p>
                  <Link href={`/portfolio/#${w.slug}`} className="mt-1.5 inline-block text-sm text-emerald-300 hover:underline">
                    Voir le projet
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <form
        action={formAction}
        onSubmit={(e) => {
          e.preventDefault()
          const data = new FormData(e.currentTarget)
          startTransition(() => formAction(data))
        }}
        className="grid gap-5 rounded-2xl border border-bord bg-white/[0.02] p-5 sm:p-6"
        aria-labelledby="assistant-send"
      >
        <div>
          <h3 id="assistant-send" className="font-outfit text-lg font-semibold text-white">
            Envoie-moi ta demande
          </h3>
          <p className="mt-1 text-sm text-txt-secondary">Ton projet et cette synthèse me parviennent ensemble&nbsp;: tu n&apos;as rien à réécrire.</p>
        </div>
        <input type="hidden" name="source" value="assistant" />
        <input type="hidden" name="projet" value={text} />
        <input type="hidden" name="synthese_ia" value={synthesis} />
        <div aria-hidden="true" className="hidden">
          <label htmlFor="assistant-gotcha">Ne pas remplir</label>
          <input id="assistant-gotcha" type="text" name="site_web" tabIndex={-1} autoComplete="off" />
        </div>
        {proposal.questions.length > 0 && (
          <div>
            <p className="text-sm font-medium text-txt-primary">Pour préparer notre échange, tu peux déjà répondre à ces questions&nbsp;:</p>
            <ol className="mt-2 grid list-decimal gap-1.5 pl-5 text-sm text-txt-secondary">
              {proposal.questions.map((q) => (
                <li key={q}>{fr(q)}</li>
              ))}
            </ol>
          </div>
        )}
        <div>
          <label htmlFor="assistant-answers" className="label">
            Tes réponses ou précisions (facultatif)
          </label>
          <textarea id="assistant-answers" name="precisions" rows={3} maxLength={2000} className="input resize-y" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="assistant-name" className="label">
              Nom <span className="text-emerald-b">*</span>
            </label>
            <input id="assistant-name" name="nom" type="text" required autoComplete="name" placeholder="Ton nom" className="input" />
          </div>
          <div>
            <label htmlFor="assistant-email" className="label">
              Email <span className="text-emerald-b">*</span>
            </label>
            <input id="assistant-email" name="email" type="email" required autoComplete="email" placeholder="ton@email.fr" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="assistant-phone" className="label">
              Téléphone
            </label>
            <input id="assistant-phone" name="telephone" type="tel" autoComplete="tel" placeholder="Pour te rappeler (facultatif)" className="input" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button type="submit" disabled={pending} className="btn-primary w-full disabled:cursor-wait disabled:opacity-70">
            {pending ? 'Envoi en cours…' : 'Envoyer ma demande'}
            {!pending && <Icon name="arrow-right" className="h-[18px] w-[18px]" />}
          </button>
          <Link href={site.bookingPath} className="btn-secondary w-full" data-track="rendez-vous">
            <Icon name="calendar" className="h-[18px] w-[18px]" />
            Réserver un appel
          </Link>
        </div>
        <div aria-live="polite">
          {state.error && (
            <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/[0.08] p-4 text-sm text-red-200">
              {fr(state.error)}
            </p>
          )}
        </div>
        <p className="text-xs leading-relaxed text-txt-muted">
          Propositions générées par une IA à partir de ta description&nbsp;: je les vérifie avec toi lors de notre échange. Tes informations
          servent uniquement à répondre à ta demande.
        </p>
      </form>
    </div>
  )
}
