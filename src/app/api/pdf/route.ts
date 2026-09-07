import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

export const maxDuration = 120

const HDR = "<div style=\"width:100%;font-family:Inter,system-ui,sans-serif;font-size:7pt;color:#999;display:flex;justify-content:space-between;align-items:center;padding:0 20mm 2mm;border-bottom:0.3pt solid #e5e5e5\"><span style=\"font-weight:600\">Project Documentation</span><span>Confidential</span></div>"
const FTR = "<div style=\"width:100%;font-family:Inter,system-ui,sans-serif;font-size:7pt;color:#999;display:flex;justify-content:space-between;align-items:center;padding:2mm 20mm 0;border-top:0.3pt solid #e5e5e5\"><span>Vizzio · July 2026</span><span style=\"font-weight:600\"><span class=\"pageNumber\"></span> / <span class=\"totalPages\"></span></span></div>"
const CSS = "aside,header,.no-print{display:none!important}main{margin:0!important}main>div{padding:20px 0!important}main>div>div:first-child{display:none!important}"
const CHROMIUM_URL = "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"

function getSlugsInOrder(): string[] {
  const docsPath = path.join(process.cwd(), 'content/docs')
  return fs.readdirSync(docsPath)
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const raw = fs.readFileSync(path.join(docsPath, f), 'utf8')
      const orderMatch = raw.match(/^order:\s*(\d+)/m)
      return { slug: f.replace('.mdx', ''), order: orderMatch ? parseInt(orderMatch[1]) : 99 }
    })
    .sort((a, b) => a.order - b.order)
    .map(f => f.slug)
}

async function launchBrowser() {
  const isVercel = process.env.VERCEL === '1'
  if (isVercel) {
    // @sparticuz/chromium selects its bundled system libs from this at import time.
    // Node 24 has no profile it recognizes, so force the AL2023 (22.x) lib set.
    process.env.AWS_LAMBDA_JS_RUNTIME = 'nodejs22.x'
    const chromium = await import('@sparticuz/chromium-min')
    const puppeteer = await import('puppeteer-core')
    return puppeteer.default.launch({
      args: chromium.default.args,
      executablePath: await chromium.default.executablePath(CHROMIUM_URL),
      headless: true,
    })
  } else {
    const puppeteer = await import('puppeteer-core')
    return puppeteer.default.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })
  }
}

async function renderPage(browser: Awaited<ReturnType<typeof launchBrowser>>, url: string): Promise<Buffer> {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.addStyleTag({ content: CSS })
  await page.waitForSelector('article', { timeout: 15000 }).catch(() => {})
  await page.evaluateHandle('document.fonts.ready')
  // DocImage paints base64 images onto canvases client-side; wait until they are actually drawn
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight)
    await new Promise((r) => setTimeout(r, 400))
    window.scrollTo(0, 0)
    const isBlank = (c: HTMLCanvasElement): boolean => {
      try {
        if (!c.width || !c.height) return true
        const ctx = c.getContext('2d')
        if (!ctx) return false
        const w = Math.min(c.width, 64), h = Math.min(c.height, 64)
        const d = ctx.getImageData(0, 0, w, h).data
        for (let i = 3; i < d.length; i += 4) { if (d[i] !== 0) return false }
        return true
      } catch {
        return false
      }
    }
    const start = Date.now()
    const deadline = start + 8000
    for (;;) {
      const canvases = Array.from(document.querySelectorAll('canvas')) as HTMLCanvasElement[]
      if (canvases.length > 0 && canvases.every((c) => !isBlank(c))) break
      if (canvases.length === 0 && Date.now() - start > 2000) break
      if (Date.now() > deadline) break
      await new Promise((r) => setTimeout(r, 200))
    }
  })
  const pdf = await page.pdf({
    format: 'A4',
    scale: 0.8,
    printBackground: true,
    margin: { top: '25mm', right: '20mm', bottom: '22mm', left: '20mm' },
    displayHeaderFooter: true,
    headerTemplate: HDR,
    footerTemplate: FTR,
  })
  await page.close()
  return Buffer.from(pdf)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const full = searchParams.get('full') === 'true'
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000') + '/project'

  let browser: Awaited<ReturnType<typeof launchBrowser>> | undefined
  try {
    browser = await launchBrowser()

    if (full) {
      const slugs = getSlugsInOrder()
      const pdfBuffers: Buffer[] = []
      for (const s of slugs) {
        const buf = await renderPage(browser, baseUrl + '/docs/' + s)
        pdfBuffers.push(buf)
      }
      const merged = await PDFDocument.create()
      for (const buf of pdfBuffers) {
        const doc = await PDFDocument.load(buf)
        const pages = await merged.copyPages(doc, doc.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      return new NextResponse(Buffer.from(await merged.save()), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Project-Documentation.pdf"',
        },
      })
    } else {
      const s = slug || 'overview'
      const buf = await renderPage(browser, baseUrl + '/docs/' + s)
      return new NextResponse(buf as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Project-' + s + '.pdf"',
        },
      })
    }
  } catch (err) {
    console.error('PDF error:', err)
    return new NextResponse(String(err), { status: 500 })
  } finally {
    if (browser) await browser.close()
  }
}
