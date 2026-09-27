import Link from 'next/link'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 font-outfit text-[22px] font-bold tracking-tight text-white ${className}`}>
      <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-emerald-b text-[18px] leading-none text-[#0a1a10]">
        B
      </span>
      <span>
        Bab<span className="text-emerald-b">Tech</span>
      </span>
    </Link>
  )
}
