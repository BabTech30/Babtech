/**
 * En ligne : Hostinger (application Node.js) construit le site avec `npm run build` et le sert en mode serveur
 * (Hostinger ajoute lui-même `output: 'standalone'`). Les pages restent toutes prérendues au build.
 *
 * Contrôle qualité : `npm run check` construit une copie statique du site dans out/ (BABTECH_STATIC_EXPORT=1)
 * pour vérifier chaque page (liens, balises SEO, données structurées…).
 */
const staticExport = process.env.BABTECH_STATIC_EXPORT === '1'

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
]

/** Réglages du serveur (ignorés par l'export statique). */
const serverRules = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Fichiers pour les assistants IA : lisibles par les robots, absents des résultats Google.
      { source: '/:file(llms|llms-full).txt', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
    ]
  },
  async redirects() {
    // Un seul domaine : www.babtech.fr → babtech.fr
    return [
      {
        source: '/:path(.*)',
        has: [{ type: 'host', value: 'www\\.(?<domain>.+)' }],
        destination: 'https://:domain/:path',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    // Les navigateurs demandent /favicon.ico par défaut.
    return [{ source: '/favicon.ico', destination: '/brand/favicon-48.png' }]
  },
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Toutes les URL de pages finissent par « / » (ex. /services/) : construire les liens avec absoluteUrl().
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(staticExport ? { output: 'export' } : serverRules),
}

module.exports = nextConfig
