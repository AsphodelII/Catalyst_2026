"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Inbox,
  PackageCheck,
} from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ReadinessBadge } from "@/components/status-badge"
import { usePortfolio } from "@/lib/portfolio-store"
import { memberById, missingCount, type Project } from "@/lib/data"

const NEW_OWNER_ID = "sarah"

export function HandoverQueue() {
  const { projects, takeOwnership } = usePortfolio()

  const departing = useMemo(() => projects.filter((p) => p.ownerId === "alex"), [projects])
  const pending = departing.filter((p) => !p.transferred)
  const completed = departing.filter((p) => p.transferred)

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
          Handover queue
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
          Strategies awaiting a new owner
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
          Alex Chen is leaving the desk. Review each recipe, close any gaps, then take ownership to
          transfer the strategy — and its full context — to a remaining researcher.
        </p>
      </header>

      <section aria-labelledby="pending-heading" className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 id="pending-heading" className="text-lg font-semibold tracking-tight">
            Pending handover
          </h2>
          <span className="text-sm text-muted-foreground">
            {pending.length} {pending.length === 1 ? "strategy" : "strategies"}
          </span>
        </div>

        {pending.length === 0 ? (
          <Empty className="rounded-xl border border-border bg-card">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PackageCheck />
              </EmptyMedia>
              <EmptyTitle>Queue cleared</EmptyTitle>
              <EmptyDescription>
                Every departing strategy has a new owner. The recipes are preserved.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-3">
            {pending.map((project) => (
              <QueueRow key={project.id} project={project} onConfirm={takeOwnership} />
            ))}
          </ul>
        )}
      </section>

      {completed.length > 0 && (
        <section aria-labelledby="completed-heading" className="flex flex-col gap-4">
          <h2 id="completed-heading" className="text-lg font-semibold tracking-tight">
            Handed over
          </h2>
          <ul className="flex flex-col gap-3">
            {completed.map((project) => {
              const owner = memberById(project.ownerId)
              return (
                <li
                  key={project.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-[color-mix(in_oklch,var(--success)_16%,transparent)] text-[var(--success)]">
                      <CheckCircle2 className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Transferred to {owner?.name}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/recipe/${project.id}`}>
                      View recipe
                      <ArrowRight data-icon="inline-end" />
                    </Link>
                  </Button>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}

function QueueRow({
  project,
  onConfirm,
}: {
  project: Project
  onConfirm: (id: string, newOwnerId: string) => void
}) {
  const [open, setOpen] = useState(false)
  const owner = memberById(project.ownerId)
  const newOwner = memberById(NEW_OWNER_ID)
  const missing = missingCount(project)

  function handleConfirm() {
    onConfirm(project.id, NEW_OWNER_ID)
    setOpen(false)
    toast.success(`${project.name} handed over`, {
      description: `${newOwner?.name} is now the owner. The recipe travelled with it.`,
    })
  }

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary/15 text-sm font-medium text-primary">
            {owner?.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{project.name}</p>
            <ReadinessBadge readiness={project.readiness} />
          </div>
          <p className="text-xs text-muted-foreground">
            Owner {owner?.name} ·{" "}
            {missing === 0 ? (
              <span className="text-[var(--success)]">recipe complete</span>
            ) : (
              <span className="text-[color-mix(in_oklch,var(--warning)_60%,var(--foreground))]">
                {missing} {missing === 1 ? "item" : "items"} missing
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:shrink-0">
        <Button asChild variant="outline" size="sm">
          <Link href={`/recipe/${project.id}`}>Review recipe</Link>
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Take ownership</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Take ownership of {project.name}?</DialogTitle>
              <DialogDescription>
                Ownership and the full recipe will transfer from {owner?.name} to a remaining
                researcher.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 p-4">
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
                    {owner?.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="leading-tight">
                  <p className="text-sm font-medium">{owner?.name}</p>
                  <p className="text-xs text-muted-foreground">Departing</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
                    {newOwner?.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="leading-tight">
                  <p className="text-sm font-medium">{newOwner?.name}</p>
                  <p className="text-xs text-muted-foreground">New owner</p>
                </div>
              </div>
            </div>

            {missing > 0 && (
              <p className="text-sm text-[color-mix(in_oklch,var(--warning)_60%,var(--foreground))]">
                This recipe still has {missing} unresolved {missing === 1 ? "item" : "items"}. You
                can transfer now, but consider closing the gaps first.
              </p>
            )}

            <Separator />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleConfirm}>
                <Inbox data-icon="inline-start" />
                Confirm handover
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </li>
  )
}
