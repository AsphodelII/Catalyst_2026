'use client'

import { ArrowRightLeft, CircleCheck, ShieldCheck, LoaderCircle } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { usePortfolio, type TeamMember } from '@/components/portfolio-store'
import { cn } from '@/lib/utils'

const availabilityMap = {
  active: {
    label: 'Active',
    icon: CircleCheck,
    className: 'border-success/30 bg-success-muted text-success',
  },
  transferred: {
    label: 'Transferred',
    icon: ArrowRightLeft,
    className: 'border-danger/30 bg-danger-muted text-danger',
  },
  available: {
    label: 'Available for handover',
    icon: LoaderCircle,
    className: 'border-warning/40 bg-warning-muted text-warning',
  },
} as const

function MemberCard({ member }: { member: TeamMember }) {
  const a = availabilityMap[member.availability]
  const Icon = a.icon
  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex size-11 items-center justify-center rounded-full font-serif text-sm font-semibold',
              member.availability === 'transferred'
                ? 'bg-muted text-muted-foreground'
                : 'bg-gold/20 text-gold-foreground',
            )}
          >
            {member.initials}
          </span>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
            a.className,
          )}
        >
          <Icon className="size-3.5" aria-hidden />
          {a.label}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Active research ({member.active.length})
          </p>
          {member.active.length === 0 ? (
            <p className="text-sm text-muted-foreground">None assigned</p>
          ) : (
            <ul className="space-y-1.5">
              {member.active.map((name) => (
                <li key={name} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="size-1.5 rounded-full bg-gold" aria-hidden />
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <ShieldCheck className="size-3.5" aria-hidden />
            Backup responsibilities ({member.backups.length})
          </p>
          {member.backups.length === 0 ? (
            <p className="text-sm text-muted-foreground">None</p>
          ) : (
            <ul className="space-y-1.5">
              {member.backups.map((name) => (
                <li key={name} className="flex items-center gap-2 text-sm text-foreground">
                  <CircleCheck className="size-3.5 text-success" aria-hidden />
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  )
}

export default function TeamPage() {
  const { team } = usePortfolio()

  return (
    <AppShell>
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          People
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Team
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty">
          Who owns what, and who covers for whom. Backup ownership is the safety net that keeps a
          recipe maintained when a researcher moves on.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {team.map((m) => (
          <MemberCard key={m.id} member={m} />
        ))}
      </div>
    </AppShell>
  )
}
