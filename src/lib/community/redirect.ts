import { refresh } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Fin d'une Server Action de la communauté : la page affichée est rechargée depuis le serveur, puis on redirige.
 * Sans cela, une redirection vers la même page (seule l'ancre #reponse-… change) peut laisser l'ancienne version à
 * l'écran. À appeler hors d'un bloc try (la redirection passe par une exception).
 */
export function goTo(path: string): never {
  refresh()
  redirect(path)
}

/** Adresse de retour envoyée par un formulaire : seulement une page de la communauté (pas de redirection ouverte). */
export function safeReturn(value: FormDataEntryValue | null, fallback: string) {
  const path = String(value ?? '')
  return /^\/communaute\/[a-z0-9/_?=&#.-]*$/i.test(path) && !path.includes('//') ? path : fallback
}
