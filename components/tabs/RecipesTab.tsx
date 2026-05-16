'use client'

import type { Recipe } from '@/lib/types'

const FILTERS = ['Todos', 'Pequeno-Almoço', 'Almoço', 'Jantar', 'Sobremesa', 'Snack', 'Outro']

interface RecipesTabProps {
  recipes: Recipe[]
  activeFilter: string
  onFilterChange: (f: string) => void
  onSelectRecipe: (r: Recipe) => void
}

export default function RecipesTab({
  recipes,
  activeFilter,
  onFilterChange,
  onSelectRecipe,
}: RecipesTabProps) {
  const filtered =
    activeFilter === 'Todos'
      ? recipes
      : recipes.filter(r => r.category === activeFilter)

  return (
    <div>
      {/* Filter chips */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          padding: '12px 16px',
          scrollbarWidth: 'none',
        }}
        className="scrollbar-hide"
      >
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            style={{
              flexShrink: 0,
              padding: '8px 14px',
              borderRadius: 20,
              border: '1px solid',
              borderColor: activeFilter === f ? 'var(--primary)' : 'var(--border)',
              backgroundColor: activeFilter === f ? 'var(--primary)' : 'var(--surface)',
              color: activeFilter === f ? '#fff' : 'var(--text)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            padding: '0 16px 16px',
          }}
        >
          {filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onClick={() => onSelectRecipe(recipe)} />
          ))}
        </div>
      )}
    </div>
  )
}

function RecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        textAlign: 'left',
        padding: 0,
        transition: 'transform 0.15s, box-shadow 0.15s',
        minHeight: 44,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.transform = ''
        el.style.boxShadow = ''
      }}
    >
      {/* Photo */}
      <div
        style={{
          width: '100%',
          paddingTop: '66%',
          position: 'relative',
          backgroundColor: 'var(--surface2)',
        }}
      >
        {recipe.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:image/jpeg;base64,${recipe.photo}`}
            alt={recipe.name}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.5">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
        )}

        {/* Category badge */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: 6,
            backgroundColor: 'rgba(0,0,0,0.55)',
            color: '#fff',
            fontSize: 10,
            padding: '2px 7px',
            borderRadius: 6,
            fontWeight: 500,
          }}
        >
          {recipe.category}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 10px 12px' }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text)',
            lineHeight: 1.3,
            marginBottom: 6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {recipe.name}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {recipe.time && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--muted)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {recipe.time}
            </span>
          )}
          {recipe.servings && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--muted)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {recipe.servings}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function EmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '60px 32px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: 'var(--surface2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      </div>
      <div>
        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
          Sem receitas
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          Adiciona a tua primeira receita com o botão +
        </div>
      </div>
    </div>
  )
}
