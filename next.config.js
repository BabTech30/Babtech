/**
 * En ligne : Hostinger (application Node.js) construit le site avec `npm run build` et le sert en mode serveur
 * (Hostinger ajoute lui-même `output: 'standalone'`). La construction utilise webpack (`next build --webpack`) :
 * Turbopack demande environ 1,5 Go de mémoire, plus que ce que le serveur de construction de Hostinger garantit. Les pages publiques sont toutes prérendues au build ;
 * seul l'espace privé /admin est rendu à la demande.
 */
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Toutes les URL de pages finissent par « / » (ex. /services/) : construire les liens avec absoluteUrl().
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Fichiers pour les assistants IA : lisibles par les robots, absents des résultats Google.
      { source: '/:file(llms|llms-full).txt', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
      // Espace privé : jamais indexé.
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
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

module.exports = nextConfig
