"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowLeft,
  Check,
  CircleDashed,
  Minus,
  GitCommitHorizontal,
  Database,
  SlidersHorizontal,
  ClipboardList,
  NotebookPen,
  ShieldAlert,
  UserRound,
  UserPlus,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ReadinessBadge } from "@/components/status-badge"
import { usePortfolio } from "@/lib/portfolio-store"
import { memberById, missingCount, type RecipeSection, type SectionState } from "@/lib/data"
import { cn } from "@/lib/utils"

const SECTION_ICON: Record<string, typeof Database> = {
  owner: UserRound,
  backup: UserPlus,
  code: GitCommitHorizontal,
  dataset: Database,
  parameters: SlidersHorizontal,
  assumptions: ClipboardList,
  notes: NotebookPen,
  limitations: ShieldAlert,
}

const STATE_META: Record<
  SectionState,
  { label: string; icon: typeof Check; className: string; ring: string }
> = {
  complete: {
    label: "Captured",
    icon: Check,
    className: "text-[var(--success)]",
    ring: "border-[color-mix(in_oklch,var(--success)_35%,var(--border))]",
  },
  partial: {
    label: "Partial",
    icon: CircleDashed,
    className: "text-[color-mix(in_oklch,var(--warning)_60%,var(--foreground))]",
    ring: "border-[color-mix(in_oklch,var(--warning)_45%,var(--border))]",
  },
  missing: {
    label: "Missing",
    icon: Minus,
    className: "text-[var(--destructive)]",
    ring: "border-[color-mix(in_oklch,var(--destructive)_35%,var(--border))]",
  },
}

// Group sections into recipe-style sections.
const GROUPS: { title: string; keys: string[] }[] = [
  { title: "Ingredients", keys: ["dataset", "parameters", "code"] },
  { title: "Method", keys: ["assumptions", "notes"] },
  { title: "Notes from the kitchen", keys: ["limitations"] },
  { title: "Ownership", keys: ["owner", "backup"] },
]

export function RecipeCard({ projectId }: { projectId: string }) {
  const { projects, assignBackup } = usePortfolio()
  const project = projects.find((p) => p.id === projectId)
  const [assigning, setAssigning] = useState(false)

  const sectionMap = useMemo(() => {
    const map = new Map<string, RecipeSection>()
    project?.sections.forEach((s) => map.set(s.key, s))
    return map
  }, [project])

  if (!project) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-muted-foreground">That recipe card could not be found.</p>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft data-icon="inline-start" />
            Back to portfolio
          </Link>
        </Button>
      </div>
    )
  }

  const owner = memberById(project.ownerId)
  const missing = missingCount(project)
  const captured = project.sections.length - missing
  const recipeStatus = missing === 0 ? "Ready" : project.readiness === "Incomplete" ? "Incomplete" : "Needs review"

  function handleAssignBackup() {
    setAssigning(true)
    assignBackup(project!.id, "Sarah Patel")
    toast.success("Backup owner assigned", {
      description: "Sarah Patel is now the backup owner for this strategy.",
    })
    setTimeout(() => setAssigning(false), 400)
  }

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 self-start text-muted-foreground">
        <Link href="/">
          <ArrowLeft data-icon="inline-start" />
          Portfolio
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Recipe body */}
        <article className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Card header — styled like a recipe header */}
          <header className="border-b border-dashed border-border px-6 py-6 md:px-8 md:py-8">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Strategy recipe
              </span>
              <ReadinessBadge readiness={recipeStatus} />
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-balance md:text-3xl">
              {project.name}
            </h1>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground text-pretty">
              {project.hypothesis}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <UserRound className="size-4" aria-hidden="true" />
                Researcher{" "}
                <span className="font-medium text-foreground">{owner?.name}</span>
              </span>
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{captured}</span> of{" "}
                {project.sections.length} elements captured
              </span>
            </div>
          </header>

          <div className="flex flex-col gap-8 px-6 py-6 md:px-8 md:py-8">
            {GROUPS.map((group) => (
              <section key={group.title} className="flex flex-col gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {group.title}
                </h2>
                <div className="flex flex-col gap-2.5">
                  {group.keys.map((key) => {
                    const section = sectionMap.get(key)
                    if (!section) return null
                    return <SectionRow key={key} section={section} />
                  })}
                </div>
              </section>
            ))}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Handover readiness</h2>
            <div className="mt-3 flex items-center gap-3">
              <ReadinessBadge readiness={recipeStatus} />
              <span className="text-sm text-muted-foreground">
                {missing === 0
                  ? "Fully reproducible"
                  : `${missing} ${missing === 1 ? "gap" : "gaps"} to close`}
              </span>
            </div>
            <Separator className="my-4" />
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Owner</dt>
                <dd className="font-medium">{owner?.name}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Backup owner</dt>
                <dd
                  className={cn(
                    "font-medium",
                    sectionMap.get("backup")?.state === "missing" && "text-[var(--destructive)]",
                  )}
                >
                  {sectionMap.get("backup")?.value}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Code version</dt>
                <dd className="font-mono text-xs font-medium">
                  {sectionMap.get("code")?.value}
                </dd>
              </div>
            </dl>
          </div>

          {sectionMap.get("backup")?.state === "missing" && (
            <div className="rounded-xl border border-[color-mix(in_oklch,var(--warning)_45%,var(--border))] bg-[color-mix(in_oklch,var(--warning)_10%,var(--card))] p-5">
              <h2 className="text-sm font-semibold">Close a gap</h2>
              <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
                No backup owner is assigned. Name one so this strategy has a second set of hands.
              </p>
              <Button
                className="mt-3 w-full"
                onClick={handleAssignBackup}
                disabled={assigning}
              >
                <UserPlus data-icon="inline-start" />
                Assign Sarah Patel as backup
              </Button>
            </div>
          )}

          <Button asChild variant="outline" className="w-full">
            <Link href="/handover-queue">Go to handover queue</Link>
          </Button>
        </aside>
      </div>
    </div>
  )
}

function SectionRow({ section }: { section: RecipeSection }) {
  const Icon = SECTION_ICON[section.key] ?? ClipboardList
  const meta = STATE_META[section.state]
  const StateIcon = meta.icon
  const isEmpty = section.state === "missing"

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border bg-background/40 p-3.5",
        meta.ring,
      )}
    >
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{section.label}</p>
          <span className={cn("flex items-center gap-1 text-xs font-medium", meta.className)}>
            <StateIcon className="size-3.5" aria-hidden="true" />
            {meta.label}
          </span>
        </div>
        <p
          className={cn(
            "mt-1 text-sm leading-relaxed text-pretty",
            isEmpty ? "italic text-muted-foreground/70" : "text-muted-foreground",
          )}
        >
          {section.value}
        </p>
      </div>
    </div>
  )
}
