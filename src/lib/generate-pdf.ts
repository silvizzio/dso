'use client'

import jsPDF from 'jspdf'
import { inter_regular } from './inter_regular-b64'
import { inter_bold } from './inter_bold-b64'

function registerInter(doc: jsPDF) {
  doc.addFileToVFS('Inter-Regular.ttf', inter_regular)
  doc.addFont('Inter-Regular.ttf', 'Inter', 'normal')
  doc.addFileToVFS('Inter-Bold.ttf', inter_bold)
  doc.addFont('Inter-Bold.ttf', 'Inter', 'bold')
}

// Typography scale, following corporate doc standards (Zebra/Inter equiv)
// Body: 10pt, leading 6mm (1.4x), paragraph gap 4mm
// H2: 15pt bold, 10mm pre-gap, 2mm post-gap, rule below
// H3: 11pt bold, 6mm pre-gap, 2mm post-gap
// Label: 7.5pt regular uppercase, 0 char spacing
// Title: 24pt bold
// Table header: 8pt bold uppercase, row height 9mm
// Table body: 9.5pt regular, row height 8mm
// List: 10pt, 5mm leading, 3mm item gap, 5mm indent

const C = {
  ink:    [18, 18, 18]  as [number,number,number],
  body:   [50, 50, 50]  as [number,number,number],
  muted:  [110,110,110] as [number,number,number],
  rule:   [210,210,210] as [number,number,number],
  tint:   [245,245,245] as [number,number,number],
  white:  [255,255,255] as [number,number,number],
}

function drawHeader(doc: jsPDF, pw: number, ml: number, mr: number) {
  doc.setFillColor(...C.ink)
  doc.rect(0, 0, pw, 15, 'F')

  // Logo grid
  doc.setGState(doc.GState({ opacity: 1 }))
  doc.setFillColor(...C.white)
  doc.roundedRect(ml, 4, 3, 3, 0.3, 0.3, 'F')
  doc.setGState(doc.GState({ opacity: 0.55 }))
  doc.roundedRect(ml+4, 4, 3, 3, 0.3, 0.3, 'F')
  doc.roundedRect(ml, 8, 3, 3, 0.3, 0.3, 'F')
  doc.setGState(doc.GState({ opacity: 0.2 }))
  doc.roundedRect(ml+4, 8, 3, 3, 0.3, 0.3, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  doc.setFont('Inter','bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...C.white)
  doc.setCharSpace(0)
  doc.text('RSG IOC', ml+10, 8.5)

  doc.setFont('Inter','normal')
  doc.setFontSize(7)
  doc.setTextColor(160,160,160)
  doc.text('Project Documentation v1.0', ml+10, 12)

  doc.setFontSize(7)
  doc.setTextColor(100,100,100)
  doc.text('Confidential · Authorized Stakeholders Only', pw-mr, 8.5, { align:'right' })
}

function drawFooters(doc: jsPDF, pw: number, ph: number, ml: number, mr: number) {
  const total = doc.getNumberOfPages()
  for (let i = 1; i <= total; i++) {
    doc.setPage(i)
    doc.setDrawColor(...C.rule)
    doc.setLineWidth(0.2)
    doc.line(ml, ph-10, pw-mr, ph-10)
    doc.setFont('Inter','normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...C.muted)
    doc.setCharSpace(0)
    doc.text('RSG IOC  ·  Vizzio  ·  July 2026  ·  Confidential', ml, ph-5.5)
    doc.setFont('Inter','bold')
    doc.text(String(i) + ' / ' + String(total), pw-mr, ph-5.5, { align:'right' })
  }
}

function renderBody(
  doc: jsPDF,
  article: Element,
  pw: number, ph: number, ml: number, mr: number, cw: number,
  startY: number
): number {
  let y = startY

  const guard = (need: number) => {
    if (y + need > ph - 14) { doc.addPage(); y = 26; return true }
    return false
  }

  for (const node of Array.from(article.childNodes)) {
    if (!(node instanceof HTMLElement)) continue
    const tag = node.tagName?.toLowerCase()
    const text = node.innerText?.trim()
    if (!text) continue

    if (tag === 'h2') {
      guard(18)
      y += 7
      doc.setFont('Inter','bold')
      doc.setFontSize(14)
      doc.setTextColor(...C.ink)
      doc.setCharSpace(0)
      const ls = doc.splitTextToSize(text, cw)
      doc.text(ls, ml, y)
      y += ls.length * 6.5 + 1
      doc.setDrawColor(...C.rule)
      doc.setLineWidth(0.2)
      doc.line(ml, y, pw-mr, y)
      y += 4

    } else if (tag === 'h3') {
      guard(12)
      y += 4
      doc.setFont('Inter','bold')
      doc.setFontSize(10.5)
      doc.setTextColor(...C.ink)
      doc.setCharSpace(0)
      const ls = doc.splitTextToSize(text, cw)
      doc.text(ls, ml, y)
      y += ls.length * 5.2 + 1.5

    } else if (tag === 'p') {
      doc.setFont('Inter','normal')
      doc.setFontSize(9)
      doc.setTextColor(...C.body)
      doc.setCharSpace(0)
      const ls = doc.splitTextToSize(text, cw)
      guard(ls.length * 5.2)
      doc.text(ls, ml, y)
      y += ls.length * 5.2 + 2.5

    } else if (tag === 'ul' || tag === 'ol') {
      doc.setFont('Inter','normal')
      doc.setFontSize(9)
      doc.setTextColor(...C.body)
      doc.setCharSpace(0)
      const items = Array.from(node.querySelectorAll('li'))
      for (const item of items) {
        const t = (item as HTMLElement).innerText?.trim()
        if (!t) continue
        const ls = doc.splitTextToSize(t, cw - 6)
        guard(ls.length * 5.2 + 1.5)
        doc.setFillColor(...C.muted)
        doc.circle(ml + 2.2, y - 1.2, 0.7, 'F')
        doc.text(ls, ml + 6, y)
        y += ls.length * 5.2 + 1.5
      }
      y += 2

    } else if (tag === 'div' && node.classList?.contains('not-prose')) {
      const cap = node.querySelector('p:last-child')
      const capText = (cap as HTMLElement)?.innerText?.trim() || ''
      const capLines = doc.splitTextToSize(capText, cw - 20)
      const boxH = 25 + capLines.length * 5
      guard(boxH + 4.2)
      y += 4.2

      doc.setFillColor(249, 249, 249)
      doc.roundedRect(ml, y, cw, boxH, 2, 2, 'F')
      doc.setDrawColor(210, 210, 210)
      doc.setLineWidth(0.3)
      doc.roundedRect(ml, y, cw, boxH, 2, 2, 'S')

      const cx = ml + cw / 2
      const iconY = y + 5

      // Image icon, rounded rect frame
      doc.setDrawColor(190, 190, 190)
      doc.setLineWidth(0.5)
      doc.roundedRect(cx - 5, iconY, 10, 7, 0.8, 0.8, 'S')
      doc.setDrawColor(190, 190, 190)
      doc.setLineWidth(0.4)
      doc.circle(cx - 2, iconY + 2.2, 1.1, 'S')
      doc.line(cx - 5, iconY + 5.8, cx - 1.5, iconY + 3.5)
      doc.line(cx - 1.5, iconY + 3.5, cx + 2.5, iconY + 5.2)
      doc.line(cx + 2.5, iconY + 5.2, cx + 5, iconY + 3.8)

      doc.setFont('Inter', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.setCharSpace(0)
      doc.text('Screenshot placeholder', cx, iconY + 10, { align: 'center' })

      if (capText) {
        doc.setFont('Inter', 'normal')
        doc.setFontSize(7.5)
        doc.setTextColor(175, 175, 175)
        doc.setCharSpace(0)
        doc.text(capLines, cx, iconY + 15, { align: 'center' })
      }

      y += boxH + 4.2
    } else if (tag === 'table') {
      const rows = Array.from(node.querySelectorAll('tr'))
      if (!rows.length) continue
      const colCount = rows[0].querySelectorAll('th,td').length || 1
      const colW = cw / colCount
      const hdrH = 8
      const rowH = 7.5
      const px = 3.2

      const tableH = rows.length * rowH + 1
      guard(tableH)

      for (let i = 0; i < rows.length; i++) {
        const cells = Array.from(rows[i].querySelectorAll('th,td'))
        const isHdr = !!rows[i].querySelector('th')
        const rh = isHdr ? hdrH : rowH
        guard(rh)

        if (isHdr) {
          doc.setFillColor(...C.tint)
          doc.rect(ml, y-rh+2.5, cw, rh, 'F')
          doc.setDrawColor(...C.rule)
          doc.setLineWidth(0.2)
          doc.line(ml, y-rh+2.5, pw-mr, y-rh+2.5)
          doc.line(ml, y+2.5, pw-mr, y+2.5)
        } else {
          doc.setDrawColor(228,228,228)
          doc.setLineWidth(0.15)
          doc.line(ml, y+2.5, pw-mr, y+2.5)
        }

        cells.forEach((cell, j) => {
          const ct = (cell as HTMLElement).innerText?.trim() || ''
          doc.setFont('helvetica', isHdr ? 'bold' : 'normal')
          doc.setFontSize(isHdr ? 8 : 9.5)
          doc.setTextColor(...(isHdr ? C.ink : C.body))
          doc.setCharSpace(0)
          const truncated = doc.splitTextToSize(ct, colW - px*2)[0] || ''
          doc.text(truncated, ml + j*colW + px, y)
        })
        y += rh
      }
      y += 6
    }
  }
  return y
}

export async function generateDocPDF(title: string, section: string, slug: string) {
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' })
  registerInter(doc)
  const pw=210, ph=297, ml=20, mr=20, cw=pw-ml-mr

  drawHeader(doc, pw, ml, mr)
  let y = 24

  // Section label, uppercase, no char spacing
  doc.setFont('Inter','normal')
  doc.setFontSize(7)
  doc.setTextColor(...C.muted)
  doc.setCharSpace(0)
  doc.text(section.toUpperCase(), ml, y)
  y += 4

  doc.setFont('Inter','bold')
  doc.setFontSize(20)
  doc.setTextColor(...C.ink)
  doc.setCharSpace(0)
  const tl = doc.splitTextToSize(title, cw)
  doc.text(tl, ml, y)
  y += tl.length * 9 + 3

  doc.setDrawColor(...C.rule)
  doc.setLineWidth(0.3)
  doc.line(ml, y, pw-mr, y)
  y += 8.5

  const article = document.querySelector('article')
  if (article) renderBody(doc, article, pw, ph, ml, mr, cw, y)

  drawFooters(doc, pw, ph, ml, mr)
  doc.save('RSG-IOC-' + slug + '.pdf')
}

export async function generateFullPDF() {
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' })
  registerInter(doc)
  const pw=210, ph=297, ml=20, mr=20, cw=pw-ml-mr

  // Cover
  drawHeader(doc, pw, ml, mr)
  doc.setFont('Inter','bold')
  doc.setFontSize(30)
  doc.setTextColor(...C.ink)
  doc.setCharSpace(0)
  doc.text('RSG IOC', ml, 75)
  doc.setFont('Inter','normal')
  doc.setFontSize(16)
  doc.setTextColor(...C.muted)
  doc.text('Platform Documentation', ml, 87)
  doc.setFontSize(10)
  doc.setTextColor(...C.muted)
  doc.text('Version 1.0  ·  Vizzio', ml, 97)
  doc.setDrawColor(...C.rule)
  doc.setLineWidth(0.3)
  doc.line(ml, 105, pw-mr, 105)
  doc.setFontSize(8.5)
  doc.setTextColor(...C.muted)
  doc.text('Confidential · For Authorized Stakeholders Only', ml, 113)

  // Collect slugs from sidebar, ordered by chapter number to match the web
  const navLinks = Array.from(document.querySelectorAll('aside a[href^="/docs/"]')) as HTMLAnchorElement[]
  const slugs = [...new Set(
    navLinks
      .map(a => (a.getAttribute('href') || '').replace('/docs/', '').split('#')[0].split('?')[0])
      .filter(Boolean)
  )].sort((a, b) => {
    const na = parseInt(a, 10), nb = parseInt(b, 10)
    return (isNaN(na) ? 999 : na) - (isNaN(nb) ? 999 : nb)
  })

  for (const slug of slugs) {
    const res = await fetch('/docs/' + slug)
    const html = await res.text()
    const parsed = new DOMParser().parseFromString(html, 'text/html')
    const article = parsed.querySelector('article')
    const h1 = parsed.querySelector('h1')
    const sectionEl = parsed.querySelector('[class*="uppercase"]')
    if (!article) continue

    doc.addPage()
    drawHeader(doc, pw, ml, mr)
    let y = 24

    const sectionText = sectionEl?.textContent?.trim() || ''
    const titleText = h1?.textContent?.trim() || slug

    if (sectionText) {
      doc.setFont('Inter','normal')
      doc.setFontSize(7.5)
      doc.setTextColor(...C.muted)
      doc.setCharSpace(0)
      doc.text(sectionText.toUpperCase(), ml, y)
      y += 7
    }

    doc.setFont('Inter','bold')
    doc.setFontSize(20)
    doc.setTextColor(...C.ink)
    doc.setCharSpace(0)
    const tl = doc.splitTextToSize(titleText, cw)
    doc.text(tl, ml, y)
    y += tl.length * 9 + 4
    doc.setDrawColor(...C.rule)
    doc.setLineWidth(0.3)
    doc.line(ml, y, pw-mr, y)
    y += 10

    renderBody(doc, article, pw, ph, ml, mr, cw, y)
  }

  drawFooters(doc, pw, ph, ml, mr)
  doc.save('RSG-IOC-Platform-Documentation.pdf')
}
