'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import type { SearchDoc } from '@/lib/search'

type Props = { docs: SearchDoc[] }

const SECTIONS = ['Getting Started', 'Analysis', 'Applications', 'Pipelines', 'Platform', 'Reference']

export default function SearchBox({ docs }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchDoc[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const fuse = new Fuse(docs, {
    keys: [{ name: 'title', weight: 0.6 }, { name: 'content', weight: 0.3 }, { name: 'section', weight: 0.1 }],
    threshold: 0.35,
  })

  const openModal = useCallback(() => {
    setOpen(true)
    setQuery('')
    setResults([])
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const closeModal = useCallback(() => {
    setOpen(false)
    setQuery('')
    setResults([])
    setActive(0)
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); setActive(0); return }
    setResults(fuse.search(query).slice(0, 10).map(r => r.item))
    setActive(0)
  }, [query])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openModal() }
      if (!open) return
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, (results.length || allDocs.length) - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
      if (e.key === 'Enter') {
        const list = results.length ? results : allDocs
        if (list[active]) { window.location.href = '/docs/' + list[active].slug; closeModal() }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, results, active])

  const allDocs = docs

  const grouped = SECTIONS.map(section => ({
    section,
    items: allDocs.filter(d => d.section === section)
  })).filter(g => g.items.length > 0)

  return (
    <>
      <button
        onClick={openModal}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'hsl(var(--muted-foreground))', border: '1px solid hsl(var(--border))', borderRadius: '6px', padding: '5px 10px', width: '100%', background: 'hsl(var(--background))', cursor: 'text', textAlign: 'left' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <span style={{ flex: 1 }}>Search documentation...</span>
        <span style={{ fontSize: '10px', background: 'hsl(var(--muted))', padding: '1px 5px', borderRadius: '3px', letterSpacing: '0.02em' }}>⌘K</span>
      </button>

      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '80px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div
            ref={modalRef}
            style={{ width: '560px', maxHeight: '70vh', background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {/* Search input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderBottom: '1px solid hsl(var(--border))' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'hsl(var(--muted-foreground))', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search documentation..."
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: 'hsl(var(--foreground))' }}
              />
              {query && (
                <button onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--muted-foreground))', padding: '2px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              )}
              <kbd onClick={closeModal} style={{ fontSize: '10px', background: 'hsl(var(--muted))', border: '1px solid hsl(var(--border))', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', color: 'hsl(var(--muted-foreground))' }}>esc</kbd>
            </div>

            {/* Results */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {query && results.length === 0 && (
                <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {query && results.length > 0 && (
                <div style={{ padding: '8px 0' }}>
                  <div style={{ padding: '6px 16px 4px', fontSize: '10px', fontWeight: 600, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Results</div>
                  {results.map((doc, i) => (
                    <Link
                      key={doc.slug}
                      href={'/docs/' + doc.slug}
                      onClick={closeModal}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', textDecoration: 'none', background: i === active ? 'hsl(var(--muted))' : 'transparent' }}
                      onMouseEnter={() => setActive(i)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'hsl(var(--muted-foreground))', flexShrink: 0 }}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'hsl(var(--foreground))' }}>{doc.title}</div>
                        <div style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>{doc.section}</div>
                      </div>
                      {i === active && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto', color: 'hsl(var(--muted-foreground))' }}>
                          <polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>
                        </svg>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {!query && (
                <div style={{ padding: '8px 0' }}>
                  {grouped.map(group => (
                    <div key={group.section}>
                      <div style={{ padding: '10px 16px 4px', fontSize: '10px', fontWeight: 600, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{group.section}</div>
                      {group.items.map((doc, i) => {
                        const globalIdx = allDocs.indexOf(doc)
                        return (
                          <Link
                            key={doc.slug}
                            href={'/docs/' + doc.slug}
                            onClick={closeModal}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '7px 16px', textDecoration: 'none', background: globalIdx === active ? 'hsl(var(--muted))' : 'transparent' }}
                            onMouseEnter={() => setActive(globalIdx)}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'hsl(var(--muted-foreground))', flexShrink: 0 }}>
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                            </svg>
                            <span style={{ fontSize: '13px', color: 'hsl(var(--foreground))' }}>{doc.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '8px 16px', borderTop: '1px solid hsl(var(--border))', display: 'flex', gap: '16px', fontSize: '11px', color: 'hsl(var(--muted-foreground))' }}>
              <span><kbd style={{ background: 'hsl(var(--muted))', padding: '1px 4px', borderRadius: '3px', marginRight: '4px' }}>↑↓</kbd>navigate</span>
              <span><kbd style={{ background: 'hsl(var(--muted))', padding: '1px 4px', borderRadius: '3px', marginRight: '4px' }}>↵</kbd>open</span>
              <span><kbd style={{ background: 'hsl(var(--muted))', padding: '1px 4px', borderRadius: '3px', marginRight: '4px' }}>esc</kbd>close</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
