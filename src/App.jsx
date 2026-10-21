import { useState } from 'react'
import { currentUser, logOut } from './store.js'
import Landing from './pages/Landing.jsx'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  const [user, setUser] = useState(currentUser())
  const [view, setView] = useState('landing') // landing | login | signup

  if (user) {
    return (
      <Dashboard
        user={user}
        onLogout={() => { logOut(); setUser(null); setView('landing') }}
      />
    )
  }
  if (view === 'login' || view === 'signup') {
    return <Auth mode={view} onAuth={setUser} goHome={() => setView('landing')} switchMode={setView} />
  }
  return <Landing onLogin={() => setView('login')} onSignup={() => setView('signup')} />
}
