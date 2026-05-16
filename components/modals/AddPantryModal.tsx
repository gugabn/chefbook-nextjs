'use client'

import { useState, useEffect } from 'react'
import Sheet from '@/components/ui/Sheet'
import type { PantryItem } from '@/lib/types'
import { categorizeItem, CATEGORY_ICONS } from '@/lib/categorize'

const UNITS = ['g', 'kg', 'ml', 'l', 'un', 'pacote', 'lata', 'caixa', 'dúzia', 'ramo']

interface AddPantryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: PantryItem) => void
  initialData?: PantryItem
}

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function AddPantryModal({ isOpen, onClose, onSave, initialData }: AddPantryModalProps) {
  const [name, setName] = useState('')
  const [qty, setQty] = useState('1')
  const [unit, setUnit] = useState(UNITS[0])
  const [detectedCategory, setDetectedCategory] = useState('Outros')

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name)
      setQty(String(initialData.qty))
      setUnit(initialData.unit)
      setDetectedCategory(initialData.category)
    } else if (isOpen) {
      setName('')
      setQty('1')
      setUnit(UNITS[0])
      setDetectedCategory('Outros')
    }
  }, [isOpen, initialData])

  const handleNameChange = (val: string) => {
    setName(val)
    if (val.trim()) {
      setDetectedCategory(categorizeItem(val))
    }
  }

  const handleSave = () => {
    if (!name.trim()) return
    const item: PantryItem = {
      id: initialData?.id ?? newId(),
      name: name.trim(),
      qty: parseFloat(qty) || 1,
      unit,
      category: detectedCategory,
    }
    onSave(item)
    onClose()
  }

  const icon = CATEGORY_ICONS[detectedCategory] ?? '📦'

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar item' : 'Novo item'}
      footer={
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 12,
            border: 'none',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 4,
          }}
        >
          {initialData ? 'Guardar' : 'Adicionar'}
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <Label>Nome</Label>
          <input
            type="text"
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            placeholder="Ex: Tomate cherry"
            style={inputStyle}
            autoComplete="off"
          />
          {name.trim() && (
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 8,
                backgroundColor: 'var(--surface2)',
                fontSize: 13,
                color: 'var(--muted)',
              }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              Categoria detectada: <strong style={{ color: 'var(--text)' }}>{detectedCategory}</strong>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <Label>Quantidade</Label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={qty}
              onChange={e => setQty(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <Label>Unidade</Label>
            <select value={unit} onChange={e => setUnit(e.target.value)} style={inputStyle}>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>
    </Sheet>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 12px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  backgroundColor: 'var(--surface)',
  fontSize: 16,
  color: 'var(--text)',
  outline: 'none',
  fontFamily: 'inherit',
}
