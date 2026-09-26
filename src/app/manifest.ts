import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BabTech — Studio digital & IA à Montpellier',
    short_name: 'BabTech',
    description: site.shortDescription,
    lang: 'fr-FR',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1923',
    theme_color: '#0f1923',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
