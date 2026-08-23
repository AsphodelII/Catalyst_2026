'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { useConsole } from '@/components/console-provider'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LoginForm() {
  const { login } = useConsole()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(username, password)) {
      setError('')
    } else {
      setError('Invalid username or password')
      setPassword('')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logo.png"
            alt="Portfolio Bakery"
            className="h-28 w-auto"
          />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <AlertCircle className="size-4 text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button type="submit" className={cn(buttonVariants({ variant: 'default' }), 'w-full')}>
            Sign In
          </button>
        </form>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
              Manager
            </p>
            <p className="mt-2 text-sm font-mono text-foreground">manager</p>
            <p className="text-sm font-mono text-foreground">manager123</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
              Employee — Sarah Patel
            </p>
            <p className="mt-2 text-sm font-mono text-foreground">sarah</p>
            <p className="text-sm font-mono text-foreground">sarah123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
