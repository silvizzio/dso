import type { Metadata } from 'next'
import CanvaViewer, { type DeckPage } from './canva-viewer'

// Full-screen Canva prototype at /dso/canva.
// The page list and thumbnails are read from Canva's public view page on every visit,
// because Canva signs each thumbnail link for about 15 minutes.
// Keep every closing ">" on the same line as the last attribute.
const DESIGN = 'https://www.canva.com/design/DAHUOW6WixI/cbnwI4N5aQrecqEjjJN5aw'
const START_PAGE = 2

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Prototype | DSO Digital Twin',
  robots: { index: false, follow: false },
}

async function readPages(): Promise<DeckPage[]> {
  try {
    const res = await fetch(`${DESIGN}/view`, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36',
        'Accept-Language': 'en',
      },
    })
    if (!res.ok) return []
    const html = await res.text()
    const re = /"bucket":"document-export\.canva\.com","key":"[^"]*","page":(\d+),"pageHash":-?\d+,"height":\d+,"width":\d+,"url":"((?:[^"\\]|\\.)*)"/g
    const byPage = new Map<number, string>()
    for (const m of html.matchAll(re)) {
      const page = Number(m[1])
      if (!byPage.has(page)) byPage.set(page, JSON.parse(`"${m[2]}"`))
    }
    return [...byPage.entries()].sort((a, b) => a[0] - b[0]).map(([page, thumb]) => ({ page, thumb }))
  } catch {
    return []
  }
}

export default async function CanvaPage() {
  const pages = await readPages()
  return <CanvaViewer design={DESIGN} pages={pages} startPage={START_PAGE} />
}
