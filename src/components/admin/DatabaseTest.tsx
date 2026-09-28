'use client'

import { useActionState } from 'react'
import type { FormState } from '@/app/admin/actions'
import { testDatabase } from '@/app/admin/community-actions'
import { FormMessage } from './FormMessage'

/** Réglages → Communauté : teste la connexion à la base MySQL et affiche la cause d'un échec. */
export function DatabaseTest() {
  const [state, action, pending] = useActionState<FormState, FormData>(testDatabase, {})
  return (
    <form action={action} className="mt-4 grid gap-3">
      <button type="submit" className="btn-secondary btn-sm justify-self-start" disabled={pending}>
        {pending ? 'Test en cours…' : 'Tester la connexion'}
      </button>
      <FormMessage state={state} />
    </form>
  )
}
