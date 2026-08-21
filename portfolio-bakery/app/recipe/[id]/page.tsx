'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  CircleCheck,
  TriangleAlert,
  CircleAlert,
  Send,
  GitCommitHorizontal,
  ChevronDown,
  ChevronUp,
  ChefHat,
  MessageSquarePlus,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { ReadinessBadge, StatusPill } from '@/components/status-badges'
import { Button } from '@/components/ui/button'
import { usePortfolio, type RecipeField } from '@/components/portfolio-store'
import { cn } from '@/lib/utils'

function FieldRow({
  field,
  sousChef,
  onAddComment,
}: {
  field: RecipeField
  sousChef: string | null
  onAddComment: (fieldKey: string, text: string) => void
}) {
  const complete = field.complete
  const danger = field.severity === 'danger'
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [commentText, setCommentText] = useState('')
  const isLong = field.value && field.value.length > 50

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onAddComment(field.key, commentText.trim())
      setCommentText('')
      setShowCommentBox(false)
    }
  }

  return (
    <div className="flex gap-3 py-4">
      <span
        className={cn(
          'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
          complete
            ? 'bg-success-muted text-success'
            : danger
              ? 'bg-danger-muted text-danger'
              : 'bg-warning-muted text-warning',
        )}
      >
        {complete ? (
          <Check className="size-3.5" aria-hidden />
        ) : danger ? (
          <CircleAlert className="size-3.5" aria-hidden />
        ) : (
          <TriangleAlert className="size-3.5" aria-hidden />
        )}
      </span>
      <div className="min-w-0 flex-1">
        {/* Field label + expand toggle */}
        <button
          onClick={() => isLong && setIsExpanded(!isExpanded)}
          className={cn(
            'group flex items-center justify-between w-full text-left',
            isLong ? 'cursor-pointer' : 'cursor-default',
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {field.label}
          </p>
          {isLong && (
            <span className="text-muted-foreground transition-transform group-hover:text-foreground">
              {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </span>
          )}
        </button>

        {/* Field value */}
        <p
          className={cn(
            'mt-1 text-sm text-pretty whitespace-pre-wrap transition-all',
            !isExpanded && isLong && 'line-clamp-1',
            complete
              ? 'text-foreground'
              : danger
                ? 'font-medium text-danger'
                : 'font-medium text-warning',
          )}
        >
          {field.value ??
            (danger ? 'Missing — required for handover' : 'Incomplete — needs detail')}
        </p>

        {/* Existing Sous Chef comment */}
        {field.peerComment && (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-950/30">
            <div className="mb-1 flex items-center gap-1.5">
              <ChefHat className="size-3.5 text-amber-600 dark:text-amber-400" aria-hidden />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Sous Chef · {field.peerComment.author}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
              {field.peerComment.text}
            </p>
          </div>
        )}

        {/* Add tip section */}
        {sousChef && (
          <div className="mt-2">
            {!showCommentBox ? (
              <button
                onClick={() => setShowCommentBox(true)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquarePlus className="size-3.5" />
                {field.peerComment ? 'Update tip' : 'Add Sous Chef tip'}
              </button>
            ) : (
              <div className="mt-2 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Tip as <span className="font-medium text-foreground">{sousChef}</span>
                </p>
                <textarea
                  className="w-full rounded-md border border-border bg-background p-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  rows={3}
                  placeholder="Leave a tip or flag for the owner..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmitComment}
                    className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Submit tip
                  </button>
                  <button
                    onClick={() => { setShowCommentBox(false); setCommentText('') }}
                    className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getProject, addPeerComment } = usePortfolio()
  const project = getProject(id)
  const [requested, setRequested] = useState(false)

  if (!project) notFound()

  const ready = project.fields.filter((f) => f.complete)
  const missing = project.fields.filter((f) => !f.complete)
  const commit = project.fields.find((f) => f.key === 'code')?.value
  const peerCommentCount = project.fields.filter((f) => f.peerComment).length

  return (
    <AppShell>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to portfolio
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium uppercase tracking-widest">Recipe Card</span>
            {commit && (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
                <GitCommitHorizontal className="size-3.5" aria-hidden />
                {commit.replace('commit ', '')}
              </span>
            )}
          </div>
          <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {project.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusPill status={project.status} />
            <ReadinessBadge readiness={project.readiness} />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recipe card */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Research Handover Card
              </h2>
              <span className="text-xs text-muted-foreground">
                {ready.length}/{project.fields.length} complete
              </span>
            </div>

            {/* Ownership summary */}
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-secondary/40 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Head Baker / Owner
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{project.owner}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Sous Chef
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  {project.sousChef ? (
                    <>
                      <ChefHat className="size-3.5 text-amber-500" />
                      <span className="text-sm font-medium text-foreground">{project.sousChef}</span>
                      {peerCommentCount > 0 && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                          {peerCommentCount} tip{peerCommentCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm font-medium text-warning">Not assigned</span>
                  )}
                </div>
              </div>
            </div>

            {/* Hypothesis */}
            <div className="mt-4 rounded-lg border border-gold/30 bg-gold/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-foreground/70">
                Strategy hypothesis
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground text-pretty">
                {project.hypothesis}
              </p>
            </div>

            {/* Field rows */}
            <div className="mt-2 divide-y divide-border">
              {project.fields.map((f) => (
                <FieldRow
                  key={f.key}
                  field={f}
                  sousChef={project.sousChef}
                  onAddComment={(fieldKey, text) =>
                    addPeerComment(project.id, fieldKey, {
                      author: project.sousChef ?? 'Sous Chef',
                      text,
                    })
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Handover readiness panel */}
        <aside className="lg:col-span-1">
          <div className="sticky top-32 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Handover Readiness
            </h2>
            <div className="mt-3">
              <ReadinessBadge readiness={project.readiness} />
            </div>

            {/* Sous Chef summary */}
            {project.sousChef && (
              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                <div className="flex items-center gap-1.5">
                  <ChefHat className="size-4 text-amber-600 dark:text-amber-400" />
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    Sous Chef: {project.sousChef}
                  </p>
                </div>
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                  {peerCommentCount > 0
                    ? `${peerCommentCount} tip${peerCommentCount !== 1 ? 's' : ''} left on this recipe.`
                    : 'No tips left yet.'}
                </p>
              </div>
            )}

            <div className="mt-5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-success">
                <CircleCheck className="size-4" aria-hidden />
                Ready ({ready.length})
              </p>
              <ul className="space-y-1.5">
                {ready.map((f) => (
                  <li key={f.key} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="size-3.5 text-success" aria-hidden />
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>

            {missing.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-danger">
                  <CircleAlert className="size-4" aria-hidden />
                  Missing ({missing.length})
                </p>
                <ul className="space-y-1.5">
                  {missing.map((f) => (
                    <li
                      key={f.key}
                      className={cn(
                        'flex items-center gap-2 text-sm',
                        f.severity === 'danger' ? 'text-danger' : 'text-warning',
                      )}
                    >
                      {f.severity === 'danger' ? (
                        <CircleAlert className="size-3.5" aria-hidden />
                      ) : (
                        <TriangleAlert className="size-3.5" aria-hidden />
                      )}
                      {f.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 space-y-2 border-t border-border pt-5">
              <Button
                className="h-10 w-full gap-2"
                variant={requested ? 'secondary' : 'default'}
                onClick={() => setRequested(true)}
                disabled={requested}
              >
                {requested ? (
                  <>
                    <CircleCheck className="size-4" aria-hidden />
                    Request sent
                  </>
                ) : (
                  <>
                    <Send className="size-4" aria-hidden />
                    Request Missing Context
                  </>
                )}
              </Button>
              {requested && (
                <p className="pt-1 text-center text-xs text-muted-foreground">
                  {project.owner} has been notified to complete the missing fields.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  )
}
