import type { Metadata } from 'next'
import CanvaViewer, { type DeckPage } from './canva-viewer'

// Full-screen Canva prototype at /dso/canva.
// The page list and the Canva document version are read from Canva's public view page
// on every visit. Thumbnails come from /dso/api/canva-thumb, keyed by that version,
// so they refresh by themselves whenever the deck changes in Canva.
// Keep every closing ">" on the same line as the last attribute.
const DESIGN = 'https://www.canva.com/design/DAHUOW6WixI/cbnwI4N5aQrecqEjjJN5aw'
const DESIGN_ID = 'DAHUOW6WixI'
const START_PAGE = 2

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Canva',
  robots: { index: false, follow: false },
}

async function readDeck(): Promise<{ pages: DeckPage[]; version: string }> {
  try {
    const res = await fetch(`${DESIGN}/view`, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36',
        'Accept-Language': 'en',
      },
    })
    if (!res.ok) return { pages: [], version: '' }
    const html = await res.text()
    // Every page appears once in the document data, with an id that starts with PB.
    const ids = new Set([...html.matchAll(/"a":"(PB[A-Za-z0-9_-]{9,})"/g)].map(m => m[1]))
    // Canva raises the document version on every saved change.
    const version = html.match(new RegExp(`"A":"${DESIGN_ID}","B":(\\d+)`))?.[1] ?? ''
    const pages = Array.from({ length: ids.size }, (_, i) => ({ page: i + 1 }))
    return { pages, version }
  } catch {
    return { pages: [], version: '' }
  }
}

export default async function CanvaPage() {
  const { pages, version } = await readDeck()
  return <CanvaViewer design={DESIGN} pages={pages} version={version} startPage={START_PAGE} />
}
