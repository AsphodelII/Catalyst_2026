"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Inbox, Users } from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Portfolio", icon: LayoutGrid, match: (p: string) => p === "/" || p.startsWith("/recipe") },
  { href: "/handover-queue", label: "Handover Queue", icon: Inbox, match: (p: string) => p.startsWith("/handover-queue") },
  { href: "/team", label: "Team", icon: Users, match: (p: string) => p.startsWith("/team") },
]

const DISCLAIMER =
  "Portfolio Bakery supports research handover; it does not validate strategy performance."

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Logo />
            </Link>
          </div>

          <nav aria-label="Primary" className="flex items-center gap-1 overflow-x-auto">
            {NAV.map((item) => {
              const active = item.match(pathname)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="border-t border-border/70 bg-secondary/30">
          <p className="mx-auto w-full max-w-6xl px-4 py-1.5 text-center text-xs italic text-muted-foreground md:px-6 md:text-left">
            &ldquo;You kept the model. But did you keep the recipe?&rdquo;
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-10">{children}</main>

      <footer className="border-t border-border bg-secondary/30">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground md:px-6">
          {DISCLAIMER}
        </p>
      </footer>
    </div>
  )
}
