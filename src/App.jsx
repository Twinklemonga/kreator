import { useEffect, useState } from 'react'

const RAZORPAY_LINK = import.meta.env.VITE_RAZORPAY_LINK || '#'
const STAGES = ['Pitched', 'Negotiating', 'Confirmed', 'Delivered', 'Paid']
const PLATFORMS = ['Instagram', 'YouTube', 'Shorts/Reels']

function useStore(key, initial) {
  const [v, setV] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial } catch { return initial }
  })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(v)) }, [key, v])
  return [v, setV]
}

function Deals() {
  const [deals, setDeals] = useStore('kr_deals', [])
  const [f, setF] = useState({ brand: '', amount: '', stage: 'Pitched' })
  const add = (e) => {
    e.preventDefault()
    if (!f.brand) return
    setDeals([...deals, { id: Date.now(), ...f, amount: Number(f.amount) || 0 }])
    setF({ brand: '', amount: '', stage: 'Pitched' })
  }
  const move = (id, stage) => setDeals(deals.map(d => d.id === id ? { ...d, stage } : d))
  const del = (id) => setDeals(deals.filter(d => d.id !== id))
  const total = deals.filter(d => d.stage === 'Paid').reduce((s, d) => s + d.amount, 0)
  return (
    <section>
      <h2>Brand deals</h2>
      <p className="muted">Earned so far: <b>₹{total.toLocaleString('en-IN')}</b></p>
      <form onSubmit={add} className="row">
        <input placeholder="Brand name" value={f.brand} onChange={e => setF({ ...f, brand: e.target.value })} />
        <input placeholder="Amount ₹" type="number" value={f.amount} onChange={e => setF({ ...f, amount: e.target.value })} />
        <select value={f.stage} onChange={e => setF({ ...f, stage: e.target.value })}>{STAGES.map(s => <option key={s}>{s}</option>)}</select>
        <button>Add deal</button>
      </form>
      <div className="board">
        {STAGES.map(s => (
          <div key={s} className="col">
            <h4>{s}</h4>
            {deals.filter(d => d.stage === s).map(d => (
              <div key={d.id} className="card">
                <b>{d.brand}</b><div>₹{d.amount.toLocaleString('en-IN')}</div>
                <select value={d.stage} onChange={e => move(d.id, e.target.value)}>{STAGES.map(x => <option key={x}>{x}</option>)}</select>
                <button className="link" onClick={() => del(d.id)}>delete</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function Pricing() {
  const [followers, setFollowers] = useState(20000)
  const [er, setEr] = useState(4)
  const [type, setType] = useState('Reel')
  const mult = { Reel: 1, Story: 0.4, Post: 0.8, YouTube: 2 }[type]
  const base = (followers / 1000) * 200 * (1 + er / 10) * mult
  const low = Math.round(base * 0.8 / 100) * 100
  const high = Math.round(base * 1.3 / 100) * 100
  const fmt = n => '₹' + n.toLocaleString('en-IN')
  return (
    <section>
      <h2>Pricing helper</h2>
      <p className="muted">A rough rate range. Use it as a starting point in negotiations.</p>
      <div className="row">
        <label>Followers<input type="number" value={followers} onChange={e => setFollowers(+e.target.value)} /></label>
        <label>Engagement %<input type="number" value={er} onChange={e => setEr(+e.target.value)} /></label>
        <label>Deliverable<select value={type} onChange={e => setType(e.target.value)}>{['Reel', 'Story', 'Post', 'YouTube'].map(t => <option key={t}>{t}</option>)}</select></label>
      </div>
      <div className="big">Quote: {fmt(low)} to {fmt(high)}</div>
      <p className="muted">Counter-offer script: "Thanks for the offer! For a {type.toLowerCase()} with my {er}% engagement, my rate is {fmt(high)}. I can do {fmt(Math.round((low + high) / 2 / 100) * 100)} if we add usage for 30 days."</p>
    </section>
  )
}

function Calendar() {
  const [items, setItems] = useStore('kr_posts', [])
  const [f, setF] = useState({ date: '', title: '', platform: PLATFORMS[0] })
  const add = (e) => {
    e.preventDefault()
    if (!f.date || !f.title) return
    setItems([...items, { id: Date.now(), ...f, done: false }].sort((a, b) => a.date.localeCompare(b.date)))
    setF({ date: '', title: '', platform: PLATFORMS[0] })
  }
  return (
    <section>
      <h2>Content calendar</h2>
      <form onSubmit={add} className="row">
        <input type="date" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} />
        <input placeholder="Post idea" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
        <select value={f.platform} onChange={e => setF({ ...f, platform: e.target.value })}>{PLATFORMS.map(p => <option key={p}>{p}</option>)}</select>
        <button>Schedule</button>
      </form>
      <ul className="list">
        {items.map(i => (
          <li key={i.id} className={i.done ? 'done' : ''}>
            <input type="checkbox" checked={i.done} onChange={() => setItems(items.map(x => x.id === i.id ? { ...x, done: !x.done } : x))} />
            <span><b>{i.date}</b> · {i.title} <em>({i.platform})</em></span>
            <button className="link" onClick={() => setItems(items.filter(x => x.id !== i.id))}>delete</button>
          </li>
        ))}
        {!items.length && <li className="muted">Nothing scheduled yet.</li>}
      </ul>
    </section>
  )
}

const TEMPLATES = {
  'Brand pitch': 'Hi {brand} team, I\'m {name}, a creator with {followers} followers in the {niche} space. My audience matches your customers and I\'d love to create a Reel for you. My rates start at ₹{rate}. Can we set up a quick chat?',
  'Rate negotiation': 'Thanks for the offer! Based on my engagement and past results, my rate for this deliverable is ₹{rate}. I\'m happy to adjust the scope to fit your budget.',
  'Payment reminder': 'Hi {brand} team, a gentle reminder that the invoice for our collaboration is due. Could you share the payment status? Thank you!',
  'PR / gifting reply': 'Thank you for the products! I\'d love to try them. Do you have a paid collaboration in mind, or is this a gifting-only campaign? My paid rates start at ₹{rate}.'
}

function Templates() {
  const [k, setK] = useState(Object.keys(TEMPLATES)[0])
  const [v, setV] = useState({ brand: 'Brand', name: 'Your name', followers: '20k', niche: 'fashion', rate: '5000' })
  const text = TEMPLATES[k].replace(/\{(\w+)\}/g, (_, x) => v[x] ?? '')
  const [copied, setCopied] = useState(false)
  return (
    <section>
      <h2>Message templates</h2>
      <div className="row">
        <select value={k} onChange={e => setK(e.target.value)}>{Object.keys(TEMPLATES).map(t => <option key={t}>{t}</option>)}</select>
        {Object.keys(v).map(x => <label key={x}>{x}<input value={v[x]} onChange={e => setV({ ...v, [x]: e.target.value })} /></label>)}
      </div>
      <textarea readOnly value={text} rows={5} />
      <button onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}>{copied ? 'Copied!' : 'Copy message'}</button>
    </section>
  )
}

function Landing({ onStart }) {
  return (
    <div className="hero">
      <h1>Kreator</h1>
      <p className="tag">Your creator CRM. Skip the social media manager.</p>
      <p>Built for Indian creators with 10k to 100k followers. Track brand deals, price your work, plan content and send professional messages in minutes.</p>
      <div className="feat">
        <div>🤝 Brand deal pipeline</div><div>💰 Pricing helper</div><div>📅 Content calendar</div><div>✉️ Message templates</div>
      </div>
      <div className="price">₹60<span>/month</span></div>
      <a className="btn" href={RAZORPAY_LINK} target="_blank" rel="noreferrer">Subscribe with Razorpay</a>
      <button className="btn ghost" onClick={onStart}>Try the app free</button>
    </div>
  )
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [tab, setTab] = useState('Deals')
  if (!started) return <Landing onStart={() => setStarted(true)} />
  const tabs = { Deals: <Deals />, Pricing: <Pricing />, Calendar: <Calendar />, Templates: <Templates /> }
  return (
    <div className="app">
      <header><b onClick={() => setStarted(false)} style={{ cursor: 'pointer' }}>Kreator</b>
        <nav>{Object.keys(tabs).map(t => <button key={t} className={t === tab ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</nav>
        <a className="btn small" href={RAZORPAY_LINK} target="_blank" rel="noreferrer">₹60/mo</a>
      </header>
      <main>{tabs[tab]}</main>
    </div>
  )
}
