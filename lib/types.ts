export interface Ingredient {
  qty: string
  unit: string
  name: string
}

export interface Recipe {
  id: string
  name: string
  category: string
  time?: string
  servings?: string
  photo?: string
  ingredients: Ingredient[]
  steps: string[]
  createdAt: number
}

export interface Book {
  id: string
  title: string
  author?: string
  photo?: string
  tags: string[]
  notes?: string
  createdAt: number
}

export interface PantryItem {
  id: string
  name: string
  qty: number
  unit: string
  category: string
}

// ── Finanças ────────────────────────────────────────────────────────────────
// Rumo à Basque Culinary: poupar a anuidade nos anos de cruzeiros.

export type ContributionType = 'deposito' | 'levantamento'

export interface Contribution {
  id: string
  amount: number        // sempre positivo; o sinal vem do `type`
  type: ContributionType
  date: string          // ISO yyyy-mm-dd
  note?: string
  createdAt: number
}

export interface FinanceGoal {
  targetAmount: number  // total a poupar (ex.: 4 anuidades)
  startDate: string     // yyyy-mm-dd — quando começas a poupar
  targetDate: string    // yyyy-mm-dd — prazo final
  plannedMonthly: number // quanto planeias poupar por mês
  currency: string      // símbolo (ex.: '€')
}

// Valores por defeito calculados a partir do plano 2026-2030:
// 4 anos de Basque Culinary × €11.445/ano = €45.780.
export const DEFAULT_GOAL: FinanceGoal = {
  targetAmount: 45780,
  startDate: '2027-06-01',
  targetDate: '2030-09-01',
  plannedMonthly: 1300,
  currency: '€',
}
