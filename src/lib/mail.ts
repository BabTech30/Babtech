import { createTransport } from 'nodemailer'
import { updateStore } from '@/lib/admin/store'
import { site } from '@/lib/site'

/**
 * E-mails envoyés par le site depuis contact@babtech.fr, par le serveur d'envoi (SMTP) d'Hostinger :
 * alertes pour toi, confirmations pour tes clients. Le mot de passe de la boîte est la variable
 * SMTP_PASSWORD (hPanel), jamais dans le code. Sans elle, rien ne part, mais rien ne se perd :
 * demandes et rendez-vous restent dans le tableau de bord.
 */
export const MAIL_FROM = process.env.SMTP_USER || site.email
const HOST = process.env.SMTP_HOST || 'smtp.hostinger.com'
const PORT = Number(process.env.SMTP_PORT) || 465
const SENDER_NAME = `${site.founder.name} · ${site.name}`

export type Mail = {
  to: string
  subject: string
  text: string
  html: string
  replyTo?: string
  attachments?: { filename: string; content: string; contentType: string }[]
}

export const mailConfigured = () => Boolean(process.env.SMTP_PASSWORD)

let transporter: ReturnType<typeof createTransport> | undefined
function transport() {
  transporter ??= createTransport({
    host: HOST,
    port: PORT,
    // 465 : connexion chiffrée d'emblée ; 587 : chiffrement négocié (STARTTLS).
    secure: PORT === 465,
    auth: { user: MAIL_FROM, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  })
  return transporter
}

/**
 * Envoie les e-mails (chacun indépendamment) et renvoie, dans le même ordre, ceux qui sont partis.
 * Le résultat du dernier envoi est gardé pour Réglages : c'est là que tu vois si la configuration marche.
 */
export async function sendMails(mails: Mail[]): Promise<boolean[]> {
  if (!mailConfigured() || !mails.length) return mails.map(() => false)
  const results = await Promise.allSettled(mails.map((mail) => transport().sendMail({ from: { name: SENDER_NAME, address: MAIL_FROM }, ...mail })))
  const failure = results.find((r): r is PromiseRejectedResult => r.status === 'rejected')
  if (failure) console.error('e-mail non envoyé', failure.reason)
  const code = failure ? String((failure.reason as { code?: unknown })?.code ?? 'ERREUR') : undefined
  try {
    await updateStore((store) => {
      store.mailLast = { ok: !failure, at: new Date().toISOString(), ...(code ? { code } : {}) }
    })
  } catch (error) {
    console.error('e-mail : résultat non enregistré', error)
  }
  return results.map((r) => r.status === 'fulfilled')
}

/** Cause probable d'un échec d'envoi, et quoi faire (codes d'erreur de Nodemailer). */
export function mailProblem(code: string) {
  if (code === 'EAUTH' || code === 'ENOAUTH') {
    return `mot de passe refusé. Vérifie la variable SMTP_PASSWORD : c'est le mot de passe de la boîte ${MAIL_FROM}.`
  }
  if (['ECONNECTION', 'ETIMEDOUT', 'ESOCKET', 'EDNS', 'ETLS'].includes(code)) {
    return `serveur d'envoi injoignable (${HOST}). Réessaie plus tard ; si ça dure, vérifie que la boîte ${MAIL_FROM} existe dans hPanel → Emails.`
  }
  if (code === 'EENVELOPE') return "adresse refusée par le serveur d'envoi (adresse du destinataire invalide ?)."
  if (code === 'EMESSAGE') return "message refusé par le serveur d'envoi (limite d'envoi quotidienne atteinte ?)."
  return `erreur ${code} renvoyée par le serveur d'envoi.`
}
