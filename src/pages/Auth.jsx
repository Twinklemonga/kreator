import { useState } from 'react'
import { signUp, logIn, googleSignIn } from '../store.js'
import { authReady } from '../supabaseClient.js'

export default function Auth({ mode, onAuth, goHome, switchMode }) {
  const isLogin = mode === 'login'
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setInfo(''); setBusy(true)
    const r = isLogin
      ? await logIn(f.email.trim(), f.password)
      : await signUp(f.name.trim(), f.email.trim(), f.password)
    setBusy(false)
    if (r.error) return setErr(r.error)
    if (r.info) return setInfo(r.info)
    onAuth(r.user)
  }

  const google = async () => {
    setErr(''); setBusy(true)
    const r = await googleSignIn()
    setBusy(false)
    if (r?.error) setErr(r.error)
    // otherwise the browser is redirecting to Google
  }

  return (
    <div className="auth-page">
      <button className="link back" onClick={goHome}>← Back to home</button>
      <div className="glass auth-card">
        <div className="logo center">Kreator<span>.</span></div>
        <h2>{isLogin ? 'Welcome back 👋' : 'Join Kreator 🚀'}</h2>
        <p className="muted">{isLogin ? 'Log in to your creator HQ.' : 'Your creator HQ is 30 seconds away.'}</p>

        {!authReady && (
          <div className="error">
            Login is not connected yet — the Supabase keys are missing.
            Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart / redeploy.
          </div>
        )}

        <button className="btn google full" onClick={google} disabled={busy || !authReady}>
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
            <input type="password" required minLength={6} value={f.password} onChange={e => setF({ ...f, password: e.target.value })} placeholder="At least 6 characters" />
          </label>
          {err && <div className="error">{err}</div>}
          {info && <div className="info">{info}</div>}
          <button className="btn primary full big" disabled={busy || !authReady}>
            {busy ? 'One sec…' : isLogin ? 'Log in' : 'Create account'}
          </button>
        </form>

        <p className="muted switch">
          {isLogin ? <>New here? <button className="link" onClick={() => switchMode('signup')}>Create an account</button></>
                   : <>Have an account? <button className="link" onClick={() => switchMode('login')}>Log in</button></>}
        </p>
        <small className="muted tiny">Accounts are secured by Supabase — one login works on every device.</small>
      </div>
    </div>
  )
}
