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
import { usePortfolio, type Project, type TeamMember } from '@/components/portfolio-store'
import { useConsole } from '@/components/console-provider'
import { cn } from '@/lib/utils'
import { ProjectAccess } from '@/components/project-access'

function QueueCard({
  project,
  onTake,
  meetings,
}: {
  project: Project
  onTake: (p: Project) => void
  meetings: { projectId: string }[]
}) {
  const preserved = project.fields.filter((f) => f.complete)
  const missing = project.fields.filter((f) => !f.complete)
  const hasMeeting = meetings.some((meeting) => meeting.projectId === project.id)

  if (project.handedOver) {
    return (
      <article className="flex h-full rounded-xl border border-success/40 bg-success-muted/40 p-5 shadow-sm">
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
            <ProjectAccess
              codebaseUrl={project.codebaseUrl}
              owner={project.owner}
              ownerEmail={project.ownerEmail}
            />
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
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

      <div className="mt-4 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
        <div className="h-48 rounded-lg border border-success/25 bg-success-muted/40 p-3">
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
        <div className="h-48 rounded-lg border border-danger/25 bg-danger-muted/40 p-3">
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
      {hasMeeting && (
        <Link
          href={`/recipe/${project.id}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
        >
          Meeting available
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
      <ProjectAccess
        codebaseUrl={project.codebaseUrl}
        owner={project.owner}
        ownerEmail={project.ownerEmail}
      />
    </article>
  )
}

function ConfirmModal({
  project,
  team,
  owner,
  onOwnerChange,
  onCancel,
  onConfirm,
  lockedOwner,
}: {
  project: Project
  team: TeamMember[]
  owner: string
  onOwnerChange: (owner: string) => void
  onCancel: () => void
  onConfirm: () => void
  lockedOwner?: string | null
}) {
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
          The selected team member will become responsible for reviewing and maintaining this
          research. The recipe — code, data, assumptions, notes and limitations — stays attached
          to the strategy.
        </p>
        {lockedOwner ? (
          <p className="mt-5 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-foreground">
            New owner: <span className="font-medium">{lockedOwner}</span>
          </p>
        ) : (
          <>
            <label className="mt-5 block text-sm font-medium text-foreground" htmlFor="new-owner">
              New owner
            </label>
            <select
              id="new-owner"
              value={owner}
              onChange={(e) => onOwnerChange(e.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {team
                .filter((member) => member.availability !== 'transferred')
                .map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name} · {member.role}
                  </option>
                ))}
            </select>
          </>
        )}
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
  const { projects, takeOwnership, team } = usePortfolio()
  const {
    userRole,
    displayName,
    employees,
    transferProjectOwnership,
    logCompletedHandover,
    meetings,
  } = useConsole()
  const [pending, setPending] = useState<Project | null>(null)
  const assignableMembers = team.filter((member) => member.availability !== 'transferred')
  const lockedOwner = userRole === 'employee' ? displayName : null
  const [newOwner, setNewOwner] = useState(
    lockedOwner ?? assignableMembers[0]?.name ?? '',
  )

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
          Bread Basket
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty">
          Research left behind when a team member moves on. Each strategy keeps its recipe — take
          ownership to become the accountable maintainer.
        </p>
      </div>

      <div className="mt-6 grid auto-rows-fr grid-cols-1 gap-4 lg:grid-cols-2">
        {alexProjects.map((p) => (
          <QueueCard
            key={p.id}
            project={p}
            onTake={setPending}
            meetings={meetings}
          />
        ))}
      </div>

      {pending && (
        <ConfirmModal
          project={pending}
          team={team}
          owner={newOwner}
          lockedOwner={lockedOwner}
          onOwnerChange={setNewOwner}
          onCancel={() => setPending(null)}
          onConfirm={() => {
            const ownerName = lockedOwner ?? newOwner
            const fromId =
              employees.find((e) => e.name === pending.owner)?.id ?? 'alex'
            const toId = employees.find((e) => e.name === ownerName)?.id
            takeOwnership(pending.id, ownerName)
            transferProjectOwnership(pending.id, ownerName)
            if (toId) {
              logCompletedHandover(fromId, toId, pending.id)
            }
            setPending(null)
          }}
        />
      )}
    </AppShell>
  )
}
