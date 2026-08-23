'use client'

import { Archive, CircleAlert, Clock3, UserRoundX } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { ProjectAccess } from '@/components/project-access'
import { cn } from '@/lib/utils'

type ArchivedModel = {
	id: string
	name: string
	description: string
	reason: 'unowned' | 'retired'
	lastOwner: string | null
	contactName: string
	contactEmail: string
	codebaseUrl: string
	archivedAt: string
}

const archivedModels: ArchivedModel[] = [
	{
		id: 'sector-rotation-v1',
		name: 'Sector Rotation v1',
		description: 'Early prototype using monthly relative strength across market sectors.',
		reason: 'unowned',
		lastOwner: null,
		contactName: 'Maya Singh',
		contactEmail: 'maya.singh@example.com',
		codebaseUrl: 'https://github.com/portfolio-bakery/sector-rotation-v1',
		archivedAt: '18 Aug 2026',
	},
	{
		id: 'earnings-drift',
		name: 'Earnings Drift',
		description: 'Post-earnings announcement drift model with an incomplete data lineage.',
		reason: 'unowned',
		lastOwner: null,
		contactName: 'Maya Singh',
		contactEmail: 'maya.singh@example.com',
		codebaseUrl: 'https://github.com/portfolio-bakery/earnings-drift',
		archivedAt: '04 Aug 2026',
	},
	{
		id: 'macro-regime-classifier',
		name: 'Macro Regime Classifier',
		description: 'Regime labels based on rates, inflation, and credit-spread inputs.',
		reason: 'retired',
		lastOwner: 'Alex Chen',
		contactName: 'Alex Chen',
		contactEmail: 'alex.chen@example.com',
		codebaseUrl: 'https://github.com/portfolio-bakery/macro-regime-classifier',
		archivedAt: '22 Jul 2026',
	},
	{
		id: 'small-cap-reversal',
		name: 'Small Cap Reversal',
		description: 'A research branch retired after liquidity constraints invalidated the test results.',
		reason: 'retired',
		lastOwner: 'Daniel Kim',
		contactName: 'Daniel Kim',
		contactEmail: 'daniel.kim@example.com',
		codebaseUrl: 'https://github.com/portfolio-bakery/small-cap-reversal',
		archivedAt: '11 Jun 2026',
	},
]

const reasonCopy = {
	unowned: {
		label: 'No owner',
		icon: UserRoundX,
		className: 'border-warning/40 bg-warning-muted text-warning',
	},
	retired: {
		label: 'Retired',
		icon: CircleAlert,
		className: 'border-border bg-secondary text-secondary-foreground',
	},
} as const

function ArchivedModelCard({ model }: { model: ArchivedModel }) {
	const reason = reasonCopy[model.reason]
	const Icon = reason.icon

	return (
		<article className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<h3 className="font-serif text-lg font-semibold text-foreground">{model.name}</h3>
					<p className="mt-1 text-sm leading-6 text-muted-foreground">{model.description}</p>
				</div>
				<span
					className={cn(
						'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
						reason.className,
					)}
				>
					<Icon className="size-3.5" aria-hidden />
					{reason.label}
				</span>
			</div>

			<div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
				<span className="inline-flex items-center gap-1.5">
					<Clock3 className="size-3.5" aria-hidden />
					Archived {model.archivedAt}
				</span>
				<span>
					Last owner:{' '}
					<span className="font-medium text-foreground">{model.lastOwner ?? 'Unassigned'}</span>
				</span>
			</div>

			<ProjectAccess
				codebaseUrl={model.codebaseUrl}
				owner={model.contactName}
				ownerEmail={model.contactEmail}
			/>

		</article>
	)
}

export default function ArchivePage() {
	const unowned = archivedModels.filter((model) => model.reason === 'unowned')
	const retired = archivedModels.filter((model) => model.reason === 'retired')

	return (
		<AppShell>
			<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
						Storage
					</p>
					<h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
						Archive
					</h1>
					<p className="mt-2 max-w-2xl text-pretty text-sm text-muted-foreground">
						Models without a current owner, or models no longer useful to the portfolio. Keep the
						record, even when the work is no longer active.
					</p>
				</div>
				<div className="flex gap-6 rounded-xl border border-border bg-card px-5 py-3 shadow-sm">
					<div>
						<p className="font-serif text-2xl font-semibold text-foreground">{archivedModels.length}</p>
						<p className="text-xs text-muted-foreground">Archived models</p>
					</div>
					<div className="border-l border-border pl-6">
						<p className="font-serif text-2xl font-semibold text-warning">{unowned.length}</p>
						<p className="text-xs text-muted-foreground">Need an owner</p>
					</div>
				</div>
			</div>

			<section className="mt-10">
				<div className="mb-4 flex items-center gap-2">
					<UserRoundX className="size-4 text-warning" aria-hidden />
					<h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
						Limbo
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{unowned.map((model) => (
						<ArchivedModelCard key={model.id} model={model} />
					))}
				</div>
			</section>

			<section className="mt-10">
				<div className="mb-4 flex items-center gap-2">
					<Archive className="size-4 text-muted-foreground" aria-hidden />
					<h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
						Retired models
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{retired.map((model) => (
						<ArchivedModelCard key={model.id} model={model} />
					))}
				</div>
			</section>
		</AppShell>
	)
}
