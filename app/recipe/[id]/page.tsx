'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  CalendarPlus,
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
  Video,
  X,
  HelpCircle,
  Megaphone,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { ReadinessBadge, StatusPill } from '@/components/status-badges'
import { Button } from '@/components/ui/button'
import {
  usePortfolio,
  type RecipeField,
  type TeamMember,
} from '@/components/portfolio-store'
import { useConsole } from '@/components/console-provider'
import { cn } from '@/lib/utils'
import { ProjectAccess } from '@/components/project-access'

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

function ScheduleMeetingModal({
  projectName,
  previousOwner,
  team,
  newOwner,
  onOwnerChange,
  scheduledDate,
  onDateChange,
  scheduledTime,
  onTimeChange,
  meetingNotes,
  onNotesChange,
  onCancel,
  onConfirm,
}: {
  projectName: string
  previousOwner: string
  team: TeamMember[]
  newOwner: string
  onOwnerChange: (owner: string) => void
  scheduledDate: string
  onDateChange: (date: string) => void
  scheduledTime: string
  onTimeChange: (time: string) => void
  meetingNotes: string
  onNotesChange: (notes: string) => void
  onCancel: () => void
  onConfirm: () => void
}) {
  const canConfirm = Boolean(newOwner && scheduledDate && scheduledTime)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-meeting-title"
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden
      />
      <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" aria-hidden />
        </button>
        <span className="flex size-11 items-center justify-center rounded-xl bg-gold/15 text-gold-foreground">
          <CalendarPlus className="size-5 text-gold" aria-hidden />
        </span>
        <h2 id="schedule-meeting-title" className="mt-4 font-serif text-xl font-semibold text-foreground">
          Schedule handover meeting
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
          {previousOwner} will walk the new owner through the algorithm behind {projectName}.
        </p>

        <label className="mt-5 block text-sm font-medium text-foreground" htmlFor="meeting-owner">
          New owner
        </label>
        <select
          id="meeting-owner"
          value={newOwner}
          onChange={(e) => onOwnerChange(e.target.value)}
          className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {team.map((member) => (
            <option key={member.id} value={member.name}>
              {member.name} · {member.role}
            </option>
          ))}
        </select>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="meeting-date" className="block text-sm font-medium text-foreground">
              Date
            </label>
            <input
              id="meeting-date"
              type="date"
              value={scheduledDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div>
            <label htmlFor="meeting-time" className="block text-sm font-medium text-foreground">
              Time
            </label>
            <input
              id="meeting-time"
              type="time"
              value={scheduledTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="meeting-notes" className="block text-sm font-medium text-foreground">
            Notes
          </label>
          <textarea
            id="meeting-notes"
            rows={3}
            placeholder="What should the walkthrough cover?"
            value={meetingNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="mt-1 block w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" className="h-10 px-4" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="h-10 gap-2 px-4" onClick={onConfirm} disabled={!canConfirm}>
            <CalendarPlus className="size-4" aria-hidden />
            Schedule Meeting
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getProject, addPeerComment, team, requestMissingContext } = usePortfolio()
  const { meetings, scheduleMeeting, askQuestion } = useConsole()
  const project = getProject(id)
  const [requested, setRequested] = useState(false)
  const [meetingOpen, setMeetingOpen] = useState(false)
  const [newOwner, setNewOwner] = useState('')
  const [scheduledDate, setScheduledDate] = useState<string>('')
  const [scheduledTime, setScheduledTime] = useState<string>('')
  const [meetingNotes, setMeetingNotes] = useState<string>('')
  const [openFaqs, setOpenFaqs] = useState<number[]>([])
  const [askOpen, setAskOpen] = useState(false)
  const [askText, setAskText] = useState('')
  const [askSent, setAskSent] = useState(false)

  if (!project) notFound()

  const toggleFaq = (index: number) => {
    setOpenFaqs((current) =>
      current.includes(index) ? current.filter((i) => i !== index) : [...current, index],
    )
  }

  const handleAskSubmit = () => {
    if (!askText.trim()) return
    askQuestion(project.id, askText.trim())
    setAskText('')
    setAskOpen(false)
    setAskSent(true)
  }

  const assignableMembers = team.filter((member) => member.availability !== 'transferred')

  const ready = project.fields.filter((f) => f.complete)
  const missing = project.fields.filter((f) => !f.complete)
  const commit = project.fields.find((f) => f.key === 'code')?.value
  const peerCommentCount = project.fields.filter((f) => f.peerComment).length
  const projectMeetings = meetings.filter((meeting) => meeting.projectId === project.id)

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
            <ReadinessBadge project={project} />
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

            <ProjectAccess
              codebaseUrl={project.codebaseUrl}
              owner={project.owner}
              ownerEmail={project.ownerEmail}
            />

            {/* Elevator pitch */}
            <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4">
              <div className="flex items-center gap-1.5">
                <Megaphone className="size-4 text-gold" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Elevator pitch
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground text-pretty">
                {project.elevatorPitch}
              </p>
            </div>

            {projectMeetings.length > 0 && (
              <div className="mt-4 rounded-lg border border-gold/30 bg-gold/10 p-4">
                <h2 className="font-serif text-lg font-semibold text-foreground">Meeting history</h2>
                <div className="mt-3 space-y-3">
                  {projectMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 bg-card/60 p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Algorithm walkthrough with {meeting.previousOwner}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {meeting.scheduledDate} at {meeting.scheduledTime} · {meeting.status.replace('-', ' ')}
                        </p>
                      </div>
                      {meeting.recordingUrl && (
                        <a
                          href={meeting.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
                        >
                          <Video className="size-4" aria-hidden />
                          View recording
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hypothesis */}
            <div className="mt-4 rounded-lg border border-gold/30 bg-gold/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-foreground/70">
                Strategy hypothesis
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground text-pretty">
                {project.hypothesis}
              </p>
            </div>

            {/* FAQ */}
            <div className="mt-4 rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="size-4 text-muted-foreground" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Frequently asked questions
                </p>
              </div>
              <ul className="mt-3 divide-y divide-border">
                {(project.faqs ?? []).map((faq, index) => {
                  const isOpen = openFaqs.includes(index)
                  return (
                    <li key={faq.q}>
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-3 py-3 text-left"
                      >
                        <span className="text-sm font-medium text-foreground">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                        ) : (
                          <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                        )}
                      </button>
                      {isOpen && (
                        <p className="pb-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                          {faq.a}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>

              <div className="mt-3 border-t border-border pt-3">
                {askSent ? (
                  <p className="text-sm font-medium text-success">
                    Your question was sent to {project.sousChef ?? 'the manager'}.
                  </p>
                ) : askOpen ? (
                  <div>
                    <label htmlFor="ask-question" className="block text-sm font-medium text-foreground">
                      Ask {project.sousChef ?? 'the manager'} a question
                    </label>
                    <textarea
                      id="ask-question"
                      value={askText}
                      onChange={(e) => setAskText(e.target.value)}
                      rows={3}
                      placeholder="Type your question about this recipe…"
                      className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <Button size="sm" onClick={handleAskSubmit} disabled={!askText.trim()}>
                        <Send className="size-3.5" aria-hidden />
                        Send question
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setAskOpen(false)
                          setAskText('')
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setAskOpen(true)
                      setAskSent(false)
                    }}
                  >
                    <MessageSquarePlus className="size-3.5" aria-hidden />
                    Ask your own question
                  </Button>
                )}
              </div>
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
              <ReadinessBadge project={project} />
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
                onClick={() => {
                  setRequested(true)
                  requestMissingContext(project.id)
                }}
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
              <Button
                variant="outline"
                className="h-10 w-full gap-2"
                onClick={() => {
                  if (!newOwner) {
                    setNewOwner(assignableMembers[0]?.name ?? '')
                  }
                  setMeetingOpen(true)
                }}
              >
                <CalendarPlus className="size-4" aria-hidden />
                Schedule Meeting
              </Button>
              {requested && (
                <p className="pt-1 text-center text-xs text-muted-foreground">
                  {project.owner} has been notified to complete the missing fields.
                </p>
              )}
              {scheduledDate && !meetingOpen && (
                <p className="pt-1 text-center text-xs text-muted-foreground">
                  Meeting scheduled for {scheduledDate} at {scheduledTime}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {meetingOpen && (
        <ScheduleMeetingModal
          projectName={project.name}
          previousOwner={project.owner}
          team={assignableMembers}
          newOwner={newOwner}
          onOwnerChange={setNewOwner}
          scheduledDate={scheduledDate}
          onDateChange={setScheduledDate}
          scheduledTime={scheduledTime}
          onTimeChange={setScheduledTime}
          meetingNotes={meetingNotes}
          onNotesChange={setMeetingNotes}
          onCancel={() => setMeetingOpen(false)}
          onConfirm={() => {
            scheduleMeeting({
              projectId: project.id,
              previousOwner: project.owner,
              newOwner,
              scheduledDate,
              scheduledTime,
              notes: meetingNotes,
            })
            setMeetingOpen(false)
          }}
        />
      )}
    </AppShell>
  )
}
