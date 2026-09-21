// Abstract diagram of the DSO Digital Twin platform.
// Use in MDX: <PlatformDiagram focus="all" />, or focus="future" | "now" | "past"
// to highlight one timeline section. String props only (array props break MDX).
// Keep every closing ">" on the same line as the last attribute.

type State = 'future' | 'now' | 'past'
type Focus = State | 'all'
type Task = { label: string; slug: string }
type StateDef = { key: State; label: string; badge?: string; question: string; color: string; data: string; tasks: Task[] }

const DOCS = '/dso/docs/'
const DSO_NAVY = '#194167'
const PANEL_BG = '#EEF4FB'
const PANEL_BORDER = '#D6E4F3'
const PANEL_LINE = '#B9CDE3'
const PANEL_LABEL = '#4A6A8F'

const STATES: StateDef[] = [
  {
    key: 'future',
    label: 'Future',
    badge: 'Default',
    question: 'What is coming, and when?',
    color: '#006fff',
    data: 'Concept design report, projected',
    tasks: [
      { label: 'Explore District IO', slug: '04-explore-district-io' },
      { label: 'Compare the phases', slug: '05-compare-the-phases' },
      { label: 'Drill down to a building', slug: '06-drill-down-to-a-building' },
      { label: 'Enquire off-plan', slug: '07-enquire-off-plan' },
    ],
  },
  {
    key: 'now',
    label: 'Now',
    question: 'What is here, and what can I lease?',
    color: DSO_NAVY,
    data: 'Leasing feed, BMS and CCTV, live',
    tasks: [
      { label: 'Find available space', slug: '09-find-available-space' },
      { label: 'Check building performance', slug: '10-check-building-performance' },
      { label: 'Explore leased buildings', slug: '11-explore-leased-buildings' },
      { label: 'Watch cameras and videos', slug: '12-watch-cameras-and-videos' },
      { label: 'Walk the street and interior', slug: '13-walk-the-street-and-interior' },
    ],
  },
  {
    key: 'past',
    label: 'Past',
    question: 'Has DSO delivered before?',
    color: '#4a5a6a',
    data: 'Archived satellite imagery, historic',
    tasks: [
      { label: 'Step through the archive', slug: '15-step-through-the-archive' },
      { label: 'Check the delivery record', slug: '16-check-the-delivery-record' },
    ],
  },
]

const LODS = [
  { lod: 'LOD 1', name: 'District' },
  { lod: 'LOD 2', name: 'Core' },
  { lod: 'LOD 3', name: 'Site and building' },
]

const muted = 'hsl(var(--muted-foreground))'
const border = 'hsl(var(--border))'
const fg = 'hsl(var(--foreground))'
const bg = 'hsl(var(--background))'

function Connector({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0' }}>
      <div style={{ width: '1px', height: '12px', background: PANEL_LINE }} />
      <span style={{ fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: muted, padding: '4px 0' }}>{label}</span>
      <div style={{ width: '1px', height: '12px', background: PANEL_LINE }} />
      <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke={muted} strokeWidth="1.2" /></svg>
    </div>
  )
}

function TaskLink({ task, index, color }: { task: Task; index: number; color: string }) {
  const style = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: fg, textDecoration: 'none', border: `1px solid ${border}`, borderRadius: '6px', padding: '6px 8px', background: bg }
  return (
    <li>
      <a href={DOCS + task.slug} style={style}>
        <span style={{ fontSize: '10px', color, fontVariantNumeric: 'tabular-nums', minWidth: '12px' }}>{index + 1}</span>
        <span>{task.label}</span>
      </a>
    </li>
  )
}

function StateCard({ s, focus }: { s: StateDef; focus: Focus }) {
  const on = focus === 'all' || focus === s.key
  const hi = focus === s.key
  const card = {
    border: `1px solid ${hi ? s.color : border}`,
    boxShadow: hi ? `0 0 0 3px ${s.color}1f` : 'none',
    background: '#ffffff',
    borderRadius: '10px',
    padding: '14px',
    opacity: on ? 1 : 0.45,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  }
  return (
    <div style={card}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: s.color, flexShrink: 0 }} />
          <p style={{ fontSize: '14px', fontWeight: 600, color: fg, margin: 0 }}>{s.label}</p>
          {s.badge ? <span style={{ fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase', color: s.color, border: `1px solid ${s.color}`, borderRadius: '999px', padding: '1px 6px' }}>{s.badge}</span> : null}
        </div>
        <p style={{ fontSize: '11px', color: muted, margin: '4px 0 0', lineHeight: 1.4 }}>{s.question}</p>
      </div>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {s.tasks.map((t, i) => <TaskLink key={t.slug} task={t} index={i} color={s.color} />)}
      </ol>
      <p style={{ fontSize: '10px', color: muted, margin: 0, paddingTop: '8px', borderTop: `1px solid ${border}`, lineHeight: 1.4 }}>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '6px' }}>Data</span>{s.data}
      </p>
    </div>
  )
}

export function PlatformDiagram({ focus = 'all' }: { focus?: Focus }) {
  const current = STATES.find(s => s.key === focus)
  const caption = current
    ? `Where ${current.label} sits in the platform. The highlighted column is this section. Each task links to its chapter.`
    : 'How the platform fits together: one 3D map, three timeline states, one action. Each task links to its chapter.'

  return (
    <figure className="not-prose" style={{ margin: '28px 0 36px', fontFamily: 'Inter, sans-serif', background: PANEL_BG, border: `1px solid ${PANEL_BORDER}`, borderRadius: '14px', padding: '18px 18px 14px' }}>
      <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: PANEL_LABEL, margin: '0 0 12px' }}>How the platform works</p>
      <div style={{ background: DSO_NAVY, borderRadius: '10px', padding: '16px 18px', color: '#ffffff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>DSO Digital Twin</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: '2px 0 0' }}>One 3D map of Dubai Silicon Oasis on a 55 inch touch kiosk</p>
          </div>
          <span style={{ fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Levels of detail</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
          {LODS.map(l => (
            <div key={l.lod} style={{ border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '8px 10px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{l.lod}</p>
              <p style={{ fontSize: '12px', fontWeight: 500, margin: '2px 0 0' }}>{l.name}</p>
            </div>
          ))}
        </div>
      </div>

      <Connector label="The timeline sets what the map shows" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        {STATES.map(s => <StateCard key={s.key} s={s} focus={focus} />)}
      </div>

      <Connector label="Every state ends in one action" />

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px', border: `1px solid ${DSO_NAVY}`, borderRadius: '10px', padding: '12px 16px', background: '#ffffff' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: DSO_NAVY }}>Enquire</span>
        <svg width="28" height="10" viewBox="0 0 28 10" aria-hidden="true"><path d="M0 5h25M21 1l4 4-4 4" fill="none" stroke={DSO_NAVY} strokeWidth="1.2" /></svg>
        <span style={{ fontSize: '13px', color: fg }}>DSO commercial team</span>
        <span style={{ fontSize: '11px', color: muted, flexBasis: '100%', textAlign: 'center' }}>From any property, phase or building, in every state</span>
      </div>

      <figcaption style={{ marginTop: '10px', fontSize: '11px', color: muted, textAlign: 'center', lineHeight: 1.5 }}>{caption}</figcaption>
    </figure>
  )
}
