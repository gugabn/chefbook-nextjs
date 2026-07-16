import type { Contribution, FinanceGoal, Milestone } from './types'
import { DEFAULT_GOAL, DEFAULT_MILESTONES } from './types'

const isBrowser = typeof window !== 'undefined'

// ── Contribuições ─────────────────────────────────────────────────────────────

export function getContributions(): Contribution[] {
  if (!isBrowser) return []
  try {
    const raw = localStorage.getItem('rumobasque_contributions')
    return raw ? (JSON.parse(raw) as Contribution[]) : []
  } catch {
    return []
  }
}

export function saveContributions(contributions: Contribution[]): void {
  if (!isBrowser) return
  localStorage.setItem('rumobasque_contributions', JSON.stringify(contributions))
}

// ── Meta ──────────────────────────────────────────────────────────────────────

export function getFinanceGoal(): FinanceGoal {
  if (!isBrowser) return DEFAULT_GOAL
  try {
    const raw = localStorage.getItem('rumobasque_goal')
    // Fundir com os defaults para tolerar chaves em falta em versões futuras.
    return raw ? { ...DEFAULT_GOAL, ...(JSON.parse(raw) as Partial<FinanceGoal>) } : DEFAULT_GOAL
  } catch {
    return DEFAULT_GOAL
  }
}

export function saveFinanceGoal(goal: FinanceGoal): void {
  if (!isBrowser) return
  localStorage.setItem('rumobasque_goal', JSON.stringify(goal))
}

// ── Marcos / certificações ────────────────────────────────────────────────────

export function getMilestones(): Milestone[] {
  if (!isBrowser) return DEFAULT_MILESTONES
  try {
    const raw = localStorage.getItem('rumobasque_milestones')
    // Chave ausente = primeira utilização → semear os marcos do plano.
    // Um array vazio guardado (o utilizador apagou tudo) é respeitado.
    return raw === null ? DEFAULT_MILESTONES : (JSON.parse(raw) as Milestone[])
  } catch {
    return DEFAULT_MILESTONES
  }
}

export function saveMilestones(milestones: Milestone[]): void {
  if (!isBrowser) return
  localStorage.setItem('rumobasque_milestones', JSON.stringify(milestones))
}
