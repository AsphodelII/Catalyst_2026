import Link from 'next/link'
import { Wheat } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('group inline-flex items-center gap-2.5', className)}>
      <span className="flex size-9 items-center justify-center rounded-lg bg-gold text-gold-foreground shadow-sm">
        <Wheat className="size-5" aria-hidden />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
          Portfolio Bakery
        </span>
        <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Research Handover
        </span>
      </span>
    </Link>
  )
}
