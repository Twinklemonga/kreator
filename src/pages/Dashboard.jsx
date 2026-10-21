import { useState } from 'react'
import Overview from './Overview.jsx'
import Deals from './Deals.jsx'
import Rates from './Rates.jsx'
import CalendarPage from './CalendarPage.jsx'
import Earnings from './Earnings.jsx'
import Templates from './Templates.jsx'
import Invoice from './Invoice.jsx'

const NAV = [
  { id: 'overview', icon: '🏠', label: 'Overview' },
  { id: 'deals', icon: '💼', label: 'Brand deals' },
  { id: 'rates', icon: '🏷️', label: 'Rate calculator' },
  { id: 'calendar', icon: '📅', label: 'Content calendar' },
  { id: 'earnings', icon: '📈', label: 'Earnings' },
  { id: 'templates', icon: '✉️', label: 'Pitch templates' },
  { id: 'invoice', icon: '🧾', label: 'Invoice maker' },
]

export default function Dashboard({ user, onLogout }) {
  const [page, setPage] = useState('overview')
  const pages = {
    overview: <Overview user={user} go={setPage} />,
    deals: <Deals />,
    rates: <Rates user={user} />,
    calendar: <CalendarPage />,
    earnings: <Earnings />,
    templates: <Templates user={user} />,
    invoice: <Invoice user={user} />,
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">Kreator<span>.</span></div>
        <nav>
          {NAV.map(n => (
            <button key={n.id} className={'nav-item' + (page === n.id ? ' active' : '')} onClick={() => setPage(n.id)}>
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="avatar"><span>{user.name[0].toUpperCase()}</span></div>
          <div>
            <b>{user.name}</b>
            <button className="link" onClick={onLogout}>Log out</button>
          </div>
        </div>
      </aside>
      <main className="main">{pages[page]}</main>
    </div>
  )
}
