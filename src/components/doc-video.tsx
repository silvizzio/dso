'use client'
import { useEffect, useRef } from 'react'

// Looping, muted video for the docs, captioned like DocImage.
// Use in MDX: <DocVideo src="/dso/videos/docs/<file>.mp4" poster="/dso/videos/docs/<file>.jpg" caption="..." />
// Files live in public/videos/docs so the browser can stream them.
// Keep every closing ">" on the same line as the last attribute.
export function DocVideo({ src, poster, caption }: { src: string; poster?: string; caption?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Respect the reduced motion setting: show the first frame and let the reader press play.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) ref.current?.pause()
  }, [])

  const text = caption ? caption.charAt(0).toUpperCase() + caption.slice(1) : ''

  return (
    <span style={{ display: 'block', marginBottom: '32px' }}>
      <video ref={ref} src={src} poster={poster} autoPlay muted loop playsInline controls preload="metadata" aria-label={caption} style={{ display: 'block', width: '100%', height: 'auto', borderRadius: '4px', filter: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))' }} />
      {text ? <span style={{ display: 'block', marginTop: '8px', fontSize: '11px', color: 'hsl(var(--muted-foreground))', textAlign: 'center', lineHeight: 1.5 }}>{text}</span> : null}
    </span>
  )
}
