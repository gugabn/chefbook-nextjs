'use client'

import { useState, useEffect } from 'react'
import Sheet from '@/components/ui/Sheet'

interface ShoppingListModalProps {
  items: string[]
  recipeName: string
  isOpen: boolean
  onClose: () => void
}

export default function ShoppingListModal({ items, recipeName, isOpen, onClose }: ShoppingListModalProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (isOpen) setChecked({})
  }, [isOpen])

  const toggle = (i: number) => setChecked(prev => ({ ...prev, [i]: !prev[i] }))

  const uncheckedCount = items.filter((_, i) => !checked[i]).length

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Lista de compras"
      footer={
        <div style={{ padding: '4px 0 4px' }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8, textAlign: 'center' }}>
            {uncheckedCount} de {items.length} itens por comprar
          </div>
        </div>
      }
    >
      <div>
        <div
          style={{
            fontSize: 13,
            color: 'var(--muted)',
            marginBottom: 14,
            padding: '8px 12px',
            backgroundColor: 'var(--surface2)',
            borderRadius: 8,
          }}
        >
          Para: <strong style={{ color: 'var(--text)' }}>{recipeName}</strong>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--muted)', fontSize: 14 }}>
            Todos os ingredientes estão verificados!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  backgroundColor: checked[i] ? 'var(--surface2)' : 'var(--surface)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.15s',
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
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
                  {item}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Sheet>
  )
}
