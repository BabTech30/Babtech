'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Icon } from './Icon'

type Props = {
  id: string
  title: string
  /** Miniature hébergée sur le site (16:9) : rien n'est chargé depuis YouTube avant le clic. */
  thumbnail: string
}

/**
 * Vidéo YouTube « au clic » : la page ne contacte YouTube (Google) que si le visiteur lance la lecture.
 * Pas de cookie avant le clic, donc pas de bandeau de consentement (voir la page Confidentialité).
 */
export function YouTubeVideo({ id, title, thumbnail }: Props) {
  const [playing, setPlaying] = useState(false)
  const watchUrl = `https://www.youtube.com/watch?v=${id}`

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-bord bg-nuit-deep">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full">
            <Image src={thumbnail} alt="" width={640} height={360} className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-b text-[#0a1a10] shadow-lg shadow-black/40 transition-transform group-hover:scale-105 group-focus-visible:scale-105">
                <Icon name="play" className="ml-1 h-7 w-7" strokeWidth={2.25} />
              </span>
            </span>
            <span className="sr-only">Lire la vidéo «&nbsp;{title}&nbsp;» (YouTube)</span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-txt-muted">
        Vidéo hébergée sur YouTube&nbsp;: elle ne se charge que si tu la lances, et YouTube applique alors sa propre politique de
        cookies.{' '}
        <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-b hover:underline">
          Voir sur YouTube <Icon name="external" className="h-3.5 w-3.5" />
        </a>
      </figcaption>
    </figure>
  )
}
