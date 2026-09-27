/**
 * Données structurées Schema.org (JSON-LD).
 *
 * Toutes les entités sont reliées par des @id stables : Google et les moteurs IA
 * comprennent ainsi qui est BabTech, qui est Bastien, ce qu'il propose et où.
 */
import { services, type Service } from '@/data/services'
import { zones } from '@/data/zones'
import type { FaqItem } from '@/data/faq'
import type { PostMeta } from './blog'
import { ogImagePath } from './seo'
import { absoluteUrl, site, SITE_URL, socialLinks } from './site'

type Json = Record<string, unknown>
export type Crumb = { name: string; path: string }

export const ids = {
  organization: `${SITE_URL}/#organization`,
  founder: `${SITE_URL}/#founder`,
  website: `${SITE_URL}/#website`,
  logo: `${SITE_URL}/#logo`,
  blog: `${SITE_URL}/blog/#blog`,
}

const pageUrl = (path: string) => absoluteUrl(path)
const webPageId = (path: string) => `${pageUrl(path)}#webpage`

export function graph(...nodes: (Json | false | undefined | null)[]) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) }
}

const WIKIPEDIA = {
  montpellier: 'https://fr.wikipedia.org/wiki/Montpellier',
  metropole: 'https://fr.wikipedia.org/wiki/Montpellier_M%C3%A9diterran%C3%A9e_M%C3%A9tropole',
  herault: 'https://fr.wikipedia.org/wiki/H%C3%A9rault_(d%C3%A9partement)',
  occitanie: 'https://fr.wikipedia.org/wiki/Occitanie_(r%C3%A9gion_administrative)',
}

export const knowsAbout = [
  'Création de sites internet',
  'Référencement local (SEO local)',
  'Generative Engine Optimization (GEO)',
  'Google Business Profile',
  'Applications web progressives (PWA)',
  'Applications métier sur mesure',
  'Sites de réservation pour locations saisonnières',
  'Automatisation de processus (n8n)',
  'Intelligence artificielle générative',
  'Transformation numérique des TPE',
  "Formation à l'intelligence artificielle",
]

function geoCoordinates() {
  return { '@type': 'GeoCoordinates', latitude: site.geo.latitude, longitude: site.geo.longitude }
}

export function areaServed() {
  return [
    { '@type': 'City', name: 'Montpellier', sameAs: WIKIPEDIA.montpellier },
    { '@type': 'AdministrativeArea', name: 'Montpellier Méditerranée Métropole', sameAs: WIKIPEDIA.metropole },
    ...zones.map((z) => ({ '@type': 'City', name: z.name, sameAs: z.wikipedia })),
    { '@type': 'AdministrativeArea', name: 'Hérault', sameAs: WIKIPEDIA.herault },
    { '@type': 'AdministrativeArea', name: 'Occitanie', sameAs: WIKIPEDIA.occitanie },
  ]
}

function postalAddress() {
  const a = site.address
  return {
    '@type': 'PostalAddress',
    ...(a.streetAddress ? { streetAddress: a.streetAddress } : {}),
    addressLocality: a.locality,
    ...(a.postalCode ? { postalCode: a.postalCode } : {}),
    addressRegion: a.region,
    addressCountry: a.country,
  }
}

function serviceOffer(s: Service): Json {
  return {
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: s.name, url: pageUrl(`/services/${s.slug}`) },
    ...(s.priceFrom
      ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: s.priceFrom, priceCurrency: 'EUR' } }
      : {}),
  }
}

/** L'entreprise : ProfessionalService est un sous-type de LocalBusiness (donc Organization). */
export function organizationNode(): Json {
  return {
    '@type': 'ProfessionalService',
    '@id': ids.organization,
    name: site.name,
    url: pageUrl('/'),
    description: site.description,
    slogan: site.tagline,
    logo: {
      '@type': 'ImageObject',
      '@id': ids.logo,
      url: absoluteUrl('/brand/icon-512.png'),
      contentUrl: absoluteUrl('/brand/icon-512.png'),
      width: 512,
      height: 512,
      caption: site.name,
    },
    image: absoluteUrl(ogImagePath('default')),
    email: site.email,
    ...(site.phone ? { telephone: site.phone } : {}),
    priceRange: site.priceRange,
    currenciesAccepted: 'EUR',
    address: postalAddress(),
    geo: geoCoordinates(),
    areaServed: [
      {
        '@type': 'GeoCircle',
        geoMidpoint: geoCoordinates(),
        geoRadius: String(site.serviceRadiusKm * 1000),
      },
      ...areaServed(),
    ],
    founder: { '@id': ids.founder },
    knowsAbout,
    knowsLanguage: 'fr-FR',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: site.email,
      ...(site.phone ? { telephone: site.phone } : {}),
      availableLanguage: ['French'],
      areaServed: 'FR',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services BabTech',
      itemListElement: services.map(serviceOffer),
    },
    ...(socialLinks.length ? { sameAs: socialLinks } : {}),
  }
}

export function founderNode(): Json {
  const f = site.founder
  return {
    '@type': 'Person',
    '@id': ids.founder,
    name: f.name,
    givenName: f.givenName,
    familyName: f.familyName,
    jobTitle: f.jobTitle,
    description: f.description,
    image: absoluteUrl(f.photo),
    url: pageUrl('/a-propos'),
    worksFor: { '@id': ids.organization },
    knowsAbout,
    knowsLanguage: 'fr-FR',
    ...(f.sameAs.length ? { sameAs: f.sameAs } : {}),
  }
}

export function websiteNode(): Json {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: pageUrl('/'),
    name: site.name,
    description: site.shortDescription,
    inLanguage: site.lang,
    publisher: { '@id': ids.organization },
  }
}

type WebPageInput = {
  path: string
  name: string
  description: string
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'FAQPage' | 'ItemPage' | 'ProfilePage'
  og?: string
  breadcrumb?: boolean
  datePublished?: string
  dateModified?: string
  mainEntity?: Json | Json[]
  about?: Json
}

export function webPageNode(p: WebPageInput): Json {
  return {
    '@type': p.type ?? 'WebPage',
    '@id': webPageId(p.path),
    url: pageUrl(p.path),
    name: p.name,
    description: p.description,
    inLanguage: site.lang,
    isPartOf: { '@id': ids.website },
    about: p.about ?? { '@id': ids.organization },
    primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(ogImagePath(p.og)), width: 1200, height: 630 },
    ...(p.breadcrumb === false ? {} : { breadcrumb: { '@id': `${pageUrl(p.path)}#breadcrumb` } }),
    ...(p.datePublished ? { datePublished: p.datePublished } : {}),
    ...(p.dateModified ? { dateModified: p.dateModified } : {}),
    ...(p.mainEntity ? { mainEntity: p.mainEntity } : {}),
  }
}

export function breadcrumbNode(path: string, crumbs: Crumb[]): Json {
  const all: Crumb[] = [{ name: 'Accueil', path: '/' }, ...crumbs]
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl(path)}#breadcrumb`,
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: pageUrl(c.path),
    })),
  }
}

function questions(items: FaqItem[]) {
  return items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  }))
}

/** Bloc FAQ d'une page (distinct de la page elle-même). */
export function faqNode(path: string, items: FaqItem[]): Json | undefined {
  if (!items.length) return undefined
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl(path)}#faq`,
    url: pageUrl(path),
    inLanguage: site.lang,
    isPartOf: { '@id': ids.website },
    mainEntity: questions(items),
  }
}

export function faqMainEntity(items: FaqItem[]) {
  return questions(items)
}

type ServiceInput = {
  service: Service
  path: string
  name?: string
  description?: string
  area?: Json | Json[]
}

export function serviceNode({ service, path, name, description, area }: ServiceInput): Json {
  return {
    '@type': 'Service',
    '@id': `${pageUrl(path)}#service`,
    name: name ?? service.name,
    serviceType: service.name,
    description: description ?? service.summary,
    url: pageUrl(path),
    provider: { '@id': ids.organization },
    areaServed: area ?? areaServed(),
    audience: {
      '@type': 'BusinessAudience',
      audienceType: service.audienceType ?? 'TPE, artisans, commerçants, restaurateurs et indépendants',
    },
    ...(service.priceFrom
      ? {
          offers: {
            '@type': 'Offer',
            url: pageUrl(path),
            priceCurrency: 'EUR',
            price: service.priceFrom,
            priceSpecification: { '@type': 'PriceSpecification', minPrice: service.priceFrom, priceCurrency: 'EUR' },
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
    isRelatedTo: service.related.map((slug) => ({ '@type': 'Service', url: pageUrl(`/services/${slug}`) })),
  }
}

export function blogPostingNode(post: PostMeta): Json {
  const path = `/blog/${post.slug}`
  return {
    '@type': 'BlogPosting',
    '@id': `${pageUrl(path)}#article`,
    headline: post.title,
    description: post.description,
    url: pageUrl(path),
    mainEntityOfPage: { '@id': webPageId(path) },
    image: absoluteUrl(ogImagePath(`blog/${post.slug}`)),
    datePublished: post.date,
    dateModified: post.updated,
    inLanguage: site.lang,
    author: { '@id': ids.founder },
    publisher: { '@id': ids.organization },
    isPartOf: { '@id': ids.blog },
    articleSection: post.categoryName,
    keywords: post.tags.join(', '),
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingMinutes}M`,
  }
}

export function blogNode(posts: PostMeta[]): Json {
  return {
    '@type': 'Blog',
    '@id': ids.blog,
    name: 'Le blog BabTech',
    url: pageUrl('/blog'),
    description: "Digital, IA et référencement pour les TPE de Montpellier et de l'Hérault.",
    inLanguage: site.lang,
    publisher: { '@id': ids.organization },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      '@id': `${pageUrl(`/blog/${p.slug}`)}#article`,
      headline: p.title,
      url: pageUrl(`/blog/${p.slug}`),
      datePublished: p.date,
    })),
  }
}
