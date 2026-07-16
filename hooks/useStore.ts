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
      saveRecipes(next)
      return next
    })
  }, [])

  const updateRecipe = useCallback((recipe: Recipe) => {
    setRecipes(prev => {
      const next = prev.map(r => (r.id === recipe.id ? recipe : r))
      saveRecipes(next)
      return next
    })
  }, [])

  const deleteRecipe = useCallback((id: string) => {
    setRecipes(prev => {
      const next = prev.filter(r => r.id !== id)
      saveRecipes(next)
      return next
    })
  }, [])

  // ── Books ──────────────────────────────────────────────────────────────────

  const addBook = useCallback((book: Book) => {
    setBooks(prev => {
      const next = [book, ...prev]
      saveBooks(next)
      return next
    })
  }, [])

  const deleteBook = useCallback((id: string) => {
    setBooks(prev => {
      const next = prev.filter(b => b.id !== id)
      saveBooks(next)
      return next
    })
  }, [])

  // ── Pantry ─────────────────────────────────────────────────────────────────

  const addPantryItem = useCallback((item: PantryItem) => {
    setPantry(prev => {
      const next = [item, ...prev]
      savePantry(next)
      return next
    })
  }, [])

  const updatePantryItem = useCallback((item: PantryItem) => {
    setPantry(prev => {
      const next = prev.map(p => (p.id === item.id ? item : p))
      savePantry(next)
      return next
    })
  }, [])

  const deletePantryItem = useCallback((id: string) => {
    setPantry(prev => {
      const next = prev.filter(p => p.id !== id)
      savePantry(next)
      return next
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
