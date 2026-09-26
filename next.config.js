/** @type {import('next').NextConfig} */
const nextConfig = {
  // Site 100 % statique : `npm run build` produit le dossier out/, à copier dans public_html chez Hostinger.
  output: 'export',
  // Chaque page est exportée en dossier/index.html (ex. /services/ → services/index.html) :
  // indispensable sur les serveurs Apache/LiteSpeed comme Hostinger, qui ne devinent pas l'extension .html.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
