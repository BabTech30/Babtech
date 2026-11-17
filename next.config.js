/**
 * En ligne : Hostinger (application Node.js) construit le site avec `npm run build` et le sert en mode serveur
 * (Hostinger ajoute lui-même `output: 'standalone'`). La construction utilise webpack (`next build --webpack`) :
 * Turbopack demande environ 1,5 Go de mémoire, plus que ce que le serveur de construction de Hostinger garantit. Les pages publiques sont prérendues au build ;
 * seuls l'espace privé /admin, le forum et les pages de compte de la communauté sont rendus à la demande.
 */
/** Origine (https://hôte) d'une adresse, ou rien si elle est invalide. */
const originOf = (url) => {
  try {
    return new URL(url).origin
  } catch {
    return ''
  }
}

/**
 * Mesure d'audience (voir src/components/Analytics.tsx) : seules les origines réellement configurées sont autorisées.
 * Umami Cloud envoie ses mesures à api-gateway.umami.dev.
 */
const analyticsOrigins = [
  process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? originOf(process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io') : '',
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ? originOf(process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://cloud.umami.is') : '',
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && !process.env.NEXT_PUBLIC_UMAMI_SRC ? 'https://api-gateway.umami.dev' : '',
].filter(Boolean)

/**
 * Politique de sécurité du contenu : le navigateur refuse tout ce qui ne vient pas du site (scripts, images, polices,
 * envois de formulaires, appels réseau), sauf la vidéo YouTube (chargée au clic) et la mesure d'audience configurée.
 * « 'unsafe-inline' » reste nécessaire pour les scripts : les pages sont prérendues, Next.js y écrit ses données en ligne
 * (un jeton par requête demanderait de rendre chaque page à la demande). Toute nouvelle ressource externe s'ajoute ici.
 */
const contentSecurityPolicy = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'production' ? '' : ` 'unsafe-eval'`} ${analyticsOrigins.join(' ')}`.trim(),
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self'`,
  `connect-src 'self' ${analyticsOrigins.join(' ')}`.trim(),
  `frame-src https://www.youtube-nocookie.com`,
  `worker-src 'self'`,
  `manifest-src 'self'`,
  `media-src 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
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
