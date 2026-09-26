import Link from 'next/link'
import { formatDate, type PostMeta } from '@/lib/blog'
import { fr } from '@/lib/typography'

export function PostCard({ post, headingLevel = 'h3' }: { post: PostMeta; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  return (
    <article className="card card-hover relative flex flex-col p-7">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-emerald-b">{post.categoryName}</p>
      <Heading className="mb-3 font-outfit text-lg font-semibold leading-snug tracking-tight text-white">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
          {fr(post.title)}
        </Link>
      </Heading>
      <p className="mb-6 flex-1 text-[14.5px] leading-relaxed text-txt-secondary">{fr(post.description)}</p>
      <p className="text-[13px] text-txt-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min de lecture
      </p>
    </article>
  )
}
