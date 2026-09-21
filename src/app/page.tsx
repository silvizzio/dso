import Link from 'next/link'
import DocHeader from '@/components/doc-header'
import { getSearchIndex } from '@/lib/search'
import { getDocsBySection } from '@/lib/docs'

// Sections and chapters come from content/docs, the same source as the sidebar.
// To add a chapter, add an MDX file. To change a cover, edit COVERS below.
const IMG = '/dso/api/img/'
const PLACEHOLDER = 'linear-gradient(135deg, hsl(var(--muted)) 0%, hsl(var(--background)) 100%)'

const COVERS: Record<string, string> = {
  '01-overview': '02-lod1.jpg',
  '02-interface-guide': '03-now-lod3-overview.jpg',
  '03-now': '03-now-lod3-available-technohub-4.jpg',
  '04-past': '04-past-lod3-2020.jpg',
  '05-future': '05-future-lod3-district-io.jpg',
  '06-enquiry': '06-future-lod3-district-io-1a-form.jpg',
  '07-demo-and-data': '03-now-lod3-available-technohub-4-building-level.jpg',
  '08-reference': '02-lod2-dso-1.jpg',
}

const SECTION_DESC: Record<string, string> = {
  'Getting Started': 'What the kiosk shows, what District IO offers, and how to use the screen.',
  'Explore the District': 'The district today, how it grew, and what is coming. Each state shows different data.',
  'Take Action': 'How to send an enquiry to the DSO commercial team.',
  'For DSO Teams': 'A demo path for the commercial team, and the source and status of every figure.',
  'Reference': 'Terms and area measures used in the kiosk and this guide.',
}

const cover = (slug: string) => (COVERS[slug] ? `url('${IMG}${COVERS[slug]}')` : PLACEHOLDER)
const heroBg = (slug: string) =>
  COVERS[slug]
    ? `linear-gradient(to top, hsl(var(--background)) 22%, hsl(var(--background) / 0.85) 38%, transparent 70%), url('${IMG}${COVERS[slug]}')`
    : PLACEHOLDER

const Arrow = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
)

export default function Home() {
  const searchDocs = getSearchIndex()
  const docsBySection = getDocsBySection()
  const all = Object.values(docsBySection).flat()
  const find = (slug: string) => all.find(d => d.slug === slug)

  const hero = ['01-overview', '05-future'].map(find).filter(Boolean) as NonNullable<ReturnType<typeof find>>[]
  const quick = ['01-overview', '05-future', '06-enquiry'].map(find).filter(Boolean) as NonNullable<ReturnType<typeof find>>[]

  return (
    <div style={{ minHeight: '100vh', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', display: 'flex', flexDirection: 'column', paddingTop: '48px' }}>
      <DocHeader searchDocs={searchDocs} />

      <main style={{ maxWidth: '920px', margin: '0 auto', padding: '48px 16px', flex: 1, width: '100%' }}>

        <div className="mb-12">
          <h1 className="text-3xl font-medium mb-3">Dubai Silicon Oasis (DSO)</h1>
          <p className="text-muted-foreground text-sm leading-relaxed" style={{ maxWidth: '680px' }}>
            The DSO Digital Twin shows what you can lease or buy at Dubai Silicon Oasis, when it will be ready, and what it contains. The main offer is District IO, a 595,300 m² mixed-use complex in five phases. You can send an enquiry from the same screen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {hero.map(doc => (
            <Link key={doc.slug} href={`/docs/${doc.slug}`} className="group block rounded-lg border border-border overflow-hidden transition-all hover:shadow-sm" style={{ position: 'relative', minHeight: '220px', backgroundImage: heroBg(doc.slug), backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={{ position: 'absolute', top: '14px', right: '14px', color: 'hsl(var(--foreground))', background: 'hsl(var(--background) / 0.85)', borderRadius: '999px', padding: '6px', display: 'flex' }}>
                <Arrow size={14} />
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px' }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}>{doc.section}</p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '4px' }}>{doc.title}</p>
                <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', lineHeight: 1.5 }}>{doc.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mb-8 p-4 sm:p-6 rounded-lg flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8" style={{ background: '#ECE3D5', border: '1px solid hsl(var(--border))' }}>
          <div>
            <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>Start here</p>
            <h2 className="text-base font-medium mb-1" style={{ color: 'hsl(var(--foreground))' }}>Looking to lease or buy?</h2>
            <p className="text-xs leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>Read the overview, see District IO in Future, then send an enquiry. DSO teams start with Demo and Data.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {quick.map(doc => (
              <Link key={doc.slug} href={`/docs/${doc.slug}`} className="inline-flex items-center gap-1.5 text-xs rounded-md px-3 py-1.5" style={{ background: 'transparent', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))', whiteSpace: 'nowrap' }}>
                {doc.title}
                <Arrow />
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-base font-medium">Browse by section</h2>
        </div>

        <div className="flex flex-col gap-4 mb-16">
          {Object.entries(docsBySection).map(([section, docs]) => (
            <div key={section} className="bg-background border border-border rounded-lg overflow-hidden">
              <div style={{ padding: '16px 20px 20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--foreground))' }}>{section}</h3>
                {SECTION_DESC[section] && (
                  <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', lineHeight: 1.5, marginBottom: '12px' }}>{SECTION_DESC[section]}</p>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  {docs.map(doc => (
                    <Link key={doc.slug} href={`/docs/${doc.slug}`} className="group block rounded-md border border-border overflow-hidden transition-all hover:border-foreground/20 hover:shadow-sm" style={{ background: 'hsl(var(--background))' }}>
                      <div style={{ height: '112px', backgroundImage: cover(doc.slug), backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <div style={{ padding: '12px 14px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: '2px', lineHeight: 1.3 }}>
                          <span style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 400, marginRight: '6px', fontVariantNumeric: 'tabular-nums' }}>{String(doc.order).padStart(2, '0')}</span>
                          {doc.title}
                        </p>
                        {doc.description && (
                          <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', lineHeight: 1.4 }}>{doc.description}</p>
                        )}
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
