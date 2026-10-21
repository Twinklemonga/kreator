import { useState } from 'react'
import { useStore, STAGES, STAGE_COLORS, inr } from '../store.js'

export default function Deals() {
  const [deals, setDeals] = useStore('deals', [])
  const [f, setF] = useState({ brand: '', amount: '', stage: 'Pitched', platform: 'Instagram' })

  const add = (e) => {
    e.preventDefault()
    if (!f.brand.trim()) return
    setDeals([...deals, {
      id: Date.now(), brand: f.brand.trim(), amount: Number(f.amount) || 0,
      stage: f.stage, platform: f.platform, month: new Date().toISOString().slice(0, 7),
    }])
    setF({ brand: '', amount: '', stage: 'Pitched', platform: 'Instagram' })
  }
  const move = (id, stage) => {
    const patch = { stage }
    if (stage === 'Paid') patch.month = new Date().toISOString().slice(0, 7)
    setDeals(deals.map(d => (d.id === id ? { ...d, ...patch } : d)))
  }
  const del = (id) => setDeals(deals.filter(d => d.id !== id))
  const earned = deals.filter(d => d.stage === 'Paid').reduce((s, d) => s + d.amount, 0)
  const pipeline = deals.filter(d => d.stage !== 'Paid').reduce((s, d) => s + d.amount, 0)

  return (
    <div className="page">
      <h1>Brand deals 💼</h1>
      <p className="muted">Paid so far: <b className="green">{inr(earned)}</b> · In the pipeline: <b className="orange">{inr(pipeline)}</b></p>

      <form onSubmit={add} className="glass row-form">
        <input placeholder="Brand name" value={f.brand} onChange={e => setF({ ...f, brand: e.target.value })} />
        <input placeholder="Amount ₹" type="number" value={f.amount} onChange={e => setF({ ...f, amount: e.target.value })} />
        <select value={f.platform} onChange={e => setF({ ...f, platform: e.target.value })}>
          {['Instagram', 'Reels', 'YouTube', 'Blog', 'Other'].map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={f.stage} onChange={e => setF({ ...f, stage: e.target.value })}>
          {STAGES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="btn primary">+ Add deal</button>
      </form>

      <div className="board">
        {STAGES.map(s => (
          <div key={s} className="col">
            <h4 style={{ color: STAGE_COLORS[s] }}>{s} <span className="count">{deals.filter(d => d.stage === s).length}</span></h4>
            {deals.filter(d => d.stage === s).map(d => (
              <div key={d.id} className="glass deal-card" style={{ borderTop: `3px solid ${STAGE_COLORS[s]}` }}>
                <b>{d.brand}</b>
                <div className="deal-amt">{inr(d.amount)}</div>
                <span className="chip">{d.platform}</span>
                <select value={d.stage} onChange={e => move(d.id, e.target.value)}>
                  {STAGES.map(x => <option key={x}>{x}</option>)}
                </select>
                <button className="link danger" onClick={() => del(d.id)}>delete</button>
              </div>
            ))}
            {deals.filter(d => d.stage === s).length === 0 && <div className="empty">Drop deals here as they move</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
