import type { Contribution, FinanceGoal } from './types'

const MS_PER_MONTH = 1000 * 60 * 60 * 24 * (365.25 / 12)

// ── Formatação ──────────────────────────────────────────────────────────────

const eur = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const eurCents = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** €45.780 — sem cêntimos, para valores grandes. */
export function formatEur(value: number): string {
  return eur.format(Math.round(value))
}

/** €1.234,56 — com cêntimos, para lançamentos individuais. */
export function formatEurCents(value: number): string {
  return eurCents.format(value)
}

export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('pt-PT', { month: 'short', year: 'numeric' }).format(date)
}

// ── Utilitários de data ─────────────────────────────────────────────────────

function parseDate(iso: string): Date {
  // Meio-dia local evita saltos de dia por fusos horários.
  return new Date(`${iso}T12:00:00`)
}

/** Chave de mês local, ex.: "2027-06". */
export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

// ── Núcleo ──────────────────────────────────────────────────────────────────

/** Saldo poupado: depósitos menos levantamentos. */
export function netSaved(contributions: Contribution[]): number {
  return contributions.reduce(
    (sum, c) => sum + (c.type === 'levantamento' ? -c.amount : c.amount),
    0,
  )
}

export interface FinanceSummary {
  saved: number
  target: number
  remaining: number
  /** 0..1, saturado a 1. */
  progress: number
  /** Meses inteiros até ao prazo (>= 0). */
  monthsLeft: number
  /** Quanto precisas de poupar por mês, daqui para a frente. */
  requiredMonthly: number
  /** Saldo poupado no mês corrente. */
  thisMonthSaved: number
  /** Média mensal poupada desde a 1ª contribuição. */
  avgMonthly: number
  /** Onde o plano linear diz que já devias estar. */
  expectedByNow: number
  /** saved - expectedByNow. Positivo = adiantado. */
  ahead: number
  /** Ao ritmo médio atual, quando chegas à meta (null se ritmo <= 0). */
  projectedFinish: Date | null
  /** Já atingiu (ou passou) a meta. */
  reached: boolean
}

export function summarize(
  contributions: Contribution[],
  goal: FinanceGoal,
  now: Date = new Date(),
): FinanceSummary {
  const saved = netSaved(contributions)
  const target = goal.targetAmount
  const remaining = Math.max(0, target - saved)
  const progress = target > 0 ? Math.min(1, Math.max(0, saved / target)) : 0
  const reached = saved >= target && target > 0

  const start = parseDate(goal.startDate)
  const end = parseDate(goal.targetDate)

  const monthsLeftRaw = (end.getTime() - now.getTime()) / MS_PER_MONTH
  const monthsLeft = Math.max(0, Math.ceil(monthsLeftRaw))
  const requiredMonthly = remaining === 0 ? 0 : monthsLeft > 0 ? remaining / monthsLeft : remaining

  // Poupança do mês corrente.
  const thisKey = monthKey(now)
  const thisMonthSaved = netSaved(
    contributions.filter(c => monthKey(parseDate(c.date)) === thisKey),
  )

  // Média mensal desde a primeira contribuição (mínimo 1 mês de janela).
  let avgMonthly = 0
  if (contributions.length > 0) {
    const firstDate = contributions
      .map(c => parseDate(c.date).getTime())
      .reduce((a, b) => Math.min(a, b), Infinity)
    const elapsedMonths = Math.max(1, (now.getTime() - firstDate) / MS_PER_MONTH)
    avgMonthly = saved / elapsedMonths
  }

  // Plano linear: onde deverias estar hoje.
  const totalSpan = end.getTime() - start.getTime()
  let expectedByNow: number
  if (now.getTime() <= start.getTime() || totalSpan <= 0) {
    expectedByNow = 0
  } else if (now.getTime() >= end.getTime()) {
    expectedByNow = target
  } else {
    expectedByNow = target * ((now.getTime() - start.getTime()) / totalSpan)
  }
  const ahead = saved - expectedByNow

  // Projeção ao ritmo médio atual.
  let projectedFinish: Date | null = null
  if (reached) {
    projectedFinish = now
  } else if (avgMonthly > 0) {
    const monthsNeeded = remaining / avgMonthly
    projectedFinish = new Date(now.getTime() + monthsNeeded * MS_PER_MONTH)
  }

  return {
    saved,
    target,
    remaining,
    progress,
    monthsLeft,
    requiredMonthly,
    thisMonthSaved,
    avgMonthly,
    expectedByNow,
    ahead,
    projectedFinish,
    reached,
  }
}

export interface Milestone {
  label: string
  amount: number     // limiar cumulativo
  reached: boolean
}

/**
 * Divide a meta em fatias iguais (ex.: 4 anuidades da Basque), marcando as
 * que o saldo atual já cobre.
 */
export function milestones(saved: number, goal: FinanceGoal, slices = 4): Milestone[] {
  const per = goal.targetAmount / slices
  return Array.from({ length: slices }, (_, i) => {
    const amount = per * (i + 1)
    return {
      label: `${i + 1}º ano`,
      amount,
      reached: saved >= amount - 0.01,
    }
  })
}
