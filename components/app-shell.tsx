'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bell, CircleAlert, Info, LogOut, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import { usePortfolio } from '@/components/portfolio-store'
import { useConsole, type Notification } from '@/components/console-provider'
import { buttonVariants } from '@/components/ui/button'

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [localReadIds, setLocalReadIds] = useState<string[]>([])
  const [localDismissedIds, setLocalDismissedIds] = useState<string[]>([])
  const {
    userRole,
    employeeId,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    dismissNotification,
    respondToRecommendation,
  } = useConsole()
  const { projects, contextRequests } = usePortfolio()
  const contextNotifications: Notification[] = contextRequests.map((request) => {
    const project = projects.find((item) => item.id === request.projectId)
    return {
      id: `context-request-${request.id}`,
      audience: 'manager' as const,
      title: `${project?.name ?? 'Project'} needs missing context`,
      description: `${project?.owner ?? 'The owner'} has been asked to complete missing recipe fields.`,
      timestamp: request.createdAt,
      severity: 'warning' as const,
      actionLabel: 'Review recipe',
      actionHref: `/recipe/${request.projectId}`,
    }
  })
  const allNotifications = [...notifications, ...contextNotifications]
  const visibleNotifications = allNotifications.filter(
    (notification) =>
      notification.audience === userRole &&
      !localDismissedIds.includes(notification.id) &&
      (userRole !== 'employee' || notification.recipientId === employeeId),
  )
  const unreadCount = visibleNotifications.filter(
    (notification) =>
      !notification.read && !localReadIds.includes(notification.id),
  ).length
  const markRead = (notificationId: string) => {
    if (notificationId.startsWith('context-request-')) {
      setLocalReadIds((current) => [...new Set([...current, notificationId])])
    } else {
      markNotificationRead(notificationId)
    }
  }
  const dismiss = (notificationId: string) => {
    if (notificationId.startsWith('context-request-')) {
      setLocalDismissedIds((current) => [...new Set([...current, notificationId])])
    } else {
      dismissNotification(notificationId)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          buttonVariants({ variant: 'outline', size: 'icon' }),
          'relative h-9 w-9',
        )}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
      >
        <Bell className="size-4" aria-hidden />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex size-5 -translate-y-1/3 translate-x-1/3 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-danger-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-xl border border-border bg-card p-4 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-lg font-semibold text-foreground">Notifications</h2>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    markAllNotificationsRead()
                    setLocalReadIds(visibleNotifications.map((notification) => notification.id))
                  }}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close notifications"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          </div>
          <div className="mt-3 max-h-[min(28rem,70vh)] space-y-2 overflow-y-auto">
            {visibleNotifications.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
            ) : (
              visibleNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'rounded-lg border p-3',
                    notification.read || localReadIds.includes(notification.id)
                      ? 'border-border/60 bg-background'
                      : 'border-warning/40 bg-warning-muted/30',
                  )}
                >
                  <div className="flex items-start gap-2">
                    <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{notification.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {notification.actionHref && notification.actionLabel && (
                          <Link
                            href={notification.actionHref}
                            onClick={() => markRead(notification.id)}
                            className="text-xs font-semibold text-foreground underline-offset-2 hover:underline"
                          >
                            {notification.actionLabel}
                          </Link>
                        )}
                        {notification.kind === 'recommendation' &&
                          notification.relatedHandoverId &&
                          userRole === 'employee' && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  respondToRecommendation(notification.relatedHandoverId!, true)
                                  markNotificationRead(notification.id)
                                }}
                                className="text-xs font-semibold text-success hover:underline"
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  respondToRecommendation(notification.relatedHandoverId!, false)
                                  markNotificationRead(notification.id)
                                }}
                                className="text-xs font-semibold text-danger hover:underline"
                              >
                                Decline
                              </button>
                            </>
                          )}
                        {!notification.read && !localReadIds.includes(notification.id) && (
                          <button
                            type="button"
                            onClick={() => markRead(notification.id)}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => dismiss(notification.id)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const nav = [
  { href: '/', label: 'Portfolio' },
  { href: '/handover', label: 'Bread Basket' },
  { href: '/team', label: 'Team' },
  { href: '/archive', label: 'Archive' },
  { href: '/console/manager', label: 'Console', managerOnly: true },
]

function NavLinks({ pathname }: { pathname: string }) {
  const { projects } = usePortfolio()
  const { userRole } = useConsole()
  const queueCount = projects.filter(
    (p) => p.owner === 'Alex Chen' && !p.handedOver,
  ).length

  const items = nav.filter((item) => !item.managerOnly || userRole === 'manager')

  return (
    <>
      {items.map((item) => {
        const active =
          item.href === '/'
            ? pathname === '/'
            : item.href.startsWith('/console')
              ? pathname.startsWith('/console')
              : pathname.startsWith(item.href)
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
  const router = useRouter()
  const { displayName, logout } = useConsole()

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            {displayName && (
              <p className="text-xs text-muted-foreground md:hidden">
                Signed in as <span className="font-medium text-foreground">{displayName}</span>
              </p>
            )}
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <nav className="min-w-0 flex-1 overflow-x-auto">
              <div className="flex w-max items-center gap-1">
                <NavLinks pathname={pathname} />
              </div>
            </nav>
            <NotificationCenter />
            {displayName && (
              <p className="ml-2 hidden shrink-0 text-xs text-muted-foreground md:block">
                {displayName}
              </p>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-9 shrink-0 gap-1.5 px-3 text-xs',
              )}
            >
              <LogOut className="size-3.5" />
              Logout
            </button>
          </div>
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
