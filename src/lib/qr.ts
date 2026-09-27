import QRCode from 'qrcode'

/**
 * QR code en SVG, généré côté serveur (au build pour les pages publiques).
 * Foncé sur fond blanc avec une marge : lisible par l'appareil photo de n'importe quel téléphone.
 */
export function qrSvg(text: string) {
  return QRCode.toString(text, {
    type: 'svg',
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#0f1923', light: '#ffffff' },
  })
}
