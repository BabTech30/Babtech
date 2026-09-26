#!/usr/bin/env node
/**
 * Signale les pages du site aux moteurs compatibles IndexNow (Bing — donc aussi
 * ChatGPT Search et Copilot —, Yandex, Seznam, Naver…) pour une indexation rapide.
 *
 * À lancer APRÈS un déploiement :
 *   npm run indexnow                         → toutes les URLs du sitemap en ligne
 *   npm run indexnow -- /blog/mon-article    → seulement certaines pages
 *
 * L'URL du site est lue dans NEXT_PUBLIC_SITE_URL, sinon dans le dernier build (out/sitemap.xml).
 */
import { existsSync, readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

// Adresse du site : variable NEXT_PUBLIC_SITE_URL, sinon celle du dernier build (out/sitemap.xml).
const builtSitemap = new URL('../out/sitemap.xml', import.meta.url)
const builtUrl = existsSync(builtSitemap) ? readFileSync(builtSitemap, 'utf8').match(/<loc>([^<]+)<\/loc>/)?.[1] : undefined
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (builtUrl && new URL(builtUrl).origin) || 'https://agence-babtech.netlify.app').replace(/\/+$/, '')
const config = await readFile(new URL('../src/lib/site.ts', import.meta.url), 'utf8')
const key = config.match(/indexNowKey:\s*'([a-zA-Z0-9-]{8,128})'/)?.[1]

if (!key) {
  console.error('Clé IndexNow introuvable dans src/lib/site.ts')
  process.exit(1)
}

/** Même règle que le site : les pages finissent par « / », pas les fichiers. */
const withTrailingSlash = (p) => (p.endsWith('/') || /\.[a-z0-9]+$/i.test(p.split('/').pop()) ? p : `${p}/`)
let urls = process.argv
  .slice(2)
  .map((p) => (p.startsWith('http') ? p : `${siteUrl}${withTrailingSlash(p.startsWith('/') ? p : `/${p}`)}`))

if (urls.length === 0) {
  const response = await fetch(`${siteUrl}/sitemap.xml`)
  if (!response.ok) {
    console.error(`Sitemap inaccessible (${response.status}) : ${siteUrl}/sitemap.xml`)
    process.exit(1)
  }
  const xml = await response.text()
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
}

const keyCheck = await fetch(`${siteUrl}/${key}.txt`)
if (!keyCheck.ok || (await keyCheck.text()).trim() !== key) {
  console.error(`Le fichier de clé ${siteUrl}/${key}.txt n'est pas en ligne ou ne contient pas la clé.`)
  process.exit(1)
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(siteUrl).host, key, keyLocation: `${siteUrl}/${key}.txt`, urlList: urls }),
})

const messages = {
  200: 'URLs transmises.',
  202: 'URLs reçues, clé en cours de validation.',
  400: 'Requête invalide.',
  403: 'Clé refusée : vérifie le fichier de clé.',
  422: "Certaines URLs n'appartiennent pas au domaine.",
  429: 'Trop de requêtes : réessaie plus tard.',
}
console.log(`IndexNow ${response.status} — ${messages[response.status] ?? response.statusText} (${urls.length} URL${urls.length > 1 ? 's' : ''})`)
process.exit(response.ok ? 0 : 1)
