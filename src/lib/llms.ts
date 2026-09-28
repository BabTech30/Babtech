/**
 * Génère /llms.txt (sommaire) et /llms-full.txt (version complète), selon la
 * convention llmstxt.org : un point d'entrée clair et factuel pour les assistants IA.
 */
import { categories } from '@/data/blog'
import { community } from '@/data/community'
import { faqGroups } from '@/data/faq'
import { forumCategories } from '@/data/forum'
import { caseStudies } from '@/data/portfolio'
import { process, services } from '@/data/services'
import { departments, inCity, zonesIn } from '@/data/zones'
import { formatDate, getAllPosts, getPost } from './blog'
import { absoluteUrl, formatPhone, site } from './site'

const link = (title: string, path: string, desc?: string) =>
  `- [${title}](${absoluteUrl(path)})${desc ? `: ${desc}` : ''}`

function keyFacts() {
  return [
    `- Activité : création de sites internet, applications métier sur mesure (PWA), sites de réservation pour locations saisonnières, automatisations et intégrations d'IA, référencement local et GEO (visibilité dans les assistants IA), accompagnement et formation à l'IA pour les TPE.`,
    `- Fondateur : ${site.founder.name}. ${site.founder.description}`,
    `- Entreprise : ${site.founder.name}, entrepreneur individuel, nom commercial ${site.name}, SIRET ${site.legal.siret}.`,
    `- Localisation : basé près de Montpellier (${site.address.department}, ${site.address.region}, France), siège au ${site.legal.postalAddress}. Intervient dans l'Hérault (Montpellier et sa métropole, Sète, Béziers, Agde, Lunel…) et dans le Gard (Nîmes, Alès, Uzès, Le Grau-du-Roi…) ; accompagnement à distance partout en France.`,
    '- Tarifs indicatifs : site vitrine à partir de 800 € ; application métier à partir de 1 500 € ; automatisation et IA à partir de 3 000 € ; site de réservation pour locations saisonnières (1 à 4 logements ou chambres) à partir de 250 €, tableau de bord en option (+ 350 €), maintenance à partir de 35 € par mois ; référencement local et GEO inclus dans les sites ; formation sur devis. Devis gratuit.',
    '- Délais : site vitrine livré en 2 à 4 semaines, avec validation du client à chaque étape.',
    `- Contact : ${site.email}${site.phone ? ` · ${formatPhone()}` : ''} · premier rendez-vous gratuit de 30 minutes à réserver sur ${absoluteUrl(site.bookingPath)} · réponse sous 24 heures.`,
  ]
}

export function buildLlmsTxt(): string {
  const posts = getAllPosts()
  return [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    ...keyFacts(),
    '',
    'In English: BabTech is a digital studio near Montpellier (Hérault, southern France) run by Bastien Ferrer, a former construction-business owner. It builds websites, custom business apps (PWA), direct-booking websites for holiday rentals and AI automations (n8n) for small businesses in the Hérault and Gard departments (Montpellier, Nîmes, Béziers, Sète, Alès…), and offers local SEO, GEO (visibility in AI assistants) and AI training.',
    '',
    '## Services',
    ...services.map((s) => link(s.name, `/services/${s.slug}`, s.priceFrom ? s.summary : `${s.summary} (${s.priceLabel})`)),
    '',
    "## Zones d'intervention",
    link(
      "Zones d'intervention",
      '/zones-intervention',
      "Hérault et Gard : les villes accompagnées, de Montpellier à Nîmes, et les autres communes desservies.",
    ),
    ...departments.flatMap((d) => [
      '',
      `### ${d.name}`,
      ...zonesIn(d.name).map((z) => link(`BabTech ${inCity(z.name)} (${z.postalCode})`, `/zones-intervention/${z.slug}`, z.lead)),
    ]),
    '',
    '## Blog',
    ...posts.map((p) => link(p.title, `/blog/${p.slug}`, p.description)),
    '',
    '## Entreprise',
    link('À propos', '/a-propos', `Parcours de ${site.founder.name} et méthode de travail.`),
    link('Réalisations', '/portfolio', caseStudies.map((c) => `${c.title} (${c.sector})`).join(', ')),
    link('FAQ', '/faq', 'Tarifs, délais, méthode, référencement, IA.'),
    link('Communauté', '/communaute', community.tagline),
    link(
      'Forum de la communauté',
      '/communaute/forum',
      `Questions et retours d'expérience entre entrepreneurs, en lecture libre : ${forumCategories.map((c) => c.name).join(', ')}.`,
    ),
    link('Contact', '/contact', 'Formulaire, email et prise de rendez-vous.'),
    '',
    '## Optional',
    link('Version complète (llms-full.txt)', '/llms-full.txt', 'Tout le contenu du site en texte brut.'),
    link('Flux RSS du blog', '/blog/rss.xml'),
    link('Mentions légales', '/mentions-legales'),
    '',
  ].join('\n')
}

export async function buildLlmsFullTxt(): Promise<string> {
  const posts = getAllPosts()
  const out: string[] = [
    `# ${site.name} — informations complètes`,
    '',
    `> ${site.description}`,
    '',
    `Site : ${absoluteUrl('/')}`,
    '',
    '## En bref',
    ...keyFacts(),
    '',
    '## Méthode de travail',
    ...process.map((step, i) => `${i + 1}. ${step.title} — ${step.desc}`),
    '',
    '## Services',
  ]

  for (const s of services) {
    out.push(
      '',
      `### ${s.name}`,
      `URL : ${absoluteUrl(`/services/${s.slug}`)}`,
      `Positionnement : ${s.badge}`,
      `Tarif : ${s.priceLabel}. ${s.priceNote}`,
      ...(s.duration ? [`Délai : ${s.duration}`] : []),
      '',
      s.lead,
      '',
      'Pour qui :',
      ...s.audience.map((a) => `- ${a}`),
      '',
      'Ce qui est proposé :',
      ...s.deliverables.map((d) => `- ${d.title} : ${d.desc}`),
      '',
      `Résultat : ${s.result}`,
      '',
      'Questions fréquentes :',
      ...s.faq.flatMap((f) => [`Q : ${f.q}`, `R : ${f.a}`]),
    )
  }

  out.push('', '## Réalisations')
  for (const c of caseStudies) {
    out.push('', `### ${c.title} (${c.sector})`, c.context, '', ...c.delivered.map((d) => `- ${d}`), '', `Résultat : ${c.result}`)
  }

  out.push('', "## Zones d'intervention")
  for (const z of departments.flatMap((d) => zonesIn(d.name))) {
    out.push(
      '',
      `### ${z.name} (${z.postalCode}, ${z.department})`,
      `URL : ${absoluteUrl(`/zones-intervention/${z.slug}`)}`,
      z.lead,
      '',
      ...z.context,
      '',
      'Métiers accompagnés :',
      ...z.sectors.map((s) => `- ${s.name} : ${s.need}`),
      '',
      'Questions fréquentes :',
      ...z.faq.flatMap((f) => [`Q : ${f.q}`, `R : ${f.a}`]),
    )
  }

  out.push('', '## Questions fréquentes')
  for (const g of faqGroups) {
    out.push('', `### ${g.title}`, ...g.items.flatMap((f) => [`Q : ${f.q}`, `R : ${f.a}`]))
  }

  out.push(
    '',
    `## ${community.name}`,
    `URL : ${absoluteUrl('/communaute')}`,
    `Statut : ${community.status}`,
    '',
    community.intro,
    '',
    'Formats :',
    ...community.formats.map((f) => `- ${f.title} : ${f.desc}`),
    '',
    'Thèmes :',
    ...community.themes.map((t) => `- ${t}`),
    '',
    `Forum (${absoluteUrl('/communaute/forum')}) : lecture libre, écriture avec un compte gratuit confirmé par e-mail. Thèmes du forum :`,
    ...forumCategories.map((c) => `- ${c.name} : ${c.description}`),
  )

  out.push('', '## Articles du blog', '', `Thématiques : ${categories.map((c) => c.name).join(', ')}.`)
  for (const meta of posts) {
    const post = await getPost(meta.slug)
    if (!post) continue
    out.push(
      '',
      `### ${post.title}`,
      `URL : ${absoluteUrl(`/blog/${post.slug}`)} · Publié le ${formatDate(post.date)} · ${post.categoryName} · Auteur : ${site.founder.name}`,
      '',
      ...(post.tldr.length ? ["L'essentiel :", ...post.tldr.map((t) => `- ${t}`), ''] : []),
      post.markdown.trim(),
      ...(post.faq.length ? ['', 'Questions fréquentes :', ...post.faq.flatMap((f) => [`Q : ${f.q}`, `R : ${f.a}`])] : []),
    )
  }

  out.push('')
  return out.join('\n')
}
