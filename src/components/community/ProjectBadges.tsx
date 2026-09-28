import { PROJECT_NEEDS, type ProjectNeed, projectStageLabel } from '@/data/forum'
import type { ProjectStatus } from '@/lib/community/forum'

const chip = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold'

/** Ce que cherche le porteur du projet, son étape et son statut (« Trouvé »). */
export function ProjectBadges({ needs, stage, skill, status }: { needs: ProjectNeed[]; stage?: string; skill?: string; status: ProjectStatus }) {
  return (
    <ul className="flex flex-wrap items-center gap-1.5" aria-label="Ce que le projet cherche">
      {status === 'found' && <li className={`${chip} bg-emerald-b/15 text-emerald-300`}>Trouvé</li>}
      {PROJECT_NEEDS.filter((n) => needs.includes(n.value)).map((n) => (
        <li key={n.value} className={`${chip} bg-bronze/15 text-bronze`}>
          {n.value === 'competence' && skill ? `Compétence : ${skill}` : n.short}
        </li>
      ))}
      {stage && <li className={`${chip} bg-white/[0.06] text-txt-secondary`}>{projectStageLabel(stage)}</li>}
    </ul>
  )
}
