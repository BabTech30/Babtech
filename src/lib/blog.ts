import fs from 'node:fs'
import path from 'node:path'
import { cache } from 'react'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'
import { getCategory } from '@/data/blog'
import { rehypeFrenchTypography } from './typography'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')
const WORDS_PER_MINUTE = 220

export type PostFaq = { q: string; a: string }
export type Heading = { id: string; text: string; level: 2 | 3 }

export type PostMeta = {
  slug: string
  title: string
  seoTitle: string
  description: string
  date: string
  updated: string
  category: string
  categoryName: string
  tags: string[]
  tldr: string[]
  faq: PostFaq[]
  wordCount: number
  readingMinutes: number
}

export type Post = PostMeta & {
  html: string
  headings: Heading[]
  markdown: string
}

type HastNode = {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

function textOf(node: HastNode): string {
  if (node.type === 'text') return node.value ?? ''
  return (node.children ?? []).map(textOf).join('')
}

/**
 * Liens externes : nouvel onglet + rel sécurisé ; titres : sommaire ; tableaux et blocs de code :
 * zones défilantes accessibles au clavier, chacune avec un libellé unique.
 */
function rehypeBabtech(headings: Heading[]) {
  return () => (tree: HastNode) => {
    let tables = 0
    let lastHeading = ''
    const walk = (node: HastNode, parent?: HastNode) => {
      if (node.type === 'element') {
        const tag = node.tagName
        if (tag === 'a') {
          const href = String(node.properties?.href ?? '')
          if (/^https?:\/\//.test(href)) {
            node.properties = { ...node.properties, target: '_blank', rel: 'noopener noreferrer' }
          }
        }
        if ((tag === 'h2' || tag === 'h3') && node.properties?.id) {
          lastHeading = textOf(node).trim()
          headings.push({ id: String(node.properties.id), text: lastHeading, level: tag === 'h2' ? 2 : 3 })
        }
        if (tag === 'pre') {
          node.properties = { ...node.properties, tabIndex: 0 }
        }
        if (tag === 'table' && parent?.children) {
          tables++
          const index = parent.children.indexOf(node)
          parent.children[index] = {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['table-wrap'],
              tabIndex: 0,
              role: 'region',
              ariaLabel: `Tableau ${tables}${lastHeading ? ` : ${lastHeading}` : ''}`,
            },
            children: [node],
          }
        }
      }
      node.children?.forEach((child) => walk(child, node))
    }
    walk(tree)
  }
}

async function renderMarkdown(markdown: string) {
  const headings: Heading[] = []
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeBabtech(headings))
    .use(rehypeFrenchTypography)
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: { className: ['heading-anchor'], ariaHidden: 'true', tabIndex: -1 },
      content: { type: 'text', value: '#' },
    })
    .use(rehypeStringify)
    .process(markdown)
  return { html: String(file), headings }
}

function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value ?? '').slice(0, 10)
}

function readSource(slug: string) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), 'utf8')
  const { data, content } = matter(raw)
  const wordCount = content.split(/\s+/).filter(Boolean).length
  const date = toIsoDate(data.date)
  const meta: PostMeta = {
    slug,
    title: String(data.title),
    seoTitle: String(data.seoTitle ?? data.title),
    description: String(data.description),
    date,
    updated: data.updated ? toIsoDate(data.updated) : date,
    category: String(data.category),
    categoryName: getCategory(String(data.category))?.name ?? String(data.category),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    tldr: Array.isArray(data.tldr) ? data.tldr.map(String) : [],
    faq: Array.isArray(data.faq) ? data.faq.map((f: PostFaq) => ({ q: String(f.q), a: String(f.a) })) : [],
    wordCount,
    readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
  }
  return { meta, content, draft: data.draft === true }
}

/** Tous les articles publiés, du plus récent au plus ancien. */
export const getAllPosts = cache((): PostMeta[] => {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => readSource(file.replace(/\.md$/, '')))
    .filter((post) => !post.draft)
    .map((post) => post.meta)
    .sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date)))
})

export const getPost = cache(async (slug: string): Promise<Post | undefined> => {
  if (!getAllPosts().some((p) => p.slug === slug)) return undefined
  const { meta, content } = readSource(slug)
  const { html, headings } = await renderMarkdown(content)
  return { ...meta, html, headings, markdown: content }
})

export function getPostsByCategory(category: string) {
  return getAllPosts().filter((p) => p.category === category)
}

/** Articles liés : même catégorie d'abord, puis tags communs, puis les plus récents. */
export function getRelatedPosts(post: PostMeta, limit = 3) {
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      score: (p.category === post.category ? 3 : 0) + p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.post)
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(iso),
  )
}
