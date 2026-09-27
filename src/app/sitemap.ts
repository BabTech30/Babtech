import type { MetadataRoute } from 'next'
import { categories } from '@/data/blog'
import { services } from '@/data/services'
import { zones } from '@/data/zones'
import { getAllPosts } from '@/lib/blog'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-static'

/** Date de dernière mise à jour des pages fixes : à changer quand leur contenu évolue. */
const PAGES_UPDATED_AT = '2026-09-27'

type Entry = MetadataRoute.Sitemap[number]

function entry(path: string, priority: number, changeFrequency: Entry['changeFrequency'], lastModified = PAGES_UPDATED_AT): Entry {
  return { url: absoluteUrl(path), lastModified, changeFrequency, priority }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const latestPost = posts[0]?.updated ?? PAGES_UPDATED_AT
  const usedCategories = categories.filter((c) => posts.some((p) => p.category === c.slug))

  return [
    entry('/', 1, 'weekly', latestPost > PAGES_UPDATED_AT ? latestPost : PAGES_UPDATED_AT),
    entry('/services', 0.9, 'monthly'),
    ...services.map((s) => entry(`/services/${s.slug}`, 0.9, 'monthly')),
    entry('/zones-intervention', 0.8, 'monthly'),
    ...zones.map((z) => entry(`/zones-intervention/${z.slug}`, 0.7, 'monthly')),
    entry('/blog', 0.8, 'weekly', latestPost),
    ...usedCategories.map((c) => entry(`/blog/categorie/${c.slug}`, 0.5, 'weekly', latestPost)),
    ...posts.map((p) => entry(`/blog/${p.slug}`, 0.7, 'monthly', p.updated)),
    entry('/communaute', 0.8, 'monthly'),
    entry('/portfolio', 0.7, 'monthly'),
    entry('/a-propos', 0.7, 'monthly'),
    entry('/contact', 0.8, 'yearly'),
    entry('/faq', 0.7, 'monthly'),
    entry('/mentions-legales', 0.2, 'yearly'),
    entry('/confidentialite', 0.2, 'yearly'),
  ]
}
