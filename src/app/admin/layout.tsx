import type { Metadata } from 'next'

/** Espace privé : jamais indexé, jamais mis en cache, toujours rendu à la demande. */
export const metadata: Metadata = {
  title: { absolute: 'Administration · BabTech' },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export const dynamic = 'force-dynamic'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-nuit-deep">{children}</div>
}
