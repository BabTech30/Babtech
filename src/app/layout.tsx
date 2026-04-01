import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'BabTech — Solutions digitales pour commerces et TPE',
    template: '%s | BabTech',
  },
  description: 'Sites vitrines, outils métier, automatisations IA. Bastien, ancien entrepreneur BTP, crée le digital qui fait tourner ton business.',
  metadataBase: new URL('https://babtech.fr'),
  openGraph: {
    title: 'BabTech — Le digital qui fait tourner ton business',
    description: 'Solutions digitales sur mesure pour commerces, artisans et TPE. Par un ancien entrepreneur qui connaît ta réalité.',
    url: 'https://babtech.fr',
    siteName: 'BabTech',
    locale: 'fr_FR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: { icon: '/favicon.svg' },
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': ['ProfessionalService', 'Organization'],
  name: 'BabTech',
  description: 'Solutions digitales sur mesure pour commerces, artisans et TPE. Sites vitrines, outils métier, automatisations IA.',
  url: 'https://babtech.fr',
  email: 'babferrer@icloud.com',
  founder: {
    '@type': 'Person',
    name: 'Bastien',
    jobTitle: 'Freelance digital',
    description: 'Ancien entrepreneur BTP (14 ans), reconverti dans le digital pour aider les artisans et TPE.',
  },
  areaServed: { '@type': 'Country', name: 'France' },
  serviceType: ['Site vitrine', 'Application web', 'Automatisation IA', 'SEO local'],
  priceRange: '$$',
  knowsAbout: ['développement web', 'PWA', 'automatisation n8n', 'SEO local', 'outils digitaux TPE', 'QR menu restaurant'],
  sameAs: [],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
