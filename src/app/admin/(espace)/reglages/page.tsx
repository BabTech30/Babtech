import type { Metadata } from 'next'
import { PasswordForm } from '@/components/admin/PasswordForm'
import { adminUsername, MIN_PASSWORD_LENGTH, passwordChanged, requireAdmin } from '@/lib/admin/auth'
import { storageInfo } from '@/lib/admin/store'
import { fr } from '@/lib/typography'
import { logout } from '../../actions'

export const metadata: Metadata = { title: { absolute: 'Réglages · BabTech' } }

const panel = 'rounded-2xl border border-bord bg-nuit p-5 sm:p-6'
const h2 = 'font-outfit text-lg font-semibold tracking-tight text-white'

export default async function SettingsPage() {
  await requireAdmin()
  const [changed, storage] = await Promise.all([passwordChanged(), storageInfo()])
  return (
    <div className="grid max-w-3xl gap-6">
      <div>
        <p className="section-tag text-emerald-b">Administration</p>
        <h1 className="font-outfit text-3xl font-bold tracking-tight text-white md:text-4xl">Réglages</h1>
      </div>

      <section className={panel} aria-labelledby="password-title">
        <h2 id="password-title" className={h2}>
          Mot de passe
        </h2>
        <p className={`mt-2 text-sm ${changed ? 'text-txt-secondary' : 'text-bronze'}`}>
          {fr(
            changed
              ? 'Tu utilises ton propre mot de passe. Changer de mot de passe déconnecte les autres appareils.'
              : 'Tu utilises encore le mot de passe de départ, passé dans la conversation avec Claude : remplace-le maintenant.',
          )}
        </p>
        <div className="mt-5">
          <PasswordForm minLength={MIN_PASSWORD_LENGTH} />
        </div>
      </section>

      <section className={panel} aria-labelledby="account-title">
        <h2 id="account-title" className={h2}>
          Compte
        </h2>
        <p className="mt-2 text-sm text-txt-secondary">
          Identifiant&nbsp;: <strong className="text-white">{adminUsername()}</strong>. Il se change dans hPanel (variable{' '}
          <code className="text-bronze">ADMIN_USERNAME</code> de l&apos;application Node.js), puis redéploiement.
        </p>
        <form action={logout} className="mt-4">
          <button type="submit" className="btn-secondary btn-sm">
            Se déconnecter
          </button>
        </form>
      </section>

      <section className={panel} aria-labelledby="data-title">
        <h2 id="data-title" className={h2}>
          Données
        </h2>
        {storage ? (
          <p className="mt-2 text-sm text-txt-secondary">
            Tes coches, tes chiffres du mois, les scans des QR codes et ton mot de passe (sous une forme illisible, jamais en clair) sont
            enregistrés sur le serveur, dans{' '}
            <code className="break-all text-txt-primary">{storage.dir}</code>
            {storage.persistent ? (
              <>&nbsp;: en dehors du dossier du site, ils ne sont pas touchés par un déploiement.</>
            ) : (
              <>
                &nbsp;: c&apos;est le dossier du site, qu&apos;un redéploiement peut effacer. Ajoute dans hPanel la variable{' '}
                <code className="text-bronze">ADMIN_DATA_DIR</code> avec un dossier hors du site.
              </>
            )}
          </p>
        ) : (
          <p className="mt-2 text-sm text-bronze">
            Aucun dossier du serveur n&apos;accepte l&apos;enregistrement des données. Ajoute dans hPanel la variable{' '}
            <code>ADMIN_DATA_DIR</code> avec un dossier inscriptible, puis redéploie.
          </p>
        )}
        <a href="/admin/export/" className="btn-secondary btn-sm mt-4">
          Télécharger une sauvegarde (JSON)
        </a>
      </section>
    </div>
  )
}
