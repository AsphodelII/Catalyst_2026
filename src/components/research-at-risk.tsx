import Link from "next/link"
import { ArrowRight, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { memberById, missingCount, type Project } from "@/lib/data"

export function ResearchAtRisk({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null
  const owner = memberById(projects[0].ownerId)
  const totalMissing = projects.reduce((sum, p) => sum + missingCount(p), 0)

  return (
    <section
      aria-labelledby="at-risk-heading"
      className="overflow-hidden rounded-xl border border-[color-mix(in_oklch,var(--warning)_45%,var(--border))] bg-[color-mix(in_oklch,var(--warning)_10%,var(--card))]"
    >
      <div className="flex flex-col gap-5 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_oklch,var(--warning)_25%,transparent)] text-[color-mix(in_oklch,var(--warning)_60%,var(--foreground))]">
            <TriangleAlert className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 id="at-risk-heading" className="text-base font-semibold tracking-tight">
              Research at risk
            </h2>
            <p className="max-w-prose text-sm text-muted-foreground text-pretty">
              <span className="font-medium text-foreground">{owner?.name}</span> is leaving the desk.{" "}
              {projects.length} {projects.length === 1 ? "strategy" : "strategies"} still carry{" "}
              {totalMissing} unresolved handover {totalMissing === 1 ? "item" : "items"}. Capture the
              recipe before the context walks out the door.
            </p>
          </div>
        </div>

        <ul className="flex flex-col divide-y divide-border/70 rounded-lg border border-border/70 bg-card/60">
          {projects.map((project) => {
            const missing = missingCount(project)
            return (
              <li key={project.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
                      {owner?.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{project.name}</p>
                    <p className="text-xs text-[color-mix(in_oklch,var(--warning)_55%,var(--foreground))]">
                      {missing} {missing === 1 ? "item" : "items"} missing
                    </p>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm" className="shrink-0">
                  <Link href={`/recipe/${project.id}`}>
                    Review
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              </li>
            )
          })}
        </ul>

        <div>
          <Button asChild>
            <Link href="/handover-queue">
              Open handover queue
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
