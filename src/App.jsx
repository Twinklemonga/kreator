import { useEffect, useState } from 'react'
import { getInitialUser, onUserChange, setActiveUser, seedDemoData, logOut } from './store.js'
import Landing from './pages/Landing.jsx'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  const [user, setUserState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('landing') // landing | login | signup

  const applyUser = (u) => {
    if (u) seedDemoData(u.email)
    setActiveUser(u)
    setUserState(u)
  }

  useEffect(() => {
    // Returning from Google sign-in: wait for the auth event, not the first read.
    const expectingOAuth =
      window.location.search.includes('code=') || window.location.hash.includes('access_token')
    getInitialUser().then((u) => {
      if (u) applyUser(u)
      if (u || !expectingOAuth) setLoading(false)
    })
    const stop = onUserChange((u) => {
      applyUser(u)
      setLoading(false)
    })
    const safety = setTimeout(() => setLoading(false), 8000)
    return () => { stop(); clearTimeout(safety) }
  }, [])

  if (loading) {
    return (
      <div className="auth-page">
        <div className="logo center">Kreator<span>.</span></div>
        <p className="muted center">Loading your creator HQ…</p>
      </div>
    )
  }

  if (user) {
    return (
      <Dashboard
        user={user}
        onLogout={async () => { await logOut(); applyUser(null); setView('landing') }}
      />
    )
  }
  if (view === 'login' || view === 'signup') {
    return <Auth mode={view} onAuth={applyUser} goHome={() => setView('landing')} switchMode={setView} />
  }
  return <Landing onLogin={() => setView('login')} onSignup={() => setView('signup')} />
}
