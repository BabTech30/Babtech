import { fr } from '@/lib/typography'

/** Message de réussite ou d'erreur sous un formulaire de l'espace /admin. */
export function FormMessage({ state }: { state: { error?: string; ok?: string } }) {
  if (state.error) {
    return (
      <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-sm text-red-200">
        {fr(state.error)}
      </p>
    )
  }
  if (state.ok) {
    return (
      <p role="status" className="rounded-lg border border-emerald-b/30 bg-emerald-b/10 px-3.5 py-2.5 text-sm text-emerald-200">
        {fr(state.ok)}
      </p>
    )
  }
  return null
}
