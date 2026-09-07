'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type DocMeta } from '@/lib/docs'

import { Badge } from '@/components/ui/badge'

type Props = {
  docsBySection: Record<string, DocMeta[]>
  lastUpdated?: { full: string; monthYear: string }
}

export default function Sidebar({ docsBySection, lastUpdated }: Props) {
  const pathname = usePathname()

  return (
    <aside
      className="no-print hidden lg:block"
      style={{ position: 'absolute', top: 0, left: 0, width: '224px', height: '100%' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', borderRight: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }} className="sidebar-scroll">
        <div style={{ padding: '16px 0 16px', borderBottom: '1px solid hsl(var(--border))', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }}>
            <img src="/dso/logo.svg" alt="Project" width={24} height={24} style={{ flexShrink: 0, display: 'block' }} />
            <div>
              <p style={{ fontSize: '12px', fontWeight: 500, lineHeight: 1.3 }}>Project</p>
              <p style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>v1.0 · {lastUpdated?.monthYear ?? new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        <nav style={{ paddingBottom: '16px' }}>
          {Object.entries(docsBySection).map(([section, docs]) => (
            <div key={section} style={{ marginBottom: '4px' }}>
              <p style={{ padding: '6px 16px', fontSize: '10px', fontWeight: 500, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {section}
              </p>
              {docs.map(doc => {
                const isActive = pathname === `/docs/${doc.slug}`
                return (
                  <Link
                    key={doc.slug}
                    href={`/docs/${doc.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: isActive ? '6px 16px 6px 14px' : '6px 16px',
                      fontSize: '13px',
                      borderLeft: isActive ? '2px solid hsl(var(--foreground))' : '2px solid transparent',
                      color: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                      fontWeight: isActive ? 500 : 400,
                      textDecoration: 'none',
                      background: isActive ? 'hsl(var(--background))' : 'transparent',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', opacity: 0.6, minWidth: '16px', fontVariantNumeric: 'tabular-nums' }}>
                      {doc.order < 10 ? `0${doc.order}` : doc.order >= 98 ? '—' : doc.order}
                    </span>
                    <span style={{ flex: 1, lineHeight: 1.4 }}>{doc.title}</span>
                    {doc.role === 'admin' && (
                      <Badge variant="outline" style={{ fontSize: '9px', padding: '0 4px', height: '16px' }}>
                        admin
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: '12px 16px', borderTop: '1px solid hsl(var(--border))' }}>
          <p style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground))' }}>Confidential — Authorized Stakeholders Only</p>
        </div>
      </div>
    </aside>
  )
}
