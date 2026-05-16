'use client'

import { useState } from 'react'
import type { Book } from '@/lib/types'

interface LibraryTabProps {
  books: Book[]
  onSelectBook: (b: Book) => void
}

export default function LibraryTab({ books, onSelectBook }: LibraryTabProps) {
  const [search, setSearch] = useState('')

  const filtered = books.filter(
    b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.author ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '12px 16px' }}>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--muted)"
          strokeWidth="2"
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          placeholder="Pesquisar livros..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 12px 12px 38px',
            borderRadius: 12,
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            fontSize: 16,
            color: 'var(--text)',
            outline: 'none',
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState search={search} />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          {filtered.map(book => (
            <BookCard key={book.id} book={book} onClick={() => onSelectBook(book)} />
          ))}
        </div>
      )}
    </div>
  )
}

function BookCard({ book, onClick }: { book: Book; onClick: () => void }) {
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
      {/* Cover */}
      <div
        style={{
          width: '100%',
          paddingTop: '133%',
          position: 'relative',
          backgroundColor: 'var(--surface2)',
        }}
      >
        {book.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:image/jpeg;base64,${book.photo}`}
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
              backgroundColor: 'var(--primary)',
              gap: 8,
              padding: 12,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 1.3, fontWeight: 600 }}>
              {book.title}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 10px 12px' }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text)',
            lineHeight: 1.3,
            marginBottom: 3,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {book.title}
        </div>
        {book.author && (
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{book.author}</div>
        )}
      </div>
    </button>
  )
}

function EmptyState({ search }: { search: string }) {
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
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </div>
      <div>
        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
          {search ? 'Sem resultados' : 'Biblioteca vazia'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          {search
            ? `Nenhum livro encontrado para "${search}"`
            : 'Adiciona o teu primeiro livro de culinária'}
        </div>
      </div>
    </div>
  )
}
