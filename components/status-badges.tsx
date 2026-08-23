import { cn } from '@/lib/utils'
import type { Project } from '@/components/portfolio-store'

export type BreadStatus =
  | 'incomplete'
  | 'someone-left'
  | 'working-fine'
  | 'outdated'
  | 'losing-money'
  | 'needs-sous-chef'

const breadStatusMap: Record<
  BreadStatus,
  { label: string; image: string; className: string }
> = {
  incomplete: {
    label: 'Needs Ingredients',
    image: '/incomplete.png',
    className: 'border-danger/30 bg-danger-muted/40 text-danger',
  },
  'someone-left': {
    label: 'Baker Required',
    image: '/someone-left.png',
    className: 'border-warning/40 bg-warning-muted/40 text-warning',
  },
  'working-fine': {
    label: 'Freshly Baked',
    image: '/working-fine.png',
    className: 'border-success/30 bg-success-muted/40 text-success',
  },
  outdated: {
    label: 'Outdated',
    image: '/outdated.png',
    className: 'border-warning/40 bg-warning-muted/40 text-warning',
  },
  'losing-money': {
    label: 'Starting to lose money',
    image: '/losing-money.png',
    className: 'border-danger/30 bg-danger-muted/40 text-danger',
  },
  'needs-sous-chef': {
    label: 'Needs sous chef',
    image: '/needs-sous-chef.png',
    className: 'border-border bg-secondary/60 text-secondary-foreground',
  },
}

export function ReadinessBadge({
  project,
  className,
}: {
  project: Project
  className?: string
}) {
  const status = getBreadStatus(project)
  const { label, image, className: c } = breadStatusMap[status]
  return (
    <span
      className={cn(
        'inline-flex h-24 w-32 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border px-2.5 py-2 text-center text-xs font-medium',
        c,
        className,
      )}
    >
      <img src={image} alt="" className="size-12 object-contain" aria-hidden />
      {label}
    </span>
  )
}

function getBreadStatus(project: Project): BreadStatus {
  if (project.readiness === 'incomplete') return 'incomplete'
  if (!project.sousChef) return 'needs-sous-chef'
  if (project.owner === 'Alex Chen' && !project.handedOver) return 'someone-left'
  if (project.readiness === 'ready') return 'working-fine'
  return 'outdated'
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
      <span className="size-1.5 rounded-full bg-success" aria-hidden />
      {status}
    </span>
  )
}
