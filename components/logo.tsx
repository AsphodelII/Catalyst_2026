import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('group inline-flex items-center', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Logo.png" alt="Portfolio Bakery" className="h-14 w-auto" />
    </Link>
  )
}
