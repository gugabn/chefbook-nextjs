'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Recipe, Book, PantryItem } from '@/lib/types'
import {
  getRecipes, saveRecipes,
  getBooks, saveBooks,
  getPantry, savePantry,
  getApiKey, saveApiKey,
} from '@/lib/storage'

export function useStore() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [pantry, setPantry] = useState<PantryItem[]>([])
  const [apiKey, setApiKeyState] = useState<string>('')
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setRecipes(getRecipes())
    setBooks(getBooks())
    setPantry(getPantry())
    setApiKeyState(getApiKey())
    setHydrated(true)
  }, [])

  // ── Recipes ────────────────────────────────────────────────────────────────

  const addRecipe = useCallback((recipe: Recipe) => {
    setRecipes(prev => {
      const next = [recipe, ...prev]
      // Se não coube no armazenamento, fica tudo como estava
      return saveRecipes(next) ? next : prev
    })
  }, [])

  const updateRecipe = useCallback((recipe: Recipe) => {
    setRecipes(prev => {
      const next = prev.map(r => (r.id === recipe.id ? recipe : r))
      // Se não coube no armazenamento, fica tudo como estava
      return saveRecipes(next) ? next : prev
    })
  }, [])

  const deleteRecipe = useCallback((id: string) => {
    setRecipes(prev => {
      const next = prev.filter(r => r.id !== id)
      // Se não coube no armazenamento, fica tudo como estava
      return saveRecipes(next) ? next : prev
    })
  }, [])

  // ── Books ──────────────────────────────────────────────────────────────────

  const addBook = useCallback((book: Book) => {
    setBooks(prev => {
      const next = [book, ...prev]
      // Se não coube no armazenamento, fica tudo como estava
      return saveBooks(next) ? next : prev
    })
  }, [])

  const deleteBook = useCallback((id: string) => {
    setBooks(prev => {
      const next = prev.filter(b => b.id !== id)
      // Se não coube no armazenamento, fica tudo como estava
      return saveBooks(next) ? next : prev
    })
  }, [])

  // ── Pantry ─────────────────────────────────────────────────────────────────

  const addPantryItem = useCallback((item: PantryItem) => {
    setPantry(prev => {
      const next = [item, ...prev]
      // Se não coube no armazenamento, fica tudo como estava
      return savePantry(next) ? next : prev
    })
  }, [])

  const updatePantryItem = useCallback((item: PantryItem) => {
    setPantry(prev => {
      const next = prev.map(p => (p.id === item.id ? item : p))
      // Se não coube no armazenamento, fica tudo como estava
      return savePantry(next) ? next : prev
    })
  }, [])

  const deletePantryItem = useCallback((id: string) => {
    setPantry(prev => {
      const next = prev.filter(p => p.id !== id)
      // Se não coube no armazenamento, fica tudo como estava
      return savePantry(next) ? next : prev
    })
  }, [])

  // ── API Key ────────────────────────────────────────────────────────────────

  const setApiKey = useCallback((key: string) => {
    saveApiKey(key)
    setApiKeyState(key)
  }, [])

  return {
    hydrated,
    recipes,
    books,
    pantry,
    apiKey,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    addBook,
    deleteBook,
    addPantryItem,
    updatePantryItem,
    deletePantryItem,
    setApiKey,
  }
}
