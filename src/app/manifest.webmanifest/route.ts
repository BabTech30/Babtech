import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

/**
 * Manifeste du site public, déclaré par `metadata.manifest` dans app/layout.tsx. Servi par une route plutôt que par le
 * fichier spécial app/manifest.ts : avec la compilation webpack, ce fichier serait relié à toutes les pages, y compris
 * /admin, qui doit garder son propre manifeste (admin/manifest.webmanifest).
 */
export const dynamic = 'force-static'

export function GET() {
  const manifest: MetadataRoute.Manifest = {
    name: 'BabTech — Studio digital & IA à Montpellier',
    short_name: 'BabTech',
    description: site.shortDescription,
    lang: 'fr-FR',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1923',
    theme_color: '#0f1923',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
  return new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } })
}
