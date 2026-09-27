/**
 * Limite anti-abus en mémoire : au plus `perVisitor` envois par visiteur sur `windowMs`, et `perDay` au total
 * par jour. Rien n'est enregistré ; tout repart à zéro au redémarrage du site.
 */
export function limiter({ perVisitor, windowMs, perDay }: { perVisitor: number; windowMs: number; perDay: number }) {
  const visits = new Map<string, number[]>()
  const today = { day: '', count: 0 }
  return {
    /** Vrai si le visiteur peut encore envoyer ; l'envoi est alors compté. */
    take(visitor: string, now = Date.now()) {
      const day = new Date(now).toISOString().slice(0, 10)
      if (today.day !== day) Object.assign(today, { day, count: 0 })
      const recent = (visits.get(visitor) ?? []).filter((t) => now - t < windowMs)
      if (recent.length >= perVisitor || today.count >= perDay) return false
      if (visits.size > 5000) visits.clear()
      visits.set(visitor, [...recent, now])
      today.count++
      return true
    },
  }
}
