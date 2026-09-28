'use client'

import { reportMessage } from '@/app/communaute/forum/actions'
import { Icon } from '@/components/Icon'
import { ActionForm } from './ActionForm'

/** « Signaler » sous un message : motif facultatif, envoyé à la modération. */
export function ReportForm({ type, id }: { type: 'sujet' | 'reponse'; id: number }) {
  return (
    <details className="group">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] text-txt-muted hover:text-white [&::-webkit-details-marker]:hidden">
        <Icon name="flag" className="h-3.5 w-3.5" />
        Signaler
      </summary>
      <div className="mt-3 w-full max-w-md">
        <ActionForm action={reportMessage} submit="Envoyer le signalement" pending="Envoi…" className="space-y-3" buttonClassName="btn-secondary btn-sm">
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="id" value={id} />
          <label htmlFor={`motif-${type}-${id}`} className="label">
            Ce qui pose problème (facultatif)
          </label>
          <input id={`motif-${type}-${id}`} name="motif" type="text" maxLength={500} className="input" placeholder="Publicité, propos déplacés, hors sujet…" />
        </ActionForm>
      </div>
    </details>
  )
}
