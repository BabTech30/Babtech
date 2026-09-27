import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-static'

/**
 * Moteurs de recherche et assistants IA explicitement autorisés : objectif,
 * être indexé par Google et Bing ET cité par ChatGPT, Claude, Perplexity,
 * Gemini, Copilot, Mistral, Apple Intelligence…
 */
const SEARCH_AND_AI_BOTS = [
  'Googlebot',
  'Bingbot',
  'Google-Extended',
  'GoogleOther',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'MistralAI-User',
  'Applebot',
  'Applebot-Extended',
  'DuckAssistBot',
  'Amazonbot',
  'meta-externalagent',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: SEARCH_AND_AI_BOTS, allow: '/' },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
