import { categories } from '@/data/blog'
import { services } from '@/data/services'
import { zones } from '@/data/zones'
import { getAllPosts } from './blog'

export type OgEntry = { key: string; eyebrow: string; title: string }

/**
 * Registre des images de partage (1200×630) générées au build dans /og/<clé>.png.
 * Chaque page référence sa clé via pageMetadata({ og }).
 */
export function getOgEntries(): OgEntry[] {
  return [
    {
      key: 'default',
      eyebrow: 'Studio digital & IA · Montpellier',
      title: "Sites web, applications métier et IA pour les TPE de l'Hérault",
    },
    { key: 'services', eyebrow: 'Services', title: 'Ce dont tu as besoin. Rien de plus, rien de moins.' },
    ...services.map((s) => ({ key: `services/${s.slug}`, eyebrow: s.badge, title: s.h1 })),
    {
      key: 'zones-intervention',
      eyebrow: "Zones d'intervention",
      title: "Montpellier, sa métropole et tout l'Hérault",
    },
    ...zones.map((z) => ({ key: `zones/${z.slug}`, eyebrow: `${z.name} · ${z.department}`, title: z.h1 })),
    { key: 'blog', eyebrow: 'Le blog BabTech', title: "Digital, IA et référencement pour les TPE de l'Hérault" },
    ...categories.map((c) => ({ key: `blog/categorie/${c.slug}`, eyebrow: 'Le blog BabTech', title: c.name })),
    ...getAllPosts().map((p) => ({ key: `blog/${p.slug}`, eyebrow: p.categoryName, title: p.title })),
    {
      key: 'communaute',
      eyebrow: 'Communauté · Montpellier',
      title: "Apprendre le digital et l'IA entre entrepreneurs",
    },
    { key: 'a-propos', eyebrow: 'À propos', title: "Derrière BabTech, il y a un parcours d'entrepreneur." },
    { key: 'portfolio', eyebrow: 'Réalisations', title: 'Des projets concrets. Des résultats qui parlent.' },
    { key: 'contact', eyebrow: 'Contact', title: 'Parlons de ton projet.' },
    { key: 'faq', eyebrow: 'FAQ', title: 'Toutes les réponses à tes questions.' },
  ]
}
