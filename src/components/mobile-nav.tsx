'use client'
import { useState } from 'react'
import Link from 'next/link'

type DocMeta = { slug: string; title: string; section: string; order: number }

export default function MobileNav({ docsBySection, currentSlug, lastUpdated }: { docsBySection: Record<string, DocMeta[]>; currentSlug?: string; lastUpdated?: { full: string; monthYear: string } }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="lg:hidden"
        onClick={() => setOpen(true)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'hsl(var(--foreground))', display: 'flex', alignItems: 'center' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </button>

      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}
          onClick={() => setOpen(false)}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
          <nav
            style={{ position: 'relative', width: '280px', height: '100%', background: 'hsl(var(--background))', borderRight: '1px solid hsl(var(--border))', overflowY: 'auto', padding: '16px 0' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 16px', borderBottom: '1px solid hsl(var(--border))', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><img src="/dso/logo.svg" alt="Project" width={24} height={24} style={{ flexShrink: 0, display: 'block' }} /><div>
                <p style={{ fontSize: '12px', fontWeight: 500 }}>Project</p>
                <p style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>v1.0 · {lastUpdated?.monthYear ?? new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div></div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--muted-foreground))', padding: '4px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            {Object.entries(docsBySection).map(([section, docs]) => (
              <div key={section} style={{ marginBottom: '4px' }}>
                <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'hsl(var(--muted-foreground))', padding: '8px 16px 4px' }}>{section}</p>
                {docs.map((d) => (
                  <Link
                    key={d.slug}
                    href={'/docs/' + d.slug}
                    onClick={() => setOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '6px 16px', color: d.slug === currentSlug ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))', fontWeight: d.slug === currentSlug ? 500 : 400, textDecoration: 'none', background: d.slug === currentSlug ? 'hsl(var(--muted))' : 'transparent', borderLeft: d.slug === currentSlug ? '2px solid hsl(var(--foreground))' : '2px solid transparent' }}
                  >
                    <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', minWidth: '16px' }}>{String(d.order).padStart(2, '0')}</span>
                    {d.title}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
