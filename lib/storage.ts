import type { Recipe, Book, PantryItem, Contribution, FinanceGoal, Milestone } from './types'
import { DEFAULT_GOAL, DEFAULT_MILESTONES } from './types'

const isBrowser = typeof window !== 'undefined'

// ── Recipes ──────────────────────────────────────────────────────────────────

export function getRecipes(): Recipe[] {
  if (!isBrowser) return []
  try {
    const raw = localStorage.getItem('chefbook_recipes')
    return raw ? (JSON.parse(raw) as Recipe[]) : []
  } catch {
    return []
  }
}

export function saveRecipes(recipes: Recipe[]): void {
  if (!isBrowser) return
  localStorage.setItem('chefbook_recipes', JSON.stringify(recipes))
}

// ── Books ─────────────────────────────────────────────────────────────────────

export function getBooks(): Book[] {
  if (!isBrowser) return []
  try {
    const raw = localStorage.getItem('chefbook_books')
    return raw ? (JSON.parse(raw) as Book[]) : []
  } catch {
    return []
  }
}

export function saveBooks(books: Book[]): void {
  if (!isBrowser) return
  localStorage.setItem('chefbook_books', JSON.stringify(books))
}

// ── Pantry ────────────────────────────────────────────────────────────────────

export function getPantry(): PantryItem[] {
  if (!isBrowser) return []
  try {
    const raw = localStorage.getItem('chefbook_pantry')
    return raw ? (JSON.parse(raw) as PantryItem[]) : []
  } catch {
    return []
  }
}

export function savePantry(pantry: PantryItem[]): void {
  if (!isBrowser) return
  localStorage.setItem('chefbook_pantry', JSON.stringify(pantry))
}

// ── Finanças: contribuições ─────────────────────────────────────────────────

export function getContributions(): Contribution[] {
  if (!isBrowser) return []
  try {
    const raw = localStorage.getItem('chefbook_contributions')
    return raw ? (JSON.parse(raw) as Contribution[]) : []
  } catch {
    return []
  }
}

export function saveContributions(contributions: Contribution[]): void {
  if (!isBrowser) return
  localStorage.setItem('chefbook_contributions', JSON.stringify(contributions))
}

// ── Finanças: meta ──────────────────────────────────────────────────────────

export function getFinanceGoal(): FinanceGoal {
  if (!isBrowser) return DEFAULT_GOAL
  try {
    const raw = localStorage.getItem('chefbook_finance_goal')
    // Fundir com os defaults para tolerar chaves em falta em versões futuras.
    return raw ? { ...DEFAULT_GOAL, ...(JSON.parse(raw) as Partial<FinanceGoal>) } : DEFAULT_GOAL
  } catch {
    return DEFAULT_GOAL
  }
}

export function saveFinanceGoal(goal: FinanceGoal): void {
  if (!isBrowser) return
  localStorage.setItem('chefbook_finance_goal', JSON.stringify(goal))
}

// ── Finanças: marcos / certificações ────────────────────────────────────────

export function getMilestones(): Milestone[] {
  if (!isBrowser) return DEFAULT_MILESTONES
  try {
    const raw = localStorage.getItem('chefbook_milestones')
    // Chave ausente = primeira utilização → semear os marcos do plano.
    // Um array vazio guardado (o utilizador apagou tudo) é respeitado.
    return raw === null ? DEFAULT_MILESTONES : (JSON.parse(raw) as Milestone[])
  } catch {
    return DEFAULT_MILESTONES
  }
}

export function saveMilestones(milestones: Milestone[]): void {
  if (!isBrowser) return
  localStorage.setItem('chefbook_milestones', JSON.stringify(milestones))
}

// ── API Key ───────────────────────────────────────────────────────────────────

export function getApiKey(): string {
  if (!isBrowser) return ''
  return localStorage.getItem('chefbook_api_key') ?? ''
}

export function saveApiKey(key: string): void {
  if (!isBrowser) return
  localStorage.setItem('chefbook_api_key', key)
}
