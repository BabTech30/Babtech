/**
 * Typographie française : espaces insécables avant « ; : ! ? » et à l'intérieur
 * des guillemets, entre un nombre et son unité (€, %), et dans les milliers.
 * Évite les « ? » ou « € » orphelins en début de ligne.
 */

const NNBSP = ' ' // espace fine insécable
const NBSP = ' ' // espace insécable

export function fr(text: string): string {
  return text
    .replace(/[  ]+([;!?»])/g, `${NNBSP}$1`)
    .replace(/[  ]+:(?=\s|$)/g, `${NBSP}:`)
    .replace(/«[  ]+/g, `«${NNBSP}`)
    .replace(/(\d)[  ](?=\d{3}\b)/g, `$1${NNBSP}`)
    .replace(/(\d)[  ]+(€|%|h\b|min\b)/g, `$1${NBSP}$2`)
}

type HastNode = {
  type: string
  tagName?: string
  value?: string
  children?: HastNode[]
}

const SKIP = new Set(['code', 'pre', 'script', 'style'])

/** Plugin rehype : applique fr() aux nœuds texte (hors code). */
export function rehypeFrenchTypography() {
  const walk = (node: HastNode) => {
    if (node.type === 'element' && node.tagName && SKIP.has(node.tagName)) return
    if (node.type === 'text' && typeof node.value === 'string') node.value = fr(node.value)
    node.children?.forEach(walk)
  }
  return (tree: HastNode) => walk(tree)
}
