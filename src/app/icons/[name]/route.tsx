import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const dynamicParams = false

/** Icônes PNG générées au build (favicon, écran d'accueil mobile, logo Schema.org). */
const ICONS: Record<string, { size: number; rounded: boolean }> = {
  'favicon-48.png': { size: 48, rounded: true },
  'apple-touch-icon.png': { size: 180, rounded: false },
  'icon-192.png': { size: 192, rounded: true },
  'icon-512.png': { size: 512, rounded: true },
  'maskable-512.png': { size: 512, rounded: false },
}

export function generateStaticParams() {
  return Object.keys(ICONS).map((name) => ({ name }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const icon = ICONS[name]
  if (!icon) return new Response('Not found', { status: 404 })

  const font = await readFile(path.join(process.cwd(), 'src/fonts/og/outfit-latin-700-normal.woff'))
  const { size, rounded } = icon

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#10b981',
          borderRadius: rounded ? size * 0.22 : 0,
          color: '#0a1a10',
          fontFamily: 'Outfit',
          fontSize: size * (rounded ? 0.66 : 0.5),
          lineHeight: 1,
          paddingBottom: size * 0.04,
        }}
      >
        B
      </div>
    ),
    { width: size, height: size, fonts: [{ name: 'Outfit', data: font, weight: 700, style: 'normal' }] },
  )
}
