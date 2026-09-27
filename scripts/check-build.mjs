#!/usr/bin/env node
/**
 * Contrôle qualité du site construit, à lancer après `npm run build` (`npm run verify` enchaîne les deux).
 *
 * Démarre le site comme en production (`next start`), puis parcourt toutes les pages du sitemap et
 * celles qu'elles relient. Vérifie : fichiers SEO/GEO présents, balises essentielles (title,
 * description, canonical, h1 unique, Open Graph), JSON-LD valide, liens internes et images qui
 * répondent, URL de pages cohérentes (« / » final), titres et descriptions en double, page 404,
 * redirection www, et l'espace /admin : protégé par la connexion, jamais indexé, absent du sitemap.
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import http from 'node:http'
import { createRequire } from 'node:module'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'

const require = createRequire(import.meta.url)
/** Même réglage que Next.js : avec trailingSlash, toute URL de page se termine par « / ». */
const { trailingSlash = false } = require('../next.config.js')

if (!existsSync('.next/BUILD_ID')) {
  console.error("Site non construit : lance d'abord `npm run build`.")
  process.exit(1)
}

const errors = []
const warnings = []
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')

const port = await new Promise((resolve) => {
  const probe = net.createServer().listen(0, '127.0.0.1', () => {
    const { port: free } = probe.address()
    probe.close(() => resolve(free))
  })
})
const base = `http://127.0.0.1:${port}`
// Données de l'espace /admin : dossier jetable, le contrôle ne touche jamais aux vraies.
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'babtech-check-'))
const env = { ...process.env, NODE_ENV: 'production', ADMIN_DATA_DIR: dataDir }
delete env.ADMIN_USERNAME
delete env.ADMIN_PASSWORD
const server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '-p', String(port), '-H', '127.0.0.1'], {
  env,
  stdio: ['ignore', 'ignore', 'pipe'],
})
let serverErrors = ''
server.stderr.on('data', (chunk) => (serverErrors += chunk))

function stop(code) {
  server.kill('SIGTERM')
  rmSync(dataDir, { recursive: true, force: true })
  process.exit(code)
}

async function get(pathname) {
  const res = await fetch(base + pathname, { redirect: 'manual' })
  const type = res.headers.get('content-type') ?? ''
  const body = /text|json|xml/.test(type) ? await res.text() : (await res.arrayBuffer(), '')
  return { status: res.status, headers: res.headers, body, location: res.headers.get('location') ?? '' }
}

/** Requête avec un en-tête Host choisi (fetch ne permet pas de le changer). */
function getWithHost(pathname, host) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port, path: pathname, headers: { host } }, (res) => {
      res.resume()
      resolve({ status: res.statusCode, location: res.headers.location ?? '' })
    })
    req.on('error', reject)
  })
}

for (let i = 0; ; i++) {
  try {
    if ((await get('/robots.txt')).status === 200) break
  } catch {
    // serveur pas encore prêt
  }
  if (i > 120 || server.exitCode !== null) {
    console.error(`Le site ne démarre pas.\n${serverErrors}`)
    stop(1)
  }
  await new Promise((resolve) => setTimeout(resolve, 250))
}

/* ---------- Fichiers SEO / GEO ---------- */
const REQUIRED = [
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/llms-full.txt',
  '/blog/rss.xml',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/favicon.ico',
  '/brand/icon-512.png',
  '/brand/apple-touch-icon.png',
  '/og/default.png',
]
for (const f of REQUIRED) {
  const { status } = await get(f)
  if (status !== 200) errors.push(`Fichier ${f} : réponse ${status}`)
}

const sitemap = (await get('/sitemap.xml')).body
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
if (!locs.length) {
  console.error('Sitemap vide.')
  stop(1)
}
const siteUrl = new URL(locs[0]).origin
const siteHost = new URL(siteUrl).host

const isPage = (pathname) => !/\.[a-z0-9]+$/i.test(pathname.split('/').pop() ?? '')
/** Une URL de page doit finir par « / » si trailingSlash est actif (sinon : pas de « / » final, sauf l'accueil). */
function badSlash(pathname) {
  if (!isPage(pathname) || pathname === '/' || pathname === '') return false
  return trailingSlash ? !pathname.endsWith('/') : pathname.endsWith('/')
}
const slashRule = trailingSlash ? 'devrait finir par « / »' : 'ne devrait pas finir par « / »'

/** Statut HTTP d'un chemin interne (mis en cache). */
const statusCache = new Map()
async function statusOf(pathname) {
  const clean = pathname.split('#')[0] || '/'
  if (!statusCache.has(clean)) statusCache.set(clean, (await get(clean)).status)
  return statusCache.get(clean)
}

const robots = (await get('/robots.txt')).body
if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) errors.push('robots.txt : ligne Sitemap absente ou incorrecte')
if (/Disallow:\s*\/\s*$/m.test(robots)) errors.push('robots.txt : un « Disallow: / » bloque le site')
if (!/Disallow:\s*\/admin\//.test(robots)) errors.push('robots.txt : /admin/ devrait être exclu')

for (const loc of locs) {
  const { pathname } = new URL(loc)
  if (badSlash(pathname)) errors.push(`Sitemap → ${loc} ${slashRule}`)
  if (pathname.startsWith('/admin')) errors.push(`Sitemap → l'espace privé ${loc} ne doit pas y figurer`)
}

/* ---------- Pages ---------- */
const queue = locs.map((loc) => new URL(loc).pathname)
const queued = new Set(queue)
/** Page qui a mené à une page hors sitemap (pour situer un lien cassé). */
const referrer = new Map()
const seenTitles = new Map()
const seenDescriptions = new Map()
let pages = 0

while (queue.length) {
  const urlPath = queue.shift()
  const where = `[${urlPath}]`
  const res = await get(urlPath)
  statusCache.set(urlPath, res.status)
  if (res.status !== 200) {
    const from = referrer.has(urlPath) ? ` (lien depuis ${referrer.get(urlPath)})` : ''
    errors.push(`${where} réponse ${res.status}${res.location ? ` → ${res.location}` : ''}${from}`)
    continue
  }
  if (!(res.headers.get('content-type') ?? '').includes('text/html')) continue
  pages++
  const html = res.body

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
  const expected = `${siteUrl}${urlPath}`
  if (!canonical) errors.push(`${where} canonical manquant`)
  else if (decode(canonical) !== expected) errors.push(`${where} canonical ${canonical} ≠ ${expected}`)

  const h1 = (html.match(/<h1[\s>]/g) ?? []).length
  if (h1 !== 1) errors.push(`${where} ${h1} balise(s) <h1> (1 attendue)`)

  if (!/<html lang="fr"/.test(html)) errors.push(`${where} attribut lang="fr" manquant`)
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) errors.push(`${where} page publique marquée noindex`)

  const ogImage = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1]
  if (!ogImage) errors.push(`${where} og:image manquant`)
  else if ((await statusOf(new URL(decode(ogImage)).pathname)) !== 200) errors.push(`${where} image Open Graph introuvable : ${ogImage}`)

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(json)
      for (const [, url] of JSON.stringify(data).matchAll(/"(https?:\/\/[^"]+)"/g)) {
        if (!url.startsWith(siteUrl)) continue
        const { pathname } = new URL(url)
        if ((await statusOf(pathname)) !== 200) errors.push(`${where} JSON-LD → URL interne introuvable : ${url}`)
        else if (badSlash(pathname)) errors.push(`${where} JSON-LD → ${url} ${slashRule}`)
      }
    } catch (e) {
      errors.push(`${where} JSON-LD invalide : ${e.message}`)
    }
  }

  for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
    const target = decode(href)
    if (target.startsWith('/_next/') || target.startsWith('//')) continue
    const pathname = target.split('#')[0].split('?')[0] || '/'
    if (pathname.startsWith('/admin')) {
      errors.push(`${where} lien vers l'espace privé : ${target}`)
      continue
    }
    if (badSlash(pathname)) {
      errors.push(`${where} lien ${target} ${slashRule} (redirection inutile)`)
    } else if (isPage(pathname)) {
      // Page : parcourue à son tour (et contrôlée comme les autres).
      if (!queued.has(pathname)) {
        queued.add(pathname)
        referrer.set(pathname, urlPath)
        queue.push(pathname)
      }
    } else if ((await statusOf(pathname)) !== 200) {
      errors.push(`${where} lien interne cassé : ${target}`)
    }
  }
}

for (const [t, where] of seenTitles) if (where.length > 1) errors.push(`Title en double « ${t} » : ${where.join(', ')}`)
for (const [d, where] of seenDescriptions) if (where.length > 1) warnings.push(`Description en double : ${where.join(', ')} — ${d.slice(0, 60)}…`)

/* ---------- Comportements du serveur ---------- */
const missing = await get('/page-inexistante-controle/')
if (missing.status !== 404) errors.push(`Page inexistante : réponse ${missing.status} (404 attendu)`)

const www = await getWithHost('/services/', `www.${siteHost}`)
if (![301, 308].includes(www.status) || www.location !== `${siteUrl}/services/`) {
  errors.push(`www.${siteHost} : redirection attendue vers ${siteUrl}/services/ (reçu ${www.status} ${www.location})`)
}

const admin = await get('/admin/')
if (![302, 303, 307].includes(admin.status) || !admin.location.includes('/admin/connexion/')) {
  errors.push(`/admin/ sans connexion : redirection vers /admin/connexion/ attendue (reçu ${admin.status} ${admin.location})`)
}
for (const privatePath of ['/admin/reglages/', '/admin/export/']) {
  const res = await get(privatePath)
  if (res.status === 200) errors.push(`${privatePath} accessible sans connexion`)
}
const login = await get('/admin/connexion/')
if (login.status !== 200) errors.push(`/admin/connexion/ : réponse ${login.status}`)
if (!/<meta name="robots" content="noindex, nofollow/.test(login.body)) errors.push('/admin/connexion/ : balise robots noindex absente')
if (!(login.headers.get('x-robots-tag') ?? '').includes('noindex')) errors.push('/admin/connexion/ : en-tête X-Robots-Tag noindex absent')
if (/<header[\s>][\s\S]*?href="\/services\/"/.test(login.body)) errors.push("/admin/connexion/ : le menu du site public s'affiche")

console.log(`Contrôle de ${pages} pages HTML et ${locs.length} URLs du sitemap (${siteUrl})`)
for (const w of warnings) console.log(`  ⚠ ${w}`)
for (const e of errors) console.log(`  ✖ ${e}`)
if (errors.length) {
  console.log(`\n${errors.length} erreur(s), ${warnings.length} avertissement(s).`)
  stop(1)
}
console.log(`\n✔ Aucune erreur (${warnings.length} avertissement(s)).`)
stop(0)
