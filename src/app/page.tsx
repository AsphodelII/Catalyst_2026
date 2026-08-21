"use client"

import { useMemo } from "react"
import { usePortfolio } from "@/lib/portfolio-store"
import { missingCount } from "@/lib/data"
import { ProjectCard } from "@/components/project-card"
import { ResearchAtRisk } from "@/components/research-at-risk"

export default function DashboardPage() {
  const { projects } = usePortfolio()

  const stats = useMemo(() => {
    const ready = projects.filter((p) => p.readiness === "Ready").length
    const atRisk = projects.filter((p) => !p.transferred && missingCount(p) > 0).length
    return { total: projects.length, ready, atRisk }
  }, [projects])

  const departing = useMemo(
    () => projects.filter((p) => p.ownerId === "alex" && !p.transferred),
    [projects],
  )

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
          Research handover
        </span>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          Keep the recipe, not just the model.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
          Every strategy on the desk carries hidden context — the data, assumptions, and reasoning
          that make it reproducible. Portfolio Bakery captures that recipe so research survives when
          the researcher moves on.
        </p>

        <dl className="mt-2 grid grid-cols-3 gap-3 sm:max-w-md">
          <Stat label="Strategies" value={stats.total} />
          <Stat label="Handover ready" value={stats.ready} tone="success" />
          <Stat label="At risk" value={stats.atRisk} tone="warning" />
        </dl>
      </section>

      {departing.length > 0 && <ResearchAtRisk projects={departing} />}

      <section aria-labelledby="portfolio-heading" className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 id="portfolio-heading" className="text-lg font-semibold tracking-tight">
            Portfolio
          </h2>
          <span className="text-sm text-muted-foreground">{projects.length} strategies</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  )
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string
  value: number
  tone?: "default" | "success" | "warning"
}) {
  const toneClass =
    tone === "success"
      ? "text-[var(--success)]"
      : tone === "warning"
        ? "text-[color-mix(in_oklch,var(--warning)_60%,var(--foreground))]"
        : "text-foreground"
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <dd className={`text-2xl font-semibold tabular-nums ${toneClass}`}>{value}</dd>
      <dt className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</dt>
    </div>
  )
}
