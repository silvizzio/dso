import { NextRequest, NextResponse } from 'next/server'

// Renders every page of the Canva deck into one sprite image for the /dso/canva strip.
// GET /dso/api/canva-sprite?v=<canva version>&n=<page count>&cols=<columns>
// One browser session renders all pages: after the first load, each page takes under a second.
// With ?v, the sprite is cached for a year. A new Canva version gives a new address.
export const maxDuration = 120
export const dynamic = 'force-dynamic'

const DESIGN = 'https://www.canva.com/design/DAHUOW6WixI/cbnwI4N5aQrecqEjjJN5aw'
const CHROMIUM_URL = 'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
const RENDER_W = 320
const RENDER_H = 180
const CELL_W = 256
const CELL_H = 144
const QUALITY = 72

async function launchBrowser() {
  const isVercel = process.env.VERCEL === '1'
  if (isVercel) {
    // Same setup as the PDF route: force the AL2023 lib set for Node 24.
    process.env.AWS_LAMBDA_JS_RUNTIME = 'nodejs22.x'
    const chromium = await import('@sparticuz/chromium-min')
    const puppeteer = await import('puppeteer-core')
    return puppeteer.default.launch({
      args: chromium.default.args,
      executablePath: await chromium.default.executablePath(CHROMIUM_URL),
      headless: true,
    })
  }
  const puppeteer = await import('puppeteer-core')
  return puppeteer.default.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })
}

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams
  const total = Number(q.get('n'))
  const cols = Number(q.get('cols') ?? 7)
  if (!Number.isInteger(total) || total < 1 || total > 200 || !Number.isInteger(cols) || cols < 1 || cols > 12) {
    return new NextResponse('Bad parameters', { status: 400 })
  }
  const versioned = q.has('v')
  const rows = Math.ceil(total / cols)

  let browser: Awaited<ReturnType<typeof launchBrowser>> | undefined
  try {
    browser = await launchBrowser()
    const tab = await browser.newPage()
    await tab.setViewport({ width: RENDER_W, height: RENDER_H, deviceScaleFactor: 1 })

    const shots: string[] = []
    for (let n = 1; n <= total; n++) {
      await tab.goto(`${DESIGN}/view?embed#${n}`, { waitUntil: 'load', timeout: 45000 })
      await tab.waitForSelector('[aria-label="Next page"]', { timeout: 20000 }).catch(() => {})
      await new Promise((r) => setTimeout(r, n === 1 ? 1500 : 700))
      // Hide Canva's control bar so it is not in the image.
      await tab.evaluate(() => {
        const labels = ['Previous page', 'Next page', 'More', 'Enter full screen']
        const btns = labels.map((l) => document.querySelector<HTMLElement>(`[aria-label="${l}"]`)).filter((b): b is HTMLElement => b !== null)
        if (!btns.length) return
        let box = btns[0].parentElement
        while (box && !btns.every((b) => box!.contains(b))) box = box.parentElement
        if (box) box.style.setProperty('display', 'none', 'important')
        btns.forEach((b) => b.style.setProperty('display', 'none', 'important'))
      })
      const shot = await tab.screenshot({ type: 'jpeg', quality: 80, encoding: 'base64' })
      shots.push(typeof shot === 'string' ? shot : Buffer.from(shot).toString('base64'))
    }

    const sheet = await browser.newPage()
    await sheet.setViewport({ width: cols * CELL_W, height: rows * CELL_H, deviceScaleFactor: 1 })
    const cells = shots.map((s) => `<img src="data:image/jpeg;base64,${s}" width="${CELL_W}" height="${CELL_H}">`).join('')
    await sheet.setContent(`<html><body style="margin:0;background:#1d2126;display:grid;grid-template-columns:repeat(${cols},${CELL_W}px);grid-auto-rows:${CELL_H}px">${cells}</body></html>`, { waitUntil: 'load' })
    const sprite = await sheet.screenshot({ type: 'jpeg', quality: QUALITY })

    const body = typeof sprite === 'string' ? Buffer.from(sprite, 'base64') : sprite
    return new NextResponse(new Uint8Array(body), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': versioned
          ? 'public, max-age=31536000, s-maxage=31536000, immutable'
          : 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    console.error('Canva sprite error:', err)
    return new NextResponse('Sprite error', { status: 502 })
  } finally {
    if (browser) await browser.close()
  }
}
