#!/usr/bin/env node
/**
 * Prépare le site pour Hostinger en une commande :
 *
 *   npm run build:hostinger
 *
 * Construit le site (avec son .htaccess), lance le contrôle qualité, puis crée
 * hostinger-site.zip, prêt à importer dans public_html (hPanel → Gestionnaire de
 * fichiers → Importer, puis « Extraire »).
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
  (autre nom de domaine ? change DEFAULT_SITE_URL dans src/lib/site.ts et relance)

  ${path.basename(ZIP)} — ${count} fichiers, ${size} Mo (y compris .htaccess)

  Mise en ligne :
  1. hPanel → Gestionnaire de fichiers → dossier public_html
  2. Supprimer l'ancien contenu (garder le dossier .well-known s'il existe)
  3. Importer ${path.basename(ZIP)}, clic droit → Extraire, puis supprimer le zip
`)
