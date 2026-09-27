import Link from 'next/link'
import { AdminNav } from '@/components/admin/AdminNav'
import { InstallButton } from '@/components/admin/InstallApp'
import { requireAdmin } from '@/lib/admin/auth'
import { readStore } from '@/lib/admin/store'
import { logout } from '../actions'

export default async function AdminSpaceLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  const { requests } = await readStore()
  const fresh = requests.filter((r) => r.status === 'new').length
  return (
    <>
      <header className="border-b border-bord bg-nuit">
        <div className="container-b flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
          <Link href="/admin/" className="inline-flex items-center gap-2.5 font-outfit text-lg font-bold tracking-tight text-white">
            <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-emerald-b text-[17px] leading-none text-[#0a1a10]">
              B
            </span>
            BabTech <span className="font-medium text-txt-muted">admin</span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <AdminNav counts={{ '/admin/demandes/': fresh }} />
            <InstallButton />
            <a href="/" target="_blank" rel="noopener" className="rounded-lg px-3 py-2 text-sm font-medium text-txt-secondary hover:bg-white/[0.04] hover:text-white">
              Voir le site ↗
            </a>
            <form action={logout}>
              <button type="submit" className="rounded-lg border border-white/[0.12] px-3 py-2 text-sm font-medium text-txt-primary hover:border-white/30 hover:text-white">
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="container-b py-8 md:py-10">{children}</div>
    </>
  )
}
