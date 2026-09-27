import type { Appointment } from '@/data/booking'
import { topicLabel } from '@/data/booking'
import { type InboxRequest, SOURCE_LABELS } from '@/data/requests'
import { formatDay } from '@/lib/admin/format'
import { clientEvent, whenText } from '@/lib/booking/calendar'
import { frTime, utcToParis } from '@/lib/booking/time'
import { buildCalendar } from '@/lib/ics'
import { MAIL_FROM, type Mail } from '@/lib/mail'
import { absoluteUrl, formatPhone, site, telLink } from '@/lib/site'
import { fr } from '@/lib/typography'

/**
 * Modèles des e-mails envoyés depuis contact@babtech.fr : une version HTML sobre (lisible dans tous les
 * logiciels de messagerie) et une version texte. Tout ce qu'un visiteur a saisi est échappé.
 */
const esc = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c)
const multiline = (value: string) => esc(value).replace(/\r?\n/g, '<br>')
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name

const p = (html: string) => `<p style="margin:0 0 14px">${html}</p>`
const h = (text: string) => `<h2 style="margin:22px 0 8px;font-size:15px;color:#0f1923">${esc(text)}</h2>`
const quote = (text: string) =>
  `<div style="margin:0 0 14px;padding:12px 14px;border-left:3px solid #10b981;background:#f3f6f8;border-radius:6px">${multiline(text)}</div>`
const button = (href: string, label: string) =>
  `<p style="margin:20px 0"><a href="${esc(href)}" style="display:inline-block;padding:11px 18px;border-radius:8px;background:#10b981;color:#0a1a10;font-weight:600;text-decoration:none">${esc(label)}</a></p>`
/** Tableau « libellé : valeur » ; les valeurs sont déjà du HTML sûr. */
const rows = (items: [string, string | undefined][]) =>
  `<table role="presentation" style="margin:0 0 14px;border-collapse:collapse">${items
    .filter((item): item is [string, string] => Boolean(item[1]))
    .map(
      ([label, value]) =>
        `<tr><td style="padding:3px 14px 3px 0;color:#52606d;vertical-align:top;white-space:nowrap">${esc(label)}</td><td style="padding:3px 0">${value}</td></tr>`,
    )
    .join('')}</table>`
const link = (href: string, label: string) => `<a href="${esc(href)}" style="color:#047857">${esc(label)}</a>`

/** Ton numéro, sans retour à la ligne au milieu. */
const phone = formatPhone().replace(/ /g, '\u00a0')
const signature = `${site.founder.name}\n${site.name} · ${phone} · ${new URL(site.url).host}`

function layout(title: string, body: string) {
  const footer = `${esc(site.name)} · ${esc(site.founder.name)} · ${link(telLink(), phone)} · ${link(`mailto:${site.email}`, site.email)} · ${link(absoluteUrl('/'), new URL(site.url).host)}`
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#eef2f5">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f5;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1f2933">
<tr><td style="padding:18px 24px;background:#0f1923"><span style="display:inline-block;width:30px;height:30px;line-height:30px;text-align:center;border-radius:8px;background:#10b981;color:#0a1a10;font-weight:700">B</span><span style="margin-left:10px;color:#ffffff;font-weight:700;font-size:17px;vertical-align:middle">BabTech</span></td></tr>
<tr><td style="padding:24px">${body}</td></tr>
<tr><td style="padding:14px 24px;background:#f5f7f9;font-size:12px;color:#52606d">${footer}</td></tr>
</table></td></tr></table>
</body></html>`
}

const receivedOn = (iso: string) => {
  const { date, time } = utcToParis(Date.parse(iso))
  return `le ${formatDay(date)} à ${frTime(time)}`
}

const ALERT_TITLES = { contact: 'Nouvelle demande', assistant: 'Nouvelle demande (assistant IA)', communaute: 'Nouveau membre fondateur' }

/** Pour toi : une nouvelle demande. « Répondre » écrit directement à la personne. */
export function requestAlert(r: InboxRequest): Mail {
  const title = ALERT_TITLES[r.source]
  const who = `${r.name}${r.company ? ` (${r.company})` : ''}`
  const html = layout(
    title,
    [
      `<h1 style="margin:0 0 6px;font-size:20px;color:#0f1923">${esc(title)}</h1>`,
      p(`<span style="color:#52606d">Reçue ${esc(receivedOn(r.createdAt))} · ${esc(SOURCE_LABELS[r.source])}</span>`),
      rows([
        ['Nom', esc(r.name)],
        ['Activité', r.company && esc(r.company)],
        ['E-mail', link(`mailto:${r.email}`, r.email)],
        ['Téléphone', r.phone && link(telLink(r.phone), r.phone)],
        ['Ville', r.city && esc(r.city)],
        ['Budget', r.budget && esc(r.budget)],
        ['Besoin', r.need && esc(r.need)],
      ]),
      h('Message'),
      quote(r.message),
      r.details ? h('Compléments') + quote(r.details) : '',
      p(`Réponds simplement à cet e-mail : ta réponse partira à ${esc(r.email)}.`),
      button(absoluteUrl('/admin/demandes/'), 'Ouvrir dans le tableau de bord'),
    ].join(''),
  )
  const text = [
    `${title} (${SOURCE_LABELS[r.source]}), reçue ${receivedOn(r.createdAt)}`,
    '',
    `Nom : ${r.name}`,
    r.company && `Activité : ${r.company}`,
    `E-mail : ${r.email}`,
    r.phone && `Téléphone : ${r.phone}`,
    r.city && `Ville : ${r.city}`,
    r.budget && `Budget : ${r.budget}`,
    r.need && `Besoin : ${r.need}`,
    '',
    'Message :',
    r.message,
    r.details && `\nCompléments :\n${r.details}`,
    '',
    `Réponds à cet e-mail pour écrire à ${r.email}. Tableau de bord : ${absoluteUrl('/admin/demandes/')}`,
  ]
    .filter((line): line is string => typeof line === 'string')
    .join('\n')
  return { to: MAIL_FROM, replyTo: r.email, subject: fr(`${title} : ${who}`), text, html }
}

/** Pour la personne : accusé de réception de sa demande (ou bienvenue, pour la communauté). */
export function requestReceipt(r: InboxRequest): Mail {
  const hello = `Bonjour ${firstName(r.name)},`
  if (r.source === 'communaute') {
    const subject = 'Bienvenue dans la communauté BabTech'
    const lines = [
      'Merci de rejoindre les membres fondateurs de la communauté BabTech !',
      "Tu seras parmi les premiers informés des ateliers, des rencontres et de l'ouverture de l'espace en ligne. Les thèmes que tu as choisis m'aident à construire le programme.",
      "Une question, une idée ? Réponds simplement à cet e-mail. Et pour te désinscrire, réponds « désinscription » : c'est fait dans la journée.",
    ].map(fr)
    return {
      to: r.email,
      subject,
      text: [hello, '', ...lines.flatMap((l) => [l, '']), 'À bientôt,', signature].join('\n'),
      html: layout(subject, [p(esc(hello)), ...lines.map((l) => p(esc(l))), p('À bientôt,'), p(multiline(signature))].join('')),
    }
  }
  const subject = fr('Bien reçu : ta demande à BabTech')
  const intro = fr("Merci pour ton message : je l'ai bien reçu et je te réponds sous 24 heures.")
  const call = fr('Pour aller plus vite, tu peux aussi réserver un appel découverte gratuit de 30 minutes :')
  const booking = absoluteUrl(site.bookingPath)
  return {
    to: r.email,
    subject,
    text: [hello, '', intro, '', `${call} ${booking}`, '', 'Ton message :', r.message, '', 'À très vite,', signature].join('\n'),
    html: layout(
      subject,
      [p(esc(hello)), p(esc(intro)), p(esc(call)), button(booking, 'Réserver un appel'), h('Ton message'), quote(r.message), p('À très vite,'), p(multiline(signature))].join(''),
    ),
  }
}

const how = (a: Appointment) =>
  a.mode === 'telephone' ? `par téléphone : je t'appelle au ${a.phone ?? 'numéro indiqué'}` : "en visio : je t'envoie le lien par e-mail avant le rendez-vous"

/** Pour toi : un nouveau rendez-vous. */
export function bookingAlert(a: Appointment): Mail {
  const when = whenText(a)
  const subject = fr(`Nouveau rendez-vous : ${a.name}, ${when}`)
  const html = layout(
    subject,
    [
      `<h1 style="margin:0 0 12px;font-size:20px;color:#0f1923">Nouveau rendez-vous</h1>`,
      rows([
        ['Quand', `${esc(when)} (heure de Paris)`],
        ['Durée', `${a.minutes} minutes`],
        ['Mode', a.mode === 'telephone' ? 'Téléphone' : 'Visio'],
        ['Nom', esc(a.name)],
        ['Activité', a.company && esc(a.company)],
        ['E-mail', link(`mailto:${a.email}`, a.email)],
        ['Téléphone', a.phone && link(telLink(a.phone), a.phone)],
        ['Sujet', esc(topicLabel(a.topic))],
      ]),
      a.message ? h('Message') + quote(a.message) : '',
      p(`Réponds à cet e-mail pour écrire à ${esc(a.email)}.`),
      button(absoluteUrl('/admin/rendez-vous/'), 'Voir dans le tableau de bord'),
    ].join(''),
  )
  const text = [
    `Nouveau rendez-vous : ${when} (heure de Paris), ${a.minutes} minutes, ${a.mode === 'telephone' ? 'téléphone' : 'visio'}`,
    '',
    `Nom : ${a.name}`,
    ...(a.company ? [`Activité : ${a.company}`] : []),
    `E-mail : ${a.email}`,
    ...(a.phone ? [`Téléphone : ${a.phone}`] : []),
    `Sujet : ${topicLabel(a.topic)}`,
    ...(a.message ? ['', 'Message :', a.message] : []),
    '',
    `Tableau de bord : ${absoluteUrl('/admin/rendez-vous/')}`,
  ].join('\n')
  return { to: MAIL_FROM, replyTo: a.email, subject, text, html }
}

/** Pour la personne : confirmation, avec le fichier à ajouter à son agenda. */
export function bookingConfirmation(a: Appointment): Mail {
  const when = whenText(a)
  const subject = fr(`Rendez-vous confirmé : ${when}`)
  const hello = `Bonjour ${firstName(a.name)},`
  const lines = [
    "C'est noté, notre appel découverte est confirmé.",
    'Le fichier joint ajoute le rendez-vous à ton agenda.',
    `Un empêchement ? Réponds simplement à cet e-mail ou appelle-moi au ${phone}.`,
  ].map(fr)
  return {
    to: a.email,
    subject,
    text: [
      hello,
      '',
      lines[0],
      '',
      `Quand : ${when} (heure de Paris), ${a.minutes} minutes`,
      `Comment : ${how(a)}`,
      `Sujet : ${topicLabel(a.topic)}`,
      '',
      lines[1],
      lines[2],
      '',
      'À bientôt,',
      signature,
    ].join('\n'),
    html: layout(
      subject,
      [
        p(esc(hello)),
        p(esc(lines[0])),
        rows([
          ['Quand', `<strong>${esc(when)}</strong> (heure de Paris)`],
          ['Durée', `${a.minutes} minutes`],
          ['Comment', esc(how(a))],
          ['Sujet', esc(topicLabel(a.topic))],
        ]),
        p(esc(lines[1])),
        p(esc(lines[2])),
        p('À bientôt,'),
        p(multiline(signature)),
      ].join(''),
    ),
    attachments: [{ filename: 'rendez-vous-babtech.ics', content: buildCalendar(site.name, [clientEvent(a)]), contentType: 'text/calendar; charset=utf-8' }],
  }
}

/** Pour la personne : son rendez-vous est annulé (depuis le tableau de bord). */
export function bookingCancelled(a: Appointment): Mail {
  const when = whenText(a)
  const subject = fr(`Rendez-vous annulé : ${when}`)
  const hello = `Bonjour ${firstName(a.name)},`
  const lines = [`Je dois malheureusement annuler notre rendez-vous du ${when}. Désolé pour ce contretemps.`, 'Choisis un autre créneau quand tu veux :'].map(fr)
  const booking = absoluteUrl(site.bookingPath)
  return {
    to: a.email,
    subject,
    text: [hello, '', lines[0], '', `${lines[1]} ${booking}`, "ou réponds à cet e-mail pour qu'on trouve un moment ensemble.", '', 'À bientôt,', signature].join('\n'),
    html: layout(
      subject,
      [
        p(esc(hello)),
        p(esc(lines[0])),
        p(esc(lines[1])),
        button(booking, 'Choisir un autre créneau'),
        p("Ou réponds à cet e-mail pour qu'on trouve un moment ensemble."),
        p('À bientôt,'),
        p(multiline(signature)),
      ].join(''),
    ),
  }
}

/** Test depuis Réglages. */
export function testMail(): Mail {
  const subject = fr("Test d'envoi : BabTech")
  const line = fr(`C'est parfait : les e-mails du site partent bien depuis ${MAIL_FROM}. Tu n'as rien d'autre à faire.`)
  return { to: MAIL_FROM, subject, text: line, html: layout(subject, p(esc(line))) }
}
