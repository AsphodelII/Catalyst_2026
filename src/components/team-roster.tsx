"use client"

import Link from "next/link"
import { useMemo } from "react"
import { ArrowUpRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { StatusDot } from "@/components/status-badge"
import { usePortfolio } from "@/lib/portfolio-store"
import { TEAM, missingCount, type Project } from "@/lib/data"
import { cn } from "@/lib/utils"

export function TeamRoster() {
  const { projects } = usePortfolio()

  const byOwner = useMemo(() => {
    const map = new Map<string, Project[]>()
    projects.forEach((p) => {
      const list = map.get(p.ownerId) ?? []
      list.push(p)
      map.set(p.ownerId, list)
    })
    return map
  }, [projects])

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Team</span>
        <h1 className="text-3xl font-semibold tracking-tight text-balance">The desk</h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
          Who owns what, and where the recipes stand. When someone moves on, their strategies should
          never move on with them.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {TEAM.map((member) => {
          const owned = byOwner.get(member.id) ?? []
          const gaps = owned.reduce((sum, p) => sum + missingCount(p), 0)
          return (
            <article
              key={member.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-11">
                    <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {owned.length} {owned.length === 1 ? "strategy" : "strategies"} · {gaps}{" "}
                      {gaps === 1 ? "gap" : "gaps"}
                    </p>
                  </div>
                </div>
                {member.tag && (
                  <Badge
                    className={cn(
                      "border-transparent font-medium",
                      member.tag === "Transferred"
                        ? "bg-secondary text-muted-foreground"
                        : "bg-[color-mix(in_oklch,var(--success)_16%,transparent)] text-[var(--success)]",
                    )}
                  >
                    {member.tag}
                  </Badge>
                )}
              </div>

              <Separator />

              {owned.length === 0 ? (
                <p className="text-sm italic text-muted-foreground">No strategies assigned.</p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {owned.map((project) => {
                    const missing = missingCount(project)
                    return (
                      <li key={project.id}>
                        <Link
                          href={`/recipe/${project.id}`}
                          className="group flex items-center justify-between gap-3 rounded-md px-2 py-2 outline-none transition-colors hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            <StatusDot
                              readiness={missing === 0 ? "Ready" : project.readiness}
                            />
                            <span className="truncate text-sm font-medium">{project.name}</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                            {missing === 0 ? "Complete" : `${missing} missing`}
                            <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
