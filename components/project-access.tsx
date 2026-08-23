'use client'

import { ExternalLink, Mail } from 'lucide-react'

export function ProjectAccess({
  codebaseUrl,
  owner,
  ownerEmail,
}: {
  codebaseUrl: string
  owner: string
  ownerEmail: string
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs">
      <a
        href={codebaseUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
      >
        <ExternalLink className="size-3.5" aria-hidden />
        Codebase
      </a>
      <a
        href={`mailto:${ownerEmail}`}
        className="inline-flex min-w-0 items-center gap-1.5 text-muted-foreground hover:text-foreground hover:underline"
      >
        <Mail className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">
          {owner} · {ownerEmail}
        </span>
      </a>
    </div>
  )
}
