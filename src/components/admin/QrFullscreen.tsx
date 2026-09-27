'use client'

import { useRef } from 'react'

/** Affiche un QR code en grand, sur fond blanc, pour le faire scanner depuis ton écran. */
export function QrFullscreen({ svg, label, url }: { svg: string; label: string; url: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const close = () => dialog.current?.close()

  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()} className="btn-primary btn-sm">
        Afficher en grand
      </button>
      <dialog
        ref={dialog}
        aria-label={`QR code\u00a0: ${label}`}
        onClick={(e) => e.target === dialog.current && close()}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-white p-0 text-[#0f1923] backdrop:bg-black/80"
      >
        <div className="flex h-full flex-col items-center justify-center gap-5 p-6 text-center">
          <p className="font-outfit text-2xl font-bold">{label}</p>
          <div className="w-[min(82vw,62dvh)] [&>svg]:block [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
          <p className="break-all text-base">{url.replace(/^https?:\/\//, '')}</p>
          <button type="button" onClick={close} className="rounded-lg bg-[#0f1923] px-5 py-2.5 font-semibold text-white">
            Fermer
          </button>
        </div>
      </dialog>
    </>
  )
}
