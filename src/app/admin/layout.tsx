import type { Metadata } from 'next'
import { AdminPwa } from '@/components/admin/AdminPwa'

/**
 * Espace privé : jamais indexé, jamais mis en cache, toujours rendu à la demande. Il s'installe comme
 * une application (manifeste et service worker propres à /admin/, voir admin/manifest.webmanifest et admin/sw.js).
 */
export const metadata: Metadata = {
  title: { absolute: 'Administration · BabTech' },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  manifest: '/admin/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'BabTech admin', statusBarStyle: 'black-translucent' },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/brand/admin-apple-touch-icon.png', sizes: '180x180' }],
  },
}

export const dynamic = 'force-dynamic'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-nuit-deep">
      <AdminPwa />
      {children}
    </div>
  )
}
