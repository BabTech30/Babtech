import type { Metadata } from 'next'
import { CopyButton } from '@/components/admin/CopyButton'
import { QrFullscreen } from '@/components/admin/QrFullscreen'
import { qrCodes, qrPath } from '@/data/qr'
import { requireAdmin } from '@/lib/admin/auth'
import { formatMonth, formatNumber } from '@/lib/admin/format'
import { scanStats } from '@/lib/admin/scans'
import { readStore } from '@/lib/admin/store'
import { qrSvg } from '@/lib/qr'
import { absoluteUrl, withTrailingSlash } from '@/lib/site'
import { fr } from '@/lib/typography'

export const metadata: Metadata = { title: { absolute: 'Partager · BabTech' } }

const panel = 'rounded-2xl border border-bord bg-nuit p-5 sm:p-6'
const h2 = 'font-outfit text-lg font-semibold tracking-tight text-white'

const tips = [
  "Imprime-les en noir sur fond blanc, avec une marge blanche autour, et d'au moins 2 cm de côté.",
  "Teste chaque QR code avec ton téléphone avant d'en imprimer une série.",
  "L'adresse courte (babtech.fr/q/…) ne change jamais : tu peux réimprimer sans crainte, même si les pages évoluent.",
  "Un même visiteur qui scanne plusieurs fois en 30 minutes n'est compté qu'une fois, et les robots ne sont pas comptés.",
]

export default async function SharePage() {
  await requireAdmin()
  const { scans } = await readStore()
  const cards = await Promise.all(
    qrCodes.map(async (qr) => {
      const url = absoluteUrl(qrPath(qr.code))
      return { ...qr, url, svg: await qrSvg(url), stats: scanStats(scans, qr.code) }
    }),
  )
  const months = Object.keys(scans).sort().reverse().slice(0, 12)

  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <p className="section-tag text-emerald-b">Administration</p>
        <h1 className="font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">Partager</h1>
        <p className="mt-3 max-w-2xl text-txt-secondary">
          Trois QR codes à imprimer ou à montrer depuis ton écran. Chaque scan est compté ici, sans aucune donnée personnelle sur la
          personne qui scanne.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <li key={c.code} className={`${panel} flex flex-col`}>
            <h2 className={h2}>{c.label}</h2>
            <p className="mt-1 text-sm text-txt-secondary">{fr(c.hint)}</p>
            <div
              role="img"
              aria-label={`QR code menant à ${c.url}`}
              className="mx-auto mt-5 w-full max-w-[220px] overflow-hidden rounded-xl bg-white [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: c.svg }}
            />
            <p className="mt-3 text-center text-sm">
              <span className="text-txt-muted">Mène à </span>
              <a href={withTrailingSlash(c.target)} target="_blank" rel="noopener" className="text-emerald-300 hover:underline">
                {absoluteUrl(c.target).replace(/^https?:\/\//, '')}
              </a>
            </p>
            <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
              {(
                [
                  ['Ce mois-ci', c.stats.month],
                  ['Mois dernier', c.stats.previous],
                  ['Au total', c.stats.total],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="rounded-xl bg-white/[0.04] px-2 py-3">
                  <dt className="text-xs text-txt-muted">{label}</dt>
                  <dd className="font-outfit text-2xl font-bold tabular-nums text-white">{formatNumber(value)}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <QrFullscreen svg={c.svg} label={c.label} url={c.url} />
              <CopyButton text={c.url} />
            </div>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <a href={`/admin/qr/${c.code}.svg`} download className="text-emerald-300 hover:underline">
                Fichier pour l&apos;impression (SVG)
              </a>
              <a href={`/admin/qr/${c.code}.png`} download className="text-emerald-300 hover:underline">
                Image (PNG)
              </a>
            </p>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className={panel} aria-labelledby="history-title">
          <h2 id="history-title" className={h2}>
            Scans par mois
          </h2>
          {months.length ? (
            <div tabIndex={0} role="region" aria-label="Scans par mois" className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[440px] text-left text-sm">
                <caption className="sr-only">Nombre de scans de chaque QR code, par mois</caption>
                <thead className="text-xs uppercase tracking-[1px] text-txt-muted">
                  <tr>
                    <th scope="col" className="py-2 pr-3 font-semibold">
                      Mois
                    </th>
                    {qrCodes.map((q) => (
                      <th key={q.code} scope="col" className="px-3 py-2 text-right font-semibold">
                        {q.label}
                      </th>
                    ))}
                    <th scope="col" className="py-2 pl-3 text-right font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((m) => (
                    <tr key={m} className="border-t border-bord">
                      <th scope="row" className="py-2.5 pr-3 font-medium capitalize text-txt-primary">
                        {formatMonth(m)}
                      </th>
                      {qrCodes.map((q) => (
                        <td key={q.code} className="px-3 py-2.5 text-right tabular-nums text-txt-secondary">
                          {formatNumber(scans[m]?.[q.code] ?? 0)}
                        </td>
                      ))}
                      <td className="py-2.5 pl-3 text-right font-semibold tabular-nums text-white">
                        {formatNumber(Object.values(scans[m] ?? {}).reduce((sum, n) => sum + n, 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-sm text-txt-secondary">
              Aucun scan pour l&apos;instant&nbsp;: les chiffres apparaîtront dès le premier scan, une fois le site en ligne.
            </p>
          )}
        </section>

        <section className={panel} aria-labelledby="tips-title">
          <h2 id="tips-title" className={h2}>
            Bien utiliser tes QR codes
          </h2>
          <ul className="mt-3 grid gap-2.5 text-sm leading-relaxed text-txt-secondary">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-b" />
                {fr(tip)}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
