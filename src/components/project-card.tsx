import Link from "next/link"
import { ArrowUpRight, CircleAlert, CircleCheck } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ReadinessBadge } from "@/components/status-badge"
import { memberById, missingCount, type Project } from "@/lib/data"
import { cn } from "@/lib/utils"

export function ProjectCard({ project }: { project: Project }) {
  const owner = memberById(project.ownerId)
  const missing = missingCount(project)

  return (
    <Card className="group relative gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
      <Link
        href={`/recipe/${project.id}`}
        className="absolute inset-0 z-10 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="sr-only">Open the recipe card for {project.name}</span>
      </Link>

      <CardHeader className="gap-0 px-5 pt-5 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <ReadinessBadge readiness={project.readiness} />
            <h3 className="text-lg font-semibold tracking-tight text-balance">{project.name}</h3>
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </CardHeader>

      <CardContent className="px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
              {owner?.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-foreground">{owner?.name}</span>
            <span className="text-xs text-muted-foreground">Owner · {project.status}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/70 px-5 py-3">
        <div
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium",
            missing === 0 ? "text-[var(--success)]" : "text-muted-foreground",
          )}
        >
          {missing === 0 ? (
            <>
              <CircleCheck className="size-4" aria-hidden="true" />
              Recipe complete
            </>
          ) : (
            <>
              <CircleAlert className="size-4 text-[var(--warning)]" aria-hidden="true" />
              {missing} {missing === 1 ? "item" : "items"} missing
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
