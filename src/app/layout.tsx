import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Analytics } from '@/components/Analytics'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { founderNode, graph, organizationNode, websiteNode } from '@/lib/schema'
import { absoluteUrl, site, SITE_URL } from '@/lib/site'

const outfit = localFont({
  src: '../fonts/outfit-latin-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-outfit',
  display: 'swap',
})

// Pas de fichier italique : les rares passages en italique sont dessinés par le navigateur,
// ce qui évite de précharger 40 Ko de police sur chaque page.
const dmSans = localFont({
  src: '../fonts/dm-sans-latin-wght-normal.woff2',
  weight: '100 1000',
  style: 'normal',
  variable: '--font-dm',
  display: 'swap',
})

const verification = {
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
  ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
    ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
    : {}),
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BabTech — Sites web, applications métier et IA à Montpellier',
    template: '%s | BabTech',
  },
  description: site.shortDescription,
  applicationName: site.name,
  authors: [{ name: site.founder.name, url: absoluteUrl('/a-propos') }],
  creator: site.founder.name,
  publisher: site.name,
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180' }],
  },
  verification,
  other: {
    'geo.region': 'FR-34',
    'geo.placename': 'Montpellier',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f1923',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${outfit.variable} ${dmSans.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="Le blog BabTech" href="/blog/rss.xml" />
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
      </head>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={graph(organizationNode(), founderNode(), websiteNode())} />
        <Header />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
