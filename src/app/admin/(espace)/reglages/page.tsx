import type { Metadata } from 'next'
import { DatabaseTest } from '@/components/admin/DatabaseTest'
import { InstallApp } from '@/components/admin/InstallApp'
import { MailTest } from '@/components/admin/MailTest'
import { PasswordForm } from '@/components/admin/PasswordForm'
import { adminUsername, MIN_PASSWORD_LENGTH, passwordChanged, requireAdmin } from '@/lib/admin/auth'
import { currentMonth, formatDay } from '@/lib/admin/format'
import { type AssistantOutcome, readStore, storageInfo } from '@/lib/admin/store'
import { frTime, utcToParis } from '@/lib/booking/time'
import { dbConfigured } from '@/lib/db'
import { MAIL_FROM, mailConfigured, mailProblem } from '@/lib/mail'
import { fr } from '@/lib/typography'
import { logout } from '../../actions'

export const metadata: Metadata = { title: { absolute: 'Réglages · BabTech' } }

const panel = 'rounded-2xl border border-bord bg-nuit p-5 sm:p-6'
const h2 = 'font-outfit text-lg font-semibold tracking-tight text-white'
/** Tarif de Claude Opus 5 (dollars par million de jetons), pour estimer le coût de l'assistant. */
const PRICE = { input: 5, output: 25 }
const dollars = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** « le 27 septembre 2026 à 14 h 05 » (heure de Paris). */
function when(iso: string) {
  const { date, time } = utcToParis(Date.parse(iso))
  return `le ${formatDay(date)} à ${frTime(time)}`
}

/** Dernière analyse de l'assistant, avec la cause probable d'un échec et quoi faire. */
function lastOutcome(last: AssistantOutcome) {
  const at = when(last.at)
  if (last.ok) return `Dernière analyse réussie ${at}.`
  const status = last.status
  const why =
    last.reason === 'refusal'
      ? 'Claude a refusé cette demande (contenu jugé inapproprié), rien à régler.'
      : last.reason === 'incomplete'
        ? "réponse incomplète de Claude. Si ça se répète, signale-le à Claude."
        : status === 401
          ? 'clé refusée. Vérifie la variable ANTHROPIC_API_KEY dans hPanel (la clé copiée en entier), puis redéploie.'
          : status === 403
            ? 'accès refusé par Anthropic. Vérifie que la clé est active sur platform.claude.com.'
            : status === 400
              ? "demande refusée par Anthropic (erreur 400). Vérifie d'abord qu'il reste du crédit sur ton compte platform.claude.com ; sinon, signale-le à Claude."
              : status === 429
                ? "trop de demandes d'un coup chez Anthropic, ça repasse tout seul."
                : status && status >= 500
                  ? 'Anthropic était momentanément indisponible, ça repasse tout seul.'
                  : status
                    ? `erreur ${status} renvoyée par Anthropic.`
                    : "pas de réponse d'Anthropic (réseau ou délai dépassé)."
  return `Dernière analyse en échec ${at} : ${why} Le visiteur a alors vu le formulaire classique.`
}

export default async function SettingsPage() {
  await requireAdmin()
  const [changed, storage, store] = await Promise.all([passwordChanged(), storageInfo(), readStore()])
  const assistantOn = Boolean(process.env.ANTHROPIC_API_KEY)
  const mailOn = mailConfigured()
  const usage = store.assistant?.[currentMonth()] ?? { count: 0, input: 0, output: 0 }
  const cost = (usage.input * PRICE.input + usage.output * PRICE.output) / 1_000_000
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

      <section className={panel} aria-labelledby="app-title">
        <h2 id="app-title" className={h2}>
          Application
        </h2>
        <p className="mt-2 text-sm text-txt-secondary">
          Installe le tableau de bord sur ton ordinateur ou ton téléphone&nbsp;: une icône à part, qui s&apos;ouvre dans sa propre
          fenêtre, sans passer par le navigateur. Les données restent sur le serveur, toujours à jour. Active ensuite les
          notifications dans l&apos;onglet Rendez-vous pour recevoir une alerte à chaque réservation.
        </p>
        <InstallApp />
      </section>

      <section className={panel} aria-labelledby="mail-title">
        <h2 id="mail-title" className={h2}>
          E-mails
        </h2>
        {mailOn ? (
          <p className="mt-2 text-sm text-emerald-300">
            Actifs&nbsp;: le site envoie ses e-mails depuis {MAIL_FROM} (alertes pour toi, confirmations pour tes clients).
          </p>
        ) : (
          <p className="mt-2 text-sm text-bronze">
            Pas encore actifs. Crée la boîte {MAIL_FROM} dans hPanel → Emails, ajoute dans l&apos;application Node.js la variable{' '}
            <code>SMTP_PASSWORD</code> avec son mot de passe, puis redéploie. En attendant, les demandes arrivent quand même dans
            l&apos;onglet Demandes.
          </p>
        )}
        {store.mailLast && (
          <p className={`mt-2 text-sm ${store.mailLast.ok ? 'text-txt-secondary' : 'text-bronze'}`}>
            {fr(
              store.mailLast.ok
                ? `Dernier envoi réussi ${when(store.mailLast.at)}.`
                : `Dernier envoi en échec ${when(store.mailLast.at)} : ${mailProblem(store.mailLast.code ?? 'ERREUR')}`,
            )}
          </p>
        )}
        <MailTest />
      </section>

      <section className={panel} aria-labelledby="community-title">
        <h2 id="community-title" className={h2}>
          Communauté (base de données)
        </h2>
        {dbConfigured() ? (
          <p className="mt-2 text-sm text-txt-secondary">
            Les comptes des membres et le forum sont enregistrés dans la base MySQL d&apos;Hostinger{' '}
            <code>{process.env.DB_NAME}</code>. Les tables se créent toutes seules à la première visite du forum.
          </p>
        ) : (
          <p className="mt-2 text-sm text-bronze">
            {fr(
              "Pas encore branchée : le forum affiche « Le forum ouvre très bientôt ». Dans l'application Node.js de hPanel, ajoute les variables DB_HOST (localhost), DB_PORT (3306), DB_NAME, DB_USER et DB_PASSWORD de la base que tu as créée (hPanel → Bases de données), puis redéploie.",
            )}
          </p>
        )}
        {!mailOn && (
          <p className="mt-2 text-sm text-bronze">
            {fr("Les inscriptions ont aussi besoin des e-mails (lien de confirmation) : active-les d'abord, voir ci-dessus.")}
          </p>
        )}
        <DatabaseTest />
      </section>

      <section className={panel} aria-labelledby="assistant-title">
        <h2 id="assistant-title" className={h2}>
          Assistant IA de la page Contact
        </h2>
        {assistantOn ? (
          <p className="mt-2 text-sm text-emerald-300">
            Actif&nbsp;: les visiteurs décrivent leur projet et Claude leur propose aussitôt une piste.
          </p>
        ) : (
          <p className="mt-2 text-sm text-bronze">
            Inactif&nbsp;: la page Contact affiche le formulaire classique. Pour l&apos;activer, crée une clé sur{' '}
            <a href="https://platform.claude.com/settings/keys" target="_blank" rel="noopener" className="underline">
              platform.claude.com
            </a>
            , ajoute-la dans hPanel (variable <code>ANTHROPIC_API_KEY</code>), puis redéploie.
          </p>
        )}
        <p className="mt-3 text-sm text-txt-secondary">
          Ce mois-ci&nbsp;: <strong className="text-white">{usage.count}</strong> analyse{usage.count > 1 ? 's' : ''}, environ{' '}
          <strong className="text-white">{dollars.format(cost)}&nbsp;$</strong> facturés par Anthropic (au plus 60 analyses par jour).
        </p>
        {store.assistantLast && (
          <p className={`mt-2 text-sm ${store.assistantLast.ok ? 'text-txt-secondary' : 'text-bronze'}`}>{fr(lastOutcome(store.assistantLast))}</p>
        )}
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
            Tes coches, tes chiffres du mois, les scans des QR codes, les rendez-vous, les demandes et ton mot de passe (sous une forme illisible, jamais en clair) sont
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
