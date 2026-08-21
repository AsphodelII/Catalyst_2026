'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Info } from 'lucide-react'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import { usePortfolio } from '@/components/portfolio-store'

const nav = [
  { href: '/', label: 'Portfolio' },
  { href: '/handover', label: 'Handover Queue' },
  { href: '/team', label: 'Team' },
]

function NavLinks({ pathname }: { pathname: string }) {
  const { projects } = usePortfolio()
  const queueCount = projects.filter(
    (p) => p.owner === 'Alex Chen' && !p.handedOver,
  ).length

  return (
    <>
      {nav.map((item) => {
        const active =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
            {item.href === '/handover' && queueCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-danger text-[11px] font-semibold text-danger-foreground">
                {queueCount}
              </span>
            )}
          </Link>
        )
      })}
    </>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex items-center justify-between gap-4">
            <Logo />
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto">
            <NavLinks pathname={pathname} />
          </nav>
        </div>
        <div className="border-t border-border/60 bg-gold/10">
          <p className="mx-auto w-full max-w-6xl px-4 py-1.5 text-center font-serif text-sm italic text-foreground/80 sm:px-6">
            &ldquo;You kept the model. But did you keep the recipe?&rdquo;
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>

      <footer className="border-t border-border bg-card/60">
        <div className="mx-auto flex w-full max-w-6xl items-start gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <p className="text-pretty">
            Portfolio Bakery supports research handover; it does not validate strategy
            performance. Readiness reflects documentation completeness only — not profitability
            or approval for live trading. Prototype with mock data.
          </p>
        </div>
      </footer>
    </div>
  )
}
