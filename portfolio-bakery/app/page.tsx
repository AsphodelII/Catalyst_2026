'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { ProjectCard } from '@/components/project-card'
import { ReadinessBadge } from '@/components/status-badges'
import { buttonVariants } from '@/components/ui/button'
import { usePortfolio } from '@/components/portfolio-store'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { projects, missingCount } = usePortfolio()

  const atRisk = projects.filter(
    (p) => p.owner === 'Alex Chen' && !p.handedOver && missingCount(p) > 0,
  )
  const totalMissing = atRisk.reduce((sum, p) => sum + missingCount(p), 0)

  const readyCount = projects.filter((p) => p.readiness === 'ready').length

  return (
    <AppShell>
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Overview
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            Research Portfolio
          </h1>
          <p className="mt-2 max-w-xl text-pretty text-sm text-muted-foreground">
            Every strategy carries its recipe — code, data, assumptions, notes, limitations and
            ownership — so research context never leaves with the researcher.
          </p>
        </div>
        <div className="flex gap-6 rounded-xl border border-border bg-card px-5 py-3 shadow-sm">
          <div>
            <p className="font-serif text-2xl font-semibold text-foreground">{projects.length}</p>
            <p className="text-xs text-muted-foreground">Strategies</p>
          </div>
          <div className="border-l border-border pl-6">
            <p className="font-serif text-2xl font-semibold text-success">{readyCount}</p>
            <p className="text-xs text-muted-foreground">Handover ready</p>
          </div>
        </div>
      </div>

      {/* Research at risk */}
      {atRisk.length > 0 && (
        <section className="mt-8 overflow-hidden rounded-xl border border-danger/30 bg-danger-muted/50">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-danger/15 text-danger">
                <AlertTriangle className="size-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Research at Risk
                </h2>
                <p className="mt-1 max-w-lg text-sm text-foreground/70 text-pretty">
                  <span className="font-medium text-foreground">Alex Chen</span> owns{' '}
                  {atRisk.length} strategies with{' '}
                  <span className="font-medium text-danger">{totalMissing} pieces</span> of missing
                  handover context. Resolve these before the recipe is lost.
                </p>
              </div>
            </div>
            <Link
              href="/handover"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'h-10 shrink-0 gap-2 px-4',
              )}
            >
              Open Handover Queue
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="divide-y divide-danger/15 border-t border-danger/20 bg-card/40">
            {atRisk.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
              >
                <Link
                  href={`/recipe/${p.id}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {p.name}
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-danger">{missingCount(p)} missing</span>
                  <ReadinessBadge readiness={p.readiness} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Projects grid */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="size-4 text-gold" aria-hidden />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            All Strategies
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} missing={missingCount(p)} />
          ))}
        </div>
      </section>
    </AppShell>
  )
}
