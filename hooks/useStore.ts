'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Recipe, Book, PantryItem, Contribution, FinanceGoal, Milestone } from '@/lib/types'
import { DEFAULT_GOAL } from '@/lib/types'
import {
  getRecipes, saveRecipes,
  getBooks, saveBooks,
  getPantry, savePantry,
  getContributions, saveContributions,
  getFinanceGoal, saveFinanceGoal,
  getMilestones, saveMilestones,
  getApiKey, saveApiKey,
} from '@/lib/storage'

export function useStore() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [pantry, setPantry] = useState<PantryItem[]>([])
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [financeGoal, setFinanceGoalState] = useState<FinanceGoal>(DEFAULT_GOAL)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [apiKey, setApiKeyState] = useState<string>('')
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setRecipes(getRecipes())
    setBooks(getBooks())
    setPantry(getPantry())
    setContributions(getContributions())
    setFinanceGoalState(getFinanceGoal())
    setMilestones(getMilestones())
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

  // ── Contribuições ────────────────────────────────────────────────────────────

  const addContribution = useCallback((contribution: Contribution) => {
    setContributions(prev => {
      const next = [contribution, ...prev]
      saveContributions(next)
      return next
    })
  }, [])

  const deleteContribution = useCallback((id: string) => {
    setContributions(prev => {
      const next = prev.filter(c => c.id !== id)
      saveContributions(next)
      return next
    })
  }, [])

  // ── Meta financeira ──────────────────────────────────────────────────────────

  const setFinanceGoal = useCallback((goal: FinanceGoal) => {
    saveFinanceGoal(goal)
    setFinanceGoalState(goal)
  }, [])

  // ── Marcos / certificações ───────────────────────────────────────────────────

  const addMilestone = useCallback((milestone: Milestone) => {
    setMilestones(prev => {
      const next = [...prev, milestone]
      saveMilestones(next)
      return next
    })
  }, [])

  const updateMilestone = useCallback((milestone: Milestone) => {
    setMilestones(prev => {
      const next = prev.map(m => (m.id === milestone.id ? milestone : m))
      saveMilestones(next)
      return next
    })
  }, [])

  const toggleMilestone = useCallback((id: string) => {
    setMilestones(prev => {
      const next = prev.map(m => (m.id === id ? { ...m, done: !m.done } : m))
      saveMilestones(next)
      return next
    })
  }, [])

  const deleteMilestone = useCallback((id: string) => {
    setMilestones(prev => {
      const next = prev.filter(m => m.id !== id)
      saveMilestones(next)
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
    contributions,
    financeGoal,
    milestones,
    apiKey,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    addBook,
    deleteBook,
    addPantryItem,
    updatePantryItem,
    deletePantryItem,
    addContribution,
    deleteContribution,
    setFinanceGoal,
    addMilestone,
    updateMilestone,
    toggleMilestone,
    deleteMilestone,
    setApiKey,
  }
}
