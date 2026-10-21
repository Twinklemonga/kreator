// Hand-rolled SVG charts - no extra npm packages needed.
export function BarChart({ data, height = 180 }) {
  // data: [{ label, value, color? }]
  const max = Math.max(...data.map(d => d.value), 1)
  const w = 100 / data.length
  return (
    <div>
    <svg viewBox={`0 0 100 ${height / 2}`} className="chart" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#962fbf" />
          <stop offset="55%" stopColor="#d62976" />
          <stop offset="100%" stopColor="#fa7e1e" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const h = (d.value / max) * (height / 2 - 8)
        return (
          <g key={i}>
            <rect x={i * w + w * 0.2} y={height / 2 - h} width={w * 0.6} height={h} rx="2"
              fill={d.color || 'url(#barGrad)'} opacity="0.95" />
          </g>
        )
      })}
    </svg>
    <div className="chart-x">{data.map((d, i) => <span key={i}>{d.label}</span>)}</div>
    </div>
  )
}

export function AreaChart({ data, height = 180 }) {
  // data: [{ label, value }]
  const max = Math.max(...data.map(d => d.value), 1)
  const W = 100, H = 40
  const pts = data.map((d, i) => [
    data.length === 1 ? W / 2 : (i / (data.length - 1)) * W,
    H - 4 - (d.value / max) * (H - 12),
  ])
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const area = line + ` L ${W} ${H} L 0 ${H} Z`
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d62976" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d62976" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaGrad)" />
        <path d={line} fill="none" stroke="#e1306c" strokeWidth="0.8" strokeLinecap="round" />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="1" fill="#e1306c" />)}
      </svg>
      <div className="chart-x">{data.map((d, i) => <span key={i}>{d.label}</span>)}</div>
    </div>
  )
}

export function Donut({ data, size = 140 }) {
  // data: [{ label, value, color }]
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let acc = 0
  const R = 15.9155 // circumference = 100
  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 42 42" style={{ width: size, height: size }}>
        <circle cx="21" cy="21" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        {data.map((d, i) => {
          const frac = (d.value / total) * 100
          const el = (
            <circle key={i} cx="21" cy="21" r={R} fill="none" stroke={d.color} strokeWidth="6"
              strokeDasharray={`${frac} ${100 - frac}`} strokeDashoffset={25 - acc} strokeLinecap="butt" />
          )
          acc += frac
          return el
        })}
      </svg>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div key={i}><span className="dot" style={{ background: d.color }} />{d.label} <b>{d.value}</b></div>
        ))}
      </div>
    </div>
  )
}
