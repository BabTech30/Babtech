import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import { getOgEntries } from '@/lib/og'
import { SITE_URL } from '@/lib/site'
import { fr } from '@/lib/typography'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return getOgEntries().map((entry) => ({ key: `${entry.key}.png`.split('/') }))
}

const fontDir = path.join(process.cwd(), 'src/fonts/og')

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params
  const id = key.join('/').replace(/\.png$/, '')
  const entry = getOgEntries().find((e) => e.key === id)
  if (!entry) return new Response('Not found', { status: 404 })

  const [outfit, dmSans] = await Promise.all([
    readFile(path.join(fontDir, 'outfit-latin-700-normal.woff')),
    readFile(path.join(fontDir, 'dm-sans-latin-500-normal.woff')),
  ])
  const host = new URL(SITE_URL).host
  const titleSize = entry.title.length > 70 ? 54 : entry.title.length > 45 ? 62 : 72

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: '#0f1923',
          backgroundImage:
            'radial-gradient(circle at 88% 8%, rgba(16,185,129,0.22), transparent 42%), radial-gradient(circle at 8% 100%, rgba(196,168,125,0.16), transparent 40%)',
          color: '#e2e8f0',
          fontFamily: 'DM Sans',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: '#10b981',
                color: '#0a1a10',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Outfit',
                fontSize: 36,
              }}
            >
              B
            </div>
            <div style={{ display: 'flex', fontFamily: 'Outfit', fontSize: 38, color: '#ffffff' }}>
              Bab<span style={{ color: '#10b981' }}>Tech</span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              color: '#c4a87d',
              border: '1px solid rgba(196,168,125,0.35)',
              borderRadius: 999,
              padding: '10px 22px',
            }}
          >
            {entry.eyebrow}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontFamily: 'Outfit',
            fontSize: titleSize,
            lineHeight: 1.1,
            color: '#ffffff',
            letterSpacing: -1,
            maxWidth: 1000,
          }}
        >
          {fr(entry.title)}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 24 }}>
          <div style={{ display: 'flex', color: '#9aa9bc' }}>Sites web · Applications métier · IA & automatisation</div>
          <div style={{ display: 'flex', color: '#10b981' }}>{host}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Outfit', data: outfit, weight: 700, style: 'normal' },
        { name: 'DM Sans', data: dmSans, weight: 500, style: 'normal' },
      ],
    },
  )
}
