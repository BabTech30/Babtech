'use client'

import { cancelAppointment } from '@/app/admin/booking-actions'

/** Annule un rendez-vous après confirmation ; le créneau redevient libre. `notify` : un e-mail prévient la personne. */
export function CancelAppointmentButton({ id, name, notify }: { id: string; name: string; notify: boolean }) {
  return (
    <form
      action={cancelAppointment}
      onSubmit={(e) => {
        const message = notify
          ? `Annuler le rendez-vous de ${name} ? Un e-mail la prévient aussitôt, avec un lien pour choisir un autre créneau.`
          : `Annuler le rendez-vous de ${name} ? Pense à prévenir cette personne (les e-mails ne sont pas encore configurés).`
        if (!window.confirm(message)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="rounded-lg border border-white/[0.12] px-3 py-1.5 text-sm font-medium text-txt-primary hover:border-red-400/50 hover:text-red-200">
        Annuler
      </button>
    </form>
  )
}
