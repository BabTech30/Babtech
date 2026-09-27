import type { MetadataRoute } from 'next'

/**
 * Manifeste de l'application « tableau de bord » : l'espace /admin s'installe comme une application
 * (icône sur l'ordinateur ou le téléphone, fenêtre à part). Public, car le navigateur le lit sans
 * cookie ; il ne contient rien de privé.
 */
export const dynamic = 'force-static'

export function GET() {
  const manifest: MetadataRoute.Manifest = {
    id: '/admin/',
    name: 'BabTech — Tableau de bord',
    short_name: 'BabTech admin',
    description: 'Ton tableau de bord BabTech : demandes, rendez-vous, avancement, chiffres du mois, QR codes.',
    lang: 'fr-FR',
    start_url: '/admin/',
    scope: '/admin/',
    display: 'standalone',
    background_color: '#0b131b',
    theme_color: '#0f1923',
    icons: [
      { src: '/brand/admin-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/admin-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/admin-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Demandes', url: '/admin/demandes/' },
      { name: 'Rendez-vous', url: '/admin/rendez-vous/' },
      { name: 'Partager (QR codes)', short_name: 'Partager', url: '/admin/partager/' },
      { name: 'Réglages', url: '/admin/reglages/' },
    ],
  }
  return new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } })
}
