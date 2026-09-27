import { getQrCode } from '@/data/qr'
import { countScan, isBot, visitorKey } from '@/lib/admin/scans'
import { withTrailingSlash } from '@/lib/site'

/** Adresse courte des QR codes : compte le scan (voir src/lib/admin/scans.ts), puis redirige. */
export const dynamic = 'force-dynamic'

type Context = { params: Promise<{ code: string }> }

const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }

async function scan(request: Request, { params }: Context, count: boolean) {
  const qr = getQrCode((await params).code)
  if (!qr) return new Response('QR code inconnu.', { status: 404, headers })
  if (count && !isBot(request.headers.get('user-agent') ?? '')) {
    try {
      await countScan(qr.code, visitorKey(request))
    } catch (error) {
      // Le visiteur passe quand même : un scan non compté vaut mieux qu'une page d'erreur.
      console.error('QR code : scan non enregistré', error)
    }
  }
  return new Response(null, { status: 302, headers: { ...headers, Location: withTrailingSlash(qr.target) } })
}

export const GET = (request: Request, context: Context) => scan(request, context, true)

/** Les vérificateurs de liens envoient souvent HEAD : on redirige sans compter. */
export const HEAD = (request: Request, context: Context) => scan(request, context, false)
