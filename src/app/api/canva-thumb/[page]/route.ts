import { NextRequest, NextResponse } from 'next/server'

// Renders one page of the Canva deck as a small JPEG, for the /dso/canva thumbnail strip.
// GET /dso/api/canva-thumb/<page>?v=<canva document version>
// With ?v, the image is cached for a year: a new Canva version gives a new address.
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const DESIGN = 'https://www.canva.com/design/DAHUOW6WixI/cbnwI4N5aQrecqEjjJN5aw'
const CHROMIUM_URL = 'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
const WIDTH = 320
const HEIGHT = 180
const QUALITY = 60
// Time for Canva to draw the page after loading.
const SETTLE_MS = 2500

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const n = Number(page)
  if (!Number.isInteger(n) || n < 1 || n > 500) {
    return new NextResponse('Bad page number', { status: 400 })
  }
  const versioned = new URL(request.url).searchParams.has('v')

  let browser: Awaited<ReturnType<typeof launchBrowser>> | undefined
  try {
    browser = await launchBrowser()
    const tab = await browser.newPage()
    await tab.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 })
    await tab.goto(`${DESIGN}/view?embed#${n}`, { waitUntil: 'networkidle2', timeout: 40000 })
    await new Promise((r) => setTimeout(r, SETTLE_MS))
    // Hide Canva's control bar (previous, next, more, full screen) so it is not in the image.
    await tab.evaluate(() => {
      const labels = ['Previous page', 'Next page', 'More', 'Enter full screen']
      const btns = labels.map((l) => document.querySelector<HTMLElement>(`[aria-label="${l}"]`)).filter((b): b is HTMLElement => b !== null)
      if (!btns.length) return
      let box = btns[0].parentElement
      while (box && !btns.every((b) => box!.contains(b))) box = box.parentElement
      if (box) box.style.setProperty('display', 'none', 'important')
      btns.forEach((b) => b.style.setProperty('display', 'none', 'important'))
    })
    await new Promise((r) => setTimeout(r, 300))
    const shot = await tab.screenshot({ type: 'jpeg', quality: QUALITY })
    return new NextResponse(new Uint8Array(shot), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': versioned
          ? 'public, max-age=31536000, s-maxage=31536000, immutable'
          : 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    console.error('Canva thumbnail error:', err)
    return new NextResponse('Thumbnail error', { status: 502 })
  } finally {
    if (browser) await browser.close()
  }
}
