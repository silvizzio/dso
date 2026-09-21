import Link from 'next/link'
import DocHeader from '@/components/doc-header'
import { getSearchIndex } from '@/lib/search'
import { getDocsBySection, getDoc } from '@/lib/docs'

// Layout and styles are the template's. Only content changes per project.
// Sections and chapters come from content/docs, the same source as the sidebar.
const PLACEHOLDER = 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--background)) 100%)'
const IMG = '/dso/api/img/'

// Hero cards use the first image of each chapter, read from its MDX file.
// HERO_FADE puts a white fade behind the card text so it stays readable.
const HERO_FADE = true
const firstImage = (slug: string) => {
  const m = getDoc(slug)?.content.match(/!\[[^\]]*\]\(([^)]+)\)/)
  return m ? m[1] : null
}
const heroBg = (slug: string) => {
  const src = firstImage(slug)
  if (!src) return PLACEHOLDER
  const fade = 'linear-gradient(to top, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.88) 36%, rgba(255,255,255,0) 72%), '
  return `${HERO_FADE ? fade : ''}url('${src}')`
}

// Section card covers. A chapter without an entry falls back to its first image.
const COVERS: Record<string, string> = {
  '02-interface-guide': '04-now-lod3-overview.jpg',
  '13-check-the-delivery-record': '05-past-lod3-2020.jpg',
}
const cover = (slug: string) => {
  if (COVERS[slug]) return `url('${IMG}${COVERS[slug]}')`
  const src = firstImage(slug)
  return src ? `url('${src}')` : PLACEHOLDER
}

// Sections shown under Browse by section. Reference is linked from the start box instead.
const SECTION_DESC: Record<string, string> = {
  'Getting Started': 'What the kiosk shows, what District IO offers, and how to use the screen.',
  'Future': 'District IO before it is built: what it offers, its phases, its buildings, and how to enquire.',
  'Now': 'What exists today: space to lease, building performance, leased buildings, live media and tours.',
  'Past': 'How the district grew, and the record of what DSO has delivered.',
}

// DSO brand primary (dso.ae). District IO brand blue (districtio.com) is #006fff.
const DSO_INK = '#194167'

export default function Home() {
  const searchDocs = getSearchIndex()
  const docsBySection = getDocsBySection()
  const all = Object.values(docsBySection).flat()
  const pick = (slugs: string[]) => slugs.map(s => all.find(d => d.slug === s)).filter((d): d is NonNullable<typeof d> => Boolean(d))

  const heroDocs = pick(['01-overview', '03-explore-district-io'])
  const quickDocs = pick(['01-overview', '02-interface-guide', '14-reference'])
  const sections = Object.entries(docsBySection)
    .filter(([title]) => title in SECTION_DESC)
    .map(([title, docs]) => ({
      title,
      desc: SECTION_DESC[title],
      links: docs.map(d => ({ label: d.title, desc: d.description ?? '', href: `/docs/${d.slug}`, slug: d.slug })),
    }))

  return (
    <div style={{ minHeight: '100vh', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', display: 'flex', flexDirection: 'column', paddingTop: '48px' }}>
      <DocHeader searchDocs={searchDocs} />

      <main style={{ maxWidth: '920px', margin: '0 auto', padding: '48px 16px', flex: 1, width: '100%' }}>

        <div className="mb-12">
          <h1 className="text-3xl font-medium mb-2">Dubai Silicon Oasis (DSO)</h1>
          <p className="text-muted-foreground text-sm">
            See what you can lease or buy at Dubai Silicon Oasis, when it will be ready, and what it contains. The main offer is District IO, a 595,300 m² mixed-use complex in five phases.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {heroDocs.map(doc => (
            <Link key={doc.slug} href={`/docs/${doc.slug}`} className="group block rounded-lg border border-border overflow-hidden transition-colors" style={{ position: 'relative', minHeight: '180px', backgroundImage: heroBg(doc.slug), backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px' }}>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '4px' }}>{doc.title}</p>
                <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', lineHeight: 1.5 }}>{doc.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mb-8 p-4 sm:p-6 rounded-lg flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8" style={{ background: DSO_INK, border: `1px solid ${DSO_INK}` }}>
          <div>
            <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>Getting started</p>
            <h2 className="text-base font-medium mb-1" style={{ color: '#ffffff' }}>New to the project?</h2>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>Start with the overview, then read the interface guide. Terms and data sources are in the reference.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
            {quickDocs.map(doc => (
              <Link key={doc.slug} href={`/docs/${doc.slug}`} className="inline-flex items-center gap-1.5 text-xs rounded-md px-3 py-1.5" style={{ background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.32)', whiteSpace: 'nowrap' }}>
                {doc.title}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-base font-medium">Browse by section</h2>
        </div>

        <div className="flex flex-col gap-4 mb-16">
          {sections.map((section) => (
            <div key={section.title} className="bg-background border border-border rounded-lg overflow-hidden">
              <div style={{ padding: '16px 20px 20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--foreground))' }}>{section.title}</h3>
                <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', lineHeight: 1.5, marginBottom: '12px' }}>{section.desc}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  {section.links.map((link) => (
                    <Link key={link.href + link.label} href={link.href} className="group block rounded-md border border-border overflow-hidden transition-all hover:border-foreground/20 hover:shadow-sm" style={{ background: 'hsl(var(--background))' }}>
                      <div style={{ height: '84px', backgroundImage: cover(link.slug), backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <div style={{ padding: '12px 14px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '2px', lineHeight: 1.3 }}>{link.label}</p>
                        <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', lineHeight: 1.4 }}>{link.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      <footer style={{ borderTop: '1px solid hsl(var(--border))', padding: '16px', maxWidth: '1440px', width: '100%', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>Dubai Silicon Oasis (DSO)</p>
        <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>Vizzio Confidential</p>
      </footer>
    </div>
  )
}
