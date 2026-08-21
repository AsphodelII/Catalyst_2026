import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Readiness } from "@/lib/data"

const READINESS_STYLES: Record<Readiness, string> = {
  Ready:
    "border-transparent bg-[color-mix(in_oklch,var(--success)_16%,transparent)] text-[var(--success)]",
  "Needs review":
    "border-transparent bg-[color-mix(in_oklch,var(--warning)_22%,transparent)] text-[color-mix(in_oklch,var(--warning)_65%,var(--foreground))]",
  Incomplete:
    "border-transparent bg-[color-mix(in_oklch,var(--destructive)_14%,transparent)] text-[var(--destructive)]",
}

const DOT_STYLES: Record<Readiness, string> = {
  Ready: "bg-[var(--success)]",
  "Needs review": "bg-[var(--warning)]",
  Incomplete: "bg-[var(--destructive)]",
}

export function ReadinessBadge({
  readiness,
  className,
}: {
  readiness: Readiness
  className?: string
}) {
  return (
    <Badge className={cn("gap-1.5 font-medium", READINESS_STYLES[readiness], className)}>
      <span className={cn("size-1.5 rounded-full", DOT_STYLES[readiness])} aria-hidden="true" />
      {readiness}
    </Badge>
  )
}

export function StatusDot({ readiness }: { readiness: Readiness }) {
  return <span className={cn("size-2 rounded-full", DOT_STYLES[readiness])} aria-hidden="true" />
}
