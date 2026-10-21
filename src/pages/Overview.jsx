import { useStore, STAGES, STAGE_COLORS, inr } from '../store.js'
import { AreaChart, Donut } from '../charts.jsx'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Overview({ user, go }) {
  const [deals] = useStore('deals', [])
  const [posts] = useStore('posts', [])

  const thisMonth = new Date().toISOString().slice(0, 7)
  const earned = deals.filter(d => d.stage === 'Paid' && d.month === thisMonth).reduce((s, d) => s + d.amount, 0)
  const pending = deals.filter(d => ['Confirmed', 'Delivered'].includes(d.stage)).reduce((s, d) => s + d.amount, 0)
  const active = deals.filter(d => d.stage !== 'Paid').length

  // last 6 months earnings graph
  const series = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i)
    const key = d.toISOString().slice(0, 7)
    series.push({
      label: MONTHS[d.getMonth()],
      value: deals.filter(x => x.stage === 'Paid' && x.month === key).reduce((s, x) => s + x.amount, 0),
    })
  }
  const donut = STAGES.map(s => ({ label: s, value: deals.filter(d => d.stage === s).length, color: STAGE_COLORS[s] }))
  const upcoming = [...posts].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4)

  return (
    <div className="page">
      <h1>Namaste, {user.name.split(' ')[0]} 👋</h1>
      <p className="muted">Here is your creator business at a glance.</p>

      <div className="stat-grid">
        <div className="glass stat s1"><span>💰</span><div><small>Earned this month</small><b>{inr(earned)}</b></div></div>
        <div className="glass stat s2"><span>⏳</span><div><small>Payments pending</small><b>{inr(pending)}</b></div></div>
        <div className="glass stat s3"><span>💼</span><div><small>Active deals</small><b>{active}</b></div></div>
        <div className="glass stat s4"><span>📅</span><div><small>Posts planned</small><b>{posts.length}</b></div></div>
      </div>

      <div className="grid-2">
        <div className="glass panel">
          <div className="panel-head"><h3>Earnings, last 6 months</h3><button className="link" onClick={() => go('earnings')}>details →</button></div>
          <AreaChart data={series} />
        </div>
        <div className="glass panel">
          <div className="panel-head"><h3>Deal pipeline</h3><button className="link" onClick={() => go('deals')}>board →</button></div>
          <Donut data={donut} />
        </div>
      </div>

      <div className="glass panel">
        <div className="panel-head"><h3>Coming up on your calendar</h3><button className="link" onClick={() => go('calendar')}>calendar →</button></div>
        {upcoming.length === 0 && <p className="muted">Nothing planned yet. Add your next post in the calendar.</p>}
        <div className="upcoming">
          {upcoming.map(p => (
            <div key={p.id} className="upcoming-item">
              <span className="chip">{p.platform}</span>
              <b>{p.title}</b>
              <span className="muted">{p.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
