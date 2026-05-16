'use client'

import { useRef } from 'react'

interface PhotoUploadProps {
  value: string
  onChange: (dataUrl: string) => void
  ratio?: '16/9' | '3/4'
}

export default function PhotoUpload({ value, onChange, ratio = '16/9' }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const paddingTop = ratio === '16/9' ? '56.25%' : '133.33%'

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      // result is a complete data URL: "data:image/png;base64,..."
      onChange(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      style={{
        position: 'relative',
        paddingTop,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'var(--surface2)',
        border: '2px dashed var(--border)',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--primary)')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)')}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Foto"
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
        ) : (
          <>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '0 12px' }}>
              Toca para adicionar foto
            </span>
          </>
        )}

        {value && (
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: 12,
              color: '#fff',
            }}
          >
            Alterar
          </div>
        )}
      </div>
    </div>
  )
}
