'use client'

import { useState } from 'react'

export default function FullGuideButton() {
  const [loading, setLoading] = useState(false)

  async function handle() {
    setLoading(true)
    try {
      const res = await fetch('/project/api/pdf?full=true')
      if (!res.ok) throw new Error('Failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Project-Documentation.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert('PDF generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'hsl(var(--primary-foreground))', background: 'hsl(var(--primary))', borderRadius: '6px', padding: '5px 12px', border: 'none', cursor: loading ? 'wait' : 'pointer', whiteSpace: 'nowrap', opacity: loading ? 0.5 : 1, fontWeight: 500 }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      {loading ? 'Generating...' : 'Download full guide'}
    </button>
  )
}
