'use client'

import Link from 'next/link'
import { ArrowRight, CircleCheck, CircleAlert, Video } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ReadinessBadge, StatusPill } from '@/components/status-badges'
import { ProjectAccess } from '@/components/project-access'
import type { Project } from '@/components/portfolio-store'
import { useConsole } from '@/components/console-provider'
import { cn } from '@/lib/utils'

export function ProjectCard({
  project,
  missing,
}: {
  project: Project
  missing: number
}) {
  const { meetings } = useConsole()
  const latestRecording = meetings
    .filter((meeting) => meeting.projectId === project.id && meeting.recordingUrl)
    .sort((left, right) => right.scheduledDate.localeCompare(left.scheduledDate))[0]

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-semibold text-foreground">{project.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Owner: <span className="font-medium text-foreground">{project.owner}</span>
          </p>
        </div>
        <ReadinessBadge project={project} />
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

      <ProjectAccess
        codebaseUrl={project.codebaseUrl}
        owner={project.owner}
        ownerEmail={project.ownerEmail}
      />

      {latestRecording && (
        <div className="mt-4 rounded-lg border border-gold/30 bg-gold/10 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-foreground">
            Algorithm walkthrough
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Recorded {latestRecording.scheduledDate} with {latestRecording.previousOwner}
          </p>
          <a
            href={latestRecording.recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
          >
            <Video className="size-4" aria-hidden />
            View Meeting Recording
          </a>
        </div>
      )}

      <div className="mt-auto pt-5 flex flex-col gap-2">
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
