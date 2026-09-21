import type { Metadata } from 'next'

// Full-screen Canva prototype at /dso/canva.
// START_PAGE skips the cover. Set it to 1 to start on the cover.
// Keep every closing ">" on the same line as the last attribute.
const DESIGN = 'https://www.canva.com/design/DAHUOW6WixI/cbnwI4N5aQrecqEjjJN5aw'
const START_PAGE = 2
const SRC = `${DESIGN}/view?embed#${START_PAGE}`

export const metadata: Metadata = {
  title: 'Prototype | DSO Digital Twin',
  robots: { index: false, follow: false },
}

export default function CanvaPage() {
  return (
    <main style={{ position: 'fixed', inset: 0, background: '#111213' }}>
      <iframe src={SRC} title="DSO Digital Twin prototype" allow="fullscreen" allowFullScreen style={{ width: '100%', height: '100%', border: 0, display: 'block' }} />
    </main>
  )
}
