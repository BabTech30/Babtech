'use client'

import { useActionState } from 'react'
import { type FormState, login } from '@/app/admin/actions'
import { FormMessage } from './FormMessage'

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {})
  return (
    <form action={action} className="mt-7 grid gap-5">
      <div>
        <label className="label" htmlFor="admin-username">
          Identifiant
        </label>
        <input className="input" id="admin-username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} required />
      </div>
      <div>
        <label className="label" htmlFor="admin-password">
          Mot de passe
        </label>
        <input className="input" id="admin-password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <FormMessage state={state} />
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  )
}
