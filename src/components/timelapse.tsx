'use client'
import { useEffect, useMemo, useState } from 'react'

// Timelapse of archive frames that blend into each other.
// Use in MDX: <Timelapse frames="2005:file.jpg,2010:file.jpg" caption="..." />
// Files are served from /dso/api/img/. String props only.
// Keep every closing ">" on the same line as the last attribute.
const HOLD_MS = 1800
const FADE_MS = 1400
const END_HOLD_MS = 3200

type Frame = { year: string; src: string }

export function Timelapse({ frames, caption }: { frames: string; caption?: string }) {
  const list: Frame[] = useMemo(() => frames.split(',').map(s => s.trim()).filter(Boolean).map(s => {
    const [year, file] = s.split(':')
    return { year: year.trim(), src: `/dso/api/img/${file.trim()}` }
  }), [frames])
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [ready, setReady] = useState(false)
  const [instant, setInstant] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const r = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(r)
    if (r) setPlaying(false)
    let left = list.length
    list.forEach(f => {
      const im = new Image()
      im.onload = im.onerror = () => { left -= 1; if (left === 0) setReady(true) }
      im.src = f.src
    })
  }, [list])

  useEffect(() => {
    if (!playing || !ready) return
    const last = i === list.length - 1
    const t = setTimeout(() => {
      setInstant(last)
      setI(last ? 0 : i + 1)
    }, (last ? END_HOLD_MS : HOLD_MS) + FADE_MS)
    return () => clearTimeout(t)
  }, [i, playing, ready, list.length])

  const go = (n: number) => { setInstant(false); setI(n) }
  const fade = reduced || instant ? '0ms' : `${FADE_MS}ms`
  const text = caption ? caption.charAt(0).toUpperCase() + caption.slice(1) : ''

  return (
    <span className="not-prose" style={{ display: 'block', margin: '8px 0 32px' }}>
      <span style={{ display: 'block', position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: '4px', background: '#111213', filter: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))' }}>
        {list.map((f, k) => (
          <img key={f.src} src={f.src} alt={k === i ? `The district in ${f.year}` : ''} draggable={false} onContextMenu={e => e.preventDefault()} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: k === i ? 1 : 0, transition: `opacity ${fade} ease-in-out` }} />
        ))}
        <span aria-live="polite" style={{ position: 'absolute', left: '50%', bottom: '16px', transform: 'translateX(-50%)', background: 'rgba(17,18,19,0.78)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '999px', padding: '6px 16px', fontSize: '15px', fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>{list[i]?.year}</span>
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
        <button type="button" onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pause the timelapse' : 'Play the timelapse'} style={{ flexShrink: 0, border: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}>{playing ? 'Pause' : 'Play'}</button>
        <span style={{ display: 'flex', flex: 1, gap: '4px' }}>
          {list.map((f, k) => (
            <button key={f.year} type="button" onClick={() => go(k)} aria-label={`Show ${f.year}`} aria-current={k === i ? 'true' : undefined} style={{ flex: 1, border: 0, background: 'transparent', padding: '4px 0', cursor: 'pointer', color: k === i ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))', fontSize: '11px', fontWeight: k === i ? 600 : 400, fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ display: 'block', height: '3px', borderRadius: '2px', marginBottom: '4px', background: k <= i ? '#194167' : 'hsl(var(--border))', transition: `background ${fade}` }} />
              {f.year}
            </button>
          ))}
        </span>
      </span>
      {text ? <span style={{ display: 'block', marginTop: '8px', fontSize: '11px', color: 'hsl(var(--muted-foreground))', textAlign: 'center', lineHeight: 1.5 }}>{text}</span> : null}
    </span>
  )
}
