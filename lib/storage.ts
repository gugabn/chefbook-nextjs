import type { Recipe, Book, PantryItem } from './types'

const isBrowser = typeof window !== 'undefined'

// Evento disparado quando o localStorage está cheio (~5 MB por site).
// A página ouve-o e mostra um aviso ao utilizador.
export const STORAGE_FULL_EVENT = 'chefbook:storage-full'

/**
 * Grava no localStorage sem rebentar a app.
 * Devolve false se não conseguiu (normalmente por falta de espaço).
 */
function safeSave(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    // setTimeout: avisamos "a seguir" para não mexer no estado do React
    // a meio de uma atualização.
    setTimeout(() => window.dispatchEvent(new Event(STORAGE_FULL_EVENT)), 0)
    return false
  }
}

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

export function saveRecipes(recipes: Recipe[]): boolean {
  if (!isBrowser) return false
  return safeSave('chefbook_recipes', recipes)
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

export function saveBooks(books: Book[]): boolean {
  if (!isBrowser) return false
  return safeSave('chefbook_books', books)
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

export function savePantry(pantry: PantryItem[]): boolean {
  if (!isBrowser) return false
  return safeSave('chefbook_pantry', pantry)
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
