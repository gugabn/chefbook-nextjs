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

export interface RecipeSuggestion {
  name: string
  description: string
  usedIngredients: string[]
  missingIngredients: string[]
  time: string
  difficulty: 'Fácil' | 'Médio' | 'Difícil'
  category: string
}
