import type { Metadata } from 'next'
import { absoluteUrl, site } from './site'

export type PageSeo = {
  /** Titre sans la marque (le gabarit ajoute « | BabTech »). */
  title: string
  description: string
  /** Chemin canonique, ex. « /services/creation-site-internet ». */
  path: string
  /** Clé de l'image Open Graph générée (voir lib/og.ts), ex. « services/creation-site-internet ». */
  og?: string
  ogAlt?: string
  /** Titre utilisé tel quel, sans « | BabTech » (page d'accueil). */
  absoluteTitle?: boolean
  article?: {
    publishedTime: string
    modifiedTime: string
    section: string
    tags: string[]
  }
  noindex?: boolean
}

export function ogImagePath(key = 'default') {
  return `/og/${key}.png`
}

export function pageMetadata(p: PageSeo): Metadata {
  const image = { url: ogImagePath(p.og), width: 1200, height: 630, alt: p.ogAlt ?? p.title, type: 'image/png' }
  const socialTitle = p.absoluteTitle ? p.title : `${p.title} | ${site.name}`

  return {
    title: p.absoluteTitle ? { absolute: p.title } : p.title,
    description: p.description,
    alternates: { canonical: p.path },
    openGraph: {
      type: p.article ? 'article' : 'website',
      locale: site.locale,
      siteName: site.name,
      url: p.path,
      title: socialTitle,
      description: p.description,
      images: [image],
      ...(p.article
        ? {
            publishedTime: p.article.publishedTime,
            modifiedTime: p.article.modifiedTime,
            section: p.article.section,
            tags: p.article.tags,
            authors: [absoluteUrl('/a-propos')],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: p.description,
      images: [image.url],
    },
    ...(p.noindex ? { robots: { index: false, follow: true } } : {}),
  }
}
