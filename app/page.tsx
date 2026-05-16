'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useStore } from '@/hooks/useStore'
import type { Recipe, Book, PantryItem } from '@/lib/types'

import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import Toast from '@/components/ui/Toast'

import RecipesTab from '@/components/tabs/RecipesTab'
import LibraryTab from '@/components/tabs/LibraryTab'
import PantryTab from '@/components/tabs/PantryTab'

import AddRecipeModal from '@/components/modals/AddRecipeModal'
import RecipeDetailModal from '@/components/modals/RecipeDetailModal'
import AddBookModal from '@/components/modals/AddBookModal'
import BookDetailModal from '@/components/modals/BookDetailModal'
import AddPantryModal from '@/components/modals/AddPantryModal'
import ShoppingListModal from '@/components/modals/ShoppingListModal'
import SettingsModal from '@/components/modals/SettingsModal'

type Tab = 'receitas' | 'biblioteca' | 'despensa'

export default function Page() {
  const {
    hydrated,
    recipes, addRecipe, updateRecipe, deleteRecipe,
    books, addBook, deleteBook,
    pantry, addPantryItem, updatePantryItem, deletePantryItem,
    apiKey, setApiKey,
  } = useStore()

  const [activeTab, setActiveTab] = useState<Tab>('receitas')
  const [recipeFilter, setRecipeFilter] = useState('Todos')

  // Modal states
  const [addRecipeOpen, setAddRecipeOpen] = useState(false)
  const [editRecipe, setEditRecipe] = useState<Recipe | undefined>(undefined)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const [addBookOpen, setAddBookOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  const [addPantryOpen, setAddPantryOpen] = useState(false)
  const [editPantry, setEditPantry] = useState<PantryItem | undefined>(undefined)

  const [shoppingItems, setShoppingItems] = useState<string[]>([])
  const [shoppingRecipeName, setShoppingRecipeName] = useState('')
  const [shoppingOpen, setShoppingOpen] = useState(false)

  const [settingsOpen, setSettingsOpen] = useState(false)

  // Toast
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string) => {
    setToastMsg(message)
    setToastVisible(true)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false)
    }, 2500)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  const handleAdd = () => {
    if (activeTab === 'receitas') {
      setEditRecipe(undefined)
      setAddRecipeOpen(true)
    } else if (activeTab === 'biblioteca') {
      setAddBookOpen(true)
    } else {
      setEditPantry(undefined)
      setAddPantryOpen(true)
    }
  }

  const handleSaveRecipe = (recipe: Recipe) => {
    if (editRecipe) {
      updateRecipe(recipe)
      showToast('Receita atualizada!')
    } else {
      addRecipe(recipe)
      showToast('Receita adicionada!')
    }
  }

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(null)
    setEditRecipe(recipe)
    setAddRecipeOpen(true)
  }

  const handleDeleteRecipe = (id: string) => {
    deleteRecipe(id)
    setSelectedRecipe(null)
    showToast('Receita eliminada')
  }

  const handleShoppingList = (items: string[], recipeName: string) => {
    setShoppingItems(items)
    setShoppingRecipeName(recipeName)
    setShoppingOpen(true)
  }

  const handleSaveBook = (book: Book) => {
    addBook(book)
    showToast('Livro adicionado!')
  }

  const handleDeleteBook = (id: string) => {
    deleteBook(id)
    showToast('Livro eliminado')
  }

  const handleSavePantry = (item: PantryItem) => {
    if (editPantry) {
      updatePantryItem(item)
      showToast('Item atualizado!')
    } else {
      addPantryItem(item)
      showToast('Item adicionado!')
    }
  }

  const handleEditPantry = (item: PantryItem) => {
    setEditPantry(item)
    setAddPantryOpen(true)
  }

  const handleDeletePantry = (id: string) => {
    deletePantryItem(id)
    showToast('Item eliminado')
  }

  if (!hydrated) {
    return (
      <div
        className="app-shell"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
              <line x1="6" y1="17" x2="18" y2="17" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontSize: 22,
              color: 'var(--primary)',
              fontWeight: 700,
            }}
          >
            ChefBook
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell" style={{ minHeight: '100dvh', backgroundColor: 'var(--bg)' }}>
      <Header
        onAdd={handleAdd}
        onSettings={() => setSettingsOpen(true)}
        activeTab={activeTab}
      />

      <main
        style={{
          paddingBottom: 'calc(72px + env(safe-area-inset-bottom) + 8px)',
          minHeight: 'calc(100dvh - 60px)',
        }}
      >
        {activeTab === 'receitas' && (
          <RecipesTab
            recipes={recipes}
            activeFilter={recipeFilter}
            onFilterChange={setRecipeFilter}
            onSelectRecipe={setSelectedRecipe}
          />
        )}
        {activeTab === 'biblioteca' && (
          <LibraryTab
            books={books}
            onSelectBook={setSelectedBook}
          />
        )}
        {activeTab === 'despensa' && (
          <PantryTab
            pantry={pantry}
            onEditItem={handleEditPantry}
            onDeleteItem={handleDeletePantry}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />

      {/* Modals */}
      <AddRecipeModal
        isOpen={addRecipeOpen}
        onClose={() => setAddRecipeOpen(false)}
        onSave={handleSaveRecipe}
        initialData={editRecipe}
        apiKey={apiKey}
        showToast={showToast}
      />

      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onEdit={handleEditRecipe}
        onDelete={handleDeleteRecipe}
        onShoppingList={handleShoppingList}
      />

      <AddBookModal
        isOpen={addBookOpen}
        onClose={() => setAddBookOpen(false)}
        onSave={handleSaveBook}
      />

      <BookDetailModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        onDelete={handleDeleteBook}
      />

      <AddPantryModal
        isOpen={addPantryOpen}
        onClose={() => setAddPantryOpen(false)}
        onSave={handleSavePantry}
        initialData={editPantry}
      />

      <ShoppingListModal
        items={shoppingItems}
        recipeName={shoppingRecipeName}
        isOpen={shoppingOpen}
        onClose={() => setShoppingOpen(false)}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        onSave={setApiKey}
      />

      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  )
}
