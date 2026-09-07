import { getDocsBySection } from '@/lib/docs'
import { getLastUpdated } from '@/lib/last-updated'
import Sidebar from '@/components/sidebar'

export default function DocLayout({ children }: { children: React.ReactNode }) {
  const docsBySection = getDocsBySection()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar docsBySection={docsBySection} lastUpdated={getLastUpdated()} />
      <main className="ml-56 mr-56 min-h-screen">
        {children}
      </main>
    </div>
  )
}
