import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin/LoginForm'
import { Logo } from '@/components/Logo'
import { hasSession, isConfigured } from '@/lib/admin/auth'

export const metadata: Metadata = { title: { absolute: 'Connexion · BabTech' } }

export default async function LoginPage() {
  if (await hasSession()) redirect('/admin/')
  const configured = await isConfigured()
  return (
    <div className="container-b flex min-h-screen items-center justify-center py-12">
      <div className="card w-full max-w-md p-7 sm:p-9">
        <Logo />
        <h1 className="mt-7 font-outfit text-2xl font-bold tracking-tight text-white">Espace administration</h1>
        <p className="mt-2 text-sm text-txt-secondary">Tableau de bord privé de babtech.fr.</p>
        {configured ? (
          <LoginForm />
        ) : (
          <div className="mt-6 rounded-xl border border-bronze/30 bg-bronze/10 p-4 text-sm leading-relaxed text-txt-primary">
            <p className="font-semibold text-white">Compte pas encore configuré</p>
            <p className="mt-2 text-txt-secondary">
              Dans hPanel, ouvre l&apos;application Node.js, ajoute les variables d&apos;environnement{' '}
              <code className="text-bronze">ADMIN_USERNAME</code> et <code className="text-bronze">ADMIN_PASSWORD</code>, puis
              redéploie.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
