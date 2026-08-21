'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Readiness = 'ready' | 'needs-review' | 'incomplete'

export type RecipeField = {
  key: string
  label: string
  value: string | null
  complete: boolean
  /** severity when incomplete */
  severity?: 'warning' | 'danger'
}

export type Project = {
  id: string
  name: string
  owner: string
  backupOwner: string | null
  status: string // e.g. Active
  readiness: Readiness
  hypothesis: string
  fields: RecipeField[]
  handedOver?: boolean
}

export type TeamMember = {
  id: string
  name: string
  role: string
  initials: string
  availability: 'active' | 'transferred' | 'available'
  active: string[]
  backups: string[]
}

function missingCount(p: Project) {
  return p.fields.filter((f) => !f.complete).length
}

const seedProjects: Project[] = [
  {
    id: 'momentum-alpha',
    name: 'Momentum Alpha',
    owner: 'Alex Chen',
    backupOwner: null,
    status: 'Active',
    readiness: 'needs-review',
    hypothesis:
      'Cross-sectional price momentum persists over 1–3 month horizons in liquid ASX 200 names; a dual moving-average crossover captures the trend while filtering short-term noise.',
    fields: [
      { key: 'code', label: 'Code version', value: 'commit a8c4f2', complete: true },
      {
        key: 'dataset',
        label: 'Dataset',
        value: 'ASX 200 daily prices — snapshot 12 Aug 2026',
        complete: true,
      },
      {
        key: 'parameters',
        label: 'Parameters',
        value: '20-day / 100-day moving average',
        complete: true,
      },
      {
        key: 'assumptions',
        label: 'Assumptions',
        value: 'Rebalance weekly, 10 bps transaction cost',
        complete: true,
      },
      {
        key: 'notes',
        label: 'Research notes',
        value: 'Hypothesis and signal construction documented.',
        complete: true,
      },
      {
        key: 'backup',
        label: 'Backup owner',
        value: null,
        complete: false,
        severity: 'danger',
      },
      {
        key: 'limitations',
        label: 'Known limitations',
        value: 'Partial — underperforms in volatile sideways markets; edge cases undocumented.',
        complete: false,
        severity: 'warning',
      },
    ],
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion Strategy',
    owner: 'Alex Chen',
    backupOwner: null,
    status: 'Active',
    readiness: 'needs-review',
    hypothesis:
      'Short-horizon deviations from a rolling mean revert within days for high-liquidity pairs; entries are scaled by z-score bands.',
    fields: [
      { key: 'code', label: 'Code version', value: 'commit 3f91be', complete: true },
      {
        key: 'dataset',
        label: 'Dataset',
        value: 'ASX 200 intraday — snapshot 09 Aug 2026',
        complete: true,
      },
      { key: 'parameters', label: 'Parameters', value: 'z-score ±2.0, 15-day window', complete: true },
      { key: 'assumptions', label: 'Assumptions', value: null, complete: false, severity: 'warning' },
      { key: 'notes', label: 'Research notes', value: null, complete: false, severity: 'warning' },
      { key: 'backup', label: 'Backup owner', value: null, complete: false, severity: 'danger' },
      {
        key: 'limitations',
        label: 'Known limitations',
        value: 'Regime dependence not documented.',
        complete: true,
      },
    ],
  },
  {
    id: 'overnight-gap',
    name: 'Overnight Gap Reversal',
    owner: 'Alex Chen',
    backupOwner: null,
    status: 'Active',
    readiness: 'incomplete',
    hypothesis:
      'Large overnight gaps partially reverse in the first hour of trade; sizing is capped to manage tail risk.',
    fields: [
      { key: 'code', label: 'Code version', value: 'commit 7d20aa', complete: true },
      { key: 'dataset', label: 'Dataset', value: null, complete: false, severity: 'danger' },
      { key: 'parameters', label: 'Parameters', value: null, complete: false, severity: 'danger' },
      { key: 'assumptions', label: 'Assumptions', value: null, complete: false, severity: 'warning' },
      { key: 'notes', label: 'Research notes', value: null, complete: false, severity: 'warning' },
      { key: 'backup', label: 'Backup owner', value: null, complete: false, severity: 'danger' },
      { key: 'limitations', label: 'Known limitations', value: null, complete: false, severity: 'warning' },
    ],
  },
  {
    id: 'volatility-filter',
    name: 'Volatility Filter',
    owner: 'Sarah Patel',
    backupOwner: 'Daniel Kim',
    status: 'Active',
    readiness: 'ready',
    hypothesis:
      'A realized-volatility overlay scales strategy exposure down during turbulent regimes, improving risk-adjusted returns.',
    fields: [
      { key: 'code', label: 'Code version', value: 'commit c11e09', complete: true },
      {
        key: 'dataset',
        label: 'Dataset',
        value: 'ASX 200 daily prices — snapshot 12 Aug 2026',
        complete: true,
      },
      { key: 'parameters', label: 'Parameters', value: '30-day realized vol, 2 regime bands', complete: true },
      { key: 'assumptions', label: 'Assumptions', value: 'Daily rebalance, 8 bps cost', complete: true },
      { key: 'notes', label: 'Research notes', value: 'Full methodology and validation logged.', complete: true },
      { key: 'backup', label: 'Backup owner', value: 'Daniel Kim', complete: true },
      {
        key: 'limitations',
        label: 'Known limitations',
        value: 'Lags on abrupt single-day shocks; documented with mitigations.',
        complete: true,
      },
    ],
  },
  {
    id: 'liquidity-signal',
    name: 'Liquidity Signal',
    owner: 'Daniel Kim',
    backupOwner: null,
    status: 'Active',
    readiness: 'incomplete',
    hypothesis:
      'Order-book depth changes lead short-term price moves in mid-cap names; early prototype signal.',
    fields: [
      { key: 'code', label: 'Code version', value: 'commit 5a7c30', complete: true },
      { key: 'dataset', label: 'Dataset', value: null, complete: false, severity: 'danger' },
      { key: 'parameters', label: 'Parameters', value: null, complete: false, severity: 'danger' },
      { key: 'assumptions', label: 'Assumptions', value: null, complete: false, severity: 'warning' },
      { key: 'notes', label: 'Research notes', value: null, complete: false, severity: 'warning' },
      { key: 'backup', label: 'Backup owner', value: null, complete: false, severity: 'danger' },
      { key: 'limitations', label: 'Known limitations', value: 'Not started.', complete: false, severity: 'warning' },
    ],
  },
]

type Ctx = {
  projects: Project[]
  getProject: (id: string) => Project | undefined
  missingCount: (p: Project) => number
  takeOwnership: (id: string, newOwner: string) => void
  assignBackup: (id: string, backup: string) => void
  team: TeamMember[]
}

const PortfolioContext = createContext<Ctx | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(seedProjects)

  const takeOwnership = (id: string, newOwner: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, owner: newOwner, handedOver: true } : p,
      ),
    )
  }

  const assignBackup = (id: string, backup: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              backupOwner: backup,
              fields: p.fields.map((f) =>
                f.key === 'backup' ? { ...f, value: backup, complete: true } : f,
              ),
            }
          : p,
      ),
    )
  }

  const team: TeamMember[] = useMemo(
    () => [
      {
        id: 'alex',
        name: 'Alex Chen',
        role: 'Quant Researcher',
        initials: 'AC',
        availability: 'transferred',
        active: projects.filter((p) => p.owner === 'Alex Chen').map((p) => p.name),
        backups: [],
      },
      {
        id: 'sarah',
        name: 'Sarah Patel',
        role: 'Senior Quant Researcher',
        initials: 'SP',
        availability: 'available',
        active: projects.filter((p) => p.owner === 'Sarah Patel').map((p) => p.name),
        backups: projects.filter((p) => p.backupOwner === 'Sarah Patel').map((p) => p.name),
      },
      {
        id: 'daniel',
        name: 'Daniel Kim',
        role: 'Quant Researcher',
        initials: 'DK',
        availability: 'active',
        active: projects.filter((p) => p.owner === 'Daniel Kim').map((p) => p.name),
        backups: projects.filter((p) => p.backupOwner === 'Daniel Kim').map((p) => p.name),
      },
    ],
    [projects],
  )

  const value = useMemo<Ctx>(
    () => ({
      projects,
      getProject: (id) => projects.find((p) => p.id === id),
      missingCount,
      takeOwnership,
      assignBackup,
      team,
    }),
    [projects, team],
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}
