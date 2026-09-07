import { getDocsBySection } from '@/lib/docs'
import { getSearchIndex } from '@/lib/search'
import Sidebar from '@/components/sidebar'
import DocHeader from '@/components/doc-header'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  const docsBySection = getDocsBySection()
  const searchDocs = getSearchIndex()

  return (
    <div style={{ minHeight: '100vh', background: 'hsl(var(--background))' }}>

      {/* Top nav */}
      <DocHeader searchDocs={searchDocs} />

      {/* Body below header */}
      <div className='pt-[96px] sm:pt-[48px]' style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: '1440px', position: 'relative' }}>
          <Sidebar docsBySection={docsBySection} />
          <main className='lg:ml-[224px] lg:mr-[224px] min-w-0 overflow-x-hidden' style={{ minHeight: '100vh', padding: '0 16px 48px' }}>
            {children}
          </main>
        </div>
      </div>

    </div>
  )
}
