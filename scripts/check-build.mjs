#!/usr/bin/env node
/**
 * Contrôle qualité du site généré (dossier out/), à lancer après `npm run build`.
 *
 * Vérifie : fichiers SEO/GEO présents, pages du sitemap générées, balises essentielles
 * (title, description, canonical, h1 unique, Open Graph), JSON-LD valide, liens internes
 * et images référencées existants, titres et descriptions en double.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const OUT = path.resolve('out')
const errors = []
const warnings = []

if (!existsSync(OUT)) {
  console.error("Dossier out/ absent : lance d'abord `npm run build`.")
  process.exit(1)
}

const read = (file) => readFileSync(file, 'utf8')
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')

const REQUIRED = [
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'llms-full.txt',
  'blog/rss.xml',
  'manifest.webmanifest',
  '404.html',
  'favicon.svg',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'og/default.png',
]
for (const f of REQUIRED) if (!existsSync(path.join(OUT, f))) errors.push(`Fichier manquant : ${f}`)

const sitemap = read(path.join(OUT, 'sitemap.xml'))
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
if (!locs.length) errors.push('Sitemap vide')
const siteUrl = new URL(locs[0]).origin

/** Fichier servi pour un chemin d'URL (comportement des hébergeurs statiques type Netlify). */
function fileFor(urlPath) {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0])
  if (clean === '/' || clean === '') return path.join(OUT, 'index.html')
  const trimmed = clean.replace(/\/$/, '')
  return [path.join(OUT, `${trimmed}.html`), path.join(OUT, trimmed, 'index.html'), path.join(OUT, trimmed)].find(
    (c) => existsSync(c) && statSync(c).isFile(),
  )
}

for (const loc of locs) {
  if (!fileFor(new URL(loc).pathname)) errors.push(`Sitemap → page non générée : ${loc}`)
}

const robots = read(path.join(OUT, 'robots.txt'))
if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) errors.push('robots.txt : ligne Sitemap absente ou incorrecte')
if (/Disallow:\s*\/\s*$/m.test(robots)) errors.push('robots.txt : un « Disallow: / » bloque le site')

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const seenTitles = new Map()
const seenDescriptions = new Map()
let pages = 0

for (const file of walk(OUT).filter((f) => f.endsWith('.html'))) {
  const rel = `/${path.relative(OUT, file).split(path.sep).join('/')}`
  if (rel.startsWith('/_next/') || /^\/(404|_not-found)\.html$/.test(rel) || /^\/google[0-9a-f]+\.html$/.test(rel)) continue
  pages++
  const html = read(file)
  const urlPath = rel === '/index.html' ? '/' : rel.replace(/(\/index)?\.html$/, '')
  const where = `[${urlPath}]`

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]
  if (!title) errors.push(`${where} <title> manquant`)
  else {
    const t = decode(title)
    if (t.length > 75) warnings.push(`${where} title long (${t.length} car.) : ${t}`)
    seenTitles.set(t, [...(seenTitles.get(t) ?? []), urlPath])
  }

  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]
  if (!description) errors.push(`${where} meta description manquante`)
  else {
    const d = decode(description)
    if (d.length < 70 || d.length > 170) warnings.push(`${where} description de ${d.length} car.`)
    seenDescriptions.set(d, [...(seenDescriptions.get(d) ?? []), urlPath])
  }

  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]
  const expected = `${siteUrl}${urlPath === '/' ? '' : urlPath}`
  if (!canonical) errors.push(`${where} canonical manquant`)
  else if (canonical.replace(/\/$/, '') !== expected.replace(/\/$/, '')) errors.push(`${where} canonical ${canonical} ≠ ${expected}`)

  const h1 = (html.match(/<h1[\s>]/g) ?? []).length
  if (h1 !== 1) errors.push(`${where} ${h1} balise(s) <h1> (1 attendue)`)

  if (!/<html lang="fr"/.test(html)) errors.push(`${where} attribut lang="fr" manquant`)

  const ogImage = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1]
  if (!ogImage) errors.push(`${where} og:image manquant`)
  else if (!fileFor(new URL(decode(ogImage)).pathname)) errors.push(`${where} image Open Graph introuvable : ${ogImage}`)

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(json)
      for (const [, url] of JSON.stringify(data).matchAll(/"(https?:\/\/[^"]+)"/g)) {
        if (url.startsWith(siteUrl) && !fileFor(new URL(url).pathname)) errors.push(`${where} JSON-LD → URL interne introuvable : ${url}`)
      }
    } catch (e) {
      errors.push(`${where} JSON-LD invalide : ${e.message}`)
    }
  }

  for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
    const target = decode(href)
    if (target.startsWith('/_next/') || target.startsWith('//')) continue
    if (!fileFor(target)) errors.push(`${where} lien interne cassé : ${target}`)
  }
}

for (const [t, where] of seenTitles) if (where.length > 1) errors.push(`Title en double « ${t} » : ${where.join(', ')}`)
for (const [d, where] of seenDescriptions) if (where.length > 1) warnings.push(`Description en double : ${where.join(', ')} — ${d.slice(0, 60)}…`)

console.log(`Contrôle de ${pages} pages HTML et ${locs.length} URLs du sitemap (${siteUrl})`)
for (const w of warnings) console.log(`  ⚠ ${w}`)
for (const e of errors) console.log(`  ✖ ${e}`)
if (errors.length) {
  console.log(`\n${errors.length} erreur(s), ${warnings.length} avertissement(s).`)
  process.exit(1)
}
console.log(`\n✔ Aucune erreur (${warnings.length} avertissement(s)).`)
