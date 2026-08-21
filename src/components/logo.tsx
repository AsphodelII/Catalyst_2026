import { Croissant } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Croissant className="size-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Portfolio Bakery
        </span>
        <span className="mt-0.5 text-[11px] font-medium text-muted-foreground">
          Research handover
        </span>
      </span>
    </div>
  )
}
