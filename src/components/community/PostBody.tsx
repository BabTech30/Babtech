import { Fragment } from 'react'

/**
 * Message d'un membre : texte brut découpé en paragraphes, adresses web transformées en liens « ugc nofollow »
 * (Google sait qu'ils viennent des membres, pas du site). Aucun HTML saisi n'est interprété.
 */
const URL = /(https?:\/\/[^\s<>"]+|www\.[^\s<>"]+)/gi
const TRAILING = /[.,;:!?)\]»'"]+$/

function linkify(line: string) {
  return line.split(URL).map((part, i) => {
    if (i % 2 === 0) return part
    const tail = part.match(TRAILING)?.[0] ?? ''
    const url = tail ? part.slice(0, -tail.length) : part
    const href = url.toLowerCase().startsWith('www.') ? `https://${url}` : url
    return (
      <Fragment key={i}>
        <a href={href} rel="ugc nofollow noopener noreferrer" target="_blank" className="break-all text-emerald-b underline decoration-emerald-b/40 underline-offset-2 hover:decoration-emerald-b">
          {url}
        </a>
        {tail}
      </Fragment>
    )
  })
}

export function PostBody({ text }: { text: string }) {
  return (
    <div className="space-y-3 break-words text-[15.5px] leading-[1.75] text-txt-secondary">
      {text.split(/\n{2,}/).map((paragraph, i) => (
        <p key={i}>
          {paragraph.split('\n').map((line, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {linkify(line)}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  )
}
