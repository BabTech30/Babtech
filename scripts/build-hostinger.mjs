#!/usr/bin/env node
/**
 * Prépare le site pour Hostinger en une commande :
 *
 *   npm run build:hostinger
 *
 * 1. construit le site (next build + .htaccess) et lance le contrôle qualité ;
 * 2. vérifie que l'adresse du site est bien le vrai domaine (NEXT_PUBLIC_SITE_URL, à définir
 *    dans .env.production, ex. NEXT_PUBLIC_SITE_URL=https://babtech.fr) ;
 * 3. crée hostinger-site.zip, prêt à envoyer dans public_html (hPanel → Gestionnaire de
 *    fichiers → Importer, puis « Extraire »).
 */
import { execSync } from 'node:child_process'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { zipSync } from 'fflate'

const OUT = path.resolve('out')
const ZIP = path.resolve('hostinger-site.zip')

execSync('npm run build', { stdio: 'inherit' })
execSync('node scripts/check-build.mjs', { stdio: 'inherit' })

const firstLoc = readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8').match(/<loc>([^<]+)<\/loc>/)?.[1] ?? ''
const siteUrl = new URL(firstLoc).origin
if (/\.netlify\.app$/.test(new URL(siteUrl).host)) {
  console.error(`
✖ Le site a été construit pour ${siteUrl} (l'ancienne adresse Netlify).
  Crée un fichier .env.production à la racine du projet contenant par exemple :

    NEXT_PUBLIC_SITE_URL=https://babtech.fr

  puis relance : npm run build:hostinger
`)
  process.exit(1)
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const files = {}
for (const file of walk(OUT)) {
  files[path.relative(OUT, file).split(path.sep).join('/')] = readFileSync(file)
}
writeFileSync(ZIP, zipSync(files, { level: 9 }))

const count = Object.keys(files).length
const size = (statSync(ZIP).size / 1024 / 1024).toFixed(1)
console.log(`
✔ Site prêt pour Hostinger : ${siteUrl}
  ${path.basename(ZIP)} — ${count} fichiers, ${size} Mo (y compris .htaccess)

  Mise en ligne :
  1. hPanel → Sites web → Gestionnaire de fichiers → dossier public_html
  2. Supprimer l'ancien contenu (garder le dossier .well-known s'il existe)
  3. Importer ${path.basename(ZIP)}, clic droit → Extraire, puis supprimer le zip
`)
