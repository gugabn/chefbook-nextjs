import type { Recipe, Book, PantryItem } from './types'

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

// ── API Key ───────────────────────────────────────────────────────────────────

export function getApiKey(): string {
  if (!isBrowser) return ''
  return localStorage.getItem('chefbook_api_key') ?? ''
}

export function saveApiKey(key: string): void {
  if (!isBrowser) return
  localStorage.setItem('chefbook_api_key', key)
}
