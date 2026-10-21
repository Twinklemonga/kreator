import { useState } from 'react'
import { useStore } from '../store.js'

const build = (u, c) => [
  {
    id: 'cold-dm', icon: '📩', name: 'Cold DM to a brand',
    text: `Hi {brand} team! 👋 I'm ${u.name}, a ${c.niche || 'lifestyle'} creator with ${(c.followers || 0).toLocaleString('en-IN')} followers and ${c.er || 0}% engagement. My audience is exactly your customer. I have 3 reel ideas for your upcoming launch - can I share them here?`,
  },
  {
    id: 'email-pitch', icon: '✉️', name: 'Email pitch',
    text: `Subject: Collab idea for {brand} x ${u.name}\n\nHi {brand} team,\n\nI'm ${u.name}, a ${c.niche || 'lifestyle'} creator (${(c.followers || 0).toLocaleString('en-IN')} followers, ${c.er || 0}% engagement). I love your products and already use [product].\n\nIdea: a 3-part reel series showing [product] in my daily routine, ending with an honest review. My last brand reel got [X] views.\n\nCan I send over my media kit and rates?\n\nBest,\n${u.name}`,
  },
  {
    id: 'follow-up', icon: '🔁', name: 'Follow-up after no reply',
    text: `Hi {brand} team, just bumping this up 😊 I know inboxes get busy. The reel ideas I mentioned are still fresh, and I have slots open next week. Worth a quick chat?`,
  },
  {
    id: 'rate-negotiation', icon: '💬', name: 'Rate negotiation',
    text: `Thanks for the offer! Based on my engagement (${c.er || 0}%) and past campaign results, my rate for this deliverable is ₹[your rate]. That includes concept, shoot, edit and one revision round. If budget is tight, we can adjust the deliverables instead of the quality. What works?`,
  },
  {
    id: 'payment-reminder', icon: '⏰', name: 'Payment reminder',
    text: `Hi {brand} team, hope all's well! The deliverables for our collab went live on [date] and invoice #[number] of ₹[amount] was shared on [date]. Could you share the payment status? My payment terms are 30 days. Thanks!`,
  },
  {
    id: 'ugc', icon: '🎥', name: 'UGC pitch',
    text: `Hi {brand}! I create UGC content for brands - you get ready-to-post videos without hiring an agency. I can deliver 3 concepts in 7 days. My portfolio: [link]. Can I send samples in your niche?`,
  },
]

// Offline generator: used when no AI key is set or the network fails.
function offlinePitch(ai, u, c) {
  const brand = ai.brand || '[Brand]'
  const product = ai.product || 'your products'
  const d = ai.deliverable || '1 Instagram Reel'
  const me = `${u.name}, a ${c.niche || 'lifestyle'} creator with ${(c.followers || 0).toLocaleString('en-IN')} followers and ${c.er || 0}% engagement`
  const notes = ai.notes ? ` ${ai.notes.trim()}` : ''
  const tones = {
    Friendly: `Hi ${brand} team! 👋 I'm ${me}. I've been using ${product} and my audience keeps asking about it. I'd love to create ${d} for you - honest, aesthetic, made for reels culture.${notes} Can I share 2-3 content ideas this week?`,
    Professional: `Hello ${brand} team,\n\nI'm ${me}. My audience closely matches your target customer, and I see strong fit for ${product}.\n\nProposal: ${d} - concept, shoot, edit and one revision round, delivered in 7 days.${notes}\n\nMay I share my media kit and a few concepts?`,
    Bold: `${brand} 👀 your ${product} deserves better reels. I'm ${me}, and my content gets saved and shared, not just liked. Give me ${d} and 7 days.${notes} 10 minutes for a quick call?`,
  }
  return tones[ai.tone] || tones.Friendly
}

export default function Templates({ user }) {
  const [card] = useStore('ratecard', { followers: 20000, er: 4, niche: 'Lifestyle' })
  const [brand, setBrand] = useState('Nykaa')
  const [copiedId, setCopiedId] = useState(null)
  const list = build(user, card)

  const [ai, setAi] = useState({ brand: '', product: '', deliverable: '1 Instagram Reel', tone: 'Friendly', notes: '' })
  const [gen, setGen] = useState('')
  const [busy, setBusy] = useState(false)
  const [usedAI, setUsedAI] = useState(false)

  const generate = async () => {
    setBusy(true); setGen(''); setUsedAI(false)
    try {
      const r = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ai, creator: { name: user.name, ...card } }),
      })
      const j = await r.json()
      if (j.text) { setGen(j.text); setUsedAI(true) } else { setGen(offlinePitch(ai, user, card)) }
    } catch {
      setGen(offlinePitch(ai, user, card))
    }
    setBusy(false)
  }

  const copyText = (id, text) => {
    navigator.clipboard?.writeText(text)
    setCopiedId(id); setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="page">
      <h1>Pitch templates ✉️</h1>
      <p className="muted">Auto-filled with your rate card. Type the brand name, then copy.</p>

      <div className="glass panel ai-panel">
        <h3>🤖 AI pitch studio</h3>
        <p className="muted tiny">Describe the collab in your own words - get a ready-to-send pitch.</p>
        <div className="ai-grid">
          <label>Brand<input value={ai.brand} onChange={e => setAi({ ...ai, brand: e.target.value })} placeholder="e.g. Nykaa" /></label>
          <label>Product / campaign<input value={ai.product} onChange={e => setAi({ ...ai, product: e.target.value })} placeholder="e.g. new lipstick range" /></label>
          <label>Deliverable
            <select value={ai.deliverable} onChange={e => setAi({ ...ai, deliverable: e.target.value })}>
              {['1 Instagram Reel', '1 Reel + 2 Stories', '3 Reels package', '1 YouTube video', 'UGC bundle'].map(d => <option key={d}>{d}</option>)}
            </select>
          </label>
          <label>Tone
            <select value={ai.tone} onChange={e => setAi({ ...ai, tone: e.target.value })}>
              {['Friendly', 'Professional', 'Bold'].map(t => <option key={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <label>Anything else? (your idea, deadline, past work...)
          <input value={ai.notes} onChange={e => setAi({ ...ai, notes: e.target.value })} placeholder="e.g. I did a reel for Plum that got 80k views" />
        </label>
        <button className="btn primary" onClick={generate} disabled={busy}>
          {busy ? 'Writing your pitch... ✨' : '✨ Generate my pitch'}
        </button>
        {gen && (
          <div className="ai-result">
            <pre>{gen}</pre>
            <button className="btn primary sm" onClick={() => copyText('ai', gen)}>
              {copiedId === 'ai' ? 'Copied! ✅' : 'Copy pitch'}
            </button>
            {!usedAI && <small className="muted tiny">Made with the built-in offline writer. Connect a Gemini key in Vercel (see GUIDE.md) for full AI.</small>}
            {usedAI && <small className="muted tiny">Written by AI ✨ - read it once before sending.</small>}
          </div>
        )}
      </div>

      <div className="glass row-form">
        <label style={{ flex: 1 }}>Brand you are pitching
          <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. Nykaa" />
        </label>
      </div>
      <div className="template-grid">
        {list.map(t => (
          <div key={t.id} className="glass template">
            <h3>{t.icon} {t.name}</h3>
            <pre>{t.text.replaceAll('{brand}', brand || '[Brand]')}</pre>
            <button className="btn primary sm" onClick={() => copyText(t.id, t.text.replaceAll('{brand}', brand || '[Brand]'))}>
              {copiedId === t.id ? 'Copied! ✅' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
