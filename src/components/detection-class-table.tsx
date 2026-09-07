export function DetectionClassTable() {
  const classes = [
    { layer: 'Buildings', detects: 'Completed structures with defined rooflines', color: 'Blue', hex: '#4A90E2' },
    { layer: 'BUC', detects: 'Buildings actively under construction', color: 'Amber', hex: '#F5A623' },
    { layer: 'Greenery', detects: 'Vegetation cover — parks, tree canopy, agricultural land', color: 'Green', hex: '#7ED321' },
    { layer: 'Roads', detects: 'New road construction, widening, or surface change', color: 'Red', hex: '#E84040' },
    { layer: 'CWaste', detects: 'Construction waste, bare earth, demolition debris', color: 'Purple', hex: '#9B59B6' },
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
