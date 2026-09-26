import { getAllPosts } from '@/lib/blog'
import { absoluteUrl, site } from '@/lib/site'

export const dynamic = 'force-static'

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const rfc822 = (iso: string) => new Date(`${iso}T08:00:00Z`).toUTCString()

export function GET() {
  const posts = getAllPosts()
  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/blog/${p.slug}`)
      return `    <item>
      <title>${escape(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${escape(p.description)}</description>
      <category>${escape(p.categoryName)}</category>
      <dc:creator>${escape(site.founder.name)}</dc:creator>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Le blog BabTech</title>
    <link>${absoluteUrl('/blog')}</link>
    <description>${escape("Digital, IA et référencement pour les TPE, artisans et commerçants de Montpellier et de l'Hérault.")}</description>
    <language>fr-FR</language>
    ${posts[0] ? `<lastBuildDate>${rfc822(posts[0].updated)}</lastBuildDate>` : ''}
    <atom:link href="${absoluteUrl('/blog/rss.xml')}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
