import QRCode from 'qrcode'
import { getQrCode, qrPath } from '@/data/qr'
import { hasSession } from '@/lib/admin/auth'
import { qrSvg } from '@/lib/qr'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

/** QR code à télécharger : /admin/qr/<code>.svg (impression) ou .png (réseaux, documents). */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  if (!(await hasSession())) return new Response('Connexion requise.', { status: 401 })
  const [, name = '', format] = /^([a-z-]+)\.(svg|png)$/.exec((await params).file) ?? []
  const qr = getQrCode(name)
  if (!qr) return new Response('QR code inconnu.', { status: 404 })

  const url = absoluteUrl(qrPath(qr.code))
  const download = { 'Content-Disposition': `attachment; filename="qr-babtech-${qr.code}.${format}"`, 'Cache-Control': 'no-store' }
  if (format === 'svg') {
    return new Response(await qrSvg(url), { headers: { ...download, 'Content-Type': 'image/svg+xml; charset=utf-8' } })
  }
  const png = await QRCode.toBuffer(url, {
    type: 'png',
    width: 1200,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#0f1923', light: '#ffffff' },
  })
  return new Response(new Uint8Array(png), { headers: { ...download, 'Content-Type': 'image/png' } })
}
