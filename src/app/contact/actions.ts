'use server'

import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import { after } from 'next/server'
import { currentMonth } from '@/lib/admin/format'
import { type AssistantOutcome, updateStore } from '@/lib/admin/store'
import { type Proposal, ProposalSchema, SYSTEM, tidy } from '@/lib/assistant/prompt'
import { visitorAddress } from '@/lib/visitor'

/**
 * Assistant de projet de la page Contact : le visiteur décrit son projet, Claude (l'IA d'Anthropic)
 * propose aussitôt une piste. Actif seulement si la variable ANTHROPIC_API_KEY est réglée dans hPanel ;
 * sinon, ou en cas de souci, la page affiche le formulaire classique.
 */
export type AssistantResult = { proposal?: Proposal; error?: string; unavailable?: boolean }

const MODEL = 'claude-opus-5'
const MIN_LENGTH = 20
const MAX_LENGTH = 1500
const HOUR = 3_600_000
/** Au plus 6 analyses par heure depuis une même connexion, 60 par jour au total (maîtrise du coût). */
const PER_VISITOR = 6
const PER_DAY = 60
const perVisitor = new Map<string, number[]>()
const daily = { day: '', count: 0 }

let client: Anthropic | undefined
const anthropic = () => (client ??= new Anthropic({ timeout: 45_000, maxRetries: 1 }))

export async function assistantAvailable() {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

export async function analyzeProject(text: string): Promise<AssistantResult> {
  const project = String(text ?? '').trim().slice(0, MAX_LENGTH)
  if (project.length < MIN_LENGTH) return { error: 'Décris ton projet en une ou deux phrases.' }
  if (!process.env.ANTHROPIC_API_KEY) return { unavailable: true }

  const now = Date.now()
  const visitor = await visitorAddress()
  const mine = (perVisitor.get(visitor) ?? []).filter((t) => now - t < HOUR)
  const day = new Date(now).toISOString().slice(0, 10)
  if (daily.day !== day) Object.assign(daily, { day, count: 0 })
  if (mine.length >= PER_VISITOR) {
    return { error: 'Tu as lancé plusieurs analyses en peu de temps : envoie-moi ta demande, je te réponds moi-même.' }
  }
  if (daily.count >= PER_DAY) return { unavailable: true }
  perVisitor.set(visitor, [...mine, now])
  if (perVisitor.size > 5000) perVisitor.clear()
  daily.count++

  try {
    const response = await anthropic().beta.messages.parse({
      model: MODEL,
      max_tokens: 4000,
      // Si Claude décline la demande, l'API la confie aussitôt au modèle de repli recommandé.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low', format: betaZodOutputFormat(ProposalSchema) },
      system: SYSTEM,
      messages: [{ role: 'user', content: `<projet>\n${project}\n</projet>` }],
    })
    const usage = { input: response.usage.input_tokens, output: response.usage.output_tokens }
    if (response.stop_reason === 'refusal') {
      after(() => record({ ok: false, reason: 'refusal' }, usage))
      return { unavailable: true }
    }
    if (response.stop_reason !== 'end_turn' || !response.parsed_output) {
      console.error(`assistant : réponse incomplète (${response.stop_reason})`)
      after(() => record({ ok: false, reason: 'incomplete' }, usage))
      return { unavailable: true }
    }
    after(() => record({ ok: true }, usage))
    return { proposal: tidy(response.parsed_output) }
  } catch (error) {
    const status = error instanceof Anthropic.APIError ? error.status : undefined
    if (error instanceof Anthropic.APIError) console.error(`assistant : erreur de l'API (${error.status})`, error.message)
    else console.error('assistant : réponse inexploitable', error)
    after(() => record({ ok: false, ...(status ? { status } : {}) }))
    return { unavailable: true }
  }
}

/** Garde le résultat de la dernière analyse et, si elle a été facturée, les jetons du mois (affichés dans Réglages). */
async function record(outcome: Omit<AssistantOutcome, 'at'>, usage?: { input: number; output: number }) {
  const month = currentMonth()
  try {
    await updateStore((store) => {
      store.assistantLast = { ...outcome, at: new Date().toISOString() }
      if (!usage) return
      const current = store.assistant?.[month] ?? { count: 0, input: 0, output: 0 }
      store.assistant = {
        ...store.assistant,
        [month]: { count: current.count + 1, input: current.input + usage.input, output: current.output + usage.output },
      }
    })
  } catch (error) {
    console.error('assistant : suivi non enregistré', error)
  }
}
