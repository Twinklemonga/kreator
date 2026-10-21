import { useState } from 'react'
import { useStore } from '../store.js'

const PLAT_COLOR = { Instagram: '#d62976', Reels: '#962fbf', YouTube: '#fa7e1e', Blog: '#4f5bd5', Other: '#feda75' }

export default function CalendarPage() {
  const [posts, setPosts] = useStore('posts', [])
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [f, setF] = useState({ title: '', date: new Date().toISOString().slice(0, 10), platform: 'Instagram', type: 'Reel' })

  const year = cursor.getFullYear(), month = cursor.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const iso = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const on = (day) => posts.filter(p => p.date === iso(day))

  const add = (e) => {
    e.preventDefault()
    if (!f.title.trim()) return
    setPosts([...posts, { id: Date.now(), ...f, title: f.title.trim() }])
    setF({ ...f, title: '' })
  }
  const del = (id) => setPosts(posts.filter(p => p.id !== id))
  const monthName = cursor.toLocaleString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className="page">
      <h1>Content calendar 📅</h1>
      <form onSubmit={add} className="glass row-form">
        <input placeholder="Post idea (e.g. GRWM for Plum)" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
        <input type="date" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} />
        <select value={f.platform} onChange={e => setF({ ...f, platform: e.target.value })}>
          {Object.keys(PLAT_COLOR).map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={f.type} onChange={e => setF({ ...f, type: e.target.value })}>
          {['Reel', 'Story', 'Post', 'Video', 'Blog'].map(t => <option key={t}>{t}</option>)}
        </select>
        <button className="btn primary">+ Plan it</button>
      </form>

      <div className="glass panel">
        <div className="panel-head">
          <button className="btn ghost sm" onClick={() => setCursor(new Date(year, month - 1, 1))}>←</button>
          <h3>{monthName}</h3>
          <button className="btn ghost sm" onClick={() => setCursor(new Date(year, month + 1, 1))}>→</button>
        </div>
        <div className="cal-grid cal-head">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="cal-grid">
          {cells.map((d, i) => (
            <div key={i} className={'cal-cell' + (d ? '' : ' blank')}>
              {d && <small>{d}</small>}
              {d && on(d).map(p => (
                <div key={p.id} className="cal-post" style={{ background: PLAT_COLOR[p.platform] || '#888' }} title={`${p.title} (${p.type})`}>
                  {p.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="glass panel">
        <h3>All planned posts</h3>
        {[...posts].sort((a, b) => a.date.localeCompare(b.date)).map(p => (
          <div key={p.id} className="upcoming-item">
            <span className="chip" style={{ background: PLAT_COLOR[p.platform] }}>{p.platform}</span>
            <b>{p.title}</b><span className="muted">{p.type} · {p.date}</span>
            <button className="link danger" onClick={() => del(p.id)}>delete</button>
          </div>
        ))}
        {posts.length === 0 && <p className="muted">No posts planned yet.</p>}
      </div>
    </div>
  )
}
