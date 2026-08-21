'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRightLeft,
  Check,
  CircleAlert,
  CircleCheck,
  TriangleAlert,
  X,
  ArrowRight,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
import { usePortfolio, type Project } from '@/components/portfolio-store'
import { cn } from '@/lib/utils'

const NEW_OWNER = 'Sarah Patel'

function QueueCard({
  project,
  onTake,
}: {
  project: Project
  onTake: (p: Project) => void
}) {
  const preserved = project.fields.filter((f) => f.complete)
  const missing = project.fields.filter((f) => !f.complete)

  if (project.handedOver) {
    return (
      <article className="rounded-xl border border-success/40 bg-success-muted/40 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
            <CircleCheck className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-lg font-semibold text-foreground">{project.name}</h3>
            <p className="mt-1 text-sm font-medium text-success">
              Research handover initiated. Recipe remains attached.
            </p>
            <p className="mt-2 text-sm text-foreground/70">
              New owner: <span className="font-medium text-foreground">{project.owner}</span> ·
              previously Alex Chen
            </p>
            <Link
              href={`/recipe/${project.id}`}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
            >
              Review recipe card
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground">{project.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Outgoing owner: <span className="font-medium text-foreground">{project.owner}</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning-muted px-2.5 py-1 text-xs font-medium text-warning">
          <ArrowRightLeft className="size-3.5" aria-hidden />
          Awaiting handover
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-success/25 bg-success-muted/40 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-success">
            <Check className="size-3.5" aria-hidden />
            Preserved ({preserved.length})
          </p>
          <ul className="space-y-1">
            {preserved.map((f) => (
              <li key={f.key} className="text-sm text-foreground">
                {f.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-danger/25 bg-danger-muted/40 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-danger">
            <CircleAlert className="size-3.5" aria-hidden />
            Missing ({missing.length})
          </p>
          <ul className="space-y-1">
            {missing.length === 0 ? (
              <li className="text-sm text-muted-foreground">Nothing missing</li>
            ) : (
              missing.map((f) => (
                <li
                  key={f.key}
                  className={cn(
                    'flex items-center gap-1.5 text-sm',
                    f.severity === 'danger' ? 'text-danger' : 'text-warning',
                  )}
                >
                  {f.severity === 'danger' ? (
                    <CircleAlert className="size-3" aria-hidden />
                  ) : (
                    <TriangleAlert className="size-3" aria-hidden />
                  )}
                  {f.label}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button className="h-10 gap-2 px-4" onClick={() => onTake(project)}>
          <ArrowRightLeft className="size-4" aria-hidden />
          Take Ownership
        </Button>
        <Link
          href={`/recipe/${project.id}`}
          className={cn(buttonVariants({ variant: 'outline' }), 'h-10 px-4')}
        >
          View Recipe
        </Link>
      </div>
    </article>
  )
}

function ConfirmModal({
  project,
  onCancel,
  onConfirm,
}: {
  project: Project
  onCancel: () => void
  onConfirm: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" aria-hidden />
        </button>
        <span className="flex size-11 items-center justify-center rounded-xl bg-gold/15 text-gold-foreground">
          <ArrowRightLeft className="size-5 text-gold" aria-hidden />
        </span>
        <h2 id="confirm-title" className="mt-4 font-serif text-xl font-semibold text-foreground">
          Take ownership of {project.name}?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
          You will become responsible for reviewing and maintaining this research. The recipe —
          code, data, assumptions, notes and limitations — stays attached to the strategy.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" className="h-10 px-4" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="h-10 gap-2 px-4" onClick={onConfirm}>
            <Check className="size-4" aria-hidden />
            Confirm Handover
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function HandoverQueuePage() {
  const { projects, takeOwnership } = usePortfolio()
  const [pending, setPending] = useState<Project | null>(null)

  const alexProjects = projects.filter(
    (p) => p.owner === 'Alex Chen' || p.handedOver,
  )
  const remaining = alexProjects.filter((p) => !p.handedOver).length

  return (
    <AppShell>
      {/* Notification */}
      <div className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning-muted/60 p-4">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-warning/20 text-warning">
          <ArrowRightLeft className="size-5" aria-hidden />
        </span>
        <div>
          <p className="font-medium text-foreground">
            Alex Chen has transferred teams.{' '}
            {remaining > 0
              ? `${remaining} research ${remaining === 1 ? 'project requires' : 'projects require'} handover.`
              : 'All research has been handed over.'}
          </p>
          <p className="mt-0.5 text-sm text-foreground/70">
            Assign a new owner to keep each strategy&apos;s recipe maintained and accountable.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Handover Queue
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty">
          Research left behind when a team member moves on. Each strategy keeps its recipe — take
          ownership to become the accountable maintainer.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {alexProjects.map((p) => (
          <QueueCard key={p.id} project={p} onTake={setPending} />
        ))}
      </div>

      {pending && (
        <ConfirmModal
          project={pending}
          onCancel={() => setPending(null)}
          onConfirm={() => {
            takeOwnership(pending.id, NEW_OWNER)
            setPending(null)
          }}
        />
      )}
    </AppShell>
  )
}
