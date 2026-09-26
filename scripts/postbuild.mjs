#!/usr/bin/env node
/**
 * Étape lancée automatiquement après `next build` (script npm « postbuild »).
 *
 * 1. Écrit out/.htaccess pour les serveurs Apache / LiteSpeed (Hostinger) : HTTPS forcé,
 *    domaine unique (avec ou sans www selon le domaine du site), page 404, en-têtes de
 *    sécurité, cache, types de fichiers, robots IA.
 * 2. Écrit out/_next/static/.htaccess : cache long pour les fichiers versionnés de Next.js.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const OUT = path.resolve('out')
if (!existsSync(OUT)) {
  console.error('postbuild : dossier out/ introuvable.')
  process.exit(1)
}

// L'adresse du site est lue dans le sitemap généré : .htaccess et pages ne peuvent pas diverger.
const firstLoc = readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8').match(/<loc>([^<]+)<\/loc>/)?.[1]
if (!firstLoc) {
  console.error('postbuild : sitemap.xml sans URL.')
  process.exit(1)
}
const siteUrl = new URL(firstLoc).origin
const host = new URL(siteUrl).host
const platformHost = /\.(netlify\.app|hostingersite\.com|vercel\.app|pages\.dev|github\.io)$/i.test(host)
const escape = (s) => s.replace(/\./g, '\\.')

/** Redirection vers le domaine principal (www ↔ sans www), uniquement pour un vrai domaine. */
function canonicalHostRules() {
  if (platformHost) return '  # (domaine de plateforme : pas de règle www)\n'
  const bare = host.replace(/^www\./, '')
  const other = host.startsWith('www.') ? bare : `www.${bare}`
  return [
    `  # 2. Domaine principal : ${host} (${other} y est redirigé)`,
    `  RewriteCond %{HTTP_HOST} ^${escape(other)}$ [NC]`,
    `  RewriteRule ^ https://${host}%{REQUEST_URI} [L,R=301]`,
    '',
  ].join('\n')
}

const htaccess = `# ------------------------------------------------------------------------------
# BabTech — configuration Apache / LiteSpeed (Hostinger)
# Fichier généré par scripts/postbuild.mjs : ne pas le modifier dans out/,
# modifier le script puis relancer le build.
# Domaine principal : ${siteUrl}
# ------------------------------------------------------------------------------

Options -Indexes
DirectoryIndex index.html
AddDefaultCharset UTF-8
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On

  # 1. HTTPS obligatoire (sans boucle derrière un CDN ou un proxy)
  RewriteCond %{HTTPS} off
  RewriteCond %{HTTP:X-Forwarded-Proto} !https
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

${canonicalHostRules()}
  # 3. Les navigateurs demandent /favicon.ico par défaut
  RewriteRule ^favicon\\.ico$ /brand/favicon-48.png [L]
</IfModule>

# Fichiers cachés (.htaccess, état de synchronisation FTP…) : jamais servis.
<FilesMatch "^\\.">
  <IfModule mod_authz_core.c>
    Require all denied
  </IfModule>
  <IfModule !mod_authz_core.c>
    Order allow,deny
    Deny from all
  </IfModule>
</FilesMatch>

<IfModule mod_mime.c>
  AddType application/manifest+json .webmanifest
  AddType image/svg+xml .svg
  AddCharset UTF-8 .html .txt .xml .json .webmanifest .css .js
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css text/xml application/javascript application/json application/xml application/rss+xml application/manifest+json image/svg+xml
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Frame-Options "DENY"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

  # Pages et fichiers texte : toujours revalidés, pour voir tout de suite chaque mise à jour.
  <FilesMatch "\\.(html|txt|xml|json|webmanifest)$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
  # Images de partage, icônes, favicon.
  <FilesMatch "\\.(png|svg|ico)$">
    Header set Cache-Control "public, max-age=604800"
  </FilesMatch>
  # Flux RSS
  <FilesMatch "^rss\\.xml$">
    Header set Content-Type "application/rss+xml; charset=utf-8"
  </FilesMatch>
  # Fichiers pour les assistants IA : lisibles par les robots, absents des résultats Google.
  <FilesMatch "^llms(-full)?\\.txt$">
    Header set X-Robots-Tag "noindex"
  </FilesMatch>
</IfModule>
`

const staticHtaccess = `# Fichiers versionnés par Next.js (leur nom change à chaque modification) : cache d'un an.
<IfModule mod_headers.c>
  Header set Cache-Control "public, max-age=31536000, immutable"
</IfModule>
`

writeFileSync(path.join(OUT, '.htaccess'), htaccess)
const staticDir = path.join(OUT, '_next', 'static')
mkdirSync(staticDir, { recursive: true })
writeFileSync(path.join(staticDir, '.htaccess'), staticHtaccess)
console.log(`postbuild : .htaccess écrit pour ${siteUrl}`)
