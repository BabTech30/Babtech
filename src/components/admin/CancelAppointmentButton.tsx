'use client'

import { cancelAppointment } from '@/app/admin/booking-actions'

/** Annule un rendez-vous après confirmation ; le créneau redevient libre. */
export function CancelAppointmentButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={cancelAppointment}
      onSubmit={(e) => {
        if (!window.confirm(`Annuler le rendez-vous de ${name} ? Pense à prévenir cette personne.`)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="rounded-lg border border-white/[0.12] px-3 py-1.5 text-sm font-medium text-txt-primary hover:border-red-400/50 hover:text-red-200">
        Annuler
      </button>
    </form>
  )
}
