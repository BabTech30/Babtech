'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Icon } from './Icon'

/** Minuscules, sans accents : « deja » trouve « déjà ». */
const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

/**
 * Recherche dans la FAQ. Les questions restent toutes dans le HTML (lisibles par Google et les IA) :
 * la recherche masque seulement celles qui ne contiennent pas les mots saisis, et les rubriques devenues vides.
 */
export function FaqSearch({ total }: { total: number }) {
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(total)

  const filter = (value: string) => {
    setQuery(value)
    const words = normalize(value).split(/\s+/).filter(Boolean)
    let count = 0
    document.querySelectorAll<HTMLElement>('[data-faq-group]').forEach((group) => {
      let inGroup = 0
      group.querySelectorAll<HTMLElement>('details.faq-item').forEach((item) => {
        const text = normalize(item.textContent ?? '')
        const match = words.every((word) => text.includes(word))
        item.hidden = !match
        if (match) inGroup += 1
      })
      group.hidden = inGroup === 0
      count += inGroup
    })
    setShown(count)
  }

  const searching = query.trim() !== ''
  return (
    <div className="container-b pb-8">
      <label htmlFor="faq-recherche" className="mb-2 block text-sm font-medium text-txt-primary">
        Chercher dans les {total} questions
      </label>
      <div className="relative max-w-[560px]">
        <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-txt-muted" />
        <input
          id="faq-recherche"
          type="search"
          value={query}
          onChange={(e) => filter(e.target.value)}
          placeholder="Ex. prix, délai, Google, Airbnb, forum…"
          autoComplete="off"
          className="input w-full pl-11"
        />
      </div>
      <p className="mt-3 text-sm text-txt-secondary" role="status">
        {!searching ? (
          <>Tape un mot : la liste se réduit aux questions qui en parlent.</>
        ) : shown > 0 ? (
          <>
            {shown} question{shown > 1 ? 's' : ''} sur {total}.
          </>
        ) : (
          <>
            Aucune question ne contient « {query.trim()} ».{' '}
            <Link href="/contact" className="font-medium text-emerald-b hover:underline">
              Pose-la-moi directement
            </Link>
            &nbsp;: réponse sous 24 heures.
          </>
        )}
      </p>
    </div>
  )
}
