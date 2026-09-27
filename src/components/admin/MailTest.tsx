'use client'

import { useActionState } from 'react'
import type { FormState } from '@/app/admin/actions'
import { sendTestMail } from '@/app/admin/request-actions'
import { FormMessage } from './FormMessage'

/** Réglages → E-mails : envoie un e-mail de test à ta boîte et affiche le résultat. */
export function MailTest() {
  const [state, action, pending] = useActionState<FormState, FormData>(sendTestMail, {})
  return (
    <form action={action} className="mt-4 grid gap-3">
      <button type="submit" className="btn-secondary btn-sm justify-self-start" disabled={pending}>
        {pending ? 'Envoi…' : 'Envoyer un e-mail de test'}
      </button>
      <FormMessage state={state} />
    </form>
  )
}
