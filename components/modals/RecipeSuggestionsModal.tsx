'use client'

import { useState, useEffect } from 'react'
import Sheet from '@/components/ui/Sheet'
import type { PantryItem, RecipeSuggestion } from '@/lib/types'
import { suggestRecipesFromPantry } from '@/lib/gemini'

interface RecipeSuggestionsModalProps {
  isOpen: boolean
  onClose: () => void
  pantry: PantryItem[]
  apiKey: string
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Fácil: '#7A9E7E',
  Médio: '#E8A838',
  Difícil: '#E85D3A',
}

export default function RecipeSuggestionsModal({
  isOpen,
  onClose,
  pantry,
  apiKey,
}: RecipeSuggestionsModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setSuggestions([])
    setError(null)
    setExpanded(null)

    if (!apiKey) {
      setError('Configura a tua chave Gemini nas definições para usar esta funcionalidade.')
      return
    }

    if (pantry.length === 0) {
      setError('Adiciona ingredientes à despensa primeiro.')
      return
    }

    setLoading(true)
    suggestRecipesFromPantry(pantry, apiKey)
      .then(setSuggestions)
      .catch(err => setError(err instanceof Error ? err.message : 'Erro ao gerar sugestões.'))
      .finally(() => setLoading(false))
  }, [isOpen])

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Sugestões da despensa">
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '3px solid var(--border)',
              borderTopColor: 'var(--primary)',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)', textAlign: 'center' }}>
            A analisar a tua despensa…
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && !loading && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#FEE2D5',
            borderRadius: 10,
            fontSize: 14,
            color: '#C4622D',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && suggestions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {suggestions.map((s, i) => (
            <SuggestionCard
              key={i}
              suggestion={s}
              expanded={expanded === i}
              onToggle={() => setExpanded(expanded === i ? null : i)}
            />
          ))}
        </div>
      )}
    </Sheet>
  )
}

function SuggestionCard({
  suggestion,
  expanded,
  onToggle,
}: {
  suggestion: RecipeSuggestion
  expanded: boolean
  onToggle: () => void
}) {
  const diffColor = DIFFICULTY_COLOR[suggestion.difficulty] ?? 'var(--muted)'

  return (
    <div
      style={{
        borderRadius: 12,
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: '14px 14px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4, lineHeight: 1.3 }}>
            {suggestion.name}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.4 }}>
            {suggestion.description}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: diffColor,
                backgroundColor: diffColor + '18',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              {suggestion.difficulty}
            </span>
            <span
              style={{
                fontSize: 11,
                color: 'var(--muted)',
                backgroundColor: 'var(--surface2)',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              {suggestion.time}
            </span>
            <span
              style={{
                fontSize: 11,
                color: 'var(--muted)',
                backgroundColor: 'var(--surface2)',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              {suggestion.category}
            </span>
          </div>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--muted)"
          strokeWidth="2"
          style={{
            flexShrink: 0,
            marginTop: 2,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
          {suggestion.usedIngredients.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#7A9E7E', marginBottom: 6 }}>
                ✓ Tens na despensa
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {suggestion.usedIngredients.map((ing, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: 12,
                      backgroundColor: '#EEF5EE',
                      color: '#4A7A4E',
                      padding: '3px 10px',
                      borderRadius: 20,
                    }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {suggestion.missingIngredients.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#E85D3A', marginBottom: 6 }}>
                + Ingredientes em falta
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {suggestion.missingIngredients.map((ing, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: 12,
                      backgroundColor: '#FEE2D5',
                      color: '#C4622D',
                      padding: '3px 10px',
                      borderRadius: 20,
                    }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
