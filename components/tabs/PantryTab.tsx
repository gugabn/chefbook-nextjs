'use client'

import { useState } from 'react'
import type { PantryItem } from '@/lib/types'
import { CATEGORY_ICONS, CATEGORY_COLORS } from '@/lib/categorize'

interface PantryTabProps {
  pantry: PantryItem[]
  onEditItem: (item: PantryItem) => void
  onDeleteItem: (id: string) => void
}

export default function PantryTab({ pantry, onEditItem, onDeleteItem }: PantryTabProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  // Group by category
  const groups: Record<string, PantryItem[]> = {}
  for (const item of pantry) {
    const cat = item.category || 'Outros'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item)
  }

  const categories = Object.keys(groups).sort()

  const toggle = (cat: string) => {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  if (pantry.length === 0) return <EmptyState />

  return (
    <div style={{ padding: '8px 16px 16px' }}>
      {categories.map(cat => (
        <div
          key={cat}
          style={{
            marginBottom: 12,
            backgroundColor: 'var(--surface)',
            borderRadius: 14,
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
          {/* Category header */}
          <button
            onClick={() => toggle(cat)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: CATEGORY_COLORS[cat] ?? '#9E9E9E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  opacity: 0.85,
                }}
              >
                {/* Color dot only, no emoji */}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  {cat}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {groups[cat].length} {groups[cat].length === 1 ? 'item' : 'itens'}
                </div>
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
                transform: collapsed[cat] ? 'rotate(-90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                flexShrink: 0,
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Items */}
          {!collapsed[cat] && (
            <div style={{ borderTop: '1px solid var(--border)' }}>
              {groups[cat].map((item, idx) => (
                <PantryRow
                  key={item.id}
                  item={item}
                  isLast={idx === groups[cat].length - 1}
                  onEdit={() => onEditItem(item)}
                  onDelete={() => onDeleteItem(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function PantryRow({
  item,
  isLast,
  onEdit,
  onDelete,
}: {
  item: PantryItem
  isLast: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const isLow = item.qty < 2
  const categoryIcon = CATEGORY_ICONS[item.category] ?? '📦'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        gap: 12,
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: 'var(--surface2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {categoryIcon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', lineHeight: 1.3 }}>
          {item.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{ fontSize: 12, color: isLow ? '#E85D3A' : 'var(--muted)', fontWeight: isLow ? 600 : 400 }}>
            {item.qty} {item.unit}
          </span>
          {isLow && (
            <span
              style={{
                fontSize: 10,
                backgroundColor: '#FEE2D5',
                color: '#C4622D',
                padding: '1px 6px',
                borderRadius: 4,
                fontWeight: 600,
              }}
            >
              Stock baixo
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button
          onClick={onEdit}
          aria-label="Editar"
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--muted)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          aria-label="Eliminar"
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E85D3A',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
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
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </div>
      <div>
        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
          Despensa vazia
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          Adiciona ingredientes à tua despensa
        </div>
      </div>
    </div>
  )
}
