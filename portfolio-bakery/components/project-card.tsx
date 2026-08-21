import Link from 'next/link'
import { ArrowRight, CircleCheck, CircleAlert } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ReadinessBadge, StatusPill } from '@/components/status-badges'
import type { Project } from '@/components/portfolio-store'
import { cn } from '@/lib/utils'

export function ProjectCard({
  project,
  missing,
}: {
  project: Project
  missing: number
}) {
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-semibold text-foreground">{project.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Owner: <span className="font-medium text-foreground">{project.owner}</span>
          </p>
        </div>
        <ReadinessBadge readiness={project.readiness} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusPill status={project.status} />
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
            missing === 0
              ? 'border-success/30 bg-success-muted text-success'
              : 'border-border bg-secondary text-secondary-foreground',
          )}
        >
          {missing === 0 ? (
            <CircleCheck className="size-3.5" aria-hidden />
          ) : (
            <CircleAlert className="size-3.5" aria-hidden />
          )}
          {missing === 0 ? 'No missing context' : `${missing} missing`}
        </span>
      </div>

      <div className="mt-auto pt-5">
        <Link
          href={`/recipe/${project.id}`}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-10 w-full justify-between px-4',
          )}
        >
          View Recipe
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  )
}
