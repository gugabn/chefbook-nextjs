'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FDF8F3',
        fontFamily: 'system-ui, sans-serif',
        padding: '32px 16px',
        textAlign: 'center',
      }}
    >
      <div>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: '#C4622D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
            <line x1="6" y1="17" x2="18" y2="17" />
          </svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#2C2C2C', margin: '0 0 8px' }}>
          Algo correu mal
        </h2>
        <p style={{ fontSize: 14, color: '#6B6B6B', margin: '0 0 24px' }}>
          Ocorreu um erro ao carregar a aplicação.
        </p>
        <button
          onClick={reset}
          style={{
            padding: '12px 28px',
            backgroundColor: '#C4622D',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
