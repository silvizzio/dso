'use client'
import { useEffect, useMemo, useState } from 'react'

// Timelapse of archive frames that blend into each other. No controls, no labels.
// Receives "year|url,year|url" from the Timelapse server wrapper.
// Keep every closing ">" on the same line as the last attribute.
const HOLD_MS = 900
const FADE_MS = 700
const END_HOLD_MS = 1600

type Frame = { year: string; src: string }

export function TimelapsePlayer({ frames, caption }: { frames: string; caption?: string }) {
  const list: Frame[] = useMemo(() => frames.split(',').map(s => s.trim()).filter(Boolean).map(s => {
    const [year, url] = s.split('|')
    return { year: year.trim(), src: url.trim() }
  }), [frames])
  const [i, setI] = useState(0)
  const [ready, setReady] = useState(false)
  const [instant, setInstant] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    let left = list.length
    list.forEach(f => {
      const im = new Image()
      im.onload = im.onerror = () => { left -= 1; if (left === 0) setReady(true) }
      im.src = f.src
    })
  }, [list])

  useEffect(() => {
    if (!ready || reduced) return
    const last = i === list.length - 1
    const t = setTimeout(() => {
      setInstant(last)
      setI(last ? 0 : i + 1)
    }, (last ? END_HOLD_MS : HOLD_MS) + FADE_MS)
    return () => clearTimeout(t)
  }, [i, ready, reduced, list.length])

  const fade = instant ? '0ms' : `${FADE_MS}ms`
  const text = caption ? caption.charAt(0).toUpperCase() + caption.slice(1) : ''

  return (
    <span className="not-prose" style={{ display: 'block', margin: '8px 0 32px' }}>
      <span style={{ display: 'block', position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: '4px', background: '#111213', filter: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))' }}>
        {list.map((f, k) => (
          <img key={f.src} src={f.src} alt={k === i ? `The district in ${f.year}` : ''} draggable={false} onContextMenu={e => e.preventDefault()} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: k === i ? 1 : 0, transition: `opacity ${fade} ease-in-out` }} />
        ))}
      </span>
      {text ? <span style={{ display: 'block', marginTop: '8px', fontSize: '11px', color: 'hsl(var(--muted-foreground))', textAlign: 'center', lineHeight: 1.5 }}>{text}</span> : null}
    </span>
  )
}
