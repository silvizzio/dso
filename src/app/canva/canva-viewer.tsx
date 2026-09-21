'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Our page drives the navigation. Canva only displays the slide.
// A transparent layer over the deck takes every click, so Canva's own controls
// cannot move the deck without our counter knowing.
// FORCE_RELOAD: reloads the deck at the chosen page, so Canva always draws the slide.
// Set it to false for faster jumps if the slides render without it.
// Keep every closing ">" on the same line as the last attribute.
const FORCE_RELOAD = true
const DSO_NAVY = '#194167'
const SPRITE_BASE = '/dso/api/canva-sprite'
// Columns in the sprite. The sprite route uses the same value from the URL.
const SPRITE_COLS = 7

export type DeckPage = { page: number }

export default function CanvaViewer({ design, pages, version, startPage }: { design: string; pages: DeckPage[]; version: string; startPage: number }) {
  const total = pages.length
  const [page, setPage] = useState(startPage)
  const [ready, setReady] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)
  const spriteUrl = total ? `${SPRITE_BASE}?n=${total}&cols=${SPRITE_COLS}${version ? `&v=${version}` : ''}` : ''
  const spriteRows = Math.ceil(total / SPRITE_COLS)
  const [spriteReady, setSpriteReady] = useState(false)

  useEffect(() => {
    if (!spriteUrl) return
    const img = new Image()
    img.onload = () => setSpriteReady(true)
    img.src = spriteUrl
  }, [spriteUrl])

  const tileStyle = (n: number) => {
    const i = n - 1
    const col = i % SPRITE_COLS
    const row = Math.floor(i / SPRITE_COLS)
    const x = SPRITE_COLS > 1 ? (col / (SPRITE_COLS - 1)) * 100 : 0
    const y = spriteRows > 1 ? (row / (spriteRows - 1)) * 100 : 0
    return {
      display: 'block', width: '100%', aspectRatio: '16 / 9', borderRadius: '4px', backgroundColor: '#1d2126',
      backgroundImage: spriteReady ? `url(${spriteUrl})` : 'none',
      backgroundSize: `${SPRITE_COLS * 100}% ${spriteRows * 100}%`,
      backgroundPosition: `${x}% ${y}%`,
    }
  }

  useEffect(() => {
    const fromHash = Number(window.location.hash.replace('#', ''))
    if (fromHash >= 1 && (!total || fromHash <= total)) setPage(fromHash)
    setReady(true)
  }, [total])

  const go = useCallback((n: number) => {
    if (!total) return
    const next = Math.min(Math.max(n, 1), total)
    setPage(next)
    window.history.replaceState(null, '', `#${next}`)
  }, [total])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(page + 1) }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(page - 1) }
      if (e.key === 'Home') go(1)
      if (e.key === 'End') go(total)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [page, total, go])

  useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLElement>(`[data-page="${page}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [page])

  const src = `${design}/view?embed#${page}`
  const hasStrip = total > 0

  const btn = { background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }

  return (
    <main style={{ position: 'fixed', inset: 0, background: '#111213', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        {ready ? <iframe key={FORCE_RELOAD ? page : 'deck'} src={src} title="DSO Digital Twin prototype" allow="fullscreen" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} /> : null}
        {hasStrip ? (
          <div
            aria-label="Deck navigation: select the right half for the next page, the left half for the previous page"
            onClick={e => { const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect(); go(e.clientX - r.left > r.width / 2 ? page + 1 : page - 1) }}
            style={{ position: 'absolute', inset: 0, cursor: 'pointer', background: 'transparent' }} />
        ) : null}
        {hasStrip ? (
          <div aria-live="polite" style={{ position: 'absolute', left: '50%', top: '16px', transform: 'translateX(-50%)', pointerEvents: 'none', background: 'rgba(17,18,19,0.78)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '999px', padding: '6px 14px', fontSize: '13px', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>
            {page} / {total}
          </div>
        ) : null}
      </div>

      {hasStrip ? (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', background: '#0b0c0d', color: '#ffffff', padding: '10px 16px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontVariantNumeric: 'tabular-nums' }}>
              Page <strong style={{ color: '#ffffff' }}>{page}</strong> of {total}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => go(page - 1)} disabled={page <= 1} style={{ ...btn, opacity: page <= 1 ? 0.35 : 1 }}>Back</button>
              <button type="button" onClick={() => go(page + 1)} disabled={page >= total} style={{ ...btn, opacity: page >= total ? 0.35 : 1 }}>Next</button>
            </div>
          </div>
          <div ref={stripRef} style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {pages.map(p => (
              <button
                key={p.page}
                type="button"
                data-page={p.page}
                onClick={() => go(p.page)}
                aria-label={`Page ${p.page}`}
                aria-current={p.page === page ? 'page' : undefined}
                style={{ flex: '0 0 auto', width: '128px', padding: 0, border: `2px solid ${p.page === page ? '#ffffff' : 'transparent'}`, borderRadius: '6px', background: 'transparent', cursor: 'pointer', position: 'relative', opacity: p.page === page ? 1 : 0.6 }}>
                <span style={tileStyle(p.page)} />
                <span style={{ position: 'absolute', left: '4px', bottom: '4px', fontSize: '10px', lineHeight: 1, padding: '3px 5px', borderRadius: '3px', background: p.page === page ? DSO_NAVY : 'rgba(0,0,0,0.6)', color: '#ffffff' }}>{p.page}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </main>
  )
}
