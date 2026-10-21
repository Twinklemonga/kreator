import { useState } from 'react'
import { useStore, inr } from '../store.js'

const MULT = { 'Instagram Reel': 1, 'Instagram Story': 0.35, 'Instagram Post': 0.7, 'YouTube video': 2.2, 'YouTube Short': 0.9, 'UGC (brand posts it)': 0.8 }

export default function Rates({ user }) {
  const [card, setCard] = useStore('ratecard', { followers: 20000, er: 4, niche: 'Lifestyle' })
  const [type, setType] = useState('Instagram Reel')
  const [copied, setCopied] = useState(false)

  const base = (card.followers / 1000) * 180 * (1 + card.er / 12) * MULT[type]
  const low = Math.round(base * 0.8 / 100) * 100
  const high = Math.round(base * 1.25 / 100) * 100

  const text = `Hi! I'm ${user.name}, a ${card.niche} creator with ${card.followers.toLocaleString('en-IN')} followers and ${card.er}% engagement. My rate for one ${type} is ${inr(low)} - ${inr(high)}. Happy to share my media kit!`

  return (
    <div className="page">
      <h1>Rate calculator 🏷️</h1>
      <p className="muted">Stop guessing your price. Charge from data, not vibes.</p>

      <div className="grid-2">
        <div className="glass panel">
          <label>Niche
            <select value={card.niche} onChange={e => setCard({ ...card, niche: e.target.value })}>
              {['Lifestyle', 'Fashion', 'Beauty', 'Food', 'Tech', 'Finance', 'Travel', 'Fitness', 'Comedy'].map(n => <option key={n}>{n}</option>)}
            </select>
          </label>
          <label>Followers: <b>{card.followers.toLocaleString('en-IN')}</b>
            <input type="range" min="1000" max="200000" step="1000" value={card.followers} onChange={e => setCard({ ...card, followers: Number(e.target.value) })} />
          </label>
          <label>Engagement rate: <b>{card.er}%</b>
            <input type="range" min="1" max="15" step="0.5" value={card.er} onChange={e => setCard({ ...card, er: Number(e.target.value) })} />
          </label>
          <label>Deliverable
            <select value={type} onChange={e => setType(e.target.value)}>
              {Object.keys(MULT).map(k => <option key={k}>{k}</option>)}
            </select>
          </label>
        </div>

        <div className="glass panel rate-result">
          <small className="muted">You should charge for one {type}</small>
          <div className="rate-big grad-text">{inr(low)} – {inr(high)}</div>
          <p className="muted">Creators with {card.er}% engagement can sit at the top of the range. Below {inr(low)}, you are underselling.</p>
          <button className="btn primary" onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}>
            {copied ? 'Copied! ✅' : 'Copy as pitch line'}
          </button>
        </div>
      </div>

      <div className="glass panel">
        <h3>Quick bundle ideas</h3>
        <div className="bundles">
          <div className="bundle"><b>Starter</b><span>1 Reel + 2 Stories</span><em>{inr(Math.round(base * 1.5 / 100) * 100)}</em></div>
          <div className="bundle"><b>Growth</b><span>3 Reels + 3 Stories</span><em>{inr(Math.round(base * 3.6 / 100) * 100)}</em></div>
          <div className="bundle"><b>Launch</b><span>4 Reels + YouTube integration</span><em>{inr(Math.round(base * 6.5 / 100) * 100)}</em></div>
        </div>
      </div>
    </div>
  )
}
