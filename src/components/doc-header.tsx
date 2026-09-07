import Link from 'next/link'
import MobileNav from '@/components/mobile-nav'
import SearchBox from '@/components/search-box'
import FullGuideButton from '@/components/full-guide-button'
import { getDocsBySection } from '@/lib/docs'
import { getLastUpdated } from '@/lib/last-updated'
import type { SearchDoc } from '@/lib/search'

type Props = {
  searchDocs: SearchDoc[]
}

export default function DocHeader({ searchDocs }: Props) {
  const docsBySection = getDocsBySection()
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, borderBottom: '1px solid hsl(var(--border))', background: 'hsl(var(--background))', zIndex: 50 }}>
      <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MobileNav docsBySection={docsBySection} lastUpdated={getLastUpdated()} />
            <img src="/project/logo.svg" alt="Project" width={20} height={20} style={{ display: 'block' }} />
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Project</span>
            <span style={{ color: 'hsl(var(--muted-foreground))', opacity: 0.4 }}>/</span>
            <Link href="/" style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', textDecoration: 'none' }}>Documentation</Link>
          </div>
          <div className="hidden sm:flex" style={{ alignItems: 'center', gap: '8px' }}>
            <SearchBox docs={searchDocs} />
            <FullGuideButton />
          </div>
          <div className="sm:hidden">
            <FullGuideButton />
          </div>
        </div>
        <div className="sm:hidden" style={{ paddingBottom: '8px', width: '100%' }}>
          <div style={{ width: '100%' }}><SearchBox docs={searchDocs} /></div>
        </div>
      </div>
    </header>
  )
}
