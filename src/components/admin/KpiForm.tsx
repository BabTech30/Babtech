'use client'

import { useActionState, useState } from 'react'
import { type FormState, saveKpis } from '@/app/admin/actions'
import { Icon } from '@/components/Icon'
import { METRICS, type MetricKey } from '@/data/admin'
import { FormMessage } from './FormMessage'

type Saved = Record<string, Partial<Record<MetricKey, number>> & { note?: string }>

/**
 * Saisie des chiffres d'un mois ; les valeurs déjà enregistrées pour ce mois sont pré-remplies.
 * Le bloc reste ouvert ou fermé comme tu l'as laissé, même après un enregistrement.
 */
export function KpiForm({ saved, defaultMonth, initialOpen }: { saved: Saved; defaultMonth: string; initialOpen: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveKpis, {})
  const [month, setMonth] = useState(defaultMonth)
  const [open, setOpen] = useState(initialOpen)
  const current = saved[month]
  return (
    <details className="group mt-6 border-t border-bord pt-4" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-emerald-300 [&::-webkit-details-marker]:hidden">
        <Icon name="arrow-right" className="h-4 w-4 transition-transform group-open:rotate-90" />
        Saisir ou corriger un mois
      </summary>
      <form action={action} className="mt-5 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-[220px_minmax(0,1fr)]">
          <div>
            <label className="label" htmlFor="kpi-month">
              Mois
            </label>
            <input
              className="input"
              type="month"
              id="kpi-month"
              name="month"
              value={month}
              max={defaultMonth}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="kpi-note">
              Note du mois (facultatif)
            </label>
            <input
              className="input"
              id="kpi-note"
              name="note"
              key={`note-${month}`}
              defaultValue={current?.note ?? ''}
              maxLength={280}
              placeholder="Ex. : fiche Google créée le 12"
            />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.key}>
              <label className="label" htmlFor={`kpi-${m.key}`}>
                {m.label}
              </label>
              <input
                className="input"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                id={`kpi-${m.key}`}
                name={m.key}
                key={`${m.key}-${month}`}
                defaultValue={current?.[m.key] ?? ''}
                aria-describedby={`kpi-${m.key}-source`}
              />
              <p id={`kpi-${m.key}-source`} className="mt-1.5 text-xs text-txt-muted">
                {m.source}
              </p>
            </div>
          ))}
        </div>
        <FormMessage state={state} />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <button type="submit" className="btn-primary btn-sm" disabled={pending}>
            {pending ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          <span className="text-sm text-txt-muted">Chaque début de mois, reporte les chiffres du mois écoulé.</span>
        </div>
      </form>
    </details>
  )
}
