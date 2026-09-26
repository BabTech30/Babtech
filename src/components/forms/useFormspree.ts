'use client'

import { useState } from 'react'
import { track } from '@/components/Analytics'

export type FormStatus = 'idle' | 'sending' | 'success' | 'error'

/**
 * Envoi AJAX vers Formspree (réponse JSON), avec repli naturel : sans JavaScript,
 * le <form action=… method="POST"> classique continue de fonctionner.
 */
export function useFormspree(endpoint: string, eventName: string) {
  const [status, setStatus] = useState<FormStatus>('idle')

  async function submit(form: HTMLFormElement, transform?: (data: FormData) => FormData) {
    setStatus('sending')
    try {
      const data = transform ? transform(new FormData(form)) : new FormData(form)
      const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      if (!response.ok) throw new Error(`Formspree ${response.status}`)
      setStatus('success')
      form.reset()
      track(eventName)
    } catch {
      setStatus('error')
    }
  }

  return { status, submit, setStatus }
}
