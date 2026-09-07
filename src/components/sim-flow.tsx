import type { CSSProperties, ReactNode } from 'react'

const N = { bg: '#F1F2F4', border: '#D7DAE0', cardBg: '#E4E7EC', cardBorder: '#C4C9D2', text: '#374151', muted: '#6b7280' }
const SETUP = { bg: '#EEEDFE', border: '#C7C2F0', text: '#26215C' }
const RUN = { bg: '#6D5BD0', text: '#FFFFFF' }
const STOP = { bg: '#DC2626', text: '#FFFFFF' }
const TWIN = { bg: '#E6F1FB', border: '#A9CBEC' }
const WARN = { bg: '#FAEEDA', border: '#EECDA0', text: '#854F0B' }
const IDLE = { bg: '#F1F2F4', border: '#D7DAE0', text: '#6b7280' }
const MAP_PLAIN = '#EAF1F4'
const MAP_HEAT = 'radial-gradient(circle at 36% 40%, rgba(232,64,64,0.42), rgba(232,64,64,0) 44%), radial-gradient(circle at 64% 62%, rgba(245,166,35,0.40), rgba(245,166,35,0) 48%), #EAF1F4'
const LIB = { bg: '#FFFFFF', border: '#C4C9D2', text: '#374151' }
const STEP = { bg: '#EEEDFE', border: '#C7C2F0', text: '#26215C' }
const VISA = { bg: '#E2F3F4', border: '#A6D5DA', text: '#134a52' }
const VISB = { bg: '#E1F5EE', border: '#A7DDC9', text: '#0F6E56' }
const ENG = { bg: '#FAEEDA', border: '#EECDA0', text: '#854F0B' }

const rightWrap: CSSProperties = { flex: '0 0 30%', background: '#FBFCFD', border: `1px solid ${N.cardBorder}`, borderRadius: '8px', padding: '10px' }

function Tag({ label }: { label: string }) {
  return <span style={{ display: 'inline-block', background: '#FFFFFF', border: `1px solid ${N.cardBorder}`, color: N.text, borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '3px 9px' }}>{label}</span>
}
function Label({ text }: { text: string }) {
  return <div style={{ fontSize: '11px', fontWeight: 700, color: N.text, marginBottom: '2px' }}>{text}</div>
}
function Pill({ text }: { text: string }) {
  return <div style={{ background: '#FFFFFF', border: `1px solid ${N.cardBorder}`, borderRadius: '6px', padding: '6px 9px', fontSize: '11px', color: N.text, marginTop: '6px' }}>{text}</div>
}
function Banner({ tone, text }: { tone: { bg: string; border: string; text: string }; text: string }) {
  return <div style={{ background: tone.bg, border: `1px solid ${tone.border}`, color: tone.text, fontSize: '11px', fontWeight: 700, borderRadius: '6px', padding: '6px 8px', marginTop: '4px' }}>{text}</div>
}
function ResponseRow({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', border: `1px solid ${N.cardBorder}`, borderRadius: '6px', padding: '6px 8px', marginTop: '6px', fontSize: '11px', color: muted ? N.muted : N.text }}>
      <span style={{ width: '12px', height: '12px', borderRadius: '999px', border: `1.5px solid ${N.cardBorder}`, flex: '0 0 auto' }} />
      <span>{label}</span>
    </div>
  )
}
function SetupCol({ cta }: { cta: string }) {
  return (
    <div style={{ flex: '0 0 27%', background: SETUP.bg, border: `1px solid ${SETUP.border}`, borderRadius: '8px', padding: '10px' }}>
      <Label text="Setup" />
      {['Simulation', 'Scenario preset', 'Scenario inputs', 'Layers shown'].map((x, i) => <Pill key={i} text={x} />)}
      <div style={{ background: cta === 'Stop Simulation' ? STOP.bg : RUN.bg, color: RUN.text, textAlign: 'center', fontSize: '11px', fontWeight: 700, borderRadius: '6px', padding: '8px', marginTop: '8px' }}>{cta}</div>
    </div>
  )
}
function TwinCol({ sub, mapBg, caption }: { sub: string; mapBg: string; caption: string }) {
  return (
    <div style={{ flex: 1, background: TWIN.bg, border: `1px solid ${TWIN.border}`, borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column' }}>
      <Label text="Digital twin" />
      <div style={{ fontSize: '10px', color: N.muted, marginBottom: '8px' }}>{sub}</div>
      <div style={{ flex: 1, minHeight: '120px', borderRadius: '6px', border: `1px dashed ${TWIN.border}`, background: mapBg, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '10px', fontSize: '11px', fontWeight: 700, color: '#42607e' }}>{caption}</div>
    </div>
  )
}
function RightDefault() {
  return (
    <div style={rightWrap}>
      <Label text="Forecast" />
      <Banner tone={IDLE} text="Not running" />
      <Pill text="Hero metric, idle" />
      <Pill text="KPI, idle" />
      <div style={{ fontSize: '10px', color: N.muted, marginTop: '6px' }}>Set the scenario, then Run</div>
    </div>
  )
}
function RightRunning() {
  return (
    <div style={rightWrap}>
      <Label text="Forecast" />
      <Banner tone={WARN} text="Forecasted outcome" />
      <Pill text="Hero metric" />
      <Pill text="Forecasted KPI" />
      <ResponseRow label="Recommended response" />
      <ResponseRow label="Do nothing" muted />
    </div>
  )
}
function StateCard({ tag, children }: { tag: string; children: ReactNode }) {
  return (
    <div style={{ background: '#FFFFFF', border: `1px solid ${N.cardBorder}`, borderRadius: '10px', padding: '12px' }}>
      <Tag label={tag} />
      <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch', marginTop: '10px' }}>{children}</div>
    </div>
  )
}
export function SimState({ state }: { state: 'default' | 'running' }) {
  const cfg = {
    default: { tag: 'Default · Setup', sub: 'live, no forecast yet', bg: MAP_PLAIN, cap: 'live twin', right: <RightDefault />, cta: 'Run Simulation' },
    running: { tag: 'Running · Forecast', sub: 'forecast visualization', bg: MAP_HEAT, cap: 'wind field, coastal overlay, heatmap', right: <RightRunning />, cta: 'Stop Simulation' },
  }[state]
  return (
    <div style={{ margin: '20px 0', fontSize: '13px', lineHeight: 1.4 }}>
      <StateCard tag={cfg.tag}>
        <SetupCol cta={cfg.cta} />
        <TwinCol sub={cfg.sub} mapBg={cfg.bg} caption={cfg.cap} />
        {cfg.right}
      </StateCard>
    </div>
  )
}
function SrcBox({ tone, title, sub }: { tone: { bg: string; border: string; text: string }; title: string; sub: string }) {
  return (
    <div style={{ background: tone.bg, border: `1px solid ${tone.border}`, borderRadius: '8px', padding: '8px 10px', marginTop: '8px' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: tone.text }}>{title}</div>
      <div style={{ fontSize: '10px', color: N.muted, marginTop: '2px' }}>{sub}</div>
    </div>
  )
}
function SrcArrow() {
  return <div style={{ textAlign: 'center', color: '#9aa0a6', fontSize: '14px', margin: '4px 0' }}>↓</div>
}
function StepBox({ tone, text, bold }: { tone: { bg: string; border: string; text: string }; text: string; bold?: boolean }) {
  return <div style={{ background: tone.bg, border: `1px solid ${tone.border}`, borderRadius: '6px', padding: '7px 9px', fontSize: '11px', fontWeight: bold ? 700 : 400, color: tone.text, marginTop: '4px' }}>{text}</div>
}
function ProvLabel({ text }: { text: string }) {
  return <div style={{ fontSize: '10px', fontWeight: 700, color: '#1f2937', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>{text}</div>
}
function EngLine({ text }: { text: string }) {
  return <div style={{ fontSize: '10px', color: N.muted, marginTop: '4px', paddingLeft: '2px' }}>{text}</div>
}
export function SimSources() {
  return (
    <div style={{ margin: '24px 0', fontSize: '13px', lineHeight: 1.4 }}>
      <div style={{ background: N.bg, border: `1px solid ${N.border}`, borderRadius: '14px', padding: '18px', display: 'flex', gap: '0', alignItems: 'stretch', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px', minWidth: '220px', borderRight: `1px dashed ${N.cardBorder}`, paddingRight: '18px' }}>
          <ProvLabel text="Modeled upstream (outside the twin)" />
          <SrcBox tone={ENG} title="Specialist engines" sub="one per simulation, movement, climate, energy, coastal" />
          <EngLine text="MassMotion, PTV, Aimsun, Pathfinder, movement" />
          <EngLine text="WRF + CFD, wind" />
          <EngLine text="Ladybug Tools, thermal comfort" />
          <EngLine text="HOMER Pro, energy" />
          <EngLine text="ADCIRC, Delft3D, MIKE, SWAN, coastal" />
          <EngLine text="ReefMod-GBR, coral reef" />
          <SrcArrow />
          <SrcBox tone={LIB} title="Scenario presets and inputs" sub="the selectable controls" />
        </div>
        <div style={{ flex: '1 1 300px', minWidth: '260px', paddingLeft: '18px' }}>
          <ProvLabel text="Run and visualized in the IOC twin" />
          <StepBox tone={STEP} text="Set a scenario: preset, inputs, layers" />
          <SrcArrow />
          <StepBox tone={STEP} text="Run the forecast" bold />
          <SrcArrow />
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 120px', background: VISA.bg, border: `1px solid ${VISA.border}`, borderRadius: '6px', padding: '7px 9px', fontSize: '10px', color: VISA.text }}>Twin visualizes: heatmap, wind field, coastal overlay</div>
            <div style={{ flex: '1 1 120px', background: VISB.bg, border: `1px solid ${VISB.border}`, borderRadius: '6px', padding: '7px 9px', fontSize: '10px', color: VISB.text }}>Forecast and recommended responses</div>
          </div>
          <div style={{ fontSize: '10px', color: N.muted, marginTop: '8px' }}>Exploration only. Nothing is dispatched. The twin runs and shows the scenario; it does not author the model.</div>
        </div>
      </div>
    </div>
  )
}

// ── SimGrid ────────────────────────────────────────────────────────────────
// Domain → persona → sim matrix for the simulation overview.
// Each cell carries the sim name, its specialist engine, and the persona's lens
// (how that persona reads that sim). Data is lifted verbatim from the RSG
// Simulation tool config so the docs and the tool stay in lockstep.
//
// Drop this block into src/components/sim-flow.tsx and export SimGrid alongside
// SimState and SimSources. It uses only inline styles + CSS vars already in use
// elsewhere in that file, so no new imports.

type SimCell = { name: string; engine: string; lens: string }
type DomainKey = 'People' | 'Traffic' | 'Transport' | 'Environment'
type PersonaKey = 'GXM' | 'OPS' | 'ENV' | 'MO'

const PERSONA_LABEL: Record<PersonaKey, string> = {
  GXM: 'Guest Experience',
  OPS: 'Operations',
  ENV: 'Environment',
  MO: 'Marine Operations',
}

const DOMAIN_ORDER: DomainKey[] = ['People', 'Traffic', 'Transport', 'Environment']
const PERSONA_ORDER: PersonaKey[] = ['GXM', 'OPS', 'ENV', 'MO']

// grid[domain][persona] = SimCell[]
const ENGINE_URL: Record<string, string> = {
  'MassMotion': 'https://www.oasys-software.com/products/pedestrian-simulation-software/massmotion/',
  'Aimsun Next': 'https://www.aimsun.com/aimsun-next-transport-modelling-software/',
  'PTV Lines': 'https://www.ptvgroup.com/en-us/products/ptv-lines',
  'PTV Visum': 'https://www.ptvgroup.com/en-us/products/ptv-visum',
  'PTV Vissim': 'https://www.ptvgroup.com/en-us/products/ptv-vissim',
  'PTV Viswalk': 'https://www.ptvgroup.com/en-us/products/pedestrian-simulation-software-ptv-viswalk',
  'Ladybug Tools': 'https://www.ladybug.tools/',
  'HOMER Pro': 'https://www.homerenergy.com/products/pro/index.html',
  'SWAN': 'https://swanmodel.sourceforge.io/',
  'Delft3D': 'https://www.deltares.nl/en/software-and-data/products/delft3d-flexible-mesh-suite',
  'Delft3D-FLOW': 'https://www.deltares.nl/en/software-and-data/products/delft3d-flexible-mesh-suite',
  'Delft3D-WAQ': 'https://www.deltares.nl/en/software-and-data/products/delft3d-water-quality',
  'ReefMod-GBR + NOAA DHW': 'https://coralreefwatch.noaa.gov/',
  'WRF + CFD': 'https://www.mmm.ucar.edu/models/wrf',
}

const SIM_GRID: Record<DomainKey, Partial<Record<PersonaKey, SimCell[]>>> = {
  People: {
    GXM: [
      { name: 'Crowd', engine: 'MassMotion', lens: 'Crowd density at guest hotspots against the comfort line, with guests in the crush' },
      { name: 'Evacuation', engine: 'MassMotion', lens: 'Time to clear guests to muster against the target' },
      { name: 'Outdoor thermal comfort', engine: 'Ladybug Tools', lens: 'Outdoor heat stress across guest areas, with guests in discomfort' },
      { name: 'Accessibility', engine: 'PTV Visum', lens: 'Time to reach key amenities, with guests beyond easy reach' },
    ],
    OPS: [
      { name: 'Crowd', engine: 'MassMotion', lens: 'Crowd density against the safe-density line, with guests in the hotspot' },
      { name: 'Evacuation', engine: 'MassMotion', lens: 'Total clear time against target, with guests still to move' },
    ],
    ENV: [
      { name: 'Outdoor thermal comfort', engine: 'Ladybug Tools', lens: 'Site shade availability and the heat-stress footprint' },
    ],
  },
  Traffic: {
    GXM: [
      { name: 'Mobility', engine: 'Aimsun Next', lens: 'Mobility health as guests rise, with buses in service and EV charging in view' },
      { name: 'Shuttle network', engine: 'PTV Lines', lens: 'Shuttle line load and guest wait at stops' },
      { name: 'Drop-off forecourt', engine: 'PTV Vissim', lens: 'Drop-off queue at arrival, with vehicles at the curb' },
    ],
    OPS: [
      { name: 'Mobility', engine: 'Aimsun Next', lens: 'Mobility health, buses in service, and EV charging under guest load' },
      { name: 'Energy', engine: 'HOMER Pro', lens: 'Renewable share and EV charging load against the trigger' },
      { name: 'Shuttle network', engine: 'PTV Lines', lens: 'Shuttle line load and capacity against demand' },
      { name: 'Drop-off forecourt', engine: 'PTV Vissim', lens: 'Drop-off curb queue and approach spillback' },
    ],
    ENV: [
      { name: 'Energy', engine: 'HOMER Pro', lens: 'Renewable share against the diesel-backup trigger' },
    ],
    MO: [
      { name: 'Wave', engine: 'SWAN', lens: 'Significant wave height against the small-craft limit' },
      { name: 'Ocean current', engine: 'Delft3D-FLOW', lens: 'Drift risk on dive routes and vessel handling' },
    ],
  },
  Transport: {
    GXM: [
      { name: 'Wind', engine: 'WRF + CFD', lens: 'Wind on exposed decks and routes, with guests and vehicles exposed' },
      { name: 'Emissions and noise', engine: 'PTV Visum', lens: 'Noise across guest areas at peak traffic' },
      { name: 'Safety conflicts', engine: 'PTV Viswalk', lens: 'Pedestrian and vehicle conflict at guest crossings' },
    ],
    OPS: [
      { name: 'Wind', engine: 'WRF + CFD', lens: 'Exposed-deck and route wind, with guests and vehicles exposed' },
      { name: 'Flood and storm surge', engine: 'Delft3D', lens: 'Inundation reach, with guests and vehicles exposed on land' },
      { name: 'Safety conflicts', engine: 'PTV Viswalk', lens: 'Conflict points across crossings and shared spaces' },
    ],
    ENV: [
      { name: 'Flood and storm surge', engine: 'Delft3D', lens: 'Inundation reach, with guests and vehicles exposed on land' },
      { name: 'Emissions and noise', engine: 'PTV Visum', lens: 'Traffic emissions and noise footprint over the site' },
    ],
    MO: [
      { name: 'Flood and storm surge', engine: 'Delft3D', lens: 'Surge at the marina, with people and vehicles on the marina front' },
    ],
  },
  Environment: {
    ENV: [
      { name: 'Water quality', engine: 'Delft3D-WAQ', lens: 'Clarity and condition against the activity threshold' },
      { name: 'Ocean current', engine: 'Delft3D-FLOW', lens: 'Current and flushing condition' },
      { name: 'Wave', engine: 'SWAN', lens: 'Sea state and coastal exposure' },
      { name: 'Coral reef', engine: 'ReefMod-GBR + NOAA DHW', lens: 'Bleaching risk on the DHW scale' },
    ],
    MO: [
      { name: 'Wind', engine: 'WRF + CFD', lens: 'Marine wind window, small-craft limit, mooring exposure' },
      { name: 'Water quality', engine: 'Delft3D-WAQ', lens: 'Dive-site clarity, DO, and activity' },
      { name: 'Coral reef', engine: 'ReefMod-GBR + NOAA DHW', lens: 'Bleaching risk, closure trigger, anchor risk' },
    ],
  },
}

export function SimGrid() {
  return (
    <div className="not-prose" style={{ margin: '24px 0' }}>
      {DOMAIN_ORDER.map((domain) => {
        const personasInDomain = PERSONA_ORDER.filter(
          (p) => (SIM_GRID[domain][p]?.length ?? 0) > 0
        )
        return (
          <div
            key={domain}
            style={{
              border: '1px solid hsl(var(--border))',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '14px',
            }}
          >
            {/* Domain header */}
            <div
              style={{
                padding: '12px 16px',
                background: 'hsl(var(--muted) / 0.5)',
                borderBottom: '1px solid hsl(var(--border))',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'hsl(var(--foreground))',
                  letterSpacing: '0.01em',
                }}
              >
                {domain}
              </span>
            </div>

            {/* Persona rows */}
            <div>
              {personasInDomain.map((persona, pi) => (
                <div
                  key={persona}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr',
                    gap: '0',
                    borderTop: pi === 0 ? 'none' : '1px solid hsl(var(--border))',
                  }}
                >
                  {/* Persona label cell */}
                  <div
                    style={{
                      padding: '14px 16px',
                      borderRight: '1px solid hsl(var(--border))',
                      background: 'hsl(var(--background))',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'hsl(var(--foreground))',
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {PERSONA_LABEL[persona]}
                    </p>
                    <p
                      style={{
                        fontSize: '10px',
                        color: 'hsl(var(--muted-foreground))',
                        margin: '2px 0 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {persona}
                    </p>
                  </div>

                  {/* Sims cell */}
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {SIM_GRID[domain][persona]!.map((sim) => (
                      <div key={sim.name}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(var(--foreground))' }}>
                            {sim.name}
                          </span>
                          {ENGINE_URL[sim.engine] ? (
                            <a
                              href={ENGINE_URL[sim.engine]}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontSize: '10px',
                                color: 'hsl(var(--muted-foreground))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '4px',
                                padding: '1px 6px',
                                whiteSpace: 'nowrap',
                                textDecoration: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              {sim.engine}
                            </a>
                          ) : (
                            <span
                              style={{
                                fontSize: '10px',
                                color: 'hsl(var(--muted-foreground))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '4px',
                                padding: '1px 6px',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {sim.engine}
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: '12px',
                            color: 'hsl(var(--muted-foreground))',
                            margin: '3px 0 0',
                            lineHeight: 1.45,
                          }}
                        >
                          {sim.lens}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
