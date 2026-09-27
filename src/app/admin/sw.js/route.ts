/**
 * Service worker de l'application « tableau de bord » (portée : /admin/ seulement, jamais le site public).
 * Il ne met rien en cache : les pages de l'espace privé viennent toujours du serveur, à jour, et ne restent
 * pas sur l'appareil. Sans connexion, il affiche une page « Pas de connexion » au lieu de l'erreur du navigateur.
 */
export const dynamic = 'force-dynamic'

const OFFLINE_PAGE = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0f1923">
<title>Pas de connexion · BabTech</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0b131b; color: #e2e8f0;
    font: 16px/1.6 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
  main { max-width: 26rem; padding: 2rem 1.5rem; text-align: center; }
  .logo { width: 3rem; height: 3rem; margin: 0 auto 1.5rem; display: grid; place-items: center; border-radius: .8rem;
    background: #10b981; color: #0a1a10; font-weight: 700; font-size: 1.5rem; }
  h1 { margin: 0 0 .5rem; color: #fff; font-size: 1.5rem; }
  p { margin: 0 0 1.5rem; color: #b6c2d1; }
  button { border: 0; border-radius: .75rem; padding: .75rem 1.5rem; background: #10b981; color: #0a1a10;
    font: inherit; font-weight: 600; cursor: pointer; }
</style>
</head>
<body>
<main>
  <div class="logo" aria-hidden="true">B</div>
  <h1>Pas de connexion</h1>
  <p>Ton tableau de bord a besoin d’Internet pour afficher des chiffres à jour. Vérifie ta connexion, puis réessaie.</p>
  <button type="button" onclick="location.reload()">Réessayer</button>
</main>
</body>
</html>`

const SCRIPT = `// Tableau de bord BabTech : application installable, sans cache.
const OFFLINE_PAGE = ${JSON.stringify(OFFLINE_PAGE)}

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return
  event.respondWith(
    fetch(event.request).catch(
      () => new Response(OFFLINE_PAGE, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }),
    ),
  )
})
`

export function GET() {
  return new Response(SCRIPT, {
    headers: {
      'Content-Type': 'text/javascript; charset=utf-8',
      // Toujours revalidé : une nouvelle version du service worker est prise en compte au déploiement suivant.
      'Cache-Control': 'no-cache',
    },
  })
}
