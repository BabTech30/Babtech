import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const dynamicParams = false

/**
 * Icônes PNG générées au build (favicon, écran d'accueil mobile, logo Schema.org). Les icônes « admin- »
 * (B vert sur fond sombre) distinguent l'application du tableau de bord de celle du site ; le « badge »
 * (B blanc sur fond transparent) est la petite icône des notifications sur Android.
 */
const ICONS: Record<string, { size: number; rounded: boolean; admin?: boolean; badge?: boolean }> = {
  'favicon-48.png': { size: 48, rounded: true },
  'apple-touch-icon.png': { size: 180, rounded: false },
  'icon-192.png': { size: 192, rounded: true },
  'icon-512.png': { size: 512, rounded: true },
  'maskable-512.png': { size: 512, rounded: false },
  'admin-192.png': { size: 192, rounded: true, admin: true },
  'admin-512.png': { size: 512, rounded: true, admin: true },
  'admin-maskable-512.png': { size: 512, rounded: false, admin: true },
  'admin-apple-touch-icon.png': { size: 180, rounded: false, admin: true },
  'admin-badge-96.png': { size: 96, rounded: false, badge: true },
}

export function generateStaticParams() {
  return Object.keys(ICONS).map((name) => ({ name }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const icon = ICONS[name]
  if (!icon) return new Response('Not found', { status: 404 })

  const font = await readFile(path.join(process.cwd(), 'src/fonts/og/outfit-latin-700-normal.woff'))
  const { size, rounded, admin, badge } = icon

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: badge ? 'transparent' : admin ? '#0f1923' : '#10b981',
          borderRadius: rounded ? size * 0.22 : 0,
          color: badge ? '#ffffff' : admin ? '#10b981' : '#0a1a10',
          fontFamily: 'Outfit',
          fontSize: size * (rounded ? 0.66 : badge ? 0.8 : 0.5),
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
