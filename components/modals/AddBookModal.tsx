'use client'

import { useState, useEffect } from 'react'
import Sheet from '@/components/ui/Sheet'
import PhotoUpload from '@/components/ui/PhotoUpload'
import type { Book } from '@/lib/types'

interface AddBookModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (book: Book) => void
}

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function AddBookModal({ isOpen, onClose, onSave }: AddBookModalProps) {
  const [photo, setPhoto] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [tags, setTags] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (isOpen) {
      setPhoto('')
      setTitle('')
      setAuthor('')
      setTags('')
      setNotes('')
    }
  }, [isOpen])

  const handleSave = () => {
    if (!title.trim()) return
    const book: Book = {
      id: newId(),
      title: title.trim(),
      author: author.trim() || undefined,
      photo: photo || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      notes: notes.trim() || undefined,
      createdAt: Date.now(),
    }
    onSave(book)
    onClose()
  }

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Novo Livro"
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
          Adicionar livro
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <Label>Capa</Label>
          <PhotoUpload
            value={photo}
            onChange={(b64) => setPhoto(b64)}
            ratio="3/4"
          />
        </div>

        <div>
          <Label>Título *</Label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex: Jerusalem"
            style={inputStyle}
          />
        </div>

        <div>
          <Label>Autor</Label>
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Ex: Yotam Ottolenghi"
            style={inputStyle}
          />
        </div>

        <div>
          <Label>Tags (separadas por vírgula)</Label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Ex: mediterrâneo, vegetariano"
            style={inputStyle}
          />
        </div>

        <div>
          <Label>Notas</Label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notas pessoais sobre este livro..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
          />
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
