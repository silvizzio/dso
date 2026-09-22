import { imageUrl } from '@/components/doc-image'
import { TimelapsePlayer } from '@/components/timelapse-player'

// Server wrapper: turns "2005:file.jpg,2010:file.jpg" into versioned image addresses,
// so a replaced frame is never served from an old cache.
// Use in MDX: <Timelapse frames="2005:file.jpg,2010:file.jpg" caption="..." />
export function Timelapse({ frames, caption }: { frames: string; caption?: string }) {
  const list = frames.split(',').map(s => s.trim()).filter(Boolean).map(s => {
    const [year, file] = s.split(':')
    return `${year.trim()}|${imageUrl(file.trim())}`
  }).join(',')
  return <TimelapsePlayer frames={list} caption={caption} />
}
