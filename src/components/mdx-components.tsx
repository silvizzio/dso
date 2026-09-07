import { type MDXComponents } from 'mdx/types'

function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: 'note' | 'warning' | 'tip' | 'admin'
  title?: string
  children: React.ReactNode
}) {
  const styles = {
    note: {
      wrapper: 'bg-blue-50 border-blue-200 text-blue-900',
      label: 'text-blue-700',
      icon: 'ℹ',
    },
    warning: {
      wrapper: 'bg-amber-50 border-amber-200 text-amber-900',
      label: 'text-amber-700',
      icon: '⚠',
    },
    tip: {
      wrapper: 'bg-zinc-50 border-zinc-200 text-zinc-700',
      label: 'text-zinc-500',
      icon: '💡',
    },
    admin: {
      wrapper: 'bg-red-50 border-red-200 text-red-900',
      label: 'text-red-700',
      icon: '🔒',
    },
  }

  const s = styles[type]

  return (
    <div className={`not-prose my-4 rounded-md border-l-4 px-4 py-3 text-sm leading-relaxed ${s.wrapper}`}>
      {title && (
        <p className={`font-medium text-xs uppercase tracking-wide mb-1 ${s.label}`}>
          {s.icon} {title}
        </p>
      )}
      <div className="text-[13px] leading-relaxed">{children}</div>
    </div>
  )
}

function ScreenshotPlaceholder({ caption }: { caption: string }) {
  return (
    <div className="not-prose my-4 flex flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="mb-2 text-zinc-400"
      >
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <p className="text-xs font-medium text-zinc-500 mb-1">Screenshot placeholder</p>
      <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">{caption}</p>
    </div>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="not-prose inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-zinc-100 border border-zinc-300 rounded text-zinc-700">
      {children}
    </kbd>
  )
}

function StepList({ children }: { children: React.ReactNode }) {
  return (
    <ol className="not-prose my-4 flex flex-col gap-0 border border-border rounded-md overflow-hidden">
      {children}
    </ol>
  )
}

function Step({
  number,
  children,
}: {
  number: number
  children: React.ReactNode
}) {
  return (
    <li className="not-prose flex gap-4 px-4 py-3 border-b border-border last:border-b-0 bg-background text-sm leading-relaxed">
      <span className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-muted border border-border flex items-center justify-center text-[11px] font-medium text-muted-foreground">
        {number}
      </span>
      <div className="flex-1 text-[13px] text-foreground leading-relaxed">{children}</div>
    </li>
  )
}

function ReferenceTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: string[][]
}) {
  return (
    <div className="not-prose my-4 overflow-hidden rounded-md border border-border text-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/50">
            {headers.map(h => (
              <th
                key={h}
                className="px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground border-b border-border"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-b-0">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-3 py-2 text-[13px] ${j === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DetectionClassTable() {
  const classes = [
    { layer: 'Buildings', detects: 'Completed structures with defined rooflines', color: 'Blue', hex: '#4A90E2' },
    { layer: 'Buildings Under Construction', detects: 'Buildings actively under construction', color: 'Purple', hex: '#9B59B6' },
    { layer: 'Greenery', detects: 'Vegetation cover — parks, tree canopy, agricultural land', color: 'Green', hex: '#7ED321' },
    { layer: 'Roads', detects: 'New road construction, widening, or surface change', color: 'Red', hex: '#E84040' },
    { layer: 'Waste Management', detects: 'Construction waste, bare earth, demolition debris', color: 'Amber', hex: '#F5A623' },
  ]
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
      <thead>
        <tr>
          {['Layer', 'What it detects', 'Color', 'Hex'].map(h => (
            <th key={h} style={{ padding: '8px 12px', borderBottom: '1px solid hsl(var(--border))', textAlign: 'left', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--muted-foreground))' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {classes.map(row => (
          <tr key={row.layer}>
            <td style={{ padding: '8px 12px', borderBottom: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}>{row.layer}</td>
            <td style={{ padding: '8px 12px', borderBottom: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}>{row.detects}</td>
            <td style={{ padding: '8px 12px', borderBottom: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}>{row.color}</td>
            <td style={{ padding: '8px 12px', borderBottom: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: row.hex, display: 'inline-block', flexShrink: 0, border: '1px solid rgba(0,0,0,0.15)' }} />
                {row.hex}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


function CoreWorkflowDiagram() {
  const steps = [
    { label: 'App Store', sub: 'Select a pre-configured application', fill: '#F1EFE8', stroke: '#B4B2A9', tc: '#2C2C2A', sc: '#5F5E5A' },
    { label: 'Map Viewer', sub: 'Set city, district, and date range', fill: '#E1F5EE', stroke: '#5DCAA5', tc: '#085041', sc: '#0F6E56' },
    { label: 'Detection', sub: 'Enable layers and run detection', fill: '#EEEDFE', stroke: '#AFA9EC', tc: '#26215C', sc: '#534AB7' },
    { label: 'Results', sub: 'Review detections and analytics', fill: '#FAEEDA', stroke: '#EF9F27', tc: '#412402', sc: '#854F0B' },
    { label: 'Report', sub: 'Generate and download PDF or GeoJSON', fill: '#E1F5EE', stroke: '#5DCAA5', tc: '#085041', sc: '#0F6E56' },
  ]
  const boxH = 72
  const gap = 22
  const startY = 20
  const total = steps.length * boxH + (steps.length - 1) * gap + startY + 20
  return (
    <svg width="100%" viewBox={`0 0 680 ${total}`} style={{ display: 'block', margin: '24px auto' }}>
      <defs>
        <marker id="cw-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="#888780" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      {steps.map((s, i) => {
        const y = startY + i * (boxH + gap)
        const midY = y + boxH / 2
        return (
          <g key={i}>
            <rect x="190" y={y} width="300" height={boxH} rx="8" fill={s.fill} stroke={s.stroke} strokeWidth="0.5"/>
            <text x="340" y={y + 30} textAnchor="middle" style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 600, fill: s.tc }}>{s.label}</text>
            <text x="340" y={y + 48} textAnchor="middle" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fill: s.sc }}>{s.sub}</text>
            {i < steps.length - 1 && (
              <line x1="340" y1={y + boxH + 2} x2="340" y2={y + boxH + gap - 2} stroke="#B4B2A9" strokeWidth="1" markerEnd="url(#cw-arrow)"/>
            )}
          </g>
        )
      })}
    </svg>
  )
}


function ArchitectureDiagram() {
  const layerStyle = (bg: string, border: string): React.CSSProperties => ({
    borderRadius: '10px',
    border: `1px solid ${border}`,
    background: bg,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  })
  const cardStyle = (bg: string, border: string): React.CSSProperties => ({
    borderRadius: '6px',
    border: `1px solid ${border}`,
    background: bg,
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  })
  const titleStyle = (color: string): React.CSSProperties => ({
    fontWeight: 600,
    fontSize: '13px',
    color,
    textAlign: 'center',
    marginBottom: '2px',
  })
  const subtitleStyle = (color: string): React.CSSProperties => ({
    fontSize: '11px',
    color,
    textAlign: 'center',
    marginBottom: '16px',
  })
  const cardTitleStyle = (color: string): React.CSSProperties => ({
    fontWeight: 600,
    fontSize: '12px',
    color,
    textAlign: 'center',
  })
  const cardSubStyle = (color: string): React.CSSProperties => ({
    fontSize: '11px',
    color,
    textAlign: 'center',
  })
  const connector: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '6px 0',
    color: 'hsl(var(--muted-foreground))',
    fontSize: '18px',
    lineHeight: 1,
  }
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', margin: '24px 0', display: 'flex', flexDirection: 'column', breakBefore: 'page' } as React.CSSProperties}>

      {/* Applications */}
      <div style={layerStyle('#E1F5EE', '#5DCAA5')}>
        <div style={titleStyle('#085041')}>Applications</div>
        <div style={subtitleStyle('#0F6E56')}>Seven pre-configured detection tools — select one to begin a session</div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' as const }}>
          {['Buildings Under Construction', 'Green Spaces', 'Road Network'].map(n => (
            <div key={n} style={cardStyle('#9FE1CB', '#1D9E75')}>
              <div style={cardTitleStyle('#04342C')}>{n}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' as const }}>
          {['Waste Management', 'White Land Infringements', 'Building Footprints'].map(n => (
            <div key={n} style={cardStyle('#9FE1CB', '#1D9E75')}>
              <div style={cardTitleStyle('#04342C')}>{n}</div>
            </div>
          ))}
        </div>
        <div style={{ ...cardStyle('#9FE1CB', '#1D9E75'), flex: 'none' }}>
          <div style={cardTitleStyle('#04342C')}>Multi Detection (Fast)</div>
          <div style={cardSubStyle('#04342C')}>Buildings Under Construction, Buildings, Green Spaces, Road Network, Waste Management</div>
        </div>
      </div>

      {/* Connector */}
      <div style={connector}>↓</div>

      {/* Analysis Environment */}
      <div style={layerStyle('#EEEDFE', '#AFA9EC')}>
        <div style={titleStyle('#26215C')}>Analysis Environment</div>
        <div style={subtitleStyle('#534AB7')}>Shared workspace — identical across all seven applications</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
          {[
            { title: 'Map Viewer', sub: 'Detection on map' },
            { title: 'Filters', sub: 'City, date, layers' },
            { title: 'Analytics', sub: 'Charts and stats' },
            { title: 'Reports', sub: 'PDF and GeoJSON' },
          ].map(item => (
            <div key={item.title} style={cardStyle('#CECBF6', '#7F77DD')}>
              <div style={cardTitleStyle('#26215C')}>{item.title}</div>
              <div style={cardSubStyle('#3C3489')}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Connector */}
      <div style={connector}>↓</div>

      {/* Platform Setup */}
      <div style={layerStyle('#E6F1FB', '#85B7EB')}>
        <div style={titleStyle('#042C53')}>Platform Setup</div>
        <div style={subtitleStyle('#185FA5')}>Administrative backend — pipeline operators and administrators</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
          {[
            { title: 'AI Pipelines', sub: 'Configure and run' },
            { title: 'Model Registry', sub: 'Mask2Former models' },
            { title: 'Processing Monitor', sub: 'Job status and logs' },
            { title: 'Satellite Imagery', sub: 'GeoTIFF ingestion' },
          ].map(item => (
            <div key={item.title} style={cardStyle('#B5D4F4', '#378ADD')}>
              <div style={cardTitleStyle('#042C53')}>{item.title}</div>
              <div style={cardSubStyle('#0C447C')}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}


export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    DetectionClassTable,

    ...components,
    Callout,
    ScreenshotPlaceholder,
    Kbd,
    StepList,
    Step,
    ReferenceTable,
  }
}



export { Callout, ScreenshotPlaceholder, Kbd, StepList, Step, ReferenceTable, DetectionClassTable, ArchitectureDiagram, CoreWorkflowDiagram }

