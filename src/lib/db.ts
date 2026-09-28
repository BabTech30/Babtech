import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise'

/**
 * Base MySQL d'Hostinger : comptes des membres, forum, projets et groupes de la communauté. Identifiants dans les variables
 * d'environnement de hPanel (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD), jamais dans le code.
 * Les tables (préfixe bt_) sont créées au premier accès : rien à préparer dans phpMyAdmin.
 * Sans configuration ou si la base ne répond pas, le forum affiche « bientôt disponible » et le reste du site
 * fonctionne normalement.
 */
export const dbConfigured = () => Boolean(process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD)

/** Pool et création des tables gardés d'un rechargement à l'autre (développement) et partagés par toutes les requêtes. */
const shared = globalThis as unknown as { babtechPool?: Pool; babtechSchema?: Promise<void> }

function pool() {
  shared.babtechPool ??= mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4_unicode_ci',
    // Dates enregistrées et relues en UTC.
    timezone: 'Z',
    connectionLimit: 5,
    connectTimeout: 8_000,
    waitForConnections: true,
  })
  return shared.babtechPool
}

const TABLES = [
  `CREATE TABLE IF NOT EXISTS bt_members (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    activity VARCHAR(80) NOT NULL DEFAULT '',
    city VARCHAR(80) NOT NULL DEFAULT '',
    status ENUM('pending', 'active', 'blocked') NOT NULL DEFAULT 'pending',
    notify_replies TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL,
    verified_at DATETIME NULL,
    last_login_at DATETIME NULL,
    terms_accepted_at DATETIME NOT NULL,
    UNIQUE KEY uq_members_email (email),
    KEY idx_members_status (status, created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS bt_tokens (
    token_hash CHAR(64) CHARACTER SET ascii NOT NULL PRIMARY KEY,
    member_id INT UNSIGNED NOT NULL,
    kind ENUM('verify', 'reset', 'session') NOT NULL,
    created_at DATETIME NOT NULL,
    expires_at DATETIME NOT NULL,
    KEY idx_tokens_member (member_id, kind),
    KEY idx_tokens_expiry (expires_at),
    CONSTRAINT fk_tokens_member FOREIGN KEY (member_id) REFERENCES bt_members (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS bt_topics (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(40) NOT NULL,
    member_id INT UNSIGNED NULL,
    title VARCHAR(140) NOT NULL,
    body TEXT NOT NULL,
    status ENUM('visible', 'hidden') NOT NULL DEFAULT 'visible',
    reply_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    edited_at DATETIME NULL,
    last_activity_at DATETIME NOT NULL,
    KEY idx_topics_category (category, status, last_activity_at),
    KEY idx_topics_activity (status, last_activity_at),
    KEY idx_topics_member (member_id),
    CONSTRAINT fk_topics_member FOREIGN KEY (member_id) REFERENCES bt_members (id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS bt_replies (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    topic_id INT UNSIGNED NOT NULL,
    member_id INT UNSIGNED NULL,
    body TEXT NOT NULL,
    status ENUM('visible', 'hidden') NOT NULL DEFAULT 'visible',
    created_at DATETIME NOT NULL,
    edited_at DATETIME NULL,
    KEY idx_replies_topic (topic_id, created_at),
    KEY idx_replies_member (member_id),
    CONSTRAINT fk_replies_topic FOREIGN KEY (topic_id) REFERENCES bt_topics (id) ON DELETE CASCADE,
    CONSTRAINT fk_replies_member FOREIGN KEY (member_id) REFERENCES bt_members (id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS bt_reports (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    target ENUM('topic', 'reply') NOT NULL,
    target_id INT UNSIGNED NOT NULL,
    member_id INT UNSIGNED NULL,
    reason VARCHAR(500) NOT NULL,
    created_at DATETIME NOT NULL,
    resolved_at DATETIME NULL,
    KEY idx_reports_open (resolved_at, created_at),
    KEY idx_reports_target (target, target_id),
    CONSTRAINT fk_reports_member FOREIGN KEY (member_id) REFERENCES bt_members (id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  // Projets : un sujet du forum avec ce que le membre cherche.
  `CREATE TABLE IF NOT EXISTS bt_projects (
    topic_id INT UNSIGNED NOT NULL PRIMARY KEY,
    wants_advice TINYINT(1) NOT NULL DEFAULT 0,
    wants_partner TINYINT(1) NOT NULL DEFAULT 0,
    wants_skill TINYINT(1) NOT NULL DEFAULT 0,
    skill VARCHAR(120) NOT NULL DEFAULT '',
    stage ENUM('idee', 'lancement', 'activite') NOT NULL DEFAULT 'idee',
    status ENUM('open', 'found') NOT NULL DEFAULT 'open',
    KEY idx_projects_status (status),
    CONSTRAINT fk_projects_topic FOREIGN KEY (topic_id) REFERENCES bt_topics (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  // « Proposer mon aide » : le message part par e-mail à l'auteur du projet ; seule la date est gardée (anti-abus).
  `CREATE TABLE IF NOT EXISTS bt_project_offers (
    topic_id INT UNSIGNED NOT NULL,
    member_id INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (topic_id, member_id),
    KEY idx_offers_member (member_id, created_at),
    CONSTRAINT fk_offers_project FOREIGN KEY (topic_id) REFERENCES bt_projects (topic_id) ON DELETE CASCADE,
    CONSTRAINT fk_offers_member FOREIGN KEY (member_id) REFERENCES bt_members (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  // Groupes proposés par les membres (« pending »), publiés une fois validés (« active ») ou masqués (« hidden »).
  `CREATE TABLE IF NOT EXISTS bt_groups (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(40) NOT NULL,
    city VARCHAR(80) NOT NULL DEFAULT '',
    level ENUM('tous', 'debutants', 'confirmes') NOT NULL DEFAULT 'tous',
    capacity SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    status ENUM('pending', 'active', 'hidden') NOT NULL DEFAULT 'pending',
    created_by INT UNSIGNED NULL,
    created_at DATETIME NOT NULL,
    reviewed_at DATETIME NULL,
    last_activity_at DATETIME NOT NULL,
    KEY idx_groups_status (status, last_activity_at),
    KEY idx_groups_creator (created_by),
    CONSTRAINT fk_groups_member FOREIGN KEY (created_by) REFERENCES bt_members (id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS bt_group_members (
    group_id INT UNSIGNED NOT NULL,
    member_id INT UNSIGNED NOT NULL,
    role ENUM('organizer', 'member') NOT NULL DEFAULT 'member',
    notify TINYINT(1) NOT NULL DEFAULT 1,
    joined_at DATETIME NOT NULL,
    PRIMARY KEY (group_id, member_id),
    KEY idx_group_members_member (member_id),
    CONSTRAINT fk_group_members_group FOREIGN KEY (group_id) REFERENCES bt_groups (id) ON DELETE CASCADE,
    CONSTRAINT fk_group_members_member FOREIGN KEY (member_id) REFERENCES bt_members (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  // Sujets du forum ouverts dans un groupe.
  `CREATE TABLE IF NOT EXISTS bt_group_topics (
    topic_id INT UNSIGNED NOT NULL PRIMARY KEY,
    group_id INT UNSIGNED NOT NULL,
    KEY idx_group_topics_group (group_id),
    CONSTRAINT fk_group_topics_topic FOREIGN KEY (topic_id) REFERENCES bt_topics (id) ON DELETE CASCADE,
    CONSTRAINT fk_group_topics_group FOREIGN KEY (group_id) REFERENCES bt_groups (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
]

/** Crée les tables manquantes (une fois par démarrage ; en cas d'échec, nouvel essai à la requête suivante). */
function ensureSchema() {
  shared.babtechSchema ??= (async () => {
    for (const statement of TABLES) await pool().query(statement)
  })().catch((error) => {
    shared.babtechSchema = undefined
    throw error
  })
  return shared.babtechSchema
}

export type Row = RowDataPacket

/** Lecture : lignes renvoyées par la requête (valeurs passées à part, jamais collées dans le SQL). */
export async function select<T extends Row = Row>(sql: string, params: unknown[] = []) {
  await ensureSchema()
  const [rows] = await pool().query<T[]>(sql, params)
  return rows
}

/** Écriture : nombre de lignes touchées et identifiant créé. */
export async function execute(sql: string, params: unknown[] = []) {
  await ensureSchema()
  const [result] = await pool().query<ResultSetHeader>(sql, params)
  return result
}

/** Plusieurs écritures liées, toutes appliquées ou aucune. */
export async function transaction<T>(work: (run: (sql: string, params?: unknown[]) => Promise<ResultSetHeader>) => Promise<T>) {
  await ensureSchema()
  const connection = await pool().getConnection()
  try {
    await connection.beginTransaction()
    const result = await work(async (sql, params = []) => (await connection.query<ResultSetHeader>(sql, params))[0])
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback().catch(() => undefined)
    throw error
  } finally {
    connection.release()
  }
}

/** Date au format DATETIME de MySQL (UTC). */
export const sqlDate = (date = new Date()) => date.toISOString().slice(0, 19).replace('T', ' ')

/** Code d'erreur MySQL ou réseau d'une exception. */
export const dbErrorCode = (error: unknown) => String((error as { code?: unknown })?.code ?? 'ERREUR')

/** Cause probable d'un échec de connexion à la base, et quoi faire. */
export function dbProblem(code: string) {
  if (code === 'ER_ACCESS_DENIED_ERROR' || code === 'ER_DBACCESS_DENIED_ERROR') {
    return 'identifiant ou mot de passe refusé : vérifie DB_USER et DB_PASSWORD (hPanel → Bases de données).'
  }
  if (code === 'ER_BAD_DB_ERROR') return "base introuvable : vérifie DB_NAME (le nom complet, avec le préfixe du type u123456789_)."
  if (['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'EHOSTUNREACH', 'PROTOCOL_CONNECTION_LOST'].includes(code)) {
    return 'serveur de base de données injoignable : vérifie DB_HOST (localhost ou 127.0.0.1) et DB_PORT (3306).'
  }
  return `erreur ${code} renvoyée par la base de données.`
}

/** État de la base pour Réglages : configurée, joignable, tables en place. */
export async function dbStatus(): Promise<{ configured: boolean; ok: boolean; code?: string }> {
  if (!dbConfigured()) return { configured: false, ok: false }
  try {
    await select('SELECT 1 AS ok')
    return { configured: true, ok: true }
  } catch (error) {
    console.error('base de données : connexion impossible', error)
    return { configured: true, ok: false, code: dbErrorCode(error) }
  }
}
