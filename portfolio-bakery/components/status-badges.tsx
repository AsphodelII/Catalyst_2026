import { CircleCheck, CircleAlert, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Readiness } from '@/components/portfolio-store'

const readinessMap: Record<
  Readiness,
  { label: string; icon: typeof CircleCheck; className: string }
> = {
  ready: {
    label: 'Ready',
    icon: CircleCheck,
    className: 'bg-success-muted text-success border-success/30',
  },
  'needs-review': {
    label: 'Needs review',
    icon: TriangleAlert,
    className: 'bg-warning-muted text-warning border-warning/40',
  },
  incomplete: {
    label: 'Incomplete',
    icon: CircleAlert,
    className: 'bg-danger-muted text-danger border-danger/30',
  },
}

export function ReadinessBadge({
  readiness,
  className,
}: {
  readiness: Readiness
  className?: string
}) {
  const { label, icon: Icon, className: c } = readinessMap[readiness]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        c,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  )
}

export function StatusPill({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
      <span className="size-1.5 rounded-full bg-success" aria-hidden />
      {status}
    </span>
  )
}
