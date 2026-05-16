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
