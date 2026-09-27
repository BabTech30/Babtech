#!/usr/bin/env node
/**
 * Étape lancée automatiquement après `next build` (script npm « postbuild »).
 *
 * Chez Hostinger, Next.js produit un serveur autonome (.next/standalone). Next.js n'y copie pas
 * les fichiers publics (public/) ni les fichiers statiques (.next/static) : on les ajoute, comme
 * le recommande la documentation de Next.js, pour que le site ne dépende pas d'une copie faite
 * par l'hébergeur. Sans serveur autonome (build local classique), rien à faire.
 */
import { cpSync, existsSync } from 'node:fs'

const standalone = '.next/standalone'

if (existsSync(standalone)) {
  if (existsSync('public')) cpSync('public', `${standalone}/public`, { recursive: true })
  cpSync('.next/static', `${standalone}/.next/static`, { recursive: true })
  console.log('postbuild : public/ et .next/static copiés dans le serveur autonome.')
}
