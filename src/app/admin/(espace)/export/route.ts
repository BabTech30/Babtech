import { hasSession } from '@/lib/admin/auth'
import { todayInParis } from '@/lib/admin/format'
import { readStore } from '@/lib/admin/store'

export const dynamic = 'force-dynamic'

/** Sauvegarde de tes coches, de tes chiffres du mois et des scans des QR codes (sans mot de passe ni secret). */
export async function GET() {
  if (!(await hasSession())) return new Response('Connexion requise.', { status: 401 })
  const { tasks, kpis, scans } = await readStore()
  const date = todayInParis()
  return new Response(JSON.stringify({ exportedAt: date, tasks, kpis, scans }, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="babtech-admin-${date}.json"`,
      'Cache-Control': 'no-store',
    },
  })
}
