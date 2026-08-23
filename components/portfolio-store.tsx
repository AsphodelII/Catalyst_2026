'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Readiness = 'ready' | 'needs-review' | 'incomplete'

export type PeerComment = {
  author: string
  text: string
}

export type RecipeField = {
  key: string
  label: string
  value: string | null
  complete: boolean
  /** severity when incomplete */
  severity?: 'warning' | 'danger'
  /** Sous Chef comment on this field */
  peerComment?: PeerComment | null
}

export type Project = {
  id: string
  name: string
  owner: string
  ownerEmail: string
  codebaseUrl: string
  sousChef: string | null
  status: string
  readiness: Readiness
  hypothesis: string
  elevatorPitch: string
  faqs: { q: string; a: string }[]
  fields: RecipeField[]
  handedOver?: boolean
}

export type TeamMember = {
  id: string
  name: string
  email: string
  role: string
  initials: string
  availability: 'active' | 'transferred' | 'available'
  active: string[]
  backups: string[]
}

export type ContextRequest = {
  id: string
  projectId: string
  createdAt: Date
}

function missingCount(p: Project) {
  return p.fields.filter((f) => !f.complete).length
}

const seedProjects: Project[] = [
  {
    id: 'momentum-alpha',
    name: 'Momentum Alpha',
    owner: 'Alex Chen',
    ownerEmail: 'alex.chen@example.com',
    codebaseUrl: 'https://github.com/portfolio-bakery/momentum-alpha',
    sousChef: 'Sarah Patel',
    status: 'Active',
    readiness: 'needs-review',
    hypothesis:
      'Cross-sectional price momentum persists over 1–3 month horizons in liquid ASX 200 names; a dual moving-average crossover captures the trend while filtering short-term noise.',
    elevatorPitch:
      'Momentum Alpha is a cross-sectional momentum strategy on liquid ASX 200 names that captures 1–3 month trends with a dual moving-average crossover while filtering short-term noise. It is built for portfolio managers who need a transparent, well-documented trend signal with clear ownership and handover context. The recipe records the dataset, parameters, assumptions and known limitations so a new owner can run it without reverse-engineering the researcher’s intent. A recorded walkthrough with the original owner is available, and the Sous Chef has flagged volatility-filtering and dividend adjustments as must-know caveats.',
    faqs: [
      {
        q: 'How does Momentum Alpha handle dividend adjustments?',
        a: 'The backtest should use total-return series for ASX 200 constituents — the Sous Chef flagged that the current dataset excludes dividends, which can create artificial momentum reversals around ex-dates. This is a must-know caveat before trusting the 1–3 month window.',
      },
      {
        q: 'Why is volatility filtering applied before the crossover signal?',
        a: 'Volatility filtering removes names in high-VIX regimes where the dual moving-average crossover whipsaws. The Sous Chef recommends applying the Volatility Filter module directly to this strategy before any paper trading, since the notes show excessive whipsaw when VIX > 25.',
      },
      {
        q: 'What rebalance frequency and universe does it use?',
        a: 'It ranks liquid ASX 200 names on cross-sectional momentum and rebalances weekly with a 20/100-day moving-average pair and a 10 bps transaction-cost assumption. A 50/200 window showed a better US Sharpe but transaction costs negated the alpha here.',
      },
      {
        q: 'Where can I find the algorithm walkthrough?',
        a: 'A recorded walkthrough with Alex Chen is available in the Meeting history section above. It covers signal construction, the volatility filter, and the ASX trading-halt limitation the Sous Chef caught in April.',
      },
    ],
    fields: [
      {
        key: 'code',
        label: 'Code version',
        value: 'commit a8c4f2',
        complete: true,
        peerComment: null,
      },
      {
        key: 'dataset',
        label: 'Dataset',
        value: 'ASX 200 daily prices — snapshot 12 Aug 2026',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'Confirmed I can access this snapshot. Worth noting the data excludes dividends — make sure the backtest accounts for this.',
        },
      },
      {
        key: 'parameters',
        label: 'Parameters',
        value: '20-day / 100-day moving average',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'We tested a 50/200 window on the US side and saw a better Sharpe. Worth a sensitivity run before locking this in.',
        },
      },
      {
        key: 'assumptions',
        label: 'Assumptions',
        value: 'Rebalance weekly, 10 bps transaction cost',
        complete: true,
        peerComment: null,
      },
      {
        key: 'notes',
        label: 'Research notes',
        value: 'Hypothesis and signal construction documented.\n\nAdditional findings from Jan-May 2026 testing:\n- The crossover signal is highly sensitive to the 100-day window during earnings seasons.\n- Tested using 50-day window, but transaction costs negated the alpha.\n- During periods of high VIX (>25), the strategy experiences excessive whipsawing. A volatility filter should be added before deploying to production.\n\nNext steps: Explore adding a volume confirmation filter.',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'The VIX issue is real — I saw the same in my volatility work. Suggest applying the Volatility Filter module directly to this strategy before any paper trading.',
        },
      },
      {
        key: 'limitations',
        label: 'Known limitations',
        value: 'Partial — underperforms in volatile sideways markets; edge cases undocumented.',
        complete: false,
        severity: 'warning',
        peerComment: {
          author: 'Sarah Patel',
          text: 'Also fails during ASX trading halts — I caught a 3% drawdown due to this in April. Needs to be added here.',
        },
      },
    ],
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion Strategy',
    owner: 'Alex Chen',
    ownerEmail: 'alex.chen@example.com',
    codebaseUrl: 'https://github.com/portfolio-bakery/mean-reversion',
    sousChef: 'Daniel Kim',
    status: 'Active',
    readiness: 'needs-review',
    hypothesis:
      'Short-horizon deviations from a rolling mean revert within days for high-liquidity pairs; entries are scaled by z-score bands.',
    elevatorPitch:
      'Mean Reversion Strategy trades short-horizon deviations from a rolling mean in high-liquidity pairs, scaling entries by z-score bands for a quick, high-turnover alpha. It is designed for desks that can meet tight latency constraints and want a compact, fully-documented signal with explicit market-impact assumptions. The recipe captures the intraday data quirks, parameter sensitivity and the strong regime-dependence a new owner must respect. Sous Chef notes recommend a safer ±1.5 band with a volume gate and order-book depth estimates to sharpen the backtest.',
    faqs: [
      {
        q: 'What z-score band should I use for entries?',
        a: 'The recipe defaults to ±2.0 on a 15-day window, but the Sous Chef recommends a safer ±1.5 band with a volume gate — ±2.0 is too aggressive in low-volume periods and produced a 3% drawdown in testing.',
      },
      {
        q: 'How regime-dependent is the strategy?',
        a: 'Strongly. It works in range-bound, high-liquidity pairs and fails completely during momentum-driven breakouts. The regime dependence is documented as a known limitation that new owners must respect.',
      },
      {
        q: 'What latency and market-impact assumptions apply?',
        a: 'It assumes tight latency to capture the reversion before HFTs and currently assumes zero market impact. The Sous Chef offers order-book depth estimates to replace that assumption, since it is strong at this position size.',
      },
      {
        q: 'Are there data quirks I should know about?',
        a: 'The intraday snapshot has a known feed gap between 12:00–12:05 AEST on 09 Aug that can skew the lunchtime signal. The recipe captures this quirk and the slippage-model next step.',
      },
    ],
    fields: [
      { key: 'code', label: 'Code version', value: 'commit 3f91be', complete: true, peerComment: null },
      {
        key: 'dataset',
        label: 'Dataset',
        value: 'ASX 200 intraday — snapshot 09 Aug 2026',
        complete: true,
        peerComment: {
          author: 'Daniel Kim',
          text: 'The intraday data has a known gap between 12:00–12:05 AEST due to a feed issue on 09 Aug. This could skew the lunchtime signal.',
        },
      },
      {
        key: 'parameters',
        label: 'Parameters',
        value: 'z-score ±2.0, 15-day window',
        complete: true,
        peerComment: {
          author: 'Daniel Kim',
          text: 'In my liquidity work, I found that ±2.0 is too aggressive in low-volume periods. Consider ±1.5 with a volume filter gate.',
        },
      },
      {
        key: 'assumptions',
        label: 'Assumptions',
        value: 'Transaction cost 5bps, zero market impact assumed.',
        complete: true,
        peerComment: {
          author: 'Daniel Kim',
          text: 'Zero market impact is a strong assumption at this position size. Happy to share my order book depth estimates if useful.',
        },
      },
      {
        key: 'notes',
        label: 'Research notes',
        value: 'Initial backtest (Jan 2025 - Dec 2025) shows robust alpha but high turnover.\n\nRequires strict latency constraints to capture the mean reversion before HFTs.\n\nNext steps: Implement slippage model based on historical order book depth to ensure backtest accuracy.',
        complete: true,
        peerComment: null,
      },
      { key: 'limitations', label: 'Known limitations', value: 'Regime dependence not documented. Highly susceptible to momentum-driven breakouts where mean reversion fails completely.', complete: true, peerComment: null },
    ],
  },
  {
    id: 'overnight-gap',
    name: 'Overnight Gap Reversal',
    owner: 'Alex Chen',
    ownerEmail: 'alex.chen@example.com',
    codebaseUrl: 'https://github.com/portfolio-bakery/overnight-gap',
    sousChef: null,
    status: 'Active',
    readiness: 'incomplete',
    hypothesis:
      'Large overnight gaps partially reverse in the first hour of trade; sizing is capped to manage tail risk.',
    elevatorPitch:
      'Overnight Gap Reversal profits from large overnight gaps that partially reverse in the first hour of trade, with sizing capped to control tail risk. It targets macro-event days such as payrolls and CPI where the edge is strongest, and ships with a documented macro filter to curb black-swan drawdowns. The recipe records the tick-data source, gap thresholds and the 3% cap that lifted Sharpe from 1.2 to 1.8. New owners should note the interest-rate-regime fragility called out in the known limitations.',
    faqs: [
      {
        q: 'Which days does the edge work best on?',
        a: 'The edge is strongest on macro-event days such as non-farm payrolls and CPI releases. A documented macro filter curbs the >15% drawdowns seen during black-swan events on other days.',
      },
      {
        q: 'Why is position sizing capped at 3%?',
        a: 'Capping gap sizes at 3% avoids unfillable limits and lifted Sharpe from 1.2 to 1.8. It is a hard limit in the recipe and should not be relaxed without re-validation.',
      },
      {
        q: 'What is the interest-rate-regime fragility?',
        a: 'The strategy struggles when the fed funds rate is above 4% and is not robust across different interest-rate regimes. This is called out in the known limitations and should be monitored before each macro print.',
      },
      {
        q: 'What data feeds the gap detection?',
        a: 'It uses S&P 500 futures tick data (2020–2025) with a gap > 1% threshold, first-30-minute entry and a 0.5% trailing stop. The recipe records these parameters and the assumptions around open liquidity.',
      },
    ],
    fields: [
      { key: 'code', label: 'Code version', value: 'commit 7d20aa', complete: true, peerComment: null },
      { key: 'dataset', label: 'Dataset', value: 'S&P 500 futures tick data (2020-2025)', complete: true, peerComment: null },
      { key: 'parameters', label: 'Parameters', value: 'Gap > 1%, first 30 mins, trailing stop 0.5%', complete: true, peerComment: null },
      { key: 'assumptions', label: 'Assumptions', value: 'Liquidity is sufficient at market open. Assumed instant fills on limit orders.', complete: true, peerComment: null },
      { key: 'notes', label: 'Research notes', value: 'Strategy heavily relies on non-farm payroll days and CPI releases.\n\nWarning: Drawdown exceeds 15% during black swan events. Needs a macro filter before going to production.\n\nTested capping gap sizes at 3% to avoid unfillable limits, which improved Sharpe from 1.2 to 1.8.', complete: true, peerComment: null },
      { key: 'limitations', label: 'Known limitations', value: 'Not robust across different interest rate regimes. Specifically struggles when fed funds rate > 4%.', complete: true, peerComment: null },
    ],
  },
  {
    id: 'volatility-filter',
    name: 'Volatility Filter',
    owner: 'Sarah Patel',
    ownerEmail: 'sarah.patel@example.com',
    codebaseUrl: 'https://github.com/portfolio-bakery/volatility-filter',
    sousChef: 'Daniel Kim',
    status: 'Active',
    readiness: 'ready',
    hypothesis:
      'A realized-volatility overlay scales strategy exposure down during turbulent regimes, improving risk-adjusted returns.',
    elevatorPitch:
      'Volatility Filter is a realized-volatility overlay that scales strategy exposure down in turbulent regimes to improve risk-adjusted returns. Approved as a universal module across equities desks, it is the most handover-ready recipe in the portfolio with a clean two-band design. The documentation covers the dataset, parameters and the VIX-proxy assumption, with a Sous Chef suggestion to add a local vol measure for ASX correlation. It serves as the reference example of a well-handled ownership transfer.',
    faqs: [
      {
        q: 'How does the overlay decide to scale down exposure?',
        a: 'It uses a 30-day realized-volatility two-band design: exposure scales down when realized vol crosses the upper band. The Sous Chef suggests adding a third "extreme" band for VIX > 40 scenarios.',
      },
      {
        q: 'What is the VIX-proxy assumption?',
        a: 'The module assumes the VIX index is a suitable proxy for broad turbulence, with daily rebalance and an 8 bps cost. The Sous Chef notes VIX reflects US fear and is not always correlated to ASX, suggesting a local vol measure as a secondary check.',
      },
      {
        q: 'Is this approved for all desks?',
        a: 'Yes — it is approved as a universal filter module across all equities desks and is the most handover-ready recipe in the portfolio, with full methodology and validation logged.',
      },
      {
        q: 'Where is the walkthrough recording?',
        a: 'As the reference handover example, its documentation is complete and a recorded walkthrough is available in the Meeting history section above.',
      },
    ],
    fields: [
      { key: 'code', label: 'Code version', value: 'commit c11e09', complete: true, peerComment: null },
      {
        key: 'dataset',
        label: 'Dataset',
        value: 'ASX 200 daily prices — snapshot 12 Aug 2026',
        complete: true,
        peerComment: null,
      },
      {
        key: 'parameters',
        label: 'Parameters',
        value: '30-day realized vol, 2 regime bands',
        complete: true,
        peerComment: {
          author: 'Daniel Kim',
          text: 'Reviewed. The 2-band structure is clean and easy to reason about. I would consider adding a third "extreme" band for VIX > 40 scenarios.',
        },
      },
      {
        key: 'assumptions',
        label: 'Assumptions',
        value: 'Daily rebalance, 8 bps cost. VIX index acts as a suitable proxy for broad market turbulence.',
        complete: true,
        peerComment: {
          author: 'Daniel Kim',
          text: 'VIX as a proxy is reasonable but worth documenting that it reflects US market fear — not always correlated to ASX. Suggest adding a local vol measure as a secondary check.',
        },
      },
      {
        key: 'notes',
        label: 'Research notes',
        value: 'Full methodology and validation logged.\n\nWe explored using an exponentially weighted moving average for volatility calculation which reacted 2 days faster than simple MA during the March 2026 sell-off.\n\nApproved for use as a universal filter module across all equities desks.',
        complete: true,
        peerComment: null,
      },
      {
        key: 'limitations',
        label: 'Known limitations',
        value: 'Lags on abrupt single-day shocks; documented with mitigations. Will not protect against overnight exogenous gaps.',
        complete: true,
        peerComment: null,
      },
    ],
  },
  {
    id: 'liquidity-signal',
    name: 'Liquidity Signal',
    owner: 'Daniel Kim',
    ownerEmail: 'daniel.kim@example.com',
    codebaseUrl: 'https://github.com/portfolio-bakery/liquidity-signal',
    sousChef: 'Sarah Patel',
    status: 'Active',
    readiness: 'incomplete',
    hypothesis:
      'Order-book depth changes lead short-term price moves in mid-cap names; early prototype signal.',
    elevatorPitch:
      'Liquidity Signal is an early-stage prototype that uses order-book depth changes to anticipate short-term moves in mid-cap names. It is intentionally incomplete — a research scratchpad for a new owner to extend — with code, data and initial findings captured but limitations still open. The recipe makes that exploratory state explicit so ownership transfer is honest about what is proven versus speculative. Sous Chef tips point to where the signal most needs hardening before any production use.',
    faqs: [
      {
        q: 'What is the current readiness of this signal?',
        a: 'It is an early-stage prototype and intentionally incomplete — a research scratchpad for a new owner to extend. Code, data and initial findings are captured but the limitations are still open.',
      },
      {
        q: 'What needs the most hardening before production?',
        a: 'The Sous Chef tips point to where the signal most needs hardening; the order-book depth estimate and mid-cap liquidity assumptions are the weakest links and should be validated first.',
      },
      {
        q: 'What data does it use?',
        a: 'It uses Level 2 order-book depth snapshots on mid-cap names. The dataset and initial findings are recorded in the recipe fields, with commit 5a7c30 as the current code version.',
      },
      {
        q: 'Should I take ownership as-is?',
        a: 'Ownership transfer is honest about what is proven versus speculative. Take it on only if you intend to extend the research rather than run it live — the exploratory state is documented explicitly.',
      },
    ],
    fields: [
      { key: 'code', label: 'Code version', value: 'commit 5a7c30', complete: true, peerComment: null },
      {
        key: 'dataset',
        label: 'Dataset',
        value: 'Level 2 Order Book snapshots (NASDAQ 2025-2026)',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'Make sure to clarify whether these are NBBO or exchange-specific snapshots. This matters a lot for reproducibility.',
        },
      },
      {
        key: 'parameters',
        label: 'Parameters',
        value: 'Depth imbalance threshold > 60%, 5-tick lookahead',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'The 5-tick lookahead might be too aggressive in practice. I would test a 3-tick version to see if it survives realistic execution latency.',
        },
      },
      {
        key: 'assumptions',
        label: 'Assumptions',
        value: 'Queue position can be estimated reliably. Cancellations happen randomly across the book.',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'The random cancellation assumption is a known oversimplification. High-frequency participants cancel strategically — this is worth flagging as a known model weakness.',
        },
      },
      {
        key: 'notes',
        label: 'Research notes',
        value: 'Prototype relies on historical data where we assumed top-of-queue priority. This is a known flaw in the current backtest.\n\nWe need to build a proper matching engine simulator before pushing this to paper trading. Early signs show strong predictive power in the 10-second window.',
        complete: true,
        peerComment: null,
      },
      {
        key: 'limitations',
        label: 'Known limitations',
        value: 'Highly sensitive to spoofing behavior. Needs a spoofing-detection pre-filter.',
        complete: true,
        peerComment: {
          author: 'Sarah Patel',
          text: 'Agreed. I can share the spoofing detection logic from a previous project — it only adds one preprocessing step and should integrate cleanly.',
        },
      },
    ],
  },
]

type Ctx = {
  projects: Project[]
  getProject: (id: string) => Project | undefined
  missingCount: (p: Project) => number
  takeOwnership: (id: string, newOwner: string) => void
  addPeerComment: (projectId: string, fieldKey: string, comment: PeerComment) => void
  contextRequests: ContextRequest[]
  requestMissingContext: (projectId: string) => void
  team: TeamMember[]
}

const PortfolioContext = createContext<Ctx | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(seedProjects)
  const [contextRequests, setContextRequests] = useState<ContextRequest[]>([])

  const takeOwnership = (id: string, newOwner: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, owner: newOwner, handedOver: true } : p,
      ),
    )
  }

  const addPeerComment = (projectId: string, fieldKey: string, comment: PeerComment) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
            ...p,
            fields: p.fields.map((f) =>
              f.key === fieldKey ? { ...f, peerComment: comment } : f,
            ),
          }
          : p,
      ),
    )
  }

  const requestMissingContext = (projectId: string) => {
    setContextRequests((current) =>
      current.some((request) => request.projectId === projectId)
        ? current
        : [...current, { id: `context-${Date.now()}`, projectId, createdAt: new Date() }],
    )
  }

  const team: TeamMember[] = useMemo(
    () => [
      {
        id: 'alex',
        name: 'Alex Chen',
        email: 'alex.chen@example.com',
        role: 'Quant Researcher',
        initials: 'AC',
        availability: 'transferred',
        active: projects.filter((p) => p.owner === 'Alex Chen').map((p) => p.name),
        backups: projects.filter((p) => p.sousChef === 'Alex Chen').map((p) => p.name),
      },
      {
        id: 'sarah',
        name: 'Sarah Patel',
        email: 'sarah.patel@example.com',
        role: 'Senior Quant Researcher',
        initials: 'SP',
        availability: 'available',
        active: projects.filter((p) => p.owner === 'Sarah Patel').map((p) => p.name),
        backups: projects.filter((p) => p.sousChef === 'Sarah Patel').map((p) => p.name),
      },
      {
        id: 'daniel',
        name: 'Daniel Kim',
        email: 'daniel.kim@example.com',
        role: 'Quant Researcher',
        initials: 'DK',
        availability: 'active',
        active: projects.filter((p) => p.owner === 'Daniel Kim').map((p) => p.name),
        backups: projects.filter((p) => p.sousChef === 'Daniel Kim').map((p) => p.name),
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
      addPeerComment,
      contextRequests,
      requestMissingContext,
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
