'use client'

import { useActionState } from 'react'
import { changePassword, type FormState } from '@/app/admin/actions'
import { FormMessage } from './FormMessage'

export function PasswordForm({ minLength }: { minLength: number }) {
  const [state, action, pending] = useActionState<FormState, FormData>(changePassword, {})
  return (
    <form action={action} className="grid max-w-md gap-5" key={state.ok ?? 'form'}>
      <div>
        <label className="label" htmlFor="password-current">
          Mot de passe actuel
        </label>
        <input className="input" id="password-current" name="current" type="password" autoComplete="current-password" required />
      </div>
      <div>
        <label className="label" htmlFor="password-next">
          Nouveau mot de passe
        </label>
        <input
          className="input"
          id="password-next"
          name="next"
          type="password"
          autoComplete="new-password"
          minLength={minLength}
          aria-describedby="password-hint"
          required
        />
        <p id="password-hint" className="mt-2 text-xs text-txt-muted">
          Au moins {minLength} caractères. Une phrase de plusieurs mots est facile à retenir et difficile à deviner.
        </p>
      </div>
      <div>
        <label className="label" htmlFor="password-confirm">
          Nouveau mot de passe, une seconde fois
        </label>
        <input className="input" id="password-confirm" name="confirm" type="password" autoComplete="new-password" minLength={minLength} required />
      </div>
      <FormMessage state={state} />
      <div>
        <button type="submit" className="btn-primary btn-sm" disabled={pending}>
          {pending ? 'Enregistrement…' : 'Changer le mot de passe'}
        </button>
      </div>
    </form>
  )
}
