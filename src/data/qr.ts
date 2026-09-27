/**
 * QR codes à imprimer ou à montrer (espace /admin → Partager). Chacun mène à une adresse courte,
 * babtech.fr/q/<code>/, qui compte le scan puis redirige vers la page : l'adresse imprimée ne change
 * jamais, même si la page de destination change un jour.
 */
export type QrCode = {
  code: string
  label: string
  /** Page de destination (chemin du site). */
  target: string
  hint: string
}

export const qrCodes = [
  {
    code: 'presentation',
    label: 'Ma présentation',
    target: '/bastien',
    hint: 'Qui tu es, ce que tu fais, ton parcours et un projet : pour un salon, un rendez-vous, ton véhicule.',
  },
  {
    code: 'site',
    label: 'Le site babtech.fr',
    target: '/',
    hint: "La page d'accueil : pour une vitrine, un flyer, une facture.",
  },
  {
    code: 'carte',
    label: 'Ma carte de visite',
    target: '/carte',
    hint: 'Ton contact à enregistrer en un geste : pour ta carte imprimée ou ta signature.',
  },
] as const satisfies readonly QrCode[]

export type QrCodeName = (typeof qrCodes)[number]['code']

export function getQrCode(code: string) {
  return qrCodes.find((q) => q.code === code)
}

/** Adresse courte encodée dans le QR code (le compteur de scans). */
export const qrPath = (code: QrCodeName) => `/q/${code}`
