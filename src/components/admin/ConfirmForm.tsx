'use client'

/** Bouton d'action à confirmer (suppression…) : une boîte de dialogue demande « Sûr ? » avant l'envoi. */
export function ConfirmForm({
  action,
  fields,
  message,
  label,
  className,
}: {
  action: (formData: FormData) => Promise<void>
  fields: Record<string, string>
  message: string
  label: string
  className: string
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault()
      }}
    >
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  )
}
