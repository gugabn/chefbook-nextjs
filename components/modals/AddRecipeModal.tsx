'use client'

import { useState, useEffect } from 'react'
import Sheet from '@/components/ui/Sheet'
import PhotoUpload from '@/components/ui/PhotoUpload'
import type { Recipe, Ingredient } from '@/lib/types'
import { analyzeRecipeImage } from '@/lib/gemini'

const CATEGORIES = ['Pequeno-Almoço', 'Almoço', 'Jantar', 'Sobremesa', 'Snack', 'Outro']

const UNITS = ['g', 'kg', 'ml', 'l', 'colher de chá', 'colher de sopa', 'chávena', 'un', 'dente', 'pitada', 'a gosto']

interface AddRecipeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (recipe: Recipe) => void
  initialData?: Recipe
  apiKey: string
  showToast: (msg: string) => void
}

const EMPTY_INGREDIENT: Ingredient = { qty: '', unit: 'g', name: '' }

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function AddRecipeModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  apiKey,
  showToast,
}: AddRecipeModalProps) {
  const [photo, setPhoto] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [time, setTime] = useState('')
  const [servings, setServings] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ ...EMPTY_INGREDIENT }])
  const [steps, setSteps] = useState<string[]>([''])
  const [analyzing, setAnalyzing] = useState(false)

  // Hydrate when editing
  useEffect(() => {
    if (isOpen && initialData) {
      setPhoto(initialData.photo ?? '')
      setName(initialData.name)
      setCategory(initialData.category)
      setTime(initialData.time ?? '')
      setServings(initialData.servings ?? '')
      setIngredients(initialData.ingredients.length ? initialData.ingredients : [{ ...EMPTY_INGREDIENT }])
      setSteps(initialData.steps.length ? initialData.steps : [''])
    } else if (isOpen && !initialData) {
      setPhoto('')
      setName('')
      setCategory(CATEGORIES[0])
      setTime('')
      setServings('')
      setIngredients([{ ...EMPTY_INGREDIENT }])
      setSteps([''])
    }
  }, [isOpen, initialData])

  const handlePhoto = async (dataUrl: string) => {
    setPhoto(dataUrl)

    if (!apiKey) {
      showToast('Adiciona a chave Gemini nas Definições para preenchimento automático')
      return
    }

    const [header, base64] = dataUrl.split(',')
    const mediaType = header.replace('data:', '').replace(';base64', '')

    setAnalyzing(true)
    showToast('Analisando imagem com IA...')
    try {
      const data = await analyzeRecipeImage(base64, mediaType, apiKey)
      if (data.name) setName(data.name)
      if (data.category && CATEGORIES.includes(data.category)) setCategory(data.category)
      if (data.time) setTime(data.time)
      if (data.servings) setServings(data.servings)
      if (data.ingredients?.length) setIngredients(data.ingredients)
      if (data.steps?.length) setSteps(data.steps)
      showToast('Receita analisada com sucesso!')
    } catch {
      showToast('Não foi possível analisar a imagem')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSave = () => {
    if (!name.trim()) { showToast('O nome é obrigatório'); return }
    const recipe: Recipe = {
      id: initialData?.id ?? newId(),
      name: name.trim(),
      category,
      time: time.trim() || undefined,
      servings: servings.trim() || undefined,
      photo: photo || undefined,
      ingredients: ingredients.filter(i => i.name.trim()),
      steps: steps.filter(s => s.trim()),
      createdAt: initialData?.createdAt ?? Date.now(),
    }
    onSave(recipe)
    onClose()
  }

  const addIngredient = () => setIngredients(prev => [...prev, { ...EMPTY_INGREDIENT }])
  const removeIngredient = (i: number) => setIngredients(prev => prev.filter((_, idx) => idx !== i))
  const updateIngredient = (i: number, field: keyof Ingredient, val: string) =>
    setIngredients(prev => prev.map((ing, idx) => (idx === i ? { ...ing, [field]: val } : ing)))

  const addStep = () => setSteps(prev => [...prev, ''])
  const removeStep = (i: number) => setSteps(prev => prev.filter((_, idx) => idx !== i))
  const updateStep = (i: number, val: string) =>
    setSteps(prev => prev.map((s, idx) => (idx === i ? val : s)))

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Receita' : 'Nova Receita'}
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
          {initialData ? 'Guardar alterações' : 'Adicionar receita'}
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Photo */}
        <div>
          <Label>Foto {analyzing && <span style={{ color: 'var(--primary)', fontSize: 12 }}>(analisando...)</span>}</Label>
          <PhotoUpload value={photo} onChange={handlePhoto} ratio="16/9" />
        </div>

        {/* Name */}
        <div>
          <Label>Nome *</Label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ex: Bacalhau à Brás"
            style={inputStyle}
          />
        </div>

        {/* Category */}
        <div>
          <Label>Categoria</Label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Time + Servings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <Label>Tempo</Label>
            <input type="text" value={time} onChange={e => setTime(e.target.value)} placeholder="30 min" style={inputStyle} />
          </div>
          <div>
            <Label>Porções</Label>
            <input type="text" value={servings} onChange={e => setServings(e.target.value)} placeholder="4 pessoas" style={inputStyle} />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Label style={{ margin: 0 }}>Ingredientes</Label>
            <button onClick={addIngredient} style={addBtnStyle}>+ Adicionar</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="text"
                  value={ing.qty}
                  onChange={e => updateIngredient(i, 'qty', e.target.value)}
                  placeholder="Qtd"
                  style={{ ...inputStyle, width: 56, flexShrink: 0, padding: '10px 8px', textAlign: 'center' }}
                />
                <select
                  value={ing.unit}
                  onChange={e => updateIngredient(i, 'unit', e.target.value)}
                  style={{ ...inputStyle, flexShrink: 0, width: 90, padding: '10px 6px' }}
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <input
                  type="text"
                  value={ing.name}
                  onChange={e => updateIngredient(i, 'name', e.target.value)}
                  placeholder="Ingrediente"
                  style={{ ...inputStyle, flex: 1 }}
                />
                {ingredients.length > 1 && (
                  <button
                    onClick={() => removeIngredient(i)}
                    aria-label="Remover"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--surface)',
                      cursor: 'pointer',
                      color: '#E85D3A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Label style={{ margin: 0 }}>Modo de preparação</Label>
            <button onClick={addStep} style={addBtnStyle}>+ Passo</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 10,
                  }}
                >
                  {i + 1}
                </div>
                <textarea
                  value={step}
                  onChange={e => updateStep(i, e.target.value)}
                  placeholder={`Passo ${i + 1}...`}
                  rows={2}
                  style={{ ...inputStyle, flex: 1, resize: 'vertical', lineHeight: 1.5 }}
                />
                {steps.length > 1 && (
                  <button
                    onClick={() => removeStep(i)}
                    aria-label="Remover passo"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--surface)',
                      cursor: 'pointer',
                      color: '#E85D3A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 6,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  )
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--text)',
        marginBottom: 6,
        ...style,
      }}
    >
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

const addBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 8,
  border: '1px solid var(--primary)',
  backgroundColor: 'transparent',
  color: 'var(--primary)',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
}
