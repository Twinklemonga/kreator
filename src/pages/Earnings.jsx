import { useStore, STAGE_COLORS, inr } from '../store.js'
import { BarChart, AreaChart, Donut } from '../charts.jsx'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Earnings() {
  const [deals] = useStore('deals', [])
  const paid = deals.filter(d => d.stage === 'Paid')

  const series = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i)
    const key = d.toISOString().slice(0, 7)
    series.push({ label: MONTHS[d.getMonth()], value: paid.filter(x => x.month === key).reduce((s, x) => s + x.amount, 0) })
  }
  const total = paid.reduce((s, d) => s + d.amount, 0)
  const pending = deals.filter(d => ['Confirmed', 'Delivered'].includes(d.stage))
  const pendingSum = pending.reduce((s, d) => s + d.amount, 0)
  const best = Math.max(...series.map(s => s.value))

  const byPlatform = {}
  paid.forEach(d => { byPlatform[d.platform] = (byPlatform[d.platform] || 0) + d.amount })
  const platColors = ['#ff2e9a', '#a78bfa', '#fb7185', '#38bdf8', '#34d399']
  const donut = Object.entries(byPlatform).map(([label, value], i) => ({ label, value, color: platColors[i % platColors.length] }))

  return (
    <div className="page">
      <h1>Earnings 📈</h1>
      <div className="stat-grid">
        <div className="glass stat s1"><span>💰</span><div><small>Total earned</small><b>{inr(total)}</b></div></div>
        <div className="glass stat s2"><span>⏳</span><div><small>Pending from brands</small><b>{inr(pendingSum)}</b></div></div>
        <div className="glass stat s3"><span>🏆</span><div><small>Best month</small><b>{inr(best)}</b></div></div>
        <div className="glass stat s4"><span>🤝</span><div><small>Paid collabs</small><b>{paid.length}</b></div></div>
      </div>

      <div className="glass panel">
        <h3>Monthly income</h3>
        <BarChart data={series} height={200} />
      </div>

      <div className="grid-2">
        <div className="glass panel">
          <h3>Income trend</h3>
          <AreaChart data={series} height={160} />
        </div>
        <div className="glass panel">
          <h3>Where the money comes from</h3>
          {donut.length ? <Donut data={donut} /> : <p className="muted">No paid deals yet.</p>}
        </div>
      </div>

      <div className="glass panel">
        <h3>Waiting on these brands ⏳</h3>
        {pending.length === 0 && <p className="muted">Nothing pending. Nice!</p>}
        {pending.map(d => (
          <div key={d.id} className="upcoming-item">
            <span className="dot" style={{ background: STAGE_COLORS[d.stage] }} />
            <b>{d.brand}</b><span className="muted">{d.stage}</span><span className="orange">{inr(d.amount)}</span>
          </div>
        ))}
        {pending.length > 0 && <p className="muted tiny">Tip: send a payment reminder from Pitch templates → "Payment reminder".</p>}
      </div>
    </div>
  )
}
