'use client'

type Tab = 'receitas' | 'biblioteca' | 'despensa'

interface BottomNavProps {
  activeTab: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'receitas',
    label: 'Receitas',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    id: 'biblioteca',
    label: 'Biblioteca',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    id: 'despensa',
    label: 'Despensa',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
]

export default function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        height: 'calc(72px + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {TABS.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--primary)' : 'var(--muted)',
              transition: 'color 0.2s',
              padding: '8px 0 0',
              minHeight: 44,
            }}
          >
            {tab.icon}
            <span
              style={{
                fontSize: 11,
                fontWeight: isActive ? 600 : 400,
                lineHeight: 1,
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
