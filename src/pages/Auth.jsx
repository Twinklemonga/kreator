import { useState } from 'react'
import { signUp, logIn, googleSignIn } from '../store.js'

export default function Auth({ mode, onAuth, goHome, switchMode }) {
  const isLogin = mode === 'login'
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const r = isLogin ? logIn(f.email.trim(), f.password) : signUp(f.name.trim() || 'Creator', f.email.trim(), f.password)
    if (r.error) return setErr(r.error)
    onAuth(r.user)
  }
  const google = () => { const r = googleSignIn(); onAuth(r.user) }

  return (
    <div className="auth-page">
      <button className="link back" onClick={goHome}>← Back to home</button>
      <div className="glass auth-card">
        <div className="logo center">Kreator<span>.</span></div>
        <h2>{isLogin ? 'Welcome back 👋' : 'Join Kreator 🚀'}</h2>
        <p className="muted">{isLogin ? 'Log in to your creator HQ.' : 'Your creator HQ is 30 seconds away.'}</p>

        <button className="btn google full" onClick={google}>
          <span className="g">G</span> Continue with Google
        </button>
        <div className="divider"><span>or with email</span></div>

        <form onSubmit={submit}>
          {!isLogin && (
            <label>Your name
              <input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="e.g. Twinkle" />
            </label>
          )}
          <label>Email
            <input type="email" required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="you@example.com" />
          </label>
          <label>Password
            <input type="password" required minLength={4} value={f.password} onChange={e => setF({ ...f, password: e.target.value })} placeholder="••••••" />
          </label>
          {err && <div className="error">{err}</div>}
          <button className="btn primary full big">{isLogin ? 'Log in' : 'Create account'}</button>
        </form>

        <p className="muted switch">
          {isLogin ? <>New here? <button className="link" onClick={() => switchMode('signup')}>Create an account</button></>
                   : <>Have an account? <button className="link" onClick={() => switchMode('login')}>Log in</button></>}
        </p>
        <small className="muted tiny">Demo build: accounts are stored in this browser only.</small>
      </div>
    </div>
  )
}
