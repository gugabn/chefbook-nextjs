'use client'

import { useState, useEffect } from 'react'
import type { Recipe } from '@/lib/types'

interface RecipeDetailModalProps {
  recipe: Recipe | null
  isOpen: boolean
  onClose: () => void
  onEdit: (r: Recipe) => void
  onDelete: (id: string) => void
  onShoppingList: (items: string[], recipeName: string) => void
}

export default function RecipeDetailModal({
  recipe,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onShoppingList,
}: RecipeDetailModalProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (isOpen) setChecked({})
  }, [isOpen, recipe])

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen || !recipe) return null

  const toggleCheck = (i: number) =>
    setChecked(prev => ({ ...prev, [i]: !prev[i] }))

  const handleShoppingList = () => {
    const unchecked = recipe.ingredients
      .filter((_, i) => !checked[i])
      .map(ing => `${ing.qty} ${ing.unit} ${ing.name}`.trim())
    onShoppingList(unchecked, recipe.name)
  }

  const handleDelete = () => {
    if (confirm('Eliminar esta receita?')) {
      onDelete(recipe.id)
      onClose()
    }
  }

  return (
    <div
      className="animate-fadeIn"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        backgroundColor: 'var(--bg)',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Hero photo */}
      <div
        style={{
          width: '100%',
          paddingTop: '60%',
          position: 'relative',
          backgroundColor: 'var(--surface2)',
        }}
      >
        {recipe.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:image/jpeg;base64,${recipe.photo}`}
            alt={recipe.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--surface2)',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            </svg>
          </div>
        )}

        {/* Back button */}
        <button
          onClick={onClose}
          aria-label="Voltar"
          style={{
            position: 'absolute',
            top: 'max(16px, calc(16px + env(safe-area-inset-top)))',
            left: 16,
            width: 40,
            height: 40,
            borderRadius: 12,
            border: 'none',
            backgroundColor: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Category badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 16,
            backgroundColor: 'var(--primary)',
            color: '#fff',
            fontSize: 12,
            padding: '4px 12px',
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          {recipe.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 16px', paddingBottom: 'max(80px, calc(80px + env(safe-area-inset-bottom)))' }}>
        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--text)',
            margin: '0 0 12px',
            lineHeight: 1.2,
          }}
        >
          {recipe.name}
        </h1>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          {recipe.time && (
            <MetaChip icon="clock">
              {recipe.time}
            </MetaChip>
          )}
          {recipe.servings && (
            <MetaChip icon="users">
              {recipe.servings}
            </MetaChip>
          )}
          <MetaChip icon="list">
            {recipe.ingredients.length} ingredientes
          </MetaChip>
        </div>

        {/* Ingredients */}
        <Section title="Ingredientes">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recipe.ingredients.map((ing, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: 'none',
                  backgroundColor: checked[i] ? 'var(--surface2)' : 'var(--surface)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background-color 0.15s',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: `2px solid ${checked[i] ? 'var(--sage)' : 'var(--border)'}`,
                    backgroundColor: checked[i] ? 'var(--sage)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                  }}
                >
                  {checked[i] && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 14,
                    color: checked[i] ? 'var(--muted)' : 'var(--text)',
                    textDecoration: checked[i] ? 'line-through' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  <strong>{ing.qty} {ing.unit}</strong> {ing.name}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleShoppingList}
            style={{
              marginTop: 12,
              width: '100%',
              padding: '12px',
              borderRadius: 10,
              border: '2px solid var(--sage)',
              backgroundColor: 'transparent',
              color: 'var(--sage)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Gerar lista de compras
          </button>
        </Section>

        {/* Steps */}
        {recipe.steps.length > 0 && (
          <Section title="Modo de preparação">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recipe.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {i + 1}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button
            onClick={() => onEdit(recipe)}
            style={{
              flex: 1,
              padding: '13px',
              borderRadius: 12,
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: '13px 20px',
              borderRadius: 12,
              border: '1px solid #FEE2D5',
              backgroundColor: '#FEE2D5',
              color: '#C4622D',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2
        style={{
          fontFamily: 'var(--font-playfair), serif',
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: 12,
          margin: '0 0 12px',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

function MetaChip({ icon, children }: { icon: 'clock' | 'users' | 'list'; children: React.ReactNode }) {
  const icons = {
    clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    users: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    list: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        color: 'var(--muted)',
        backgroundColor: 'var(--surface2)',
        padding: '6px 12px',
        borderRadius: 8,
      }}
    >
      {icons[icon]}
      {children}
    </div>
  )
}
