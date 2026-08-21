'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  CircleCheck,
  TriangleAlert,
  CircleAlert,
  Send,
  UserPlus,
  GitCommitHorizontal,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { ReadinessBadge, StatusPill } from '@/components/status-badges'
import { Button } from '@/components/ui/button'
import { usePortfolio, type RecipeField } from '@/components/portfolio-store'
import { cn } from '@/lib/utils'

function FieldRow({ field }: { field: RecipeField }) {
  const complete = field.complete
  const danger = field.severity === 'danger'
  return (
    <div className="flex gap-3 py-4">
      <span
        className={cn(
          'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
          complete
            ? 'bg-success-muted text-success'
            : danger
              ? 'bg-danger-muted text-danger'
              : 'bg-warning-muted text-warning',
        )}
      >
        {complete ? (
          <Check className="size-3.5" aria-hidden />
        ) : danger ? (
          <CircleAlert className="size-3.5" aria-hidden />
        ) : (
          <TriangleAlert className="size-3.5" aria-hidden />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {field.label}
        </p>
        <p
          className={cn(
            'mt-1 text-sm text-pretty',
            complete
              ? 'text-foreground'
              : danger
                ? 'font-medium text-danger'
                : 'font-medium text-warning',
          )}
        >
          {field.value ??
            (danger ? 'Missing — required for handover' : 'Incomplete — needs detail')}
        </p>
      </div>
    </div>
  )
}

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getProject, assignBackup } = usePortfolio()
  const project = getProject(id)
  const [requested, setRequested] = useState(false)

  if (!project) notFound()

  const ready = project.fields.filter((f) => f.complete)
  const missing = project.fields.filter((f) => !f.complete)
  const commit = project.fields.find((f) => f.key === 'code')?.value

  return (
    <AppShell>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to portfolio
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium uppercase tracking-widest">Recipe Card</span>
            {commit && (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
                <GitCommitHorizontal className="size-3.5" aria-hidden />
                {commit.replace('commit ', '')}
              </span>
            )}
          </div>
          <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {project.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusPill status={project.status} />
            <ReadinessBadge readiness={project.readiness} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recipe card */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Research Handover Card
              </h2>
              <span className="text-xs text-muted-foreground">
                {ready.length}/{project.fields.length} complete
              </span>
            </div>

            {/* Ownership summary */}
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-secondary/40 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Researcher / Owner
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{project.owner}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Backup owner
                </p>
                <p
                  className={cn(
                    'mt-1 text-sm font-medium',
                    project.backupOwner ? 'text-foreground' : 'text-danger',
                  )}
                >
                  {project.backupOwner ?? 'Not assigned'}
                </p>
              </div>
            </div>

            {/* Hypothesis */}
            <div className="mt-4 rounded-lg border border-gold/30 bg-gold/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-foreground/70">
                Strategy hypothesis
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground text-pretty">
                {project.hypothesis}
              </p>
            </div>

            {/* Field rows */}
            <div className="mt-2 divide-y divide-border">
              {project.fields
                .filter((f) => f.key !== 'backup')
                .map((f) => (
                  <FieldRow key={f.key} field={f} />
                ))}
            </div>
          </div>
        </div>

        {/* Handover readiness panel */}
        <aside className="lg:col-span-1">
          <div className="sticky top-32 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Handover Readiness
            </h2>
            <div className="mt-3">
              <ReadinessBadge readiness={project.readiness} />
            </div>

            <div className="mt-5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-success">
                <CircleCheck className="size-4" aria-hidden />
                Ready ({ready.length})
              </p>
              <ul className="space-y-1.5">
                {ready.map((f) => (
                  <li key={f.key} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="size-3.5 text-success" aria-hidden />
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>

            {missing.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-danger">
                  <CircleAlert className="size-4" aria-hidden />
                  Missing ({missing.length})
                </p>
                <ul className="space-y-1.5">
                  {missing.map((f) => (
                    <li
                      key={f.key}
                      className={cn(
                        'flex items-center gap-2 text-sm',
                        f.severity === 'danger' ? 'text-danger' : 'text-warning',
                      )}
                    >
                      {f.severity === 'danger' ? (
                        <CircleAlert className="size-3.5" aria-hidden />
                      ) : (
                        <TriangleAlert className="size-3.5" aria-hidden />
                      )}
                      {f.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 space-y-2 border-t border-border pt-5">
              <Button
                className="h-10 w-full gap-2"
                variant={requested ? 'secondary' : 'default'}
                onClick={() => setRequested(true)}
                disabled={requested}
              >
                {requested ? (
                  <>
                    <CircleCheck className="size-4" aria-hidden />
                    Request sent
                  </>
                ) : (
                  <>
                    <Send className="size-4" aria-hidden />
                    Request Missing Context
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="h-10 w-full gap-2"
                onClick={() => assignBackup(project.id, 'Daniel Kim')}
                disabled={!!project.backupOwner}
              >
                <UserPlus className="size-4" aria-hidden />
                {project.backupOwner ? `Backup: ${project.backupOwner}` : 'Assign Backup Owner'}
              </Button>
              {requested && (
                <p className="pt-1 text-center text-xs text-muted-foreground">
                  {project.owner} has been notified to complete the missing fields.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  )
}
