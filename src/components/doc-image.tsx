import path from 'path'
import { CanvasImage } from '@/components/canvas-image'

export function DocImage({ src, alt }: { src: string; alt?: string }) {
  // Normalise to the served URL. Accept a bare filename, an /api/img/ path,
  // or any prefixed slug; only the basename matters since images are flat.
  const filename = path.basename(src.replace(/^\/api\/img\//, ''))
  const url = `/project/api/img/${filename}`
  const ext = path.extname(filename).toLowerCase()
  const isSvg = ext === '.svg'

  const separator = ' \u2014 '
  const hasTitle = (alt || '').includes(separator)
  const title = hasTitle ? (alt || '').split(separator)[0] : ''
  const caption = hasTitle ? (alt || '').split(separator).slice(1).join(separator) : (alt || '')

  return (
    <span style={{ display: 'block', marginBottom: '32px' }}>
      {title && (
        <span style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'hsl(var(--foreground))' }}>
          {title}
        </span>
      )}
      {isSvg ? (
        <img src={url} alt={alt || ''} draggable={false} style={{ display: 'block', maxWidth: '100%', pointerEvents: 'none', userSelect: 'none' }} />
      ) : (
        <CanvasImage src={url} alt={alt || ''} />
      )}
      {caption && (
        <span style={{ display: 'block', marginTop: '8px', fontSize: '11px', color: 'hsl(var(--muted-foreground))', textAlign: 'center', lineHeight: 1.5 }}>
          {caption.charAt(0).toUpperCase() + caption.slice(1)}
        </span>
      )}
    </span>
  )
}
