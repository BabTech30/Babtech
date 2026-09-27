'use client'

import { useState } from 'react'
import { Icon } from './Icon'

type Props = {
  url: string
  title: string
  text: string
  label?: string
  className?: string
}

/** Partage natif du téléphone (WhatsApp, SMS, e-mail…) ; sur ordinateur, copie le lien. */
export function ShareButton({ url, title, text, label = 'Partager', className = 'btn-secondary w-full' }: Props) {
  const [message, setMessage] = useState('')

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch (error) {
        if ((error as DOMException).name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setMessage('Lien copié\u00a0: tu peux le coller dans un message.')
    } catch {
      setMessage(`Copie impossible. Voici le lien\u00a0: ${url}`)
    }
  }

  return (
    <>
      <button type="button" onClick={share} className={className}>
        <Icon name="share" className="h-[18px] w-[18px]" />
        {label}
      </button>
      <p role="status" className="min-h-[1.25rem] text-center text-[13px] text-txt-secondary">
        {message}
      </p>
    </>
  )
}
