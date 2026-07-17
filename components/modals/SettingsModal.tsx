'use client'

import { useState, useEffect, useRef } from 'react'
import Sheet from '@/components/ui/Sheet'
import { downloadBackup, importBackup } from '@/lib/backup'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  apiKey: string
  onSave: (key: string) => void
}

export default function SettingsModal({ isOpen, onClose, apiKey, onSave }: SettingsModalProps) {
  const [key, setKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [backupMsg, setBackupMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setKey(apiKey)
      setShowKey(false)
      setBackupMsg(null)
    }
  }, [isOpen, apiKey])

  const handleExport = () => {
    downloadBackup()
    setBackupMsg({ text: 'Backup transferido para o teu dispositivo.', ok: true })
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // permite reimportar o mesmo ficheiro
    if (!file) return
    const text = await file.text()
    const result = importBackup(text)
    if (result.ok) {
      setBackupMsg({ text: `Backup restaurado (${result.restored} secções). A recarregar…`, ok: true })
      setTimeout(() => window.location.reload(), 1200)
    } else {
      setBackupMsg({ text: result.error ?? 'Não foi possível importar.', ok: false })
    }
  }

  const handleSave = () => {
    onSave(key.trim())
    onClose()
  }

  const isSet = !!apiKey

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Definições"
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
          Guardar
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Status indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 12,
            backgroundColor: isSet ? '#E8F5E9' : '#FFF3E0',
            border: `1px solid ${isSet ? '#C8E6C9' : '#FFE0B2'}`,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: isSet ? '#4CAF50' : '#FF9800',
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: isSet ? '#2E7D32' : '#E65100' }}>
              {isSet ? 'API Key configurada' : 'API Key não configurada'}
            </div>
            <div style={{ fontSize: 12, color: isSet ? '#388E3C' : '#BF360C' }}>
              {isSet
                ? 'Análise de imagens com IA disponível'
                : 'Adiciona a chave para activar análise de imagens'}
            </div>
          </div>
        </div>

        {/* API Key input */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
            Gemini API Key
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="AIza..."
              style={{
                width: '100%',
                padding: '11px 44px 11px 12px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                fontSize: 16,
                color: 'var(--text)',
                outline: 'none',
                fontFamily: 'monospace',
              }}
            />
            <button
              onClick={() => setShowKey(v => !v)}
              aria-label={showKey ? 'Ocultar chave' : 'Mostrar chave'}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted)',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showKey ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div
          style={{
            backgroundColor: 'var(--surface2)',
            borderRadius: 12,
            padding: '14px 16px',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
            Como obter a chave gratuita
          </div>
          <ol style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.8 }}>
            <li>Visita <strong>aistudio.google.com</strong></li>
            <li>Inicia sessão com a tua conta Google</li>
            <li>Clica em &quot;Get API key&quot; → &quot;Create API key&quot;</li>
            <li>Copia e cola a chave acima</li>
          </ol>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>
            A chave é guardada apenas no teu dispositivo e nunca é partilhada.
          </div>
        </div>

        {/* Cópia de segurança */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
            Cópia de segurança
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.5 }}>
            Exporta um ficheiro com receitas, biblioteca e despensa
            para o guardares ou passares para outro telemóvel. A API key não é incluída.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={handleExport} style={backupBtnStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Exportar
            </button>
            <button onClick={() => fileInputRef.current?.click()} style={backupBtnStyle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Importar
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            style={{ display: 'none' }}
          />
          {backupMsg && (
            <div
              style={{
                marginTop: 10,
                padding: '10px 12px',
                borderRadius: 10,
                fontSize: 12,
                backgroundColor: backupMsg.ok ? 'rgba(122,158,126,0.12)' : 'rgba(232,93,58,0.10)',
                color: backupMsg.ok ? 'var(--sage)' : '#E85D3A',
              }}
            >
              {backupMsg.text}
            </div>
          )}
        </div>
      </div>
    </Sheet>
  )
}

const backupBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '12px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  backgroundColor: 'var(--surface2)',
  color: 'var(--text)',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
}
