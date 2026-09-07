'use client'

import { useState } from 'react'

type Props = {
  title: string
  section: string
  slug: string
}

export default function PrintButton({ slug }: Props) {
  const [loading, setLoading] = useState(false)

  async function handle() {
    setLoading(true)
    try {
      const res = await fetch('/project/api/pdf?slug=' + encodeURIComponent(slug))
      if (!res.ok) throw new Error('Failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Project-' + slug + '.pdf'
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
      className="no-print inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50" style={{ border: "1px solid hsl(var(--border))", borderRadius: "6px", padding: "5px 10px" }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      {loading ? 'Generating...' : 'Download PDF'}
    </button>
  )
}
