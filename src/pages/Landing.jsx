const RAZORPAY_LINK = import.meta.env.VITE_RAZORPAY_LINK || '#'

const FEATURES = [
  { icon: '💼', title: 'Brand deals pipeline', text: 'Track every collab from pitch to payment on one colourful board.' },
  { icon: '🏷️', title: 'Rate calculator', text: 'Know exactly what to charge from your followers and engagement.' },
  { icon: '📅', title: 'Content calendar', text: 'Plan posts, reels and videos. Never miss a posting day again.' },
  { icon: '📈', title: 'Earnings dashboard', text: 'See your income grow month on month with live graphs.' },
  { icon: '🤖', title: 'AI pitch studio', text: 'Type a prompt, get a brand-ready DM or email. Plus 6 ready-made templates.' },
  { icon: '🧾', title: 'Invoice generator', text: 'Professional GST invoices in seconds. Get paid on time.' },
]

export default function Landing({ onLogin, onSignup }) {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="logo">Kreator<span>.</span></div>
        <div>
          <button className="btn ghost" onClick={onLogin}>Log in</button>
          <button className="btn primary" onClick={onSignup}>Start free</button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-badge">✨ Your personal Social Media Manager✨</div>
        <h1>Your creator business,<br /><span className="grad-text">in one vibrant place.</span></h1>
        <p className="hero-sub">
          Kreator replaces an expensive social media manager. Brand deals, pricing,
          content planning and invoices — everything a 10k–100k creator needs, for ₹60/month.
        </p>
        <div className="hero-cta">
          <button className="btn primary big" onClick={onSignup}>Create your account →</button>
          <button className="btn ghost big" onClick={onLogin}>I already have one</button>
        </div>
        <div className="hero-cards">
          <div className="float-card c1">💼 Nykaa · ₹14,000<br /><small>Negotiating</small></div>
          <div className="float-card c2">📈 This month<br /><b>₹29,500</b></div>
          <div className="float-card c3">📅 Reel tomorrow<br /><small>9:00 AM</small></div>
        </div>
      </header>

      <section className="features">
        <h2>Everything a creator <span className="grad-text">actually does</span></h2>
        <div className="feature-grid">
          {FEATURES.map(f => (
            <div className="glass feature" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing">
        <div className="glass price-card">
          <div className="price-tag">One simple plan</div>
          <div className="price">₹60<small>/month</small></div>
          <ul>
            <li>✅ Unlimited brand deals &amp; pipeline</li>
            <li>✅ Rate card calculator</li>
            <li>✅ Content calendar &amp; reminders</li>
            <li>✅ Earnings graphs</li>
            <li>✅ Pitch templates &amp; invoices</li>
          </ul>
          <a className="btn primary big full" href={RAZORPAY_LINK} target="_blank" rel="noreferrer">Subscribe with Razorpay</a>
          <small className="muted">Less than one cutting chai a day ☕</small>
        </div>
      </section>

      <footer className="landing-footer">
        Made with 💜 for creators · <a href="https://www.thekreator.in">thekreator.in</a>
      </footer>
    </div>
  )
}
