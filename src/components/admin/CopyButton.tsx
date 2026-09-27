'use client'

import { useState } from 'react'

/** Copie un texte (un lien) dans le presse-papiers et le confirme. */
export function CopyButton({ text, label = 'Copier le lien' }: { text: string; label?: string }) {
  const [done, setDone] = useState<boolean | null>(null)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
    } catch {
      setDone(false)
    }
    window.setTimeout(() => setDone(null), 2500)
  }

  return (
    <button type="button" onClick={copy} className="btn-secondary btn-sm">
      <span aria-live="polite">{done === null ? label : done ? 'Lien copié' : 'Copie impossible'}</span>
    </button>
  )
}
