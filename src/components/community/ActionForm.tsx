'use client'

import { type ReactNode, startTransition, useActionState } from 'react'
import { Icon } from '@/components/Icon'
import { fr } from '@/lib/typography'

export type ActionState = { ok?: string; error?: string; sent?: boolean }

/**
 * Formulaire de la communauté relié à une Server Action : bouton qui patiente, message d'erreur ou de réussite,
 * et vue de remplacement une fois l'envoi fait (`sentView`, ex. « Vérifie ta boîte mail »).
 * Les champs saisis restent en place en cas d'erreur (envoi manuel plutôt que remise à zéro du formulaire).
 */
export function ActionForm({
  action,
  submit,
  pending: pendingLabel,
  children,
  sentView,
  confirm,
  className = 'space-y-5',
  buttonClassName = 'btn-primary w-full sm:w-auto',
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  submit: string
  pending: string
  children: ReactNode
  sentView?: ReactNode
  /** Question posée avant l'envoi (suppression…). */
  confirm?: string
  className?: string
  buttonClassName?: string
}) {
  const [state, formAction, pending] = useActionState(action, {})

  if (state.sent && sentView) return <div role="status">{sentView}</div>

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        e.preventDefault()
        if (confirm && !window.confirm(confirm)) return
        const data = new FormData(e.currentTarget)
        startTransition(() => formAction(data))
      }}
      className={className}
    >
      {children}
      <button type="submit" disabled={pending} className={`${buttonClassName} disabled:cursor-wait disabled:opacity-70`}>
        {pending ? pendingLabel : submit}
        {!pending && <Icon name="arrow-right" className="h-[18px] w-[18px]" />}
      </button>
      <div aria-live="polite">
        {state.error && (
          <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/[0.08] p-4 text-sm text-red-200">
            {fr(state.error)}
          </p>
        )}
        {state.ok && (
          <p role="status" className="rounded-xl border border-emerald-b/30 bg-emerald-b/[0.08] p-4 text-sm text-emerald-200">
            {fr(state.ok)}
          </p>
        )}
      </div>
    </form>
  )
}
