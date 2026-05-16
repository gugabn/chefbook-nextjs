'use client'

import { useEffect } from 'react'
import type { Book } from '@/lib/types'

interface BookDetailModalProps {
  book: Book | null
  isOpen: boolean
  onClose: () => void
  onDelete: (id: string) => void
}

export default function BookDetailModal({ book, isOpen, onClose, onDelete }: BookDetailModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen || !book) return null

  const handleDelete = () => {
    if (confirm('Eliminar este livro?')) {
      onDelete(book.id)
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
      }}
    >
      {/* Hero */}
      <div
        style={{
          width: '100%',
          paddingTop: '66%',
          position: 'relative',
          backgroundColor: 'var(--primary)',
        }}
      >
        {book.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.photo}
            alt={book.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
        )}

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
      </div>

      {/* Content */}
      <div style={{ padding: '24px 16px', paddingBottom: 'max(80px, calc(80px + env(safe-area-inset-bottom)))' }}>
        <h1
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--text)',
            margin: '0 0 6px',
          }}
        >
          {book.title}
        </h1>

        {book.author && (
          <div style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 16 }}>
            {book.author}
          </div>
        )}

        {book.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {book.tags.map(tag => (
              <span
                key={tag}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  backgroundColor: 'var(--surface2)',
                  fontSize: 12,
                  color: 'var(--muted)',
                  border: '1px solid var(--border)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {book.notes && (
          <div
            style={{
              backgroundColor: 'var(--surface2)',
              borderRadius: 12,
              padding: '14px 16px',
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>
              NOTAS
            </div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
              {book.notes}
            </p>
          </div>
        )}

        <button
          onClick={handleDelete}
          style={{
            width: '100%',
            padding: '13px',
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
            gap: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
          Eliminar livro
        </button>
      </div>
    </div>
  )
}
