import { useState } from 'react'
import { useStore, inr } from '../store.js'

export default function Invoice({ user }) {
  const [deals] = useStore('deals', [])
  const [f, setF] = useState({
    brand: '', service: '1 Instagram Reel + 2 Stories', amount: '',
    gst: false, due: '30', notes: '',
  })
  const amt = Number(f.amount) || 0
  const gstAmt = f.gst ? Math.round(amt * 0.18) : 0
  const total = amt + gstAmt
  const invNo = 'KRT-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 900) + 100)
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="page">
      <h1>Invoice maker 🧾</h1>
      <p className="muted">Fill the form, then hit Print / Save as PDF.</p>

      <div className="grid-2 no-print">
        <div className="glass panel">
          <label>Brand name
            <input list="brands" value={f.brand} onChange={e => setF({ ...f, brand: e.target.value })} placeholder="Who is paying you?" />
            <datalist id="brands">{deals.map(d => <option key={d.id} value={d.brand} />)}</datalist>
          </label>
          <label>Service / deliverables
            <input value={f.service} onChange={e => setF({ ...f, service: e.target.value })} />
          </label>
          <label>Amount (₹)
            <input type="number" value={f.amount} onChange={e => setF({ ...f, amount: e.target.value })} placeholder="12000" />
          </label>
          <label>Payment terms (days)
            <input type="number" value={f.due} onChange={e => setF({ ...f, due: e.target.value })} />
          </label>
          <label className="check">
            <input type="checkbox" checked={f.gst} onChange={e => setF({ ...f, gst: e.target.checked })} /> Add 18% GST
          </label>
          <label>Notes (optional)
            <input value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} placeholder="Bank details, UPI, PO number..." />
          </label>
          <button className="btn primary big full" onClick={() => window.print()}>🖨️ Print / Save as PDF</button>
        </div>

        <div className="invoice-preview-wrap">
          <div className="invoice-preview" id="invoice">
            <div className="inv-head">
              <div><div className="logo">Kreator<span>.</span></div><small>Invoice</small></div>
              <div className="inv-no">{invNo}<br /><small>{today}</small></div>
            </div>
            <div className="inv-parties">
              <div><small>From</small><b>{user.name}</b><div className="muted">{user.email}</div></div>
              <div><small>To</small><b>{f.brand || 'Brand name'}</b></div>
            </div>
            <table>
              <thead><tr><th>Service</th><th>Amount</th></tr></thead>
              <tbody>
                <tr><td>{f.service}</td><td>{inr(amt)}</td></tr>
                {f.gst && <tr><td>GST @ 18%</td><td>{inr(gstAmt)}</td></tr>}
                <tr className="total"><td>Total due</td><td>{inr(total)}</td></tr>
              </tbody>
            </table>
            <p className="muted tiny">Payment due within {f.due} days. {f.notes}</p>
            <p className="tiny center muted">Generated with Kreator · thekreator.in</p>
          </div>
        </div>
      </div>
    </div>
  )
}
